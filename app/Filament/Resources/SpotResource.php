<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SpotResource\Pages;
use App\Filament\Resources\SpotResource\RelationManagers;
use App\Models\Spot;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Components\Toggle;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Actions\EditAction;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Storage;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Set; 
use Illuminate\Support\Str;
use Filament\Tables\Actions\ViewAction;



class SpotResource extends Resource
{
    protected static ?string $model = Spot::class;

    protected static ?string $navigationGroup = 'Data';
    protected static ?string $navigationIcon = 'heroicon-o-map-pin';

    public static function form(Form $form): Form
    {

        return $form
            ->schema([
                Forms\Components\Card::make([
                        Forms\Components\TextInput::make('name')
                        ->required()
                        ->maxLength(255)
                        ->live(onBlur: true) 
                        ->afterStateUpdated(fn (string $operation, $state, Set $set) => $set('slug', Str::slug($state))),
                    
                    Forms\Components\TextInput::make('slug')
                        ->required()
                        ->maxLength(255)
                        ->disabled() 
                        ->dehydrated(true), 
                    
                    Forms\Components\Select::make('category_id')
                        ->relationship('category', 'name')
                        ->label('Kategori')
                        ->searchable()
                        ->preload()
                        ->nullable(),
                        

                    Forms\Components\Select::make('spot_storage_id')
                        ->relationship('spotStorage', 'name')
                        ->label('Penyimpanan (Storage)')
                        ->searchable()
                        ->preload()
                        ->nullable(),
                        
                         Toggle::make('is_active')
                        ->label('Status Aktif')
                        ->helperText('Matikan atau hidupkan kategori ini.')
                        ->default(true)
                        ->onIcon('heroicon-m-check-badge')
                        ->offIcon('heroicon-m-x-circle')
                        ->inline(false),

                    FileUpload::make('geojson_file')
                        ->label('Upload File GeoJSON')
                        ->disk('s3')
                        ->directory('geojson_files')
                        ->maxSize(204800) // 200MB
                        ->enableDownload()
                        ->nullable()
                        ->deletable(),
                ])
                ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')->sortable(),
                Tables\Columns\TextColumn::make('name')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('slug'),

                // Kolom relasi di bawah ini akan cepat karena adanya Eager Loading
                Tables\Columns\TextColumn::make('category.name')
                    ->label('Kategori')
                    ->searchable()
                    ->sortable(),


                Tables\Columns\TextColumn::make('spotStorage.name')
                    ->label('Storage')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('geojson_file') 
                ->label('File GeoJSON')
                ->sortable()
                ->searchable()
                // --- PERBAIKAN DI SINI ---
                // Hapus ", true" dan gunakan method chaining ->openUrlInNewTab()
                ->url(fn ($record) => Storage::disk('s3')->url($record->geojson_file))
                ->openUrlInNewTab() 
                // -------------------------
                
                ->color('primary') 
                ->icon('heroicon-o-arrow-down-tray')
                ->formatStateUsing(fn ($state) => 'Download GeoJSON'),
                    
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category_id')
                    ->relationship('category', 'name')
                    ->label('Filter Kategori'),
            ])
            ->actions([
                ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }
    
    public static function getEloquentQuery(): Builder
    {
        $query = parent::getEloquentQuery()->with(['category', 'spotStorage']);

        $user = auth()->user();
        if ($user && !$user->is_admin) { 
            $allowedSpotIds = \App\Models\SpotPermission::where('user_id', $user->id)
                                                        ->where('can_access', true)
                                                        ->pluck('spot_id');

            $query->whereIn('id', $allowedSpotIds);
        }
        
        return $query;
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }
    
    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSpots::route('/'),
            // 'create' => Pages\CreateSpot::route('/create'),
            'view' => Pages\ViewSpot::route('/{record}'),
            'edit' => Pages\EditSpot::route('/{record}/edit'),
        ];
    }
}
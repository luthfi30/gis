<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CategoryResource\Pages;
use App\Filament\Resources\CategoryResource\RelationManagers;
use App\Models\Category;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\FileUpload; // Import FileUpload
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Components\Toggle;
use Filament\Tables\Columns\ColorColumn;
use Filament\Tables\Columns\ImageColumn; // Import ImageColumn
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Storage;
use Filament\Forms\Set; 
use Illuminate\Support\Str;


class CategoryResource extends Resource
{
    protected static ?string $model = Category::class;
    protected static ?string $navigationGroup = 'Data';
    protected static ?string $navigationIcon = 'heroicon-o-tag';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
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
                // --- PERUBAHAN DI SINI: MENGGANTI TextInput MENJADI FileUpload UNTUK 'icon' ---
                FileUpload::make('icon') // Menggunakan kolom 'icon' untuk menyimpan gambar
                    ->directory('category-images') // Folder penyimpanan di disk
                    ->image() // Memastikan hanya gambar yang diterima
                    ->disk('public') // Disk yang digunakan
                    ->maxSize(2048) // 2MB
                    ->label('Upload Gambar Ikon'),
                // --------------------------------------------------------------------------------
                Forms\Components\TextInput::make('type')
                    ->required()
                    ->maxLength(255),
                ColorPicker::make('color')
                    ->required()
                    ->default('#000000')
                    ->hex()
                    ->label('Warna Kategori'),
                Toggle::make('is_active')
                ->label('Status Aktif') // Label yang akan muncul di form
                ->helperText('Matikan atau hidupkan kategori ini.') // Teks bantuan opsional
                ->default(true) // Menetapkan nilai default saat membuat record baru
                ->onIcon('heroicon-m-check-badge') // Ikon saat ON (opsional)
                ->offIcon('heroicon-m-x-circle') // Ikon saat OFF (opsional)
                ->inline(false)
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('slug')
                    ->searchable(),
                // --- PERUBAHAN DI SINI: MENGGANTI TextColumn MENJADI ImageColumn UNTUK 'icon' ---
                ImageColumn::make('icon') // Menampilkan konten kolom 'icon' sebagai gambar
                    ->disk('public')
                    ->circular()
                    ->width(40)
                    ->height(40)
                    ->label('Ikon')
                    ->url(fn ($record): ?string => Storage::disk('public')->url($record->icon))
                ->openUrlInNewTab(),
                // --------------------------------------------------------------------------------
                Tables\Columns\TextColumn::make('type')
                    ->searchable(),
               ColorColumn::make('color')
                    ->label('Warna')
                    ->copyable()
                    ->tooltip(fn ($state): string => "Kode: $state")
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCategories::route('/'),
            // 'create' => Pages\CreateCategory::route('/create'),
            // 'edit' => Pages\EditCategory::route('/{record}/edit'),
        ];
    }
}
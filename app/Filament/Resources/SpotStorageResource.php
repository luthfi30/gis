<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SpotStorageResource\Pages;
use App\Filament\Resources\SpotStorageResource\RelationManagers;
use App\Models\SpotStorage;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Components\Toggle;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
// Import yang diperlukan
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Card;
use Illuminate\Support\Str;
use Filament\Tables\Columns\TextColumn;

class SpotStorageResource extends Resource
{
    protected static ?string $model = SpotStorage::class;
      protected static ?string $navigationGroup = 'Data';
    protected static ?string $navigationIcon = 'heroicon-o-circle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Card::make()
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            // Otomatis membuat slug saat name diisi
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set) => $operation === 'create' ? $set('slug', Str::slug($state)) : null),

                        TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true), // Slug harus unik

                        TextInput::make('path')
                            ->required()
                            ->maxLength(255)
                            ->helperText('Contoh: storage/spots/spot-name'),
                         Toggle::make('is_active')
                        ->label('Status Aktif') // Label yang akan muncul di form
                        ->helperText('Matikan atau hidupkan kategori ini.') // Teks bantuan opsional
                        ->default(true) // Menetapkan nilai default saat membuat record baru
                        ->onIcon('heroicon-m-check-badge') // Ikon saat ON (opsional)
                        ->offIcon('heroicon-m-x-circle') // Ikon saat OFF (opsional)
                        ->inline(false),     // Tambahkan petunjuk untuk kolom path
                    ])
                    ->columns(1), // Menampilkan komponen dalam satu kolom
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->sortable()
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true), // Sembunyikan secara default

                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('slug')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('path')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
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

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSpotStorages::route('/'),
            // 'create' => Pages\CreateSpotStorage::route('/create'),
            // 'edit' => Pages\EditSpotStorage::route('/{record}/edit'),
        ];
    }
}
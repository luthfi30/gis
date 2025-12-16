<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SpotPermissionResource\Pages;
use App\Filament\Resources\SpotPermissionResource\RelationManagers;
use App\Models\SpotPermission;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Components\Toggle;
use Filament\Tables\Columns\ToggleColumn; 
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
// Import yang diperlukan
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Card;
use Filament\Tables\Columns\TextColumn;

class SpotPermissionResource extends Resource
{
    protected static ?string $model = SpotPermission::class; // Menggunakan model SpotPermission
      protected static ?string $navigationGroup = 'settings';
    protected static ?string $navigationIcon = 'heroicon-o-key'; // Icon navigasi

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Card::make()
                    ->schema([
                        // Field untuk user_id
                        Select::make('user_id')
                            ->relationship('user', 'name') // Asumsi ada relasi 'user' dan kolom 'name' pada model User
                            ->required()
                            ->searchable()
                            ->preload()
                            ->label('User'),

                        // Field untuk spot_id
                        Select::make('spot_id')
                            ->relationship('spot', 'name') // Asumsi ada relasi 'spot' dan kolom 'name' pada model Spot
                            ->required()
                            ->searchable()
                            ->preload()
                            ->label('Spot'),

                          Toggle::make('can_access')
                            ->label('Status Aktif') // Label yang akan muncul di form
                            ->helperText('Matikan atau hidupkan kategori ini.') // Teks bantuan opsional
                            ->default(true) // Menetapkan nilai default saat membuat record baru
                            ->onIcon('heroicon-m-check-badge') // Ikon saat ON (opsional)
                            ->offIcon('heroicon-m-x-circle') // Ikon saat OFF (opsional)
                            ->inline(false)   
                    ])
                    ->columns(2), // Menampilkan komponen dalam dua kolom
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

                // Menampilkan nama User (melalui relasi)
                TextColumn::make('user.name')
                    ->label('User')
                    ->searchable()
                    ->sortable(),

                // Menampilkan nama Spot (melalui relasi)
                TextColumn::make('spot.name')
                    ->label('Spot')
                    ->searchable()
                    ->sortable(),

                 ToggleColumn::make('can_access')
                    ->label('Akses Aktif'),   

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
            'index' => Pages\ListSpotPermissions::route('/'),
            'create' => Pages\CreateSpotPermission::route('/create'),
            'edit' => Pages\EditSpotPermission::route('/{record}/edit'),
        ];
    }
}
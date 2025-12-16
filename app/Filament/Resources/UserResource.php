<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Filament\Resources\UserResource\RelationManagers;
use App\Models\User;
use App\Filament\Resources\UserResource\RelationManagers\PermissionsRelationManager;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Components\Select;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
// Imports yang diperlukan
use Filament\Forms\Components\Card;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\DateTimePicker;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Illuminate\Support\Facades\Hash;


class UserResource extends Resource
{
    protected static ?string $model = User::class;
      protected static ?string $navigationGroup = 'settings';
    protected static ?string $navigationIcon = 'heroicon-o-users'; // Mengubah ikon menjadi users

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Card::make()
                    ->schema([
                        // Kolom Name
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255),

                        // Kolom Email
                        TextInput::make('email')
                            ->email()
                            ->required()
                            ->unique(ignoreRecord: true) // Harus unik, abaikan record saat ini saat edit
                            ->maxLength(255),

                        Select::make('roles')->multiple()->relationship('roles', 'name')->preload(),

                        // Kolom Email Verified At
                        DateTimePicker::make('email_verified_at')
                            ->label('Email Verified At')
                            ->default(now())
                            ->nullable(), // Mengizinkan field ini kosong (nullable)
                        
                        // Kolom Password
                        TextInput::make('password')
                            ->password()
                            // Hash password sebelum disimpan
                            ->dehydrateStateUsing(fn (string $state): string => Hash::make($state))
                            // Hanya simpan state jika input diisi
                            ->dehydrated(fn (?string $state): bool => filled($state))
                            // Wajib diisi hanya saat operasi 'create'
           
                            ->required(fn (string $operation): bool => $operation === 'create')
                            ->minLength(8) // Asumsi panjang minimal 8
                            ->label('Password (Isi hanya jika ingin ganti)')

                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('email')
                    ->searchable()
                    ->sortable(),

                // Menampilkan status verifikasi email sebagai ikon boolean
                IconColumn::make('email_verified_at')
                    ->label('Verified')
                    ->boolean()
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
                Tables\Actions\DeleteAction::make(), // Tambahkan DeleteAction
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
            PermissionsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
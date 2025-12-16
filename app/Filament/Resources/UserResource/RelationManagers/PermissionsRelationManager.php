<?php

namespace App\Filament\Resources\UserResource\RelationManagers;

use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Table;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Actions;

class PermissionsRelationManager extends RelationManager
{
    // Nama relasi di model User.php
    protected static string $relationship = 'permissions'; 
    protected static ?string $title = 'Izin Akses Spot'; 

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                // Pilih Spot
                Select::make('spot_id')
                    // Relasi 'spot' ada di model SpotPermission
                    ->relationship('spot', 'name') 
                    ->required()
                    ->searchable()
                    ->preload()
                    ->label('Spot')
                    // Memastikan tidak ada duplikasi izin
                    ->unique(ignoreRecord: true, modifyRuleUsing: function ($rule, $livewire) {
                        return $rule->where('user_id', $livewire->ownerRecord->id); 
                    }),

                // Status Akses
                Toggle::make('can_access')
                    ->label('Akses Aktif')
                    ->default(true)
                    ->inline(false),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('spot.name') 
                    ->label('Spot')
                    ->sortable()
                    ->searchable(),
                
                IconColumn::make('can_access') 
                    ->label('Akses Aktif')
                    ->boolean(),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Actions\CreateAction::make() 
                    ->modalHeading('Berikan Izin Spot Baru'),
            ])
            ->actions([
                Actions\EditAction::make(),
                Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
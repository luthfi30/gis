<?php

namespace App\Filament\Resources\SpotPermissionResource\Pages;

use App\Filament\Resources\SpotPermissionResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListSpotPermissions extends ListRecords
{
    protected static string $resource = SpotPermissionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}

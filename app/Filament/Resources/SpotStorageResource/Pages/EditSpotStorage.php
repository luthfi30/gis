<?php

namespace App\Filament\Resources\SpotStorageResource\Pages;

use App\Filament\Resources\SpotStorageResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditSpotStorage extends EditRecord
{
    protected static string $resource = SpotStorageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}

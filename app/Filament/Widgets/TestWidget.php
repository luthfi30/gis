<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\Spot;
use App\Models\Category;
use App\Models\SpotStorage;
use App\Models\User;

class TestWidget extends BaseWidget
{
    protected function getStats(): array
    {
        return [
             Stat::make('Map Page', 'Map')
            ->url('/') 
            ->openUrlInNewTab() 
            ->icon('heroicon-o-globe-alt'),
            Stat::make('Total Spot', Spot::Count()),
            Stat::make('Total Category', Category::Count()),
            Stat::make('Total Spot Storages', SpotStorage::Count()),
            Stat::make('Total User', User::Count()),
           
        ];
    }
}

<?php
namespace App\Filament\Resources\SpotResource\Pages;
use App\Filament\Resources\SpotResource;
use Filament\Actions;
use Filament\Infolists\Components\View;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\Section;
use Filament\Infolists\Infolist;
use Filament\Resources\Pages\ViewRecord;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class ViewSpot extends ViewRecord
{

    protected static string $resource = SpotResource::class;

    // *** OPTIMASI: Hanya simpan URL file, bukan konten file yang besar ***
    public $mapData = [
        'geojson_url' => null, // Menyimpan URL file GeoJSON
        'category_colors' => []
    ];

    protected $listeners = ['highlightFeature' => 'handleFeatureHighlight'];

    public function handleFeatureHighlight(int $featureIndex)
    {
        $this->dispatch('feature-highlighted-on-map', featureIndex: $featureIndex);
    }

    protected function getHeaderActions(): array
    {
        $this->loadGeoJsonContent();
        return [
            Actions\EditAction::make(),
        ];
    }

    protected function loadGeoJsonContent()
    {
        $filePath = $this->record->geojson_file;
        $disk = 's3';

        // 1. Dapatkan URL File GeoJSON (BUKAN KONTENNYA)
        if ($filePath) {
            if (Storage::disk($disk)->exists($filePath)) {
                // Simpan URL file, browser akan melakukan FETCH sendiri
                $this->mapData['geojson_url'] = Storage::disk($disk)->url($filePath);
            } else {
                // Jika file tidak ditemukan, set URL menjadi null
                $this->mapData['geojson_url'] = null; 
            }
        }

        // 2. Dapatkan data warna kategori
        $categories = \App\Models\Category::all(['id', 'color'])->keyBy('id');
        $this->mapData['category_colors'] = $categories->map(fn($c) => $c->color)->toArray();
    }

    public function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                // BAGIAN 1: PETA GEOJSON
                Section::make('Peta Lokasi GeoJSON')
                    ->schema([
                        View::make('filament.resources.spots.components.geojson-map')
                            ->label('Peta Lokasi GeoJSON')
                            ->extraAttributes(['class' => 'h-96']),
                    ])
                    ->columnSpanFull(),

                // BAGIAN 2: DETAIL DATA SPOT
                Section::make('Detail Spot')
                    ->schema([
                        TextEntry::make('name'),
                        TextEntry::make('slug'),
                        TextEntry::make('category.name')
                            ->label('Kategori'),
                        TextEntry::make('spotStorage.name')
                            ->label('Penyimpanan (Storage)'),
                        TextEntry::make('geojson_file')
                            ->label('Path File GeoJSON'),
                    ])
                    ->columns(2),

                // BAGIAN 3: TABEL PROPERTI GEOJSON
                Section::make('Data Properti GeoJSON')
                    ->schema([
                        View::make('filament.resources.spots.components.geojson-table')
                            ->label('Tabel Properti')
                            ->extraAttributes(['class' => 'mt-4']),
                    ])
                    ->columnSpanFull(),
            ]);
    }
}
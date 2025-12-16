<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Frontpage' }}</title>
    <link rel="icon" href="{{ asset('favicon.png') }}">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    {{-- Leaflet --}}
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet-easybutton@2/src/easy-button.css">
    <link rel="stylesheet" href="https://ppete2.github.io/Leaflet.PolylineMeasure/Leaflet.PolylineMeasure.css" />

</head>

<body class="flex h-screen flex-col bg-gray-100">

    {{-- NAVBAR --}}
    <nav class="flex items-center justify-between bg-slate-900 px-6 py-3 text-white shadow">

        {{-- Toggle Sidebar Button --}}
        <button id="toggleSidebar" class="bg-white-900 hover:bg-white-700 mr-4 rounded px-3 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-8 w-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </button>

        <div class="flex hidden items-center gap-3 sm:block">
            <a href="/" class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="text-white-800 ml-2 text-2xl font-bold tracking-wide">Geodin-GIS</span>
            </a>
        </div>

        <ul class="flex gap-12 md:mr-20 lg:mr-32">
            @auth
                <li>
                    <a href="{{ filament()->getHomeUrl() }}"
                        class="rounded-lg bg-slate-700 px-4 py-2 font-medium text-white transition-colors hover:bg-slate-800">
                        {{ auth()->user()->name }}
                    </a>
                </li>
            @else
                <li>
                    <a href="{{ filament()->getHomeUrl() }}"
                        class="shadow-primary-light/50 rounded-lg bg-slate-700 px-4 py-2 font-medium text-white shadow-lg transition-colors hover:bg-slate-800">Sign
                        In
                    </a>
                </li>
            @endauth
        </ul>
    </nav>

    {{-- MAIN CONTENT --}}
    <div class="flex flex-1 overflow-hidden">

        {{-- SIDEBAR --}}
        @props(['title', 'spots' => []])
        <aside id="sidebar"
            class="w-72 overflow-y-auto border-r border-gray-200 bg-gray-50 transition-all duration-300">

            {{-- TAB HEADER --}}
            <div class="flex border-b text-sm font-medium">

                <button class="sidebar-tab active w-1/4 bg-gray-200 px-4 py-3 text-center" data-target="tab-spot">
                    Spot
                </button>
                <button class="sidebar-tab w-1/4 px-4 py-3 text-center" data-target="tab-upload">
                    Upload
                </button>
                <button class="sidebar-tab w-1/4 px-4 py-3 text-center" data-target="tab-legenda">
                    Legenda
                </button>
            </div>

            {{-- TAB CONTENT --}}
            <div class="p-4">

                {{-- TAB: SPOT (LAYER PETA) --}}
                <div id="tab-spot" class="tab-content">
                    <h2 class="mb-4 font-semibold">Layer Peta</h2>

                    @forelse ($spots as $spot)
                        {{-- KONTEN LAYER SPOT DENGAN DROPDOWN MENU --}}
                        <div class="group relative mt-2 flex items-center justify-between">
                            <label class="flex items-center gap-2">
                                <input type="checkbox" class="layer-check" data-layer="{{ $spot->slug }}"
                                    data-geojson-url="{{ Storage::url($spot->geojson_file) }}"
                                    data-color="{{ $spot->category->color ?? '#0078FF' }}"
                                    data-can-view-attribute="{{ $spot->can_view_attribute ? '1' : '0' }}">

                                <span>
                                    {{ $spot->name }}
                                    @if ($spot->category)
                                        <span class="text-medium text-gray-500">({{ $spot->category->name }})</span>
                                    @endif
                                </span>
                            </label>

                            {{-- DROPDOWN MENU --}}
                            <div class="relative">
                                {{-- Tombol (Tiga Titik) --}}
                                <button
                                    class="layer-menu-btn hover:text-white-600 rounded p-1 text-gray-400 focus:outline-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path
                                            d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
                                    </svg>
                                </button>

                                {{-- Isi Dropdown (Sembunyikan secara default) --}}
                                <div
                                    class="layer-menu-content absolute right-0 z-10 mt-2 hidden w-48 rounded-md border border-gray-200 bg-white p-2 shadow-lg">
                                    {{-- Tombol Zoom to Layer --}}
                                    <a href="#"
                                        class="zoom-to-layer-btn block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                        data-layer-slug="{{ $spot->slug }}">

                                        Zoom to Layer
                                    </a>

                                    <a href="#"
                                        class="view-attribute-btn block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                        data-geojson-url="{{ Storage::url($spot->geojson_file) }}"
                                        data-layer-name="{{ $spot->name }}" data-layer-slug="{{ $spot->slug }}">
                                        View in Attribute Table
                                    </a>
                                    {{-- BARU: Kontrol Color Picker --}}
                                    <div class="p-2">
                                        <label for="color-picker-{{ $spot->slug }}"
                                            class="mb-1 block text-xs font-medium text-gray-700">
                                            Color Picker
                                        </label>
                                        <input type="color" id="color-picker-{{ $spot->slug }}"
                                            class="color-picker h-8 w-full cursor-pointer"
                                            value="{{ $spot->category->color ?? '#0078FF' }}"
                                            data-layer-slug="{{ $spot->slug }}">
                                    </div>

                                    {{-- Kontrol Opacity Slider --}}
                                    <div class="mb-2 border-y border-gray-100 p-2">
                                        <label for="opacity-slider-{{ $spot->slug }}"
                                            class="mb-1 block text-xs font-medium text-gray-700">
                                            Opacity (<span id="opacity-value-{{ $spot->slug }}">70</span>%)
                                        </label>
                                        <input type="range" id="opacity-slider-{{ $spot->slug }}"
                                            class="opacity-slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                                            min="10" max="100" value="70"
                                            data-layer-slug="{{ $spot->slug }}">
                                    </div>
                                </div>
                            </div>
                        </div>
                    @empty
                        <p class="text-sm text-gray-500">Tidak ada data spot ditemukan.</p>
                    @endforelse

                </div>

                {{-- TAB: UPLOAD --}}
                <div id="tab-upload" class="tab-content hidden">
                    <h2 class="mb-3 font-semibold">Upload File Peta</h2>

                    {{-- Kontrol Warna dan Opasitas untuk Layer Upload --}}
                    <div class="mb-4 space-y-3 rounded-md border bg-gray-50 p-3">
                        <div class="flex items-center justify-between">
                            <label for="uploadColorPicker" class="text-sm font-medium text-gray-700">Warna
                                Layer:</label>
                            <input type="color" id="uploadColorPicker" value="#00A0B0"
                                class="h-8 w-8 cursor-pointer">
                        </div>

                        <div>
                            <label for="uploadOpacitySlider" class="mb-1 block text-sm font-medium text-gray-700">
                                Opasitas (<span id="upload-opacity-value">70</span>%)
                            </label>
                            <input type="range" id="uploadOpacitySlider"
                                class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                                min="10" max="100" value="70">
                        </div>
                    </div>

                    <input type="file" id="uploadFileInput" accept=".geojson, .zip"
                        class="mt-2 w-full border p-2">

                    <p class="mt-1 text-xs text-gray-500">Dukung format: GeoJSON (.geojson) atau Shapefile (.zip)</p>

                    <button id="processUploadBtn"
                        class="mt-3 w-full rounded bg-slate-600 py-2 text-white hover:bg-slate-800 disabled:bg-slate-500"
                        disabled>
                        Tampilkan di Peta
                    </button>
                    <div id="uploadStatus" class="mt-2 text-sm"></div>
                </div>

                {{-- TAB: LEGENDA --}}
                <div id="tab-legenda" class="tab-content hidden">
                    <h2 class="mb-3 font-semibold">Legenda</h2>

                    {{-- KONTANER BARU UNTUK LEGENDA --}}
                    <div id="legendContainer" class="space-y-2 text-sm">
                        <p class="text-gray-500">Pilih layer di tab Spot untuk menampilkan legenda.</p>
                    </div>
                </div>
                {{-- modal gambar --}}
                <div id="imageModal"
                    class="fixed inset-0 z-[9999] flex hidden items-center justify-center bg-black bg-opacity-90 transition-opacity duration-300">
                    {{-- Tombol Close --}}
                    <button id="closeModalBtn"
                        class="absolute right-4 top-4 z-50 text-white hover:text-gray-300 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {{-- Wadah Gambar --}}
                    <div class="relative flex h-full w-full items-center justify-center p-4">
                        <img id="modalImage" src="" alt="Fullscreen View"
                            class="max-h-full max-w-full rounded object-contain shadow-2xl">
                    </div>
                </div>

            </div>
        </aside>

        {{-- MAP CONTENT --}}
        <main class="relative flex-1">
            {{ $slot }}

            {{-- PANGGIL KOMPONEN ATTRIBUTE PANEL DARI BAWAH --}}
            <x-frontpage.attribute-panel />

        </main>

    </div>

    {{-- Leaflet --}}
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://unpkg.com/shpjs@latest/dist/shpjs.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/leaflet-easybutton@2/src/easy-button.js"></script>
    <script src="https://ppete2.github.io/Leaflet.PolylineMeasure/Leaflet.PolylineMeasure.js"></script>
</body>

</html>

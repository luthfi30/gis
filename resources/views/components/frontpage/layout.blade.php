<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Geodin-GIS' }}</title>
    <link rel="icon" href="{{ asset('favicon.png') }}">

    {{-- Fonts --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    {{-- ============================================================== --}}
    {{--  PRIORITAS 1: LOAD LEAFLET & LIBRARY PETA TERLEBIH DAHULU     --}}
    {{-- ============================================================== --}}

    {{-- Leaflet CSS --}}
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet-easybutton@2/src/easy-button.css">
    <link rel="stylesheet" href="https://ppete2.github.io/Leaflet.PolylineMeasure/Leaflet.PolylineMeasure.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet-mouse-position@1.2.0/src/L.Control.MousePosition.css" />
    <link rel="stylesheet" href="https://unpkg.com/@geoman-io/leaflet-geoman-free@2.14.2/dist/leaflet-geoman.css" />

    {{-- Leaflet JS (Wajib di Head agar terbaca oleh app.js) --}}
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://unpkg.com/shpjs@latest/dist/shpjs.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/leaflet-easybutton@2/src/easy-button.js"></script>
    <script src="https://ppete2.github.io/Leaflet.PolylineMeasure/Leaflet.PolylineMeasure.js"></script>
    <script src="https://unpkg.com/leaflet-mouse-position@1.2.0/src/L.Control.MousePosition.js"></script>
    <script src="https://unpkg.com/@geoman-io/leaflet-geoman-free@2.14.2/dist/leaflet-geoman.min.js"></script>

    {{-- ============================================================== --}}
    {{--  PRIORITAS 2: LOAD VITE / APP.JS SETELAH LEAFLET              --}}
    {{-- ============================================================== --}}
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <style>
        body {
            font-family: 'Inter', sans-serif;
        }

        /* Transisi Sidebar */
        #sidebar {
            transition: width 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
        }
    </style>
</head>

<body class="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-800">

    {{-- NAVBAR --}}
    <nav class="relative z-50 flex items-center justify-between bg-slate-900 px-5 py-3 text-white shadow-lg">
        <div class="flex items-center gap-3">
            <div
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/40">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" />
                </svg>
            </div>
            <span class="text-lg font-bold tracking-tight">Geodin-GIS</span>
        </div>

        <ul class="flex gap-4">
            @auth
                <li>
                    <a href="{{ filament()->getHomeUrl() }}"
                        class="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white">
                        <div class="h-2 w-2 rounded-full bg-green-500"></div>
                        {{ auth()->user()->name }}
                    </a>
                </li>
            @else
                <li>
                    <a href="{{ filament()->getHomeUrl() }}"
                        class="rounded-md bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-500">
                        Sign In
                    </a>
                </li>
            @endauth
        </ul>
    </nav>

    {{-- MAIN LAYOUT --}}
    <div class="relative flex flex-1 overflow-hidden">

        {{-- SIDEBAR --}}
        @props(['title', 'spots' => []])
        <aside id="sidebar"
            class="relative z-40 flex w-72 flex-shrink-0 flex-col border-r border-slate-200 bg-white shadow-xl">

            {{-- TAB HEADER --}}
            <div class="px-3 pb-2 pt-4">
                <div class="flex rounded-lg bg-slate-100 p-1">
                    <button
                        class="sidebar-tab active w-1/3 rounded-md py-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 transition-all hover:bg-white hover:text-indigo-600 hover:shadow-sm"
                        data-target="tab-spot">
                        Layers
                    </button>
                    <button
                        class="sidebar-tab w-1/3 rounded-md py-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 transition-all hover:bg-white hover:text-indigo-600 hover:shadow-sm"
                        data-target="tab-upload">
                        Upload
                    </button>
                    <button
                        class="sidebar-tab w-1/3 rounded-md py-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 transition-all hover:bg-white hover:text-indigo-600 hover:shadow-sm"
                        data-target="tab-legenda">
                        Legenda
                    </button>
                </div>
            </div>

            {{-- SCROLLABLE CONTENT --}}
            <div class="custom-scrollbar flex-1 overflow-y-auto p-3">

                {{-- TAB: SPOT --}}
                <div id="tab-spot" class="tab-content space-y-3">
                    <div class="mb-2">
                        <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400">Map Layers</h2>
                    </div>

                    @forelse ($spots as $spot)
                        {{-- CARD LAYER --}}
                        <div
                            class="group rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm transition-colors hover:border-indigo-300">

                            {{-- Header Layer: Checkbox & Nama --}}
                            <div class="flex items-start justify-between">
                                <label class="flex cursor-pointer select-none items-center gap-2">
                                    <input type="checkbox"
                                        class="layer-check h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        data-layer="{{ $spot->slug }}"
                                        data-geojson-url="{{ Storage::url($spot->geojson_file) }}"
                                        data-color="{{ $spot->category->color ?? '#0078FF' }}"
                                        data-can-view-attribute="{{ $spot->can_view_attribute ? '1' : '0' }}">

                                    <div class="flex flex-col">
                                        <span class="text-xs font-semibold text-slate-700">{{ $spot->name }}</span>
                                        @if ($spot->category)
                                            <span class="text-[10px] text-slate-400">{{ $spot->category->name }}</span>
                                        @endif
                                    </div>
                                </label>

                                {{-- Tombol Toggle Settings --}}
                                <button type="button" class="toggle-settings-btn text-slate-400 hover:text-indigo-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>

                            {{-- SETTINGS PANEL --}}
                            <div
                                class="settings-panel animate-in fade-in slide-in-from-top-1 mt-3 hidden border-t border-slate-100 pt-2 duration-200">

                                {{-- Tools --}}
                                <div class="mb-3 flex gap-2">
                                    <button
                                        class="zoom-to-layer-btn flex flex-1 items-center justify-center gap-1 rounded bg-slate-100 py-1 text-[10px] font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
                                        data-layer-slug="{{ $spot->slug }}">
                                        Zoom
                                    </button>
                                    @if ($spot->can_view_attribute)
                                        <button
                                            class="view-attribute-btn flex flex-1 items-center justify-center gap-1 rounded bg-slate-100 py-1 text-[10px] font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
                                            data-geojson-url="{{ Storage::url($spot->geojson_file) }}"
                                            data-layer-name="{{ $spot->name }}"
                                            data-layer-slug="{{ $spot->slug }}">
                                            Table
                                        </button>
                                    @endif
                                </div>

                                {{-- Opacity --}}
                                <div class="mb-2">
                                    <div class="mb-1 flex justify-between text-[10px] text-slate-500">
                                        <span>Opacity</span>
                                        <span id="opacity-value-{{ $spot->slug }}">70%</span>
                                    </div>
                                    <input type="range"
                                        class="opacity-slider h-1 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600"
                                        min="10" max="100" value="70"
                                        id="opacity-slider-{{ $spot->slug }}" data-layer-slug="{{ $spot->slug }}">
                                </div>

                                {{-- Color --}}
                                <div class="flex items-center justify-between">
                                    <span class="text-[10px] text-slate-500">Layer Color</span>
                                    <div class="relative h-5 w-16 overflow-hidden rounded border border-slate-200">
                                        <input type="color"
                                            class="color-picker absolute -left-1 -top-1 h-8 w-20 cursor-pointer"
                                            value="{{ $spot->category->color ?? '#0078FF' }}"
                                            id="color-picker-{{ $spot->slug }}"
                                            data-layer-slug="{{ $spot->slug }}">
                                    </div>
                                </div>
                            </div>
                        </div>
                    @empty
                        <div class="flex flex-col items-center justify-center px-4 py-10 text-center">
                            {{-- Ikon Folder Kosong --}}
                            <div class="mb-3 rounded-full bg-slate-100 p-3">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-400" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                        d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                                </svg>
                            </div>

                            <p class="text-xs font-medium text-slate-600">No public layers available.</p>

                            {{-- Warning Text Khusus Guest --}}
                            @guest
                                <div class="mt-3 max-w-[220px] rounded border border-amber-100 bg-amber-50 p-2.5">
                                    <div class="flex gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0 text-amber-500"
                                            viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <p class="text-left text-[10px] leading-tight text-amber-800">
                                            <span class="font-bold">Restricted Access:</span><br>
                                            Additional layers are visible only to logged-in users.
                                        </p>
                                    </div>
                                </div>
                            @endguest
                        </div>
                    @endforelse
                </div>

                {{-- TAB: UPLOAD --}}
                <div id="tab-upload" class="tab-content hidden space-y-4">
                    <div class="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
                        <label class="mb-2 block text-xs font-bold text-indigo-900">Upload GeoJSON / Shapefile</label>
                        <input type="file" id="uploadFileInput" accept=".geojson, .zip"
                            class="block w-full cursor-pointer rounded border border-indigo-200 bg-white/50 p-1 text-[10px] text-slate-500 file:mr-2 file:rounded-full file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-[10px] file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100">
                    </div>

                    <div class="rounded-lg border border-slate-200 bg-white p-3">
                        <div class="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
                            <span class="text-xs font-semibold text-slate-700">Styling</span>
                            <input type="color" id="uploadColorPicker" value="#00A0B0"
                                class="h-5 w-8 cursor-pointer border-none bg-transparent">
                        </div>
                        <div class="mb-2">
                            <div class="mb-1 flex justify-between text-[10px] text-slate-500">
                                <span>Opacity</span>
                                <span id="upload-opacity-value">70%</span>
                            </div>
                            <input type="range" id="uploadOpacitySlider"
                                class="h-1 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600"
                                min="10" max="100" value="70">
                        </div>
                    </div>

                    <button id="processUploadBtn"
                        class="w-full rounded-md bg-slate-800 py-2 text-xs font-bold text-white shadow transition-all hover:bg-slate-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-300"
                        disabled>
                        Visualize on Map
                    </button>
                    <div id="uploadStatus" class="mt-1 text-center text-[10px] font-medium text-slate-500"></div>
                </div>

                {{-- TAB: LEGENDA --}}
                <div id="tab-legenda" class="tab-content hidden">
                    <div class="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                        <h2 class="mb-2 border-b border-slate-100 pb-2 text-xs font-bold text-slate-800">Active Legends
                        </h2>
                        <div id="legendContainer" class="space-y-2 text-xs">
                            <p class="italic text-slate-400">Enable layers to see legends.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="border-t border-slate-100 bg-slate-50 p-2 text-center">
                <p class="text-[10px] text-slate-400">System v1.0</p>
            </div>
        </aside>

        {{-- MAIN MAP AREA --}}
        <main class="relative flex flex-1 flex-col bg-gray-200">
            <button id="toggleSidebar"
                class="absolute left-4 top-4 z-[400] flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-700 shadow-md transition-all hover:scale-105 hover:text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {{-- INI PENTING: Slot harus merender view yang memiliki <div id="map"> --}}
            <div class="relative z-0 h-full w-full flex-1">
                {{ $slot }}
            </div>

            <x-frontpage.attribute-panel />
        </main>

        {{-- MODAL IMAGE --}}
        <div id="imageModal"
            class="fixed inset-0 z-[10000] flex hidden items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <button id="closeModalBtn"
                class="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <img id="modalImage" src="" alt="Preview" class="max-h-full max-w-full rounded shadow-2xl">
        </div>

    </div>

    {{-- Script UI Toggle --}}
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.toggle-settings-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const card = btn.closest('.group');
                    const panel = card.querySelector('.settings-panel');
                    panel.classList.toggle('hidden');
                });
            });
        });
    </script>
</body>

</html>

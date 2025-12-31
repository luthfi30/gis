<div id="attributePanel"
    class="fixed bottom-0 left-0 right-0 z-[1000] flex h-[300px] flex-col border-t border-gray-300 bg-white shadow-2xl"
    style="height: 300px;">

    {{-- RESIZE HANDLE (Garis Penarik) --}}
    <div id="resizeHandle"
        class="group absolute left-0 right-0 top-0 z-50 flex h-2 w-full cursor-ns-resize items-center justify-center bg-gray-300 transition-colors hover:bg-indigo-400">
        {{-- Dekorasi garis kecil di tengah handle --}}
        <div class="h-1 w-12 rounded-full bg-gray-400 group-hover:bg-white"></div>
    </div>

    {{-- HEADER --}}
    <div id="attributePanelHeader"
        class="relative z-30 mt-2 flex h-14 shrink-0 select-none items-center justify-between border-b bg-white p-3">

        {{-- JUDUL --}}
        <div class="mr-4 flex flex-1 items-center overflow-hidden">
            <h3 class="flex items-center text-xs font-bold uppercase tracking-wider text-slate-600">
                <span id="panelTitle" class="mr-1">Tabel Atribut</span>
                <span id="layerNameDisplay" class="truncate text-sm font-normal text-slate-600"></span>
            </h3>
        </div>

        {{-- AREA KONTROL --}}
        <div id="panelControlsArea" class="mr-2 flex cursor-auto items-center space-x-2">

            {{-- SEARCH --}}
            <input type="text" id="attributeSearchInput" placeholder="Cari data..."
                class="w-32 rounded border border-gray-300 p-1 px-2 text-sm outline-none focus:border-blue-500 md:w-48">

            {{-- TOMBOL OPSI --}}
            <div class="relative">
                <button type="button" id="toggleOptionsBtn"
                    class="flex items-center rounded border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm hover:border-indigo-300">
                    <svg class="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Opsi
                </button>

                {{-- DROPDOWN MENU --}}
                <div id="optionsDropdown"
                    class="absolute right-0 z-[1001] mt-2 hidden w-64 rounded-md border border-gray-200 bg-white shadow-xl">
                    <div class="border-b bg-gray-50 p-3">
                        <p class="mb-2 text-[10px] font-bold uppercase text-gray-500">Export Data</p>
                        <div class="flex space-x-2">
                            <button type="button" id="btnExportCSV"
                                class="flex-1 rounded border border-green-300 bg-white px-2 py-1 text-xs text-green-700 hover:bg-green-50">CSV</button>
                            <button type="button" id="btnExportExcel"
                                class="flex-1 rounded border border-blue-300 bg-white px-2 py-1 text-xs text-blue-700 hover:bg-blue-50">Excel</button>
                        </div>
                    </div>
                    <div class="p-2">
                        <p class="mb-2 px-1 text-[10px] font-bold uppercase text-gray-500">Tampilkan Kolom</p>
                        <div id="columnToggleContainer" class="max-h-48 space-y-0.5 overflow-y-auto px-1"></div>
                    </div>
                </div>
            </div>
        </div>

        {{-- TOMBOL CLOSE X (Opsional: untuk menutup panel sepenuhnya) --}}
        <button id="closeAttributePanel" class="ml-2 p-1 text-gray-400 hover:text-indigo-700" title="Tutup Panel">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>

    {{-- KONTEN TABEL --}}
    <div id="modalAttributeTableContainer" class="relative h-full w-full flex-1 overflow-hidden bg-white">
        <div class="flex h-full items-center justify-center text-sm text-gray-500">Pilih layer untuk melihat data...
        </div>
    </div>
</div>

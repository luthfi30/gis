<div id="attributePanel" class="bg-white border-t border-gray-300 flex flex-col fixed bottom-0 left-0 right-0 z-[1000] shadow-2xl h-[300px]" style="height: 300px;">
    
    {{-- RESIZE HANDLE (Garis Penarik) --}}
    <div id="resizeHandle" class="w-full h-2 bg-gray-300 hover:bg-blue-400 cursor-ns-resize absolute top-0 left-0 right-0 z-50 flex justify-center items-center group transition-colors">
        {{-- Dekorasi garis kecil di tengah handle --}}
        <div class="w-12 h-1 bg-gray-400 rounded-full group-hover:bg-white"></div>
    </div>

    {{-- HEADER --}}
    <div id="attributePanelHeader" class="mt-2 p-3 border-b flex justify-between items-center bg-gray-100 relative z-30 shrink-0 h-14 select-none">
        
        {{-- JUDUL --}}
        <div class="flex items-center overflow-hidden mr-4 flex-1">
            <h3 class="text-base font-bold text-blue-800 truncate flex items-center">
                <span id="panelTitle" class="mr-1">Tabel Atribut</span> 
                <span id="layerNameDisplay" class="font-normal text-gray-600 text-sm truncate"></span>
            </h3>
        </div>
        
        {{-- AREA KONTROL --}}
        <div id="panelControlsArea" class="flex items-center space-x-2 mr-2 cursor-auto">
            
            {{-- SEARCH --}}
            <input type="text" id="attributeSearchInput" placeholder="Cari data..." 
                   class="p-1 px-2 border border-gray-300 rounded text-sm w-32 md:w-48 focus:border-blue-500 outline-none">
            
            {{-- TOMBOL OPSI --}}
            <div class="relative">
                <button type="button" id="toggleOptionsBtn" class="bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 px-3 py-1 rounded text-sm flex items-center shadow-sm">
                    <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Opsi
                </button>

                {{-- DROPDOWN MENU --}}
                <div id="optionsDropdown" class="hidden absolute right-0 mt-2 w-64 bg-white rounded-md shadow-xl border border-gray-200 z-[1001]">
                    <div class="p-3 border-b bg-gray-50">
                        <p class="text-[10px] font-bold text-gray-500 uppercase mb-2">Export Data</p>
                        <div class="flex space-x-2">
                            <button type="button" id="btnExportCSV" class="flex-1 bg-white border border-green-300 text-green-700 hover:bg-green-50 text-xs py-1 px-2 rounded">CSV</button>
                            <button type="button" id="btnExportExcel" class="flex-1 bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 text-xs py-1 px-2 rounded">Excel</button>
                        </div>
                    </div>
                    <div class="p-2">
                        <p class="text-[10px] font-bold text-gray-500 uppercase mb-2 px-1">Tampilkan Kolom</p>
                        <div id="columnToggleContainer" class="space-y-0.5 max-h-48 overflow-y-auto px-1"></div>
                    </div>
                </div>
            </div>
        </div>
        
        {{-- TOMBOL CLOSE X (Opsional: untuk menutup panel sepenuhnya) --}}
        <button id="closeAttributePanel" class="text-gray-400 hover:text-red-500 ml-2 p-1" title="Tutup Panel">
             <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>

    {{-- KONTEN TABEL --}}
    <div id="modalAttributeTableContainer" class="flex-1 overflow-hidden relative bg-white h-full w-full">
        <div class="flex items-center justify-center h-full text-gray-500 text-sm">Pilih layer untuk melihat data...</div>
    </div>
</div>
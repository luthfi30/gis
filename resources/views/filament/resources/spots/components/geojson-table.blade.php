<div
    wire:ignore
    x-data="{
        // UBAH: Gunakan URL, bukan string GeoJSON
        geojsonUrl: @js($this->mapData['geojson_url']),
        parsedData: null,
        properties: [],
        headers: [],
        
        // --- PROPERTI PAGINATION ---
        perPage: 20, 
        currentPage: 1,
        totalPages: 0,
        paginatedProperties: [],
        // ---------------------------

        init() {
            // Panggil method untuk fetch dan parse data
            this.fetchAndParseGeoJson(); 
            this.$watch('properties', () => this.updatePagination()); 
        },

        // METHOD BARU: Fetch data dari URL
        async fetchAndParseGeoJson() {
            if (!this.geojsonUrl) {
                this.$refs.tableContainer.innerHTML =
                    '<p class=\'text-center text-red-600 p-4\'>ERROR: File GeoJSON tidak ditemukan atau URL tidak tersedia.</p>';
                return;
            }
            
            try {
                // LAKUKAN FETCH DATA DARI URL
                const response = await fetch(this.geojsonUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const geojsonString = await response.text();
                
                this.parseGeoJson(geojsonString); // Panggil fungsi parsing dengan string
                
            } catch (e) {
                this.$refs.tableContainer.innerHTML =
                    '<p class=\'text-center text-red-600 p-4\'>Error saat mengambil data GeoJSON dari server.</p>';
                console.error('GeoJSON Fetch Error:', e);
            }
        },

        // UBAH: Menerima string GeoJSON sebagai parameter
        parseGeoJson(geojsonString) {
            
            if (!geojsonString) {
                this.$refs.tableContainer.innerHTML =
                    '<p class=\'text-center text-red-600 p-4\'>ERROR: Variabel GeoJSON tidak terinisialisasi.</p>';
                return;
            }

            try {
                this.parsedData = JSON.parse(geojsonString);

                if (this.parsedData.error_status) {
                    this.$refs.tableContainer.innerHTML = `
                        <p class=\'text-center text-red-600 p-4 font-bold\'>⚠️ DEBUG ERROR: ${this.parsedData.error_status}</p>
                        <p class=\'text-center text-red-600 p-2\'>${this.parsedData.message}</p>
                    `;
                    return;
                }

                if (!this.parsedData.features || this.parsedData.features.length === 0) {
                     this.$refs.tableContainer.innerHTML =
                        '<p class=\'text-center text-gray-500 p-4\'>Tidak ada fitur GeoJSON yang ditemukan.</p>';
                    return;
                }

                this.extractData();

            } catch (e) {
                this.$refs.tableContainer.innerHTML =
                    '<p class=\'text-center text-red-600 p-4\'>Error: Data GeoJSON tidak valid.</p>';
                console.error('GeoJSON Parse Error:', e);
            }
        },

        extractData() {
            // ... (Kode extractData sama seperti sebelumnya) ...
            let allKeys = new Set();
            this.properties = [];

            this.parsedData.features.forEach(feature => {
                if (feature.properties) {
                    Object.keys(feature.properties).forEach(key => allKeys.add(key));
                }
            });

            this.headers = Array.from(allKeys);
            if (this.headers.length === 0) {
                 this.$refs.tableContainer.innerHTML =
                        '<p class=\'text-center text-gray-500 p-4\'>Fitur ditemukan, tetapi tidak ada properti data.</p>';
                 return;
            }

            // Simpan data dan indeks fitur
            this.parsedData.features.forEach((feature, index) => {
                let row = {};
                row.id = index + 1; 
                row.geojson_index = index; 

                this.headers.forEach(header => {
                    const value = feature.properties && feature.properties[header] !== undefined
                                    ? feature.properties[header]
                                    : '-';
                    row[header] = value;
                });
                this.properties.push(row);
            });
            
            this.updatePagination();
        },

        updatePagination() {
            this.totalPages = Math.ceil(this.properties.length / this.perPage);
            this.currentPage = 1; 
            this.paginate();
        },

        paginate() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            this.paginatedProperties = this.properties.slice(start, end);
        },

        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.paginate();
            }
        },

        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.paginate();
            }
        },

        highlightFeatureOnMap(featureIndex) {
            $wire.dispatch('highlightFeature', { featureIndex: featureIndex });
        }
    }"
    class="w-full"
>
    <div x-ref="tableContainer" class="overflow-x-auto">
        <template x-if="properties.length > 0">
            <div>
                <table class="filament-tables-table w-full">
                    <thead>
                        <tr class="text-start bg-gray-500/5">
                            <th class="p-2 border-b whitespace-nowrap">#</th>
                            <template x-for="header in headers" :key="header">
                                <th x-text="header" class="p-2 border-b text-start whitespace-nowrap"></th>
                            </template>
                        </tr>
                    </thead>
                    <tbody>
                        <template x-for="row in paginatedProperties" :key="row.id"> 
                            <tr
                                x-on:click="highlightFeatureOnMap(row.geojson_index)"
                                class="border-b hover:bg-gray-500/5 cursor-pointer transition duration-150"
                            >
                                <td x-text="row.id" class="p-2 whitespace-nowrap"></td>
                                <template x-for="header in headers" :key="header">
                                    <td x-text="row[header]" class="p-2 truncate max-w-[150px]"></td>
                                </template>
                            </tr>
                        </template>
                    </tbody>
                </table>

                <div x-show="totalPages > 1" class="flex items-center justify-between p-3 border-t">
                    <button
                        x-on:click="prevPage()"
                        :disabled="currentPage === 1"
                        class="px-3 py-1 text-sm font-medium border rounded-lg"
                        :class="{'opacity-50 cursor-not-allowed': currentPage === 1}"
                    >
                        &larr; Sebelumnya
                    </button>
                    <span class="text-sm">
                        Halaman <span x-text="currentPage"></span> dari <span x-text="totalPages"></span>
                    </span>
                    <button
                        x-on:click="nextPage()"
                        :disabled="currentPage === totalPages"
                        class="px-3 py-1 text-sm font-medium border rounded-lg"
                        :class="{'opacity-50 cursor-not-allowed': currentPage === totalPages}"
                    >
                        Berikutnya &rarr;
                    </button>
                </div>
            </div>
        </template>
        <template x-if="properties.length === 0 && !parsedData?.error_status">
             <p class='text-center text-gray-500 p-4'>Tidak ada data properti untuk ditampilkan.</p>
        </template>
    </div>
</div>
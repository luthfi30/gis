<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>

<div wire:ignore x-data="{
    mapData: @js($this->mapData),
    spotCategoryId: @js($this->record->category_id),
    mapInstance: null,
    geojsonLayer: null,
    highlightedLayer: null,
    defaultStyle: {},

    init() {
        this.fetchAndInitializeMap();

        this.$wire.on('feature-highlighted-on-map', ({ featureIndex }) => {
            this.highlightFeature(featureIndex);
        });
    },

    // METHOD BARU: Fetch data dari URL
    async fetchAndInitializeMap() {
        const geojsonUrl = this.mapData.geojson_url;

        if (typeof L === 'undefined') {
            this.$refs.map.innerHTML = '<p class=\'text-center text-red-600 p-4\'>ERROR: Leaflet belum dimuat.</p>';
            return;
        }

        if (!geojsonUrl) {
            this.$refs.map.innerHTML = '<p class=\'text-center text-red-600 p-4\'>ERROR: URL GeoJSON tidak tersedia.</p>';
            return;
        }

        try {
            const response = await fetch(geojsonUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const geojsonString = await response.text();

            this.initializeMap(geojsonString);

        } catch (e) {
            this.$refs.map.innerHTML = '<p class=\'text-center text-red-600 p-4\'>Error: Gagal memuat data GeoJSON dari URL.</p>';
            console.error('GeoJSON Fetch Error:', e);
        }
    },

    initializeMap(geojsonString) {
        let geojsonData;
        const colors = this.mapData.category_colors;
        const defaultColor = '#3388ff';

        try {
            geojsonData = JSON.parse(geojsonString);
            if (geojsonData.error_status) {
                this.$refs.map.innerHTML = `
                        <p class='p-4 text-center font-bold text-red-600'>⚠️ DEBUG ERROR: ${geojsonData.error_status}</p>
                        <p class='p-2 text-center text-red-600'>${geojsonData.message}</p>
                    `;
                return;
            }
        } catch (e) {
            this.$refs.map.innerHTML = '<p class=\'text-center text-red-600 p-4\'>Error: Data GeoJSON tidak valid.</p>';
            return;
        }

        const map = L.map(this.$refs.map).setView([0, 0], 2);
        this.mapInstance = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const spotColor = colors[this.spotCategoryId] || defaultColor;

        this.defaultStyle = {
            fillColor: spotColor,
            color: spotColor,
            weight: 3,
            opacity: 1,
            fillOpacity: 0.7
        };

        const geojsonLayer = L.geoJSON(geojsonData, {
            style: () => this.defaultStyle,
            onEachFeature: function(feature, layer) {
                if (feature.properties) {
                    let html = '';
                    for (let key in feature.properties) {
                        html += `<strong>${key}</strong>: ${feature.properties[key]}<br>`;
                    }
                    // Bind pop-up tetap ada, agar bisa dibuka manual di peta
                    layer.bindPopup(html);

                    // Hapus listener 'click' di sini jika Anda tidak ingin pop-up terbuka saat klik langsung di peta
                    layer.on('click', function() {
                        layer.openPopup();
                    });
                }
            }
        }).addTo(map);
        this.geojsonLayer = geojsonLayer;

        if (geojsonLayer.getBounds().isValid()) {
            map.fitBounds(geojsonLayer.getBounds());
        }
    },

    highlightFeature(targetIndex) {
        if (!this.geojsonLayer) return;

        // 1. Reset sorotan sebelumnya
        if (this.highlightedLayer) {
            this.geojsonLayer.resetStyle(this.highlightedLayer);
            this.highlightedLayer = null;
        }

        this.geojsonLayer.eachLayer((layer) => {
            const layers = this.geojsonLayer.getLayers();
            const featureIndex = layers.indexOf(layer);

            if (featureIndex === targetIndex) {
                this.highlightedLayer = layer;

                // Terapkan Style Sorotan
                layer.setStyle({
                    weight: 5,
                    color: '#FFFF00',
                    dashArray: '',
                    fillOpacity: 0.9
                });

                // Zoom ke fitur
                if (layer.getBounds) {
                    this.mapInstance.fitBounds(layer.getBounds(), { padding: [50, 50] });
                } else if (layer.getLatLng) {
                    this.mapInstance.setView(layer.getLatLng(), 15);
                }


                if (layer.getPopup()) {
                    layer.openPopup();
                }


                return false;
            }
        });
    }
}" class="h-full w-full">
    <div x-ref="map" style="height: 400px;"></div>
</div>

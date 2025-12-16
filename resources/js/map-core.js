// resources/js/map-core.js

// Pastikan L (Leaflet) dan elemen peta sudah dimuat
if (typeof L === 'undefined' || !document.getElementById('map')) {
    console.error('Leaflet atau elemen peta #map tidak ditemukan.');
} else {
    // ===============================================
    //          VARIABEL GLOBAL
    // ===============================================
    window.activeGeoJsonLayers = {}; // Menyimpan layer aktif dari sidebar (database)
    window.activeLegends = {}; // Menyimpan data legenda layer aktif (database)
    window.uploadedLayer = null; // Menyimpan layer GeoJSON/Shapefile yang diupload
    window.uploadedLayerLegend = null; // Menyimpan data legenda layer yang diupload
    window.featureRefMap = {}; // Map: uniqueId -> Leaflet Layer Object (untuk Attribute Panel)
    window.featureIdCounter = 0; // Counter untuk membuat ID unik global

    // Variabel state untuk Attribute Panel
    window.currentLayerData = null; // GeoJSON data object dari layer yang sedang dilihat
    window.currentPage = 1; // Nomor halaman saat ini
    window.currentSearchTerm = ''; // Kata kunci pencarian saat ini
    window.ROWS_PER_PAGE = 50;

    // Style untuk Highlight Fitur yang di-klik
    window.HIGHLIGHT_STYLE = {
        color: '#FFFF00',
        weight: 5,
        opacity: 1,
        fillColor: '#FFFF00',
        fillOpacity: 0.5,
        radius: 8,
    };

    // Koordinat Bounding Box Indonesia
    const INDONESIA_BOUNDS = [
        [-11.0, 95.0],
        [6.0, 141.0],
    ];

    //   1. INISIALISASI PETA

    window.map = L.map('map');
    window.map.fitBounds(INDONESIA_BOUNDS);

    // ===============================================
    //           2. DEFINISI BASE LAYERS & KONTROL
    // ===============================================

    const osmLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors',
        },
    );
    osmLayer.addTo(window.map);

    const esriLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
            attribution:
                'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        },
    );

    const topoLayer = L.tileLayer(
        'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        {
            maxZoom: 17,
            attribution:
                'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        },
    );

    const darkMatterLayer = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors, © CartoDB',
        },
    );

    const positronLayer = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors, © CartoDB',
        },
    );

    const terrainLayer = L.tileLayer(
        'https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.jpg',
        {
            maxZoom: 18,
            attribution: 'Terrain © Stadia Maps',
        },
    );

    const esriRelief = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
        {
            maxZoom: 13,
            attribution: 'Esri Shaded Relief',
        },
    );

    const esriOcean = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
        {
            maxZoom: 13,
            attribution: 'Esri Ocean Basemap',
        },
    );

    const esriTerrain = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
        {
            maxZoom: 13,
            attribution: 'Esri Terrain',
        },
    );

    const baseLayers = {
        OpenStreetMap: osmLayer,
        'Satelit (ESRI)': esriLayer,
        'Topo Map': topoLayer,
        'Dark Matter': darkMatterLayer,
        Positron: positronLayer,
        Terrain: terrainLayer,
        Relief: esriRelief,
        Ocean: esriOcean,
        EsriTerrain: esriTerrain,
    };

    const overlayLayers = {};
    L.control.layers(baseLayers, overlayLayers).addTo(window.map);

    // Tombol untuk reset zoom ke INDONESIA_BOUNDS
    const homeSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 26px; height: 26px; display: block; margin: 3px auto;">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
    `;
    L.easyButton({
        states: [
            {
                stateName: 'zoom-to-home',
                icon: homeSvg,
                title: 'Kembali ke Posisi Awal',
                onClick: function (btn, map) {
                    // Menggunakan variabel global INDONESIA_BOUNDS yang sudah ada
                    map.fitBounds(INDONESIA_BOUNDS);
                },
            },
        ],
    }).addTo(window.map);

    //  TAMBAHAN: MEASUREMENT TOOL
    L.control
        .polylineMeasure({
            position: 'topleft',
            unit: 'kilometres',
            showBearings: false,
            clearMeasurementsOnStop: false,
            showClearControl: true,
            showUnitControl: true,
            tooltipTextFinish: 'Klik untuk <b>menyelesaikan</b> garis',
            tooltipTextDelete:
                'Tekan SHIFT + Klik untuk <b>menghapus</b> titik',
            tooltipTextMove: 'Klik dan seret untuk <b>memindah</b> titik',
            tooltipTextResume:
                '<br>Tekan CTRL + Klik untuk <b>lanjut</b> mengukur',

            // Styling Garis Ukur
            tempLine: { color: '#00ffff', weight: 2 },
            fixedLine: { color: '#0066ff', weight: 3 },
            startCircle: { color: '#000', weight: 1, fillColor: '#0f0', r: 6 },
            endCircle: { color: '#000', weight: 1, fillColor: '#f00', r: 6 },
        })
        .addTo(window.map);

    //  3. FUNGSI HELPER

    // Menyimpan data GeoJSON yang sudah dimodifikasi (memiliki uniqueId)
    window.storedGeoJsonData = {}; // Map: slug -> GeoJSON data object with uniqueIds

    /**
     * Menghasilkan objek style Leaflet GeoJSON yang konsisten (Sentralisasi Styling).
     * @param {string} color Warna heksadesimal.
     * @param {number} opacity Nilai opasitas (0.1 - 1.0).
     * @param {boolean} isUploaded Apakah layer dari upload file.
     * @returns {object} Objek style Leaflet.
     */
    window.getGeoJsonStyle = (color, opacity, isUploaded = false) => {
        // Opasitas isi (fillOpacity) default 40% dari opacity garis
        const fillRatio = isUploaded ? 0.3 : 0.4;
        const fillOpacity = opacity * fillRatio;

        return {
            color: color,
            weight: 3,
            opacity: opacity,
            fillColor: color,
            fillOpacity: fillOpacity,
        };
    };

    /**
     * Memeriksa apakah URL berasal dari Google Drive.
     */
    window.isGoogleDriveUrl = (url) => {
        return (
            url.includes('drive.google.com') || url.includes('docs.google.com')
        );
    };

    /**
     * Mengonversi URL Gdrive export/view menjadi URL thumbnail yang lebih stabil untuk embed.
     */
    window.getEmbeddableGoogleDriveUrl = (gdriveUrl) => {
        const ucMatch = gdriveUrl.match(/id=([^&]+)/);
        if (ucMatch && ucMatch[1]) {
            const fileId = ucMatch[1];
            return `https://drive.google.com/thumbnail?id=${fileId}&sz=w200-h150`;
        }
        return gdriveUrl;
    };

    // ... (kode sebelumnya di map-core.js biarkan saja) ...

    // ===============================================
    //          LOGIKA MODAL FULLSCREEN (GLOBAL)
    // ===============================================
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // Fungsi Global untuk membuka modal
    window.openImageModal = (imageUrl) => {
        if (imageModal && modalImage) {
            modalImage.src = imageUrl;
            imageModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Kunci scroll
        }
    };

    // Fungsi Global untuk menutup modal
    window.closeImageModal = () => {
        if (imageModal) {
            imageModal.classList.add('hidden');
            setTimeout(() => {
                if (modalImage) modalImage.src = '';
            }, 300);
            document.body.style.overflow = ''; // Buka scroll
        }
    };

    // Event Listener Global (Menangani klik pada Popup Peta & Tabel)
    document.addEventListener('click', function (event) {
        // Cari elemen terdekat yang memiliki class 'popup-image-trigger'
        const trigger = event.target.closest('.popup-image-trigger');

        if (trigger) {
            const fullUrl = trigger.getAttribute('data-full-url');
            if (fullUrl) {
                window.openImageModal(fullUrl);
            }
        }
    });

    // Event Listener Tombol Close
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', window.closeImageModal);
    }

    // Event Listener Klik Background Gelap
    if (imageModal) {
        imageModal.addEventListener('click', function (event) {
            if (event.target === imageModal) {
                window.closeImageModal();
            }
        });
    }

    // Event Listener Tombol ESC
    document.addEventListener('keydown', function (event) {
        if (
            event.key === 'Escape' &&
            imageModal &&
            !imageModal.classList.contains('hidden')
        ) {
            window.closeImageModal();
        }
    });
} // <--- Pastikan ini adalah kurung kurawal penutup dari blok 'else' paling luar di map-core.js

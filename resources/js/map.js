// resources/js/map.js

// Pastikan L (Leaflet) dan elemen peta sudah dimuat
if (typeof L !== 'undefined' && document.getElementById('map')) {
    // ===============================================
    //          VARIABEL GLOBAL
    // ===============================================
    const activeGeoJsonLayers = {}; // Menyimpan layer aktif dari sidebar (database)
    const activeLegends = {}; // Menyimpan data legenda layer aktif (database)
    let uploadedLayer; // Menyimpan layer GeoJSON/Shapefile yang diupload
    let uploadedLayerLegend = null; // Menyimpan data legenda layer yang diupload

    // Variabel untuk menghubungkan baris tabel ke layer di peta
    const featureRefMap = {}; // Map: uniqueId -> Leaflet Layer Object
    let featureIdCounter = 0; // Counter untuk membuat ID unik global

    // Menyimpan data GeoJSON yang sudah dimodifikasi (memiliki uniqueId)
    const storedGeoJsonData = {}; // Map: slug -> GeoJSON data object with uniqueIds

    // --- HELPER UNTUK KONVERSI GOOGLE DRIVE LINK ---
    /**
     * Memeriksa apakah URL berasal dari Google Drive.
     */
    function isGoogleDriveUrl(url) {
        return (
            url.includes('drive.google.com') || url.includes('docs.google.com')
        );
    }

    /**
     * Mengonversi URL Gdrive export/view menjadi URL thumbnail yang lebih stabil untuk embed.
     */
    function getEmbeddableGoogleDriveUrl(gdriveUrl) {
        // Mencari ID file di URL (bekerja untuk format docs.google.com/uc?export=view&id=FILE_ID)
        const ucMatch = gdriveUrl.match(/id=([^&]+)/);
        if (ucMatch && ucMatch[1]) {
            const fileId = ucMatch[1];
            // Format thumbnail ini sering kali mengatasi masalah embedding di popup/iframe.
            // sz=w200-h150 meminta Google untuk membuat thumbnail berukuran kecil.
            return `https://drive.google.com/thumbnail?id=${fileId}&sz=w200-h150`;
        }
        // Fallback ke URL asli jika ID tidak dapat diekstrak
        return gdriveUrl;
    }
    // --- AKHIR HELPER GOOGLE DRIVE ---

    // Style untuk Highlight Fitur yang di-klik
    const HIGHLIGHT_STYLE = {
        color: '#FFFF00', // Kuning terang
        weight: 5, // Garis lebih tebal
        opacity: 1, // Opasitas penuh
        fillColor: '#FFFF00',
        fillOpacity: 0.5,
        radius: 8, // Untuk titik/marker (digunakan saat highlight point)
    };

    // Konstanta dan State untuk Paginasi & Pencarian Atribut
    const ROWS_PER_PAGE = 50;
    let currentLayerData = null; // GeoJSON data object dari layer yang sedang dilihat
    let currentPage = 1; // Nomor halaman saat ini
    let currentSearchTerm = ''; // Kata kunci pencarian saat ini

    // ===============================================
    //           1. INISIALISASI PETA
    // ===============================================

    // Koordinat Bounding Box Indonesia (Min Lat, Min Lon) dan (Max Lat, Max Lon)
    const INDONESIA_BOUNDS = [
        [-11.0, 95.0], // Barat Daya (dekat Pulau Rote)
        [6.0, 141.0], // Timur Laut (dekat Papua)
    ];

    window.map = L.map('map');
    // Atur peta untuk menampilkan seluruh Indonesia saat pertama kali dimuat
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

    const baseLayers = {
        OpenStreetMap: osmLayer,
        'Satelit (ESRI)': esriLayer,
        'Topo Map': topoLayer,
    };

    const overlayLayers = {};
    L.control.layers(baseLayers, overlayLayers).addTo(window.map);

    // ===============================================
    //        3. LOGIKA LAYER CONTROL SPOT (PETA & POPUP)
    // ===============================================

    /**
     * Menghasilkan objek style Leaflet GeoJSON yang konsisten (Sentralisasi Styling).
     */
    function getGeoJsonStyle(color, opacity, isUploaded = false) {
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
    }

    // Fungsi inti untuk menambahkan GeoJSON ke Peta
    function addGeoJsonToMap(
        data,
        layerColor,
        isUploaded = false,
        opacityValue = 0.7,
    ) {
        // Gunakan fungsi getter tunggal
        const geoJsonStyle = getGeoJsonStyle(
            layerColor,
            opacityValue,
            isUploaded,
        );

        return L.geoJSON(data, {
            style: geoJsonStyle,

            // Handle Point/Marker
            pointToLayer: function (feature, latlng) {
                const pointFillOpacity = opacityValue * 0.8; // Opacity point sedikit berbeda
                return L.circleMarker(latlng, {
                    radius: 6,
                    fillColor: layerColor,
                    color: layerColor,
                    weight: 1,
                    opacity: opacityValue,
                    fillOpacity: pointFillOpacity,
                });
            },

            // Logika Popup dan Penempatan ID UNIK
            onEachFeature: function (feature, layer) {
                // 1. Berikan ID unik pada fitur dan simpan referensinya
                if (!feature.properties.uniqueId) {
                    feature.properties.uniqueId = `feat-${++featureIdCounter}`;
                }
                const uniqueId = feature.properties.uniqueId;
                featureRefMap[uniqueId] = layer; // Simpan referensi layer

                // 2. Logika Popup (Menampilkan semua atribut)
                if (feature.properties) {
                    const title =
                        feature.properties.name ||
                        feature.properties.Nama ||
                        'Daftar Geojson';

                    let popupContent = `
                        <div style="font-family: Arial, sans-serif; max-width: 300px; padding: 5px;">
                            <h4 style="margin: 0 0 10px 0; padding-bottom: 5px; border-bottom: 2px solid color: black; font-size: 1.1em;">
                                ${title}
                            </h4>
                            <div style="max-height: 200px; overflow-y: auto;">
                                <table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">`;

                    let hasContent = false;
                    let rowCount = 0;

                    for (const key in feature.properties) {
                        const value = feature.properties[key];

                        if (
                            value !== null &&
                            value !== undefined &&
                            value !== '' &&
                            !key.startsWith('_') &&
                            key !== 'name' &&
                            key !== 'Nama' &&
                            key !== 'uniqueId' // Abaikan ID internal
                        ) {
                            const formattedKey = key
                                .replace(/_/g, ' ')
                                .replace(/\b\w/g, (l) => l.toUpperCase());

                            // *** LOGIKA UNTUK MENAMPILKAN GAMBAR DAN MEMBUATNYA BISA DIKLIK ***
                            let displayValue = value;
                            let finalImageUrl = value;
                            const lowerKey = key.toLowerCase();

                            const isImageKey =
                                lowerKey.includes('image') ||
                                lowerKey.includes('foto');
                            const isUrl =
                                typeof value === 'string' &&
                                (value.startsWith('http://') ||
                                    value.startsWith('https://'));

                            if (isImageKey && isUrl) {
                                // Terapkan penanganan khusus untuk Google Drive
                                if (isGoogleDriveUrl(value)) {
                                    finalImageUrl =
                                        getEmbeddableGoogleDriveUrl(value);
                                }

                                // Render sebagai gambar yang dibungkus dengan tautan yang bisa diklik.
                                // Tag <img> menggunakan finalImageUrl (yang sudah dikonversi jika Gdrive),
                                // sementara tag <a> menggunakan 'value' (link asli Gdrive) agar user bisa buka resolusi penuh.
                                displayValue = `
                                    <a href="${value}" target="_blank" style="color: #007bff; text-decoration: underline;">
                                        <img src="${finalImageUrl}" alt="${formattedKey}" style="max-width: 100%; height: auto; display: block; margin: 5px 0; border: 1px solid #ccc; cursor: pointer;">
                                        (Klik untuk memperbesar / melihat link asli)
                                    </a>
                                `;
                            }
                            // *** AKHIR LOGIKA GAMBAR ***

                            const rowStyle =
                                rowCount % 2 === 0
                                    ? 'background-color: #f8f9fa;'
                                    : 'background-color: #ffffff;';

                            popupContent += `
                                <tr style="${rowStyle}; border-bottom: 1px solid #eee;">
                                    <td style="font-weight: bold; padding: 5px 10px 5px 5px; width: 40%; vertical-align: top; color: #555; border-right: 1px solid #eee;">${formattedKey}</td>
                                    <td style="padding: 5px 5px; width: 60%;">${displayValue}</td>
                                </tr>`;
                            hasContent = true;
                            rowCount++;
                        }
                    }

                    popupContent += '</table></div></div>';

                    if (hasContent) {
                        layer.bindPopup(popupContent, {
                            closeButton: true,
                            autoPan: true,
                            maxWidth: 350,
                            offset: L.point(0, -10),
                        });
                    } else {
                        layer.bindPopup(
                            `Detail untuk ${title} tidak tersedia.`,
                        );
                    }
                }
            },
        });
    }

    /**
     * Memperbarui opasitas (garis dan isi) dari layer GeoJSON yang sudah ada di peta.
     */
    function updateLayerOpacity(slug, newOpacity) {
        const layer = activeGeoJsonLayers[slug];
        if (layer) {
            // Dapatkan warna saat ini
            const currentColor = layer.options.style.color || '#0078FF';

            // Tentukan apakah layer ini adalah layer upload atau layer database/spot
            const isUploaded = !activeLegends[slug];

            // Dapatkan objek style konsisten
            const newStyle = getGeoJsonStyle(
                currentColor,
                newOpacity,
                isUploaded,
            );
            const newPointFillOpacity = newOpacity * 0.8;

            layer.eachLayer(function (featureLayer) {
                // Jika Polygon atau Polyline
                if (featureLayer.setStyle) {
                    featureLayer.setStyle(newStyle);
                }
                // Jika Point/CircleMarker
                else if (featureLayer.options && featureLayer.options.radius) {
                    featureLayer.options.opacity = newOpacity;
                    featureLayer.options.fillOpacity = newPointFillOpacity;
                    featureLayer.redraw();
                }
            });
        }
    }

    /**
     * Memperbarui warna (garis dan isi) dari layer GeoJSON yang sudah ada di peta.
     */
    function updateLayerColor(slug, newColor) {
        const layer = activeGeoJsonLayers[slug];
        if (layer) {
            // Ambil opasitas saat ini
            const currentOpacity = layer.options.style.opacity || 0.7;

            // Tentukan apakah layer ini layer upload atau layer database
            const isUploaded = !activeLegends[slug];

            // Dapatkan objek style konsisten baru
            const newStyle = getGeoJsonStyle(
                newColor,
                currentOpacity,
                isUploaded,
            );
            const newPointFillOpacity = currentOpacity * 0.8;

            // Perbarui data warna di checkbox (untuk warna default saat layer di-reset/dicentang lagi)
            const checkbox = document.querySelector(
                `.layer-check[data-layer="${slug}"]`,
            );
            if (checkbox) {
                checkbox.dataset.color = newColor;
            }

            layer.eachLayer(function (featureLayer) {
                // Jika Polygon atau Polyline
                if (featureLayer.setStyle) {
                    featureLayer.setStyle(newStyle);
                }
                // Jika Point/CircleMarker
                else if (featureLayer.options && featureLayer.options.radius) {
                    featureLayer.options.color = newColor;
                    featureLayer.options.fillColor = newColor;
                    featureLayer.options.opacity = currentOpacity; // Opasitas garis tetap
                    featureLayer.options.fillOpacity = newPointFillOpacity;
                    featureLayer.redraw();
                }
            });

            // Perbarui legenda
            if (activeLegends[slug]) {
                activeLegends[slug].color = newColor;
                updateLegend();
            }
        }
    }

    // Event Listener untuk Checkbox Layer (Sidebar)
    const layerCheckboxes = document.querySelectorAll('.layer-check');

    layerCheckboxes.forEach((checkbox) => {
        const slug = checkbox.dataset.layer;
        const slider = document.getElementById(`opacity-slider-${slug}`);
        const colorPicker = document.getElementById(`color-picker-${slug}`);

        // Ambil nilai opacity/color default dari UI atau gunakan fallback
        const defaultOpacity = slider ? parseFloat(slider.value) / 100 : 0.7;
        const defaultColor = colorPicker
            ? colorPicker.value
            : checkbox.dataset.color || '#0078FF';

        checkbox.addEventListener('change', function () {
            const url = this.dataset.geojsonUrl;

            // Ambil nilai opacity dan warna saat ini dari UI (bukan hanya dari data-atribut)
            const currentOpacity = slider
                ? parseFloat(slider.value) / 100
                : 0.7;
            const currentColor = colorPicker
                ? colorPicker.value
                : this.dataset.color || '#0078FF';

            const layerLabelText = this.closest('label').textContent.trim();
            const layerNameMatch = layerLabelText.match(/^(.*?)\s*\(/);
            const layerName = layerNameMatch
                ? layerNameMatch[1].trim()
                : layerLabelText;

            if (this.checked) {
                if (url) {
                    fetch(url)
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then((data) => {
                            // Clone data sebelum diolah agar data asli tetap utuh jika diperlukan
                            const dataWithIds = JSON.parse(
                                JSON.stringify(data),
                            );

                            const layer = addGeoJsonToMap(
                                dataWithIds, // Gunakan data yang sudah diclone
                                currentColor, // Gunakan warna dari color picker
                                false, // isUploaded
                                currentOpacity, // Opacity dari slider
                            ).addTo(window.map);

                            activeGeoJsonLayers[slug] = layer;
                            // HAPUS: window.map.fitBounds(layer.getBounds());
                            // Peta tidak lagi zoom otomatis saat layer dicentang.

                            // Simpan data GeoJSON yang sudah dimodifikasi (memiliki uniqueId)
                            storedGeoJsonData[slug] = dataWithIds;

                            // Legenda: Tambahkan ke legenda
                            activeLegends[slug] = {
                                name: layerName,
                                color: currentColor, // Gunakan warna saat ini
                            };
                            updateLegend();
                        })
                        .catch((error) =>
                            console.error('Error loading GeoJSON:', error),
                        );
                }
            } else {
                if (activeGeoJsonLayers[slug]) {
                    window.map.removeLayer(activeGeoJsonLayers[slug]);
                    delete activeGeoJsonLayers[slug];

                    // Hapus data dari memori saat layer dimatikan
                    delete storedGeoJsonData[slug];

                    // Legenda: Hapus dari legenda
                    delete activeLegends[slug];
                    updateLegend();
                }
            }
        });
    });

    // ===============================================
    //          4. LOGIKA SIDEBAR DROPDOWN MENU
    // ===============================================

    document.addEventListener('click', function (event) {
        // Logika untuk Tombol Tiga Titik (Membuka/Menutup Dropdown)
        if (event.target.closest('.layer-menu-btn')) {
            const button = event.target.closest('.layer-menu-btn');
            const content = button.nextElementSibling; // layer-menu-content

            // Tutup semua menu lain kecuali yang sedang diklik
            document.querySelectorAll('.layer-menu-content').forEach((menu) => {
                if (menu !== content) {
                    menu.classList.add('hidden');
                }
            });

            // Toggle menu yang sedang diklik
            content.classList.toggle('hidden');
        }
        // Logika untuk Menutup Dropdown ketika mengklik di luar
        else if (!event.target.closest('.layer-menu-content')) {
            document.querySelectorAll('.layer-menu-content').forEach((menu) => {
                menu.classList.add('hidden');
            });
        }
    });

    // Fungsi untuk menangani Zoom ke layer
    function zoomToLayer(slug) {
        const layer = activeGeoJsonLayers[slug];

        if (layer) {
            try {
                const bounds = layer.getBounds();
                // Cek apakah bounds valid (tidak nol atau infinity)
                if (bounds.isValid()) {
                    window.map.fitBounds(bounds, { padding: [50, 50] }); // Padding untuk sedikit ruang
                } else {
                    console.warn(
                        `Layer ${slug} tidak memiliki batas geografis yang valid untuk zoom.`,
                    );
                    alert(
                        `Layer "${slug}" tidak memiliki batas geografis yang valid untuk zoom. Pastikan layer sudah dicentang.`,
                    );
                }
            } catch (e) {
                console.error(
                    `Gagal mendapatkan bounds atau melakukan zoom untuk layer ${slug}:`,
                    e,
                );
                alert(
                    `Terjadi kesalahan saat mencoba zoom ke layer "${slug}". Pastikan layer sudah dicentang.`,
                );
            }
        } else {
            alert(
                `Layer "${slug}" belum aktif atau tidak ditemukan di peta. Harap centang layer tersebut terlebih dahulu.`,
            );
        }
    }

    // Event Listener untuk Tombol Zoom to Layer (di sidebar dropdown)
    document.addEventListener('click', function (event) {
        if (event.target.closest('.zoom-to-layer-btn')) {
            event.preventDefault();

            // Tutup dropdown menu
            document.querySelectorAll('.layer-menu-content').forEach((menu) => {
                menu.classList.add('hidden');
            });

            const target = event.target.closest('.zoom-to-layer-btn');
            const slug = target.dataset.layerSlug;
            zoomToLayer(slug);
        }
    });

    // ===============================================
    //          5. LOGIKA ATTRIBUTE PANEL (BAWAH)
    // ===============================================

    // Ambil elemen Panel
    const attributePanel = document.getElementById('attributePanel');
    const toggleAttributePanelBtn = document.getElementById(
        'toggleAttributePanel',
    );
    const layerNameDisplay = document.getElementById('layerNameDisplay');
    const toggleIcon = document.getElementById('toggleIcon');
    const modalAttributeTableContainer = document.getElementById(
        'modalAttributeTableContainer',
    );

    // Input Pencarian
    const attributeSearchInput = document.getElementById(
        'attributeSearchInput',
    );

    let isPanelActive = false;
    let lastActiveRow = null; // Menyimpan referensi baris tabel yang terakhir aktif

    // State untuk Highlight Fitur
    let highlightedLayer = null;
    let originalLayerStyle = {};

    // Fungsi untuk memfilter fitur berdasarkan kata kunci
    function filterFeatures(data, searchTerm) {
        if (!searchTerm || !data || !data.features) {
            return data ? data.features : [];
        }

        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        return data.features.filter((feature) => {
            // Cari di seluruh properti
            for (const key in feature.properties) {
                const value = feature.properties[key];
                if (value !== null && value !== undefined) {
                    if (
                        String(value)
                            .toLowerCase()
                            .includes(lowerCaseSearchTerm)
                    ) {
                        return true;
                    }
                }
            }
            return false;
        });
    }

    // Fungsi untuk membuat tabel dari data GeoJSON
    function createAttributeTable(featuresOnPage, startIndex) {
        // Harus menggunakan data asli (currentLayerData) untuk menentukan kolom yang konsisten
        if (!currentLayerData || !currentLayerData.features) {
            return '<p class="text-sm text-gray-500 text-center mt-5">Tidak ada data untuk layer ini.</p>';
        }

        if (featuresOnPage.length === 0) {
            if (currentSearchTerm) {
                return (
                    '<p class="text-sm text-gray-500 text-center mt-5">Tidak ada fitur yang cocok dengan kriteria pencarian: **' +
                    currentSearchTerm +
                    '**</p>'
                );
            }
            return '<p class="text-sm text-gray-500 text-center mt-5">Tidak ada fitur geometris (titik/garis/poligon) dalam layer ini.</p>';
        }

        // 1. Kumpulkan semua keys dari SELURUH fitur (agar kolom konsisten)
        const allKeys = new Set();
        currentLayerData.features.forEach((feature) => {
            if (feature.properties) {
                Object.keys(feature.properties).forEach((key) => {
                    if (
                        !key.startsWith('_') &&
                        key !== 'name' &&
                        key !== 'Nama' &&
                        key !== 'uniqueId'
                    ) {
                        allKeys.add(key);
                    }
                });
            }
        });

        const headerKeys = Array.from(allKeys);

        if (headerKeys.length === 0 && currentLayerData.features.length > 0) {
            return '<p class="text-sm text-gray-500 text-center mt-5">Fitur ditemukan, tetapi tidak ada atribut data.</p>';
        }

        // 2. Buat Header Tabel
        let tableHTML = `
            <div style="overflow-x: auto;" class="max-h-[30vh] overflow-y-auto">
            <table class="min-w-full divide-y divide-gray-300 border border-gray-300">
                <thead class="bg-gray-200" style="position: sticky; top: 0;"> 
                    <tr>
                        <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-300 whitespace-nowrap w-1">No.</th>
                        ${headerKeys
                            .map((key) => {
                                const formattedKey = key
                                    .replace(/_/g, ' ')
                                    .replace(/\b\w/g, (l) => l.toUpperCase());
                                return `<th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-300 whitespace-nowrap">${formattedKey}</th>`;
                            })
                            .join('')}
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
        `;

        // 3. Isi Baris Tabel
        featuresOnPage.forEach((feature, index) => {
            const uniqueId = feature.properties.uniqueId;
            const rowNumber = startIndex + index + 1; // Nomor urut

            let rowStyle = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';

            // Tambahkan class 'attribute-row' dan data-id
            tableHTML += `<tr class="${rowStyle} attribute-row cursor-pointer hover:bg-blue-100 transition-colors duration-150" data-feature-id="${uniqueId}">`;

            // Kolom Nomor Urut
            tableHTML += `<td class="px-3 py-2 text-sm text-gray-900 border-r border-gray-200 whitespace-nowrap font-semibold">${rowNumber}.</td>`;

            headerKeys.forEach((key) => {
                const value = feature.properties[key] || '-';

                // *** LOGIKA UNTUK MENAMPILKAN URL DI TABEL SEBAGAI LINK ***
                let displayValue = value;
                const isUrl =
                    typeof value === 'string' &&
                    (value.startsWith('http://') ||
                        value.startsWith('https://'));

                if (isUrl) {
                    // Di tabel, cukup tampilkan teks link yang bisa diklik.
                    displayValue = `<a href="${value}" target="_blank" class="text-blue-600 hover:underline">Lihat Link</a>`;
                }
                // *** AKHIR LOGIKA ***

                tableHTML += `<td class="px-3 py-2 text-sm text-gray-900 border-r border-gray-200 whitespace-nowrap">${displayValue}</td>`;
            });

            tableHTML += '</tr>';
        });

        tableHTML += '</tbody></table></div>';
        return tableHTML;
    }

    // Fungsi untuk membuat kontrol Pagination
    function renderPaginationControls(totalFeaturesFiltered, currentPage) {
        const totalPages = Math.ceil(totalFeaturesFiltered / ROWS_PER_PAGE);

        if (totalPages <= 1) {
            return '';
        }

        const startFeature = (currentPage - 1) * ROWS_PER_PAGE + 1;
        const endFeature = Math.min(
            currentPage * ROWS_PER_PAGE,
            totalFeaturesFiltered,
        );

        let html = `
            <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                
                <div class="sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p class="text-sm text-gray-700">
                            Menampilkan
                            <span class="font-medium">${startFeature}</span>
                            sampai
                            <span class="font-medium">${endFeature}</span>
                            dari
                            <span class="font-medium">${totalFeaturesFiltered}</span>
                            fitur
                        </p>
                    </div>
                    <div>
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button data-page="${currentPage - 1}" ${
                                currentPage === 1 ? 'disabled' : ''
                            }
                                class="prev-page-btn relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                                <span class="sr-only">Previous</span>
                                &laquo; Sebelumnya
                            </button>
                            
                            <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-600 text-sm font-medium text-white">
                                Halaman ${currentPage} dari ${totalPages}
                            </span>

                            <button data-page="${currentPage + 1}" ${
                                currentPage === totalPages ? 'disabled' : ''
                            }
                                class="next-page-btn relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                                <span class="sr-only">Next</span>
                                Berikutnya &raquo;
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    // Fungsi pembungkus untuk merender tabel, pagination, dan MENGELOLA STATE
    function displayAttributeTable(
        data,
        layerName,
        isNewLayerSelection = false,
    ) {
        if (!data) return;

        // Reset state jika layer baru dipilih
        if (isNewLayerSelection) {
            currentLayerData = data;
            currentSearchTerm = '';
            currentPage = 1;
            // Kosongkan input pencarian jika ada
            if (attributeSearchInput) {
                attributeSearchInput.value = '';
            }
        }

        const dataToUse = currentLayerData;

        // 1. FILTER DATA
        const filteredFeatures = filterFeatures(dataToUse, currentSearchTerm);
        const totalFeaturesFiltered = filteredFeatures.length;

        // 2. HANDLE PAGINATION (re-calculate based on filtered results)
        const totalPages = Math.ceil(totalFeaturesFiltered / ROWS_PER_PAGE);

        // Sesuaikan halaman saat ini jika filter menyebabkan total halaman berkurang
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        } else if (totalPages === 0 && currentSearchTerm) {
            currentPage = 1; // Biarkan 1 jika hasil filter 0
        }

        const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
        const endIndex = Math.min(
            startIndex + ROWS_PER_PAGE,
            totalFeaturesFiltered,
        );

        const featuresOnPage = filteredFeatures.slice(startIndex, endIndex);

        // 3. Render Tabel (menggunakan data yang sudah difilter & dipaginasi)
        const tableHTML = createAttributeTable(featuresOnPage, startIndex);

        // 4. Render Pagination (menggunakan total fitur yang difilter)
        const paginationHTML = renderPaginationControls(
            totalFeaturesFiltered,
            currentPage,
        );

        // 5. Update Nama Layer dan Jumlah Record (menggunakan total fitur *asli*)
        const totalFeaturesOriginal = dataToUse.features.length;
        let recordCountText = ` (${totalFeaturesOriginal} Record)`;
        if (currentSearchTerm) {
            recordCountText = ` (Menampilkan ${totalFeaturesFiltered} dari ${totalFeaturesOriginal} Record)`;
        }

        layerNameDisplay.innerHTML = `: ${layerName}<span class="text-sm font-normal text-gray-500">${recordCountText}</span>`;

        // 6. Gabungkan dan tampilkan
        modalAttributeTableContainer.innerHTML = `
            ${tableHTML}
            ${paginationHTML}
        `;

        // 7. Tambahkan Event Listener untuk Baris Tabel
        addTableRowClickListeners();

        // 8. Tambahkan Event Listener untuk Tombol Pagination
        document
            .querySelectorAll('.prev-page-btn, .next-page-btn')
            .forEach((btn) => {
                if (!btn.disabled) {
                    btn.addEventListener('click', function () {
                        const newPage = parseInt(this.dataset.page);
                        currentPage = newPage;
                        // Panggil ulang fungsi display (tidak perlu isNewLayerSelection=true)
                        displayAttributeTable(
                            currentLayerData,
                            layerName,
                            false,
                        );
                    });
                }
            });
    }

    // Fungsi untuk membuka/menutup panel (tetap sama)
    function togglePanel(forceState) {
        if (!attributePanel) {
            console.error('Error: attributePanel element not found.');
            return;
        }

        if (typeof forceState !== 'undefined') {
            isPanelActive = forceState;
        } else {
            isPanelActive = !isPanelActive;
        }

        if (isPanelActive) {
            attributePanel.classList.add('active');
            if (toggleIcon) {
                toggleIcon.classList.remove('rotate-180');
            }
        } else {
            attributePanel.classList.remove('active');
            if (toggleIcon) {
                toggleIcon.classList.add('rotate-180');
            }
        }
    }

    // FUNGSI BARU: Menangani klik pada baris tabel (termasuk highlight)
    function addTableRowClickListeners() {
        const rows = document.querySelectorAll('.attribute-row');

        // Reset status aktif baris
        if (lastActiveRow) {
            lastActiveRow.classList.remove('bg-blue-300', 'font-bold');
        }
        lastActiveRow = null;

        // Reset highlight layer sebelumnya
        if (highlightedLayer && originalLayerStyle) {
            // Jika Poligon/Polyline
            if (highlightedLayer.setStyle) {
                highlightedLayer.setStyle(originalLayerStyle);
            }
            // Jika Point/CircleMarker
            else if (
                highlightedLayer.options &&
                highlightedLayer.options.radius
            ) {
                highlightedLayer.setStyle({
                    ...originalLayerStyle,
                    radius: originalLayerStyle.radius,
                });
                highlightedLayer.redraw();
            }
        }
        highlightedLayer = null;

        rows.forEach((row) => {
            row.addEventListener('click', function () {
                const featureId = this.dataset.featureId;

                if (featureRefMap[featureId]) {
                    const layer = featureRefMap[featureId];

                    // 1. Kelola Style Highlight dan Baris Aktif

                    // a. RESET layer sebelumnya (jika ada)
                    if (highlightedLayer && originalLayerStyle) {
                        if (highlightedLayer.setStyle) {
                            highlightedLayer.setStyle(originalLayerStyle);
                        } else if (
                            highlightedLayer.options &&
                            highlightedLayer.options.radius
                        ) {
                            highlightedLayer.setStyle({
                                ...originalLayerStyle,
                                radius: originalLayerStyle.radius,
                            });
                            highlightedLayer.redraw();
                        }
                    }

                    // b. SIMPAN STYLE ASLI DAN APLIKASIKAN HIGHLIGHT BARU
                    const currentStyle = layer.options.style || layer.options;
                    originalLayerStyle = { ...currentStyle }; // Clone style saat ini

                    // Jika Point/CircleMarker
                    if (layer.options && layer.options.radius) {
                        // Simpan radius asli
                        originalLayerStyle.radius = layer.options.radius;
                        // Terapkan style highlight untuk point
                        layer.setStyle({
                            ...HIGHLIGHT_STYLE,
                            radius: HIGHLIGHT_STYLE.radius,
                        });
                        layer.redraw();
                    }
                    // Jika Polyline/Polygon
                    else if (layer.setStyle) {
                        layer.setStyle(HIGHLIGHT_STYLE);
                    }

                    highlightedLayer = layer; // Simpan referensi layer baru yang di-highlight

                    // c. Kelola Style Baris Tabel
                    if (lastActiveRow) {
                        lastActiveRow.classList.remove(
                            'bg-blue-300',
                            'font-bold',
                        );
                    }
                    this.classList.add('bg-blue-300', 'font-bold');
                    lastActiveRow = this;

                    // 2. Geser Peta (Pan/Zoom) dan Buka Pop-up
                    if (layer.getLatLng) {
                        const latlng = layer.getLatLng();
                        window.map.panTo(latlng);
                        if (layer.getPopup()) {
                            window.map.openPopup(layer.getPopup(), latlng);
                        }
                    } else if (layer.getBounds && layer.getBounds().isValid()) {
                        const bounds = layer.getBounds();
                        window.map.fitBounds(bounds, { padding: [50, 50] });
                        layer.openPopup();
                    } else {
                        layer.openPopup();
                        console.warn(
                            `Layer ${featureId} tidak memiliki bounds/latlng yang valid.`,
                        );
                    }
                } else {
                    console.warn(
                        `Layer dengan ID ${featureId} tidak ditemukan di peta.`,
                    );
                }
            });
        });
    }

    // Event Listener untuk Tombol View in Attribute Table (di sidebar)
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('view-attribute-btn')) {
            event.preventDefault();

            // Tutup dropdown menu
            document.querySelectorAll('.layer-menu-content').forEach((menu) => {
                menu.classList.add('hidden');
            });

            const layerName = event.target.dataset.layerName;
            const slug = event.target.dataset.layerSlug;

            // 1. Tampilkan Panel (jika belum terbuka)
            togglePanel(true);

            // 2. Update Nama Layer di Panel (sementara)
            layerNameDisplay.textContent = `: ${layerName}`;

            // 3. Cek data
            const dataWithIds = storedGeoJsonData[slug];
            if (!dataWithIds) {
                modalAttributeTableContainer.innerHTML =
                    '<p class="text-center text-lg text-red-500 mt-10">❌ Layer ini harus dicentang di tab Spot terlebih dahulu sebelum melihat tabel atribut.</p>';
                return;
            }

            // 4. Panggil display handler (isNewLayerSelection = true)
            displayAttributeTable(dataWithIds, layerName, true);
        }
    });

    // Event Listener untuk Input Pencarian
    if (attributeSearchInput) {
        attributeSearchInput.addEventListener('input', function () {
            // Hanya proses pencarian jika ada data layer aktif
            if (currentLayerData && currentLayerData.features) {
                currentSearchTerm = this.value.trim();
                currentPage = 1; // Reset ke halaman 1 setiap kali pencarian baru

                // Dapatkan nama layer aktif (dihilangkan count recordnya)
                const layerName = layerNameDisplay.textContent
                    .split('(')[0]
                    .replace(': ', '')
                    .trim();

                // Panggil ulang fungsi display untuk merender tabel yang difilter
                displayAttributeTable(currentLayerData, layerName, false);
            }
        });
    }

    // Event Listener untuk Tombol Toggle Panel (tetap sama)
    if (toggleAttributePanelBtn) {
        toggleAttributePanelBtn.addEventListener('click', function () {
            togglePanel();
        });
    }

    // Event Listener untuk header panel (tetap sama)
    const attributePanelHeader = document.getElementById(
        'attributePanelHeader',
    );
    if (attributePanelHeader) {
        attributePanelHeader.addEventListener('click', function (event) {
            // Hanya toggle jika bukan tombolnya sendiri atau input pencarian
            if (
                event.target.id !== 'toggleAttributePanel' &&
                !event.target.closest('#toggleAttributePanel') &&
                event.target.id !== 'attributeSearchInput' &&
                !event.target.closest('#attributeSearchInput')
            ) {
                togglePanel();
            }
        });
    }

    // ===============================================
    //          6. LOGIKA UPLOAD (GeoJSON & Shapefile)
    // ===============================================

    const uploadFileInput = document.getElementById('uploadFileInput');
    const processUploadBtn = document.getElementById('processUploadBtn');
    const uploadStatus = document.getElementById('uploadStatus');

    // Kontrol Upload
    const uploadColorPicker = document.getElementById('uploadColorPicker');
    const uploadOpacitySlider = document.getElementById('uploadOpacitySlider');
    const uploadOpacityValueDisplay = document.getElementById(
        'upload-opacity-value',
    );

    // Fungsi untuk memperbarui style layer upload yang sudah aktif
    function updateUploadedLayerStyle() {
        if (!uploadedLayer) return;

        const newOpacity = uploadOpacitySlider
            ? parseFloat(uploadOpacitySlider.value) / 100
            : 0.7;
        const newColor = uploadColorPicker
            ? uploadColorPicker.value
            : '#FF0000';

        // Perbarui style
        const newStyle = getGeoJsonStyle(newColor, newOpacity, true);
        const newPointFillOpacity = newOpacity * 0.8;

        uploadedLayer.eachLayer(function (featureLayer) {
            if (featureLayer.setStyle) {
                featureLayer.setStyle(newStyle);
            } else if (featureLayer.options && featureLayer.options.radius) {
                featureLayer.options.color = newColor;
                featureLayer.options.fillColor = newColor;
                featureLayer.options.opacity = newOpacity;
                featureLayer.options.fillOpacity = newPointFillOpacity;
                featureLayer.redraw();
            }
        });

        // Perbarui warna pada legenda layer upload
        if (uploadedLayerLegend) {
            uploadedLayerLegend.color = newColor;
            updateLegend();
        }
    }

    // Event listener saat file dipilih
    if (uploadFileInput) {
        uploadFileInput.addEventListener('change', function () {
            if (this.files.length > 0) {
                processUploadBtn.disabled = false;
                uploadStatus.textContent = `File dipilih: ${this.files[0].name}`;
            } else {
                processUploadBtn.disabled = true;
                uploadStatus.textContent = '';
            }
        });
    }

    // Event listener saat tombol "Tampilkan di Peta" diklik
    if (processUploadBtn) {
        processUploadBtn.addEventListener('click', function () {
            const file = uploadFileInput.files[0];
            if (!file) return;

            // Hapus layer dan legenda lama yang diupload jika ada
            if (uploadedLayer) {
                window.map.removeLayer(uploadedLayer);
                uploadedLayerLegend = null;
            }

            const fileName = file.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();

            uploadStatus.textContent = `Memproses ${fileName}...`;
            processUploadBtn.disabled = true; // Nonaktifkan selama memproses

            const reader = new FileReader();

            reader.onload = function (event) {
                if (fileExtension === 'geojson' || fileExtension === 'json') {
                    try {
                        const data = JSON.parse(event.target.result);
                        displayUploadedGeoJSON(data, fileName);
                    } catch (e) {
                        uploadStatus.textContent =
                            'Error: Gagal parsing GeoJSON.';
                        processUploadBtn.disabled = false;
                    }
                } else if (fileExtension === 'zip') {
                    // Shapefile (.zip) memerlukan library shpjs
                    uploadStatus.textContent =
                        'Memproses Shapefile (ZIP). Mohon tunggu...';

                    if (typeof shp !== 'undefined') {
                        // shpjs menggunakan ArrayBuffer
                        shp(event.target.result)
                            .then(function (data) {
                                displayUploadedGeoJSON(data, fileName);
                            })
                            .catch(function (error) {
                                uploadStatus.textContent =
                                    'Error memproses Shapefile. Pastikan file ZIP berisi file .shp, .shx, dan .dbf yang valid.';
                                console.error('Shapefile Error:', error);
                                processUploadBtn.disabled = false;
                            });
                    } else {
                        uploadStatus.textContent =
                            'Error: Library shpjs (untuk Shapefile ZIP) tidak ditemukan.';
                        processUploadBtn.disabled = false;
                    }
                } else {
                    uploadStatus.textContent = `Error: Format file ${fileExtension} tidak didukung.`;
                    processUploadBtn.disabled = false;
                }
            };

            // Baca file sebagai ArrayBuffer untuk Shapefile, atau Text untuk GeoJSON
            if (fileExtension === 'zip') {
                reader.readAsArrayBuffer(file);
            } else {
                reader.readAsText(file);
            }
        });
    }

    // Event listener untuk slider opacity upload
    if (uploadOpacitySlider) {
        uploadOpacitySlider.addEventListener('input', function () {
            const percentage = this.value;
            if (uploadOpacityValueDisplay) {
                uploadOpacityValueDisplay.textContent = percentage;
            }
            // Perbarui style secara real-time
            updateUploadedLayerStyle();
        });
    }

    // Event listener untuk color picker upload
    if (uploadColorPicker) {
        uploadColorPicker.addEventListener('input', function () {
            // Perbarui style secara real-time
            updateUploadedLayerStyle();
        });
    }

    // Fungsi untuk menampilkan GeoJSON yang diupload ke peta
    function displayUploadedGeoJSON(data, fileName) {
        // Jika data adalah array (hasil dari shpjs), gabungkan fiturnya
        if (Array.isArray(data)) {
            const combinedFeatures = data.reduce((acc, currentLayer) => {
                if (currentLayer.features) {
                    acc.push(...currentLayer.features);
                }
                return acc;
            }, []);
            data = { type: 'FeatureCollection', features: combinedFeatures };
        }

        if (!data || data.type !== 'FeatureCollection') {
            uploadStatus.textContent =
                'Error: Data yang diupload bukan format GeoJSON yang valid.';
            processUploadBtn.disabled = false;
            return;
        }

        // AMBIL NILAI DARI UI
        const uploadedColor = uploadColorPicker
            ? uploadColorPicker.value
            : '#00A0B0';
        const uploadedOpacity = uploadOpacitySlider
            ? parseFloat(uploadOpacitySlider.value) / 100
            : 0.7;

        uploadedLayer = addGeoJsonToMap(
            data,
            uploadedColor,
            true, // isUploaded: true
            uploadedOpacity, // opacity dari slider
        ).addTo(window.map);

        // Peta akan tetap pada posisi terakhir (defaultnya seluruh Indonesia)

        uploadStatus.textContent = `Berhasil menampilkan ${fileName} (${data.features.length} fitur) di peta.`;
        processUploadBtn.disabled = false;

        // Legenda: Update Legenda Layer Upload
        uploadedLayerLegend = {
            name: `Uploaded: ${fileName}`,
            color: uploadedColor,
        };
        updateLegend();
    }

    // ===============================================
    //          7. LOGIKA LEGENDA DINAMIS
    // ===============================================

    const legendContainer = document.getElementById('legendContainer');

    // Fungsi untuk me-render ulang seluruh legenda
    function updateLegend() {
        if (!legendContainer) return; // Null check

        let legendHTML = '';
        let count = 0;

        // 1. Tambahkan Legenda Layer Bawaan (Spots)
        for (const slug in activeLegends) {
            const item = activeLegends[slug];
            // Ambil opasitas layer aktif dari layer Leaflet (jika ada) atau gunakan default
            const layer = activeGeoJsonLayers[slug];
            const currentOpacity = layer ? layer.options.style.opacity : 0.7;

            legendHTML += `
                <div class="flex items-center gap-2">
                    <span style="display: inline-block; width: 12px; height: 12px; border: 1px solid ${item.color}; background-color: ${item.color}; opacity: ${currentOpacity};"></span>
                    <span>${item.name}</span>
                </div>
            `;
            count++;
        }

        // 2. Tambahkan Legenda Layer yang Di-upload
        if (uploadedLayerLegend) {
            const item = uploadedLayerLegend;
            // Ambil opasitas layer upload aktif dari layer Leaflet (jika ada) atau gunakan default
            const currentOpacity = uploadedLayer
                ? uploadedLayer.options.style.opacity
                : 0.7;

            legendHTML += `
                <div class="flex items-center gap-2">
                    <span style="display: inline-block; width: 12px; height: 12px; border: 1px solid ${item.color}; background-color: ${item.color}; opacity: ${currentOpacity};"></span>
                    <span class="font-bold text-red-600">${item.name}</span>
                </div>
            `;
            count++;
        }

        // 3. Tampilkan pesan jika tidak ada layer aktif
        if (count === 0) {
            legendHTML =
                '<p class="text-gray-500">Pilih layer di tab Spot untuk menampilkan legenda.</p>';
        }

        legendContainer.innerHTML = legendHTML;
    }

    // Panggil updateLegend saat inisialisasi
    updateLegend();

    // ===============================================
    //          8. LOGIKA KONTROL OPACITY & COLOR SPOT
    // ===============================================

    const opacitySliders = document.querySelectorAll('.opacity-slider');
    const colorPickers = document.querySelectorAll('.color-picker');

    // Event Listener untuk Opacity Slider
    opacitySliders.forEach((slider) => {
        const slug = slider.dataset.layerSlug;
        const valueDisplay = document.getElementById(`opacity-value-${slug}`);

        // 1. Update Teks Persentase saat slider digeser
        slider.addEventListener('input', function () {
            const percentage = this.value;
            if (valueDisplay) {
                valueDisplay.textContent = percentage;
            }

            // 2. Jika layer aktif, panggil fungsi updateLayerOpacity
            if (activeGeoJsonLayers[slug]) {
                const newOpacity = percentage / 100;
                updateLayerOpacity(slug, newOpacity);
                updateLegend(); // Perbarui opacity di legenda
            }
        });
    });

    // Event Listener untuk Color Picker
    colorPickers.forEach((picker) => {
        const slug = picker.dataset.layerSlug;

        picker.addEventListener('input', function () {
            const newColor = this.value;

            // 1. Jika layer aktif, panggil fungsi updateLayerColor
            if (activeGeoJsonLayers[slug]) {
                updateLayerColor(slug, newColor);
            }

            // 2. Update atribut data-color pada checkbox (untuk warna default saat layer di-reset/dicentang lagi)
            const checkbox = document.querySelector(
                `.layer-check[data-layer="${slug}"]`,
            );
            if (checkbox) {
                checkbox.dataset.color = newColor;
            }
        });
    });
}

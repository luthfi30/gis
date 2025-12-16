// resources/js/map-layers.js

// Memastikan variabel global sudah tersedia dari map-core.js
if (typeof window.map === 'undefined') {
    console.warn('map-layers.js dimuat sebelum map-core.js.');
} else {
    // ===============================================
    //  LOGIKA UTAMA LAYER CONTROL SPOT (PETA & POPUP)
    // ===============================================

    /**
     * Fungsi inti untuk menambahkan GeoJSON ke Peta.
     * Didefinisikan di window agar dapat dipanggil oleh map-upload.js.
     */
    window.addGeoJsonToMap = (
        data,
        layerColor,
        isUploaded = false,
        opacityValue = 0.7,
    ) => {
        const geoJsonStyle = window.getGeoJsonStyle(
            layerColor,
            opacityValue,
            isUploaded,
        );

        return L.geoJSON(data, {
            style: geoJsonStyle,

            // Handle Point/Marker
            pointToLayer: function (feature, latlng) {
                const pointFillOpacity = opacityValue * 0.8;
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
                    feature.properties.uniqueId = `feat-${++window.featureIdCounter}`;
                }
                const uniqueId = feature.properties.uniqueId;
                window.featureRefMap[uniqueId] = layer; // Simpan referensi layer

                // 2. Logika Popup (Menampilkan semua atribut)
                if (feature.properties) {
                    const title =
                        feature.properties.name ||
                        feature.properties.Nama ||
                        'Detail Fitur GeoJSON';

                    let popupContent = `
                        <div style="font-family: Arial, sans-serif; max-width: 300px; padding: 5px;">
                            <h4 style="margin: 0 0 10px 0; padding-bottom: 5px; border-bottom: 2px solid ${layerColor}; color: ${layerColor}; font-size: 1.1em;">
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
                            key !== 'uniqueId'
                        ) {
                            const formattedKey = key
                                .replace(/_/g, ' ')
                                .replace(/\b\w/g, (l) => l.toUpperCase());

                            // LOGIKA UNTUK MENAMPILKAN GAMBAR
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
                                // 1. Inisialisasi variabel default
                                let finalImageUrl = value;
                                let fullResUrl = value; // <--- PENTING: Default value harus ada!

                                // 2. Penanganan khusus Google Drive
                                if (window.isGoogleDriveUrl(value)) {
                                    finalImageUrl =
                                        window.getEmbeddableGoogleDriveUrl(
                                            value,
                                        );
                                    // Ubah ke resolusi tinggi untuk modal (s1200)
                                    fullResUrl = finalImageUrl.replace(
                                        /sz=[^&]+/,
                                        'sz=s1200',
                                    );
                                }

                                // 3. Tampilkan Popup
                                displayValue = `
                                    <div class="cursor-pointer group">
                                        <img src="${finalImageUrl}" 
                                             data-full-url="${fullResUrl}"
                                             class="popup-image-trigger block border border-gray-300 hover:opacity-90 transition-opacity" 
                                             alt="${formattedKey}" 
                                             style="max-width: 100%; height: auto; margin: 5px 0;">     
                                    </div>
                                `;
                            }

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
    };

    /**
     * Memperbarui opasitas (garis dan isi) dari layer GeoJSON yang sudah ada di peta.
     */
    window.updateLayerOpacity = (slug, newOpacity) => {
        const layer = window.activeGeoJsonLayers[slug];
        if (layer) {
            const currentColor = layer.options.style.color || '#0078FF';
            const isUploaded = !window.activeLegends[slug];
            const newStyle = window.getGeoJsonStyle(
                currentColor,
                newOpacity,
                isUploaded,
            );
            const newPointFillOpacity = newOpacity * 0.8;

            layer.eachLayer(function (featureLayer) {
                if (featureLayer.setStyle) {
                    featureLayer.setStyle(newStyle);
                } else if (
                    featureLayer.options &&
                    featureLayer.options.radius
                ) {
                    featureLayer.options.opacity = newOpacity;
                    featureLayer.options.fillOpacity = newPointFillOpacity;
                    featureLayer.redraw();
                }
            });
        }
    };

    /**
     * Memperbarui warna (garis dan isi) dari layer GeoJSON yang sudah ada di peta.
     */
    window.updateLayerColor = (slug, newColor) => {
        const layer = window.activeGeoJsonLayers[slug];
        if (layer) {
            const currentOpacity = layer.options.style.opacity || 0.7;
            const isUploaded = !window.activeLegends[slug];
            const newStyle = window.getGeoJsonStyle(
                newColor,
                currentOpacity,
                isUploaded,
            );
            const newPointFillOpacity = currentOpacity * 0.8;

            // Perbarui data warna di checkbox
            const checkbox = document.querySelector(
                `.layer-check[data-layer="${slug}"]`,
            );
            if (checkbox) {
                checkbox.dataset.color = newColor;
            }

            layer.eachLayer(function (featureLayer) {
                if (featureLayer.setStyle) {
                    featureLayer.setStyle(newStyle);
                } else if (
                    featureLayer.options &&
                    featureLayer.options.radius
                ) {
                    featureLayer.options.color = newColor;
                    featureLayer.options.fillColor = newColor;
                    featureLayer.options.opacity = currentOpacity;
                    featureLayer.options.fillOpacity = newPointFillOpacity;
                    featureLayer.redraw();
                }
            });

            // Perbarui legenda
            if (window.activeLegends[slug]) {
                window.activeLegends[slug].color = newColor;
                window.updateLegend();
            }
        }
    };

    // Event Listener untuk Checkbox Layer (Sidebar)
    const layerCheckboxes = document.querySelectorAll('.layer-check');

    layerCheckboxes.forEach((checkbox) => {
        const slug = checkbox.dataset.layer;
        const slider = document.getElementById(`opacity-slider-${slug}`);
        const colorPicker = document.getElementById(`color-picker-${slug}`);

        checkbox.addEventListener('change', function () {
            const url = this.dataset.geojsonUrl;

            // Ambil nilai opacity dan warna saat ini dari UI
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
                            const dataWithIds = JSON.parse(
                                JSON.stringify(data),
                            );

                            const layer = window
                                .addGeoJsonToMap(
                                    dataWithIds,
                                    currentColor,
                                    false,
                                    currentOpacity,
                                )
                                .addTo(window.map);

                            window.activeGeoJsonLayers[slug] = layer;

                            // Simpan data GeoJSON yang sudah dimodifikasi
                            window.storedGeoJsonData[slug] = dataWithIds;

                            // Legenda: Tambahkan ke legenda
                            window.activeLegends[slug] = {
                                name: layerName,
                                color: currentColor,
                            };
                            window.updateLegend();
                        })
                        .catch((error) =>
                            console.error('Error loading GeoJSON:', error),
                        );
                }
            } else {
                if (window.activeGeoJsonLayers[slug]) {
                    window.map.removeLayer(window.activeGeoJsonLayers[slug]);
                    delete window.activeGeoJsonLayers[slug];

                    // Hapus data dari memori saat layer dimatikan
                    delete window.storedGeoJsonData[slug];

                    // Legenda: Hapus dari legenda
                    delete window.activeLegends[slug];
                    window.updateLegend();
                }
            }
        });
    });

    // ===============================================
    //          LOGIKA SIDEBAR DROPDOWN MENU
    // ===============================================

    document.addEventListener('click', function (event) {
        // Logika untuk Tombol Tiga Titik (Membuka/Menutup Dropdown)
        if (event.target.closest('.layer-menu-btn')) {
            const button = event.target.closest('.layer-menu-btn');
            const content = button.nextElementSibling;

            // Tutup semua menu lain
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
    const zoomToLayer = (slug) => {
        const layer = window.activeGeoJsonLayers[slug];

        if (layer) {
            try {
                const bounds = layer.getBounds();
                if (bounds.isValid()) {
                    window.map.fitBounds(bounds, { padding: [50, 50] });
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
    };

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
    //  LOGIKA KONTROL OPACITY & COLOR SPOT
    // ===============================================

    const opacitySliders = document.querySelectorAll('.opacity-slider');
    const colorPickers = document.querySelectorAll('.color-picker');

    // Event Listener untuk Opacity Slider
    opacitySliders.forEach((slider) => {
        const slug = slider.dataset.layerSlug;
        const valueDisplay = document.getElementById(`opacity-value-${slug}`);

        slider.addEventListener('input', function () {
            const percentage = this.value;
            if (valueDisplay) {
                valueDisplay.textContent = percentage;
            }

            if (window.activeGeoJsonLayers[slug]) {
                const newOpacity = percentage / 100;
                window.updateLayerOpacity(slug, newOpacity);
                window.updateLegend();
            }
        });
    });

    // Event Listener untuk Color Picker
    colorPickers.forEach((picker) => {
        const slug = picker.dataset.layerSlug;

        picker.addEventListener('input', function () {
            const newColor = this.value;

            if (window.activeGeoJsonLayers[slug]) {
                window.updateLayerColor(slug, newColor);
            }

            // Update atribut data-color pada checkbox
            const checkbox = document.querySelector(
                `.layer-check[data-layer="${slug}"]`,
            );
            if (checkbox) {
                checkbox.dataset.color = newColor;
            }
        });
    });
}

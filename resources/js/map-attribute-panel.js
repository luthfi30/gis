// resources/js/map-attribute-panel.js

// Memastikan variabel global sudah tersedia dari map-core.js
if (typeof window.map === 'undefined') {
    console.warn('map-attribute-panel.js dimuat sebelum map-core.js.');
} else {
    // ===============================================
    //          KONFIGURASI
    // ===============================================
    const ROWS_PER_PAGE = 50;

    // ===============================================
    //          1. INISIALISASI VARIABEL & DOM
    // ===============================================

    const attributePanel = document.getElementById('attributePanel');
    const resizeHandle = document.getElementById('resizeHandle');
    const closeAttributePanelBtn = document.getElementById(
        'closeAttributePanel',
    );
    const layerNameDisplay = document.getElementById('layerNameDisplay');
    const modalAttributeTableContainer = document.getElementById(
        'modalAttributeTableContainer',
    );
    const attributeSearchInput = document.getElementById(
        'attributeSearchInput',
    );

    // Elemen Menu Opsi & Export
    const toggleOptionsBtn = document.getElementById('toggleOptionsBtn');
    const optionsDropdown = document.getElementById('optionsDropdown');
    const btnExportCSV = document.getElementById('btnExportCSV');
    const btnExportExcel = document.getElementById('btnExportExcel');
    const columnToggleContainer = document.getElementById(
        'columnToggleContainer',
    );

    // VARIABEL STATE HIGHLIGHT (PERBAIKAN DISINI)
    let lastActiveRow = null; // Menyimpan elemen TR tabel yang aktif
    let highlightedLayer = null; // Menyimpan objek Layer Leaflet yang sedang kuning
    let originalLayerStyle = null; // Menyimpan style asli sebelum jadi kuning
    let isResizing = false;

    window.hiddenAttributes = new Set();
    window.canViewAllAttributes = true;

    // Set panel hidden saat awal load
    if (attributePanel) {
        attributePanel.style.height = '0px';
        attributePanel.style.display = 'none';
    }

    // ===============================================
    //          2. LOGIKA RESIZE MANUAL (DRAG)
    // ===============================================

    if (resizeHandle) {
        resizeHandle.addEventListener('mousedown', function (e) {
            e.preventDefault();
            isResizing = true;
            document.body.style.cursor = 'ns-resize';
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });
    }

    const handleMouseMove = (e) => {
        if (!isResizing) return;
        const newHeight = window.innerHeight - e.clientY;
        if (newHeight > 60 && newHeight < window.innerHeight * 0.9) {
            attributePanel.style.height = `${newHeight}px`;
        }
    };

    const handleMouseUp = () => {
        isResizing = false;
        document.body.style.cursor = 'default';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const openPanel = () => {
        attributePanel.style.display = 'flex';
        if (parseInt(attributePanel.style.height) < 100) {
            attributePanel.style.height = '300px';
        }
    };

    const closePanel = () => {
        attributePanel.style.height = '0px';
        setTimeout(() => {
            if (attributePanel.style.height === '0px') {
                attributePanel.style.display = 'none';
            }
        }, 100);
    };

    if (closeAttributePanelBtn) {
        closeAttributePanelBtn.addEventListener('click', closePanel);
    }

    // ===============================================
    //          3. LOGIKA FILTER & TABEL DATA
    // ===============================================

    const filterFeatures = (data, searchTerm) => {
        if (!searchTerm || !data || !data.features)
            return data ? data.features : [];
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return data.features.filter((feature) => {
            for (const key in feature.properties) {
                const value = feature.properties[key];
                if (value !== null && value !== undefined) {
                    if (
                        String(value)
                            .toLowerCase()
                            .includes(lowerCaseSearchTerm)
                    )
                        return true;
                }
            }
            return false;
        });
    };

    const getAllowedKeys = (allKeys) => {
        return allKeys.filter((key) => {
            if (window.hiddenAttributes.has(key)) return false;
            if (window.canViewAllAttributes) return true;
            return key.toLowerCase().includes('name');
        });
    };

    const createAttributeTable = (featuresOnPage, startIndex) => {
        if (!window.currentLayerData || !window.currentLayerData.features)
            return '<p class="text-sm text-gray-500 text-center mt-5">Tidak ada data.</p>';
        if (featuresOnPage.length === 0)
            return '<p class="text-sm text-gray-500 text-center mt-5">Tidak ada fitur yang cocok.</p>';

        const allKeysSet = new Set();
        window.currentLayerData.features.forEach((feature) => {
            if (feature.properties) {
                Object.keys(feature.properties).forEach((key) => {
                    if (
                        !key.startsWith('_') &&
                        key !== 'uniqueId' &&
                        key !== 'layerSlug' &&
                        key !== 'style'
                    ) {
                        allKeysSet.add(key);
                    }
                });
            }
        });
        const allKeys = Array.from(allKeysSet);
        const visibleKeys = getAllowedKeys(allKeys);

        if (!window.canViewAllAttributes && visibleKeys.length === 0) {
            return {
                html: '<div class="p-4 text-center text-red-500 bg-red-50 border border-red-200 rounded m-4">🚫 Anda tidak memiliki izin untuk melihat detail atribut data ini.</div>',
                allKeys: allKeys,
            };
        }

        let tableHTML = `
            <div style="overflow-x: auto;" class="max-h-full overflow-y-auto h-full pb-10"> 
            <table class="min-w-full divide-y divide-gray-300 border border-gray-300 relative">
                <thead class="bg-gray-200 sticky top-0 z-10 shadow-sm"> 
                    <tr>
                        <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase border-r w-1">No.</th>
                        ${visibleKeys
                            .map(
                                (key) =>
                                    `<th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase border-r whitespace-nowrap">${key.replace(
                                        /_/g,
                                        ' ',
                                    )}</th>`,
                            )
                            .join('')}
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
        `;

        featuresOnPage.forEach((feature, index) => {
            const uniqueId = feature.properties.uniqueId;
            const rowNumber = startIndex + index + 1;
            let rowStyle = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';

            tableHTML += `<tr class="${rowStyle} attribute-row cursor-pointer hover:bg-blue-100 transition-colors duration-150" data-feature-id="${uniqueId}">`;
            tableHTML += `<td class="px-3 py-2 text-sm text-gray-900 border-r border-gray-200 font-semibold">${rowNumber}.</td>`;

            visibleKeys.forEach((key) => {
                const value = feature.properties[key] || '-';
                // ... (di dalam headerKeys.forEach) ...

                // *** LOGIKA UNTUK MENAMPILKAN URL DI TABEL ***
                let displayValue = value;

                // 1. Cek apakah kolom gambar
                const lowerKey = key.toLowerCase();
                const isImageKey =
                    lowerKey.includes('image') || lowerKey.includes('foto');

                // 2. Cek apakah URL
                const isUrl =
                    typeof value === 'string' &&
                    (value.startsWith('http://') ||
                        value.startsWith('https://'));

                if (isUrl) {
                    if (isImageKey) {
                        let finalImageUrl = value;
                        let fullResUrl = value;

                        // Helper GDrive (pastikan window.isGoogleDriveUrl tersedia dari map-core)
                        if (
                            window.isGoogleDriveUrl &&
                            window.isGoogleDriveUrl(value)
                        ) {
                            finalImageUrl =
                                window.getEmbeddableGoogleDriveUrl(value);
                            fullResUrl = finalImageUrl.replace(
                                /sz=[^&]+/,
                                'sz=s1200',
                            );
                        }

                        // TAMPILKAN SEBAGAI SPAN PEMICU MODAL
                        displayValue = `
                            <div class="flex items-center gap-1">
                                <span 
                                    class="popup-image-trigger text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium flex items-center gap-1" 
                                    data-full-url="${fullResUrl}">
                                    📷 Lihat Gambar
                                </span>
                            </div>
                        `;
                    } else {
                        // Link biasa
                        displayValue = `<a href="${value}" target="_blank" class="text-blue-600 hover:underline flex items-center gap-1">🔗 Buka Link</a>`;
                    }
                }
                // *** AKHIR LOGIKA ***

                tableHTML += `<td class="px-3 py-2 text-sm text-gray-900 border-r border-gray-200 whitespace-nowrap">${displayValue}</td>`;
            });
        });

        tableHTML += '</tbody></table></div>';
        return { html: tableHTML, allKeys: allKeys };
    };

    const renderColumnToggles = (allKeys, layerName) => {
        if (!columnToggleContainer) return;
        columnToggleContainer.innerHTML = '';

        allKeys.forEach((key) => {
            if (
                !window.canViewAllAttributes &&
                !key.toLowerCase().includes('name')
            ) {
                return;
            }

            const itemDiv = document.createElement('div');
            itemDiv.className = 'flex items-center space-x-2';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `toggle-col-${key}`;
            checkbox.className =
                'rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 h-3 w-3';

            checkbox.checked = !window.hiddenAttributes.has(key);

            const label = document.createElement('label');
            label.htmlFor = `toggle-col-${key}`;
            label.className =
                'text-xs text-gray-700 cursor-pointer select-none flex-1 truncate';
            label.textContent = key.replace(/_/g, ' ');

            checkbox.addEventListener('change', function () {
                if (this.checked) {
                    window.hiddenAttributes.delete(key);
                } else {
                    window.hiddenAttributes.add(key);
                }
                displayAttributeTable(
                    window.currentLayerData,
                    layerName,
                    false,
                );
            });

            itemDiv.appendChild(checkbox);
            itemDiv.appendChild(label);
            columnToggleContainer.appendChild(itemDiv);
        });
    };

    const displayAttributeTable = (
        data,
        layerName,
        isNewLayerSelection = false,
    ) => {
        if (!data) return;

        if (isNewLayerSelection) {
            window.currentLayerData = data;
            window.currentSearchTerm = '';
            window.currentPage = 1;
            window.hiddenAttributes.clear();
            if (attributeSearchInput) attributeSearchInput.value = '';
        }

        const dataToUse = window.currentLayerData;
        const filteredFeatures = filterFeatures(
            dataToUse,
            window.currentSearchTerm,
        );
        const totalFeaturesFiltered = filteredFeatures.length;

        const totalPages = Math.ceil(totalFeaturesFiltered / ROWS_PER_PAGE);

        if (window.currentPage > totalPages && totalPages > 0)
            window.currentPage = totalPages;
        else if (totalPages === 0 && window.currentSearchTerm)
            window.currentPage = 1;

        const startIndex = (window.currentPage - 1) * ROWS_PER_PAGE;
        const endIndex = Math.min(
            startIndex + ROWS_PER_PAGE,
            totalFeaturesFiltered,
        );

        const featuresOnPage = filteredFeatures.slice(startIndex, endIndex);

        const result = createAttributeTable(featuresOnPage, startIndex);
        let tableHTML = '';
        let allKeys = [];

        if (typeof result === 'string') {
            tableHTML = result;
        } else {
            tableHTML = result.html;
            allKeys = result.allKeys;
        }

        const renderPaginationControls = (
            totalFeaturesFiltered,
            currentPage,
        ) => {
            const totalPages = Math.ceil(totalFeaturesFiltered / ROWS_PER_PAGE);
            if (totalPages <= 1) return '';

            const startFeature = (currentPage - 1) * ROWS_PER_PAGE + 1;
            const endFeature = Math.min(
                currentPage * ROWS_PER_PAGE,
                totalFeaturesFiltered,
            );

            return `
                <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-2 sm:px-6 shrink-0 h-12">
                    <p class="text-xs text-gray-700">Show ${startFeature}-${endFeature} of ${totalFeaturesFiltered}</p>
                    <div class="flex space-x-2">
                         <button data-page="${currentPage - 1}" ${
                             currentPage === 1 ? 'disabled' : ''
                         } class="prev-page-btn px-2 py-1 border text-xs rounded hover:bg-gray-50 disabled:opacity-50">Prev</button>
                         <button data-page="${currentPage + 1}" ${
                             currentPage === totalPages ? 'disabled' : ''
                         } class="next-page-btn px-2 py-1 border text-xs rounded hover:bg-gray-50 disabled:opacity-50">Next</button>
                    </div>
                </div>
            `;
        };
        const paginationHTML = renderPaginationControls(
            totalFeaturesFiltered,
            window.currentPage,
        );

        layerNameDisplay.innerHTML = `: ${layerName} <span class="text-xs text-gray-500">(${totalFeaturesFiltered} records)</span>`;

        modalAttributeTableContainer.innerHTML = `
            <div class="flex flex-col h-full">
                ${tableHTML}
                ${paginationHTML}
            </div>
        `;

        addTableRowClickListeners(layerName);

        if (allKeys.length > 0) {
            renderColumnToggles(allKeys, layerName);
        }

        document
            .querySelectorAll('.prev-page-btn, .next-page-btn')
            .forEach((btn) => {
                if (!btn.disabled) {
                    btn.addEventListener('click', function () {
                        window.currentPage = parseInt(this.dataset.page);
                        displayAttributeTable(
                            window.currentLayerData,
                            layerName,
                            false,
                        );
                    });
                }
            });
    };

    /**
     * FUNGSI LISTENER KLIK BARIS TABEL (HIGHLIGHTER FIX)
     */
    const addTableRowClickListeners = (layerName) => {
        const rows = document.querySelectorAll('.attribute-row');

        rows.forEach((row) => {
            row.addEventListener('click', function () {
                const featureId = this.dataset.featureId;
                const layer = window.featureRefMap[featureId];

                if (!layer) return;

                // 1. RESET HIGHLIGHT LAMA (JIKA ADA)
                if (highlightedLayer) {
                    // Kembalikan style lama
                    if (originalLayerStyle) {
                        // Gunakan setStyle untuk polygon/line
                        if (highlightedLayer.setStyle) {
                            highlightedLayer.setStyle(originalLayerStyle);
                        }
                        // Khusus CircleMarker, kembalikan radius jika disimpan
                        if (
                            highlightedLayer.setRadius &&
                            originalLayerStyle.radius
                        ) {
                            highlightedLayer.setRadius(
                                originalLayerStyle.radius,
                            );
                        }
                    }
                    highlightedLayer = null;
                }

                // 2. SIMPAN STYLE SAAT INI SEBAGAI ORIGINAL
                // Kita gunakan Object Spread {...} untuk membuat copy objek, bukan referensi
                if (layer.options) {
                    originalLayerStyle = { ...layer.options };
                }

                // 3. TERAPKAN HIGHLIGHT BARU
                if (layer.setStyle) {
                    layer.setStyle(window.HIGHLIGHT_STYLE);
                }

                // Khusus CircleMarker, pastikan radius tidak mengecil/berubah aneh
                // Opsional: perbesar radius saat highlight jika itu titik
                // if (layer.setRadius) { layer.setRadius(8); }

                // 4. BAWA KE DEPAN (Supaya garis highlight terlihat jelas di atas layer lain)
                if (layer.bringToFront) {
                    layer.bringToFront();
                }

                // 5. UPDATE REFERENCE
                highlightedLayer = layer;

                // 6. VISUAL TABEL (Ubah warna baris)
                if (lastActiveRow) {
                    lastActiveRow.classList.remove('bg-blue-300', 'font-bold');
                }
                this.classList.add('bg-blue-300', 'font-bold');
                lastActiveRow = this;

                // 7. ZOOM/PAN KE FEATURE
                if (layer.getLatLng) {
                    // Untuk Point
                    const latlng = layer.getLatLng();
                    window.map.panTo(latlng);
                    if (layer.getPopup())
                        window.map.openPopup(layer.getPopup(), latlng);
                } else if (layer.getBounds && layer.getBounds().isValid()) {
                    // Untuk Polygon/Line
                    window.map.fitBounds(layer.getBounds(), {
                        padding: [50, 50],
                    });
                    layer.openPopup();
                }
            });
        });
    };

    // ===============================================
    //          4. EVENT LISTENERS UTAMA
    // ===============================================

    document.addEventListener('click', function (event) {
        const btn = event.target.closest('.view-attribute-btn');

        if (btn) {
            event.preventDefault();
            document
                .querySelectorAll('.layer-menu-content')
                .forEach((menu) => menu.classList.add('hidden'));

            const layerName = btn.dataset.layerName;
            const slug = btn.dataset.layerSlug;

            // LOGIKA CHECKBOX PERMISSION
            const checkbox = document.querySelector(
                `.layer-check[data-layer="${slug}"]`,
            );
            let rawPermission = '0';

            if (checkbox) {
                rawPermission = checkbox.dataset.canViewAttribute;
            }

            window.canViewAllAttributes = rawPermission == '1';

            openPanel();

            layerNameDisplay.textContent = `: ${layerName}`;
            const dataWithIds = window.storedGeoJsonData[slug];

            if (!dataWithIds) {
                modalAttributeTableContainer.innerHTML =
                    '<p class="text-center text-red-500 mt-10">Layer belum aktif di peta.</p>';
                return;
            }

            displayAttributeTable(dataWithIds, layerName, true);
        }
    });

    if (attributeSearchInput) {
        attributeSearchInput.addEventListener('input', function () {
            if (window.currentLayerData && window.currentLayerData.features) {
                window.currentSearchTerm = this.value.trim();
                window.currentPage = 1;
                const layerName = layerNameDisplay.textContent
                    .split('(')[0]
                    .replace(': ', '')
                    .trim();
                displayAttributeTable(
                    window.currentLayerData,
                    layerName,
                    false,
                );
            }
        });
    }

    // ===============================================
    //          5. LOGIKA DROPDOWN & EXPORT
    // ===============================================

    if (toggleOptionsBtn && optionsDropdown) {
        toggleOptionsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            optionsDropdown.classList.toggle('hidden');
        });
        document.addEventListener('click', (e) => {
            if (
                !toggleOptionsBtn.contains(e.target) &&
                !optionsDropdown.contains(e.target)
            ) {
                optionsDropdown.classList.add('hidden');
            }
        });
    }

    const getExportFileName = (extension) => {
        let name = 'data-export';
        const layerLabel = document.getElementById('layerNameDisplay');
        if (layerLabel && layerLabel.textContent) {
            name = layerLabel.textContent
                .replace(/^:\s*/, '')
                .trim()
                .replace(/[^a-zA-Z0-9-_ ]/g, '');
        }
        const date = new Date().toISOString().slice(0, 10);
        return `${name}_${date}.${extension}`;
    };

    const getCleanExportKeys = (features) => {
        const allKeys = new Set();
        features.forEach((feature) => {
            if (feature.properties) {
                Object.keys(feature.properties).forEach((key) => {
                    if (
                        !key.startsWith('_') &&
                        key !== 'uniqueId' &&
                        key !== 'layerSlug' &&
                        key !== 'style'
                    ) {
                        allKeys.add(key);
                    }
                });
            }
        });
        return getAllowedKeys(Array.from(allKeys));
    };

    if (btnExportCSV) {
        btnExportCSV.addEventListener('click', () => {
            if (!window.currentLayerData || !window.currentLayerData.features) {
                alert('Tidak ada data untuk diexport.');
                return;
            }
            const features = window.currentLayerData.features;
            const keys = getCleanExportKeys(features);
            if (keys.length === 0) {
                alert('Tidak ada kolom yang diizinkan untuk diexport.');
                return;
            }
            let csvContent = keys.join(',') + '\n';
            features.forEach((feature) => {
                const row = keys.map((key) => {
                    let val = feature.properties[key] || '';
                    val = String(val).replace(/"/g, '""');
                    if (val.search(/("|,|\n)/g) >= 0) val = `"${val}"`;
                    return val;
                });
                csvContent += row.join(',') + '\n';
            });
            const blob = new Blob([csvContent], {
                type: 'text/csv;charset=utf-8;',
            });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = getExportFileName('csv');
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            optionsDropdown.classList.add('hidden');
        });
    }

    if (btnExportExcel) {
        btnExportExcel.addEventListener('click', () => {
            if (!window.currentLayerData || !window.currentLayerData.features) {
                alert('Tidak ada data untuk diexport.');
                return;
            }
            const features = window.currentLayerData.features;
            const keys = getCleanExportKeys(features);
            if (keys.length === 0) {
                alert('Tidak ada kolom yang diizinkan untuk diexport.');
                return;
            }
            let excelContent = `
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                <head>
                    <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
                </head>
                <body>
                    <table border="1">
                        <thead>
                            <tr style="background-color: #f0f0f0; font-weight: bold;">
                                ${keys.map((k) => `<th>${k}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
            `;
            features.forEach((feature) => {
                excelContent += '<tr>';
                keys.forEach((key) => {
                    let val = feature.properties[key] || '';
                    excelContent += `<td>${val}</td>`;
                });
                excelContent += '</tr>';
            });
            excelContent += '</tbody></table></body></html>';
            const blob = new Blob([excelContent], {
                type: 'application/vnd.ms-excel',
            });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = getExportFileName('xls');
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            optionsDropdown.classList.add('hidden');
        });
    }
}

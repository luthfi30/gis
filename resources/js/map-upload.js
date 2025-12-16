// resources/js/map-upload.js

// Memastikan variabel global sudah tersedia dari map-core.js
if (typeof window.map === 'undefined') {
    console.warn('map-upload.js dimuat sebelum map-core.js.');
} else {
    // ===============================================
    //          LOGIKA UPLOAD (GeoJSON & Shapefile)
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
    const updateUploadedLayerStyle = () => {
        if (!window.uploadedLayer) return;

        const newOpacity = uploadOpacitySlider
            ? parseFloat(uploadOpacitySlider.value) / 100
            : 0.7;
        const newColor = uploadColorPicker
            ? uploadColorPicker.value
            : '#00A0B0';

        // Perbarui style
        const newStyle = window.getGeoJsonStyle(newColor, newOpacity, true);
        const newPointFillOpacity = newOpacity * 0.8;

        window.uploadedLayer.eachLayer(function (featureLayer) {
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
        if (window.uploadedLayerLegend) {
            window.uploadedLayerLegend.color = newColor;
            window.updateLegend();
        }
    };

    // Fungsi untuk menampilkan GeoJSON yang diupload ke peta
    const displayUploadedGeoJSON = (data, fileName) => {
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

        window.uploadedLayer = window
            .addGeoJsonToMap(
                data,
                uploadedColor,
                true, // isUploaded: true
                uploadedOpacity, // opacity dari slider
            )
            .addTo(window.map);

        uploadStatus.textContent = `Berhasil menampilkan ${fileName} (${data.features.length} fitur) di peta.`;
        processUploadBtn.disabled = false;

        // Legenda: Update Legenda Layer Upload
        window.uploadedLayerLegend = {
            name: `Uploaded: ${fileName}`,
            color: uploadedColor,
        };
        window.updateLegend();
    };

    // ===============================================
    //          EVENT LISTENERS
    // ===============================================

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
            if (window.uploadedLayer) {
                window.map.removeLayer(window.uploadedLayer);
                window.uploadedLayerLegend = null;
            }

            const fileName = file.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();

            uploadStatus.textContent = `Memproses ${fileName}...`;
            processUploadBtn.disabled = true;

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
            updateUploadedLayerStyle();
        });
    }

    // Event listener untuk color picker upload
    if (uploadColorPicker) {
        uploadColorPicker.addEventListener('input', function () {
            updateUploadedLayerStyle();
        });
    }
}

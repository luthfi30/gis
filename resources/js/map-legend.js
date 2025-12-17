// resources/js/map-legend.js

// ===============================================
//          LOGIKA LEGENDA DINAMIS
// ===============================================

const legendContainer = document.getElementById('legendContainer');

/**
 * Fungsi untuk me-render ulang seluruh legenda.
 * Didefinisikan di window agar dapat dipanggil oleh modul lain.
 */
window.updateLegend = () => {
    if (!legendContainer) return;

    let legendHTML = '';
    let count = 0;

    // 1. Tambahkan Legenda Layer Bawaan (Spots)
    for (const slug in window.activeLegends) {
        const item = window.activeLegends[slug];
        const layer = window.activeGeoJsonLayers[slug];
        // Gunakan style opacity dari layer Leaflet yang aktif
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
    if (window.uploadedLayerLegend) {
        const item = window.uploadedLayerLegend;
        const currentOpacity = window.uploadedLayer
            ? window.uploadedLayer.options.style.opacity
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
};

// Panggil updateLegend saat inisialisasi
window.updateLegend();

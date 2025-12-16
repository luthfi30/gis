import './bootstrap';

// Gunakan File Modular (Agar fitur Export & Sidebar tetap jalan)
import './map-core'; // 1. Core + Logika Modal
import './map-legend'; // 2. Legenda
import './map-layers'; // 3. Popup Peta
import './map-attribute-panel'; // 4. Tabel Atribut & Export
import './map-upload'; // 5. Upload

// JANGAN IMPORT map.js LAGI (Kecuali Anda ingin pakai file monolithic)
// import './map'; <--- Hapus atau comment ini

document.addEventListener('DOMContentLoaded', () => {
    // --- Toggle Sidebar Script (Punya Anda) ---
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');

    if (toggleBtn && sidebar) {
        let isOpen = true;

        toggleBtn.addEventListener('click', () => {
            if (isOpen) {
                sidebar.classList.add('w-0', 'opacity-0');
                sidebar.classList.remove('w-72');
            } else {
                sidebar.classList.remove('w-0', 'opacity-0');
                sidebar.classList.add('w-72');
            }
            isOpen = !isOpen;

            // Trigger resize dan invalidateSize()
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));

                // Akses window.map dari map-core.js untuk memperbaiki peta
                if (typeof window.map !== 'undefined') {
                    window.map.invalidateSize();
                }
            }, 350);
        });
    }

    // --- SIDEBAR TAB SWITCH (Punya Anda) ---
    const tabs = document.querySelectorAll('.sidebar-tab');
    const contents = document.querySelectorAll('.tab-content');

    if (tabs.length > 0) {
        // Atur tab 'Spot' sebagai default aktif saat load pertama
        const defaultTargetId = tabs[0].dataset.target;
        const defaultContent = document.getElementById(defaultTargetId);
        if (defaultContent) {
            defaultContent.classList.remove('hidden');
            tabs[0].classList.add('active', 'bg-gray-200');
        }

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                // reset active class
                tabs.forEach((t) =>
                    t.classList.remove('active', 'bg-gray-200'),
                );
                contents.forEach((c) => c.classList.add('hidden'));

                // activate selected
                tab.classList.add('active', 'bg-gray-200');
                document
                    .getElementById(tab.dataset.target)
                    .classList.remove('hidden');
            });
        });
    }
});

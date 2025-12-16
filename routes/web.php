<?php

use Illuminate\Support\Facades\Route;
use App\Models\Spot; // Tambahkan ini
use App\Models\Category;



Route::get('/', function () {
    $user = Auth::user();

    // Inisialisasi query dengan filter dasar
    $query = Spot::with('category')->where('is_active', 1);

    // Jika user belum login, mereka diperlakukan sebagai non-admin tanpa izin khusus
    if (!$user) {
        $spots = collect([]); // Jika guest, tidak ada spot yang diizinkan untuk layer visibility
        $allowedAttributeSpotIds = []; 
    } else {
        // --- LOGIKA UTAMA ANDA SEBELUMNYA DIMULAI DI SINI ---
        
        // [LOGIKA PREVIOUS]: Filter untuk LAYER VISIBILITY
        $allowedLayerSpotIds = [];
        if (!$user->hasRole('admin')) {
            $allowedLayerSpotIds = DB::table('spots_permisson')
                ->where('user_id', $user->id)
                ->pluck('spot_id')
                ->toArray();
            
            $query->whereIn('id', $allowedLayerSpotIds);
        }
        
        // 1. Dapatkan Spot IDs yang diizinkan untuk *melihat atribut* (can_access = 1)
        $allowedAttributeSpotIds = [];
        if (!$user->hasRole('admin')) {
            $allowedAttributeSpotIds = DB::table('spots_permisson')
                ->where('user_id', $user->id)
                ->where('can_access', 1) 
                ->pluck('spot_id')
                ->toArray();
        }

        // 2. Ambil data spots yang sudah difilter
        $spots = $query->get();
    }
    
    // 3. Modifikasi Spot Collection (Harus menangani kasus $user null jika tidak menggunakan middleware)
    $spots = $spots->map(function ($spot) use ($user, $allowedAttributeSpotIds) {
        // Jika user null (Guest), atau user bukan admin
        if (!$user || !$user->hasRole('admin')) {
            $spot->can_view_attribute = in_array($spot->id, $allowedAttributeSpotIds);
        } 
        // Jika user admin
        else {
            $spot->can_view_attribute = true;
        } 
        return $spot;
    });

    return view('frontpage.map', compact('spots'));
});
<?php

namespace App\Http\Controllers;

use App\Models\Spot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MapController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // 1. DAFTAR KOLOM YANG DIBUTUHKAN (FIXED)
        // Saya MENGHAPUS 'spots.color' karena kolom itu tidak ada di tabel database Anda.
        $columnsToSelect = [
            'spots.id',
            'spots.name', 
            'spots.slug', 
            'spots.geojson_file', 
            'spots.category_id', 
            // 'spots.color',  <-- HAPUS BARIS INI (Penyebab Error)
            'spots.is_active'
        ];

        // 2. QUERY OPTIMIZATION
        if ($user && $user->hasRole('admin')) {
            // --- ADMIN ---
            $spots = Spot::select($columnsToSelect)
                ->with(['category' => function($query) {
                    $query->select('id', 'name', 'color', 'slug'); 
                }])
                ->where('is_active', 1)
                ->get();

            $spots->each(function($spot) {
                $spot->can_view_attribute = true;
                // Optional: Jika frontend butuh variable 'color' langsung di object spot
                $spot->color = $spot->category->color ?? '#3388ff'; 
            });

        } elseif ($user) {
            // --- USER LOGIN ---
            $spots = $user->allowedSpots()
                ->select($columnsToSelect)
                ->where('spots.is_active', 1) 
                ->with(['category' => function($query) {
                    $query->select('id', 'name', 'color', 'slug');
                }])
                ->withPivot('can_access') 
                ->get();

            $spots->each(function($spot) {
                $spot->can_view_attribute = (bool) $spot->pivot->can_access;
                // Optional: Ambil warna dari kategori
                $spot->color = $spot->category->color ?? '#3388ff';
            });

        } else {
            // --- GUEST ---
            $spots = collect([]);
        }

        return view('frontpage.map', compact('spots'));
    }
}
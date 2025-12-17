<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Spot extends Model
{
    
    protected $fillable = [
        'name',
        'slug',
        'geojson_file',
        'category_id',
        'spot_storage_id',
        'color',
        'is_active',
    ];
   
    protected $casts = [
        // Pastikan kolom ini di-cast sebagai array atau object.
        'is_active' => 'boolean',
    ];
    
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Relasi: Spot belongs to a SpotStorage.
     */
    public function spotStorage(): BelongsTo
    {
        return $this->belongsTo(SpotStorage::class);
    }
    
    /**
     * Relasi: Spot has many SpotPermissions.
     */
    public function permissions(): HasMany
    {
        return $this->hasMany(SpotPermission::class, 'spot_id'); //
    }


    protected static function boot()
    {
        parent::boot();

        // Ketika sebuah record dihapus (event deleting):
        static::deleting(function ($model) {
            
            // 1. HAPUS SEMUA SPOT PERMISSION YANG BERELASI
            // Ini akan menghapus semua record di tabel 'spots_permisson' yang memiliki spot_id ini,
            // sehingga Foreign Key Constraint terhindari.
            $model->permissions()->delete(); //

            // 2. Hapus file geojson (Logika yang sudah ada)
            if ($model->geojson_file) {
                // Hapus file dari disk 'public'
                Storage::disk('public')->delete($model->geojson_file); //
            }
        });
    }
   
}
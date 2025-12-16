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
        // Array/object lebih aman karena GeoJSON adalah JSON structure.
        'geojson_data' => 'array',
        // Jika kolom GeoJSON Anda bernama 'location' atau yang lain, gunakan nama tersebut.
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
        return $this->hasMany(SpotPermission::class, 'spot_id');
    }


    protected static function boot()
    {
        parent::boot();

        // Ketika sebuah record dihapus:
        static::deleting(function ($model) {
            // Pastikan kolom geojson_file ada nilainya
            if ($model->geojson_file) {
                // Hapus file dari disk 'public'
                Storage::disk('public')->delete($model->geojson_file);
            }
        });
    }
   
}

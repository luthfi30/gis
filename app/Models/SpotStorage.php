<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class SpotStorage extends Model
{
    protected $table = 'spot_storages';
    
     protected $fillable = [
        'name',
        'slug',
        'path',
        'is_active',
    ];
   

    /**
     * Relasi: SpotStorage has many Spots.
     */
    public function spots(): HasMany
    {
        return $this->hasMany(Spot::class);
    }
}

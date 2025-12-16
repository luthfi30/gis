<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Model;

class SpotPermission extends Model
{
    protected $table = 'spots_permisson'; // Penting karena nama tabel Anda non-konvensional

  protected $fillable = [
        'user_id',
        'spot_id',
        'can_access',
    ];

    /**
     * Relasi: SpotPermission belongs to a User.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class); // Asumsi Model User ada
    }

    /**
     * Relasi: SpotPermission belongs to a Spot.
     */
    public function spot(): BelongsTo
    {
        return $this->belongsTo(Spot::class);
    }
}

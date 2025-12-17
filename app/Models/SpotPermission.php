<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot; // Pastikan ini di-use

// UBAH: extends Pivot (Bukan extends Model)
class SpotPermission extends Pivot
{
    protected $table = 'spots_permisson';

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
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi: SpotPermission belongs to a Spot.
     */
    public function spot(): BelongsTo
    {
        return $this->belongsTo(Spot::class);
    }
}
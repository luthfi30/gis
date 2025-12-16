<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

// --- TAMBAHAN WAJIB UNTUK FILAMENT ---
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
// -------------------------------------

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

// Tambahkan "implements FilamentUser" di sini
class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // --- FUNGSI PINTU MASUK FILAMENT (WAJIB ADA) ---
    public function canAccessPanel(Panel $panel): bool
    {
        // Izinkan User yang punya role 'admin' ATAU 'user'
        // Jika belum punya role sama sekali, return false (403)
        return $this->hasRole(['admin', 'user']);
        
        // CATAAN: Jika Anda ingin SEMUA user yang login bisa masuk (tanpa cek role dulu),
        // Ganti baris return di atas menjadi:
        // return true;
    }
    // ----------------------------------------------

   public function allowedSpots(): BelongsToMany
    {
        return $this->belongsToMany(Spot::class, 'spots_permisson', 'user_id', 'spot_id')
                    ->using(SpotPermission::class); 
    }

    public function permissions(): HasMany
    {
        return $this->hasMany(SpotPermission::class, 'user_id'); 
    }
}
<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

// 1. TAMBAHKAN IMPORT INI AGAR FILAMENT MENGENALI USER
use Filament\Models\Contracts\FilamentUser; 
use Filament\Panel;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

// 2. TAMBAHKAN "implements FilamentUser" DI SINI
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

   public function allowedSpots(): BelongsToMany
    {
        return $this->belongsToMany(Spot::class, 'spots_permisson', 'user_id', 'spot_id')
                    ->using(SpotPermission::class);
    }

    public function permissions(): HasMany
    {
        return $this->hasMany(SpotPermission::class, 'user_id'); 
    }

    // =========================================================
    // 3. INI FUNGSI "SURAT IZIN MASUK" YANG HILANG!
    // =========================================================
    // ... kode atas tetap sama ...

    public function canAccessPanel(Panel $panel): bool
    {
        // OPSI 1: Izinkan jika punya role 'admin' ATAU 'user'
        // Fungsi hasRole dari Spatie bisa menerima array (daftar) role.
        return $this->hasRole(['admin', 'user']);

        // OPSI 2 (Lebih Bebas): Izinkan SIAPAPUN yang sudah login & punya role apapun
        // return ! $this->roles->isEmpty();
        
        // OPSI 3 (Paling Bebas): Izinkan SEMUA user yang terdaftar di database
        // return true; 
    }
}

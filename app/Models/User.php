<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

// PASTIKAN ANDA MEMILIKI DUA BARIS IMPORT INI:
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
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
                    ->using(SpotPermission::class); // Menggunakan model pivot SpotPermission
    }

    /**
     * Relasi BARU: User has many SpotPermissions.
     * Relasi ini digunakan oleh Relation Manager untuk mengelola baris izin.
     */
    public function permissions(): HasMany
    {
        // Hubungkan ke model SpotPermission menggunakan kolom foreign key 'user_id'
        return $this->hasMany(SpotPermission::class, 'user_id'); 
    }
}

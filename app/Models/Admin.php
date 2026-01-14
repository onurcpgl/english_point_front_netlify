<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

// "implements JWTSubject" EKLENECEK
class Admin extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password', 
    ];
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // --- JWT İÇİN GEREKLİ 2 FONKSİYON ---

    public function getJWTIdentifier()
    {
        return $this->getKey(); // Kullanıcı ID'sini döner
    }

    public function getJWTCustomClaims()
    {
        return []; // Token içine ekstra veri gömmek istersen buraya yazarsın
    }
}
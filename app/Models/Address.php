<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'address_line',
        'district',
        'city',
        'state',        // Eğer DB'de varsa kalsın, yoksa silin
        'postal_code',
        'country',      // Yeni ekledik
        'latitude',     // Yeni ekledik
        'longitude',    // Yeni ekledik
        'main_adress',  // isDefault yerine DB'deki gerçek sütun adı
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
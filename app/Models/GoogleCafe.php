<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GoogleCafe extends Model
{
    use HasFactory;

    protected $table = 'google_cafes';

    protected $fillable = [
        'google_place_id',
        'name',
        'map_url',
        'address',
        'district',
        'city',
        'latitude',
        'longitude',
        'image',
    ];

    // Koordinatları string yerine sayı olarak çekmek istersen:
    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
    ];
    public function sessions()
    {
        return $this->hasMany(CourseSession::class);
    }
}
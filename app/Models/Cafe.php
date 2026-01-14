<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Cafe extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'address',
        'image',
        'image_gallery',
        'phone',
        'website',
        'status',
        'latitude',
        'longitude',
    ];
    protected function image(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                // Eğer veritabanında resim yoksa null dön
                if (!$value)
                    return null;

                // Eğer resim zaten tam bir URL ise (http ile başlıyorsa) dokunma
                if (filter_var($value, FILTER_VALIDATE_URL)) {
                    return $value;
                }

                // Resmi 'storage/' klasörü üzerinden tam URL olarak döndür
                // Not: Resimlerin 'storage/app/public' altında olduğunu varsayıyoruz.
                return asset('/' . $value);
            }
        );
    }
    public function sessions()
    {
        return $this->hasMany(CourseSession::class);
    }
}
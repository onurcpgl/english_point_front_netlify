<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Instructor extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'remember_token',
        'email_verified_at',
        'current_location',
        'country_birth',
        'address',
        'current_city',
        'status',
        'phone',
        'level',
        'zip_code',
        'address'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
    // One to Many ilişkisi
    public function courseSessions()
    {
        return $this->hasMany(CourseSession::class);
    }
    // Eğitmenin fotoğrafları

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<\App\Models\InstructorPhoto>
     */
    public function photos()
    {
        return $this->hasMany(InstructorPhoto::class, 'instructor_id', 'id');
    }
    public function routeNotificationForMail($notification)
    {
        return $this->email;
    }
    // Eğitmenin sertifikaları
    public function certificates()
    {
        return $this->hasMany(InstructorCertificate::class);
    }

    // Eğitmenin eğitim geçmişi
    public function educations()
    {
        return $this->hasMany(InstructorEducation::class);
    }

    // Eğitmenin uygunluk saatleri
    public function availabilities()
    {
        return $this->hasMany(InstructorAvailability::class);
    }
    public function languages()
    {
        return $this->hasMany(InstructorLanguage::class);
    }

    public function getJWTIdentifier()
    {
        return $this->getKey(); // genelde 'id' döner
    }

    public function getJWTCustomClaims()
    {
        return []; // ekstra claim yoksa boş array dönebilirsin
    }
    public function payments()
    {
        return $this->hasMany(InstructorPayment::class, 'instructor_id');
    }

    // Hocanın bekleyen (henüz ödenmemiş) toplam bakiyesini çeken fonksiyon
    public function getPendingBalanceAttribute()
    {
        return $this->payments()
            ->where('status', 'pending')
            ->sum('amount');
    }
}
<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'email_verified_code',
        'password',
        'profile_image',
        'google_id', // Google ID'yi de buraya eklemeyi unutma
        'avatar',
        'facebook_id',
        'uniq_id',
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

        ];
    }
    public function getJWTIdentifier()
    {
        return $this->getKey(); // genellikle id
    }


    public function getJWTCustomClaims()
    {
        return []; // ekstra claim eklemek istersen buraya
    }

    public function courseSessions()
    {
        return $this->belongsToMany(CourseSession::class, 'course_session_user');
    }

    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

}
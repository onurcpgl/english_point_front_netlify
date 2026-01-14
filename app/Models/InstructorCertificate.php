<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InstructorCertificate extends Model
{
    protected $fillable = [
        'instructor_id',
        'issuer',
        'certification',
        'years_of_study',
        'certificate_file_path',
    ];
    // URL accessor
    protected $appends = ['certificate_file_url'];

    public function getCertificateFileUrlAttribute()
    {
        return $this->certificate_file_path
            ? asset('storage/' . $this->certificate_file_path)
            : null;
    }

    public function instructor()
    {
        return $this->belongsTo(Instructor::class);
    }

}
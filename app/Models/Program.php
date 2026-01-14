<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Program extends Model
{
    use HasFactory, SoftDeletes; // Spatie trait'i

    protected $fillable = [
        'program_category_id',
        'title',
        'slug',
        'description',
        'business_slug',
        'video_url',
        'voice_path',
        'document_path',
        'duration_minutes',
        'is_active',
    ];
    public function category()
    {
        // program_category_id sütunu üzerinden ProgramCategory modeline bağlanır
        return $this->belongsTo(ProgramCategory::class, 'program_category_id');
    }
    protected function documentPath(): Attribute
    {
        return Attribute::make(
            get: fn(?string $value) => $value ? asset('storage/' . $value) : null,
        );
    }

    // voice_path çağrıldığında otomatik URL'e çevirir
    protected function voicePath(): Attribute
    {
        return Attribute::make(
            get: fn(?string $value) => $value ? asset('storage/' . $value) : null,
        );
    }
}
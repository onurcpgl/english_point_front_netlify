<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgramCategory extends Model
{
    use HasFactory;

    // Tablo adı (Laravel otomatik bulur ama garanti olsun diye yazabilirsin)
    protected $table = 'program_categories';

    // Veri girişine izin verilen alanlar
    protected $fillable = [
        'name',
        'slug',
        'is_active'
    ];

    /**
     * İlişki: Bir kategorinin birden fazla programı olabilir.
     * (Program modelinin olduğunu varsayıyoruz)
     */
    public function programs()
    {
        return $this->hasMany(Program::class);
    }
}
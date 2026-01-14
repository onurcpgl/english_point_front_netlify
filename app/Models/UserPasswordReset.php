<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class UserPasswordReset extends Model
{
    use HasFactory;
    protected $fillable = ['id', 'user_id', 'token', 'used']; /** * User ile ilişki */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
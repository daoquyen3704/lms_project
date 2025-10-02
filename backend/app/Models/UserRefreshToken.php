<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class UserRefreshToken extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'family_id',
        'token_hash',
        'expires_at',
        'rotated_at',
        'revoked',
        'ip',
        'user_agent'
    ];

    protected $dates = [
        'expires_at',
        'rotated_at'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'rotated_at' => 'datetime',
        'revoked' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isExpired()
    {
        return $this->expires_at < Carbon::now();
    }

    public function isValid()
    {
        return !$this->revoked && !$this->isExpired();
    }

    public function isRevoked()
    {
        return $this->revoked;
    }

    public function revoke()
    {
        $this->update(['revoked' => true]);
    }

    public function rotate()
    {
        $this->update(['rotated_at' => Carbon::now()]);
    }

    public static function cleanupExpired()
    {
        return self::where('expires_at', '<', Carbon::now())->delete();
    }
}

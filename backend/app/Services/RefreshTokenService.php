<?php

namespace App\Services;

use App\Models\UserRefreshToken;
use App\Models\User;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Http\Request;

class RefreshTokenService
{
    public function createRefreshToken(User $user, Request $request = null, string $familyId = null): string
    {
        // Tạo refresh token unique
        $refreshToken = Str::random(60) . '_' . time() . '_' . $user->id;

        // Tạo family_id mới nếu chưa có
        if (!$familyId) {
            $familyId = Str::uuid()->toString();
        }

        // Lưu vào database
        UserRefreshToken::create([
            'user_id' => $user->id,
            'family_id' => $familyId,
            'token_hash' => hash('sha256', $refreshToken),
            'expires_at' => Carbon::now()->addDays(14), // 14 ngày
            'ip' => $request ? $request->ip() : null,
            'user_agent' => $request ? $request->userAgent() : null,
        ]);

        return $refreshToken;
    }

    public function validateRefreshToken(string $token): ?UserRefreshToken
    {
        $hashedToken = hash('sha256', $token);

        $refreshToken = UserRefreshToken::where('token_hash', $hashedToken)
            ->where('revoked', false)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        return $refreshToken;
    }

    public function revokeRefreshToken(string $token): bool
    {
        $hashedToken = hash('sha256', $token);

        return UserRefreshToken::where('token_hash', $hashedToken)
            ->update(['revoked' => true]);
    }

    public function revokeAllUserTokens(int $userId): bool
    {
        return UserRefreshToken::where('user_id', $userId)
            ->update(['revoked' => true]);
    }

    public function revokeTokenFamily(string $familyId): bool
    {
        return UserRefreshToken::where('family_id', $familyId)
            ->update(['revoked' => true]);
    }

    public function rotateRefreshToken(string $token, User $user, Request $request = null): ?string
    {
        $refreshTokenRecord = $this->validateRefreshToken($token);

        if (!$refreshTokenRecord) {
            return null;
        }

        // Mark current token as rotated
        $refreshTokenRecord->update(['rotated_at' => Carbon::now()]);

        // Create new token trong cùng family
        return $this->createRefreshToken($user, $request, $refreshTokenRecord->family_id);
    }

    public function cleanupExpiredTokens(): int
    {
        return UserRefreshToken::where('expires_at', '<', Carbon::now())->delete();
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Services\RefreshTokenService;

class CleanupExpiredTokens
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */

    protected $refreshTokenService;

    public function __construct(RefreshTokenService $refreshTokenService)
    {
        $this->refreshTokenService = $refreshTokenService;
    }
    public function handle(Request $request, Closure $next): Response
    {
        if (rand(1, 10) === 1) {
            $this->refreshTokenService->cleanupExpiredTokens();
        }

        return $next($request);
    }
}

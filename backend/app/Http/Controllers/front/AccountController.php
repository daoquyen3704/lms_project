<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use App\Services\RefreshTokenService;



class AccountController extends Controller
{
    protected $refreshTokenService;

    public function __construct(RefreshTokenService $refreshTokenService)
    {
        $this->refreshTokenService = $refreshTokenService;
    }
    // Đăng ký
    public function register(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status'  => 400,
                'message' => $validate->errors(),
            ], 400);
        }

        $user = new User();
        $user->name     = $request->name;
        $user->email    = $request->email;
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'status'  => 200,
            'message' => 'Registration successful',
        ], 200);
    }

    // Đăng nhập -> lấy token

    public function authenticate(Request $request)
    {
        // Validate dữ liệu đầu vào
        $validate = Validator::make($request->all(), [
            'email'    => 'required|string|email|max:255',
            'password' => 'required|string|min:8',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status'  => 400,
                'message' => $validate->errors(),
            ], 400);
        }

        // Lấy credentials sau khi validate ok
        $credentials = $request->only('email', 'password');

        // Thử đăng nhập
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'status'  => 401,
                'message' => 'Email hoặc mật khẩu không đúng',
            ], 401);
        }

        $user = JWTAuth::user();

        // Tạo refresh token
        $refreshToken = $this->refreshTokenService->createRefreshToken($user, $request);


        // Thành công -> trả token
        return response()->json([
            'status' => 200,
            'access_token' => $token,
            'refresh_token' => $refreshToken,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
            'user' => $user,
        ], 200);
    }
    // Lấy thông tin user hiện tại
    public function me()
    {
        $user = null;
        try {
            $user = JWTAuth::user();
        } catch (\Exception $e) {
            // ignore, will return null below
        }

        if (!$user) {
            return response()->json([
                'status' => 401,
                'message' => 'Unauthenticated'
            ], 401);
        }

        return response()->json($user);
    }


    // Đăng xuất
    public function logout(Request $request)
    {
        // Invalidate JWT token if present
        try {
            $token = JWTAuth::getToken();
            if ($token) {
                JWTAuth::invalidate($token);
            }
        } catch (\Exception $e) {
            // ignore token invalidation errors to allow logout flow to continue
        }

        // Revoke refresh token if provided
        $refreshToken = $request->input('refresh_token');
        if ($refreshToken) {
            $this->refreshTokenService->revokeRefreshToken($refreshToken);
        }

        return response()->json(['message' => 'Successfully logged out']);
    }


    // Refresh token
    public function refresh(Request $request)
    {
        $refreshToken = $request->input('refresh_token');

        if (!$refreshToken) {
            return response()->json([
                'status' => 400,
                'message' => 'Refresh token is required'
            ], 400);
        }

        // Validate refresh token
        $userRefreshToken = $this->refreshTokenService->validateRefreshToken($refreshToken);

        if (!$userRefreshToken || !$userRefreshToken->user) {
            return response()->json([
                'status' => 401,
                'message' => 'Invalid or expired refresh token'
            ], 401);
        }

        $user = $userRefreshToken->user;

        // Tạo access token mới
        $newAccessToken = JWTAuth::fromUser($user);

        // Tạo refresh token mới và revoke token cũ
        $this->refreshTokenService->revokeRefreshToken($refreshToken);
        $newRefreshToken = $this->refreshTokenService->createRefreshToken($user, $request);

        return response()->json([
            'access_token' => $newAccessToken,
            'refresh_token' => $newRefreshToken,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
        ]);
    }

    public function courses(Request $request)
    {
        $course = Course::where('user_id', JWTAuth::user()->id)
            ->with('level')
            ->get();
        return response()->json([
            'status' => 200,
            'data' => $course,
        ], 200);
    }
}

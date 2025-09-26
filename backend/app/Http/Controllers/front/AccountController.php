<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;



class AccountController extends Controller
{
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

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'Tài khoản chưa tồn tại, vui lòng đăng ký!',
            ], 404);
        }

        // Thành công -> trả token
        return response()->json([
            'status'       => 200,
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => JWTAuth::factory()->getTTL() * 60,
            'user'         => JWTAuth::user(),
        ], 200);
    }
    // Lấy thông tin user hiện tại
    public function me()
    {
        return response()->json(JWTAuth::user());
    }


    // Đăng xuất
    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());
        return response()->json(['message' => 'Successfully logged out']);
    }


    // Refresh token
    public function refresh()
    {
        $newToken = JWTAuth::refresh(JWTAuth::getToken());

        return response()->json([
            'access_token' => $newToken,
            'token_type'   => 'bearer',
            'expires_in'   => JWTAuth::factory()->getTTL() * 60,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminAuthController extends Controller
{

    public function login(Request $request)
    {
        // 1. Validasyon
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');

        // 2. JWT ile Giriş (Admin Guard'ını kullanarak)
        // auth('admin-api') dediğimiz için config'deki Admin modeline bakar.
        if (!$token = auth('admin-api')->attempt($credentials)) {
            return response()->json([
                'status' => false,
                'message' => 'Girdiğiniz bilgiler hatalı veya yetkiniz yok.',
            ], 401);
        }

        // 3. Başarılıysa Token Dön
        return $this->respondWithToken($token);
    }

    /**
     * Admin Çıkış İşlemi (Logout)
     */
    public function logout()
    {
        auth('admin-api')->logout();

        return response()->json([
            'status' => true,
            'message' => 'Başarıyla çıkış yapıldı.'
        ], 200);
    }

    /**
     * Giriş yapmış admin bilgilerini getir (Me)
     */
    public function me()
    {
        return response()->json([
            'status' => true,
            'user' => auth('admin-api')->user(), // Admin modelini döner
        ]);
    }

    /**
     * Token Yenileme (Refresh)
     */
    public function refresh()
    {
        return $this->respondWithToken(auth('admin-api')->refresh());
    }

    /**
     * Token Formatı
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'status' => true,
            'message' => 'Giriş başarılı.',
            'data' => [
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth('admin-api')->factory()->getTTL() * 60,
                'user' => auth('admin-api')->user()
            ]
        ]);
    }
}
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GoogleCafe;
use Illuminate\Http\Request;

class GoogleCafeController extends Controller
{
    /**
     * Tüm kafeleri listele.
     * Admin listesinde kafede kaç tane session olduğunu görmek faydalı olabilir (withCount).
     */
    public function index()
    {
        // withCount('sessions') => Her kafenin yanında 'sessions_count' diye bir sayı döner.
        $cafes = GoogleCafe::withCount('sessions')
            ->latest() // En son eklenen en üstte
            ->paginate(20); // Sayfa başına 20 kayıt

        return response()->json([
            'status' => true,
            'message' => 'Google Cafe listesi başarıyla getirildi.',
            'data' => $cafes
        ], 200);
    }

    /**
     * Tek bir kafenin detayını göster.
     * Detayda o kafede yapılan dersleri (sessions) de getiriyoruz.
     */
    public function show($id)
    {
        // with('sessions') => Kafenin detayını çekerken ilişkili ders oturumlarını da getirir.
        $cafe = GoogleCafe::with('sessions')->find($id);

        if (!$cafe) {
            return response()->json([
                'status' => false,
                'message' => 'Google Cafe kaydı bulunamadı.'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Google Cafe detayı başarıyla getirildi.',
            'data' => $cafe
        ], 200);
    }
}
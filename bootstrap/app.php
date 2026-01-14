<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
// use Throwable; // 👈 Bunu eklemeyi unutma, hata yakalamak için şart

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        //admin: __DIR__ . '/../routes/admin.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        channels: __DIR__ . '/../routes/channels.php',
        health: '/up',
        then: function () {
            Route::middleware('api') // API özelliklerini (JSON yanıt, throttle vb.) kullan
                ->prefix('admin')    // URL'in başına 'api' değil, direkt 'admin' koy
                ->group(base_path('routes/admin.php')); // admin.php dosyasını yükle
        },

    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        // 👇 GLOBAL API LOGLAMA AYARI BURADA BAŞLIYOR
        $exceptions->reportable(function (Throwable $e) {

            // Hem 'api/*' hem de 'admin/*' ile başlayan rotalardaki hataları yakala
            if (request()->is('api/*') || request()->is('admin/*')) {

                Log::error('🚨 API/ADMIN Hatası Yakalandı: ' . $e->getMessage(), [
                    'URL' => request()->fullUrl(),
                    'Method' => request()->method(),
                    'IP' => request()->ip(),
                    // Şifre gibi hassas verileri log dosyasından gizle
                    'Gelen Veri' => request()->except(['password', 'password_confirmation', 'current_password']),
                    'Dosya' => $e->getFile(),
                    'Satır' => $e->getLine(),
                    'Hata Türü' => get_class($e), // Hatanın teknik adı (örn: QueryException)
                ]);
            }
        });
        // 👆 GLOBAL LOGLAMA BİTİŞ
    
    })->create();
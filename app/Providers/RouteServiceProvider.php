<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
   public function boot(): void
{
    $this->routes(function () {
        // Normal API rotaları
        Route::middleware('api')
            ->prefix('api')
            ->group(base_path('routes/api.php'));

        // Admin API rotaları
       Route::middleware('api') // önce admin middleware’i kaldır
    ->prefix('api/admin')
    ->group(base_path('routes/admin.php'));

        // Web rotaları
        Route::middleware('web')
            ->group(base_path('routes/web.php'));
    });
}

}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        if (session()->has('locale')) {
            $locale = session()->get('locale');
            // 1. Thiết lập ngôn ngữ hệ thống
            App::setLocale($locale);
            // 2. Ép luôn vào config của Laravel (Rất quan trọng cho các package)
            config(['app.locale' => $locale]);
        }

        return $next($request);
    }
}

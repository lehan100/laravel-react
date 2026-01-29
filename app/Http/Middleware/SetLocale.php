<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Kiểm tra nếu có session 'locale'
        if (Session::has('locale')) {
            // 2. Thiết lập ngôn ngữ hệ thống dựa trên session
            App::setLocale(Session::get('locale'));
        } else {
            // 3. (Tùy chọn) Mặc định lấy theo cấu hình app.php hoặc ngôn ngữ trình duyệt
            App::setLocale(config('app.locale'));
        }

        return $next($request);
    }
}

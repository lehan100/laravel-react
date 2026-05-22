<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class SetFrontendLocale
{
    /**
     * Danh sách các ngôn ngữ được phép (hỗ trợ bảo mật)
     */
    protected array $supportedLocales = ['vi', 'en', 'ja'];

    public function handle(Request $request, Closure $next): Response
    {
        $locale = Session::get('frontend_locale', 'vi');

        // Kiểm tra bảo mật để tránh user truyền vào ngôn ngữ không hợp lệ
        if (in_array($locale, $this->supportedLocales)) {
            App::setLocale($locale);
            config(['app.locale' => $locale]);
        }

        return $next($request);
    }
}

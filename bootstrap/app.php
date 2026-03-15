<?php

use App\Providers\AppServiceProvider;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withProviders()
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        // channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->authenticateSessions();
        $middleware->redirectGuestsTo(fn() => route('auth.login'));
        $middleware->redirectUsersTo(fn() => route('dashboard'));
        $middleware->alias([
            'check.login' => \App\Http\Middleware\CheckLogin::class,
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \App\Http\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
        ]);
        $middleware->web(\App\Http\Middleware\HandleInertiaRequests::class);
        $middleware->web(append: [
            \App\Http\Middleware\SetLocale::class,
            \Illuminate\Session\Middleware\AuthenticateSession::class,
        ]);
        $middleware->throttleApi();

        $middleware->replace(\Illuminate\Http\Middleware\TrustProxies::class, \App\Http\Middleware\TrustProxies::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            // Nếu là yêu cầu từ trang web (không phải API thuần túy)
            if (! $request->expectsJson()) {
                return redirect()->guest(route('auth.login'))
                    ->with('message', __('hancms.message.security_notice'));
            }
        });
    })->create();

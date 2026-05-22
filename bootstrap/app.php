<?php

use App\Http\Middleware\CheckLogin;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\PermissionMiddleware;
use App\Http\Middleware\SetLocale;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\TrustProxies;
use Illuminate\Http\Request;
use Illuminate\Session\Middleware\AuthenticateSession;
use Inertia\Inertia;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withProviders()
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        // channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->authenticateSessions();
        $middleware->redirectGuestsTo(fn () => route('auth.login'));
        $middleware->redirectUsersTo(fn () => route('dashboard'));
        $middleware->alias([
            'check.login' => CheckLogin::class,
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
        ]);
        $middleware->web(HandleInertiaRequests::class);
        $middleware->web(append: [
            SetLocale::class,
            AuthenticateSession::class,
        ]);
        $middleware->throttleApi();

        $middleware->replace(TrustProxies::class, App\Http\Middleware\TrustProxies::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            // Nếu là yêu cầu từ trang web (không phải API thuần túy)
            if (! $request->expectsJson()) {
                return redirect()->guest(route('auth.login'))
                    ->with('message', __('cms.message.security_notice'));
            }
        });

        $exceptions->render(function (HttpExceptionInterface $e, Request $request) {
            if (! $request->expectsJson() && ! $request->is('api/*')) {
                $status = $e->getStatusCode();
                if (in_array($status, [403, 404, 500, 503])) {
                    $adminPrefix = config('configs.prefix.admin', 'admin123');
                    $isAdmin = $request->is($adminPrefix) || $request->is("$adminPrefix/*");
                    $locale = session($isAdmin ? 'locale' : 'frontend_locale', app()->getLocale() ?? 'vi');

                    if ($isAdmin) {
                        Inertia::setRootView('admin');
                    }

                    $message = $e->getMessage();
                    if ($status === 403 && (empty($message) || str_contains($message, 'User does not have the right') || str_contains($message, 'This action is unauthorized'))) {
                        $message = __('cms.error.unauthorized');
                    } elseif (empty($message)) {
                        $message = __('cms.error.unknown_system_error');
                    }

                    return Inertia::render($isAdmin ? 'Admin/Error' : 'Error', [
                        'status' => $status,
                        'message' => $message,
                        'locale' => $locale,
                    ])
                        ->toResponse($request)
                        ->setStatusCode($status);
                }
            }
        });
    })->create();

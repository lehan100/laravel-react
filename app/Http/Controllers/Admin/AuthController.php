<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\AppServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    protected $controllerView = 'Admin/Auth/';
    protected $controllerName = 'auth';
    /**
     * Display the login view.
     */
    public function login(): Response
    {
        return Inertia::render($this->controllerView . 'Login');
    }
    public function postlogin(LoginRequest $request): RedirectResponse
    {
       $request->authenticate();

        $request->session()->regenerate();

        return redirect()->route("dashboard");
    }

    public function logout(Request $request)
    {
        Auth::logout();
        return redirect()->route($this->controllerName . "/login");
    }
}

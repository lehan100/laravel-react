<?php

namespace App\Http\Middleware;

use App\Http\Resources\Settings\LanguageCollection;
use App\Http\Resources\Users\UserResource;
use App\Repositories\Language\LanguageRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Defines the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     */
    protected $languageModel;

    // Inject model vào đây
    public function __construct(LanguageRepositoryInterface $languageModel)
    {
        $this->languageModel = $languageModel;
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'app_name' => config('app.name'),
            'langs' => function () {
                return new LanguageCollection($this->languageModel->lists(null, [
                    'task' => 'admin-list-items-active',
                ]));
            },
            'locale' => function () {
                return app()->getLocale();
            },
            'auth' => function () use ($request) {
                return [
                    'user' => Auth::check() ? new UserResource(Auth::user()->load('account')) : null,
                    'permissions' => $request->user() ? $request->user()->getAllPermissions()->pluck('name') : [],
                ];
            },
            'flash' => function () use ($request) {
                return [
                    'message' => $request->session()->get('message'),
                    'success' => $request->session()->get('success'),
                    'error' => $request->session()->get('error'),
                ];
            },
        ]);
    }
}

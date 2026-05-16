<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\MainController;
use App\Http\Requests\Settings\HancmsTranslationRequest;
use App\Jobs\Settings\SyncFrontendTranslationBundles;
use App\Services\Settings\HancmsTranslationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class HancmsTranslationController extends MainController
{
    protected string $controllerView = 'Admin/HancmsTranslation/';

    public function __construct(
        private HancmsTranslationService $translationService
    ) {
        parent::__construct();
    }

    public function index(): Response
    {
        $languages = $this->resolveLanguages();
        $payload = $this->translationService->loadEditableTranslations(array_column($languages, 'code'));

        return Inertia::render($this->controllerView.'Index', [
            'langs' => $languages,
            'config_path' => config('image.path.photo'),
            'translation_keys' => $payload['translation_keys'],
            'translations' => $payload['translations'],
        ]);
    }

    public function store(HancmsTranslationRequest $request): RedirectResponse
    {
        try {
            $this->translationService->saveTranslations($request->validated('translations'));
            SyncFrontendTranslationBundles::dispatchAfterResponse();

            return Redirect::back()->with('success', __('hancms.translation.messages.saved'));
        } catch (\Throwable $th) {
            return Redirect::back()->with('error', __('hancms.message.error.edit', ['name' => __('hancms.translation.name')]));
        }
    }

    /**
     * @return array<int, array{code:string,name:string,photo:?string}>
     */
    private function resolveLanguages(): array
    {
        $sharedLangs = Inertia::getShared('langs');
        $languages = is_callable($sharedLangs) ? $sharedLangs() : $sharedLangs;

        return collect($languages)
            ->map(function ($language): array {
                return [
                    'code' => (string) ($language['code'] ?? $language->code ?? ''),
                    'name' => (string) ($language['name'] ?? $language->name ?? ''),
                    'photo' => $language['photo'] ?? $language->photo ?? null,
                ];
            })
            ->filter(fn (array $language): bool => $language['code'] !== '')
            ->values()
            ->all();
    }
}

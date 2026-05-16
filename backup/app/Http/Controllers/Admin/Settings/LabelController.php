<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\MainController;
use App\Services\Settings\LabelTranslationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class LabelController extends MainController
{
    protected string $controllerView = 'Admin/Label/';

    protected string $controllerName = 'label';

    public function __construct(private LabelTranslationService $translationService)
    {
        parent::__construct();
        $configPath = config('image.path.photo');
        Inertia::share(['config_path' => $configPath]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $sharedLangs = Inertia::getShared('langs');
        $languages = is_callable($sharedLangs) ? $sharedLangs() : $sharedLangs;
        $labels = $this->translationService->loadEditableTranslations($this->resolveLanguages($languages));

        return Inertia::render($this->controllerView.'Index', [
            'labels' => $labels,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $labelPayload = $request->input('labels', []);
            $translationKeys = $this->normalizeTranslationKeys($labelPayload);
            $translations = $this->normalizeTranslations($labelPayload);

            foreach ($translations as $lang => $localeTranslations) {
                $dir = lang_path($lang);

                if (! is_dir($dir)) {
                    mkdir($dir, 0755, true);
                }

                $content = [];
                foreach ($translationKeys as $translationKey) {
                    $content[$translationKey] = (string) ($localeTranslations[$translationKey] ?? '');
                }

                File::put(
                    lang_path("$lang/label.php"),
                    "<?php\n\nreturn ".var_export($content, true).";\n"
                );
            }

            return Redirect::route('labels.index')->with('success', __('hancms.message.success.edit', ['name' => __('hancms.label.name')]));
        } catch (\Throwable $th) {
            return Redirect::route('labels.index')->with('error', __('hancms.message.error.edit', ['name' => __('hancms.label.name')]));
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * @param  array<int, array<string, mixed>>|\Traversable<int, array<string, mixed>>|mixed  $languages
     * @return array<int, string>
     */
    private function resolveLanguages(mixed $languages): array
    {
        return collect($languages)
            ->map(function ($language): array {
                return [
                    'code' => (string) ($language['code'] ?? $language->code ?? ''),
                    'name' => (string) ($language['name'] ?? $language->name ?? ''),
                    'photo' => $language['photo'] ?? $language->photo ?? null,
                ];
            })
            ->filter(fn (array $language): bool => $language['code'] !== '')
            ->pluck('code')
            ->values()
            ->all();
    }

    /**
     * @param  array<string, mixed>  $labelPayload
     * @return array<int, string>
     */
    private function normalizeTranslationKeys(array $labelPayload): array
    {
        $translationKeys = $labelPayload['translation_keys'] ?? [];

        return collect($translationKeys)
            ->filter(fn ($translationKey): bool => is_string($translationKey) && $translationKey !== '')
            ->values()
            ->all();
    }

    /**
     * @param  array<string, mixed>  $labelPayload
     * @return array<string, array<string, string>>
     */
    private function normalizeTranslations(array $labelPayload): array
    {
        $translations = $labelPayload['translations'] ?? [];

        return collect($translations)
            ->map(function ($localeTranslations): array {
                return collect(is_array($localeTranslations) ? $localeTranslations : [])
                    ->mapWithKeys(function ($value, $key): array {
                        if (! is_string($key) || $key === '') {
                            return [];
                        }

                        return [$key => is_scalar($value) ? (string) $value : ''];
                    })
                    ->all();
            })
            ->all();
    }
}

<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\MainController;
use App\Http\Requests\Settings\MailTemplateRequest;
use App\Http\Resources\Settings\MailTemplateCollection;
use App\Http\Resources\Settings\MailTemplateResource;
use App\Repositories\MailTemplate\MailTemplateRepositoryInterface as RepositoryInterface;
use App\Services\Settings\MailTemplateSampleService;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request as RequestFacade;
use Inertia\Inertia;
use Inertia\Response;

class MailTemplateController extends MainController
{
    protected string $controllerView = 'Admin/Settings/MailTemplate/';

    protected string $routeName = 'mail-templates.';

    protected RepositoryInterface $mainModel;

    protected MailTemplateSampleService $sampleService;

    public function __construct(RepositoryInterface $repository, MailTemplateSampleService $sampleService)
    {
        parent::__construct();
        $this->mainModel = $repository;
        $this->sampleService = $sampleService;
    }

    public function index(): Response
    {
        $this->params = array_merge(RequestFacade::all(), $this->params);
        $items = $this->mainModel->lists($this->params, ['task' => 'admin-list-items']);

        return Inertia::render($this->controllerView.'Index', [
            'items' => new MailTemplateCollection($items),
        ]);
    }

    public function create(): Response
    {
        $sampleTemplates = $this->wrapMailTemplateSamples($this->buildMailTemplateSamples());

        return Inertia::render($this->controllerView.'Created', [
            'item' => null,
            'brand' => $this->buildMailBrandData(),
            'sampleTemplates' => $sampleTemplates,
            'sampleTemplate' => $sampleTemplates[0]['template'] ?? null,
        ]);
    }

    public function store(MailTemplateRequest $request): RedirectResponse
    {
        try {
            $params = $request->validated();
            $mailTemplate = $this->mainModel->save($params, ['task' => 'add-item']);

            if (($params['undo'] ?? 0) == 1) {
                return Redirect::to(route($this->routeName.'index'))
                    ->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.settings.mail_template.name'))]));
            }

            return Redirect::route($this->routeName.'edit', $mailTemplate->id)
                ->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.settings.mail_template.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()
                ->with('error', __('hancms.message.error.created', ['name' => mb_strtolower(__('hancms.settings.mail_template.name'))]));
        }
    }

    public function show(string $id): RedirectResponse
    {
        return Redirect::route($this->routeName.'edit', $id);
    }

    public function edit(string $id): Response|RedirectResponse
    {
        $item = $this->mainModel->get(['id' => $id], ['task' => 'get-item']);

        if (! $item) {
            return redirect()->route($this->routeName.'index')
                ->with('error', __('hancms.message.error.nodata'));
        }

        return Inertia::render($this->controllerView.'Edit', [
            'item' => new MailTemplateResource($item),
            'brand' => $this->buildMailBrandData(),
            'sampleTemplates' => $this->wrapMailTemplateSamples($this->buildMailTemplateSamples()),
        ]);
    }

    public function update(MailTemplateRequest $request, string $id): RedirectResponse
    {
        try {
            $params = $request->validated();
            $params['id'] = $id;
            $mailTemplate = $this->mainModel->save($params, ['task' => 'edit-item']);

            if (($params['undo'] ?? 0) == 1) {
                return Redirect::to(route($this->routeName.'index'))
                    ->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.settings.mail_template.name'))]));
            }

            return Redirect::route($this->routeName.'edit', $mailTemplate->id)
                ->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.settings.mail_template.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()
                ->with('error', __('hancms.message.error.edit', ['name' => mb_strtolower(__('hancms.settings.mail_template.name'))]));
        }
    }

    public function destroy(string $id): RedirectResponse
    {
        try {
            $this->mainModel->delete(['id' => $id], ['task' => 'delete-item']);

            return Redirect::to(route($this->routeName.'index'))
                ->with('success', __('hancms.message.success.deleted', ['name' => mb_strtolower(__('hancms.settings.mail_template.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()
                ->with('error', __('hancms.message.error.deleted'));
        }
    }

    public function destroyMany(Request $request): RedirectResponse
    {
        try {
            $this->mainModel->delete($request->all(), ['task' => 'delete-items']);

            return Redirect::to(route($this->routeName.'index'))
                ->with('success', __('hancms.message.success.deleted', ['name' => mb_strtolower(__('hancms.settings.mail_template.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()
                ->with('error', __('hancms.message.error.deleted'));
        }
    }

    public function toggleStatus(string $id): RedirectResponse
    {
        try {
            $item = $this->mainModel->get(['id' => $id], ['task' => 'get-item']);

            if (! $item) {
                return Redirect::back()->with('error', __('hancms.message.error.nodata'));
            }

            $item->is_active = ! (bool) $item->is_active;
            $item->save();

            return Redirect::back()->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.settings.mail_template.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()
                ->with('error', __('hancms.message.error.edit', ['name' => mb_strtolower(__('hancms.settings.mail_template.name'))]));
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function buildMailTemplateSamples(): array
    {
        return $this->sampleService->all();
    }

    /**
     * @param  array<int, array<string, mixed>>  $samples
     * @return array<int, array{key: string, label: string, template: array<string, mixed>}>
     */
    private function wrapMailTemplateSamples(array $samples): array
    {
        return array_values(array_map(static function (array $sample): array {
            $template = $sample;
            unset($template['label']);

            return [
                'key' => (string) ($sample['key'] ?? ''),
                'label' => (string) ($sample['label'] ?? ''),
                'template' => $template,
            ];
        }, $samples));
    }

    /**
     * @return array{company: string, phone: string, address: string, tax: string, logo: string, logo_url: string, copyright: string}
     */
    private function buildMailBrandData(): array
    {
        $sharedLangs = Inertia::getShared('langs');
        $languages = is_callable($sharedLangs) ? $sharedLangs() : $sharedLangs;
        $photoPath = trim((string) (config('image.path.photo.path') ?? 'media/photo'), '/');
        $defaultCompany = (string) config('app.name', 'Ukimua');

        if ($languages instanceof \Traversable) {
            $languages = iterator_to_array($languages, false);
        } elseif ($languages instanceof Arrayable) {
            $languages = $languages->toArray();
        }

        if (! is_array($languages)) {
            return $this->normalizeMailBrandData([
                'company' => $defaultCompany,
                'phone' => '',
                'address' => '',
                'tax' => '',
                'logo' => '',
                'logo_url' => '',
                'copyright' => '',
            ]);
        }

        $languageLocales = [];

        foreach ($languages as $language) {
            if (is_array($language)) {
                $languageLocales[] = (string) ($language['code'] ?? $language['locale'] ?? '');

                continue;
            }

            if (is_object($language) && method_exists($language, 'resolve')) {
                $languageData = $language->resolve(request());
                $languageLocales[] = (string) ($languageData['code'] ?? $languageData['locale'] ?? '');
            }
        }

        $localeCandidates = array_values(array_unique(array_filter(array_map(static function (mixed $locale): string {
            return strtolower(trim((string) $locale));
        }, [
            app()->getLocale(),
            'vi',
            ...$languageLocales,
        ]))));
        $fallbackBrand = null;

        foreach ($localeCandidates as $locale) {
            $brand = $this->resolveMailBrandFromLocale($locale, $photoPath);

            if ($brand === null) {
                continue;
            }

            if ($brand['company'] !== '') {
                return $brand;
            }

            if ($fallbackBrand === null) {
                $fallbackBrand = $brand;
            }
        }

        if ($fallbackBrand !== null) {
            $fallbackBrand['company'] = $fallbackBrand['company'] !== '' ? $fallbackBrand['company'] : $defaultCompany;

            return $this->normalizeMailBrandData($fallbackBrand);
        }

        return $this->normalizeMailBrandData([
            'company' => $defaultCompany,
            'phone' => '',
            'address' => '',
            'tax' => '',
            'logo' => '',
            'logo_url' => '',
            'copyright' => '',
        ]);
    }

    /**
     * @return array{company: string, phone: string, address: string, tax: string, logo: string, logo_url: string, copyright: string}|null
     */
    private function resolveMailBrandFromLocale(string $locale, string $photoPath): ?array
    {
        $page = Lang::get('page', [], $locale);

        if (! is_array($page)) {
            return null;
        }

        $brand = [
            'company' => trim((string) ($page['company'] ?? '')),
            'phone' => trim((string) ($page['phone'] ?? '')),
            'address' => trim((string) ($page['address'] ?? '')),
            'tax' => trim((string) ($page['tax'] ?? '')),
            'logo' => trim((string) ($page['logo'] ?? '')),
            'logo_url' => '',
            'copyright' => trim((string) ($page['copyright'] ?? '')),
        ];

        if ($brand['company'] === '' && $brand['phone'] === '' && $brand['address'] === '' && $brand['tax'] === '' && $brand['logo'] === '') {
            return null;
        }

        $brand['logo_url'] = $brand['logo'] !== '' ? asset($photoPath.'/'.$brand['logo']) : '';

        return $this->normalizeMailBrandData($brand);
    }

    /**
     * @param  array{company?: string, phone?: string, address?: string, tax?: string, logo?: string, logo_url?: string, copyright?: string}  $brand
     * @return array{company: string, phone: string, address: string, tax: string, logo: string, logo_url: string, copyright: string}
     */
    private function normalizeMailBrandData(array $brand): array
    {
        return [
            'company' => (string) ($brand['company'] ?? ''),
            'phone' => (string) ($brand['phone'] ?? ''),
            'address' => (string) ($brand['address'] ?? ''),
            'tax' => (string) ($brand['tax'] ?? ''),
            'logo' => (string) ($brand['logo'] ?? ''),
            'logo_url' => (string) ($brand['logo_url'] ?? ''),
            'copyright' => (string) ($brand['copyright'] ?? ''),
        ];
    }
}

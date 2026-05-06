<?php

namespace App\Http\Controllers\Admin\PageManager;

use App\Http\Controllers\Controller;
use App\Http\Requests\DestroyManyPagesRequest;
use App\Http\Requests\StorePageRequest;
use App\Http\Requests\UpdatePageRequest;
use App\Models\Page;
use App\Repositories\Page\PageRepositoryInterface as RepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function __construct(private readonly RepositoryInterface $repository) {}

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/PageManager/Index', [
            'pages' => $this->repository->lists($request->only(['search']), ['task' => 'admin-list-items']),
            'filters' => $request->only(['search']),
            'translations' => $this->repository->translations(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/PageManager/Create', $this->repository->getFormProps());
    }

    public function store(StorePageRequest $request): RedirectResponse
    {
        $this->repository->save($request->validated(), ['task' => 'add-item']);

        return redirect()->route('pages.index')->with('success', __('hancms.page.messages.created'));
    }

    public function quickStore(StorePageRequest $request): JsonResponse
    {
        $page = $this->repository->save($request->validated(), ['task' => 'add-item']);

        if (! $page instanceof Page) {
            return response()->json([
                'message' => __('hancms.page.messages.create_failed'),
            ], 422);
        }

        $page->load(['fieldGroup', 'translations', 'slugs']);
        $currentLocale = app()->getLocale();
        $pageTranslation = $page->translations?->firstWhere('locale', $currentLocale)
            ?? $page->translations?->first();

        return response()->json([
            'page' => [
                'id' => $page->id,
                'title' => $page->title,
                'label' => $pageTranslation?->title ?: $page->title ?: "#{$page->id}",
                'name' => $pageTranslation?->title ?: $page->title ?: "#{$page->id}",
                'schema_title' => $page->fieldGroup?->title ?? '',
                'has_content' => $page->hasContent(),
                'edit_url' => route('pages.edit', $page),
            ],
        ]);
    }

    public function show(Page $page): Response
    {
        $page->load(['fieldGroup', 'translations', 'slugs']);

        return Inertia::render('Admin/PageManager/Show', array_merge(
            $this->repository->getFormProps(['page' => $page]),
            ['page' => $page]
        ));
    }

    public function edit(Page $page): Response
    {
        $page->load(['fieldGroup', 'translations', 'slugs']);

        return Inertia::render('Admin/PageManager/Edit', $this->repository->getFormProps(['page' => $page]));
    }

    public function update(UpdatePageRequest $request, Page $page): RedirectResponse
    {
        $this->repository->save([...$request->validated(), 'id' => $page->id], ['task' => 'edit-item']);

        return redirect()->route('pages.edit', $page)->with('success', __('hancms.page.messages.updated'));
    }

    public function destroy(Page $page): RedirectResponse
    {
        $this->repository->delete(['id' => $page->id], ['task' => 'delete-item']);

        return redirect()->route('pages.index')->with('success', __('hancms.page.messages.deleted'));
    }

    public function destroyMany(DestroyManyPagesRequest $request): RedirectResponse
    {
        $this->repository->delete($request->validated(), ['task' => 'delete-items']);

        return redirect()->route('pages.index')->with('success', __('hancms.page.messages.deleted'));
    }

    public function toggleStatus(Page $page): RedirectResponse
    {
        $this->repository->save(['id' => $page->id], ['task' => 'change-status']);

        return back()->with('success', __('hancms.page.messages.updated'));
    }
}

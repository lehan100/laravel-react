<?php

namespace App\Http\Controllers\Admin\PageManager;

use App\Http\Controllers\Controller;
use App\Http\Requests\DestroyManyFieldGroupsRequest;
use App\Http\Requests\StoreFieldGroupRequest;
use App\Http\Requests\UpdateFieldGroupRequest;
use App\Http\Resources\FieldGroupResource;
use App\Models\FieldGroup;
use App\Repositories\FieldGroup\FieldGroupRepositoryInterface as RepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FieldGroupController extends Controller
{
    public function __construct(private readonly RepositoryInterface $repository) {}

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/PageManager/FieldGroups/Index', [
            'fieldGroups' => FieldGroupResource::collection(
                $this->repository->lists($request->only(['search']), ['task' => 'admin-list-items'])
            ),
            'filters' => $request->only(['search']),
            'translations' => $this->repository->translations(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/PageManager/FieldGroups/Create', $this->repository->getFormProps());
    }

    public function store(StoreFieldGroupRequest $request): RedirectResponse
    {
        $this->repository->save($request->validated(), ['task' => 'add-item']);

        return redirect()->route('page-schemas.index')->with('success', __('hancms.page.messages.created'));
    }

    public function show(FieldGroup $fieldGroup): Response
    {
        $fieldGroup = $this->repository->get(['id' => $fieldGroup->id], ['task' => 'get-item']) ?? $fieldGroup;

        return Inertia::render('Admin/PageManager/FieldGroups/Show', array_merge(
            $this->repository->getFormProps(['fieldGroup' => $fieldGroup]),
            ['fieldGroup' => FieldGroupResource::make($fieldGroup)]
        ));
    }

    public function edit(FieldGroup $fieldGroup): Response
    {
        $fieldGroup = $this->repository->get(['id' => $fieldGroup->id], ['task' => 'get-item']) ?? $fieldGroup;

        return Inertia::render('Admin/PageManager/FieldGroups/Edit', array_merge(
            $this->repository->getFormProps(['fieldGroup' => $fieldGroup]),
            ['fieldGroup' => FieldGroupResource::make($fieldGroup)]
        ));
    }

    public function update(UpdateFieldGroupRequest $request, FieldGroup $fieldGroup): RedirectResponse
    {
        $this->repository->save([...$request->validated(), 'id' => $fieldGroup->id], ['task' => 'edit-item']);

        return redirect()->route('page-schemas.edit', $fieldGroup)->with('success', __('hancms.page.messages.updated'));
    }

    public function destroy(FieldGroup $fieldGroup): RedirectResponse
    {
        if ($this->repository->isInUse($fieldGroup->id)) {
            return back()->with('error', __('hancms.field_group.messages.in_use'));
        }

        $this->repository->delete(['id' => $fieldGroup->id], ['task' => 'delete-item']);

        return redirect()->route('page-schemas.index')->with('success', __('hancms.page.messages.deleted'));
    }

    public function destroyMany(DestroyManyFieldGroupsRequest $request): RedirectResponse
    {
        $this->repository->delete($request->validated(), ['task' => 'delete-items']);

        return redirect()->route('page-schemas.index')->with('success', __('hancms.page.messages.deleted'));
    }

    public function toggleStatus(FieldGroup $fieldGroup): RedirectResponse
    {
        $this->repository->save(['id' => $fieldGroup->id], ['task' => 'change-status']);

        return back()->with('success', __('hancms.page.messages.updated'));
    }
}

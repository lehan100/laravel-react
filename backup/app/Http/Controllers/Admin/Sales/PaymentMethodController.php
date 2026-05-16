<?php

namespace App\Http\Controllers\Admin\Sales;

use App\Http\Controllers\MainController;
use App\Http\Requests\Sales\PaymentMethodRequest;
use App\Http\Resources\Sales\PaymentMethodCollection;
use App\Http\Resources\Sales\PaymentMethodResource;
use App\Repositories\PaymentMethod\PaymentMethodRepositoryInterface as RepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request as RequestFacade;
use Inertia\Inertia;
use Inertia\Response;

class PaymentMethodController extends MainController
{
    protected string $controllerView = 'Admin/Sales/PaymentMethod/';

    protected string $routeName = 'payment-methods.';

    protected RepositoryInterface $mainModel;

    public function __construct(RepositoryInterface $repository)
    {
        parent::__construct();
        $this->mainModel = $repository;
    }

    public function index(): Response
    {
        $this->params = array_merge(RequestFacade::all(), $this->params);
        $items = $this->mainModel->lists($this->params, ['task' => 'admin-list-items']);
        $search = trim((string) ($this->params['search'] ?? ''));
        $perPage = max(10, min(100, (int) ($this->params['per_page'] ?? 20)));

        return Inertia::render($this->controllerView.'Index', [
            'items' => new PaymentMethodCollection($items),
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render($this->controllerView.'Created', [
            'item' => null,
        ]);
    }

    public function store(PaymentMethodRequest $request): RedirectResponse
    {
        try {
            $params = $request->validated();
            $item = $this->mainModel->save($params, ['task' => 'add-item']);

            if ((int) ($params['undo'] ?? 0) === 1) {
                return Redirect::to(route($this->routeName.'index'))
                    ->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.sales.payment_methods.name'))]));
            }

            return Redirect::route($this->routeName.'edit', $item->id)
                ->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.sales.payment_methods.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()
                ->with('error', __('hancms.message.error.created', ['name' => mb_strtolower(__('hancms.sales.payment_methods.name'))]));
        }
    }

    public function show(string $id): RedirectResponse
    {
        return redirect()->route($this->routeName.'edit', $id);
    }

    public function edit(string $id): Response|RedirectResponse
    {
        $item = $this->mainModel->get(['id' => $id], ['task' => 'get-item']);
        if (! $item) {
            return redirect()->route($this->routeName.'index')
                ->with('error', __('hancms.message.error.edit', ['name' => mb_strtolower(__('hancms.sales.payment_methods.name'))]));
        }

        return Inertia::render($this->controllerView.'Edit', [
            'item' => new PaymentMethodResource($item),
        ]);
    }

    public function update(PaymentMethodRequest $request, string $id): RedirectResponse
    {
        $item = $this->mainModel->get(['id' => $id], ['task' => 'get-item']);
        if (! $item) {
            return redirect()->route($this->routeName.'index')
                ->with('error', __('hancms.message.error.edit', ['name' => mb_strtolower(__('hancms.sales.payment_methods.name'))]));
        }

        try {
            $params = $request->validated();
            $params['id'] = $id;
            $item = $this->mainModel->save($params, ['task' => 'edit-item']);

            if ((int) ($params['undo'] ?? 0) === 1) {
                return Redirect::to(route($this->routeName.'index'))
                    ->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.sales.payment_methods.name'))]));
            }

            return Redirect::route($this->routeName.'edit', $item->id)
                ->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.sales.payment_methods.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()
                ->with('error', __('hancms.message.error.edit', ['name' => mb_strtolower(__('hancms.sales.payment_methods.name'))]));
        }
    }

    public function destroy(string $id): RedirectResponse
    {
        try {
            $this->mainModel->delete(['id' => $id], ['task' => 'delete-item']);

            return Redirect::to(route($this->routeName.'index'))
                ->with('success', __('hancms.message.success.deleted', ['name' => mb_strtolower(__('hancms.sales.payment_methods.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()->with('error', __('hancms.message.error.deleted'));
        }
    }

    public function destroyMany(Request $request): RedirectResponse
    {
        try {
            $this->mainModel->delete($request->all(), ['task' => 'delete-items']);

            return Redirect::to(route($this->routeName.'index'))
                ->with('success', __('hancms.message.success.deleted', ['name' => mb_strtolower(__('hancms.sales.payment_methods.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()->with('error', __('hancms.message.error.deleted'));
        }
    }

    public function toggleStatus(string $id): RedirectResponse
    {
        $item = $this->mainModel->save(['id' => $id], ['task' => 'toggle-status']);
        if (! $item) {
            return Redirect::to(route($this->routeName.'index'))
                ->with('error', __('hancms.message.error.edit', ['name' => mb_strtolower(__('hancms.sales.payment_methods.name'))]));
        }

        return Redirect::to(route($this->routeName.'index'))
            ->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.sales.payment_methods.name'))]));
    }
}

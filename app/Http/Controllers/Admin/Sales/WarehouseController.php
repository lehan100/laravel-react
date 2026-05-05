<?php

namespace App\Http\Controllers\Admin\Sales;

use App\Http\Controllers\MainController;
use App\Http\Requests\Sales\WarehouseAdjustRequest;
use App\Http\Resources\Sales\WarehouseCollection;
use App\Http\Resources\Sales\WarehouseHistoryResource;
use App\Http\Resources\Sales\WarehouseResource;
use App\Repositories\Warehouse\WarehouseRepositoryInterface as RepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request as RequestFacade;
use Inertia\Inertia;
use Inertia\Response;

class WarehouseController extends MainController
{
    protected string $controllerView = 'Admin/Sales/Warehouse/';

    protected string $routeName = 'warehouse.';

    protected RepositoryInterface $mainModel;

    public function __construct(RepositoryInterface $repository)
    {
        parent::__construct();
        $this->mainModel = $repository;
    }

    public function index(Request $request): Response
    {
        $this->params = array_merge(RequestFacade::all(), $this->params);
        $items = $this->mainModel->lists($this->params, ['task' => 'admin-list-items']);
        $search = trim((string) ($this->params['search'] ?? ''));
        $stockStatus = (string) ($this->params['stock_status'] ?? 'all');
        $perPage = max(10, min(100, (int) ($this->params['per_page'] ?? 20)));

        return Inertia::render($this->controllerView.'Index', [
            'items' => new WarehouseCollection($items),
            'warehouse_name' => __('hancms.sales.warehouse.default_name'),
            'filters' => [
                'search' => $search,
                'stock_status' => $stockStatus,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create(): RedirectResponse
    {
        return redirect()->route($this->routeName.'index');
    }

    public function store(Request $request): RedirectResponse
    {
        return redirect()->route($this->routeName.'index');
    }

    public function show(string $id): RedirectResponse
    {
        return redirect()->route($this->routeName.'edit', $id);
    }

    public function edit(string $id): Response|RedirectResponse
    {
        $product = $this->mainModel->get(['id' => $id], ['task' => 'get-item']);

        if (! $product) {
            return redirect()->route($this->routeName.'index')->with('error', __('hancms.sales.warehouse.messages.product_not_found'));
        }

        $histories = $product->adjustmentHistories ?? collect();

        return Inertia::render($this->controllerView.'Edit', [
            'warehouse_name' => __('hancms.sales.warehouse.default_name'),
            'item' => new WarehouseResource($product),
            'histories' => WarehouseHistoryResource::collection($histories),
        ]);
    }

    public function update(WarehouseAdjustRequest $request, string $id): RedirectResponse
    {
        $product = $this->mainModel->find((int) $id);
        if (! $product) {
            return redirect()->route($this->routeName.'index')->with('error', __('hancms.sales.warehouse.messages.product_not_found'));
        }

        $params = $request->all();
        $params['id'] = $id;
        $this->mainModel->save($params, ['task' => 'adjust-item']);

        if ((int) $request->input('undo', 0) === 1) {
            return Redirect::to(route($this->routeName.'index'))
                ->with('success', __('hancms.sales.warehouse.messages.updated_success'));
        }

        return Redirect::route($this->routeName.'edit', $id)
            ->with('success', __('hancms.sales.warehouse.messages.updated_success'));
    }

    public function toggleStock(Request $request, string $id): RedirectResponse
    {
        $product = $this->mainModel->find((int) $id);
        if (! $product) {
            return redirect()->route($this->routeName.'index')->with('error', __('hancms.sales.warehouse.messages.product_not_found'));
        }

        $this->mainModel->save(['id' => $id], ['task' => 'toggle-stock']);

        return redirect()->route($this->routeName.'index')->with('success', __('hancms.sales.warehouse.messages.toggled_success'));
    }

    public function destroy(string $id): RedirectResponse
    {
        return redirect()->route($this->routeName.'index')->with('error', __('hancms.sales.warehouse.messages.delete_not_supported'));
    }

    public function destroyMany(Request $request): RedirectResponse
    {
        return redirect()->route($this->routeName.'index')->with('error', __('hancms.sales.warehouse.messages.bulk_delete_not_supported'));
    }
}

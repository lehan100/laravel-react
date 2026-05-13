<?php

namespace App\Http\Controllers\Admin\Sales;

use App\Http\Controllers\MainController;
use App\Http\Requests\Sales\OrderRequest;
use App\Http\Resources\Sales\OrderCollection;
use App\Http\Resources\Sales\OrderResource;
use App\Models\Sales\Order;
use App\Repositories\Order\OrderRepositoryInterface as RepositoryInterface;
use App\Services\Promotion\PromotionEngineService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request as RequestFacade;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends MainController
{
    protected string $controllerView = 'Admin/Sales/Order/';

    protected string $routeName = 'orders.';

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

        return Inertia::render($this->controllerView.'Index', [
            'items' => new OrderCollection($items),
            'filters' => [
                'search' => trim((string) ($this->params['search'] ?? '')),
                'order_status' => (string) ($this->params['order_status'] ?? 'all'),
                'payment_status' => (string) ($this->params['payment_status'] ?? 'all'),
            ],
            'status_options' => $this->statusOptions(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render($this->controllerView.'Created', [
            'item' => null,
            'form_options' => $this->mainModel->get([], ['task' => 'get-form-options']),
            'status_options' => $this->statusOptions(),
        ]);
    }

    public function store(OrderRequest $request): RedirectResponse
    {
        try {
            $params = $request->validated();
            $item = $this->mainModel->save($params, ['task' => 'add-item']);

            if ((int) ($params['undo'] ?? 0) === 1) {
                return Redirect::to(route($this->routeName.'index'))
                    ->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.sales.orders.name'))]));
            }

            return Redirect::route($this->routeName.'edit', $item->id)
                ->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.sales.orders.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()
                ->withInput()
                ->with('error', __('hancms.message.error.created', ['name' => mb_strtolower(__('hancms.sales.orders.name'))]));
        }
    }

    public function show(string $id): Response|RedirectResponse
    {
        $item = $this->mainModel->get(['id' => $id], ['task' => 'get-item']);
        if (! $item) {
            return redirect()->route($this->routeName.'index')
                ->with('error', __('hancms.message.error.edit', ['name' => mb_strtolower(__('hancms.sales.orders.name'))]));
        }

        return Inertia::render($this->controllerView.'Show', [
            'item' => new OrderResource($item),
            'status_options' => $this->statusOptions(),
            'layout_info' => $this->layoutInfo(),
            'page_title' => $this->showPageTitle($item),
        ]);
    }

    public function edit(string $id): Response|RedirectResponse
    {
        $item = $this->mainModel->get(['id' => $id], ['task' => 'get-item']);
        if (! $item) {
            return redirect()->route($this->routeName.'index')
                ->with('error', __('hancms.message.error.edit', ['name' => mb_strtolower(__('hancms.sales.orders.name'))]));
        }

        return Inertia::render($this->controllerView.'Edit', [
            'item' => new OrderResource($item),
            'form_options' => $this->mainModel->get([], ['task' => 'get-form-options']),
            'status_options' => $this->statusOptions(),
        ]);
    }

    public function update(OrderRequest $request, string $id): RedirectResponse
    {
        $item = $this->mainModel->get(['id' => $id], ['task' => 'get-item']);
        if (! $item) {
            return redirect()->route($this->routeName.'index')
                ->with('error', __('hancms.message.error.edit', ['name' => mb_strtolower(__('hancms.sales.orders.name'))]));
        }

        try {
            \Log::info('Order Update Request', ['all' => $request->all()]);
            $params = $request->validated();
            \Log::info('Order Update Validated', ['params' => $params]);
            $params['id'] = $id;
            $item = $this->mainModel->save($params, ['task' => 'edit-item']);

            if ((int) ($params['undo'] ?? 0) === 1) {
                return Redirect::to(route($this->routeName.'index'))
                    ->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.sales.orders.name'))]));
            }

            return Redirect::route($this->routeName.'edit', $item->id)
                ->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.sales.orders.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()
                ->withInput()
                ->with('error', __('hancms.message.error.edit', ['name' => mb_strtolower(__('hancms.sales.orders.name'))]));
        }
    }

    public function destroy(string $id): RedirectResponse
    {
        try {
            $this->mainModel->delete(['id' => $id], ['task' => 'delete-item']);

            return Redirect::to(route($this->routeName.'index'))
                ->with('success', __('hancms.message.success.deleted', ['name' => mb_strtolower(__('hancms.sales.orders.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()->with('error', __('hancms.message.error.deleted'));
        }
    }

    public function destroyMany(Request $request): RedirectResponse
    {
        try {
            $this->mainModel->delete($request->all(), ['task' => 'delete-items']);

            return Redirect::to(route($this->routeName.'index'))
                ->with('success', __('hancms.message.success.deleted', ['name' => mb_strtolower(__('hancms.sales.orders.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()->with('error', __('hancms.message.error.deleted'));
        }
    }

    /**
     * @return array<string, array<int, array<string, string>>>
     */
    private function statusOptions(): array
    {
        return [
            'order' => collect(Order::ORDER_STATUSES)
                ->map(fn (string $status) => ['value' => $status, 'label' => __('hancms.sales.orders.statuses.order.'.$status)])
                ->all(),
            'payment' => collect(Order::PAYMENT_STATUSES)
                ->map(fn (string $status) => ['value' => $status, 'label' => __('hancms.sales.orders.statuses.payment.'.$status)])
                ->all(),
            'shipping' => collect(Order::SHIPPING_STATUSES)
                ->map(fn (string $status) => ['value' => $status, 'label' => __('hancms.sales.orders.statuses.shipping.'.$status)])
                ->all(),
        ];
    }

    /**
     * @return array{company:string, phone:string, address:string, website:string}
     */
    private function layoutInfo(): array
    {
        $locale = app()->getLocale();
        $page = Lang::get('page', [], $locale);

        if (! is_array($page)) {
            $page = Lang::get('page', [], 'vi');
        }

        return [
            'company' => trim((string) ($page['company'] ?? '')),
            'phone' => trim((string) ($page['phone'] ?? '')),
            'address' => trim((string) ($page['address'] ?? '')),
            'website' => trim((string) config('app.url', '')),
        ];
    }

    private function showPageTitle(Order $item): string
    {
        return sprintf(
            '%s - %s - %s',
            __('hancms.sales.orders.name'),
            $item->order_number ?: '#'.$item->id,
            trim((string) $item->customer_name) !== '' ? trim((string) $item->customer_name) : '---'
        );
    }

    public function calculatePromotions(Request $request, PromotionEngineService $promotionEngine)
    {
        $items = $request->input('items', []);
        $couponCode = $request->input('coupon_code');
        $orderId = $request->integer('order_id') ?: null;

        // Normalize items array
        $normalizedItems = collect($items)->map(function ($item) {
            return [
                'product_id' => (int) ($item['product_id'] ?? 0),
                'variant_id' => ! empty($item['variant_id']) ? (int) $item['variant_id'] : null,
                'quantity' => (int) ($item['quantity'] ?? 1),
                'unit_price' => (float) ($item['unit_price'] ?? 0),
                'is_gift' => (bool) ($item['is_gift'] ?? false),
            ];
        })->all();

        $result = $promotionEngine->calculate($normalizedItems, $couponCode, $orderId);

        return response()->json($result);
    }
}

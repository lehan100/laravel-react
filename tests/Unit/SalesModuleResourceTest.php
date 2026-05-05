<?php

namespace Tests\Unit;

use App\Http\Resources\Sales\OrderCollection;
use App\Http\Resources\Sales\OrderResource;
use App\Http\Resources\Sales\PaymentMethodCollection;
use App\Http\Resources\Sales\PaymentMethodResource;
use App\Http\Resources\Sales\ShippingMethodCollection;
use App\Http\Resources\Sales\ShippingMethodResource;
use App\Http\Resources\Sales\WarehouseCollection;
use App\Http\Resources\Sales\WarehouseHistoryResource;
use App\Http\Resources\Sales\WarehouseResource;
use App\Models\Catalog\Product;
use App\Models\Sales\InventoryAdjustmentHistory;
use App\Models\Sales\Order;
use App\Models\Sales\OrderItem;
use App\Models\Sales\OrderTimeline;
use App\Models\Sales\PaymentMethod;
use App\Models\Sales\ShippingMethod;
use App\Models\Settings\Province;
use App\Models\Settings\Ward;
use App\Models\Users\User;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SalesModuleResourceTest extends TestCase
{
    #[Test]
    public function it_serializes_payment_shipping_and_warehouse_resources(): void
    {
        app()->setLocale('vi');

        $paymentMethod = new PaymentMethod([
            'id' => 11,
            'code' => 'momo',
            'provider' => 'momo',
            'name' => 'MoMo',
            'description' => 'Ví điện tử MoMo',
            'settings' => ['sandbox' => true],
            'is_active' => true,
            'is_system' => false,
            'sort_order' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $shippingMethod = new ShippingMethod([
            'id' => 22,
            'code' => 'ghn',
            'provider' => 'ghn',
            'name' => 'GHN',
            'description' => 'Giao Hàng Nhanh',
            'settings' => ['insured' => true],
            'is_active' => true,
            'is_system' => true,
            'sort_order' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $product = new Product([
            'id' => 33,
            'sku' => 'VAR-2490',
            'quantity' => 0,
            'price' => 1990000,
            'is_stock' => false,
            'status' => 1,
            'updated_at' => now(),
        ]);
        $product->setRelation('translations', collect([(object) ['name' => 'Nắp Xăng Accossato Yamaha FC124']]));

        $historyUser = new User([
            'id' => 44,
            'first_name' => 'Le',
            'last_name' => 'Han',
            'email' => 'le@example.com',
        ]);

        $history = new InventoryAdjustmentHistory([
            'id' => 55,
            'product_id' => 33,
            'user_id' => 44,
            'action' => 'set',
            'old_quantity' => 1,
            'new_quantity' => 0,
            'delta' => -1,
            'reason' => 'Sync stock',
            'meta' => ['channel' => 'website'],
            'created_at' => now(),
        ]);
        $history->setRelation('user', $historyUser);

        $paymentArray = (new PaymentMethodResource($paymentMethod))->resolve(Request::create('/'));
        $shippingArray = (new ShippingMethodResource($shippingMethod))->resolve(Request::create('/'));
        $warehouseArray = (new WarehouseResource($product))->resolve(Request::create('/'));
        $historyArray = (new WarehouseHistoryResource($history))->resolve(Request::create('/'));
        $paymentCollectionArray = (new PaymentMethodCollection(collect([$paymentMethod])))->resolve(Request::create('/'));
        $shippingCollectionArray = (new ShippingMethodCollection(collect([$shippingMethod])))->resolve(Request::create('/'));
        $warehouseCollectionArray = (new WarehouseCollection(collect([$product])))->resolve(Request::create('/'));

        $this->assertSame('momo', $paymentArray['code']);
        $this->assertSame('MoMo', $paymentArray['name']);
        $this->assertSame(['sandbox' => true], $paymentArray['settings']);

        $this->assertSame('ghn', $shippingArray['code']);
        $this->assertSame('GHN', $shippingArray['name']);
        $this->assertSame(true, $shippingArray['is_system']);

        $this->assertSame('momo', $paymentCollectionArray[0]['code']);
        $this->assertSame('ghn', $shippingCollectionArray[0]['code']);
        $this->assertSame('VAR-2490', $warehouseCollectionArray[0]['sku']);

        $this->assertSame('VAR-2490', $warehouseArray['sku']);
        $this->assertSame('Nắp Xăng Accossato Yamaha FC124', $warehouseArray['name']);
        $this->assertSame(0, $warehouseArray['quantity']);
        $this->assertSame(false, $warehouseArray['is_stock']);

        $this->assertSame('set', $historyArray['action']);
        $this->assertSame('Le Han', $historyArray['user_name']);
        $this->assertSame(-1, $historyArray['delta']);
    }

    #[Test]
    public function it_serializes_order_resources_with_nested_items_timelines_and_pagination(): void
    {
        app()->setLocale('ja');

        $paymentMethod = new PaymentMethod([
            'id' => 66,
            'code' => 'cash_on_delivery',
            'provider' => 'cash_on_delivery',
            'name' => 'COD',
        ]);

        $province = new Province([
            'code' => '79',
            'name' => 'Hồ Chí Minh',
            'name_en' => 'Ho Chi Minh City',
            'full_name' => 'Thành phố Hồ Chí Minh',
            'full_name_en' => 'Ho Chi Minh City',
            'code_name' => 'ho-chi-minh',
            'administrative_unit_id' => 1,
        ]);

        $ward = new Ward([
            'code' => '26734',
            'name' => 'Bến Nghé',
            'name_en' => 'Ben Nghe',
            'full_name' => 'Phường Bến Nghé',
            'full_name_en' => 'Ben Nghe Ward',
            'code_name' => 'ben-nghe',
            'province_code' => '79',
            'administrative_unit_id' => 1,
        ]);

        $orderItem = new OrderItem([
            'id' => 77,
            'order_id' => 88,
            'product_id' => 99,
            'product_name' => 'Nước hoa Charme Cool Water',
            'product_sku' => 'A001',
            'quantity' => 2,
            'unit_price' => 590000,
            'line_total' => 1180000,
            'meta' => ['currency_code' => 'JPY'],
        ]);

        $timelineUser = new User([
            'id' => 101,
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@example.com',
        ]);

        $timeline = new OrderTimeline([
            'id' => 102,
            'order_id' => 88,
            'user_id' => 101,
            'event_type' => 'created',
            'title' => 'created',
            'description' => null,
            'old_value' => null,
            'new_value' => 'pending',
            'meta' => [
                'order_status' => 'pending',
                'payment_status' => 'unpaid',
                'shipping_status' => 'pending',
            ],
        ]);
        $timeline->setRelation('user', $timelineUser);

        $order = new Order([
            'id' => 88,
            'order_number' => 'ORD-00088',
            'user_id' => 101,
            'payment_method_id' => 66,
            'price_snapshot' => [
                [
                    'locale' => 'ja',
                    'currency_code' => 'JPY',
                    'currency_symbol' => '¥',
                    'exchange_rate_to_vnd' => 170,
                ],
            ],
            'customer_name' => 'Lê Hân',
            'customer_email' => 'lehan@example.com',
            'customer_phone' => '0903123456',
            'customer_address' => '86 Nguyen Du',
            'province_code' => '79',
            'ward_code' => '26734',
            'note' => 'Giao giờ hành chính',
            'order_status' => 'pending',
            'payment_status' => 'unpaid',
            'shipping_status' => 'pending',
            'total_quantity' => 2,
            'subtotal' => 1180000,
            'discount_total' => 0,
            'shipping_total' => 0,
            'grand_total' => 1180000,
            'placed_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $order->setRelation('paymentMethod', $paymentMethod);
        $order->setRelation('province', $province);
        $order->setRelation('ward', $ward);
        $order->setRelation('items', collect([$orderItem]));
        $order->setRelation('timelines', collect([$timeline]));

        $orderArray = (new OrderResource($order))->resolve(Request::create('/'));

        $this->assertSame('ORD-00088', $orderArray['order_number']);
        $this->assertSame('COD', $orderArray['payment_method_name']);
        $this->assertSame('Ho Chi Minh City', $orderArray['province_name']);
        $this->assertSame('Ben Nghe Ward', $orderArray['ward_name']);
        $this->assertSame('JPY', $orderArray['currency_code']);
        $this->assertSame(1, count($orderArray['items']));
        $this->assertSame(1, count($orderArray['timelines']));

        $paginator = new LengthAwarePaginator(
            collect([$order]),
            1,
            20,
            1,
            ['path' => '/admin123/orders']
        );

        $response = (new OrderCollection($paginator))->toResponse(Request::create('/admin123/orders'));
        $payload = $response->getData(true);

        $this->assertArrayHasKey('data', $payload);
        $this->assertArrayHasKey('links', $payload);
        $this->assertArrayHasKey('meta', $payload);
        $this->assertSame('ORD-00088', $payload['data'][0]['order_number']);
    }
}

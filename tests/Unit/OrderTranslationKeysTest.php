<?php

namespace Tests\Unit;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OrderTranslationKeysTest extends TestCase
{
    #[Test]
    public function it_resolves_order_labels_and_statuses_in_supported_locales(): void
    {
        $cases = [
            'vi' => [
                'hancms.sales.orders.name' => 'Đơn hàng',
                'hancms.sales.orders.created' => 'Thêm đơn hàng',
                'hancms.sales.orders.placeholders.search' => 'Tìm kiếm mã đơn, tên khách hàng hoặc số điện thoại...',
                'hancms.sales.orders.fields.order_number' => 'Mã đơn hàng',
                'hancms.sales.orders.actions.add_item' => 'Thêm sản phẩm',
                'hancms.sales.orders.payment_methods.cod_label' => 'Thanh toán khi nhận hàng',
                'hancms.button.print' => 'In',
                'hancms.sales.orders.statuses.order.pending' => 'Chờ xử lý',
                'hancms.sales.orders.print.confirmation_title' => 'Xác nhận đơn hàng',
                'hancms.sales.orders.history.event_labels.shipping_status_changed' => 'Cập nhật giao hàng',
            ],
            'en' => [
                'hancms.sales.orders.name' => 'Orders',
                'hancms.sales.orders.created' => 'Create Order',
                'hancms.sales.orders.placeholders.search' => 'Search order number, customer name, or phone...',
                'hancms.sales.orders.fields.order_number' => 'Order Number',
                'hancms.sales.orders.actions.add_item' => 'Add Item',
                'hancms.sales.orders.payment_methods.cod_label' => 'Cash on Delivery',
                'hancms.button.print' => 'Print',
                'hancms.sales.orders.statuses.order.pending' => 'Pending',
                'hancms.sales.orders.print.confirmation_title' => 'Order Confirmation',
                'hancms.sales.orders.history.event_labels.shipping_status_changed' => 'Shipping Status Updated',
            ],
            'ja' => [
                'hancms.sales.orders.name' => '注文',
                'hancms.sales.orders.created' => '注文を追加',
                'hancms.sales.orders.placeholders.search' => '注文番号、顧客名、電話番号を検索...',
                'hancms.sales.orders.fields.order_number' => '注文番号',
                'hancms.sales.orders.actions.add_item' => '商品を追加',
                'hancms.sales.orders.payment_methods.cod_label' => '代金引換',
                'hancms.button.print' => '印刷',
                'hancms.sales.orders.statuses.order.pending' => '保留中',
                'hancms.sales.orders.print.confirmation_title' => '注文確認',
                'hancms.sales.orders.history.event_labels.shipping_status_changed' => '配送ステータス更新',
            ],
        ];

        foreach ($cases as $locale => $expectedTranslations) {
            app()->setLocale($locale);

            foreach ($expectedTranslations as $key => $expectedValue) {
                $this->assertSame($expectedValue, trans($key));
            }
        }
    }
}

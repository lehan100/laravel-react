<?php

namespace Tests\Feature;

use App\Http\Middleware\PermissionMiddleware;
use App\Models\Settings\Language;
use App\Repositories\MailTemplate\MailTemplateRepositoryInterface;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Collection;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class MailTemplateControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Language::query()->create(['name' => 'Tiếng Việt', 'code' => 'vi', 'photo' => 'vi.png', 'status' => true]);
        Language::query()->create(['name' => 'English', 'code' => 'en', 'photo' => 'en.png', 'status' => true]);
        Language::query()->create(['name' => '日本', 'code' => 'ja', 'photo' => 'ja.png', 'status' => true]);
    }

    #[Test]
    public function it_renders_the_mail_template_pages(): void
    {
        $this->withoutMiddleware([Authenticate::class, PermissionMiddleware::class])
            ->get(route('mail-templates.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Settings/MailTemplate/Index')
            );

        $this->withoutMiddleware([Authenticate::class, PermissionMiddleware::class])
            ->get(route('mail-templates.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Settings/MailTemplate/Created')
                ->has('brand')
                ->where('brand.company', 'Ukimua')
                ->has('sampleTemplates', 5)
                ->where('sampleTemplates.0.key', 'order_created')
                ->where('sampleTemplates.1.key', 'order_updated')
                ->where('sampleTemplates.2.key', 'order_paid')
                ->where('sampleTemplates.3.key', 'order_shipped')
                ->where('sampleTemplates.4.key', 'order_cancelled')
                ->where('sampleTemplate.key', 'order_created')
                ->where('sampleTemplate.fallbackLocale', 'vi')
                ->where('sampleTemplate.variables', function ($variables): bool {
                    $values = $variables instanceof Collection ? $variables->all() : (array) $variables;

                    return count($values) === 14
                        && in_array('brand_company', $values, true)
                        && in_array('order_code', $values, true)
                        && in_array('items_html', $values, true)
                        && in_array('items_text', $values, true)
                        && in_array('items_count', $values, true);
                })
                ->where('sampleTemplate.translations.vi.subject', 'Đơn hàng #{{order_code}} đã được tạo')
                ->where('sampleTemplate.translations.en.subject', 'Order #{{order_code}} has been created')
                ->where('sampleTemplate.translations.ja.body_html', function (string $html): bool {
                    return str_starts_with(ltrim($html), '<tr>')
                        && str_contains($html, '注文番号')
                        && str_contains($html, '購入商品')
                        && ! str_contains($html, 'Mã đơn hàng');
                })
                ->where('sampleTemplate.translations.vi.body_html', function (string $html): bool {
                    return str_starts_with(ltrim($html), '<tr>')
                        && str_contains($html, '{{items_html}}')
                        && str_contains($html, 'Mã đơn hàng')
                        && str_contains($html, 'Khách hàng')
                        && ! str_contains($html, '{{mail_footer}}')
                        && ! str_contains($html, 'Nếu bạn không đặt đơn hàng này');
                })
                ->where('sampleTemplates.1.template.variables', function ($variables): bool {
                    $values = $variables instanceof Collection ? $variables->all() : (array) $variables;

                    return count($values) === 13
                        && in_array('brand_company', $values, true)
                        && in_array('order_total', $values, true)
                        && in_array('items_html', $values, true)
                        && in_array('items_text', $values, true)
                        && in_array('items_count', $values, true);
                })
                ->where('sampleTemplates.1.template.translations.vi.body_html', function (string $html): bool {
                    return str_starts_with(ltrim($html), '<tr>')
                        && str_contains($html, '{{items_html}}')
                        && str_contains($html, 'Sản phẩm đã mua')
                        && ! str_contains($html, '<!doctype html>')
                        && ! str_contains($html, '{{brand_company}}');
                })
            );

        $repository = app(MailTemplateRepositoryInterface::class);
        $template = $repository->save([
            'key' => 'order_created_ui_check',
            'module' => 'sales',
            'fallback_locale' => 'vi',
            'variables' => ['order_code', 'customer_name'],
            'is_active' => true,
            'translations' => [
                'vi' => [
                    'locale' => 'vi',
                    'name' => 'Đơn hàng mới',
                    'subject' => 'Đơn hàng {{order_code}} đã được tạo',
                    'body_html' => '<p>Xin chào {{customer_name}}</p>',
                ],
                'en' => [
                    'locale' => 'en',
                    'name' => 'New Order',
                    'subject' => 'Order {{order_code}} has been created',
                    'body_html' => '<p>Hello {{customer_name}}</p>',
                ],
                'ja' => [
                    'locale' => 'ja',
                    'name' => '新しい注文',
                    'subject' => '注文 {{order_code}} が作成されました',
                    'body_html' => '<p>{{customer_name}} さん、こんにちは</p>',
                ],
            ],
        ], ['task' => 'add-item']);

        $this->withoutMiddleware([Authenticate::class, PermissionMiddleware::class])
            ->get(route('mail-templates.edit', $template->id))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Settings/MailTemplate/Edit')
                ->has('brand')
                ->has('sampleTemplates', 5)
                ->where('item.translations.vi.locale', 'vi')
                ->where('item.translations.vi.name', 'Đơn hàng mới')
                ->where('item.translations.en.locale', 'en')
                ->where('item.translations.en.name', 'New Order')
                ->where('item.translations.ja.locale', 'ja')
                ->where('item.translations.ja.name', '新しい注文')
                ->where('sampleTemplates.0.key', 'order_created')
            );
    }

    #[Test]
    public function it_can_store_a_mail_template_with_translations(): void
    {
        $repository = app(MailTemplateRepositoryInterface::class);

        $response = $this->withoutMiddleware([Authenticate::class, PermissionMiddleware::class])
            ->post(route('mail-templates.store'), [
                'key' => 'order_created',
                'module' => 'sales',
                'fallback_locale' => 'vi',
                'variables' => ['order_code', 'customer_name'],
                'is_active' => true,
                'undo' => 0,
                'translations' => [
                    'vi' => [
                        'name' => 'Đơn hàng mới',
                        'subject' => 'Đơn hàng {{order_code}} đã được tạo',
                        'body_html' => '<p>Xin chào {{customer_name}}</p>',
                    ],
                    'en' => [
                        'name' => 'New Order',
                        'subject' => 'Order {{order_code}} has been created',
                        'body_html' => '<p>Hello {{customer_name}}</p>',
                    ],
                    'ja' => [
                        'name' => '新しい注文',
                        'subject' => '注文 {{order_code}} が作成されました',
                        'body_html' => '<p>{{customer_name}} さん、こんにちは</p>',
                    ],
                ],
            ]);

        $response->assertRedirect();

        $template = $repository->findByKey('order_created');

        $this->assertNotNull($template);
        $this->assertSame('sales', $template?->module);
        $this->assertSame('vi', $template?->fallback_locale);
        $this->assertSame(['order_code', 'customer_name'], $template?->variables);

        $this->assertDatabaseHas('mail_templates', [
            'key' => 'order_created',
            'module' => 'sales',
            'fallback_locale' => 'vi',
            'is_active' => true,
        ]);

        $this->assertDatabaseHas('mail_template_translations', [
            'mail_template_id' => $template->id,
            'locale' => 'vi',
            'name' => 'Đơn hàng mới',
        ]);

        $this->assertDatabaseHas('mail_template_translations', [
            'mail_template_id' => $template->id,
            'locale' => 'en',
            'name' => 'New Order',
        ]);

        $this->assertDatabaseHas('mail_template_translations', [
            'mail_template_id' => $template->id,
            'locale' => 'ja',
            'name' => '新しい注文',
        ]);
    }
}

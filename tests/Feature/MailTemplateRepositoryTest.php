<?php

namespace Tests\Feature;

use App\Repositories\MailTemplate\MailTemplateRepositoryInterface;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class MailTemplateRepositoryTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'database.default' => 'sqlite',
            'database.connections.sqlite.database' => ':memory:',
            'translatable.locales' => ['vi', 'en', 'ja'],
        ]);

        DB::purge('sqlite');
        DB::setDefaultConnection('sqlite');
    }

    #[Test]
    public function it_saves_mail_template_translations_and_fallback_locale(): void
    {
        $migration = require base_path('database/migrations/2026_05_13_052812_create_mail_templates_table.php');
        $migration->up();

        $repository = app(MailTemplateRepositoryInterface::class);

        $template = $repository->save([
            'key' => 'order_created',
            'module' => 'sales',
            'fallback_locale' => 'vi',
            'variables' => [
                'order_code',
                'customer_name',
            ],
            'is_active' => true,
            'translations' => [
                'vi' => [
                    'name' => 'Đơn hàng mới',
                    'subject' => 'Đơn hàng #{{order_code}} đã được tạo',
                    'body_html' => '<p>Xin chào {{customer_name}}</p>',
                ],
                'en' => [
                    'name' => 'Order created',
                    'subject' => 'Order #{{order_code}} has been created',
                    'body_html' => '<p>Hello {{customer_name}}</p>',
                ],
            ],
        ], ['task' => 'add-item']);

        $this->assertNotFalse($template);
        $this->assertDatabaseHas('mail_templates', [
            'key' => 'order_created',
            'module' => 'sales',
            'fallback_locale' => 'vi',
            'is_active' => 1,
        ]);
        $this->assertDatabaseHas('mail_template_translations', [
            'mail_template_id' => $template->id,
            'locale' => 'vi',
            'name' => 'Đơn hàng mới',
        ]);
        $this->assertDatabaseHas('mail_template_translations', [
            'mail_template_id' => $template->id,
            'locale' => 'en',
            'name' => 'Order created',
        ]);

        $found = $repository->findByKey('order_created');

        $this->assertNotNull($found);
        $this->assertSame($template->id, $found->id);
    }
}

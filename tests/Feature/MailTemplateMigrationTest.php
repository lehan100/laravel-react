<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class MailTemplateMigrationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'database.default' => 'sqlite',
            'database.connections.sqlite.database' => ':memory:',
        ]);

        DB::purge('sqlite');
        DB::setDefaultConnection('sqlite');
    }

    #[Test]
    public function it_creates_the_mail_template_schema(): void
    {
        $migration = require base_path('database/migrations/2026_05_13_052812_create_mail_templates_table.php');
        $dropBodyTextMigration = require base_path('database/migrations/2026_05_14_020222_drop_body_text_from_mail_template_translations_table.php');

        $migration->up();
        $dropBodyTextMigration->up();

        $this->assertTrue(Schema::hasTable('mail_templates'));
        $this->assertTrue(Schema::hasTable('mail_template_translations'));
        $this->assertTrue(Schema::hasColumn('mail_templates', 'key'));
        $this->assertTrue(Schema::hasColumn('mail_templates', 'module'));
        $this->assertTrue(Schema::hasColumn('mail_templates', 'fallback_locale'));
        $this->assertTrue(Schema::hasColumn('mail_templates', 'variables'));
        $this->assertTrue(Schema::hasColumn('mail_templates', 'is_active'));
        $this->assertTrue(Schema::hasColumn('mail_template_translations', 'name'));
        $this->assertTrue(Schema::hasColumn('mail_template_translations', 'subject'));
        $this->assertTrue(Schema::hasColumn('mail_template_translations', 'body_html'));
        $this->assertFalse(Schema::hasColumn('mail_template_translations', 'body_text'));

        $dropBodyTextMigration->down();
        $migration->down();
    }
}

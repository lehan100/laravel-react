<?php

namespace Tests\Feature;

use App\Http\Middleware\PermissionMiddleware;
use App\Models\Settings\Language;
use App\Services\Settings\LabelTranslationService;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LabelControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Language::query()->create(['name' => 'Tiếng Việt', 'code' => 'vi', 'photo' => 'vi.png', 'status' => true]);
        Language::query()->create(['name' => 'English', 'code' => 'en', 'photo' => 'en.png', 'status' => true]);
    }

    #[Test]
    public function it_renders_labels_with_the_translation_service_payload(): void
    {
        $service = new class extends LabelTranslationService
        {
            public array $receivedLocales = [];

            public function loadEditableTranslations(array $locales, ?string $basePath = null): array
            {
                $this->receivedLocales = $locales;

                return [
                    'translation_keys' => ['shared_label', 'settings.mail_template.actions.preview'],
                    'translations' => [
                        'vi' => [
                            'shared_label' => 'Ghi đè từ label',
                            'settings.mail_template.actions.preview' => 'Xem trước từ hancms',
                        ],
                        'en' => [
                            'shared_label' => 'Hancms default',
                            'settings.mail_template.actions.preview' => 'Preview from hancms',
                        ],
                    ],
                ];
            }
        };

        app()->instance(LabelTranslationService::class, $service);

        $this->withoutMiddleware([Authenticate::class, PermissionMiddleware::class])
            ->get(route('labels.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Label/Index')
                ->where('labels.translation_keys.0', 'shared_label')
                ->where('labels.translations.vi.shared_label', 'Ghi đè từ label')
                ->where('labels.translations.en.shared_label', 'Hancms default')
            );

        $this->assertSame(['vi', 'en'], $service->receivedLocales);
    }

    #[Test]
    public function it_redirects_back_to_the_labels_index_after_storing(): void
    {
        File::shouldReceive('exists')
            ->andReturnFalse();
        File::shouldReceive('put')
            ->once()
            ->withArgs(function (string $path, string $content): bool {
                $this->assertStringEndsWith('lang/vi/label.php', str_replace('\\', '/', $path));
                $this->assertStringContainsString("'sample' => 'value'", $content);

                return true;
            })
            ->andReturnTrue();

        $this->withoutMiddleware([Authenticate::class, PermissionMiddleware::class])
            ->post(route('labels.store'), [
                'labels' => [
                    'translation_keys' => ['sample'],
                    'translations' => [
                        'vi' => [
                            'sample' => 'value',
                        ],
                    ],
                ],
            ])
            ->assertRedirect(route('labels.index'));
    }
}

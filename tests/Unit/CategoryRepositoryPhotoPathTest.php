<?php

namespace Tests\Unit;

use App\Repositories\Category\CategoryEloquentRepository;
use PHPUnit\Framework\Attributes\Test;
use ReflectionMethod;
use Tests\TestCase;

class CategoryRepositoryPhotoPathTest extends TestCase
{
    #[Test]
    public function it_keeps_nested_photo_paths_and_absolute_urls_intact(): void
    {
        $repository = app(CategoryEloquentRepository::class);

        $method = new ReflectionMethod($repository, 'normalizeCategoryPhotoName');
        $method->setAccessible(true);

        $this->assertSame('media/editor/categories/brand-logo.png', $method->invoke($repository, 'media/editor/categories/brand-logo.png'));
        $this->assertSame('/media/editor/categories/brand-logo.png', $method->invoke($repository, '/media/editor/categories/brand-logo.png'));
        $this->assertSame('https://example.com/media/editor/categories/brand-logo.png', $method->invoke($repository, 'https://example.com/media/editor/categories/brand-logo.png'));
        $this->assertSame('brand-logo.png', $method->invoke($repository, 'brand-logo.png'));
    }
}

<?php

namespace Tests\Unit;

use App\Http\Controllers\Admin\Catalog\CategoryController;
use App\Repositories\Category\CategoryRepositoryInterface;
use PHPUnit\Framework\Attributes\Test;
use ReflectionClass;
use Tests\TestCase;

class CategoryControllerTest extends TestCase
{
    #[Test]
    public function it_calls_the_parent_constructor_when_instantiated(): void
    {
        new CategoryController(new FakeCategoryRepository);

        $sharedViewData = view()->getShared();

        $this->assertArrayHasKey('isDataTable', $sharedViewData);
        $this->assertFalse($sharedViewData['isDataTable']);
    }

    #[Test]
    public function it_declares_typed_properties_for_its_internal_state(): void
    {
        $reflection = new ReflectionClass(CategoryController::class);

        $this->assertSame('string', $reflection->getProperty('controllerView')->getType()?->getName());
        $this->assertSame('string', $reflection->getProperty('routeName')->getType()?->getName());
        $this->assertSame(CategoryRepositoryInterface::class, $reflection->getProperty('mainModel')->getType()?->getName());
    }
}

class FakeCategoryRepository implements CategoryRepositoryInterface
{
    public function find(int $id)
    {
        return null;
    }

    public function lists($params = null, $options = null)
    {
        return collect();
    }

    public function get($params = null, $options = null)
    {
        return null;
    }

    public function save($params = null, $options = null)
    {
        return null;
    }

    public function delete($params = null, $options = null)
    {
        return false;
    }

    public function getProductPickerData(int $perPage = 10, string $search = '', array $categoryIds = []): array
    {
        return [
            'data' => [],
            'meta' => [],
        ];
    }

    public function getSelectedProductRows(array $ids): array
    {
        return [];
    }

    public function getActiveProductRows(): array
    {
        return [];
    }

    public function getCategoryAndDescendantIds(int $categoryId): array
    {
        return [$categoryId];
    }
}

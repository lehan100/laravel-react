<?php

namespace Tests\Unit;

use App\Models\Sales\ShippingMethod;
use App\Repositories\ShippingMethod\ShippingMethodEloquentRepository;
use App\Repositories\ShippingMethod\ShippingMethodRepositoryInterface;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ShippingMethodSoftDeletesTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (! Schema::hasTable('shipping_methods')) {
            Schema::create('shipping_methods', function (Blueprint $table): void {
                $table->id();
                $table->string('code', 100)->unique();
                $table->string('provider', 100)->index();
                $table->string('name', 255);
                $table->text('description')->nullable();
                $table->json('settings')->nullable();
                $table->unsignedInteger('sort_order')->default(0);
                $table->boolean('is_active')->default(true)->index();
                $table->boolean('is_system')->default(false)->index();
                $table->softDeletes();
                $table->timestamps();
            });
        }
    }

    #[Test]
    public function it_uses_soft_deletes(): void
    {
        $traits = class_uses_recursive(ShippingMethod::class);

        $this->assertArrayHasKey(SoftDeletes::class, $traits);
        $this->assertSame('deleted_at', (new ShippingMethod)->getDeletedAtColumn());
    }

    #[Test]
    public function repository_delete_soft_deletes_the_shipping_method(): void
    {
        $repository = app(ShippingMethodRepositoryInterface::class);
        $this->assertInstanceOf(ShippingMethodEloquentRepository::class, $repository);

        $method = ShippingMethod::query()->create([
            'code' => 'ghn',
            'provider' => 'ghn',
            'name' => 'GHN',
            'description' => 'Giao Hàng Nhanh',
            'settings' => [],
            'sort_order' => 0,
            'is_active' => true,
            'is_system' => false,
        ]);

        $deleted = $repository->delete(['id' => $method->id], ['task' => 'delete-item']);

        $this->assertSame(1, $deleted);
        $this->assertSoftDeleted('shipping_methods', [
            'id' => $method->id,
        ]);
    }
}

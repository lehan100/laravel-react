<?php

namespace App\Observers;

use App\Models\Catalog\ProductAttribute;

class AttributeObserver
{
    public function deleting(ProductAttribute $attribute): void
    {
        if ($attribute->isForceDeleting()) {
            $attribute->values()->withTrashed()->get()->each(static function ($value): void {
                $value->forceDelete();
            });

            return;
        }

        $attribute->values()->get()->each(static function ($value): void {
            $value->delete();
        });
    }

    public function restoring(ProductAttribute $attribute): void
    {
        $attribute->values()->withTrashed()->get()->each(static function ($value): void {
            $value->restore();
        });
    }
}

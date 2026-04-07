<?php

namespace App\Observers;

use App\Models\Product;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProductObserver
{
    /**
     * Handle the Product "created" event.
     */
    public function created(Product $product): void
    {
        // Load relationships to ensure all data is logged
        $product->load(['translations', 'photos']);

        Log::info("--- NEW PRODUCT CREATED ---", [
            'id'    => $product->id,
            'sku'   => $product->sku,
            'locale_count' => $product->translations->count()
        ]);
    }

    /**
     * Handle the Product "deleting" event.
     */
    public function deleting(Product $product): void
    {
        if ($product->isForceDeleting()) {
            // 1. Permanently delete translations
            $product->translations()->get()->each->forceDelete();

            // 2. Delete related slugs (Morph)
            $product->slugs()->delete();

            // 3. Trigger ImageFileObserver for each photo by force deleting them
            // This ensures physical files are deleted via ImageFileObserver
            $product->photos()->get()->each->forceDelete();
            Log::warning("--- PRODUCT PERMANENTLY DELETED ---", ['id' => $product->id]);
        } else {
            // 1. Soft Delete translations (Only hides them from queries)
            $product->translations()->get()->each->delete();
            // 2. Deactivate slugs to prevent SEO routing issues
            $product->slugs()->update(['status' => 0]);
            // 3. Soft Delete photos (Ensures ImageFileObserver isn't triggered for physical deletion)
            // This hides photos from the product but keeps the physical files for potential restoration
            $product->photos()->get()->each->delete();
            Log::info("--- PRODUCT SOFT DELETED ---", ['id' => $product->id]);
        }
    }

    /**
     * Handle the Product "restored" event.
     */
    public function restored(Product $product): void
    {
        // 1. Restore all soft-deleted translations
        $product->translations()->withTrashed()->get()->each->restore();
        // 2. Reactivate related slugs
        $product->slugs()->update(['status' => 1]);
        // 3. Restore photos (Bring back image records)
        $product->photos()->withTrashed()->get()->each->restore();
        Log::info("--- PRODUCT RESTORED ---", ['id' => $product->id]);
    }
}

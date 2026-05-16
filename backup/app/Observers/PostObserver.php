<?php

namespace App\Observers;

use App\Models\Catalog\Post;
use Illuminate\Support\Facades\Log;

class PostObserver
{
    public function created(Post $post): void
    {
        $post->load('translations');

        Log::info('--- NEW POST CREATED ---', [
            'id' => $post->id,
            'category_id' => $post->category_id,
            'type' => $post->type,
            'locale_count' => $post->translations->count(),
        ]);
    }

    public function deleting(Post $post): void
    {
        if ($post->isForceDeleting()) {
            $post->translations()->get()->each->forceDelete();
            $post->slugs()->delete();

            Log::warning('--- POST PERMANENTLY DELETED ---', ['id' => $post->id]);

            return;
        }

        $post->translations()->get()->each->delete();
        $post->slugs()->update(['status' => 0]);

        Log::info('--- POST SOFT DELETED ---', ['id' => $post->id]);
    }

    public function restored(Post $post): void
    {
        $post->translations()->withTrashed()->get()->each->restore();
        $post->slugs()->update(['status' => 1]);

        Log::info('--- POST RESTORED ---', ['id' => $post->id]);
    }
}

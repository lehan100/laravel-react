<?php

namespace App\Observers;

use App\Models\MediaBanner;
use Illuminate\Support\Facades\Log;

class MediaBannerObserver
{
    /**
     * Handle the MediaBanner "created" event.
     */
    public function created(MediaBanner $mediaBanner): void
    {
        //
        $mediaBanner->load('translations');
        Log::info("--- NEW MEDIA BANNER CREATED ---", [
            'item' => $mediaBanner->toArray()
        ]);
    }

    /**
     * Handle the MediaBanner "updated" event.
     */
    public function updated(MediaBanner $mediaBanner): void
    {
        //
    }

    /**
     * Handle the MediaBanner "deleted" event.
     */
    public function deleted(MediaBanner $mediaBanner): void
    {
        //
    }

    /**
     * Handle the MediaBanner "restored" event.
     */
    public function restored(MediaBanner $mediaBanner): void
    {
        //
    }

    /**
     * Handle the MediaBanner "force deleted" event.
     */
    public function forceDeleted(MediaBanner $mediaBanner): void
    {
        //
    }
}

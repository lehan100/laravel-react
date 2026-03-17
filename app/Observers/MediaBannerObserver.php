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
        $mediaBanner->load('translations');
        Log::info("--- NEW MEDIA BANNER CREATED ---", [
            'id' => $mediaBanner->id
        ]);
    }

    /**
     * Handle the MediaBanner "deleting" event.
     * Clean up related translations before deleting the banner.
     */
    public function deleting(MediaBanner $mediaBanner): void
    {
        if ($mediaBanner->isForceDeleting()) {
            // Permanently remove all translations from the database
            $mediaBanner->translations()->get()->each(function ($translation) {
                $translation->forceDelete();
            });
        } else {
            // Soft delete translations to allow restoration later
             $mediaBanner->translations()->get()->each(function ($translation) {
                $translation->delete();
            });
        }
    }

    /**
     * Handle the MediaBanner "restored" event.
     * Restore all associated translations.
     */
    public function restored(MediaBanner $mediaBanner): void
    {
        $mediaBanner->translations()->withTrashed()->get()->each->restore();
        Log::info("--- MEDIA BANNER RESTORED ---", ['id' => $mediaBanner->id]);
    }

    /**
     * Handle the MediaBanner "updated" event.
     */
    public function updated(MediaBanner $mediaBanner): void
    {
        Log::info("--- MEDIA BANNER UPDATED ---", ['id' => $mediaBanner->id]);
    }
}

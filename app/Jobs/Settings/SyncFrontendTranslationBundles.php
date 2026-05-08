<?php

namespace App\Jobs\Settings;

use App\Services\Settings\FrontendTranslationBundleService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SyncFrontendTranslationBundles implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public ?string $basePath = null)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(FrontendTranslationBundleService $service): void
    {
        $service->sync($this->basePath);
    }
}

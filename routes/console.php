<?php

// use App\Jobs\Settings\EnsureFrontendTranslationBundles;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Schedule::command('images:clean-temp --hours=24')
    ->hourly()
    ->withoutOverlapping(55)
    ->runInBackground();

// Schedule::job(new EnsureFrontendTranslationBundles)
//     ->everyMinute()
//     ->withoutOverlapping(5);

Schedule::command('promotion:buytogift-release-expired-stock')
    ->everyMinute()
    ->withoutOverlapping(10);

Schedule::command('ai-posts:publish')
    ->everyMinute()
    ->withoutOverlapping(10)
    ->runInBackground();

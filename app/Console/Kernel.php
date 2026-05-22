<?php

namespace App\Console;

use App\Jobs\Settings\EnsureFrontendTranslationBundles;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('inspire')->hourly();
        $schedule->command('images:clean-temp --hours=24')
            ->hourly()
            ->withoutOverlapping(55)
            ->runInBackground()
            ->timeout(300);

        $schedule->job(new EnsureFrontendTranslationBundles)
            ->everyMinute()
            ->withoutOverlapping(5);

        $schedule->command('promotion:buytogift-release-expired-stock')
            ->everyMinute()
            ->withoutOverlapping(10);

        $schedule->command('ai-posts:publish')
            ->everyMinute()
            ->withoutOverlapping(10)
            ->runInBackground()
            ->timeout(300);
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}

<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class RemoveTempImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:clean-temp
                            {--hours=24 : Delete files older than N hours}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove temporary images in public/var/temp after 24 hours';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $hours = max(1, (int) $this->option('hours'));
        $directory = public_path('var');

        if (!File::exists($directory)) {
            $this->warn("Directory does not exist: {$directory}");
            return self::SUCCESS;
        }

        $files = File::allFiles($directory);
        $deletedCount = 0;

        foreach ($files as $file) {
            if ($file->getFilename() === '.gitignore') {
                continue;
            }

            $lastModified = Carbon::createFromTimestamp($file->getMTime());

            if ($lastModified->diffInHours(now()) >= $hours) {
                if (File::delete($file->getPathname())) {
                    $deletedCount++;
                }
            }
        }

        if ($deletedCount > 0) {
            $this->info("Deleted {$deletedCount} expired file(s) from {$directory} (>{$hours}h).");
        } else {
            $this->info("No expired files found in {$directory} (>{$hours}h).");
        }

        return self::SUCCESS;
    }
}

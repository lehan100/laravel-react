<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Carbon\Carbon;

class RemoveTempImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:clean-temp';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove temporary images in public/var/temp after 24 hours';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Đổi đường dẫn ra thư mục cha (var)
        $directory = public_path('var');

        if (!File::exists($directory)) {
            $this->warn("Directory does not exist: {$directory}");
            return;
        }

        // File::allFiles sẽ quét sạch sành sanh các thư mục con bên trong
        $files = File::allFiles($directory);
        $count = 0;

        foreach ($files as $file) {
            // Bỏ qua file .gitignore nếu có
            if ($file->getFilename() === '.gitignore') {
                continue;
            }

            $lastModified = Carbon::createFromTimestamp($file->getMTime());

            if ($lastModified->diffInHours(now()) >= 24) {
                File::delete($file->getPathname());
                $count++;
            }
        }

        if ($count > 0) {
            $this->info("Successfully deleted {$count} temporary file(s) from all subdirectories.");
        } else {
            $this->info("No expired files found in any subdirectories.");
        }
    }
}

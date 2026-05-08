<?php

namespace App\Console\Commands;

use App\Services\Settings\FrontendTranslationBundleService;
use Illuminate\Console\Command;

class SyncFrontendTranslationBundles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'lang:sync-json
                            {--path= : Override the lang directory path}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate frontend JSON bundles from translated PHP locale files.';

    /**
     * Execute the console command.
     */
    public function handle(FrontendTranslationBundleService $service): int
    {
        $generatedFiles = $service->sync($this->option('path') ?: null);

        if ($generatedFiles === []) {
            $this->info('No translation bundles were generated.');

            return self::SUCCESS;
        }

        $this->info('Generated '.count($generatedFiles).' frontend translation bundle(s).');

        foreach ($generatedFiles as $generatedFile) {
            $this->line($generatedFile);
        }

        return self::SUCCESS;
    }
}

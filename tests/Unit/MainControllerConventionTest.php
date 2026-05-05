<?php

namespace Tests\Unit;

use PHPUnit\Framework\Attributes\Test;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use Tests\TestCase;

class MainControllerConventionTest extends TestCase
{
    #[Test]
    public function main_controller_children_with_a_constructor_call_the_parent_constructor(): void
    {
        foreach ($this->mainControllerFiles() as $path) {
            $contents = file_get_contents($path);

            $this->assertIsString($contents);

            if (! str_contains($contents, 'function __construct')) {
                continue;
            }

            $this->assertStringContainsString(
                'parent::__construct();',
                $contents,
                sprintf('Expected %s to call parent::__construct().', $path)
            );
        }
    }

    #[Test]
    public function main_controller_children_do_not_use_untyped_shared_state_properties(): void
    {
        $propertyPatterns = [
            '/protected\s+\$controllerView\b/',
            '/protected\s+\$controllerName\b/',
            '/protected\s+\$routeName\b/',
            '/protected\s+\$mainModel\b/',
            '/protected\s+\$categoryModel\b/',
            '/protected\s+\$mediaPosition\b/',
            '/protected\s+\$configPath\b/',
            '/private\s+\$USER_GROUP\b/',
        ];

        foreach ($this->mainControllerFiles() as $path) {
            $contents = file_get_contents($path);

            $this->assertIsString($contents);

            foreach ($propertyPatterns as $pattern) {
                $this->assertDoesNotMatchRegularExpression(
                    $pattern,
                    $contents,
                    sprintf('Expected %s to use typed property declarations.', $path)
                );
            }
        }
    }

    /**
     * @return array<int, string>
     */
    private function mainControllerFiles(): array
    {
        $paths = [];
        $directory = new RecursiveDirectoryIterator(app_path('Http/Controllers/Admin'));
        $iterator = new RecursiveIteratorIterator($directory);

        foreach ($iterator as $file) {
            if (! $file->isFile() || $file->getExtension() !== 'php') {
                continue;
            }

            $path = $file->getPathname();
            $contents = file_get_contents($path);

            if (! is_string($contents) || ! str_contains($contents, 'extends MainController')) {
                continue;
            }

            $paths[] = $path;
        }

        sort($paths);

        return $paths;
    }
}

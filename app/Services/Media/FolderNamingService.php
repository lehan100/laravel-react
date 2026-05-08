<?php

namespace App\Services\Media;

use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Str;

class FolderNamingService
{
    public function slugFolderName(string $name): string
    {
        return Str::slug(trim($name), (string) config('media.folders.slug_separator', '-'));
    }

    public function metadataFilename(): string
    {
        return (string) config('media.folders.metadata_filename', '.folder.json');
    }

    public function metadataPath(string $folderPath): string
    {
        return trim($folderPath, '/').'/'.$this->metadataFilename();
    }

    public function storeMetadata(FilesystemAdapter $disk, string $folderPath, string $displayName): void
    {
        $disk->put($this->metadataPath($folderPath), json_encode([
            'name' => $displayName,
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    }

    public function displayName(FilesystemAdapter $disk, string $folderPath): string
    {
        $metadataPath = $this->metadataPath($folderPath);

        if ($disk->exists($metadataPath)) {
            $metadata = json_decode((string) $disk->get($metadataPath), true);

            if (is_array($metadata)) {
                $name = trim((string) ($metadata['name'] ?? ''));

                if ($name !== '') {
                    return $name;
                }
            }
        }

        return Str::of(basename($folderPath))
            ->replace(['-', '_'], ' ')
            ->squish()
            ->title()
            ->toString();
    }

    public function folderCount(FilesystemAdapter $disk, string $folderPath): int
    {
        return collect($disk->files($folderPath))
            ->reject(function (string $file): bool {
                return basename($file) === $this->metadataFilename();
            })
            ->count();
    }

    /**
     * @return array<int, array{name: string, path: string}>
     */
    public function breadcrumbs(FilesystemAdapter $disk, string $path): array
    {
        $segments = array_values(array_filter(explode('/', trim($path, '/'))));
        $breadcrumbs = [];
        $currentPath = '';

        foreach ($segments as $segment) {
            $currentPath = $currentPath === '' ? $segment : $currentPath.'/'.$segment;
            $breadcrumbs[] = [
                'name' => $this->displayName($disk, $currentPath),
                'path' => $currentPath,
            ];
        }

        return $breadcrumbs;
    }
}

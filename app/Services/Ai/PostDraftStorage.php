<?php

namespace App\Services\Ai;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class PostDraftStorage
{
    public const CONNECTION = 'ai_posts';

    public const TABLE = 'ai_post_batches';

    public const LEGACY_DIRECTORY = 'ai-post-batches';

    public function store(array $payload): string
    {
        $this->ensureDatabaseReady();

        $token = Str::uuid()->toString();
        DB::connection(self::CONNECTION)->table(self::TABLE)->insert([
            'token' => $token,
            'topic' => (string) ($payload['topic'] ?? ''),
            'locale' => (string) ($payload['locale'] ?? ''),
            'category_id' => $payload['category_id'] ?? null,
            'payload' => $this->encodePayload($payload),
            'created_at' => Carbon::parse($payload['created_at'] ?? now()),
            'updated_at' => Carbon::now(),
        ]);

        return $token;
    }

    public function get(string $token): ?array
    {
        $this->ensureDatabaseReady();

        $row = DB::connection(self::CONNECTION)
            ->table(self::TABLE)
            ->where('token', $token)
            ->first();

        if (is_object($row)) {
            return $this->hydrateRow($row);
        }

        return $this->getLegacyBatch($token);
    }

    public function update(string $token, array $payload): void
    {
        $this->ensureDatabaseReady();

        $updated = DB::connection(self::CONNECTION)
            ->table(self::TABLE)
            ->where('token', $token)
            ->update([
                'topic' => (string) ($payload['topic'] ?? ''),
                'locale' => (string) ($payload['locale'] ?? ''),
                'category_id' => $payload['category_id'] ?? null,
                'payload' => $this->encodePayload($payload),
                'updated_at' => Carbon::now(),
            ]);

        if ($updated === 0) {
            $this->updateLegacyBatch($token, $payload);
        }
    }

    public function delete(string $token): void
    {
        $this->ensureDatabaseReady();

        DB::connection(self::CONNECTION)
            ->table(self::TABLE)
            ->where('token', $token)
            ->delete();

        $legacyPath = $this->legacyPath($token);

        if (File::exists($legacyPath)) {
            File::delete($legacyPath);
        }
    }

    public function all(): array
    {
        $this->ensureDatabaseReady();

        $rows = DB::connection(self::CONNECTION)
            ->table(self::TABLE)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (object $row): array => $this->hydrateRow($row));

        $legacy = collect(File::glob($this->legacyDirectory().'/*.json'))
            ->map(fn (string $file): ?array => $this->readLegacyFile($file))
            ->filter()
            ->values();

        return $rows
            ->pipe(fn ($sqliteRows) => $legacy->concat($sqliteRows))
            ->keyBy('token')
            ->values()
            ->all();
    }

    protected function ensureDatabaseReady(): void
    {
        $databasePath = (string) config('database.connections.'.self::CONNECTION.'.database');

        if ($databasePath !== '') {
            File::ensureDirectoryExists(dirname($databasePath));

            if (! File::exists($databasePath)) {
                File::put($databasePath, '');
            }
        }

        if (! Schema::connection(self::CONNECTION)->hasTable(self::TABLE)) {
            Schema::connection(self::CONNECTION)->create(self::TABLE, function (Blueprint $table): void {
                $table->id();
                $table->string('token')->unique();
                $table->string('topic');
                $table->string('locale', 20)->nullable();
                $table->unsignedBigInteger('category_id')->nullable();
                $table->longText('payload');
                $table->timestamps();
            });
        }
    }

    protected function hydrateRow(object $row): array
    {
        $payload = $this->decodePayload((string) ($row->payload ?? ''));

        return [
            ...$payload,
            'token' => (string) ($row->token ?? ''),
            'topic' => (string) ($row->topic ?? ($payload['topic'] ?? '')),
            'locale' => (string) ($row->locale ?? ($payload['locale'] ?? '')),
            'category_id' => $row->category_id ?? ($payload['category_id'] ?? null),
            'created_at' => (string) ($row->created_at ?? ($payload['created_at'] ?? '')),
            'updated_at' => (string) ($row->updated_at ?? ($payload['updated_at'] ?? '')),
        ];
    }

    protected function getLegacyBatch(string $token): ?array
    {
        $path = $this->legacyPath($token);

        if (! File::exists($path)) {
            return null;
        }

        $payload = $this->readLegacyFile($path);

        if ($payload === []) {
            return null;
        }

        return [
            ...$payload,
            'token' => $token,
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    protected function readLegacyFile(string $path): ?array
    {
        if (! File::exists($path)) {
            return null;
        }

        return $this->decodePayload((string) File::get($path));
    }

    protected function updateLegacyBatch(string $token, array $payload): void
    {
        $path = $this->legacyPath($token);

        if (! File::exists($path)) {
            return;
        }

        File::put($path, json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    protected function legacyDirectory(): string
    {
        return storage_path('app/private/'.self::LEGACY_DIRECTORY);
    }

    protected function legacyPath(string $token): string
    {
        return $this->legacyDirectory().'/'.$token.'.json';
    }

    protected function encodePayload(array $payload): string
    {
        return json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) ?: '{}';
    }

    /**
     * @return array<string, mixed>
     */
    protected function decodePayload(string $content): array
    {
        $decoded = json_decode($content, true);

        return is_array($decoded) ? $decoded : [];
    }
}

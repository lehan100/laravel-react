<?php

namespace Database\Seeders;

use App\Models\Catalog\Category;
use App\Models\Catalog\Product;
use App\Models\Settings\Language;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CatalogSampleSeeder extends Seeder
{
    /**
     * @var array<int, string>
     */
    private array $seedLocales = ['vi', 'en', 'ja'];

    public function run(): void
    {
        $this->seedLocales = $this->resolveSeedLocales();

        $csvPath = $this->resolveCsvPath();

        if ($csvPath === null || ! is_file($csvPath)) {
            $this->command?->warn('CSV not found. Expected one of:');
            foreach ($this->csvPathCandidates() as $candidate) {
                $this->command?->line("- {$candidate}");
            }

            return;
        }

        $handle = fopen($csvPath, 'r');
        if ($handle === false) {
            $this->command?->error('Cannot open CSV file.');

            return;
        }

        $header = fgetcsv($handle);
        if ($header === false) {
            fclose($handle);
            $this->command?->error('CSV header is empty.');

            return;
        }

        if (isset($header[0])) {
            $header[0] = preg_replace('/^\xEF\xBB\xBF/', '', (string) $header[0]);
        }

        $rows = [];
        while (($data = fgetcsv($handle)) !== false) {
            if (count($data) !== count($header)) {
                continue;
            }

            $row = array_combine($header, $data);
            if (! is_array($row)) {
                continue;
            }

            if (($row['record_type'] ?? null) !== 'variable_parent') {
                continue;
            }

            $rows[] = $row;
            if (count($rows) >= 50) {
                break;
            }
        }

        fclose($handle);

        if (count($rows) === 0) {
            $this->command?->warn('No valid variable_parent product rows found in CSV.');

            return;
        }

        DB::transaction(function () use ($rows): void {
            $categoryCache = [];

            foreach ($rows as $index => $row) {
                $categoryPath = trim((string) ($row['product_categories'] ?? ''));
                $leafCategoryId = $this->resolveCategoryFromPath($categoryPath, $categoryCache, $index);

                $name = trim((string) ($row['post_title'] ?? ''));
                $sku = trim((string) ($row['sku'] ?? ''));
                $sourceSlug = trim((string) ($row['post_slug'] ?? ''));
                $priceRaw = trim((string) ($row['regular_price'] ?? '0'));
                $quantityRaw = trim((string) ($row['stock_quantity'] ?? '0'));

                if ($name === '') {
                    $name = 'Sample Product '.($index + 1);
                }

                $sku = $sku !== '' ? $sku : 'SAMPLE-'.str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT);
                $price = is_numeric($priceRaw) ? (float) $priceRaw : 0.0;
                $quantity = is_numeric($quantityRaw) ? (int) $quantityRaw : 0;
                $slug = $sourceSlug !== '' ? Str::slug($sourceSlug) : Str::slug($name);

                /** @var Product $product */
                $product = Product::query()->firstOrCreate(
                    ['sku' => $sku],
                    [
                        'quantity' => $quantity,
                        'weight' => 0,
                        'price' => $price,
                        'status' => 1,
                        'is_coupon' => false,
                        'is_stock' => true,
                        'order' => $index + 1,
                        'hit_viewer' => 0,
                        'hit_order' => 0,
                    ]
                );

                foreach ($this->seedLocales as $locale) {
                    $translatedName = $this->translateLabel($name, $locale);

                    $product->translations()->updateOrCreate(
                        ['locale' => $locale],
                        [
                            'name' => $translatedName,
                            'description' => null,
                            'content' => null,
                            'seo_title' => $translatedName,
                            'seo_keyword' => $translatedName,
                            'seo_description' => $translatedName,
                        ]
                    );

                    DB::table('slugs')->updateOrInsert(
                        [
                            'locale' => $locale,
                            'sluggable_id' => $product->id,
                            'sluggable_type' => Product::class,
                        ],
                        [
                            'slug' => ($slug !== '' ? $slug : 'product').'-'.$product->id,
                            'redirect_to' => null,
                            'status' => 1,
                            'is_default' => true,
                            'updated_at' => now(),
                            'created_at' => now(),
                        ]
                    );
                }

                if ($leafCategoryId !== null) {
                    $product->categories()->syncWithoutDetaching([$leafCategoryId]);
                }
            }

            $this->backfillMissingTranslations();
        });
    }

    /**
     * @return array<int, string>
     */
    private function csvPathCandidates(): array
    {
        return array_filter([
            env('CATALOG_SAMPLE_CSV'),
            storage_path('app/seeds/bbracing-wpallimport-variable-products.csv'),
            base_path('bbracing-wpallimport-variable-products.csv'),
            '/home/lehan100/CanhCam/bbracing-run/bbracing-wpallimport-variable-products.csv',
        ]);
    }

    private function resolveCsvPath(): ?string
    {
        foreach ($this->csvPathCandidates() as $candidate) {
            if (is_string($candidate) && is_file($candidate)) {
                return $candidate;
            }
        }

        return null;
    }

    /**
     * @param  array<string, int>  $categoryCache
     */
    private function resolveCategoryFromPath(string $path, array &$categoryCache, int $order): ?int
    {
        if ($path === '') {
            return null;
        }

        $parts = array_values(array_filter(array_map(static fn ($item) => trim($item), explode('>', $path))));
        if (count($parts) === 0) {
            return null;
        }

        $parentId = null;
        $lastCategoryId = null;

        foreach ($parts as $depth => $name) {
            $cacheKey = ($parentId ?? 0).'|'.mb_strtolower($name);
            if (isset($categoryCache[$cacheKey])) {
                $parentId = $categoryCache[$cacheKey];
                $lastCategoryId = $parentId;

                continue;
            }

            /** @var Category|null $category */
            $category = Category::query()
                ->where('parent_id', $parentId)
                ->where('type', 'product')
                ->whereHas('translations', function ($query) use ($name): void {
                    $query->whereIn('locale', ['vi', 'en'])->where('name', $name);
                })
                ->first();

            if ($category === null) {
                $category = Category::query()->create([
                    'parent_id' => $parentId,
                    'type' => 'product',
                    'order' => ($depth + 1) * 10,
                    'status' => 1,
                    'photo' => null,
                ]);
            }

            foreach ($this->seedLocales as $locale) {
                $translatedName = $this->translateLabel($name, $locale);

                $category->translations()->updateOrCreate(
                    ['locale' => $locale],
                    [
                        'name' => $translatedName,
                        'description' => null,
                        'content' => null,
                        'seo_title' => $translatedName,
                        'seo_keyword' => $translatedName,
                        'seo_description' => $translatedName,
                    ]
                );

                DB::table('slugs')->updateOrInsert(
                    [
                        'locale' => $locale,
                        'sluggable_id' => $category->id,
                        'sluggable_type' => Category::class,
                    ],
                    [
                        'slug' => Str::slug($translatedName.'-'.$category->id),
                        'redirect_to' => null,
                        'status' => 1,
                        'is_default' => true,
                        'updated_at' => now(),
                        'created_at' => now(),
                    ]
                );
            }

            $categoryCache[$cacheKey] = $category->id;
            $parentId = $category->id;
            $lastCategoryId = $category->id;
        }

        return $lastCategoryId;
    }

    private function translateLabel(string $text, string $locale): string
    {
        $normalized = trim($text);
        if ($normalized === '') {
            return $normalized;
        }

        if ($locale === 'vi') {
            return $normalized;
        }

        $dictionary = [
            'Heo Thắng' => 'Brake Caliper',
            'Tay Thắng' => 'Brake Lever',
            'Tay Côn Dây' => 'Clutch Lever',
            'Bao Tay' => 'Grip',
            'Đĩa Thắng' => 'Brake Disc',
            'Nắp Xăng - Nhớt' => 'Fuel - Oil Cap',
            'Pô Full System' => 'Exhaust Full System',
            'Pô Slip On' => 'Slip-On Exhaust',
            'Phuộc Sau' => 'Rear Shock',
            'Chảng Ba' => 'Triple Clamp',
            'Cổ Pô' => 'Header Pipe',
            'Mâm Carbon' => 'Carbon Wheel',
            'Mâm Nhôm' => 'Alloy Wheel',
            'Mâm Niềng Căm' => 'Spoke Wheel',
            'Bộ Nồi Khô' => 'Dry Clutch Kit',
        ];

        $translated = strtr($normalized, $dictionary);

        if ($locale === 'en') {
            return $translated;
        }

        return 'JP '.$translated;
    }

    /**
     * @return array<int, string>
     */
    private function resolveSeedLocales(): array
    {
        $languageCodes = Language::query()
            ->where('status', 1)
            ->pluck('code')
            ->map(static fn ($code) => Str::lower((string) $code))
            ->filter(static fn ($code) => $code !== '')
            ->values()
            ->all();

        if (count($languageCodes) > 0) {
            return array_values(array_unique($languageCodes));
        }

        return ['vi', 'en', 'ja'];
    }

    private function backfillMissingTranslations(): void
    {
        Category::query()->with('translations')->chunkById(200, function ($categories): void {
            foreach ($categories as $category) {
                $fallbackName = (string) optional($category->translations->first())->name;
                if ($fallbackName === '') {
                    $fallbackName = 'Category '.$category->id;
                }

                foreach ($this->seedLocales as $locale) {
                    $name = $this->translateLabel($fallbackName, $locale);
                    $category->translations()->updateOrCreate(
                        ['locale' => $locale],
                        [
                            'name' => $name,
                            'description' => null,
                            'content' => null,
                            'seo_title' => $name,
                            'seo_keyword' => $name,
                            'seo_description' => $name,
                        ]
                    );
                }
            }
        });

        Product::query()->with('translations')->chunkById(200, function ($products): void {
            foreach ($products as $product) {
                $fallbackName = (string) optional($product->translations->first())->name;
                if ($fallbackName === '') {
                    $fallbackName = $product->sku ?: ('Product '.$product->id);
                }

                foreach ($this->seedLocales as $locale) {
                    $name = $this->translateLabel($fallbackName, $locale);
                    $product->translations()->updateOrCreate(
                        ['locale' => $locale],
                        [
                            'name' => $name,
                            'description' => null,
                            'content' => null,
                            'seo_title' => $name,
                            'seo_keyword' => $name,
                            'seo_description' => $name,
                        ]
                    );
                }
            }
        });
    }
}

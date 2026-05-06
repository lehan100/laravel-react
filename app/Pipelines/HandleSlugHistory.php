<?php

namespace App\Pipelines;

use App\Models\Slug;
use Closure;
use Illuminate\Support\Str;

class HandleSlugHistory
{
    public function handle($content, Closure $next)
    {
        $item = $content['item'];
        // $item->unsetRelation('slugs');
        $translations = $content['translations'] ?? [];

        foreach ($translations as $locale => $data) {
            if (empty($data['slug'])) {
                continue;
            }

            // 1. Process Unicode Slug (Japanese, Vietnamese, etc.)
            $slugBase = $this->sanitizeSlug($data['slug']);
            if ($slugBase === '') {
                continue;
            }

            $newSlug = $slugBase;

            // 2. CHECK GLOBAL UNIQUE (Across all types)
            $newSlug = $this->makeSlugUnique($newSlug, $locale, $item);

            // 3. Handle History and Redirect Logic
            $currentDefault = $item->slugs()
                ->where('locale', $locale)
                ->where('is_default', true)
                ->first();

            // Only proceed if slug has changed
            if (! $currentDefault || $currentDefault->slug !== $newSlug) {

                // STEP A: Deactivate current default slug
                if ($currentDefault) {
                    $currentDefault->update(['is_default' => false]);
                }

                // STEP B: Check if this slug existed in this item's history
                $historySlug = $item->slugs()
                    ->where('locale', $locale)
                    ->where('slug', $newSlug)
                    ->first();

                if ($historySlug) {
                    // Re-activate old history record
                    $historySlug->update([
                        'is_default' => true,
                        'redirect_to' => null,
                        'status' => 1,
                    ]);
                } else {
                    // Create a brand new slug record
                    $item->slugs()->create([
                        'slug' => $newSlug,
                        'locale' => $locale,
                        'is_default' => true,
                        'status' => 1,
                        'redirect_to' => null,
                    ]);
                }

                // STEP C: POINT ALL OLD SLUGS TO THE NEWEST ONE
                // This prevents multiple redirects (A -> B -> C)
                $item->slugs()
                    ->where('locale', $locale)
                    ->where('slug', '!=', $newSlug)
                    ->update(['redirect_to' => $newSlug]);
            }
        }

        return $next($content);
    }

    /**
     * Clean and format Unicode string for Slug
     */
    private function sanitizeSlug($string)
    {
        $slug = strtolower(trim((string) $string));

        if (class_exists(\Normalizer::class)) {
            $slug = \Normalizer::normalize($slug, \Normalizer::FORM_D) ?: $slug;
            $slug = preg_replace('/[\x{0300}-\x{036f}]/u', '', $slug);
        }

        $slug = str_replace(['đ', 'Đ'], ['d', 'd'], $slug);
        $slug = preg_replace('/[^\p{L}\p{N}\s-]/u', '', $slug);
        $slug = preg_replace('/(\s+)/u', '-', $slug);
        $slug = mb_strtolower($slug, 'UTF-8');

        return trim(preg_replace('/-+/', '-', $slug), '-');
    }

    /**
     * Check and make slug unique globally
     */
    private function makeSlugUnique($slug, $locale, $item)
    {
        $originalSlug = $slug;
        $i = 1;

        while (Slug::where('slug', $slug)
            ->where('locale', $locale)
            ->where(function ($query) use ($item) {
                $query->where('sluggable_id', '!=', $item->id)
                    ->orWhere('sluggable_type', '!=', get_class($item));
            })
            ->exists()
        ) {
            // Option 1: Append counter (e.g., tokyo-cake-1)
            $slug = $originalSlug.'-'.$i++;

            // Option 2 (Cleaner for SEO): Append ID if available
            // $slug = $originalSlug . '-' . ($item->id ?? Str::random(4));
        }

        return $slug;
    }
}

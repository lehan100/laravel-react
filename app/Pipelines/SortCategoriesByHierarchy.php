<?php

namespace App\Pipelines;

use Closure;
use Illuminate\Support\Collection;

/**
 * Class SortCategoriesByHierarchy
 * 
 * This pipeline step reorders a flat collection of categories into a 
 * hierarchical sequence (Parent -> Child -> Grandchild) and adds 
 * indentation prefixes for visual depth representation.
 */
class SortCategoriesByHierarchy
{
    /**
     * Handle the incoming pipeline data.
     *
     * @param  Collection  $categories
     * @param  Closure  $next
     * @return mixed
     */
    public function handle(Collection $categories, Closure $next)
    {
        $orderedResult = collect();

        // Start the recursive sorting from root nodes (parent_id is null or 0)
        $this->sortRecursive($categories, null, '', $orderedResult);

        return $next($orderedResult);
    }

    /**
     * Recursively sort categories and apply indentation prefixes.
     *
     * @param  Collection  $categories  The source collection
     * @param  int|null    $parentId    Current parent ID to look for children
     * @param  string      $indent      The string used for visual depth (e.g., "-- ")
     * @param  Collection  $result      The reference collection to push sorted items
     * @return void
     */
    private function sortRecursive($categories, $parentId, $indent, &$result)
    {
        // Filter children of the current parent and sort them by the 'order' column
        $children = $categories->filter(fn($item) => $item->parent_id == $parentId)
                               ->sortBy('order');

        foreach ($children as $child) {
            // Get category name from the first translation or fallback to a placeholder
            $originalName = $child->translations->first()->name ?? 'Unnamed';
            
            // Assign a new property for display purposes with depth indentation
            $child->name_with_depth = $indent . $originalName;
            
            // Push the processed item into the result collection
            $result->push($child);

            // Recurse into children of this item, increasing the indentation level
            $this->sortRecursive($categories, $child->id, $indent . '--- ', $result);
        }
    }
}

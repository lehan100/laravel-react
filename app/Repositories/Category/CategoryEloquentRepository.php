<?php

namespace App\Repositories\Category;

use App\Models\Catalog\Category;
use App\Models\Catalog\Product;
use App\Pipelines\HandleSlugHistory;
use App\Pipelines\SortCategoriesByHierarchy;
use App\Repositories\EloquentRepository;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pipeline\Pipeline;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CategoryEloquentRepository extends EloquentRepository implements CategoryRepositoryInterface
{
    private $FIELDSELECT = ['id', 'photo', 'page_id', 'parent_id', 'type', 'status', 'order'];

    protected $configPath;

    public function __construct()
    {
        parent::__construct();
        $this->configPath = config('image.path.category');
    }

    public function getModel()
    {
        return Category::class;
    }

    public function lists($params = null, $options = null)
    {
        $currentLocale = app()->getLocale();
        $task = $options['task'] ?? null;

        // Kiểm tra nếu là các task quản trị danh mục
        if (in_array($task, ['admin-list-items', 'admin-list-items-active'])) {
            $query = $this->_model->select($this->FIELDSELECT)->with([
                'translations' => function ($q) use ($currentLocale) {
                    // Phải có category_id để Eloquent map được quan hệ
                    $q->select(['id', 'category_id', 'locale', 'name'])
                        ->where('locale', $currentLocale);
                },
            ])->withCount('products');

            if (! empty($options['type'])) {
                if (is_array($options['type'])) {
                    $query->whereIn('type', $options['type']);
                } else {
                    $query->where('type', $options['type']);
                }
            }

            // FIELDSELECT bắt buộc phải có 'id' và 'parent_id' để Pipeline hoạt động
            $query->orderBy('order', 'asc');

            $categories = $query->get();
            $this->appendTreeProductCounts($categories);

            if ($task == 'admin-list-items-active') {
                $categories = $categories->where('status', 1)->values();

                // Xử lý phân cấp qua Pipeline
                return app(Pipeline::class)
                    ->send($categories)
                    ->through([
                        SortCategoriesByHierarchy::class,
                    ])
                    ->thenReturn();
            }

            return $categories;
        }

        return null;
    }

    public function get($params = null, $options = null)
    {
        if ($options['task'] == 'get-item') {
            return $this->_model->with(['translations', 'slugs', 'page:id,title'])->find($params['id']);
        }

        return null;
    }

    public function save($params = null, $options = null)
    {
        if (($options['task'] ?? null) === 'reorder-tree') {
            $items = $params['items'] ?? [];
            if (empty($items)) {
                return false;
            }

            DB::beginTransaction();
            try {
                foreach ($items as $item) {
                    $this->_model->where('id', $item['id'])->update([
                        'parent_id' => $item['parent_id'] ?? null,
                        'order' => (int) ($item['order'] ?? 0),
                    ]);
                }
                DB::commit();

                return true;
            } catch (\Throwable $e) {
                DB::rollBack();
                logger('Error reorder category tree: '.$e->getMessage());

                return false;
            }
        }

        if ($options['task'] == 'admin-update-multi-status') {
            return $this->_model->whereIn('id', $params['aid'])->update(['status' => $params['value']]);
        }

        if ($options['task'] == 'change-status') {
            $status = ($params['status'] == 0) ? 1 : 0;

            return $this->_model->where('id', $params['id'])->update(['status' => $status]);
        }
        DB::beginTransaction();
        try {
            $item = ($options['task'] == 'add-item')
                ? new $this->_model
                : $this->_model->find($params['id']);

            if (! $item) {
                return false;
            }
            $itemOrder = $this->resolveOrderForSave($params, $item);
            $parentId = $this->resolveParentIdForSave($params, $item);

            // 1. Save Basic Info
            $item->status = $params['status'] ?? 0;
            $item->order = $itemOrder;
            $item->type = $params['type'] ?? 'product';
            $item->photo = $params['photo'] ?? null;
            $item->page_id = array_key_exists('page_id', $params) && ! in_array($params['page_id'], [null, '', 0, '0'], true)
                ? (int) $params['page_id']
                : null;
            if ($parentId) {
                $parent = $this->_model->find($parentId);
                $item->parent_id = $parent && ($parent->type ?? 'product') === ($item->type ?? 'product') ? $parentId : null;
            } else {
                $item->parent_id = null;
            }
            $item->save();
            // 2. Save Translations (exclude slug/is_default to let Pipe handle it)
            $translationsData = $params['translations'] ?? [];
            foreach ($translationsData as $locale => $data) {
                $translation = $item->translateOrNew($locale);
                $translation->fill(Arr::except($data, ['slug', 'is_default']));
                $translation->save();
            }

            if (($item->type ?? 'product') === 'product') {
                $productIds = collect($params['product_ids'] ?? [])
                    ->map(fn ($id) => (int) $id)
                    ->filter()
                    ->unique()
                    ->values()
                    ->all();
                $item->products()->sync($productIds);
            } else {
                $item->products()->detach();
            }

            // 3. Process Slugs via Pipeline
            // This will handle Unicode, History, and Redirects
            app(Pipeline::class)
                ->send([
                    'item' => $item,
                    'translations' => $translationsData,
                ])
                ->through([
                    HandleSlugHistory::class,
                ])
                ->thenReturn();
            DB::commit();

            return $item;
        } catch (\Exception $e) {
            DB::rollBack();
            logger('Error save category: '.$e->getMessage());

            return false;
        }
    }

    public function delete($params = null, $options = null)
    {
        if ($options['task'] == 'delete-item') {
            $item = $this->_model->find($params['id']);
            if ($item) {
                return $item->delete();
            }
        }

        if ($options['task'] == 'delete-items') {
            $ids = is_array($params['ids']) ? $params['ids'] : explode(',', $params['ids']);

            return $this->_model->whereIn('id', $ids)->get()->each->delete();
        }

        return false;
    }

    protected function resolveOrderForSave(array $params, ?Category $item = null): int
    {
        if (array_key_exists('order', $params)) {
            return max(0, (int) $params['order']);
        }

        if ($item?->exists) {
            return max(0, (int) ($item->order ?? 0));
        }

        $parentId = null;
        if (array_key_exists('parent_id', $params) && ! in_array($params['parent_id'], [null, '', 0, '0'], true)) {
            $parentId = (int) $params['parent_id'];
        }

        $type = (string) ($params['type'] ?? 'product');
        $maxOrder = $this->_model->newQuery()
            ->where('type', $type)
            ->where('parent_id', $parentId)
            ->max('order');

        return ((int) $maxOrder) + 1;
    }

    protected function resolveParentIdForSave(array $params, ?Category $item = null): ?int
    {
        if (! array_key_exists('parent_id', $params)) {
            return $item?->exists ? ($item->parent_id !== null ? (int) $item->parent_id : null) : null;
        }

        $parentId = $params['parent_id'];
        if (in_array($parentId, [null, '', 0, '0'], true)) {
            return null;
        }

        return (int) $parentId;
    }

    /**
     * @param  array<int, int>  $categoryIds
     * @return array{data: array<int, array<string, mixed>>, meta: array<string, mixed>}
     */
    public function getProductPickerData(int $perPage = 10, string $search = '', array $categoryIds = []): array
    {
        $query = $this->baseProductPickerQuery();

        if ($search !== '') {
            $currentLocale = app()->getLocale();

            $query->where(function (Builder $builder) use ($search, $currentLocale) {
                $builder->where('id', 'like', '%'.$search.'%')
                    ->orWhere('sku', 'like', '%'.$search.'%')
                    ->orWhereHas('translations', function (Builder $translationQuery) use ($search, $currentLocale) {
                        $translationQuery->where('locale', $currentLocale)
                            ->where('name', 'like', '%'.$search.'%');
                    });
            });
        }

        if ($categoryIds !== []) {
            $query->whereHas('categories', function (Builder $builder) use ($categoryIds): void {
                $builder->whereIn('categories.id', $categoryIds);
            });
        }

        $paginator = $query->paginate(max(1, min(100, $perPage)));

        return [
            'data' => $this->mapProductsForPicker(collect($paginator->items())),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ];
    }

    public function getSelectedProductRows(array $ids): array
    {
        if (empty($ids)) {
            return [];
        }

        $products = $this->baseProductPickerQuery()
            ->whereIn('id', $ids)
            ->get()
            ->sortBy(function ($item) use ($ids) {
                return array_search($item->id, $ids, true);
            })
            ->values();

        return $this->mapProductsForPicker($products);
    }

    public function getActiveProductRows(): array
    {
        return $this->mapProductsForPicker($this->baseProductPickerQuery()->get());
    }

    private function baseProductPickerQuery(): Builder
    {
        $currentLocale = app()->getLocale();

        return Product::query()
            ->select(['id', 'sku', 'price', 'quantity', 'is_stock', 'status'])
            ->where('status', 1)
            ->with([
                'translations' => function ($query) use ($currentLocale) {
                    $query->select(['id', 'product_id', 'locale', 'name'])
                        ->where('locale', $currentLocale);
                },
                'categories:id',
            ])
            ->orderBy('id');
    }

    /**
     * @return array<int, int>
     */
    public function getCategoryAndDescendantIds(int $categoryId): array
    {
        $categories = $this->_model->newQuery()
            ->select(['id', 'parent_id'])
            ->where('type', 'product')
            ->get();

        $childrenByParent = [];
        foreach ($categories as $category) {
            $parentId = (int) ($category->parent_id ?? 0);
            $childrenByParent[$parentId][] = (int) $category->id;
        }

        $result = [];
        $visited = [];

        $collect = function (int $currentId) use (&$collect, &$result, &$visited, $childrenByParent): void {
            if (isset($visited[$currentId])) {
                return;
            }

            $visited[$currentId] = true;
            $result[] = $currentId;

            foreach ($childrenByParent[$currentId] ?? [] as $childId) {
                $collect((int) $childId);
            }
        };

        $collect($categoryId);

        return array_values(array_unique(array_map('intval', $result)));
    }

    private function mapProductsForPicker($products): array
    {
        return $products->map(function ($item) {
            $translations = $item->translations ?? collect();
            $name = optional($translations->first())->name ?: ($item->sku ?: ('#'.$item->id));

            return [
                'id' => (int) $item->id,
                'sku' => $item->sku,
                'price' => (float) ($item->price ?? 0),
                'quantity' => (int) ($item->is_stock ?? 0) === 1 ? (int) ($item->quantity ?? 0) : 0,
                'is_stock' => (int) ($item->is_stock ?? 0),
                'status' => (int) ($item->status ?? 0),
                'name' => $name,
                'category_ids' => ($item->categories ?? collect())->pluck('id')->map(fn ($id) => (int) $id)->values()->all(),
            ];
        })->values()->all();
    }

    /**
     * @param  Collection<int, Category>  $categories
     */
    private function appendTreeProductCounts(Collection $categories): void
    {
        $itemsById = $categories->keyBy('id');
        $childrenByParent = [];

        foreach ($categories as $category) {
            $parentId = $category->parent_id ?? 0;
            $childrenByParent[(int) $parentId][] = (int) $category->id;
        }

        $cache = [];
        $resolve = function (int $categoryId) use (&$resolve, &$cache, $itemsById, $childrenByParent): int {
            if (array_key_exists($categoryId, $cache)) {
                return $cache[$categoryId];
            }

            $category = $itemsById->get($categoryId);
            if (! $category) {
                return 0;
            }

            $total = (int) ($category->products_count ?? 0);
            foreach ($childrenByParent[$categoryId] ?? [] as $childId) {
                $total += $resolve((int) $childId);
            }

            $cache[$categoryId] = $total;
            $category->setAttribute('tree_products_count', $total);

            return $total;
        };

        foreach ($categories as $category) {
            $resolve((int) $category->id);
        }
    }
}

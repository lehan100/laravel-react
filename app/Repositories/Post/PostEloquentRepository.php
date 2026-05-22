<?php

namespace App\Repositories\Post;

use App\Models\Catalog\Post;
use App\Pipelines\HandleSlugHistory;
use App\Repositories\EloquentRepository;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pipeline\Pipeline;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class PostEloquentRepository extends EloquentRepository implements PostRepositoryInterface
{
    private array $FIELDSELECT = [
        'id',
        'category_id',
        'photo',
        'type',
        'status',
        'order',
        'hit_viewer',
        'created_at',
    ];

    public function getModel()
    {
        return Post::class;
    }

    public function lists($params = null, $options = null)
    {
        $task = $options['task'] ?? null;
        $currentLocale = app()->getLocale();

        if (! in_array($task, ['admin-list-items', 'admin-list-items-active'], true)) {
            return null;
        }

        $query = $this->_model->with([
            'translations' => function ($q) use ($currentLocale) {
                $q->select(['id', 'post_id', 'locale', 'name'])
                    ->where('locale', $currentLocale);
            },
            'category' => function ($q) use ($currentLocale) {
                $q->select(['id', 'type'])
                    ->with(['translations' => function ($sq) use ($currentLocale) {
                        $sq->select(['id', 'category_id', 'locale', 'name'])
                            ->where('locale', $currentLocale);
                    }]);
            },
        ])->select($this->FIELDSELECT)->orderBy('order', 'asc');

        if (! empty($options['type'])) {
            $query->where('type', $options['type']);
        }

        if ($task === 'admin-list-items-active') {
            $query->where('status', 1);
        }

        return $query->get();
    }

    public function get($params = null, $options = null)
    {
        if (($options['task'] ?? null) !== 'get-item') {
            return null;
        }

        return $this->_model->with([
            'translations',
            'slugs',
            'category.translations',
        ])->find($params['id'] ?? null);
    }

    public function save($params = null, $options = null)
    {
        $task = $options['task'] ?? null;
        if (! $task) {
            return false;
        }

        if ($task === 'admin-update-multi-status') {
            $ids = $params['aid'] ?? [];
            if (empty($ids)) {
                return false;
            }

            return $this->_model->whereIn('id', $ids)->get()->each(function ($item) use ($params) {
                $item->update(['status' => $params['value']]);
            });
        }

        if ($task === 'change-status') {
            $item = $this->_model->find($params['id'] ?? null);
            if (! $item) {
                return false;
            }

            $item->status = $item->status == 0 ? 1 : 0;

            return $item->save();
        }

        DB::beginTransaction();
        try {
            $item = $task === 'add-item'
                ? new $this->_model
                : $this->_model->find($params['id'] ?? null);

            if (! $item) {
                DB::rollBack();

                return false;
            }

            $item->category_id = $params['category_id'] ?? $item->category_id;
            $item->photo = $params['photo'] ?? $item->photo;
            $item->type = $params['type'] ?? $item->type ?? 'primary';
            $item->status = $params['status'] ?? 0;
            $item->publication_status = $params['publication_status'] ?? $item->publication_status ?? Post::PUBLICATION_STATUS_DRAFT;
            $item->published_at = $params['published_at'] ?? $item->published_at;
            $item->order = $params['order'] ?? 0;
            $item->hit_viewer = $params['hit_viewer'] ?? $item->hit_viewer ?? 0;
            $item->save();

            $translationsData = $params['translations'] ?? [];
            foreach ($translationsData as $locale => $data) {
                $translation = $item->translateOrNew($locale);
                $translation->fill(Arr::except($data, ['slug', 'is_default']));
                $translation->save();
            }

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
        } catch (\Throwable $e) {
            DB::rollBack();
            logger('Error save post: '.$e->getMessage());

            return false;
        }
    }

    public function createScheduledPost(array $data): Post
    {
        $translations = $data['translations'] ?? [];
        unset($data['translations']);

        $post = $this->_model->newInstance($data);
        $post->publication_status = $data['publication_status'] ?? Post::PUBLICATION_STATUS_SCHEDULED;
        $post->save();

        foreach ($translations as $locale => $translationData) {
            $translation = $post->translateOrNew($locale);
            $translation->fill($translationData);
            $translation->save();
        }

        return $post;
    }

    public function getDuePosts(int $limit = 50): Collection
    {
        return $this->_model
            ->where('publication_status', Post::PUBLICATION_STATUS_SCHEDULED)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', Carbon::now())
            ->limit($limit)
            ->get();
    }

    public function delete($params = null, $options = null)
    {
        $task = $options['task'] ?? null;
        if (! $task) {
            return false;
        }

        if ($task === 'delete-item') {
            $item = $this->_model->find($params['id'] ?? null);
            if ($item) {
                return $item->delete();
            }
        }

        if ($task === 'delete-items') {
            $ids = is_array($params['ids'] ?? null)
                ? $params['ids']
                : explode(',', (string) ($params['ids'] ?? ''));

            return $this->_model->whereIn('id', $ids)->get()->each(function ($item) {
                $item->delete();
            });
        }

        return false;
    }
}

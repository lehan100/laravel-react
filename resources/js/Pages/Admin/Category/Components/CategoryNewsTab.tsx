import { Link } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';
import { create as createPost, edit as editPost } from '@/actions/App/Http/Controllers/Admin/Catalog/PostController';

type NewsRow = {
    id: number;
    name?: string;
    order?: number;
    status?: number | boolean;
};

type Props = {
    data: any;
    itemsSelectedNews?: NewsRow[];
    trans: (key: string, replace?: Record<string, any>) => string;
};

function isActive(status: number | boolean | undefined): boolean {
    return Boolean(status);
}

export default function CategoryNewsTab({ data, itemsSelectedNews = [], trans }: Props) {
    const posts = Array.isArray(itemsSelectedNews) ? itemsSelectedNews : [];
    const canAddNews = Boolean(data.id);
    const createNewsUrl = canAddNews ? createPost.url({ category_id: data.id }) : '#';

    return (
        <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-950">{trans('hancms.catalog.category.type.options.news') || 'Tin tức'}</h3>
                        <p className="mt-1 text-xs text-slate-500">
                            {trans('hancms.catalog.category.news_hint') || 'Các bài viết thuộc danh mục này.'}
                        </p>
                    </div>
                    {canAddNews ? (
                        <Link
                            href={createNewsUrl}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
                        >
                            <Plus size={16} />
                            {trans('hancms.catalog.category.news_add') || 'Thêm tin tức'}
                        </Link>
                    ) : (
                        <button
                            type="button"
                            disabled
                            className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-emerald-300 px-4 py-2.5 text-sm font-semibold text-white"
                        >
                            <Plus size={16} />
                            {trans('hancms.catalog.category.news_add') || 'Thêm tin tức'}
                        </button>
                    )}
                </div>

                <div className="mt-4 space-y-3">
                    {posts.length > 0 ? (
                        posts.map((news: NewsRow) => (
                            <div key={news.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <div className="min-w-0">
                                    <div className="truncate text-sm font-semibold text-slate-900">{news.name || `#${news.id}`}</div>
                                    <div className="mt-1 text-xs text-slate-500">
                                        #{news.id}
                                        {typeof news.order !== 'undefined' ? ` · ${trans('hancms.column.order')}: ${news.order}` : ''}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isActive(news.status) ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'}`}>
                                        {isActive(news.status)
                                            ? (trans('hancms.status.active') || 'Active')
                                            : (trans('hancms.status.inactive') || 'Inactive')}
                                    </span>
                                    {canAddNews ? (
                                        <Link
                                            href={editPost.url(news.id)}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                                        >
                                            <Pencil size={14} />
                                            {trans('hancms.button.edit') || 'Sửa'}
                                        </Link>
                                    ) : null}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                            {trans('hancms.catalog.category.news_empty') || 'Chưa có tin tức nào được chọn.'}
                        </div>
                    )}
                </div>

            </div>

            <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
                {trans('hancms.catalog.category.news_manage_note') || 'Bài viết tin tức được quản lý ở mục Bài viết.'}
            </div>
        </div>
    );
}

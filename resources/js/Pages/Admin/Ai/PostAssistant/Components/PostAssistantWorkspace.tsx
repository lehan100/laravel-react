import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { CheckCircle2, Clock3, Eye, FileText, PencilLine, RefreshCw, Save, Sparkles, X } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import Card from '@/Components/Main/Card';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import AiButton from '@/Components/Button/AiButton';
import BackButton from '@/Components/Button/BackButton';
import SingleUpload from '@/Components/ImageUpload/SingleUpload';
import MediaLibraryModal from '@/Components/TinyMCE/MediaLibraryModal';
import { useTrans } from '@/Hooks/useTrans';
import { translate as translateLocaleFields } from '@/actions/App/Http/Controllers/Ai/LocaleTranslateController';

type DraftTranslation = {
    title: string;
    description: string;
    content: string;
    photo: string;
    photo_url?: string;
};

type DraftItem = {
    draft_id: string;
    title: string;
    description: string;
    content: string;
    photo: string;
    photo_url?: string;
    translations?: Record<string, DraftTranslation>;
    published_at: string;
};

type WorkspaceProps = {
    mode: 'create' | 'edit';
    initialDrafts?: DraftItem[];
    initialBatchToken?: string;
    showGroupDashboard?: boolean;
    backHref?: string;
};

type MessageTone = 'idle' | 'success' | 'error';

function stripHtml(value: string): string {
    return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function countWords(value: string): number {
    const matches = value.match(/[\p{L}\p{N}]+/gu);

    return matches?.length || 0;
}

function shorten(value: string, maxLength = 220): string {
    if (value.length <= maxLength) {
        return value;
    }

    return `${value.slice(0, maxLength).trimEnd()}…`;
}

function formatPreviewTime(value: string): string {
    return value.replace('T', ' ');
}

function createEmptyTranslation(): DraftTranslation {
    return {
        title: '',
        description: '',
        content: '',
        photo: '',
        photo_url: '',
    };
}

export default function PostAssistantWorkspace({
    mode,
    initialDrafts = [],
    initialBatchToken = '',
    showGroupDashboard = false,
    backHref = '',
}: WorkspaceProps) {
    const { trans } = useTrans();
    const { locale, config_path, langs, batches, batchSummary, itemsCategoryActive, batch }: any = usePage().props;
    const currentLocale = (locale as string) || 'vi';
    const imagePath = config_path?.path || 'media/post';
    const langList = useMemo(() => {
        const source = langs?.data || langs || [];

        return Array.isArray(source) ? source : Object.values(source || {});
    }, [langs]);
    const batchGroups = useMemo(() => (Array.isArray(batches) ? batches : []), [batches]);
    const categoryOptions = useMemo(() => (Array.isArray(itemsCategoryActive) ? itemsCategoryActive : []), [itemsCategoryActive]);
    const [topic, setTopic] = useState('');
    const [quantity, setQuantity] = useState(3);
    const [drafts, setDrafts] = useState<DraftItem[]>([]);
    const [batchToken, setBatchToken] = useState<string>(initialBatchToken);
    const [batchCategoryId, setBatchCategoryId] = useState<string>(() => String(batch?.category_id ?? ''));
    const [message, setMessage] = useState<string>('');
    const [messageTone, setMessageTone] = useState<MessageTone>('idle');
    const [loadingGenerate, setLoadingGenerate] = useState(false);
    const [loadingSchedule, setLoadingSchedule] = useState(false);
    const [reviewDraft, setReviewDraft] = useState<DraftItem | null>(null);
    const [reviewLocale, setReviewLocale] = useState<string>(currentLocale);
    const [reviewPhotoLoading, setReviewPhotoLoading] = useState(false);
    const [aiTranslating, setAiTranslating] = useState(false);
    const [aiTranslateError, setAiTranslateError] = useState('');
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [tinyCallback, setTinyCallback] = useState<any>(null);

    useEffect(() => {
        setDrafts(normalizeDraftItems(initialDrafts, langList, currentLocale));
        setBatchToken(initialBatchToken);
        if (batch?.category_id !== undefined && batch?.category_id !== null) {
            setBatchCategoryId(String(batch.category_id));
        }
    }, [currentLocale, initialBatchToken, initialDrafts, langList]);

    const draftStats = useMemo(() => {
        const totalWords = drafts.reduce((sum, draft) => sum + countWords(stripHtml(draft.content)), 0);

        return {
            count: drafts.length,
            totalWords,
            averageWords: drafts.length > 0 ? Math.round(totalWords / drafts.length) : 0,
            firstPublishedAt: drafts[0]?.published_at || '',
        };
    }, [drafts]);

    const batchOverview = useMemo(() => {
        const totalGroups = batchSummary?.groups ?? batchGroups.length;
        const totalDrafts = batchSummary?.drafts ?? batchGroups.reduce((sum: number, batch: any) => sum + (batch.total_items || 0), 0);
        const readyToPublic = batchSummary?.ready_to_public ?? batchGroups.reduce((sum: number, batch: any) => sum + (batch.due_items || 0), 0);
        const upcoming = batchSummary?.upcoming ?? batchGroups.reduce((sum: number, batch: any) => sum + (batch.upcoming_items || 0), 0);

        return {
            totalGroups,
            totalDrafts,
            readyToPublic,
            upcoming,
        };
    }, [batchGroups, batchSummary]);

    const currentCategoryLabel = useMemo(() => {
        if (!batchCategoryId) {
            return '';
        }

        const category = categoryOptions.find((item: any) => String(item.id) === String(batchCategoryId));

        return category?.name_with_depth
            || category?.translations?.[currentLocale]?.name
            || category?.name
            || '';
    }, [batchCategoryId, categoryOptions, currentLocale]);

    const editorLocale = reviewLocale === 'vn' ? 'vi' : reviewLocale;
    const activeReviewTranslation = getReviewTranslation();
    const messageClassName = getMessageClassName(messageTone);

    async function handleGenerate(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (mode !== 'create') {
            return;
        }

        setMessage('');
        setMessageTone('idle');
        setLoadingGenerate(true);

        try {
            const response = await axios.post(route('ai.post-assistant.generate'), {
                topic,
                quantity,
                category_id: batchCategoryId ? Number(batchCategoryId) : null,
            });

            setBatchToken(response.data.batch_token);
            setDrafts(normalizeDraftItems(Array.isArray(response.data.items) ? response.data.items : [], langList, currentLocale));
            setMessage(response.data.message || trans('hancms.ai_assistant.post_assistant.generated'));
            setMessageTone('success');
            setReviewDraft(null);
        } catch (error: any) {
            setDrafts([]);
            setBatchToken('');
            setMessage(error?.response?.data?.message || 'Có lỗi khi tạo bản nháp.');
            setMessageTone('error');
        } finally {
            setLoadingGenerate(false);
        }
    }

    function handleSchedule() {
        if (!batchToken || drafts.length === 0) {
            setMessage('Hãy tạo ít nhất một bản nháp trước khi lên lịch.');
            setMessageTone('error');

            return;
        }

        setLoadingSchedule(true);

        router.post(route('ai.post-assistant.schedule'), {
            batch_token: batchToken,
            category_id: batchCategoryId ? Number(batchCategoryId) : null,
            items: drafts.map((draft) => ({
                draft_id: draft.draft_id,
                title: draft.title,
                description: draft.description,
                content: draft.content,
                photo: draft.photo,
                photo_url: draft.photo_url,
                translations: draft.translations,
                published_at: draft.published_at,
            })),
        }, {
            preserveScroll: true,
            preserveState: true,
            onError: (errors) => {
                const firstError = Object.values(errors || {})[0];

                setMessage(Array.isArray(firstError) ? firstError[0] : String(firstError || 'Có lỗi khi lên lịch.'));
                setMessageTone('error');
            },
            onSuccess: () => {
                setMessage('');
                setMessageTone('idle');
            },
            onFinish: () => {
                setLoadingSchedule(false);
            },
        });
    }

    function updatePublishedAt(draftId: string, value: string) {
        setDrafts((current) =>
            current.map((item) =>
                item.draft_id === draftId ? { ...item, published_at: value } : item
            )
        );
    }

    function normalizeDraftTranslations(draft: DraftItem): Record<string, DraftTranslation> {
        const baseTranslation = {
            title: draft.title || '',
            description: draft.description || '',
            content: draft.content || '',
            photo: draft.photo || '',
            photo_url: draft.photo_url || '',
        };
        const normalized: Record<string, DraftTranslation> = {};

        langList.forEach((language: any) => {
            const localeCode = String(language.code || '').trim();

            if (!localeCode) {
                return;
            }

            normalized[localeCode] = {
                ...createEmptyTranslation(),
                ...(draft.translations?.[localeCode] || {}),
            };
        });

        if (!normalized[currentLocale]) {
            normalized[currentLocale] = { ...createEmptyTranslation(), ...baseTranslation };
        }

        if (Object.keys(normalized).length === 0) {
            normalized[currentLocale] = { ...createEmptyTranslation(), ...baseTranslation };
        }

        return normalized;
    }

    function normalizeDraftItems(items: DraftItem[], languages: any[], localeCode: string): DraftItem[] {
        return items.map((item) => {
            const normalizedDraft = {
                ...item,
                translations: item.translations || {},
            };
            const normalizedTranslations = normalizeTranslationsForDraft(normalizedDraft, languages, localeCode);
            const currentTranslation = normalizedTranslations[localeCode] || createEmptyTranslation();

            return {
                ...normalizedDraft,
                translations: normalizedTranslations,
                title: normalizedDraft.title || currentTranslation.title || '',
                description: normalizedDraft.description || currentTranslation.description || '',
                content: normalizedDraft.content || currentTranslation.content || '',
                photo: normalizedDraft.photo || currentTranslation.photo || '',
                photo_url: normalizedDraft.photo_url || currentTranslation.photo_url || '',
            };
        });
    }

    function normalizeTranslationsForDraft(draft: DraftItem, languages: any[], localeCode: string): Record<string, DraftTranslation> {
        const normalized: Record<string, DraftTranslation> = {};
        const baseTranslation = {
            title: draft.title || '',
            description: draft.description || '',
            content: draft.content || '',
            photo: draft.photo || '',
            photo_url: draft.photo_url || '',
        };

        languages.forEach((language: any) => {
            const code = String(language.code || '').trim();

            if (!code) {
                return;
            }

            normalized[code] = {
                ...createEmptyTranslation(),
                ...(draft.translations?.[code] || {}),
            };
        });

        if (!normalized[localeCode]) {
            normalized[localeCode] = { ...createEmptyTranslation(), ...baseTranslation };
        }

        return normalized;
    }

    function getReviewTranslation(): DraftTranslation {
        if (!reviewDraft) {
            return createEmptyTranslation();
        }

        return reviewDraft.translations?.[reviewLocale]
            || reviewDraft.translations?.[currentLocale]
            || createEmptyTranslation();
    }

    function openReviewDraft(draft: DraftItem) {
        const normalizedTranslations = normalizeDraftTranslations(draft);
        const currentTranslation = normalizedTranslations[currentLocale] || createEmptyTranslation();

        setReviewLocale(currentLocale);
        setReviewDraft({
            ...draft,
            photo: draft.photo || currentTranslation.photo || '',
            photo_url: draft.photo_url || currentTranslation.photo_url || '',
            translations: normalizedTranslations,
        });
    }

    function updateReviewDraftField(field: keyof DraftTranslation, value: string) {
        setReviewDraft((current) => {
            if (!current) {
                return current;
            }

            const nextTranslations = {
                ...(current.translations || {}),
                [reviewLocale]: {
                    ...(current.translations?.[reviewLocale] || createEmptyTranslation()),
                    [field]: value,
                },
            };

            return {
                ...current,
                translations: nextTranslations,
                title: currentLocale === reviewLocale ? (nextTranslations[currentLocale]?.title || current.title) : current.title,
                description: currentLocale === reviewLocale ? (nextTranslations[currentLocale]?.description || current.description) : current.description,
                content: currentLocale === reviewLocale ? (nextTranslations[currentLocale]?.content || current.content) : current.content,
            };
        });
    }

    function saveReviewDraft() {
        if (!reviewDraft) {
            return;
        }

        setDrafts((current) =>
            current.map((draft) =>
                draft.draft_id === reviewDraft.draft_id
                    ? {
                        ...reviewDraft,
                        translations: Object.fromEntries(
                            Object.entries(reviewDraft.translations || {}).map(([localeCode, translation]) => [
                                localeCode,
                                {
                                    ...translation,
                                    photo: reviewDraft.photo,
                                    photo_url: reviewDraft.photo_url,
                                },
                            ])
                        ),
                        title: reviewDraft.translations?.[currentLocale]?.title || reviewDraft.title,
                        description: reviewDraft.translations?.[currentLocale]?.description || reviewDraft.description,
                        content: reviewDraft.translations?.[currentLocale]?.content || reviewDraft.content,
                        photo: reviewDraft.photo,
                        photo_url: reviewDraft.photo_url,
                    }
                    : draft
            )
        );
        setReviewDraft(null);
    }

    function handleReviewPhotoUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file || !reviewDraft) {
            return;
        }

        const formData = new FormData();
        formData.append('photo', file);
        setReviewPhotoLoading(true);

            axios.post(route('photo.upload'), formData)
            .then((response) => {
                setReviewDraft((current) => current ? {
                    ...current,
                    photo: response.data.file_name || '',
                    photo_url: response.data.url || '',
                    translations: {
                        ...(current.translations || {}),
                        ...Object.fromEntries(
                            Object.entries(current.translations || {}).map(([localeCode, translation]) => [
                                localeCode,
                                {
                                    ...(translation || createEmptyTranslation()),
                                    photo: response.data.file_name || '',
                                    photo_url: response.data.url || '',
                                },
                            ])
                        ),
                    },
                } : current);
            })
            .catch(() => {
                setMessage('Không thể tải ảnh đại diện.');
                setMessageTone('error');
            })
            .finally(() => {
                setReviewPhotoLoading(false);
            });
    }

    function handleSelectImage(url: string) {
        if (tinyCallback) {
            tinyCallback(url);
            setTinyCallback(null);
        }

        setIsMediaModalOpen(false);
    }

    async function handleAiTranslate() {
        if (!reviewDraft) {
            return;
        }

        const sourceTranslation = reviewDraft.translations?.[reviewLocale] || getReviewTranslation();
        const targetLocales = langList
            .map((language: any) => String(language.code || '').trim())
            .filter((code: string) => code !== '' && code !== reviewLocale);

        setAiTranslateError('');

        if (targetLocales.length === 0) {
            setAiTranslateError(trans('hancms.ai_assistant.post_assistant.no_target_locales') || 'Không có ngôn ngữ đích để dịch.');
            return;
        }

        const hasSourceContent = ['title', 'description', 'content']
            .some((field) => String(sourceTranslation[field as keyof DraftTranslation] || '').trim() !== '');

        if (!hasSourceContent) {
            setAiTranslateError(trans('hancms.ai_assistant.post_assistant.missing_input') || 'Hãy nhập nội dung ở ngôn ngữ hiện tại trước khi dịch.');
            return;
        }

        setAiTranslating(true);

        try {
            const response = await axios.request({
                ...translateLocaleFields(),
                data: {
                    module: 'post',
                    source_locale: reviewLocale,
                    target_locales: targetLocales,
                    fields: {
                        title: sourceTranslation.title || '',
                        description: sourceTranslation.description || '',
                        content: sourceTranslation.content || '',
                    },
                },
            });

            const translations = response?.data?.translations || {};

            if (!Object.keys(translations).length) {
                setAiTranslateError(trans('hancms.ai_assistant.post_assistant.empty_response') || 'AI chưa trả về bản dịch.');
                return;
            }

            setReviewDraft((current) => {
                if (!current) {
                    return current;
                }

                const nextTranslations: Record<string, DraftTranslation> = {
                    ...(current.translations || {}),
                };

                Object.entries(translations).forEach(([localeCode, translatedFields]) => {
                    nextTranslations[localeCode] = {
                        ...(nextTranslations[localeCode] || createEmptyTranslation()),
                        title: String((translatedFields as Record<string, unknown>).title || ''),
                        description: String((translatedFields as Record<string, unknown>).description || ''),
                        content: String((translatedFields as Record<string, unknown>).content || ''),
                        photo: nextTranslations[localeCode]?.photo || '',
                        photo_url: nextTranslations[localeCode]?.photo_url || '',
                    };
                });

                const currentTranslation = nextTranslations[currentLocale] || createEmptyTranslation();

                return {
                    ...current,
                    translations: nextTranslations,
                    title: currentLocale === reviewLocale ? currentTranslation.title : current.title,
                    description: currentLocale === reviewLocale ? currentTranslation.description : current.description,
                    content: currentLocale === reviewLocale ? currentTranslation.content : current.content,
                    photo: currentLocale === reviewLocale ? currentTranslation.photo : current.photo,
                    photo_url: currentLocale === reviewLocale ? (currentTranslation.photo_url || '') : current.photo_url,
                };
            });
        } catch (error: any) {
            setAiTranslateError(
                error?.response?.data?.message || trans('hancms.ai_assistant.post_assistant.failed_translate') || 'Không thể dịch tự động lúc này.'
            );
        } finally {
            setAiTranslating(false);
        }
    }

    function getMessageClassName(tone: MessageTone): string {
        if (tone === 'success') {
            return 'border-emerald-200 bg-emerald-50 text-emerald-900';
        }

        if (tone === 'error') {
            return 'border-rose-200 bg-rose-50 text-rose-900';
        }

        return 'border-cyan-200/80 bg-cyan-50 text-slate-800';
    }

    const title = mode === 'create'
        ? trans('hancms.ai_assistant.post_assistant.created')
        : trans('hancms.ai_assistant.post_assistant.edit');
    const headerActions = (mode === 'create' || mode === 'edit') ? (
        <>
            {backHref ? (
                <BackButton
                    href={backHref}
                    className="px-5 py-3 text-base bg-gradient-to-r from-slate-800 to-slate-950 hover:from-slate-700 hover:to-slate-900"
                >
                    {trans('hancms.button.back')}
                </BackButton>
            ) : null}
            <button
                type="button"
                disabled={!batchToken || drafts.length === 0 || loadingSchedule}
                onClick={handleSchedule}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 text-base font-semibold text-white shadow-xl shadow-emerald-950/15 ring-1 ring-emerald-950/5 transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-400 hover:to-emerald-500 hover:shadow-2xl hover:shadow-emerald-950/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loadingSchedule ? (
                    <>
                        <RefreshCw size={14} className="animate-spin" />
                        {trans('hancms.loading')}
                    </>
                ) : (
                    <>
                        <Save size={16} />
                        {trans('hancms.button.save')}
                    </>
                )}
            </button>
        </>
    ) : null;

    return (
        <div className="space-y-6">
            <HeaderToolbar title={title}>
                {headerActions}
            </HeaderToolbar>

            {mode === 'create' && (
                <Card title={trans('hancms.ai_assistant.post_assistant.draft_builder')}>
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] p-6">
                        <div className="space-y-5">
                            <div className="space-y-3">
                                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                                    {trans('hancms.ai_assistant.post_assistant.create_intro_title')}
                                </h2>
                                <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                                    {trans('hancms.ai_assistant.post_assistant.create_intro_description')}
                                </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{trans('hancms.ai_assistant.post_assistant.input_label')}</div>
                                    <div className="mt-3 text-sm font-semibold text-slate-900">{trans('hancms.ai_assistant.post_assistant.input_summary')}</div>
                                    <p className="mt-2 text-sm text-slate-500">{trans('hancms.ai_assistant.post_assistant.input_summary_hint')}</p>
                                </div>
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{trans('hancms.ai_assistant.post_assistant.output_label')}</div>
                                    <div className="mt-3 text-sm font-semibold text-slate-900">{trans('hancms.ai_assistant.post_assistant.output_summary')}</div>
                                    <p className="mt-2 text-sm text-slate-500">{trans('hancms.ai_assistant.post_assistant.output_summary_hint')}</p>
                                </div>
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{trans('hancms.ai_assistant.post_assistant.locale_label')}</div>
                                    <div className="mt-3 text-sm font-semibold text-slate-900">{String(currentLocale).toUpperCase()}</div>
                                    <p className="mt-2 text-sm text-slate-500">{trans('hancms.ai_assistant.post_assistant.locale_hint')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-cyan-600 shadow-sm">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">{trans('hancms.ai_assistant.post_assistant.prompt_checklist_title')}</div>
                                    <p className="mt-2 text-sm text-slate-600">{trans('hancms.ai_assistant.post_assistant.prompt_checklist_description')}</p>
                                </div>
                            </div>

                            <ul className="mt-5 space-y-3 text-sm text-slate-600">
                                <li className="flex gap-3">
                                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                                    {trans('hancms.ai_assistant.post_assistant.prompt_item_unique_angle')}
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                                    {trans('hancms.ai_assistant.post_assistant.prompt_item_structure')}
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                                    {trans('hancms.ai_assistant.post_assistant.prompt_item_html')}
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            )}

            {mode === 'create' && (
                <Card title={trans('hancms.ai_assistant.post_assistant.create_settings')}>
                    <div className="p-6">
                        <form onSubmit={handleGenerate} className="space-y-6">
                            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(220px,0.8fr)]">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        {trans('hancms.catalog.category.name') || 'Danh mục'}
                                    </label>
                                    <select
                                        value={batchCategoryId}
                                        onChange={(event) => setBatchCategoryId(event.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                                    >
                                        <option value="">{trans('hancms.catalog.category.name') || 'Chọn danh mục'}</option>
                                        {categoryOptions.map((category: any) => {
                                            const categoryLabel = category?.name_with_depth
                                                || category?.translations?.[currentLocale]?.name
                                                || category?.name
                                                || `#${category?.id}`;

                                            return (
                                                <option key={category.id} value={String(category.id)}>
                                                    {categoryLabel}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        {trans('hancms.ai_assistant.post_assistant.topic')}
                                    </label>
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(event) => setTopic(event.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                                        placeholder={trans('hancms.ai_assistant.post_assistant.topic_placeholder')}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        {trans('hancms.ai_assistant.post_assistant.quantity')}
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={10}
                                        value={quantity}
                                        onChange={(event) => setQuantity(Number(event.target.value))}
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 rounded-3xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="space-y-1">
                                    <div className="text-sm font-semibold text-slate-900">{trans('hancms.ai_assistant.post_assistant.suggestion')}</div>
                                    <p className="text-sm text-slate-600">
                                        {trans('hancms.ai_assistant.post_assistant.suggestion_hint')}
                                    </p>
                                </div>
                                <AiButton
                                    type="submit"
                                    loading={loadingGenerate}
                                    disabled={loadingGenerate || topic.trim() === ''}
                                    className="min-w-[180px] px-5 py-3 text-sm"
                                >
                                    {loadingGenerate ? trans('hancms.loading') : trans('hancms.ai_assistant.post_assistant.generate')}
                                </AiButton>
                            </div>
                        </form>

                        {message && (
                            <div className={`mt-6 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${messageClassName}`}>
                                {messageTone === 'success' ? (
                                    <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                                ) : messageTone === 'error' ? (
                                    <RefreshCw size={16} className="mt-0.5 shrink-0" />
                                ) : null}
                                <span>{message}</span>
                            </div>
                        )}
                    </div>
                </Card>
            )}

            {mode === 'edit' && (
                <Card>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{trans('hancms.ai_assistant.post_assistant.batch_label')}</div>
                            <div className="mt-2 text-sm font-semibold text-slate-900">{batchToken || '---'}</div>
                            <p className="mt-1 text-sm text-slate-500">{trans('hancms.ai_assistant.post_assistant.batch_code_hint')}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{trans('hancms.ai_assistant.post_assistant.drafts')}</div>
                            <div className="mt-2 text-2xl font-semibold text-slate-900">{draftStats.count}</div>
                            <p className="mt-1 text-sm text-slate-500">{trans('hancms.ai_assistant.post_assistant.drafts_hint')}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{trans('hancms.ai_assistant.post_assistant.ready_label')}</div>
                            <div className="mt-2 text-2xl font-semibold text-emerald-700">{batchOverview.readyToPublic}</div>
                            <p className="mt-1 text-sm text-slate-500">{trans('hancms.ai_assistant.post_assistant.ready_hint')}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{trans('hancms.ai_assistant.post_assistant.upcoming_label')}</div>
                            <div className="mt-2 text-2xl font-semibold text-cyan-700">{batchOverview.upcoming}</div>
                            <p className="mt-1 text-sm text-slate-500">{trans('hancms.ai_assistant.post_assistant.upcoming_hint')}</p>
                        </div>
                    </div>

                    {message && (
                        <div className={`mx-6 mt-6 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${messageClassName}`}>
                            {messageTone === 'success' ? (
                                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                            ) : messageTone === 'error' ? (
                                <RefreshCw size={16} className="mt-0.5 shrink-0" />
                            ) : null}
                            <span>{message}</span>
                        </div>
                    )}
                </Card>
            )}

            <Card
                title={mode === 'create' ? trans('hancms.ai_assistant.post_assistant.drafts') : trans('hancms.ai_assistant.post_assistant.group_drafts')}
            >
                <div className="p-6">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{trans('hancms.ai_assistant.post_assistant.drafts')}</div>
                            <div className="mt-2 text-2xl font-semibold text-slate-900">{draftStats.count}</div>
                            <p className="mt-1 text-sm text-slate-500">{trans('hancms.ai_assistant.post_assistant.drafts_created_hint')}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{trans('hancms.ai_assistant.post_assistant.average_label') || 'Average'}</div>
                            <div className="mt-2 text-2xl font-semibold text-slate-900">{draftStats.averageWords}</div>
                            <p className="mt-1 text-sm text-slate-500">{trans('hancms.ai_assistant.post_assistant.average_hint')}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{trans('hancms.ai_assistant.post_assistant.total_words_label') || 'Total words'}</div>
                            <div className="mt-2 text-2xl font-semibold text-slate-900">{draftStats.totalWords}</div>
                            <p className="mt-1 text-sm text-slate-500">{trans('hancms.ai_assistant.post_assistant.total_words_hint')}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{trans('hancms.ai_assistant.post_assistant.schedule')}</div>
                            <div className="mt-2 text-sm font-semibold text-slate-900">
                                {draftStats.firstPublishedAt ? formatPreviewTime(draftStats.firstPublishedAt) : '---'}
                            </div>
                            <p className="mt-1 text-sm text-slate-500">{trans('hancms.ai_assistant.post_assistant.first_publish_hint')}</p>
                        </div>
                    </div>

                    {drafts.length > 0 ? (
                        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200 text-sm">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-slate-700">#</th>
                                            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-slate-700">
                                                {trans('hancms.column.title')}
                                            </th>
                                            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-slate-700">
                                                {trans('hancms.ai_assistant.post_assistant.published_at')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {drafts.map((draft, index) => (
                                            <tr key={draft.draft_id} className="align-top transition hover:bg-slate-50/60">
                                                <td className="px-4 py-4 text-slate-700">{index + 1}</td>
                                                <td className="px-4 py-4 text-slate-900">
                                                    <div className="flex items-start gap-3">
                                                        <div className="h-16 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                                                            {draft.photo_url ? (
                                                                <img src={draft.photo_url} alt={draft.title} className="h-full w-full object-cover" />
                                                            ) : (
                                                                <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                                                    N/A
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-semibold leading-6">{draft.title}</div>
                                                            <div className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                                                                {shorten(draft.description || stripHtml(draft.content), 160)}
                                                            </div>
                                                            {(() => {
                                                                const missingLangs = langList.filter((lang: any) => {
                                                                    const code = String(lang.code || '').trim();
                                                                    if (!code) return false;
                                                                    const trans = draft.translations?.[code];
                                                                    return (!trans?.title || trans.title.trim() === '') && (!trans?.content || stripHtml(trans.content).trim() === '');
                                                                });

                                                                if (missingLangs.length === 0) return null;

                                                                return (
                                                                    <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-2.5 py-1 w-fit">
                                                                        <Sparkles size={12} className="shrink-0" />
                                                                        Chưa đủ nội dung: {missingLangs.map((l: any) => l.name || l.code).join(', ')}
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-slate-700">
                                                    <div className="space-y-3">
                                                        <input
                                                            type="datetime-local"
                                                            value={draft.published_at}
                                                            onChange={(event) => updatePublishedAt(draft.draft_id, event.target.value)}
                                                            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => openReviewDraft(draft)}
                                                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
                                                        >
                                                            <Eye size={14} />
                                                            {trans('hancms.ai_assistant.post_assistant.customize')}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                                <FileText size={18} />
                            </div>
                                <div className="mt-4 text-base font-semibold text-slate-900">{trans('hancms.ai_assistant.post_assistant.empty_drafts_title')}</div>
                            <p className="mt-2 text-sm text-slate-500">
                                {mode === 'create'
                                    ? trans('hancms.ai_assistant.post_assistant.empty_drafts_create_hint')
                                    : trans('hancms.ai_assistant.post_assistant.empty_drafts_edit_hint')}
                            </p>
                        </div>
                    )}
                </div>
            </Card>

            {showGroupDashboard && (
                <Card title={trans('hancms.ai_assistant.post_assistant.saved_groups')}>
                    <div className="p-6 space-y-6">
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{trans('hancms.ai_assistant.post_assistant.groups')}</div>
                            <div className="mt-2 text-2xl font-semibold text-slate-900">{batchOverview.totalGroups}</div>
                            <p className="mt-1 text-sm text-slate-500">{trans('hancms.ai_assistant.post_assistant.groups_hint')}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{trans('hancms.ai_assistant.post_assistant.drafts')}</div>
                            <div className="mt-2 text-2xl font-semibold text-slate-900">{batchOverview.totalDrafts}</div>
                            <p className="mt-1 text-sm text-slate-500">{trans('hancms.ai_assistant.post_assistant.total_drafts_hint')}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{trans('hancms.ai_assistant.post_assistant.ready_label') || 'Ready'}</div>
                            <div className="mt-2 text-2xl font-semibold text-emerald-700">{batchOverview.readyToPublic}</div>
                            <p className="mt-1 text-sm text-slate-500">{trans('hancms.ai_assistant.post_assistant.ready_hint')}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{trans('hancms.ai_assistant.post_assistant.upcoming_label') || 'Upcoming'}</div>
                            <div className="mt-2 text-2xl font-semibold text-cyan-700">{batchOverview.upcoming}</div>
                            <p className="mt-1 text-sm text-slate-500">{trans('hancms.ai_assistant.post_assistant.upcoming_hint')}</p>
                            </div>
                        </div>

                        {batchGroups.length > 0 ? (
                            <div className="grid gap-4">
                                {batchGroups.map((batch: any) => {
                                    const progress = Number(batch.progress || 0);
                                    const total = Number(batch.total_items || 0);
                                    const ready = Number(batch.due_items || 0);
                                    const upcoming = Number(batch.upcoming_items || 0);

                                    return (
                                        <div key={batch.token} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                                                            {trans('hancms.ai_assistant.post_assistant.group_badge')}
                                                        </span>
                                                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                                            {batch.locale || currentLocale}
                                                        </span>
                                                    </div>
                                                    <h3 className="mt-3 text-lg font-semibold text-slate-900">
                                                        {batch.topic || 'Untitled topic'}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        Token: <span className="font-mono text-slate-700">{batch.token}</span>
                                                    </p>
                                                </div>

                                                <div className="grid min-w-[280px] gap-2 sm:grid-cols-3">
                                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                                        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Total</div>
                                                        <div className="mt-1 text-lg font-semibold text-slate-900">{total}</div>
                                                    </div>
                                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                                        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{trans('hancms.ai_assistant.post_assistant.ready_label')}</div>
                                                        <div className="mt-1 text-lg font-semibold text-emerald-700">{ready}</div>
                                                    </div>
                                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                                        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{trans('hancms.ai_assistant.post_assistant.upcoming_label')}</div>
                                                        <div className="mt-1 text-lg font-semibold text-cyan-700">{upcoming}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-5">
                                                <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                                    <span>{trans('hancms.ai_assistant.post_assistant.public_progress')}</span>
                                                    <span>{progress}%</span>
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                                                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                                                        <thead className="bg-slate-50">
                                                            <tr>
                                                                <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-slate-700">#</th>
                                                                <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-slate-700">{trans('hancms.column.title')}</th>
                                                                <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-slate-700">Public lúc</th>
                                                                <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-slate-700">Trạng thái</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-200 bg-white">
                                                            {(batch.items || []).map((item: any, index: number) => {
                                                                const isDue = item.published_at ? new Date(item.published_at).getTime() <= Date.now() : false;

                                                                return (
                                                                    <tr key={item.draft_id} className="align-top">
                                                                        <td className="px-4 py-3 text-slate-700">{index + 1}</td>
                                                                        <td className="px-4 py-3 text-slate-900">
                                                                            <div className="font-semibold">{item.title || 'Untitled'}</div>
                                                                            <div className="mt-1 line-clamp-2 text-sm text-slate-500">
                                                                                {shorten(item.description || stripHtml(item.content || ''), 150)}
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-4 py-3 text-slate-700">
                                                                            {formatPreviewTime(item.published_at || '')}
                                                                        </td>
                                                                        <td className="px-4 py-3">
                                                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isDue ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                                                                {isDue
                                                                                    ? trans('hancms.ai_assistant.post_assistant.due_now')
                                                                                    : trans('hancms.ai_assistant.post_assistant.waiting_due')}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                                    <FileText size={18} />
                                </div>
                                <div className="mt-4 text-base font-semibold text-slate-900">{trans('hancms.ai_assistant.post_assistant.empty_groups_title')}</div>
                                <p className="mt-2 text-sm text-slate-500">
                                    {trans('hancms.ai_assistant.post_assistant.empty_groups_hint')}
                                </p>
                            </div>
                        )}
                    </div>
                </Card>
            )}

            {reviewDraft && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setReviewDraft(null)} />
                    <div className="relative z-10 flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4">
                            <div>
                                <div className="text-[11px] uppercase tracking-[0.28em] text-slate-400">{trans('hancms.ai_assistant.post_assistant.review_title')}</div>
                                <h3 className="mt-1 text-xl font-semibold text-slate-900">{trans('hancms.ai_assistant.post_assistant.review_heading')}</h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    {trans('hancms.ai_assistant.post_assistant.review_hint')}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setReviewDraft(null)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-rose-200 hover:text-rose-600"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="grid flex-1 gap-0 overflow-hidden lg:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.28fr)]">
                            <div className="space-y-4 overflow-y-auto border-b border-slate-200 bg-slate-50/80 p-6 lg:border-b-0 lg:border-r">
                                <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{trans('hancms.ai_assistant.post_assistant.metadata')}</div>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                {trans('hancms.catalog.category.name') || 'Danh mục'}
                                            </label>
                                            <select
                                                value={batchCategoryId}
                                                onChange={(event) => setBatchCategoryId(event.target.value)}
                                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                                            >
                                                <option value="">{trans('hancms.catalog.category.name') || 'Chọn danh mục'}</option>
                                                {categoryOptions.map((category: any) => {
                                                    const categoryLabel = category?.name_with_depth
                                                        || category?.translations?.[currentLocale]?.name
                                                        || category?.name
                                                        || `#${category?.id}`;

                                                    return (
                                                        <option key={category.id} value={String(category.id)}>
                                                            {categoryLabel}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                {trans('hancms.ai_assistant.post_assistant.featured_image')}
                                            </label>
                                            <SingleUpload
                                                id={`review-photo-${reviewDraft.draft_id}`}
                                                previewUrl={reviewDraft.photo_url || (reviewDraft.photo ? `/${imagePath}/${reviewDraft.photo}` : '')}
                                                loading={reviewPhotoLoading}
                                                handleFileChange={handleReviewPhotoUpload}
                                                width="w-40"
                                                height="h-28"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                {trans('hancms.ai_assistant.post_assistant.published_at')}
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={reviewDraft.published_at}
                                                onChange={(event) =>
                                                    setReviewDraft((current) =>
                                                        current ? { ...current, published_at: event.target.value } : current
                                                    )
                                                }
                                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="space-y-4 overflow-y-auto p-6">
                                <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex flex-wrap gap-2">
                                            {langList.map((language: any) => {
                                                const code = String(language.code || '').trim();
                                                if (!code) {
                                                    return null;
                                                }

                                                const active = reviewLocale === code;

                                                return (
                                                    <button
                                                        key={code}
                                                        type="button"
                                                        onClick={() => setReviewLocale(code)}
                                                        className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${active
                                                            ? 'border-cyan-500 bg-cyan-50 text-cyan-800'
                                                            : 'border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:text-cyan-700'
                                                        }`}
                                                    >
                                                        <span className="h-2 w-2 rounded-full bg-current opacity-60" />
                                                        {language.name || code.toUpperCase()}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <AiButton
                                            type="button"
                                            onClick={handleAiTranslate}
                                            loading={aiTranslating}
                                            disabled={aiTranslating || langList.length < 2}
                                            className="px-4 py-2 text-xs"
                                        >
                                            {aiTranslating
                                                ? (trans('hancms.ai_assistant.post_assistant.translating') || 'Đang dịch...')
                                                : (trans('hancms.ai_assistant.post_assistant.translate_button') || 'AI dịch tự động')}
                                        </AiButton>
                                    </div>

                                    {aiTranslateError && (
                                        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                            {aiTranslateError}
                                        </div>
                                    )}

                                    <div className="mt-4">
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            {trans('hancms.column.title')}
                                            <span className="ml-2 text-xs font-normal text-slate-400">({reviewLocale})</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={activeReviewTranslation.title}
                                            onChange={(event) => updateReviewDraftField('title', event.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            {trans('hancms.ai_assistant.post_assistant.short_description')}
                                            <span className="ml-2 text-xs font-normal text-slate-400">({reviewLocale})</span>
                                        </label>
                                        <textarea
                                            rows={4}
                                            value={activeReviewTranslation.description}
                                            onChange={(event) => updateReviewDraftField('description', event.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                                        />
                                    </div>
                                </div>

                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div>
                                            <div className="text-sm font-semibold text-slate-900">{trans('hancms.ai_assistant.post_assistant.content_title')}</div>
                                            <p className="text-sm text-slate-500">{trans('hancms.ai_assistant.post_assistant.content_hint')}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsMediaModalOpen(true)}
                                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
                                    >
                                        <PencilLine size={14} />
                                        {trans('hancms.ai_assistant.post_assistant.insert_image')}
                                    </button>
                                </div>

                                <Editor
                                    tinymceScriptSrc="/js/tinymce/tinymce.min.js"
                                    licenseKey="gpl"
                                    value={activeReviewTranslation.content}
                                    init={{
                                        height: 520,
                                        menubar: false,
                                        branding: false,
                                        promotion: false,
                                        document_base_url: '/',
                                        convert_urls: true,
                                        remove_script_host: true,
                                        relative_urls: false,
                                        language: editorLocale,
                                        language_url: `/js/tinymce/langs/${editorLocale}.js`,
                                        plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'code', 'table', 'wordcount'],
                                        toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist | link image code',
                                        file_picker_callback: (callback, value, meta) => {
                                            if (meta.filetype === 'image') {
                                                setTinyCallback(() => callback);
                                                setIsMediaModalOpen(true);
                                            }
                                        },
                                    }}
                                    onEditorChange={(content) => updateReviewDraftField('content', content)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-4">
                                    <div className="text-sm text-slate-500">
                                {trans('hancms.ai_assistant.post_assistant.save_hint')}
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setReviewDraft(null)}
                                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
                                >
                                    {trans('hancms.button.close')}
                                </button>
                                <button
                                    type="button"
                                    onClick={saveReviewDraft}
                                    className="inline-flex items-center justify-center rounded-2xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-950/10 transition hover:bg-cyan-500"
                                >
                                    {trans('hancms.button.save')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <MediaLibraryModal
                isOpen={isMediaModalOpen}
                onClose={() => setIsMediaModalOpen(false)}
                onSelect={handleSelectImage}
            />
        </div>
    );
}

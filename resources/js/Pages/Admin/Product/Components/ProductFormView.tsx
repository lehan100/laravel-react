import { useEffect, useMemo, useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { AlertTriangle, CheckCircle2, Globe, Lock, LockOpen, Plus, RefreshCw, Save, Search, Sparkles, Trash2, X } from 'lucide-react';
import { quickSave } from '@/actions/App/Http/Controllers/Admin/Catalog/AttributeController';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import SaveButton from '@/Components/Button/SaveButton';
import BackButton from '@/Components/Button/BackButton';
import { InputGroup } from '@/Components/Form/HancmsInput';
import MessageError from '@/Components/Form/MessageError';
import Card from '@/Components/Main/Card';
import StatusSwitch from '@/Components/Status/StatusSwitch';
import MultiUpload from '@/Components/ImageUpload/MultiUpload';
import MediaLibraryModal from '@/Components/TinyMCE/MediaLibraryModal';
import CategoryMultiSelect from './CategoryMultiSelect';
import { formatPriceInput, getProductCurrencyFromLocale } from '../productUtils';
import { translate as translateLocaleFields } from '@/actions/App/Http/Controllers/Ai/LocaleTranslateController';

interface Props {
    title: string;
    backHref: string;
    submitLabel: string;
    item?: any;
    data: any;
    setData: any;
    errors: any;
    trans: (key: string) => string;
    langList: any[];
    langCode?: string;
    itemsCategoryActive: any[];
    attributes: any[];
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    processing: boolean;
    undo: number;
    handleUndo: (status: number) => void;
}

type QuickAttributeTranslation = {
    locale: string;
    name: string;
};

type QuickAttributeValueTranslation = {
    locale: string;
    value: string;
};

type QuickAttributeValueForm = {
    translations: QuickAttributeValueTranslation[];
    image: string;
    image_url: string;
    color: string;
};

type QuickAttributeFormState = {
    code: string;
    type: 'text' | 'image' | 'color';
    translations: QuickAttributeTranslation[];
    values: QuickAttributeValueForm[];
};

type SeoAnalysisItem = {
    label: string;
    status: string;
    message: string;
};

type SeoKeywordDensity = {
    keyword: string;
    count: number;
    density: number;
    status: string;
};

type SeoAnalysisResult = {
    score: number;
    summary: string;
    keyword_density: SeoKeywordDensity[];
    checks: SeoAnalysisItem[];
    recommendations: string[];
};

type QuickAttributeValueDraft = {
    id?: number | null;
    translations: QuickAttributeValueTranslation[];
    image: string;
    image_url: string;
    color: string;
};

const ProductFormView = ({
    title,
    backHref,
    submitLabel,
    item,
    data,
    setData,
    errors,
    trans,
    langList = [],
    langCode,
    itemsCategoryActive = [],
    attributes = [],
    onSubmit,
    processing,
    undo,
    handleUndo,
}: Props) => {
    const { props }: any = usePage();
    const siteName = props.app_name || 'HanCMS Store';
    const [activeTab, setActiveTab] = useState('general');
    const [currentTab, setCurrentTab] = useState(langCode || 'vi');
    const priceCurrency = getProductCurrencyFromLocale(langCode || 'vi');
    const priceSymbol = ({
        VND: 'đ',
        USD: '$',
        JPY: '￥',
        KRW: '₩',
        CNY: '¥',
        THB: '฿',
        EUR: '€',
    }[priceCurrency.code] || priceCurrency.code);
    const [existingPhotos, setExistingPhotos] = useState<any[]>(
        [...(item?.photos || [])].sort((a: any, b: any) => {
            const orderDiff = (a.order ?? 0) - (b.order ?? 0);
            return orderDiff !== 0 ? orderDiff : (a.id ?? 0) - (b.id ?? 0);
        })
    );
    const [slugLocked, setSlugLocked] = useState<Record<string, boolean>>(
        langList.reduce((acc: Record<string, boolean>, lang: any) => {
            acc[lang.code] = true;
            return acc;
        }, {})
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tinyCallback, setTinyCallback] = useState<any>(null);
    const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(null);
    const [variantDraft, setVariantDraft] = useState<any>(null);
    const [variantImageUploading, setVariantImageUploading] = useState(false);
    const [priceInput, setPriceInput] = useState(() => formatPriceInput(data.price, priceCurrency));
    const [attributeList, setAttributeList] = useState<any[]>(attributes || []);
    const selectedValueIdsByAttribute = useMemo(() => {
        const selected: Record<string, number[]> = {};
        const attributeValueIds = Array.isArray(data.attribute_value_ids) ? data.attribute_value_ids : [];

        attributeValueIds.forEach((valueId: any) => {
            const vid = Number(valueId);
            const attribute = attributeList.find((attr: any) =>
                (attr.values || []).some((value: any) => Number(value.id) === vid)
            );

            if (!attribute) return;

            const key = String(attribute.id);
            if (!selected[key]) selected[key] = [];
            if (!selected[key].includes(vid)) {
                selected[key].push(vid);
            }
        });

        return selected;
    }, [attributeList, data.attribute_value_ids]);

    const [isQuickAttributeModalOpen, setIsQuickAttributeModalOpen] = useState(false);
    const [isQuickAttributeSubmitting, setIsQuickAttributeSubmitting] = useState(false);
    const [isQuickAttributeImageUploading, setIsQuickAttributeImageUploading] = useState(false);
    const [quickAttributeErrors, setQuickAttributeErrors] = useState<Record<string, string>>({});
    const [quickAttributeAiTranslating, setQuickAttributeAiTranslating] = useState(false);
    const [quickAttributeAiTranslateError, setQuickAttributeAiTranslateError] = useState('');
    const [quickValueAiTranslating, setQuickValueAiTranslating] = useState(false);
    const [quickValueAiTranslateError, setQuickValueAiTranslateError] = useState('');
    const [isQuickValueModalOpen, setIsQuickValueModalOpen] = useState(false);
    const [isQuickValueSubmitting, setIsQuickValueSubmitting] = useState(false);
    const [isQuickValueImageUploading, setIsQuickValueImageUploading] = useState(false);
    const [quickValueErrors, setQuickValueErrors] = useState<Record<string, string>>({});
    const [quickValueAttributeId, setQuickValueAttributeId] = useState<number | null>(null);
    const [quickValueDraft, setQuickValueDraft] = useState<QuickAttributeValueDraft | null>(null);
    const [quickAttributeDraft, setQuickAttributeDraft] = useState<QuickAttributeFormState>(() => ({
        code: '',
        type: 'text',
        translations: langList.slice(0, 3).map((lang: any) => ({
            locale: lang.code,
            name: '',
        })),
        values: [
            {
                translations: langList.slice(0, 3).map((lang: any) => ({
                    locale: lang.code,
                    value: '',
                })),
                image: '',
                image_url: '',
                color: '#000000',
            },
        ],
    }));
    const [aiSuggestingLocale, setAiSuggestingLocale] = useState<string | null>(null);
    const [aiSuggestionError, setAiSuggestionError] = useState('');
    const [aiSeoSuggestingLocale, setAiSeoSuggestingLocale] = useState<string | null>(null);
    const [aiSeoSuggestionError, setAiSeoSuggestionError] = useState('');
    const [aiSeoAnalyzingLocale, setAiSeoAnalyzingLocale] = useState<string | null>(null);
    const [aiSeoAnalysisError, setAiSeoAnalysisError] = useState('');
    const [seoAnalysisByLocale, setSeoAnalysisByLocale] = useState<Record<string, SeoAnalysisResult>>({});
    const [aiTranslating, setAiTranslating] = useState(false);
    const [aiTranslateError, setAiTranslateError] = useState('');
    const [variantAiTranslating, setVariantAiTranslating] = useState(false);
    const [variantAiTranslateError, setVariantAiTranslateError] = useState('');
    useEffect(() => {
        setAttributeList(attributes || []);
    }, [attributes]);

    const currentVariantLanguage = langList.find((item: any) => item.code === currentTab) || langList[0] || null;
    const currentVariantLocale = currentVariantLanguage?.code || currentTab || langCode || 'vi';
    const hasVariants = Array.isArray(item?.variants) && item.variants.length > 0;
    const variantLocales = langList.slice(0, 3);
    const quickAttributeLocales = langList.slice(0, 3);
    const quickValueAttribute = quickValueAttributeId !== null
        ? attributeList.find((item: any) => Number(item.id) === Number(quickValueAttributeId))
        : null;
    const getTranslatedValue = (translations: any, locale: string, fallbackFields: string[]) => {
        if (!translations) {
            return '';
        }

        const localeCandidates = getLocaleCandidates(locale);

        if (Array.isArray(translations)) {
            const matched = translations.find((item) => localeCandidates.includes(String(item?.locale)));

            if (matched) {
                for (const field of fallbackFields) {
                    if (matched?.[field]) {
                        return matched[field];
                    }
                }
            }

            for (const item of translations) {
                for (const field of fallbackFields) {
                    if (item?.[field]) {
                        return item[field];
                    }
                }
            }

            return '';
        }

        if (typeof translations === 'object') {
            const matched = localeCandidates.reduce((result: any, candidate) => result || translations[candidate], null);

            if (matched) {
                for (const field of fallbackFields) {
                    if (matched?.[field]) {
                        return matched[field];
                    }
                }
            }

            for (const item of Object.values(translations)) {
                for (const field of fallbackFields) {
                    if ((item as any)?.[field]) {
                        return (item as any)[field];
                    }
                }
            }
        }

        return '';
    };
    const getLanguageLogoUrl = (lang: any) => {
        const languagePath = props.languageConfigPath?.path;
        if (!languagePath || !lang?.photo) return '';

        return `/${String(languagePath).replace(/^\/+|\/+$/g, '')}/${String(lang.photo).replace(/^\/+/, '')}`;
    };
    const getQuickAttributeSourceTranslation = (
        translations: any,
        field: 'name' | 'value'
    ): { locale: string; value: string } | null => {
        const normalizedTranslations = normalizeTranslationList(translations);

        for (let index = 0; index < quickAttributeLocales.length; index += 1) {
            const locale = String(quickAttributeLocales[index]?.code || '');
            const matched = normalizedTranslations.find((translation: any) =>
                String(translation.locale) === locale || String(translation.locale) === String(index)
            );
            const value = String(matched?.[field] || '').trim();

            if (value !== '') {
                return {
                    locale,
                    value,
                };
            }
        }

        for (const translation of normalizedTranslations) {
            const value = String(translation?.[field] || '').trim();

            if (value !== '') {
                return {
                    locale: String(translation.locale || ''),
                    value,
                };
            }
        }

        return null;
    };
    const getVariantSourceTranslation = (): { locale: string; value: string } | null => {
        if (!variantDraft?.translations) {
            return null;
        }

        for (const lang of variantLocales) {
            const locale = String(lang?.code || '');
            const value = String(variantDraft.translations?.[locale]?.name || '').trim();

            if (value !== '') {
                return {
                    locale,
                    value,
                };
            }
        }

        for (const [locale, translation] of Object.entries(variantDraft.translations || {})) {
            const value = String((translation as any)?.name || '').trim();
            if (value !== '') {
                return {
                    locale: String(locale),
                    value,
                };
            }
        }

        return null;
    };
    const selectedCategoryIds = Array.isArray(data.category_ids) ? data.category_ids : [];
    const selectedFiles = Array.isArray(data.photos) ? data.photos : [];
    const defaultPhotoId = data.default_photo_id ?? item?.default_photo_id ?? existingPhotos.find((photo: any) => photo.is_default)?.id ?? null;
    const hasProductImage = existingPhotos.length > 0
        || selectedFiles.length > 0
        || (defaultPhotoId !== null && defaultPhotoId !== undefined && String(defaultPhotoId).trim() !== '');
    const productWarnings = [
        Number(data.quantity ?? 0) === 0 ? trans('hancms.catalog.product.warnings.quantity_zero') : '',
        Number(data.price ?? 0) === 0 ? trans('hancms.catalog.product.warnings.price_zero') : '',
        Number(data.is_stock ?? 0) === 0 ? trans('hancms.catalog.product.warnings.stock_zero') : '',
        !hasProductImage ? trans('hancms.catalog.product.warnings.no_images') : '',
    ].filter((message) => message !== '');

    useEffect(() => {
        setData('photo_orders', existingPhotos.map((photo: any) => photo.id));
    }, [existingPhotos]);

    useEffect(() => {
        setPriceInput(formatPriceInput(data.price, priceCurrency));
    }, [priceCurrency.code]);

    const getVariantKey = (attributeValueIds: any[]) => attributeValueIds
        .map((id) => Number(id))
        .sort((a, b) => a - b)
        .join('-');

    const getLocaleCandidates = (locale: string) => {
        const normalizedLocale = String(locale);
        const candidates = new Set<string>([normalizedLocale]);
        const matchedIndex = langList.findIndex((lang: any) => String(lang.code) === normalizedLocale);

        if (matchedIndex >= 0) {
            candidates.add(String(matchedIndex));
        }

        return Array.from(candidates);
    };

    const normalizeTranslationList = (translations: any) => {
        if (!translations) {
            return [];
        }

        const items = Array.isArray(translations)
            ? translations
            : typeof translations === 'object'
                ? Object.values(translations)
                : [];

        return items.map((item: any, index: number) => ({
            ...item,
            locale: String(item?.locale ?? langList[index]?.code ?? ''),
        }));
    };

    const getLocalizedAttributeName = (attribute: any) => {
        return getTranslatedValue(attribute?.translations, currentVariantLocale, ['name']) || attribute?.name || '-';
    };

    const getLocalizedAttributeValue = (value: any) => {
        return getTranslatedValue(value?.translations, currentVariantLocale, ['value', 'name']) || value?.value || '-';
    };

    const buildEmptyVariantTranslations = () => variantLocales.reduce((translations: Record<string, { name: string }>, lang: any) => {
        translations[lang.code] = { name: '' };

        return translations;
    }, {});

    const normalizeVariantTranslations = (translations: any = {}) => variantLocales.reduce((result: Record<string, { name: string }>, lang: any) => {
        result[lang.code] = {
            name: translations?.[lang.code]?.name || '',
        };

        return result;
    }, {});

    const toggleAttributeValue = (attributeId: number, valueId: number) => {
        const currentIds = Array.isArray(data.attribute_value_ids) ? data.attribute_value_ids : [];
        const nextIds = currentIds.includes(valueId)
            ? currentIds.filter((id: any) => Number(id) !== Number(valueId))
            : [...currentIds, valueId];

        setData("attribute_value_ids", nextIds);
    };

    const openQuickAttributeModal = () => {
        setQuickAttributeErrors({});
        setQuickAttributeAiTranslateError('');
        setQuickAttributeAiTranslating(false);
        setQuickAttributeDraft({
            code: '',
            type: 'text',
            translations: quickAttributeLocales.map((lang: any) => ({
                locale: lang.code,
                name: '',
            })),
            values: [
                {
                    translations: quickAttributeLocales.map((lang: any) => ({
                        locale: lang.code,
                        value: '',
                    })),
                    image: '',
                    image_url: '',
                    color: '#000000',
                },
            ],
        });
        setIsQuickAttributeModalOpen(true);
    };

    const closeQuickAttributeModal = () => {
        setIsQuickAttributeModalOpen(false);
        setIsQuickAttributeSubmitting(false);
        setIsQuickAttributeImageUploading(false);
        setQuickAttributeErrors({});
        setQuickAttributeAiTranslating(false);
        setQuickAttributeAiTranslateError('');
    };

    const buildQuickValueDraft = (): QuickAttributeValueDraft => ({
        translations: quickAttributeLocales.map((lang: any) => ({
            locale: lang.code,
            value: '',
        })),
        image: '',
        image_url: '',
        color: '#000000',
    });

    const openQuickValueModal = (attribute: any) => {
        setQuickValueErrors({});
        setQuickValueAttributeId(Number(attribute?.id) || null);
        setQuickValueDraft(buildQuickValueDraft());
        setIsQuickValueModalOpen(true);
    };

    const closeQuickValueModal = () => {
        setIsQuickValueModalOpen(false);
        setIsQuickValueSubmitting(false);
        setIsQuickValueImageUploading(false);
        setQuickValueErrors({});
        setQuickValueAttributeId(null);
        setQuickValueDraft(null);
    };

    const updateQuickValueTranslation = (index: number, value: string) => {
        setQuickValueDraft((current) => {
            if (!current) {
                return current;
            }

            const translations = current.translations.slice();
            translations[index] = {
                ...translations[index],
                value,
            };

            return {
                ...current,
                translations,
            };
        });
    };

    const updateQuickValueColor = (color: string) => {
        setQuickValueDraft((current) => {
            if (!current) {
                return current;
            }

            return {
                ...current,
                color,
            };
        });
    };

    const updateQuickAttributeTranslation = (index: number, value: string) => {
        setQuickAttributeDraft((current) => {
            const translations = current.translations.slice();
            translations[index] = {
                ...translations[index],
                name: value,
            };

            return {
                ...current,
                translations,
            };
        });
    };

    const handleQuickAttributeAiTranslate = async () => {
        setQuickAttributeAiTranslateError('');

        const nameSource = getQuickAttributeSourceTranslation(quickAttributeDraft.translations, 'name');
        const valueSources = quickAttributeDraft.values
            .map((value, valueIndex) => ({
                valueIndex,
                source: getQuickAttributeSourceTranslation(value.translations, 'value'),
            }))
            .filter((entry): entry is { valueIndex: number; source: { locale: string; value: string } } => Boolean(entry.source));

        if (!nameSource && valueSources.length === 0) {
            setQuickAttributeAiTranslateError(
                trans('hancms.catalog.attribute.ai.missing_input') || 'Please enter a name in one language first.'
            );
            return;
        }

        setQuickAttributeAiTranslating(true);

        try {
            if (nameSource) {
                const targetLocales = quickAttributeLocales
                    .map((lang: any) => lang.code)
                    .filter((locale: string) => locale !== nameSource.locale);

                if (targetLocales.length) {
                    const response = await axios.request({
                        ...translateLocaleFields(),
                        data: {
                            module: 'attribute',
                            source_locale: nameSource.locale,
                            target_locales: targetLocales,
                            fields: {
                                name: nameSource.value,
                            },
                        },
                    });

                    const translations = response?.data?.translations || {};

                    if (Object.keys(translations).length) {
                        setQuickAttributeDraft((current) => ({
                            ...current,
                            translations: current.translations.map((translation) => {
                                if (translation.locale === nameSource.locale) {
                                    return translation;
                                }

                                const translated = translations[translation.locale] || translations[String(translation.locale).toLowerCase()];

                                return {
                                    ...translation,
                                    name: translated?.name || translation.name || '',
                                };
                            }),
                        }));
                    }
                }
            }

            for (const entry of valueSources) {
                const targetLocales = quickAttributeLocales
                    .map((lang: any) => lang.code)
                    .filter((locale: string) => locale !== entry.source.locale);

                if (!targetLocales.length) {
                    continue;
                }

                const response = await axios.request({
                    ...translateLocaleFields(),
                    data: {
                        module: 'attribute',
                        source_locale: entry.source.locale,
                        target_locales: targetLocales,
                        fields: {
                            value: entry.source.value,
                        },
                    },
                });

                const translations = response?.data?.translations || {};

                if (!Object.keys(translations).length) {
                    continue;
                }

                setQuickAttributeDraft((current) => {
                    const values = current.values.slice();
                    const currentValue = values[entry.valueIndex];
                    if (!currentValue) {
                        return current;
                    }

                    values[entry.valueIndex] = {
                        ...currentValue,
                        translations: currentValue.translations.map((translation) => {
                            if (translation.locale === entry.source.locale) {
                                return translation;
                            }

                            const translated = translations[translation.locale] || translations[String(translation.locale).toLowerCase()];

                            return {
                                ...translation,
                                value: translated?.value || translation.value || '',
                            };
                        }),
                    };

                    return {
                        ...current,
                        values,
                    };
                });
            }
        } catch (error: any) {
            setQuickAttributeAiTranslateError(
                error?.response?.data?.message
                || trans('hancms.catalog.attribute.ai.failed')
                || 'Unable to translate attribute names and values right now.'
            );
        } finally {
            setQuickAttributeAiTranslating(false);
        }
    };

    const handleQuickValueAiTranslate = async () => {
        setQuickValueAiTranslateError('');

        if (!quickValueDraft) return;

        const source = getQuickAttributeSourceTranslation(quickValueDraft.translations, 'value');

        if (!source) {
            setQuickValueAiTranslateError(
                trans('hancms.catalog.attribute.ai.missing_input') || 'Please enter a value in one language first.'
            );
            return;
        }

        setQuickValueAiTranslating(true);

        try {
            const targetLocales = quickAttributeLocales
                .map((lang: any) => lang.code)
                .filter((locale: string) => locale !== source.locale);

            if (targetLocales.length) {
                const response = await axios.request({
                    ...translateLocaleFields(),
                    data: {
                        module: 'attribute',
                        source_locale: source.locale,
                        target_locales: targetLocales,
                        fields: {
                            value: source.value,
                        },
                    },
                });

                const translations = response?.data?.translations || {};

                if (Object.keys(translations).length) {
                    setQuickValueDraft((current) => {
                        if (!current) return current;

                        return {
                            ...current,
                            translations: current.translations.map((translation) => {
                                if (translation.locale === source.locale) {
                                    return translation;
                                }

                                const translated = translations[translation.locale] || translations[String(translation.locale).toLowerCase()];

                                return {
                                    ...translation,
                                    value: translated?.value || translation.value || '',
                                };
                            }),
                        };
                    });
                }
            }
        } catch (error: any) {
            setQuickValueAiTranslateError(
                error?.response?.data?.message
                || trans('hancms.catalog.attribute.ai.failed')
                || 'Unable to translate attribute values right now.'
            );
        } finally {
            setQuickValueAiTranslating(false);
        }
    };

    const updateQuickAttributeValueTranslation = (index: number, valueIndex: number, value: string) => {
        setQuickAttributeDraft((current) => {
            const values = current.values.slice();
            const translations = values[valueIndex].translations.slice();
            translations[index] = {
                ...translations[index],
                value,
            };
            values[valueIndex] = {
                ...values[valueIndex],
                translations,
            };

            return {
                ...current,
                values,
            };
        });
    };

    const appendQuickAttributeValue = () => {
        setQuickAttributeDraft((current) => ({
            ...current,
            values: [
                ...current.values,
                {
                    translations: quickAttributeLocales.map((lang: any) => ({
                        locale: lang.code,
                        value: '',
                    })),
                    image: '',
                    image_url: '',
                    color: '#000000',
                },
            ],
        }));
    };

    const removeQuickAttributeValue = (valueIndex: number) => {
        setQuickAttributeDraft((current) => {
            const values = current.values.filter((_, index) => index !== valueIndex);

            return {
                ...current,
                values: values.length > 0 ? values : [
                    {
                        translations: quickAttributeLocales.map((lang: any) => ({
                            locale: lang.code,
                            value: '',
                        })),
                        image: '',
                        image_url: '',
                        color: '#000000',
                    },
                ],
            };
        });
    };

    const uploadQuickAttributeImage = async (file: File): Promise<{ file_name: string; url: string }> => {
        const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
        const formData = new FormData();
        formData.append('photo', file);

        const response = await fetch(route('attribute.upload'), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Unable to upload attribute image');
        }

        return response.json();
    };

    const updateQuickAttributeValueImage = async (valueIndex: number, file: File | null) => {
        if (!file) {
            return;
        }

        setIsQuickAttributeImageUploading(true);

        try {
            const response = await uploadQuickAttributeImage(file);
            setQuickAttributeDraft((current) => {
                const values = current.values.slice();
                values[valueIndex] = {
                    ...values[valueIndex],
                    image: response.file_name,
                    image_url: response.url,
                };

                return {
                    ...current,
                    values,
                };
            });
        } finally {
            setIsQuickAttributeImageUploading(false);
        }
    };

    const uploadQuickValueImage = async (file: File): Promise<{ file_name: string; url: string }> => {
        const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
        const formData = new FormData();
        formData.append('photo', file);

        const response = await fetch(route('attribute.upload'), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Unable to upload attribute image');
        }

        return response.json();
    };

    const updateQuickValueImage = async (file: File | null) => {
        if (!file) {
            return;
        }

        setIsQuickValueImageUploading(true);

        try {
            const response = await uploadQuickValueImage(file);
            setQuickValueDraft((current) => {
                if (!current) {
                    return current;
                }

                return {
                    ...current,
                    image: response.file_name,
                    image_url: response.url,
                };
            });
        } finally {
            setIsQuickValueImageUploading(false);
        }
    };

    const submitQuickAttribute = () => {
        setIsQuickAttributeSubmitting(true);
        setQuickAttributeErrors({});

        const payload = {
            ...quickAttributeDraft,
            values: quickAttributeDraft.values.map((value, index) => ({
                ...value,
                order: index,
            })),
            status: 1,
            order: 0,
        };

        axios.post(quickSave().url, payload, {
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
        }).then((response) => {
            if (response?.data?.attribute) {
                const createdAttribute = response.data.attribute;
                setAttributeList((current) => [...current, createdAttribute]);
            }

            closeQuickAttributeModal();
        }).catch((error) => {
            setQuickAttributeErrors(error?.response?.data?.errors || {});
        }).finally(() => {
            setIsQuickAttributeSubmitting(false);
        });
    };

    const submitQuickValue = () => {
        if (!quickValueDraft || quickValueAttributeId === null) {
            return;
        }

        const attribute = attributeList.find((item: any) => Number(item.id) === Number(quickValueAttributeId));
        if (!attribute) {
            return;
        }

        setIsQuickValueSubmitting(true);
        setQuickValueErrors({});

        const existingValues = Array.isArray(attribute.values) ? attribute.values : [];
        const newValueIndex = existingValues.length;
        const payload = {
            id: attribute.id,
            code: attribute.code || '',
            type: attribute.type || 'text',
            status: Number(attribute.status ?? 1),
            order: Number(attribute.order ?? 0),
            translations: normalizeTranslationList(attribute.translations).map((translation: any) => ({
                locale: translation.locale,
                name: translation.name || '',
            })),
            values: [
                ...existingValues.map((value: any) => ({
                    id: value.id,
                    translations: normalizeTranslationList(value.translations).map((translation: any) => ({
                        locale: translation.locale,
                        value: translation.value || translation.name || '',
                    })),
                    image: value.image || '',
                    color: value.color || '',
                })),
                {
                    translations: quickValueDraft.translations.map((translation) => ({
                        locale: translation.locale,
                        value: translation.value,
                    })),
                    image: quickValueDraft.image || '',
                    color: quickValueDraft.color || '',
                    order: existingValues.length,
                },
            ],
        };

        axios.post(quickSave().url, payload, {
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
        }).then((response) => {
            if (response?.data?.attribute) {
                const updatedAttribute = response.data.attribute;
                setAttributeList((current) => current.map((item: any) =>
                    Number(item.id) === Number(updatedAttribute.id) ? updatedAttribute : item
                ));
            }

            closeQuickValueModal();
        }).catch((error) => {
            const errors = error?.response?.data?.errors || {};
            const mappedErrors: Record<string, string> = {};

            Object.entries(errors).forEach(([key, message]) => {
                const prefix = `values.${newValueIndex}.`;

                if (!key.startsWith(prefix)) {
                    return;
                }

                const normalizedKey = key.slice(prefix.length);

                if (normalizedKey.startsWith('translations.')) {
                    const translationMatch = normalizedKey.match(/^translations\.(\d+)\.value$/);

                    if (translationMatch) {
                        mappedErrors[`translations.${translationMatch[1]}.value`] = message as string;
                    }

                    return;
                }

                if (normalizedKey === 'image' || normalizedKey === 'color') {
                    mappedErrors[normalizedKey] = message as string;
                }
            });

            if (Object.keys(mappedErrors).length === 0 && error?.response?.data?.message) {
                mappedErrors.form = error.response.data.message;
            }

            setQuickValueErrors(mappedErrors);
        }).finally(() => {
            setIsQuickValueSubmitting(false);
        });
    };

    const updateVariantDraftTranslation = (locale: string, value: string) => {
        setVariantDraft((prev: any) => ({
            ...(prev || {}),
            translations: {
                ...(prev?.translations || {}),
                [locale]: {
                    ...(prev?.translations?.[locale] || {}),
                    name: value,
                },
            },
        }));
    };

    const updateVariant = (index: number, field: string, value: any) => {
        const variants = Array.isArray(data.variants) ? [...data.variants] : [];
        variants[index] = {
            ...(variants[index] || {}),
            [field]: value,
        };
        setData('variants', variants);
    };

    const openVariantModal = (index: number) => {
        const variants = Array.isArray(data.variants) ? data.variants : [];
        setEditingVariantIndex(index);
        setVariantDraft({
            ...(variants[index] || {}),
            translations: normalizeVariantTranslations(variants[index]?.translations || {}),
        });
    };

    const closeVariantModal = () => {
        setEditingVariantIndex(null);
        setVariantDraft(null);
        setVariantImageUploading(false);
    };

    const saveVariantDraft = () => {
        if (editingVariantIndex === null || !variantDraft) return;

        const variants = Array.isArray(data.variants) ? [...data.variants] : [];
        variants[editingVariantIndex] = {
            ...(variants[editingVariantIndex] || {}),
            ...variantDraft,
        };
        setData('variants', variants);
        closeVariantModal();
    };

    const handleVariantAiTranslate = async () => {
        setVariantAiTranslateError('');

        const source = getVariantSourceTranslation();
        if (!source) {
            setVariantAiTranslateError(
                trans('hancms.catalog.product.ai.missing_input') || 'Please enter a name in one language first.'
            );
            return;
        }

        const targetLocales = variantLocales
            .map((lang: any) => String(lang.code))
            .filter((locale: string) => locale !== source.locale);

        if (!targetLocales.length) {
            setVariantAiTranslateError(
                trans('hancms.catalog.product.ai.no_target_languages') || 'No target languages available.'
            );
            return;
        }

        setVariantAiTranslating(true);

        try {
            const response = await axios.request({
                ...translateLocaleFields(),
                data: {
                    module: 'attribute',
                    source_locale: source.locale,
                    target_locales: targetLocales,
                    fields: {
                        name: source.value,
                    },
                },
            });

            const translations = response?.data?.translations || {};
            if (!Object.keys(translations).length) {
                setVariantAiTranslateError(
                    trans('hancms.catalog.product.ai.empty_response') || 'AI did not return translations.'
                );
                return;
            }

            setVariantDraft((current: any) => {
                if (!current) {
                    return current;
                }

                const nextTranslations = { ...(current.translations || {}) };
                Object.entries(translations).forEach(([locale, translatedFields]) => {
                    if (String(locale) === source.locale) {
                        return;
                    }

                    nextTranslations[locale] = {
                        ...(nextTranslations[locale] || {}),
                        name: String((translatedFields as any)?.name || nextTranslations[locale]?.name || ''),
                    };
                });

                return {
                    ...current,
                    translations: nextTranslations,
                };
            });
        } catch (error: any) {
            setVariantAiTranslateError(
                error?.response?.data?.message
                || trans('hancms.catalog.product.ai.failed')
                || 'Unable to translate variant names right now.'
            );
        } finally {
            setVariantAiTranslating(false);
        }
    };

    const getVariantImagePreviewUrl = (variant: any, image?: string, imageIndex = 0) => {
        const targetImage = image || variant?.image || variant?.images?.[0];
        if (!targetImage) return '';
        if (Array.isArray(variant?.image_urls) && variant.image_urls[imageIndex]) return variant.image_urls[imageIndex];
        if (variant.image_url && (!image || image === variant.image)) return variant.image_url;
        if (/^https?:\/\//.test(targetImage) || targetImage.startsWith('/')) return targetImage;

        return `/${props.config_path?.temp || 'var/temp'}/${targetImage}`;
    };

    const handleVariantImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setVariantImageUploading(true);
        try {
            const uploaded = await Promise.all(files.map(async (file) => {
                const formData = new FormData();
                formData.append('photo', file);
                const response = await axios.post(route('product.upload'), formData);

                return {
                    fileName: response.data?.file_name || '',
                    url: response.data?.url || '',
                };
            }));

            const uploadedImages = uploaded.filter((item) => item.fileName);

            if (uploadedImages.length > 0) {
                setVariantDraft((prev: any) => ({
                    ...(prev || {}),
                    image: prev?.image || uploadedImages[0].fileName,
                    image_url: prev?.image_url || uploadedImages[0].url,
                    images: [
                        ...((prev?.images || []) as string[]),
                        ...uploadedImages.map((item) => item.fileName),
                    ],
                    image_urls: [
                        ...((prev?.image_urls || []) as string[]),
                        ...uploadedImages.map((item) => item.url),
                    ],
                }));
            }
        } finally {
            setVariantImageUploading(false);
            e.target.value = '';
        }
    };

    const removeVariantDraftImage = (imageIndex: number) => {
        setVariantDraft((prev: any) => {
            const images = [...(prev?.images || [])];
            const imageUrls = [...(prev?.image_urls || [])];
            images.splice(imageIndex, 1);
            imageUrls.splice(imageIndex, 1);

            return {
                ...(prev || {}),
                images,
                image_urls: imageUrls,
                image: images[0] || '',
                image_url: imageUrls[0] || '',
            };
        });
    };

    const removeVariant = (index: number) => {
        const variants = Array.isArray(data.variants) ? [...data.variants] : [];
        variants.splice(index, 1);
        setData('variants', variants);
    };

    const getAttributeValueLabel = (valueId: number) => {
        for (const attribute of attributeList) {
            const value = (attribute.values || []).find((item: any) => Number(item.id) === Number(valueId));
            if (value) {
                return `${getLocalizedAttributeName(attribute)}: ${getLocalizedAttributeValue(value)}`;
            }
        }

        return `#${valueId}`;
    };

    const createSlug = (str: string) => {
        if (!str) return '';
        return str.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/[^\p{L}\p{N}\s-]/gu, '')
            .replace(/(\s+)/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const stripHtml = (html: string) => {
        const text = html.replace(/<[^>]*>/g, '');
        const doc = new DOMParser().parseFromString(text, 'text/html');
        return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
    };

    const truncateMetaDescription = (text: string, maxLength = 160) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;

        const sliced = text.slice(0, maxLength);
        const lastSpace = sliced.lastIndexOf(' ');

        if (lastSpace <= 0) {
            return sliced.trim();
        }

        return sliced.slice(0, lastSpace).trim();
    };

    const updateTranslation = (locale: string, field: string, value: any) => {
        setData((prev: any) => {
            const currentLangData = prev.translations?.[locale] || {};
            const nextLangData = { ...currentLangData, [field]: value };

            if (field === 'name' && slugLocked[locale]) {
                nextLangData.slug = createSlug(value);
            }

            if (field === 'name') {
                if (!currentLangData.seo_title || currentLangData.seo_title === currentLangData.name) {
                    nextLangData.seo_title = value;
                }
            }

            if (field === 'description') {
                if (!currentLangData.seo_description || currentLangData.seo_description === currentLangData.description || currentLangData.seo_description.length < 5) {
                    nextLangData.seo_description = truncateMetaDescription(stripHtml(value));
                }
            }

            if (field === 'content') {
                if (!currentLangData.seo_description || currentLangData.seo_description.length < 5) {
                    nextLangData.seo_description = truncateMetaDescription(stripHtml(value));
                }
            }

            return {
                ...prev,
                translations: {
                    ...(prev.translations || {}),
                    [locale]: nextLangData
                }
            };
        });
    };

    const handleToggleSlugLock = (locale: string) => {
        setSlugLocked(prev => ({
            ...prev,
            [locale]: !prev[locale]
        }));
    };

    const handleSelectImage = (url: string) => {
        if (tinyCallback) {
            tinyCallback(url);
            setTinyCallback(null);
        }
        setIsModalOpen(false);
    };

    const handleAiSuggestContent = async (locale: string) => {
        const langData = data.translations?.[locale] || {};

        setAiSuggestionError('');
        setAiSuggestingLocale(locale);

        try {
            const response = await axios.post(route('product.ai.suggest-content'), {
                locale,
                name: langData.name || '',
                description: langData.description || '',
                seo_keyword: langData.seo_keyword || '',
                current_content: langData.content || '',
            });

            const generated = String(response?.data?.content || '').trim();

            if (!generated) {
                setAiSuggestionError(
                    trans('hancms.catalog.product.ai.empty_response') || 'AI did not return content.'
                );
                return;
            }

            updateTranslation(locale, 'content', generated);
        } catch (error: any) {
            const message = error?.response?.data?.message
                || trans('hancms.catalog.product.ai.failed')
                || 'Cannot generate content right now.';
            setAiSuggestionError(message);
        } finally {
            setAiSuggestingLocale(null);
        }
    };

    const handleAiSuggestSeo = async (locale: string) => {
        const langData = data.translations?.[locale] || {};

        setAiSeoSuggestionError('');
        setAiSeoSuggestingLocale(locale);

        try {
            const response = await axios.post(route('product.ai.suggest-seo'), {
                locale,
                name: langData.name || '',
                description: langData.description || '',
                seo_keyword: langData.seo_keyword || '',
                current_content: langData.content || '',
                current_seo_title: langData.seo_title || '',
                current_seo_description: langData.seo_description || '',
            });

            const seoTitle = String(response?.data?.seo_title || '').trim();
            const seoDescription = String(response?.data?.seo_description || '').trim();

            if (!seoTitle && !seoDescription) {
                setAiSeoSuggestionError(
                    trans('hancms.catalog.product.ai.empty_response') || 'AI did not return SEO content.'
                );
                return;
            }

            if (seoTitle) {
                updateTranslation(locale, 'seo_title', seoTitle);
            }

            if (seoDescription) {
                updateTranslation(locale, 'seo_description', seoDescription);
            }
        } catch (error: any) {
            const message = error?.response?.data?.message
                || trans('hancms.catalog.product.ai.failed')
                || 'Cannot generate SEO right now.';
            setAiSeoSuggestionError(message);
        } finally {
            setAiSeoSuggestingLocale(null);
        }
    };

    const handleAiAnalyzeSeo = async (locale: string) => {
        const langData = data.translations?.[locale] || {};

        setAiSeoAnalysisError('');
        setAiSeoAnalyzingLocale(locale);

        try {
            const response = await axios.post(route('product.ai.analyze-seo'), {
                locale,
                name: langData.name || '',
                description: langData.description || '',
                content: langData.content || '',
                seo_title: langData.seo_title || '',
                seo_keyword: langData.seo_keyword || '',
                seo_description: langData.seo_description || '',
            });

            setSeoAnalysisByLocale((current) => ({
                ...current,
                [locale]: {
                    score: Number(response?.data?.score || 0),
                    summary: String(response?.data?.summary || ''),
                    keyword_density: Array.isArray(response?.data?.keyword_density) ? response.data.keyword_density : [],
                    checks: Array.isArray(response?.data?.checks) ? response.data.checks : [],
                    recommendations: Array.isArray(response?.data?.recommendations) ? response.data.recommendations : [],
                },
            }));
        } catch (error: any) {
            const message = error?.response?.data?.message
                || trans('hancms.catalog.product.ai.failed')
                || 'Cannot analyze SEO right now.';
            setAiSeoAnalysisError(message);
        } finally {
            setAiSeoAnalyzingLocale(null);
        }
    };

    const applyAiTranslations = (translations: Record<string, any>) => {
        setData((prev: any) => {
            const nextTranslations = { ...(prev.translations || {}) };

            Object.entries(translations).forEach(([locale, fields]) => {
                const translatedFields = fields as Record<string, any>;
                const translatedName = String(translatedFields.name || '').trim();
                const currentData = nextTranslations[locale] || {};
                const nextLocaleData = {
                    ...currentData,
                    ...Object.fromEntries(
                        ['name', 'description', 'content', 'seo_title', 'seo_keyword', 'seo_description']
                            .map((field) => {
                                const value = String(translatedFields[field] || '').trim();
                                return value !== '' ? [field, value] : null;
                            })
                            .filter((entry): entry is [string, string] => entry !== null)
                    ),
                };

                if (translatedName !== '' && (slugLocked[locale] !== false || String(nextLocaleData.slug || '').trim() === '')) {
                    nextLocaleData.slug = createSlug(translatedName);
                }

                nextTranslations[locale] = nextLocaleData;
            });

            return {
                ...prev,
                translations: nextTranslations,
            };
        });
    };

    const handleAiTranslate = async () => {
        const sourceTranslation = data.translations?.[currentTab] || {};
        const targetLocales = langList
            .map((item: any) => item.code)
            .filter((code: string) => code !== currentTab);

        setAiTranslateError('');

        if (!targetLocales.length) {
            setAiTranslateError(trans('hancms.catalog.product.ai.no_target_languages') || 'No target languages available.');
            return;
        }

        const hasSourceContent = ['name', 'description', 'content', 'seo_title', 'seo_keyword', 'seo_description']
            .some((field) => String(sourceTranslation?.[field] || '').trim() !== '');

        if (!hasSourceContent) {
            setAiTranslateError(trans('hancms.catalog.product.ai.missing_input') || 'Please enter content in the current language first.');
            return;
        }

        setAiTranslating(true);

        try {
            const response = await axios.request({
                ...translateLocaleFields(),
                data: {
                    module: 'product',
                    source_locale: currentTab,
                    target_locales: targetLocales,
                    fields: {
                        name: sourceTranslation.name || '',
                        description: sourceTranslation.description || '',
                        content: sourceTranslation.content || '',
                        seo_title: sourceTranslation.seo_title || '',
                        seo_keyword: sourceTranslation.seo_keyword || '',
                        seo_description: sourceTranslation.seo_description || '',
                    },
                },
            });

            const translations = response?.data?.translations || {};

            if (!Object.keys(translations).length) {
                setAiTranslateError(trans('hancms.catalog.product.ai.empty_response') || 'AI did not return translations.');
                return;
            }

            applyAiTranslations(translations);
        } catch (error: any) {
            setAiTranslateError(
                error?.response?.data?.message
                || trans('hancms.catalog.product.ai.failed')
                || 'Unable to translate product content right now.'
            );
        } finally {
            setAiTranslating(false);
        }
    };

    const hasTabError = (tabId: string) => {
        if (!errors) return false;

        if (tabId === 'general') {
            return !!errors.sku || !!errors.price || !!errors.quantity || !!errors.weight || !!errors.order || !!errors.status || !!errors.is_stock || !!errors.is_coupon || !!errors.category_ids;
        }

        if (tabId === 'content') {
            return Object.keys(errors).some((key) => key.startsWith('translations.'));
        }

        if (tabId === 'photos') {
            return !!errors.photos || !!errors.default_photo_id;
        }

        if (tabId === 'variants') {
            return Object.keys(errors).some((key) => key.startsWith('variants.'));
        }

        return false;
    };

    const inputClass = (fieldName: string) => `
        w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition-all focus:ring-4
        ${(errors?.[fieldName])
            ? 'border-rose-400 bg-rose-50 ring-rose-100'
            : 'border-slate-200 focus:border-slate-300 focus:ring-slate-200'}
    `;

    const renderGeneralTab = () => (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                {productWarnings.length > 0 && (
                    <div className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                        <div className="font-black uppercase tracking-wide">
                            {trans('hancms.needs_attention') || 'Cần lưu ý'}
                        </div>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-amber-800">
                            {productWarnings.map((warning) => (
                                <li key={warning}>{warning}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="grid gap-4 md:grid-cols-2">
                    <InputGroup label={trans('hancms.column.sku')} required>
                        <input
                            type="text"
                            className={inputClass('sku')}
                            value={data.sku || ''}
                            onChange={(e) => setData('sku', e.target.value)}
                        />
                        {errors?.sku && <MessageError>{errors.sku}</MessageError>}
                    </InputGroup>
                    <InputGroup label={trans('hancms.column.quantity')}>
                        <input
                            type="number"
                            min="0"
                            className={inputClass('quantity')}
                            value={data.quantity ?? 0}
                            disabled={hasVariants}
                            onChange={(e) => setData('quantity', e.target.value)}
                        />
                        {errors?.quantity && <MessageError>{errors.quantity}</MessageError>}
                        {hasVariants && (
                            <p className="mt-2 text-xs text-amber-700">
                                {trans('hancms.sales.warehouse.messages.parent_stock_managed_by_variants')}
                            </p>
                        )}
                    </InputGroup>
                    <InputGroup label={trans('hancms.column.price')}>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-semibold text-slate-500">
                                {priceSymbol}
                            </span>
                            <input
                                type="text"
                                inputMode={priceCurrency.code === 'VND' || priceCurrency.code === 'JPY' || priceCurrency.code === 'KRW' ? 'numeric' : 'decimal'}
                                className={`${inputClass('price')} pl-8`}
                                value={priceInput}
                                onChange={(e) => {
                                    setPriceInput(e.target.value);
                                    setData('price', e.target.value);
                                }}
                                onBlur={() => {
                                    const formatted = formatPriceInput(priceInput, priceCurrency);
                                    setPriceInput(formatted);
                                    setData('price', formatted);
                                }}
                            />
                        </div>
                        {errors?.price && <MessageError>{errors.price}</MessageError>}
                    </InputGroup>
                    <InputGroup label={trans('hancms.column.weight')}>
                        <input
                            type="number"
                            min="0"
                            className={inputClass('weight')}
                            value={data.weight ?? 0}
                            onChange={(e) => setData('weight', e.target.value)}
                        />
                        {errors?.weight && <MessageError>{errors.weight}</MessageError>}
                    </InputGroup>

                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                <InputGroup label={trans('hancms.column.categories')} align="center">
                    <CategoryMultiSelect
                        data={itemsCategoryActive || []}
                        value={selectedCategoryIds}
                        onChange={(ids) => setData('category_ids', ids)}
                        trans={trans}
                        error={errors?.category_ids}
                    />
                </InputGroup>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                <div className="space-y-4">
                    <StatusSwitch
                        value={data.status}
                        onChange={(value) => setData('status', value)}
                        activeLabel={trans('hancms.status.active')}
                        inactiveLabel={trans('hancms.status.inactive')}
                    />
                    <StatusSwitch
                        value={data.is_stock}
                        onChange={(value) => setData('is_stock', value)}
                        activeLabel={trans('hancms.catalog.product.fields.stock_available')}
                        inactiveLabel={trans('hancms.catalog.product.fields.stock_out')}
                    />
                    <StatusSwitch
                        value={data.is_coupon}
                        onChange={(value) => setData('is_coupon', value)}
                        activeLabel={trans('hancms.catalog.product.fields.coupon_allowed')}
                        inactiveLabel={trans('hancms.catalog.product.fields.coupon_disallowed')}
                    />
                </div>
            </div>
        </div>
    );

    const renderContentTab = () => {
        const lang = langList.find((item: any) => item.code === currentTab) || langList[0];

        if (!lang) {
            return null;
        }

        const locale = lang.code;
        const langCode = locale === 'vn' ? 'vi' : locale;
        const langData = data.translations?.[locale] || {};
        const nameError = errors?.[`translations.${locale}.name`];
        const slugError = errors?.[`translations.${locale}.slug`];
        const descriptionError = errors?.[`translations.${locale}.description`];
        const contentError = errors?.[`translations.${locale}.content`];
        const seoTitleError = errors?.[`translations.${locale}.seo_title`];
        const seoKeywordError = errors?.[`translations.${locale}.seo_keyword`];
        const seoDescriptionError = errors?.[`translations.${locale}.seo_description`];
        const isSlugLocked = !!slugLocked[locale];
        const seoAnalysis = seoAnalysisByLocale[locale];
        const seoScoreColor = (seoAnalysis?.score || 0) >= 80
            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
            : (seoAnalysis?.score || 0) >= 60
                ? 'text-amber-700 bg-amber-50 border-amber-200'
                : 'text-rose-700 bg-rose-50 border-rose-200';
        return (
            <div className="space-y-6">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-6">
                    <div className="flex flex-wrap items-start gap-3">
                        {langList.map((item: any) => {
                            const active = currentTab === item.code;
                            const errorInTab = Object.keys(errors || {}).some((key) => key.startsWith(`translations.${item.code}.`));

                            return (
                                <button
                                    key={item.code}
                                    type="button"
                                    onClick={() => setCurrentTab(item.code)}
                                    className={`flex items-center gap-2 rounded-md border-2 px-4 py-3 text-[12px] font-black uppercase transition-all ${active
                                        ? 'bg-indigo-900 text-white shadow-lg border-indigo-900 scale-105'
                                        : errorInTab
                                            ? 'border-red-300 bg-red-50 text-red-600 shadow-sm'
                                            : 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200'
                                        }`}
                                >
                                    <img
                                        src={`/${props.languageConfigPath.path}/${item.photo}`}
                                        className="h-4 w-4 rounded-full object-cover"
                                        alt={item.name}
                                    />
                                    {item.name}
                                    {errorInTab && (
                                        <span className="relative ml-1 flex h-2 w-2">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600 border border-white" />
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <button
                            type="button"
                            onClick={handleAiTranslate}
                            disabled={aiTranslating || langList.length < 2}
                            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${aiTranslating || langList.length < 2
                                ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500'
                                : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                }`}
                        >
                            <Sparkles size={14} />
                            {aiTranslating
                                ? (trans('hancms.catalog.product.ai.generating') || 'Generating...')
                                : (trans('hancms.catalog.product.ai.translate_button') || 'AI dịch tự động')}
                        </button>
                        {aiTranslateError && (
                            <div className="max-w-[20rem] text-right text-xs text-rose-600">
                                {aiTranslateError}
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                    <div className="grid gap-6">
                        <InputGroup label={trans('hancms.catalog.product.fields.name')} required>
                            <input
                                type="text"
                                value={langData.name || ''}
                                onChange={(e) => updateTranslation(locale, 'name', e.target.value)}
                                className={`w-full rounded-md border p-2 text-sm outline-none transition-all ${nameError
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                    : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'
                                    }`}
                            />
                            {nameError && <MessageError>{nameError}</MessageError>}
                        </InputGroup>

                        <InputGroup label={trans('hancms.column.slug')}>
                            <div className="relative flex items-center group">
                                <input
                                    type="text"
                                    readOnly={isSlugLocked}
                                    value={langData.slug || ''}
                                    onChange={(e) => updateTranslation(locale, 'slug', e.target.value)}
                                    className={`w-full rounded-md border p-2 pr-10 text-sm outline-none transition-all font-mono ${slugError
                                        ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                        : isSlugLocked
                                            ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'border-indigo-300 focus:ring-2 focus:ring-indigo-500 bg-white'
                                        }`}
                                />

                                <button
                                    type="button"
                                    onClick={() => handleToggleSlugLock(locale)}
                                    className={`absolute right-2 p-1.5 rounded-md transition-all ${isSlugLocked
                                        ? 'text-gray-400 hover:bg-gray-200'
                                        : 'text-indigo-600 bg-indigo-50 shadow-sm border border-indigo-100'
                                        }`}
                                >
                                    {isSlugLocked ? <Lock size={14} /> : <LockOpen size={14} />}
                                </button>
                            </div>
                            {slugError && <MessageError>{slugError}</MessageError>}
                            {!isSlugLocked && !slugError && (
                                <p className="text-[12px] text-amber-600 mt-1 italic font-medium">
                                    {trans('hancms.message.edit_slug') || "* Đang cho phép sửa tay Slug của ngôn ngữ này."}
                                </p>
                            )}
                        </InputGroup>

                        <InputGroup label={trans('hancms.column.description')}>
                            <textarea
                                rows={3}
                                value={langData.description || ''}
                                onChange={(e) => updateTranslation(locale, 'description', e.target.value)}
                                className={`w-full rounded-md border p-2 text-sm outline-none transition-all ${descriptionError
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                    : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'
                                    }`}
                            />
                            {descriptionError && <MessageError>{descriptionError}</MessageError>}
                        </InputGroup>

                        <InputGroup label={trans('hancms.column.content')}>
                            <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleAiSuggestContent(locale)}
                                    disabled={aiSuggestingLocale === locale}
                                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${aiSuggestingLocale === locale
                                        ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500'
                                        : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                        }`}
                                >
                                    <Sparkles size={14} />
                                    {aiSuggestingLocale === locale
                                        ? (trans('hancms.catalog.product.ai.generating') || 'Generating...')
                                        : (trans('hancms.catalog.product.ai.suggest_content') || 'AI suggest content')}
                                </button>
                            </div>
                            <Editor
                                tinymceScriptSrc="/js/tinymce/tinymce.min.js"
                                licenseKey="gpl"
                                value={langData.content || ''}
                                init={{
                                    height: 400,
                                    menubar: false,
                                    branding: false,
                                    promotion: false,
                                    document_base_url: '/',
                                    convert_urls: true,
                                    remove_script_host: true,
                                    relative_urls: false,
                                    language: langCode,
                                    language_url: `/js/tinymce/langs/${langCode}.js`,
                                    plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'code', 'table', 'wordcount'],
                                    toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist | image code',
                                    file_picker_callback: (callback, value, meta) => {
                                        if (meta.filetype === 'image') {
                                            setTinyCallback(() => callback);
                                            setIsModalOpen(true);
                                        }
                                    }
                                }}
                                onEditorChange={(content) => updateTranslation(locale, 'content', content)}
                            />
                            {aiSuggestionError && <MessageError>{aiSuggestionError}</MessageError>}
                            {contentError && <MessageError>{contentError}</MessageError>}
                        </InputGroup>

                        <div className="bg-gray-100 p-5 rounded-xl border border-gray-200 space-y-6">
                            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2 text-indigo-900 font-bold uppercase">
                                    <Search size={16} /> {trans('hancms.seo.name') || "Search Engine Optimization"}
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleAiAnalyzeSeo(locale)}
                                        disabled={aiSeoAnalyzingLocale === locale}
                                        className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${aiSeoAnalyzingLocale === locale
                                            ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500'
                                            : 'border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
                                            }`}
                                    >
                                        <Search size={14} />
                                        {aiSeoAnalyzingLocale === locale
                                            ? (trans('hancms.catalog.product.ai.generating') || 'Generating...')
                                            : (trans('hancms.catalog.product.ai.analyze_seo') || 'AI analyze SEO')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleAiSuggestSeo(locale)}
                                        disabled={aiSeoSuggestingLocale === locale}
                                        className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${aiSeoSuggestingLocale === locale
                                            ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500'
                                            : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                            }`}
                                    >
                                        <Sparkles size={14} />
                                        {aiSeoSuggestingLocale === locale
                                            ? (trans('hancms.catalog.product.ai.generating') || 'Generating...')
                                            : (trans('hancms.catalog.product.ai.suggest_seo') || 'AI suggest SEO')}
                                    </button>
                                </div>
                            </div>
                            {aiSeoSuggestionError && <MessageError>{aiSeoSuggestionError}</MessageError>}
                            {aiSeoAnalysisError && <MessageError>{aiSeoAnalysisError}</MessageError>}
                            {seoAnalysis ? (
                                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                                {trans('hancms.catalog.product.ai.seo_analysis') || 'SEO analysis'}
                                            </div>
                                            <p className="mt-1 text-sm text-slate-600">{seoAnalysis.summary}</p>
                                        </div>
                                        <div className={`rounded-2xl border px-4 py-2 text-center ${seoScoreColor}`}>
                                            <div className="text-2xl font-black leading-none">{seoAnalysis.score}</div>
                                            <div className="mt-1 text-[10px] font-bold uppercase tracking-wide">SEO</div>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                                        <div className="space-y-2">
                                            <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                                {trans('hancms.catalog.product.ai.seo_checks') || 'SEO checks'}
                                            </div>
                                            {(seoAnalysis.checks || []).map((check, index) => (
                                                <div key={`${check.label}-${index}`} className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-sm">
                                                    {check.status === 'good' ? (
                                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                                                    ) : (
                                                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                                                    )}
                                                    <div>
                                                        <div className="font-semibold text-slate-800">{check.label}</div>
                                                        <div className="mt-0.5 text-xs text-slate-500">{check.message}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                                    {trans('hancms.catalog.product.ai.keyword_density') || 'Keyword density'}
                                                </div>
                                                <div className="mt-2 space-y-2">
                                                    {(seoAnalysis.keyword_density || []).length > 0 ? seoAnalysis.keyword_density.map((item, index) => (
                                                        <div key={`${item.keyword}-${index}`} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 text-sm">
                                                            <span className="min-w-0 truncate font-semibold text-slate-700">{item.keyword}</span>
                                                            <span className="shrink-0 font-mono text-xs text-slate-500">
                                                                {item.count} / {Number(item.density || 0).toFixed(2)}%
                                                            </span>
                                                        </div>
                                                    )) : (
                                                        <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500">
                                                            {trans('hancms.catalog.product.ai.no_keywords') || 'No SEO keywords to analyze.'}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {(seoAnalysis.recommendations || []).length > 0 ? (
                                                <div>
                                                    <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                                        {trans('hancms.catalog.product.ai.recommendations') || 'Recommendations'}
                                                    </div>
                                                    <ul className="mt-2 space-y-2 text-sm text-slate-600">
                                                        {seoAnalysis.recommendations.map((recommendation, index) => (
                                                            <li key={`${recommendation}-${index}`} className="rounded-xl bg-cyan-50 px-3 py-2 text-cyan-800">
                                                                {recommendation}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            <InputGroup
                                label={
                                    <div className="flex justify-between items-end w-full">
                                        <span>{trans('hancms.seo.field.title') || "Seo Title"}</span>
                                        <span className={`text-[10px] font-mono ${langData.seo_title?.length > 60 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                            {langData.seo_title?.length || 0}/60 {trans('hancms.seo.character') || "character"}
                                        </span>
                                    </div>
                                }
                            >
                                <input
                                    type="text"
                                    value={langData.seo_title || ''}
                                    onChange={(e) => updateTranslation(locale, 'seo_title', e.target.value)}
                                    className={`w-full rounded-md border p-2 text-sm outline-none transition-all ${seoTitleError
                                        ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'
                                        }`}
                                />
                                {seoTitleError && <MessageError>{seoTitleError}</MessageError>}
                            </InputGroup>

                            <InputGroup label={trans('hancms.seo.field.keyword') || "SEO Keywords"}>
                                <textarea
                                    rows={3}
                                    value={langData.seo_keyword || ''}
                                    onChange={(e) => updateTranslation(locale, 'seo_keyword', e.target.value)}
                                    className={`w-full rounded-md border p-2 text-sm outline-none transition-all ${seoKeywordError
                                        ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'
                                        }`}
                                />
                                {seoKeywordError && <MessageError>{seoKeywordError}</MessageError>}
                            </InputGroup>

                            <InputGroup
                                label={
                                    <div className="flex justify-between items-end w-full">
                                        <span>{trans('hancms.seo.field.description') || "SEO Description"}</span>
                                        <span className={`text-[10px] font-mono ${langData.seo_description?.length > 160 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                            {langData.seo_description?.length || 0}/160 {trans('hancms.seo.character') || "character"}
                                        </span>
                                    </div>
                                }
                            >
                                <textarea
                                    rows={3}
                                    value={langData.seo_description || ''}
                                    onChange={(e) => updateTranslation(locale, 'seo_description', e.target.value)}
                                    className={`w-full rounded-md border p-2 text-sm outline-none transition-all ${seoDescriptionError
                                        ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'
                                        }`}
                                    placeholder={trans('hancms.seo.placeholder.description') || "Mô tả ngắn gọn nội dung trang web..."}
                                />
                                {seoDescriptionError && <MessageError>{seoDescriptionError}</MessageError>}
                            </InputGroup>
                        </div>

                        <div className="mt-6 p-5 bg-gray-300 border border-gray-200 rounded-xl shadow-sm w-full font-sans">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                    <Globe size={14} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[12px] text-[#202124] leading-tight">{siteName}</span>
                                    <span className="text-[12px] text-green-700 leading-tight flex items-center gap-1">
                                        https://domain.com /{langData.slug || 'alias'}.html
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer font-normal leading-tight mb-1">
                                {langData.seo_title || langData.name || trans('hancms.seo.review.title')}
                            </h3>

                            <p className="text-[14px] text-[#4d5156] leading-relaxed line-clamp-2">
                                {langData.seo_description || trans('hancms.seo.review.description')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderPhotosTab = () => (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.35)] sm:p-6">
            <MultiUpload
                existingPhotos={existingPhotos}
                selectedFiles={selectedFiles}
                onFilesChange={(files) => setData('photos', files)}
                onExistingPhotosChange={setExistingPhotos}
                onDeleteExisting={(id) => {
                    setExistingPhotos((prev) => prev.filter((photo) => String(photo.id) !== String(id)));
                    const next = Array.isArray(data.delete_photo_ids) ? data.delete_photo_ids : [];
                    setData('delete_photo_ids', [...next, id]);
                    if (String(defaultPhotoId) === String(id)) {
                        setData('default_photo_id', null);
                    }
                }}
                defaultPhotoId={defaultPhotoId}
                onSetDefaultPhotoId={(id) => setData('default_photo_id', id)}
            />
            {errors?.photos && <MessageError>{errors.photos}</MessageError>}
        </div>
    );

    const renderVariantsTab = () => {
        const variants = Array.isArray(data.variants) ? data.variants : [];

        return (
            <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h3 className="text-sm font-black uppercase text-slate-800">
                                {trans('hancms.catalog.product.variants.attributes') || 'Variant attributes'}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                {trans('hancms.catalog.product.variants.attributes_hint') || 'Choose attribute values, then generate combinations.'}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={openQuickAttributeModal}
                            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-3 text-xs font-black uppercase text-white transition hover:bg-slate-700"
                        >
                            <Plus size={15} />
                            {trans('hancms.catalog.product.variants.create_attribute') || 'Tạo thuộc tính'}
                        </button>
                    </div>

                    {attributeList.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500">
                            {trans('hancms.catalog.product.variants.empty_attributes') || 'Create product attributes and values before generating variants.'}
                        </div>
                    ) : (
                        <div className="grid gap-4 lg:grid-cols-2">
                            {attributeList.map((attribute: any) => {
                                const selectedValues = selectedValueIdsByAttribute[String(attribute.id)] || [];

                                return (
                                    <div key={attribute.id} className="rounded-xl border border-slate-200 bg-white p-4">
                                        <div className="mb-3 flex items-center justify-between gap-3">
                                            <div className="flex min-w-0 flex-1 items-center gap-2">
                                                <div className="text-sm font-bold text-slate-800">{getLocalizedAttributeName(attribute)}</div>
                                                <button
                                                    type="button"
                                                    onClick={() => openQuickValueModal(attribute)}
                                                    className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-[11px] font-black uppercase text-slate-700 transition hover:bg-slate-50"
                                                >
                                                    <Plus size={12} />
                                                    {trans('hancms.catalog.attribute.fields.add_value')}
                                                </button>
                                            </div>
                                            <div className="text-xs font-semibold text-slate-400">
                                                {selectedValues.length}/{attribute.values?.length || 0}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {(attribute.values || []).map((value: any) => {
                                                const checked = selectedValues.includes(Number(value.id));

                                                return (
                                                    <button
                                                        key={value.id}
                                                        type="button"
                                                        onClick={() => toggleAttributeValue(Number(attribute.id), Number(value.id))}
                                                        className={`rounded-md border px-3 py-2 text-xs font-bold transition ${checked
                                                            ? 'border-slate-900 bg-slate-900 text-white'
                                                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-400'
                                                            }`}
                                                    >
                                                        {getLocalizedAttributeValue(value)}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-4">
                        <div>
                            <h3 className="text-sm font-black uppercase text-slate-800">
                                {trans('hancms.catalog.product.variants.name') || 'Product variants'}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                {variants.length} {trans('hancms.catalog.product.variants.rows') || 'rows'}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setData('variants', [
                                ...variants,
                                {
                                    translations: buildEmptyVariantTranslations(),
                                    sku: data.sku ? `${data.sku}-${variants.length + 1}` : '',
                                    price: data.price || 0,
                                    stock: 0,
                                    image: '',
                                    image_url: '',
                                    images: [],
                                    image_urls: [],
                                    attribute_value_ids: [],
                                },
                            ])}
                            className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-3 text-xs font-black uppercase text-slate-700 transition hover:bg-slate-50"
                        >
                            <Plus size={15} />
                            {trans('hancms.button.add') || 'Add'}
                        </button>
                    </div>

                    {variants.length === 0 ? (
                        <div className="px-4 py-10 text-center text-sm text-slate-500">
                            {trans('hancms.catalog.product.variants.empty') || 'No variants yet.'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-[1120px] w-full text-left text-sm">
                                <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">{trans('hancms.column.attributes') || 'Attributes'}</th>
                                        <th className="px-4 py-3">{trans('hancms.column.name') || 'Name'}</th>
                                        <th className="px-4 py-3">{trans('hancms.column.sku')}</th>
                                        <th className="px-4 py-3">{trans('hancms.column.price')}</th>
                                        <th className="px-4 py-3">{trans('hancms.column.stock') || 'Stock'}</th>
                                        <th className="px-4 py-3">{trans('hancms.column.image') || 'Image'}</th>
                                        <th className="px-4 py-3">{trans('hancms.column.action')}</th>
                                        <th className="w-16 px-4 py-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {variants.map((variant: any, index: number) => {
                                        const attributeValueIds = variant.attribute_value_ids || [];
                                        const variantName = variant?.translations?.[currentVariantLocale]?.name || variant?.name || '-';

                                        return (
                                            <tr key={variant.id || getVariantKey(attributeValueIds) || index} className="align-top">
                                                <td className="px-4 py-4">
                                                    <div className="flex max-w-[260px] flex-wrap gap-2">
                                                        {attributeValueIds.length === 0 ? (
                                                            <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                                                                {trans('hancms.catalog.product.variants.manual') || 'Manual'}
                                                            </span>
                                                        ) : attributeValueIds.map((valueId: number) => (
                                                            <span key={valueId} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                                                                {getAttributeValueLabel(Number(valueId))}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    {errors?.[`variants.${index}.attribute_value_ids`] && (
                                                        <MessageError>{errors[`variants.${index}.attribute_value_ids`]}</MessageError>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="max-w-[240px] font-semibold text-slate-800">{variantName}</div>
                                                    {errors?.[`variants.${index}.translations`] && <MessageError>{errors[`variants.${index}.translations`]}</MessageError>}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="font-semibold text-slate-800">{variant.sku || '-'}</div>
                                                    {errors?.[`variants.${index}.sku`] && <MessageError>{errors[`variants.${index}.sku`]}</MessageError>}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="font-semibold text-slate-800">{variant.price ?? '-'}</div>
                                                    {errors?.[`variants.${index}.price`] && <MessageError>{errors[`variants.${index}.price`]}</MessageError>}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="font-semibold text-slate-800">{variant.stock ?? 0}</div>
                                                    {errors?.[`variants.${index}.stock`] && <MessageError>{errors[`variants.${index}.stock`]}</MessageError>}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {getVariantImagePreviewUrl(variant) ? (
                                                        <div className="flex items-center gap-2">
                                                            <img
                                                                src={getVariantImagePreviewUrl(variant)}
                                                                alt={variant.sku || ''}
                                                                className="h-12 w-12 rounded-md object-cover"
                                                            />
                                                            {(variant.images?.length || 0) > 1 && (
                                                                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                                                                    +{variant.images.length - 1}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="h-12 w-12 rounded-md border border-dashed border-slate-300 bg-slate-50" />
                                                    )}
                                                    {errors?.[`variants.${index}.image`] && <MessageError>{errors[`variants.${index}.image`]}</MessageError>}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => openVariantModal(index)}
                                                        className="rounded-md border border-slate-300 px-3 py-2 text-xs font-black uppercase text-slate-700 transition hover:bg-slate-50"
                                                    >
                                                        {trans('hancms.button.edit') || 'Edit'}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeVariant(index)}
                                                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                                                        aria-label="Remove variant"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return renderGeneralTab();
            case 'content':
                return renderContentTab();
            case 'photos':
                return renderPhotosTab();
            case 'variants':
                return renderVariantsTab();
            default:
                return null;
        }
    };

    return (
        <div>
            <HeaderToolbar title={title}>
                <SaveButton
                    loading={processing}
                    undo={undo}
                    icon={<Save size={18} />}
                    sendDataStatusUndo={handleUndo}
                    form="product-form"
                >
                    {submitLabel}
                </SaveButton>
                <BackButton href={backHref}>
                    {trans('hancms.button.back')}
                </BackButton>
            </HeaderToolbar>

            <form id="product-form" onSubmit={onSubmit} noValidate className="text-sm">
                <Card title={trans('hancms.catalog.product.admin.name')} className="mb-6">
                    <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
                        <div className="flex flex-wrap gap-3 overflow-x-auto pb-1">
                            {['general', 'content', 'variants', 'photos'].map((id) => {
                                const errorInTab = hasTabError(id);
                                const active = activeTab === id;

                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => setActiveTab(id)}
                                        className={`flex items-center gap-2 rounded-md border-2 px-4 py-3 text-[12px] font-black uppercase transition-all ${active
                                            ? 'scale-105 border-slate-900 bg-slate-900 text-white shadow-lg'
                                            : errorInTab
                                                ? 'border-rose-300 bg-rose-50 text-rose-600 shadow-sm'
                                                : 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200'
                                            }`}
                                    >
                                        <span>{trans(`hancms.catalog.product.tabs.${id}`)}</span>
                                        {errorInTab && (
                                            <span className="relative flex h-2 w-2">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                                                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-600 border border-white" />
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="p-6 min-h-[500px]">
                        {renderTabContent()}
                    </div>
                </Card>
            </form>
            {editingVariantIndex !== null && variantDraft && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/55 px-4 py-6">
                    <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                            <div>
                                <h3 className="text-base font-black uppercase text-slate-900">
                                    {trans('hancms.catalog.product.variants.modal_title') || 'Variant information'}
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    {variantDraft.attribute_value_ids?.length
                                        ? variantDraft.attribute_value_ids.map((valueId: number) => getAttributeValueLabel(Number(valueId))).join(' / ')
                                        : (trans('hancms.catalog.product.variants.manual') || 'Manual')}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeVariantModal}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-6 px-5 py-5">
                            <div className="space-y-4 mb-5 pb-5 border-b border-slate-200">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h4 className="text-xs font-black uppercase text-slate-500">
                                            {trans('hancms.column.name') || 'Name'}
                                        </h4>
                                        <p className="mt-1 text-xs text-slate-400">
                                            {trans('hancms.catalog.product.variants.localized_name_hint') || 'Enter all language names at the same time.'}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <button
                                            type="button"
                                            onClick={handleVariantAiTranslate}
                                            disabled={variantAiTranslating || variantLocales.length < 2}
                                            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${variantAiTranslating || variantLocales.length < 2
                                                ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500'
                                                : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                                }`}
                                        >
                                            <Sparkles size={14} />
                                            {variantAiTranslating
                                                ? (trans('hancms.catalog.product.ai.generating') || 'Generating...')
                                                : (trans('hancms.catalog.product.ai.translate_button') || 'AI dịch tự động')}
                                        </button>
                                        {variantAiTranslateError && (
                                            <div className="max-w-[20rem] text-right text-xs text-rose-600">
                                                {variantAiTranslateError}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    {variantLocales.map((lang: any) => (
                                        <InputGroup
                                            key={lang.code}
                                            stacked
                                            label={(
                                                <span className="flex items-center gap-2">
                                                    {getLanguageLogoUrl(lang) ? (
                                                        <img
                                                            src={getLanguageLogoUrl(lang)}
                                                            alt={lang.name || lang.code}
                                                            className="h-4 w-4 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[9px] font-black text-slate-600">
                                                            {String(lang.code || '?').slice(0, 1).toUpperCase()}
                                                        </span>
                                                    )}
                                                    <span>{lang.name || lang.code?.toUpperCase()}</span>
                                                </span>
                                            )}
                                            required
                                        >
                                            <input
                                                type="text"
                                                className={inputClass(`variants.${editingVariantIndex}.translations.${lang.code}.name`)}
                                                value={variantDraft.translations?.[lang.code]?.name || ''}
                                                onChange={(e) => updateVariantDraftTranslation(lang.code, e.target.value)}
                                                placeholder={`${trans('hancms.column.name') || 'Name'} ${lang.name || lang.code?.toUpperCase()}`}
                                            />
                                            {errors?.[`variants.${editingVariantIndex}.translations.${lang.code}.name`] && (
                                                <MessageError>{errors[`variants.${editingVariantIndex}.translations.${lang.code}.name`]}</MessageError>
                                            )}
                                        </InputGroup>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <InputGroup label={trans('hancms.column.sku')} required>
                                    <input
                                        type="text"
                                        className={inputClass(`variants.${editingVariantIndex}.sku`)}
                                        value={variantDraft.sku || ''}
                                        onChange={(e) => setVariantDraft((prev: any) => ({ ...(prev || {}), sku: e.target.value }))}
                                    />
                                    {errors?.[`variants.${editingVariantIndex}.sku`] && (
                                        <MessageError>{errors[`variants.${editingVariantIndex}.sku`]}</MessageError>
                                    )}
                                </InputGroup>

                                <InputGroup label={trans('hancms.column.price')} required>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        className={inputClass(`variants.${editingVariantIndex}.price`)}
                                        value={variantDraft.price ?? ''}
                                        onChange={(e) => setVariantDraft((prev: any) => ({ ...(prev || {}), price: e.target.value }))}
                                    />
                                    {errors?.[`variants.${editingVariantIndex}.price`] && (
                                        <MessageError>{errors[`variants.${editingVariantIndex}.price`]}</MessageError>
                                    )}
                                </InputGroup>

                                <InputGroup label={trans('hancms.column.stock') || 'Stock'} required>
                                    <input
                                        type="number"
                                        min="0"
                                        className={inputClass(`variants.${editingVariantIndex}.stock`)}
                                        value={variantDraft.stock ?? 0}
                                        onChange={(e) => setVariantDraft((prev: any) => ({ ...(prev || {}), stock: e.target.value }))}
                                    />
                                    {errors?.[`variants.${editingVariantIndex}.stock`] && (
                                        <MessageError>{errors[`variants.${editingVariantIndex}.stock`]}</MessageError>
                                    )}
                                </InputGroup>
                            </div>

                            <div className="space-y-3 border-t border-slate-200 pt-5">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <div className="text-xs font-black uppercase text-slate-500">
                                            {trans('hancms.catalog.product.variants.images') || 'Variant images'}
                                        </div>
                                        <p className="mt-1 text-xs text-slate-400">
                                            {trans('hancms.catalog.product.variants.images_hint') || 'Upload images in one horizontal row. Click an image to make it the cover.'}
                                        </p>
                                    </div>

                                    {variantDraft.images?.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setVariantDraft((prev: any) => ({ ...(prev || {}), image: '', image_url: '', images: [], image_urls: [] }))}
                                            className="inline-flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
                                        >
                                            <Trash2 size={14} />
                                            {trans('hancms.catalog.product.variants.clear_images') || 'Clear images'}
                                        </button>
                                    )}
                                </div>

                                <input
                                    id={`variant-images-${editingVariantIndex}`}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleVariantImageChange}
                                />

                                <div className="flex flex-nowrap items-stretch gap-3 overflow-x-auto pb-1">
                                    <label
                                        htmlFor={`variant-images-${editingVariantIndex}`}
                                        className="flex h-28 w-28 shrink-0 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center transition hover:border-indigo-400 hover:bg-indigo-50"
                                    >
                                        {variantImageUploading ? (
                                            <RefreshCw className="h-7 w-7 animate-spin text-indigo-500" />
                                        ) : (
                                            <>
                                                <Plus className="h-7 w-7 text-slate-400" />
                                                <span className="mt-2 text-[11px] font-black uppercase text-slate-600">
                                                    {trans('hancms.catalog.product.variants.upload_images') || 'Upload images'}
                                                </span>
                                            </>
                                        )}
                                    </label>

                                    {(variantDraft.images || []).map((image: string, imageIndex: number) => {
                                        const previewUrl = getVariantImagePreviewUrl(variantDraft, image, imageIndex);
                                        const isCover = variantDraft.image
                                            ? variantDraft.image === image
                                            : imageIndex === 0;

                                        return (
                                            <button
                                                key={`${image}-${imageIndex}`}
                                                type="button"
                                                onClick={() => setVariantDraft((prev: any) => ({
                                                    ...(prev || {}),
                                                    image,
                                                    image_url: previewUrl,
                                                }))}
                                                className={`group relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border transition ${isCover
                                                    ? 'border-emerald-500 ring-2 ring-emerald-200'
                                                    : 'border-slate-200 bg-slate-100 hover:border-slate-300'
                                                    }`}
                                            >
                                                <img
                                                    src={previewUrl}
                                                    alt={image}
                                                    className="h-full w-full object-cover"
                                                />
                                                {isCover && (
                                                    <span className="absolute left-2 top-2 rounded-full bg-emerald-600 px-2 py-1 text-[10px] font-black uppercase text-white">
                                                        {trans('hancms.default')}
                                                    </span>
                                                )}
                                                <span className="absolute inset-x-0 bottom-0 bg-slate-950/35 px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
                                                    {trans('hancms.catalog.product.variants.set_cover') || 'Set cover'}
                                                </span>
                                                <span
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        removeVariantDraftImage(imageIndex);
                                                    }}
                                                    onKeyDown={(event) => {
                                                        event.stopPropagation();
                                                        if (event.key === 'Enter' || event.key === ' ') {
                                                            removeVariantDraftImage(imageIndex);
                                                        }
                                                    }}
                                                    className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white opacity-0 transition group-hover:opacity-100"
                                                >
                                                    <Trash2 size={14} />
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 px-5 py-4">
                            <button
                                type="button"
                                onClick={closeVariantModal}
                                className="rounded-md border border-slate-300 px-4 py-3 text-xs font-black uppercase text-slate-600 transition hover:bg-slate-50"
                            >
                                {trans('hancms.button.cancel') || 'Cancel'}
                            </button>
                            <button
                                type="button"
                                onClick={saveVariantDraft}
                                className="rounded-md bg-slate-900 px-4 py-3 text-xs font-black uppercase text-white transition hover:bg-slate-700"
                            >
                                {trans('hancms.button.save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <MediaLibraryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleSelectImage}
            />

            {isQuickValueModalOpen && quickValueDraft && quickValueAttribute && (
                <div
                    className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/60 px-4 py-6"
                    onKeyDownCapture={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    }}
                >
                    <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                            <div>
                                <h3 className="text-base font-black uppercase text-slate-900">
                                    {trans('hancms.catalog.attribute.fields.add_value')}
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    {getLocalizedAttributeName(quickValueAttribute)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeQuickValueModal}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-5 px-5 py-5">
                            {quickValueErrors.form && (
                                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                                    {quickValueErrors.form}
                                </div>
                            )}

                            <div className="rounded-xl border border-slate-200 p-4">
                                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <h4 className="text-xs font-black uppercase text-slate-500">
                                            {trans('hancms.catalog.attribute.fields.localized_value_hint')}
                                        </h4>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <button
                                            type="button"
                                            onClick={handleQuickValueAiTranslate}
                                            disabled={quickValueAiTranslating || quickAttributeLocales.length < 2}
                                            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${quickValueAiTranslating || quickAttributeLocales.length < 2
                                                ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500'
                                                : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                                }`}
                                        >
                                            <Sparkles size={14} />
                                            {quickValueAiTranslating
                                                ? (trans('hancms.catalog.attribute.ai.generating') || 'Generating...')
                                                : (trans('hancms.catalog.attribute.ai.translate_button') || 'AI dịch tự động')}
                                        </button>
                                        {quickValueAiTranslateError && (
                                            <div className="max-w-[20rem] text-right text-xs text-rose-600">
                                                {quickValueAiTranslateError}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-3">
                                    {quickAttributeLocales.map((lang: any, index: number) => (
                                        <div key={lang.code} className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                {getLanguageLogoUrl(lang) ? (
                                                    <img src={getLanguageLogoUrl(lang)} alt={lang.name || lang.code} className="h-4 w-4 rounded-full object-cover" />
                                                ) : null}
                                                <span>{lang.name || lang.code?.toUpperCase()}</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={quickValueDraft.translations[index]?.value || ''}
                                                onChange={(e) => updateQuickValueTranslation(index, e.target.value)}
                                                className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500"
                                            />
                                            {quickValueErrors[`translations.${index}.value`] && (
                                                <MessageError>{quickValueErrors[`translations.${index}.value`]}</MessageError>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {quickValueAttribute.type === 'image' ? (
                                <div className="rounded-xl border border-slate-200 p-4">
                                    <div className="mb-4 flex items-center justify-between gap-3">
                                        <div>
                                            <h4 className="text-xs font-black uppercase text-slate-500">
                                                {trans('hancms.catalog.attribute.fields.image')}
                                            </h4>
                                            <p className="mt-1 text-xs text-slate-400">
                                                {trans('hancms.catalog.attribute.fields.image_hint')}
                                            </p>
                                        </div>
                                    </div>
                                    <label className="group flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white transition hover:border-indigo-400 hover:bg-indigo-50/40">
                                        <input
                                            className="sr-only"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => updateQuickValueImage(e.target.files?.[0] ?? null)}
                                        />
                                        {isQuickValueImageUploading ? (
                                            <RefreshCw className="h-6 w-6 animate-spin text-indigo-500" />
                                        ) : quickValueDraft.image_url ? (
                                            <img
                                                src={quickValueDraft.image_url}
                                                alt={trans('hancms.catalog.attribute.fields.image')}
                                                className="h-full w-full object-contain p-1"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-slate-400 transition group-hover:text-slate-700">
                                                <Plus className="h-6 w-6" />
                                            </div>
                                        )}
                                    </label>
                                    {quickValueErrors.image && <MessageError>{quickValueErrors.image}</MessageError>}
                                </div>
                            ) : null}

                            {quickValueAttribute.type === 'color' ? (
                                <div className="rounded-xl border border-slate-200 p-4">
                                    <div className="mb-4">
                                        <h4 className="text-xs font-black uppercase text-slate-500">
                                            {trans('hancms.catalog.attribute.fields.color')}
                                        </h4>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={quickValueDraft.color || '#000000'}
                                            onChange={(e) => updateQuickValueColor(e.target.value)}
                                            className="h-11 w-14 rounded-lg border border-slate-300 p-1"
                                        />
                                        <span className="text-sm font-medium text-slate-600">{quickValueDraft.color || '#000000'}</span>
                                    </div>
                                    {quickValueErrors.color && <MessageError>{quickValueErrors.color}</MessageError>}
                                </div>
                            ) : null}
                        </div>

                        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 px-5 py-4">
                            <button
                                type="button"
                                onClick={closeQuickValueModal}
                                className="rounded-md border border-slate-300 px-4 py-3 text-xs font-black uppercase text-slate-600 transition hover:bg-slate-50"
                            >
                                {trans('hancms.button.cancel') || 'Cancel'}
                            </button>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    submitQuickValue();
                                }}
                                disabled={isQuickValueSubmitting}
                                className="rounded-md bg-slate-900 px-4 py-3 text-xs font-black uppercase text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                            >
                                {isQuickValueSubmitting ? (trans('hancms.loading') || 'Saving...') : (trans('hancms.button.save') || 'Save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isQuickAttributeModalOpen && (
                <div
                    className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/60 px-4 py-6"
                    onKeyDownCapture={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    }}
                >
                    <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                            <div>
                                <h3 className="text-base font-black uppercase text-slate-900">
                                    {trans('hancms.catalog.product.variants.create_attribute') || 'Tạo thuộc tính'}
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    {trans('hancms.catalog.product.variants.quick_attribute_hint') || 'Create a new attribute without leaving the product form.'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeQuickAttributeModal}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-6 px-5 py-5">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-500">
                                        {trans('hancms.catalog.attribute.fields.code')}
                                    </label>
                                    <input
                                        type="text"
                                        value={quickAttributeDraft.code}
                                        onChange={(e) => setQuickAttributeDraft((current) => ({ ...current, code: e.target.value }))}
                                        className={`w-full rounded-md border p-2 text-sm outline-none transition-all ${quickAttributeErrors.code ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'}`}
                                        placeholder={trans('hancms.catalog.attribute.fields.code_placeholder')}
                                    />
                                    {quickAttributeErrors.code && <MessageError>{quickAttributeErrors.code}</MessageError>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-500">
                                        {trans('hancms.catalog.attribute.fields.type')}
                                    </label>
                                    <select
                                        value={quickAttributeDraft.type}
                                        onChange={(e) => setQuickAttributeDraft((current) => ({ ...current, type: e.target.value as QuickAttributeFormState['type'] }))}
                                        className={`w-full rounded-md border p-2 text-sm outline-none transition-all ${quickAttributeErrors.type ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'}`}
                                    >
                                        <option value="text">{trans('hancms.catalog.attribute.fields.text')}</option>
                                        <option value="image">{trans('hancms.catalog.attribute.fields.image')}</option>
                                        <option value="color">{trans('hancms.catalog.attribute.fields.color')}</option>
                                    </select>
                                    {quickAttributeErrors.type && <MessageError>{quickAttributeErrors.type}</MessageError>}
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 p-4">
                                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <h4 className="text-xs font-black uppercase text-slate-500">
                                            {trans('hancms.catalog.attribute.fields.localized_name_hint')}
                                        </h4>
                                        <p className="mt-1 text-xs text-slate-400">
                                            Enter one localized name or value first, then let AI fill the others automatically.
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <button
                                            type="button"
                                            onClick={handleQuickAttributeAiTranslate}
                                            disabled={quickAttributeAiTranslating || quickAttributeLocales.length < 2}
                                            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${quickAttributeAiTranslating || quickAttributeLocales.length < 2
                                                ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500'
                                                : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                                }`}
                                        >
                                            <Sparkles size={14} />
                                            {quickAttributeAiTranslating
                                                ? (trans('hancms.catalog.attribute.ai.generating') || 'Generating...')
                                                : (trans('hancms.catalog.attribute.ai.translate_button') || 'AI dịch tự động')}
                                        </button>
                                        {quickAttributeAiTranslateError && (
                                            <div className="max-w-[20rem] text-right text-xs text-rose-600">
                                                {quickAttributeAiTranslateError}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-3">
                                    {quickAttributeLocales.map((lang: any, index: number) => (
                                        <div key={lang.code} className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                {getLanguageLogoUrl(lang) ? (
                                                    <img src={getLanguageLogoUrl(lang)} alt={lang.name || lang.code} className="h-4 w-4 rounded-full object-cover" />
                                                ) : null}
                                                <span>{lang.name || lang.code?.toUpperCase()}</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={quickAttributeDraft.translations[index]?.name || ''}
                                                onChange={(e) => updateQuickAttributeTranslation(index, e.target.value)}
                                                className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 p-4">
                                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <h4 className="text-xs font-black uppercase text-slate-500">
                                            {trans('hancms.catalog.attribute.sections.values')}
                                        </h4>
                                        <p className="mt-1 text-xs text-slate-400">
                                            {trans('hancms.catalog.attribute.fields.localized_value_hint')}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={appendQuickAttributeValue}
                                        className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-xs font-black uppercase text-slate-700 transition hover:bg-slate-50"
                                    >
                                        <Plus size={14} />
                                        {trans('hancms.catalog.attribute.fields.add_value')}
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {quickAttributeDraft.values.map((value, valueIndex) => (
                                        <div key={valueIndex} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <div className="mb-3 flex items-center justify-between gap-3">
                                                <div className="text-xs font-black uppercase text-slate-500">
                                                    {trans('hancms.catalog.attribute.fields.value')} {valueIndex + 1}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeQuickAttributeValue(valueIndex)}
                                                    className="rounded-md border border-rose-200 px-3 py-2 text-[11px] font-black uppercase text-rose-600 transition hover:bg-rose-50"
                                                >
                                                    {trans('hancms.catalog.attribute.fields.remove')}
                                                </button>
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-3">
                                                {quickAttributeLocales.map((lang: any, index: number) => (
                                                    <div key={lang.code} className="space-y-2">
                                                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                            {getLanguageLogoUrl(lang) ? (
                                                                <img src={getLanguageLogoUrl(lang)} alt={lang.name || lang.code} className="h-4 w-4 rounded-full object-cover" />
                                                            ) : null}
                                                            <span>{lang.name || lang.code?.toUpperCase()}</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={value.translations[index]?.value || ''}
                                                            onChange={(e) => updateQuickAttributeValueTranslation(index, valueIndex, e.target.value)}
                                                            className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            {quickAttributeDraft.type === 'image' ? (
                                                <div className="mt-4 space-y-2">
                                                    <label className="text-xs font-black uppercase text-slate-500">
                                                        {trans('hancms.catalog.attribute.fields.image')}
                                                    </label>
                                                    <label className="group flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white transition hover:border-indigo-400 hover:bg-indigo-50/40">
                                                        <input
                                                            className="sr-only"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => updateQuickAttributeValueImage(valueIndex, e.target.files?.[0] ?? null)}
                                                        />
                                                        {isQuickAttributeImageUploading ? (
                                                            <RefreshCw className="h-6 w-6 animate-spin text-indigo-500" />
                                                        ) : value.image_url ? (
                                                            <img
                                                                src={value.image_url}
                                                                alt={trans('hancms.catalog.attribute.fields.image')}
                                                                className="h-full w-full object-contain p-1"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-slate-400 transition group-hover:text-slate-700">
                                                                <Plus className="h-6 w-6" />
                                                            </div>
                                                        )}
                                                    </label>
                                                    {quickAttributeErrors[`values.${valueIndex}.image`] && (
                                                        <MessageError>{quickAttributeErrors[`values.${valueIndex}.image`]}</MessageError>
                                                    )}
                                                </div>
                                            ) : null}

                                            {quickAttributeDraft.type === 'color' ? (
                                                <div className="mt-4 space-y-2">
                                                    <label className="text-xs font-black uppercase text-slate-500">
                                                        {trans('hancms.catalog.attribute.fields.color')}
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="color"
                                                            value={value.color || '#000000'}
                                                            onChange={(e) => setQuickAttributeDraft((current) => {
                                                                const values = current.values.slice();
                                                                values[valueIndex] = { ...values[valueIndex], color: e.target.value };
                                                                return { ...current, values };
                                                            })}
                                                            className="h-11 w-14 rounded-lg border border-slate-300 p-1"
                                                        />
                                                        <span className="text-sm text-slate-600">{value.color || '#000000'}</span>
                                                    </div>
                                                    {quickAttributeErrors[`values.${valueIndex}.color`] && (
                                                        <MessageError>{quickAttributeErrors[`values.${valueIndex}.color`]}</MessageError>
                                                    )}
                                                </div>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 px-5 py-4">
                            <button
                                type="button"
                                onClick={closeQuickAttributeModal}
                                className="rounded-md border border-slate-300 px-4 py-3 text-xs font-black uppercase text-slate-600 transition hover:bg-slate-50"
                            >
                                {trans('hancms.button.cancel') || 'Cancel'}
                            </button>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    submitQuickAttribute();
                                }}
                                disabled={isQuickAttributeSubmitting}
                                className="rounded-md bg-slate-900 px-4 py-3 text-xs font-black uppercase text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                            >
                                {isQuickAttributeSubmitting ? (trans('hancms.loading') || 'Saving...') : (trans('hancms.button.save') || 'Save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductFormView;

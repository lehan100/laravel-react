import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { Globe, Plus, RefreshCw, Save, Search, Sparkles, Trash2, X } from 'lucide-react';
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
    const [basePriceInput, setBasePriceInput] = useState(() => formatPriceInput(data.base_price ?? data.price, priceCurrency));
    const [selectedValueIdsByAttribute, setSelectedValueIdsByAttribute] = useState<Record<string, number[]>>(() => {
        const selected: Record<string, number[]> = {};
        const variants = Array.isArray(data.variants) ? data.variants : [];

        variants.forEach((variant: any) => {
            (variant.attribute_value_ids || []).forEach((valueId: any) => {
                const attribute = attributes.find((attr: any) =>
                    (attr.values || []).some((value: any) => Number(value.id) === Number(valueId))
                );

                if (!attribute) return;

                const key = String(attribute.id);
                selected[key] = Array.from(new Set([...(selected[key] || []), Number(valueId)]));
            });
        });

        return selected;
    });
    const [aiSuggestingLocale, setAiSuggestingLocale] = useState<string | null>(null);
    const [aiSuggestionError, setAiSuggestionError] = useState('');
    const [aiSeoSuggestingLocale, setAiSeoSuggestingLocale] = useState<string | null>(null);
    const [aiSeoSuggestionError, setAiSeoSuggestionError] = useState('');
    const selectedCategoryIds = Array.isArray(data.category_ids) ? data.category_ids : [];
    const selectedFiles = Array.isArray(data.photos) ? data.photos : [];
    const defaultPhotoId = data.default_photo_id ?? item?.default_photo_id ?? existingPhotos.find((photo: any) => photo.is_default)?.id ?? null;

    useEffect(() => {
        setData('photo_orders', existingPhotos.map((photo: any) => photo.id));
    }, [existingPhotos]);

    useEffect(() => {
        setPriceInput(formatPriceInput(data.price, priceCurrency));
        setBasePriceInput(formatPriceInput(data.base_price ?? data.price, priceCurrency));
    }, [priceCurrency.code]);

    const getVariantKey = (attributeValueIds: any[]) => attributeValueIds
        .map((id) => Number(id))
        .sort((a, b) => a - b)
        .join('-');

    const buildCombinations = (groups: number[][]): number[][] => {
        if (groups.length === 0) return [];

        return groups.reduce<number[][]>((result, group) => {
            if (result.length === 0) {
                return group.map((id) => [id]);
            }

            return result.flatMap((combination) => group.map((id) => [...combination, id]));
        }, []);
    };

    const toggleAttributeValue = (attributeId: number, valueId: number) => {
        setSelectedValueIdsByAttribute((prev) => {
            const key = String(attributeId);
            const current = prev[key] || [];
            const nextValues = current.includes(valueId)
                ? current.filter((id) => id !== valueId)
                : [...current, valueId];

            return {
                ...prev,
                [key]: nextValues,
            };
        });
    };

    const generateVariantRows = () => {
        const groups = attributes
            .map((attribute: any) => selectedValueIdsByAttribute[String(attribute.id)] || [])
            .filter((values: number[]) => values.length > 0);
        const combinations = buildCombinations(groups);
        const existingVariants = Array.isArray(data.variants) ? data.variants : [];
        const existingByKey = new Map(existingVariants.map((variant: any) => [
            getVariantKey(variant.attribute_value_ids || []),
            variant,
        ]));
        const baseSku = String(data.sku || 'VAR').trim() || 'VAR';

        setData('variants', combinations.map((attributeValueIds) => {
            const key = getVariantKey(attributeValueIds);
            const existing = existingByKey.get(key);

            if (existing) {
                return existing;
            }

            return {
                sku: `${baseSku}-${key}`,
                price: data.base_price || data.price || 0,
                stock: 0,
                image: '',
                image_url: '',
                images: [],
                image_urls: [],
                attribute_value_ids: attributeValueIds,
            };
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
        setVariantDraft({ ...(variants[index] || {}) });
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
        for (const attribute of attributes) {
            const value = (attribute.values || []).find((item: any) => Number(item.id) === Number(valueId));
            if (value) {
                return `${attribute.name}: ${value.value}`;
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
                <div className="grid gap-4 md:grid-cols-2">
                    <InputGroup label={trans('hancms.column.sku')}>
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
                            onChange={(e) => setData('quantity', e.target.value)}
                        />
                        {errors?.quantity && <MessageError>{errors.quantity}</MessageError>}
                    </InputGroup>
                    <InputGroup label={trans('hancms.column.brand') || 'Brand'}>
                        <input
                            type="text"
                            className={inputClass('brand')}
                            value={data.brand || ''}
                            onChange={(e) => setData('brand', e.target.value)}
                        />
                        {errors?.brand && <MessageError>{errors.brand}</MessageError>}
                    </InputGroup>
                    <InputGroup label={trans('hancms.catalog.product.fields.base_price') || 'Base price'}>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-semibold text-slate-500">
                                {priceSymbol}
                            </span>
                            <input
                                type="text"
                                inputMode={priceCurrency.code === 'VND' || priceCurrency.code === 'JPY' || priceCurrency.code === 'KRW' ? 'numeric' : 'decimal'}
                                className={`${inputClass('base_price')} pl-8`}
                                value={basePriceInput}
                                onChange={(e) => {
                                    setBasePriceInput(e.target.value);
                                    setData('base_price', e.target.value);
                                }}
                                onBlur={() => {
                                    const formatted = formatPriceInput(basePriceInput, priceCurrency);
                                    setBasePriceInput(formatted);
                                    setData('base_price', formatted);
                                }}
                            />
                        </div>
                        {errors?.base_price && <MessageError>{errors.base_price}</MessageError>}
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
        return (
            <div className="space-y-6">
                <div className="flex flex-wrap gap-3 overflow-x-auto border-b border-slate-200 pb-6">
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

                <div className="border-t border-slate-200 pt-6">
                    <div className="grid gap-6">
                        <InputGroup label={trans('hancms.column.name')}>
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
                                    {isSlugLocked ? 'LOCK' : 'EDIT'}
                                </button>
                            </div>
                            {slugError && <MessageError>{slugError}</MessageError>}
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
                            {aiSeoSuggestionError && <MessageError>{aiSeoSuggestionError}</MessageError>}

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
                            onClick={generateVariantRows}
                            disabled={attributes.length === 0}
                            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-3 text-xs font-black uppercase text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            <RefreshCw size={15} />
                            {trans('hancms.catalog.product.variants.generate') || 'Generate variants'}
                        </button>
                    </div>

                    {attributes.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500">
                            {trans('hancms.catalog.product.variants.empty_attributes') || 'Create product attributes and values before generating variants.'}
                        </div>
                    ) : (
                        <div className="grid gap-4 lg:grid-cols-2">
                            {attributes.map((attribute: any) => {
                                const selectedValues = selectedValueIdsByAttribute[String(attribute.id)] || [];

                                return (
                                    <div key={attribute.id} className="rounded-xl border border-slate-200 bg-white p-4">
                                        <div className="mb-3 flex items-center justify-between gap-3">
                                            <div className="text-sm font-bold text-slate-800">{attribute.name}</div>
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
                                                        {value.value}
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
                                    sku: data.sku ? `${data.sku}-${variants.length + 1}` : '',
                                    price: data.base_price || data.price || 0,
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
                            <table className="min-w-[980px] w-full text-left text-sm">
                                <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">{trans('hancms.column.attributes') || 'Attributes'}</th>
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
                            {['general', 'content', 'photos', 'variants'].map((id) => {
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

                        <div className="grid gap-6 px-5 py-5 md:grid-cols-[160px_1fr]">
                            <div className="space-y-3">
                                <div className="text-xs font-black uppercase text-slate-500">
                                    {trans('hancms.catalog.product.variants.images') || 'Variant images'}
                                </div>

                                <input
                                    id={`variant-images-${editingVariantIndex}`}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleVariantImageChange}
                                />
                                <label
                                    htmlFor={`variant-images-${editingVariantIndex}`}
                                    className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center transition hover:border-indigo-400 hover:bg-indigo-50"
                                >
                                    {variantImageUploading ? (
                                        <RefreshCw className="h-7 w-7 animate-spin text-indigo-500" />
                                    ) : (
                                        <>
                                            <Plus className="h-7 w-7 text-slate-400" />
                                            <span className="mt-2 text-xs font-black uppercase text-slate-600">
                                                {trans('hancms.catalog.product.variants.upload_images') || 'Upload images'}
                                            </span>
                                        </>
                                    )}
                                </label>

                                <div className="grid grid-cols-2 gap-3">
                                    {(variantDraft.images || []).map((image: string, imageIndex: number) => (
                                        <div key={`${image}-${imageIndex}`} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                            <img
                                                src={getVariantImagePreviewUrl(variantDraft, image, imageIndex)}
                                                alt={image}
                                                className="h-full w-full object-cover"
                                            />
                                            {imageIndex === 0 && (
                                                <span className="absolute left-2 top-2 rounded-full bg-emerald-600 px-2 py-1 text-[10px] font-black uppercase text-white">
                                                    {trans('hancms.default')}
                                                </span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removeVariantDraftImage(imageIndex)}
                                                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white opacity-0 transition group-hover:opacity-100"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
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

                            <div className="grid gap-4 md:grid-cols-2">
                                <InputGroup label={trans('hancms.column.sku')}>
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

                                <InputGroup label={trans('hancms.column.price')}>
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

                                <InputGroup label={trans('hancms.column.stock') || 'Stock'}>
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

                                <InputGroup label={trans('hancms.column.image') || 'Representative image'}>
                                    <select
                                        className={inputClass(`variants.${editingVariantIndex}.image`)}
                                        value={variantDraft.image || ''}
                                        onChange={(e) => setVariantDraft((prev: any) => ({
                                            ...(prev || {}),
                                            image: e.target.value,
                                            image_url: getVariantImagePreviewUrl(prev, e.target.value, (prev?.images || []).indexOf(e.target.value)),
                                        }))}
                                    >
                                        <option value="">{trans('hancms.placeholder.select')}</option>
                                        {(variantDraft.images || []).map((image: string) => (
                                            <option key={image} value={image}>{image}</option>
                                        ))}
                                    </select>
                                    {errors?.[`variants.${editingVariantIndex}.image`] && (
                                        <MessageError>{errors[`variants.${editingVariantIndex}.image`]}</MessageError>
                                    )}
                                </InputGroup>
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
        </div>
    );
};

export default ProductFormView;

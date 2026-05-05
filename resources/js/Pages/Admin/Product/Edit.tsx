import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import ProductFormView from './Components/ProductFormView';
import { buildInitialTranslations, convertPriceToBase, convertPriceToDisplay, formatPriceInput, getLanguageByLocale, getLocaleCode, getProductCurrencyFromLocale } from './productUtils';

function EditPage() {
    const { trans } = useTrans();
    const { langs, item, itemsCategoryActive, locale, attributes }: any = usePage().props;
    const currentLocale = getLocaleCode(locale);
    const langList = langs?.data || (Array.isArray(langs) ? langs : Object.values(langs || {}));
    const initialTranslations = buildInitialTranslations(langList, item);
    const defaultPhotoId = item?.photos?.find((photo: any) => photo.is_default)?.id ?? null;
    const currentLanguage = getLanguageByLocale(langList, currentLocale);
    const productCurrency = getProductCurrencyFromLocale(currentLocale, currentLanguage);

    const form = useForm({
        sku: item?.sku || '',
        quantity: item?.quantity ?? 0,
        weight: item?.weight ?? 0,
        brand: item?.brand || '',
        base_price: formatPriceInput(convertPriceToDisplay(item?.base_price ?? item?.price ?? 0, productCurrency), productCurrency),
        price: formatPriceInput(convertPriceToDisplay(item?.price ?? 0, productCurrency), productCurrency),
        status: item?.status ?? 0,
        is_stock: item?.is_stock ? 1 : 0,
        is_coupon: item?.is_coupon ? 1 : 0,
        order: item?.order ?? 0,
        undo: 0,
        category_ids: item?.category_ids || [],
        default_photo_id: defaultPhotoId,
        delete_photo_ids: [],
        photos: [],
        variants: Array.isArray(item?.variants)
            ? item.variants.map((variant: any) => ({
                id: variant.id,
                sku: variant.sku || '',
                price: formatPriceInput(convertPriceToDisplay(variant.price ?? 0, productCurrency), productCurrency),
                stock: variant.stock ?? 0,
                image: variant.image || '',
                image_url: variant.image_url || '',
                images: variant.images || (variant.image ? [variant.image] : []),
                image_urls: variant.image_urls || (variant.image_url ? [variant.image_url] : []),
                attribute_value_ids: variant.attribute_value_ids || [],
            }))
            : [],
        translations: initialTranslations,
    });
    form.transform((payload: any) => ({
        ...payload,
        base_price: convertPriceToBase(payload.base_price, productCurrency),
        price: convertPriceToBase(payload.price, productCurrency),
        variants: Array.isArray(payload.variants)
            ? payload.variants.map((variant: any) => ({
                ...variant,
                price: convertPriceToBase(variant.price, productCurrency),
            }))
            : [],
    }));
    const { data, setData, errors, put, processing } = form;
    const [undo, setUndo] = useState(0);

    const handleUndo = (status: number) => {
        setUndo(status);
        setData('undo', status);
    };

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(route('product.update', item.id), {
            forceFormData: true,
        });
    }

    return (
        <ProductFormView
            title={trans('hancms.catalog.product.name')}
            backHref={route('product.index')}
            submitLabel={trans('hancms.button.save')}
            item={item}
            data={data}
            setData={setData}
            errors={errors}
            trans={trans}
            langList={langList}
            langCode={locale}
            itemsCategoryActive={itemsCategoryActive || []}
            attributes={attributes || []}
            onSubmit={handleSubmit}
            processing={processing}
            undo={undo}
            handleUndo={handleUndo}
        />
    );
}

EditPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.catalog.product.edit" children={page} />
);

export default EditPage;

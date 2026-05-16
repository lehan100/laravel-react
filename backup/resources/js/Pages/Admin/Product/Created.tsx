import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import ProductFormView from './Components/ProductFormView';
import { buildInitialTranslations, convertPriceToBase, convertPriceToDisplay, formatPriceInput, getLanguageByLocale, getLocaleCode, getProductCurrencyFromLocale } from './productUtils';

function CreatedPage() {
    const { trans } = useTrans();
    const { langs, itemsCategoryActive, item, locale, attributes }: any = usePage().props;
    const currentLocale = getLocaleCode(locale);
    const langList = langs?.data || (Array.isArray(langs) ? langs : Object.values(langs || {}));
    const initialTranslations = buildInitialTranslations(langList, item);
    const defaultPhotoId = item?.photos?.find((photo: any) => photo.is_default)?.id ?? null;
    const currentLanguage = getLanguageByLocale(langList, currentLocale);
    const productCurrency = getProductCurrencyFromLocale(currentLocale, currentLanguage);

    const form = useForm({
        sku: '',
        quantity: 0,
        weight: 0,
        price: formatPriceInput(convertPriceToDisplay(0, productCurrency), productCurrency),
        status: 0,
        is_stock: 0,
        is_coupon: 0,
        order: 0,
        undo: 0,
        category_ids: item?.category_ids || [],
        default_photo_id: defaultPhotoId,
        delete_photo_ids: [],
        photos: [],
        variants: [],
        attribute_value_ids: [],
        translations: initialTranslations,
    });

    form.transform((payload: any) => ({
        ...payload,
        price: convertPriceToBase(payload.price, productCurrency),
        variants: Array.isArray(payload.variants)
            ? payload.variants.map((variant: any) => ({
                ...variant,
                price: convertPriceToBase(variant.price, productCurrency),
            }))
            : [],
    }));
    const { data, setData, errors, post, processing } = form;
    const [undo, setUndo] = useState(0);

    const handleUndo = (status: number) => {
        setUndo(status);
        setData('undo', status);
    };

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('product.store'), {
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

CreatedPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.catalog.product.created" children={page} />
);

export default CreatedPage;

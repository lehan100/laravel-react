import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import ProductFormView from './Components/ProductFormView';
import { buildInitialTranslations, convertPriceToBase, convertPriceToDisplay, formatPriceInput, getLanguageByLocale, getLocaleCode, getProductCurrencyFromLocale } from './productUtils';

function EditPage() {
    const { trans } = useTrans();
    const { langs, item, itemsCategoryActive, locale }: any = usePage().props;
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
        translations: initialTranslations,
    });
    form.transform((payload: any) => ({
        ...payload,
        price: convertPriceToBase(payload.price, productCurrency),
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

import MainLayout from "@/Layouts/MainLayout";
import { usePage } from "@inertiajs/react";
import { Language } from '@/types';
import { useTrans } from '@/Hooks/useTrans';
function IndexPage() {
    const { lang, labels } = usePage<{
        lang: Language;

    }>().props;
    return (
        <h1>label Page</h1>
    )
}
IndexPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.label.name" children={page} />
);

export default IndexPage;
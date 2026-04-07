import MainLayout from "@/Layouts/MainLayout";

function IndexPage() {
    return (
        <h1>Product Page</h1>
    )
}

IndexPage.layout = (page: React.ReactNode) => <MainLayout title='hancms.catalog.product.name' children={page} />
export default IndexPage;
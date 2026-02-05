import { Link, usePage, useForm, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Language, PaginatedData } from '@/types';
import { useTrans } from '@/Hooks/useTrans';
import { useMemo } from 'react';
import { Badge, Row, Col, Card, Image } from 'react-bootstrap';
import Pagination from '@/Components/Pagination/Pagination';
import TableView from '@/Components/Table/TableViewAll';
import DeleteButton from '@/Components/Button/DeleteButtonView';
import EditButton from '@/Components/Button/EditButtonView';
import { PlusCircle } from 'lucide-react';
function IndexPage() {
    const { trans } = useTrans();
    const { data, setData, errors, post, processing } = useForm({
        data_ids: ''
    });
    const { items, config_path }: any = usePage<{ items: PaginatedData<Language>; }>().props;
    const { meta: { links } }: any = items;
    const statusClass: any = {
        '0': {
            'bg': 'danger',
            'text': trans('hancms.status.inactive')
        },
        '1': {
            'bg': 'success',
            'text': trans('hancms.status.active')
        }
    };
    const columns = useMemo(
        () => [
            {
                label: 'ID',
                name: 'id'
            },
            {
                label: trans('hancms.column.image'),
                name: 'photo',
                renderCell: (row: any) => (
                    row.photo && <Image src={'/' + config_path.path + "/" + row.photo} width={40} />
                )
            },
            {
                label: trans('hancms.column.name'),
                name: 'name',
            },

            {
                label: trans('hancms.column.code'),
                name: 'code'
            },
            {
                label: trans('hancms.column.status'),
                name: 'status',
                renderCell: (row: any) => (
                    <Badge className='fw-normal' bg={statusClass[row.status]['bg']}>{statusClass[row.status]['text']}</Badge>
                )
            },
            {
                label: trans('hancms.column.action'),
                name: 'action',
                renderCell: (row: any) => (
                    <>
                        <div className="d-flex gap-2">
                            <EditButton href={route('languages.edit', row.id)} className='btn btn-warning btn-sm text-white'>
                                {trans('hancms.button.edit')}
                            </EditButton>
                            <DeleteButton className='btn btn-danger btn-sm' size={14} onDelete={() => destroy(row.id)}>
                                {trans('hancms.button.delete')}
                            </DeleteButton>
                        </div>

                    </>
                )
            },
        ],
        []
    );
    function destroy(id: any) {
        if (confirm(trans('hancms.message.destroy', { name: trans('hancms.languages.name').toLowerCase() }))) {
            router.delete(route('languages.destroy', id), {

                onSuccess: () => {

                }
            });
        }
    }
    function destroys() {
        if (confirm(trans('hancms.message.destroys'))) {
            let ids = data.data_ids;
            if (ids.length > 0) {
                router.delete(route('languages.destroyMany', { 'ids': data.data_ids }));
            }

        }
    }
    // Callback function to receive data
    const handleChildData = (data: any) => {
        setData('data_ids', data);
    };
    return (
        <div>
            <Row className="justify-content-center mb-4">
                <Col xs={12} md> <h1 className="text-3xl font-bold">{trans('hancms.languages.admin.name')}</h1></Col>
                <Col xs={12} md={'auto'}>
                    <div className="d-flex gap-2 align-items-center">
                        <Link
                            className="btn btn-success py-2"
                            href={route('languages.create')}
                        >
                            <div className="d-flex gap-2 align-items-center">
                                {<PlusCircle size={20} />}
                                {trans('hancms.button.created')}
                            </div>
                        </Link>
                        <DeleteButton className='btn btn-danger py-2' size={20} onDelete={() => destroys()}>
                            {trans('hancms.button.delete.selected')}
                        </DeleteButton>
                    </div>
                </Col>
            </Row>
            <Card>
                <TableView
                    columns={columns}
                    rows={items.data}
                    sendDataSelectItems={handleChildData}
                    getRowDetailsUrl={row => route('languages.edit', row.id)}
                />
                <Pagination links={links} />
            </Card>
        </div>
    );
}
IndexPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.languages.name" children={page} />
);

export default IndexPage;
import { usePage, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Save } from 'lucide-react';
import TableView from '@/Components/Table/TableView';
import SaveButton from '@/Components/Button/SaveButton';
import { Permissions, PaginatedData } from '@/types';
import Pagination from '@/Components/Pagination/Pagination';
import { useMemo } from "react";
import { useTrans } from '@/Hooks/useTrans';
import BackButton from '@/Components/Button/BackButton';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import Card from '@/Components/Main/Card';
function CreatedPage() {
    const { data, setData, post, errors, processing } = useForm({
        name: '',
        guard_name: 'web',
        undo: 0,
        permissions: ''

    });
    const { trans } = useTrans();
    const [validated, setValidated] = useState(false);

    const { permissions, rolePermissions } = usePage<{
        permissions: PaginatedData<Permissions>;
        rolePermissions: [];

    }>().props;

    const {
        meta: { links }
    } = permissions;
    const columns = useMemo(
        () => [
            {
                label: 'ID',
                name: 'id'
            },
            {
                label: trans('hancms.column.name'),
                name: 'name',
            },
            {
                label: trans('hancms.column.guard'),
                name: 'guard_name'
            },
        ],
        []
    );
    const [permissions_alert, setPermissions_alert] = useState(false);
    const handleSubmit = (event: any) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        setPermissions_alert(false);
        if (data.permissions == '') {
            setPermissions_alert(true);
        }
        if (form.checkValidity() === true && data.permissions != '') {
            setValidated(false);
            post(route('roles.store'));

        }
        setValidated(true);
    };
    // Callback function to receive data
    const handleChildData = (data: any) => {
        setData('permissions', data);
    };
    const [undo, setUndo] = useState(0);
    const handleUndo = (status: number) => {
        setUndo(status);
    }
    useEffect(() => {
        data.undo = undo;
    }, [data, undo]);
    return (
        <div className='content p-4'>
            <HeaderToolbar title={trans('hancms.roles.created')}>
                <SaveButton
                    loading={processing}
                    undo={0}
                    icon={<Save size={18} />}
                    sendDataStatusUndo={handleUndo}
                    form='my-form'
                >
                    {trans('hancms.button.save')}
                </SaveButton>
                <BackButton href={route('roles.index')} className="text-sm px-3 py-1.5">
                    {trans('hancms.button.back')}
                </BackButton>
            </HeaderToolbar>
            <form id='my-form' onSubmit={handleSubmit} noValidate>
                <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <label htmlFor="form_name" className="block text-sm font-semibold text-gray-600 min-w-[180px]">
                            {trans('hancms.column.name')} {trans('hancms.roles.name')}
                        </label>
                        <div className="flex-1">
                            <input
                                className={`block w-full px-3 py-2 text-sm border rounded-md shadow-sm 
            ${(errors?.name || (validated && !data.name))
                                        ? 'border-red-500 ring-1 ring-red-500'
                                        : 'border-gray-300'}`}
                                placeholder={trans('hancms.column.name')}
                                onChange={e => setData('name', e.target.value)}
                            />

                            {(errors?.name || (validated && !data.name)) && (
                                <p className="mt-2 text-[12px] text-red-600 italic">
                                    {trans('hancms.message.error.required', { name: trans('hancms.column.name') })}
                                </p>
                            )}
                        </div>
                    </div>
                    <input type="hidden" value={undo} onChange={e => setData('undo', undo)} />
                </div>
                {permissions_alert && (
                    <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md">
                        <h4 className="text-sm font-bold mb-2">{trans('hancms.assign_permissions.error')}</h4>
                        <p className="text-xs">{trans('hancms.assign_permissions.error.message')}</p>
                    </div>
                )}
                <Card title={trans('hancms.assign_permissions.name')}>
                    <div className="p-4">
                        <TableView
                            columns={columns}
                            rows={permissions.data}
                            sendDataSelectItems={handleChildData}
                            rolePermissions={rolePermissions}
                        />
                        <Pagination links={links} />
                    </div>
                </Card>
            </form>
        </div>
    );
}
CreatedPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.roles.created" children={page} />
);

export default CreatedPage;
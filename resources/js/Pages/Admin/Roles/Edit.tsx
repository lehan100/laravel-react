import { Link, usePage, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Save, Undo } from 'lucide-react';
import TableView from '@/Components/Table/TableView';
import SaveButton from '@/Components/Button/SaveButton';
import { Permissions, Roles, PaginatedData } from '@/types';
import Pagination from '@/Components/Pagination/Pagination';
import { useMemo } from "react";
import { useTrans } from '@/Hooks/useTrans';
import BackButton from '@/Components/Button/BackButton';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import Card from '@/Components/Main/Card';
function CreateRolesPage() {
    const { permissions, role, rolePermissions } = usePage<{
        permissions: PaginatedData<Permissions>;
        role: Roles;
        rolePermissions: any;
    }>().props;
    const { trans } = useTrans();
    const { data, setData, put, errors, processing } = useForm({
        name: role.name || '',
        guard_name: role.guard_name || 'web',
        undo: 0,
        permissions: rolePermissions.join(",")
    });

    const [validated, setValidated] = useState(false);

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
            put(route('roles.update', role.id));

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
        <div className='content p-4 text-sm'>
            <HeaderToolbar title={<>{trans('hancms.roles.name')} / <span className='text-blue-600'>{data.name}</span></>}>
                <SaveButton
                    loading={processing}
                    undo={0}
                    icon={<Save size={18} />}
                    sendDataStatusUndo={handleUndo}
                    form='my-form'
                >
                    {trans('hancms.button.save')}
                </SaveButton>
                <BackButton href={route('roles.index')}>
                    {trans('hancms.button.back')}
                </BackButton>
            </HeaderToolbar>
            <form id='my-form' onSubmit={handleSubmit} noValidate>
                {/* Info Box (Thay cho alert-info) */}
                <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <label htmlFor="form_name" className="block text-sm font-semibold text-gray-700 min-w-[150px] capitalize">
                            {trans('hancms.column.name')} {trans('hancms.roles.name')}
                        </label>

                        <div className="flex-1">
                            <input
                                id="form_name"
                                type="text"
                                placeholder={trans('hancms.column.name')}
                                value={data.name}
                                required
                                onChange={e => setData('name', e.target.value)}
                                className={`block w-full px-3 py-2 text-sm border rounded-md shadow-sm outline-none transition-all
                                    ${(errors.name || (validated && !data.name))
                                        ? 'border-red-500 ring-1 ring-red-500 bg-red-50'
                                        : 'border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                                    }`}
                            />

                            {/* TIN NHẮN LỖI HIỆN Ở ĐÂY */}
                            {(errors.name || (validated && !data.name)) && (
                                <p className="mt-1 text-[11px] text-red-600 font-medium italic italic">
                                    {trans('hancms.message.error.required', { name: trans('hancms.column.name') })}
                                </p>
                            )}
                        </div>
                    </div>
                    <input type="hidden" value={undo} onChange={e => setData('undo', undo)} />
                </div>

                {/* Alert Error Permissions */}
                {permissions_alert && (
                    <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded shadow-sm">
                        <h4 className="text-sm font-bold uppercase">{trans('hancms.assign_permissions.error')}</h4>
                        <p className="text-xs mt-1">{trans('hancms.assign_permissions.error.message')}</p>
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
CreateRolesPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.roles.edit" children={page} />
);

export default CreateRolesPage;
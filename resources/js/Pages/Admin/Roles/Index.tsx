import { usePage, useForm, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Eye } from 'lucide-react';
import { Roles, PaginatedData } from '@/types';
import Pagination from '@/Components/Pagination/Pagination';
import TableView from '@/Components/Table/TableViewAll';
import DeleteButtonView from '@/Components/Button/DeleteButtonView';
import DeleteButton from '@/Components/Button/DeleteButton';
import EditButton from '@/Components/Button/EditButtonView';
import CreatedButton from '@/Components/Button/CreatedButton';
import ModalTable from '@/Components/Modal/Modal';
import LoadingSpiner from '@/Components/Loading/LoadingSpinner';
import { useEffect, useMemo, useState } from "react";
import axios from 'axios';
import { useTrans } from '@/Hooks/useTrans';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import Card from '@/Components/Main/Card';

function RolesPage() {
  const { data, setData, errors, post, processing } = useForm({
    name: '',
    role_ids: ''
  });
  const { roles } = usePage<{ roles: PaginatedData<Roles>; }>().props;
  const { meta: { links } } = roles;
  const { trans } = useTrans();
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
        name: 'guard_name',
        renderCell: (row: any) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">{row.guard_name}</span>
        )
      },
      {
        label: trans('hancms.column.action'),
        name: 'action',
        renderCell: (row: any) => (
          <>
            <div className="flex gap-2">
              <EditButton href={route('roles.edit', row.id)}>
                {trans('hancms.button.edit')}
              </EditButton>
              <DeleteButtonView size_icon={14} onDelete={() => destroy(row.id)}>
                {trans('hancms.button.delete')}
              </DeleteButtonView>
              <button
                type="button"
                onClick={() => handleShow(row.id)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium rounded shadow-sm transition-all duration-200 active:scale-95 focus:outline-none"
              >
                <Eye size={14} className="flex-shrink-0" />
                <span>{trans('hancms.button.view')}</span>
              </button>
            </div>

          </>
        )
      },
    ],
    []
  );
  const [modalShow, setModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData]: any = useState(null);
  const handleShow = (id: number) => {
    setIsLoading(true);
    setModalTitle("Loading....");
    axios.get(route('roles.permissions', id))
      .then(res => {
        setIsLoading(false);
        setModalData(res.data.role);
        setModalShow(true);
      })
      .catch(error => console.log(error));
  }
  function destroy(id: any) {
    if (confirm(trans('hancms.message.destroy', { name: trans('hancms.roles.name').toLowerCase() }))) {
      router.delete(route('roles.destroy', id), {

        onSuccess: () => {
          //router.get(route(route().current() as string));
        }
      });
    }
  }
  function destroys() {
    if (confirm(trans('hancms.message.destroys'))) {
      let ids = data.role_ids.split(",");
      if (ids.length > 0) {
        router.delete(route('roles.destroy-many', { 'ids': data.role_ids }));
      }

    }
  }
  // Callback function to receive data
  const handleChildData = (data: any) => {
    setData('role_ids', data);
  };
  useEffect(() => {
    if (modalData !== undefined && modalData != null) {
      setModalTitle(modalData.name + ' / ' + trans('hancms.permissions'));
    }
  });
  return (
    <div>
      <HeaderToolbar title={trans('hancms.roles.name')}>
        <CreatedButton
          href={route("roles.create")}
          className="px-3 py-1.5 text-sm font-medium transition-all active:scale-95 shadow-sm"
        >
          {trans('hancms.button.created')}
        </CreatedButton>
        <DeleteButton
          onDelete={() => destroys()}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm active:scale-95 border-none"
          size={18}
        >
          {trans('hancms.button.delete_selected')}
        </DeleteButton>
      </HeaderToolbar>
      <Card>
        <div className="overflow-x-auto">
          <TableView
            columns={columns}
            rows={roles.data}
            sendDataSelectItems={handleChildData}
            getRowDetailsUrl={row => route('roles.edit', row.id)}
          />
        </div>
        <Pagination links={links} />
      </Card>
      <ModalTable show={modalShow} onHide={() => setModalShow(false)} title={modalTitle}>
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-[0_14px_40px_-30px_rgba(15,23,42,0.38)]">
          <table className="min-w-full whitespace-nowrap text-sm text-left">
            <thead className="bg-slate-950 text-white">
              <tr>
                <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">#</th>
                <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">{trans('hancms.column.name')}</th>
                <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">{trans('hancms.column.guard')}</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {modalData?.permissions?.length > 0 ? (
                modalData.permissions.map((item: any, index: any) => (
                  <tr key={item.id} className="border-t border-slate-200/80 odd:bg-white even:bg-slate-50/60 transition-colors hover:bg-cyan-50/50 duration-150">
                    <td className="px-4 py-3 font-medium text-slate-600">{item?.id}</td>
                    <td className="px-4 py-3 text-slate-800">{item?.name}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-cyan-700">
                        {item?.guard_name}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-500">
                      <span className="text-sm font-medium">Không có dữ liệu để hiển thị.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ModalTable>

      <LoadingSpiner isLoading={isLoading} variant='warning'></LoadingSpiner>
    </div>
  );
}
RolesPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.roles.name" children={page} />
);

export default RolesPage;

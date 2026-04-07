import { Link, usePage, useForm, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { PlusCircle } from 'lucide-react';
import { User, PaginatedData } from '@/types';
import Pagination from '@/Components/Pagination/Pagination';
import TableView from '@/Components/Table/TableViewAll';
import DeleteButton from '@/Components/Button/DeleteButton';
import DeleteButtonView from '@/Components/Button/DeleteButtonView';
import EditButton from '@/Components/Button/EditButtonView';
import CreatedButton from '@/Components/Button/CreatedButton';
import { useEffect, useMemo, useState } from "react";
import FilterBar from '@/Components/FilterBar/FilterBar';
import { useTrans } from '@/Hooks/useTrans';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import Card from '@/Components/Main/Card';
import StatusBadge from '@/Components/Status/StatusBadge';
function UsersPage() {
  const { trans } = useTrans();
  const { data, setData, errors, post, processing } = useForm({
    name: '',
    user_ids: ''
  });
  const { items } = usePage<{ items: PaginatedData<User>; }>().props;

  const { meta: { links } }: any = items;
  const groupBadge: Record<string, { className: string; text: string }> = {
    '0': {
      className: 'border border-slate-200 bg-slate-100 text-slate-600',
      text: 'Not Access'
    },
    '1': {
      className: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
      text: 'Administrators'
    },
    '2': {
      className: 'border border-amber-200 bg-amber-50 text-amber-700',
      text: 'Admin'
    },
    '3': {
      className: 'border border-orange-200 bg-orange-50 text-orange-700',
      text: 'Moderator'
    },
    '4': {
      className: 'border border-cyan-200 bg-cyan-50 text-cyan-700',
      text: 'Api'
    }
  };
  const columns = useMemo(
    () => [
      {
        label: 'ID',
        name: 'id'
      },
      {
        label: trans('hancms.column.first_name'),
        name: 'first_name',
      },

      {
        label: trans('hancms.column.last_name'),
        name: 'last_name'
      },
      {
        label: trans('hancms.column.email'),
        name: 'email'
      },
      {
        label: trans('hancms.column.status'),
        name: 'status',
        renderCell: (row: any) => (
          <StatusBadge
            value={row.status}
            activeLabel={trans('hancms.status.active')}
            inactiveLabel={trans('hancms.status.inactive')}
          />
        )
      },
      {
        label: trans('hancms.column.group'),
        name: 'group',
        renderCell: (row: any) => (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ring-1 ${groupBadge[row.group]?.className || 'border border-slate-200 bg-slate-100 text-slate-600'}`}
          >
            {groupBadge[row.group]?.text || row.group}
          </span>
        )
      },
      {
        label: trans('hancms.column.action'),
        name: 'action',
        renderCell: (row: any) => (
          <>
            <div className="flex gap-2">
              <EditButton href={route('users.edit', row.id)}>
                {trans('hancms.button.edit')}
              </EditButton>
              <DeleteButtonView size_icon={14} onDelete={() => destroy(row.id)}>
                {trans('hancms.button.delete')}
              </DeleteButtonView>
            </div>

          </>
        )
      },
    ],
    [trans]
  );
  function destroy(id: any) {
    if (confirm(trans('hancms.message.destroy', { name: trans('hancms.users.name').toLowerCase() }))) {
      router.delete(route('users.destroy', id), {

        onSuccess: () => {

        }
      });
    }
  }
  function destroys() {
    if (confirm(trans('hancms.message.destroys'))) {
      let ids = data.user_ids.split(",");
      if (ids.length > 0) {
        router.delete(route('users.destroy-many', { 'ids': data.user_ids }));
      }

    }
  }
  // Callback function to receive data
  const handleChildData = (data: any) => {
    setData('user_ids', data);
  };
  return (
    <div>
      <HeaderToolbar title={trans('hancms.users.admin.name')}>
        <CreatedButton
          href={route("users.create")}
        >
          {trans('hancms.button.created')}
        </CreatedButton>

        <DeleteButton
          onDelete={() => destroys()}
          size={18}
        >
          {trans('hancms.button.delete.selected')}
        </DeleteButton>
      </HeaderToolbar>
      <FilterBar />
      <Card>
        <div className="overflow-x-auto">
          <TableView
            columns={columns}
            rows={items.data}
            sendDataSelectItems={handleChildData}
            getRowDetailsUrl={row => route('users.edit', row.id)}
          />
        </div>
        <Pagination links={links} />
      </Card>
    </div>
  );
}
UsersPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.users.name" children={page} />
);

export default UsersPage;

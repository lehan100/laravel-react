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
function UsersPage() {
  const { trans } = useTrans();
  const { data, setData, errors, post, processing } = useForm({
    name: '',
    user_ids: ''
  });
  const { items } = usePage<{ items: PaginatedData<User>; }>().props;

  const { meta: { links } }: any = items;
  const groupClass: any = {
    '0': {
      'bg': 'inline-flex items-center px-2 py-1 rounded text-[11px] font-medium bg-red-500 text-white',
      'text': 'Not Access'
    },
    '1': {
      'bg': 'inline-flex items-center px-2 py-1 rounded text-[11px] font-medium bg-green-500 text-white',
      'text': 'Administrators'
    },
    '2': {
      'bg': 'inline-flex items-center px-2 py-1 rounded text-[11px] font-medium bg-amber-500 text-white',
      'text': 'Admin'
    },
    '3': {
      'bg': 'inline-flex items-center px-2 py-1 rounded text-[11px] font-medium bg-orange-500 text-white',
      'text': 'Moderator'
    },
    '4': {
      'bg': 'inline-flex items-center px-2 py-1 rounded text-[11px] font-medium bg-blue-500 text-white',
      'text': 'Api'
    }
  };
  const statusClass: any = {
    '0': {
      'bg': 'inline-flex items-center px-2 py-1 rounded text-[11px] font-medium bg-red-500 text-white',
      'text': trans('hancms.status.inactive')
    },
    '1': {
      'bg': 'inline-flex items-center px-2 py-1 rounded text-[11px] font-medium bg-green-500 text-white',
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
          <span className={statusClass[row.status]['bg']}>{statusClass[row.status]['text']}</span >
        )
      },
      {
        label: trans('hancms.column.group'),
        name: 'group',
        renderCell: (row: any) => (
          <span className={groupClass[row.group]['bg']}>{groupClass[row.group]['text']}</span >
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
    []
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
import { Link, usePage, useForm, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { PlusCircle } from 'lucide-react';
import { Badge, Col, Row, Card } from 'react-bootstrap';
import { User, PaginatedData } from '@/types';
import Pagination from '@/Components/Pagination/Pagination';
import TableView from '@/Components/Table/TableViewAll';
import DeleteButton from '@/Components/Button/DeleteButtonView';
import EditButton from '@/Components/Button/EditButtonView';
import { useEffect, useMemo, useState } from "react";
import FilterBar from '@/Components/FilterBar/FilterBar';
import { useTrans } from '@/Hooks/useTrans';
function UsersPage() {
  const {trans} = useTrans();
  const { data, setData, errors, post, processing } = useForm({
    name: '',
    user_ids: ''
  });
  const { items } = usePage<{ items: PaginatedData<User>; }>().props;

  const { meta: { links } }: any = items;
  const groupClass: any = {
    '0': {
      'bg': 'danger',
      'text': 'Not Access'
    },
    '1': {
      'bg': 'success',
      'text': 'Administrators'
    },
    '2': {
      'bg': 'warning',
      'text': 'Admin'
    }
  };
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
        label: trans('hancms.column.first_name'),
        name: 'first_name',
      },

      {
        label: trans('hancms.column.last_name'),
        name: 'last_name'
      },
      {
        label: 'Email',
        name: 'email'
      },
      {
        label: trans('hancms.column.status'),
        name: 'status',
        renderCell: (row: any) => (
          <Badge className='fw-normal' bg={statusClass[row.status]['bg']}>{statusClass[row.status]['text']}</Badge>
        )
      },
      {
        label: 'Group',
        name: 'group',
        renderCell: (row: any) => (
          <Badge className='fw-normal' bg={groupClass[row.group]['bg']}>{groupClass[row.group]['text']}</Badge>
        )
      },
      {
        label: trans('hancms.column.action'),
        name: 'action',
        renderCell: (row: any) => (
          <>
            <div className="d-flex gap-2">
              <EditButton href={route('users.edit', row.id)} className='btn btn-warning btn-sm text-white'>
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
        router.delete(route('users.destroyMany', { 'ids': data.user_ids }));
      }

    }
  }
  // Callback function to receive data
  const handleChildData = (data: any) => {
    setData('user_ids', data);
  };
  return (
    <div>

      <Row className="justify-content-center mb-4">
        <Col xs={12} md> <h1 className="text-3xl font-bold">{trans('hancms.users.admin.name')}</h1></Col>
        <Col xs={12} md={'auto'}>
          <div className="d-flex gap-2 align-items-center">
            <Link
              className="btn btn-success py-2"
              href={route('users.create')}
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
      <FilterBar />
      <Card>
        <TableView
          columns={columns}
          rows={items.data}
          sendDataSelectItems={handleChildData}
          getRowDetailsUrl={row => route('roles.edit', row.id)}
        />
        <Pagination links={links} />
      </Card>
    </div>
  );
}
UsersPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.users.name" children={page} />
);

export default UsersPage;
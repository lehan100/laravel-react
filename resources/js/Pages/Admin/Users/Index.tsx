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
function UsersPage() {
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
      'text': 'Administrator'
    },
    '2': {
      'bg': 'warning',
      'text': 'Admin'
    }
  };
  const statusClass: any = {
    '0': {
      'bg': 'danger',
      'text': 'InActive'
    },
    '1': {
      'bg': 'success',
      'text': 'Active'
    }
  };
  const columns = useMemo(
    () => [
      {
        label: 'ID',
        name: 'id'
      },
      {
        label: 'First Name',
        name: 'first_name',
      },

      {
        label: 'Last Name',
        name: 'last_name'
      },
      {
        label: 'Email',
        name: 'email'
      },
      {
        label: 'Status',
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
        label: 'Action',
        name: 'action',
        renderCell: (row: any) => (
          <>
            <div className="d-flex gap-2">
              <EditButton href={route('users.edit', row.id)} className='btn btn-warning btn-sm text-white'>
                Edit
              </EditButton>
              <DeleteButton className='btn btn-danger btn-sm' size={14} onDelete={() => destroy(row.id)}>
                Delete
              </DeleteButton>
            </div>

          </>
        )
      },
    ],
    []
  );
  function destroy(id: any) {
    if (confirm('Are you sure you want to delete this role?')) {
      router.delete(route('users.destroy', id), {

        onSuccess: () => {

        }
      });
    }
  }
  function destroys() {
    if (confirm('Are you sure you want to delete this roles?')) {
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
        <Col xs={12} md> <h1 className="text-3xl font-bold">Users</h1></Col>
        <Col xs={12} md={'auto'}>
          <div className="d-flex gap-2 align-items-center">
            <Link
              className="btn btn-success py-2"
              href={route('users.create')}
            >
              <div className="d-flex gap-2 align-items-center">
                {<PlusCircle size={20} />}
                Created User
              </div>
            </Link>
            <DeleteButton className='btn btn-danger py-2' size={20} onDelete={() => destroys()}>
              Delete Items Selected
            </DeleteButton>
          </div>
        </Col>
      </Row>
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
  <MainLayout title="Users" children={page} />
);

export default UsersPage;
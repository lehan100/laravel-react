import { Link, usePage, useForm, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { PlusCircle, Eye } from 'lucide-react';
import { Row, Col, Card, Button, Table, Alert } from 'react-bootstrap';
import { Roles, PaginatedData } from '@/types';
import Pagination from '@/Components/Pagination/Pagination';
import TableView from '@/Components/Table/TableViewAll';
import DeleteButton from '@/Components/Button/DeleteButtonView';
import EditButton from '@/Components/Button/EditButtonView';
import ModalTable from '@/Components/Modal/Modal';
import LoadingSpiner from '@/Components/Loading/LoadingSpinner';
import { useEffect, useMemo, useState } from "react";
import axios from 'axios';
function RolesPage() {
  const { data, setData, errors, post, processing } = useForm({
    name: '',
    role_ids: ''
  });
  const { roles } = usePage<{ roles: PaginatedData<Roles>; }>().props;
  const { meta: { links } } = roles;

  const columns = useMemo(
    () => [
      {
        label: 'ID',
        name: 'id'
      },
      {
        label: 'Name',
        name: 'name',
      },
      {
        label: 'Guard',
        name: 'guard_name'
      },
      {
        label: 'Action',
        name: 'action',
        renderCell: (row: any) => (
          <>
            <div className="d-flex gap-2">
              <EditButton href={route('roles.edit', row.id)} className='btn btn-warning btn-sm text-white'>
                Edit
              </EditButton>
              <DeleteButton className='btn btn-danger btn-sm' size={14} onDelete={() => destroy(row.id)}>
                Delete
              </DeleteButton>
              <Button variant="primary" size='sm' onClick={() => handleShow(row.id)}>
                <div className="d-flex gap-2 align-items-center">
                  {<Eye size={14} />}
                  <span>View</span>
                </div>
              </Button>
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
    if (confirm('Are you sure you want to delete this role?')) {
      router.delete(route('roles.destroy', id), {

        onSuccess: () => {
          //router.get(route(route().current() as string));
        }
      });
    }
  }
  function destroys() {
    if (confirm('Are you sure you want to delete this roles?')) {
      let ids = data.role_ids.split(",");
      if (ids.length > 0) {
        router.delete(route('roles.destroyMany', { 'ids': data.role_ids }));
      }

    }
  }
  // Callback function to receive data
  const handleChildData = (data: any) => {
    setData('role_ids', data);
  };
  useEffect(() => {
    if (modalData !== undefined && modalData != null) {
      setModalTitle(modalData.name + ' / Permissions');
    }
  });
  return (
    <div>
      <Row className="justify-content-center mb-4">
        <Col xs={12} md> <h1 className="text-3xl font-bold">Roles</h1></Col>
        <Col xs={12} md={'auto'}>
          <div className="d-flex gap-2 align-items-center">
            <Link
              className="btn btn-success py-2"
              href={route('roles.create')}
            >
              <div className="d-flex gap-2 align-items-center">
                {<PlusCircle size={20} />}
                Created Roles
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
          rows={roles.data}
          sendDataSelectItems={handleChildData}
          getRowDetailsUrl={row => route('roles.edit', row.id)}
        />
        <Pagination links={links} />
      </Card>
      <ModalTable show={modalShow} onHide={() => setModalShow(false)} title={modalTitle} >
        <Table striped>
          <thead>
            <tr>
              <th className='py-3'>#</th>
              <th className='py-3'>Name</th>
              <th className='py-3' style={{ width: '10%' }}>Guard</th>
            </tr>
          </thead>
          <tbody>


            {modalData !== undefined && modalData != null ? (
              modalData.permissions.map((item: any, index: any) => (
                <tr key={item.id}>
                  <td className='py-3'> {item?.id}</td>
                  <td className='py-3'> {item?.name}</td>
                  <td className='py-3'> {item?.guard_name}</td>
                </tr>
                
              ))
            ) : (
              <tr>
                <td colSpan={3}><Alert variant='warning'> Không có dữ liệu để hiển thị.</Alert></td>
              </tr>
            )}
          </tbody>
        </Table>
      </ModalTable>
      <LoadingSpiner isLoading={isLoading} variant='warning'></LoadingSpiner>
    </div>
  );
}
RolesPage.layout = (page: React.ReactNode) => (
  <MainLayout title="Role" children={page} />
);

export default RolesPage;
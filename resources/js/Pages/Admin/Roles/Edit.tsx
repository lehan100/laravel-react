import { Link, usePage, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Save, Undo } from 'lucide-react';
import TableView from '@/Components/Table/TableView';
import SaveButton from '@/Components/Button/SaveButton';
import { Row, Col, Card, Form, Alert } from 'react-bootstrap';
import { Permissions, Roles, PaginatedData } from '@/types';
import Pagination from '@/Components/Pagination/Pagination';
import { useMemo } from "react";
import { useTrans } from '@/Hooks/useTrans';
function CreateRolesPage() {
    const { permissions, role, rolePermissions } = usePage<{
        permissions: PaginatedData<Permissions>;
        role: Roles;
        rolePermissions: any;
    }>().props;
    const { trans } = useTrans();
    const { data, setData, put, processing } = useForm({
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
        <div className='content'>
            <Row className="justify-content-center mb-4">
                <Col xs={12} md> <h1 className="text-3xl font-bold">{trans('hancms.roles.name')} / <span className='text-info'>{data.name}</span></h1></Col>
                <Col xs={12} md={'auto'}>
                    <div className="d-flex gap-2">
                        <SaveButton
                            children={trans('hancms.button.save')}
                            variant="success"
                            loading={processing}
                            undo={0}
                            icon={<Save size={20} />}
                            sendDataStatusUndo={handleUndo}
                            form='my-form'
                        />
                        <Link
                            className="btn btn-secondary py-2"
                            href={route('roles.index')}
                        >
                            <div className="d-flex gap-2 align-items-center">
                                {<Undo size={20} />}
                                <span>{trans('hancms.button.back')}</span>
                            </div>
                        </Link>
                    </div>
                </Col>
            </Row>
            <Form id='my-form' noValidate validated={validated} onSubmit={handleSubmit}>
                <div className="mb-3 alert alert-info p-3">
                    <Form.Group controlId="form_name">
                        <Form.Label column sm="auto" className='text-capitalize'>
                            {trans('hancms.column.name')} {trans('hancms.roles.name')}
                        </Form.Label>
                        <Col>
                            <Form.Control
                                type="text"
                                placeholder={trans('hancms.column.name')}
                                required
                                defaultValue={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                               {trans('hancms.message.error.required', { name: trans('hancms.column.name')})}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Control
                        type="hidden"
                        placeholder="undo"
                        defaultValue=''
                        onChange={e => setData('undo', undo)}
                    />
                </div>
                <Alert variant="danger" show={permissions_alert}>
                    <Alert.Heading>{trans('hancms.assign_permissions.error')}</Alert.Heading>
                    <p>
                        {trans('hancms.assign_permissions.error.message')}
                    </p>
                </Alert>
                <Card>
                    <Card.Header className='py-3 bg-indigo-800 text-white'>{trans('hancms.assign_permissions.name')}</Card.Header>
                    <Card.Body>
                        <TableView
                            columns={columns}
                            rows={permissions.data}
                            sendDataSelectItems={handleChildData}
                            rolePermissions={rolePermissions}
                        //getRowDetailsUrl={row => route('contacts.edit', row.id)}
                        />
                        <Pagination links={links} />
                    </Card.Body>
                </Card>
            </Form>
        </div>
    );
}
CreateRolesPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.roles.edit" children={page} />
);

export default CreateRolesPage;
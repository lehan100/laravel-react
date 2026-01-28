import { Link, usePage, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Save, Undo } from 'lucide-react';
import TableView from '@/Components/Table/TableView';
import SaveButton from '@/Components/Button/SaveButton';
import { Row, Col, Card, Form, Alert } from 'react-bootstrap';
import { Permissions, PaginatedData } from '@/types';
import Pagination from '@/Components/Pagination/Pagination';
import { useMemo } from "react";

function CreateRolesPage() {
    const { data, setData, post, processing } = useForm({
        name: '',
        guard_name: 'web',
        undo: 0,
        permissions: ''

    });
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
                label: 'Name',
                name: 'name',
            },
            {
                label: 'Guard',
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
        <div className='content'>
            <Row className="justify-content-center mb-4">
                <Col xs={12} md> <h1 className="text-3xl font-bold">Created Roles</h1></Col>
                <Col xs={12} md={'auto'}>
                    <div className="d-flex gap-2">
                        <SaveButton
                            children="Save Roles"
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
                                <span>Back</span>
                            </div>
                        </Link>
                    </div>
                </Col>
            </Row>
            <Form id='my-form' noValidate validated={validated} onSubmit={handleSubmit}>
                <div className="mb-3 alert alert-info p-3">
                    <Form.Group controlId="form_name">
                        <Form.Label column sm="auto">
                            Role Name
                        </Form.Label>
                        <Col>
                            <Form.Control
                                type="text"
                                placeholder="Name"
                                required
                                defaultValue=''
                                onChange={e => setData('name', e.target.value)}
                            />

                            <Form.Control.Feedback type="invalid">
                                The name field is required.
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
                    <Alert.Heading>Assign Permissions Error!</Alert.Heading>
                    <p>
                        You haven't selected any permissions.
                    </p>
                </Alert>
                <Card>
                    <Card.Header className='py-3 bg-indigo-800 text-white'>Assign Permissions</Card.Header>
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
    <MainLayout title="Create Role" children={page} />
);

export default CreateRolesPage;
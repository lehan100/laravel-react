import { Link, usePage, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Save, Undo } from 'lucide-react';
import TableView from '@/Components/Table/TableView';
import SaveButton from '@/Components/Button/SaveButton';
import { Row, Col, Card, Form, Alert } from 'react-bootstrap';
import { Permissions, User, PaginatedData } from '@/types';
import Pagination from '@/Components/Pagination/Pagination';
import { useMemo } from "react";

function EditPage() {
  const { item } = usePage<{
    item: User & { password: string | null };
  }>().props;

  const { data, setData, errors, put, processing } = useForm({
    first_name: item.first_name || '',
    last_name: item.last_name || '',
    email: item.email || '',
    group: item.group || 0,
    status: item.status || 0,
    owner: item.owner ? 1 : 0 || 0,
    password: item.password || '',
    undo: 0,
    _method: 'put'
  });
  const [validated, setValidated] = useState(false);
  const [password, setPassword] = useState('');
  const [active, setActive] = useState(data.status);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [matchError, setMatchError] = useState(false);
  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    // Custom password match validation
    if (password != confirmPassword) {
      setMatchError(true);
    } else {
      setMatchError(false);
      if (form.checkValidity() === true) {

        data.status = active;
        data.password = password;
        put(route('users.update', item.id));
      }
    }

    // if (form.checkValidity() === true && matchError == false) {
    //   put(route('users.update', item.id));
    // }
    setValidated(true);
  };
  // Callback function to receive data
  const handleChildData = (data: any) => {

  };
  const [undo, setUndo] = useState(0);
  const handleUndo = (status: number) => {
    setUndo(status);
  }
  useEffect(() => {
    data.undo = undo;
    if (active != data.status) {
      data.status = active;
    }
  }, [data, undo, active]);
  return (
    <div className='content'>
      <Row className="justify-content-center mb-4">
        <Col xs={12} md> <h1 className="text-3xl font-bold">Edit User / <span className='text-info'>{item.name}</span></h1></Col>
        <Col xs={12} md={'auto'}>
          <div className="d-flex gap-2">
            <SaveButton
              children="Save User"
              variant="success"
              loading={processing}
              undo={0}
              icon={<Save size={20} />}
              sendDataStatusUndo={handleUndo}
              form='my-form'
            />
            <Link
              className="btn btn-secondary py-2"
              href={route('users.index')}
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
        <Row>
          <Col xs={12} md={6}>
            <Card>
              <Card.Header className='py-3 bg-indigo-800 text-white'>Infomation</Card.Header>
              <Card.Body>
                <Form.Control
                  type="hidden"
                  placeholder="undo"
                  defaultValue=''
                  onChange={e => setData('undo', undo)}
                />
                <Form.Group as={Row} className="mb-3" controlId="formStatus">
                  <Form.Label column sm="3">
                    &nbsp;
                  </Form.Label>
                  <Col sm>
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      className={active == '1' ? '' : 'text-secondary'}
                      label={active == '1' ? 'Active' : 'InActive'}
                      defaultChecked={active == '1' ? true : false}
                      isValid={active == '1' ? true : false}
                      value={active}
                      onChange={e => setActive(active == 1 ? 0 : 1)}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="3">
                    Account Name
                  </Form.Label>
                  <Col sm>
                    <Form.Control type='text' required
                      onChange={e => setData('first_name', e.target.value)}
                      defaultValue={item.first_name}
                      placeholder='First Name'
                    />
                    <Form.Control.Feedback type="invalid">
                      The first name field is required.
                    </Form.Control.Feedback>
                  </Col>
                  <Col sm>
                    <Form.Control type='text' required
                      onChange={e => setData('last_name', e.target.value)}
                      defaultValue={item.last_name}
                      placeholder='Last Name'
                    />
                    <Form.Control.Feedback type="invalid">
                      The last name field is required.
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card>
              <Card.Header className='py-3 bg-indigo-800 text-white'>Setting</Card.Header>
              <Card.Body>
                <Form.Group as={Row} className="mb-3" controlId="formEmail">
                  <Form.Label column sm="3">
                    Email
                  </Form.Label>
                  <Col sm>
                    <Form.Control type='text' required
                      onChange={e => setData('email', e.target.value)}
                      defaultValue={item.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      The email field is required.
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formtPassword">
                  <Form.Label column sm="3">
                    Password
                  </Form.Label>
                  <Col sm>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                      className={matchError ? 'is-invalid' : ''}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formConfirmPassword">
                  <Form.Label column sm="3">
                    Confirm Password
                  </Form.Label>
                  <Col sm>
                    <Form.Control
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={matchError ? 'is-invalid' : ''}
                    />
                    {matchError && (
                      <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                        Passwords do not match.
                      </Form.Control.Feedback>
                    )}
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formAssign">
                  <Form.Label column sm="3">
                    Assign Group
                  </Form.Label>
                  <Col sm>
                    <Form.Select aria-label="0" required defaultValue={item.group} onChange={e => setData('group', e.target.value)}>
                      <option value="0">Not Access</option>
                      <option value="1">Administrators</option>
                      <option value="2">Admin</option>
                    </Form.Select>
                  </Col>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
EditPage.layout = (page: React.ReactNode) => (
  <MainLayout title="Edit User" children={page} />
);

export default EditPage;
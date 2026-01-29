import { Link, usePage, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Save, Undo } from 'lucide-react';
import SaveButton from '@/Components/Button/SaveButton';
import { Row, Col, Card, Form, Alert } from 'react-bootstrap';
import { useTrans } from '@/Hooks/useTrans';

function CreatedPage() {
  const { trans } = useTrans();
  const { data, setData, errors, post, processing } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    group: '0',
    status: '0',
    owner: 0,
    password: '',
    undo: 0,
  });
  const [validated, setValidated] = useState(false);
  const [password, setPassword] = useState('');
  const [active, setActive]: any = useState(data.status);
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
        data.password = password;
        data.status = active;
        // data.password = password;
        post(route('users.store'));
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
        <Col xs={12} md> <h1 className="text-3xl font-bold">{trans('hancms.users.created')}: <span className='text-info'>{data.first_name + " " + data.last_name}</span></h1></Col>
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
              href={route('users.index')}
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
        <Row>
          <Col xs={12} md={6}>
            <Card>
              <Card.Header className='py-3 bg-indigo-800 text-white'>{trans('hancms.title.infomation')}</Card.Header>
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
                      label={active == '1' ? trans('hancms.status.active') : trans('hancms.status.inactive')}
                      defaultChecked={active == '1' ? true : false}
                      isValid={active == '1' ? true : false}
                      value={active}
                      onChange={e => setActive(active == 1 ? 0 : 1)}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="3">
                    {trans('hancms.column.account_name')}
                  </Form.Label>
                  <Col sm>
                    <Form.Control type='text' required
                      onChange={e => setData('first_name', e.target.value)}
                      placeholder={trans('hancms.column.first_name')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {trans('hancms.message.error.required', { name: trans('hancms.column.first_name') })}
                    </Form.Control.Feedback>
                  </Col>
                  <Col sm>
                    <Form.Control type='text' required
                      onChange={e => setData('last_name', e.target.value)}
                      placeholder={trans('hancms.column.last_name')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {trans('hancms.message.error.required', { name: trans('hancms.column.last_name') })}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card>
              <Card.Header className='py-3 bg-indigo-800 text-white'>{trans('hancms.title.setting')}</Card.Header>
              <Card.Body>
                <Form.Group as={Row} className="mb-3" controlId="formEmail">
                  <Form.Label column sm="3">
                    Email
                  </Form.Label>
                  <Col sm>
                    <Form.Control type='text' required
                      onChange={e => setData('email', e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {trans('hancms.message.error.required', { name: 'Email' })}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formtPassword">
                  <Form.Label column sm="3">
                    {trans('hancms.column.password')}
                  </Form.Label>
                  <Col sm>
                    <Form.Control
                      type="password"
                      placeholder={trans('hancms.column.password')}
                      required
                      onChange={(e) => ()=>{setPassword(e.target.value); setData('password', e.target.value)}}
                    />
                    <Form.Control.Feedback type="invalid">
                      {trans('hancms.message.error.required', { name: trans('hancms.column.password') })}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formConfirmPassword">
                  <Form.Label column sm="3">
                    {trans('hancms.column.password_confirm')}
                  </Form.Label>
                  <Col sm>
                    <Form.Control
                      type="password"
                      placeholder={trans('hancms.column.password_confirm')}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={matchError ? 'is-invalid' : ''}
                    />
                    {matchError && (
                      <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                        {trans('hancms.message.error.password_confirm')}
                      </Form.Control.Feedback>
                    )}
                    {!matchError && (
                      <Form.Control.Feedback type="invalid">
                        {trans('hancms.message.error.required', { name: trans('hancms.column.password_confirm') })}
                      </Form.Control.Feedback>
                    )}
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formAssign">
                  <Form.Label column sm="3">
                    {trans('hancms.column.assign_group')}
                  </Form.Label>
                  <Col sm>
                    <Form.Select aria-label="0" required defaultValue='0' onChange={e => setData('group', e.target.value)}>
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
CreatedPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.users.created" children={page} />
);

export default CreatedPage;
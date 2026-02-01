import { useTrans } from "@/Hooks/useTrans";
import MainLayout from "@/Layouts/MainLayout";
import { Link, useForm } from "@inertiajs/react";
import { Save, Undo, ImagePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, Col, Form, Row, Spinner } from "react-bootstrap";
import SaveButton from '@/Components/Button/SaveButton';
import FieldGroup from "@/Components/Form/FieldGroup";
import FileInput from "@/Components/Form/FileInput";
import axios from "axios";
function CreatedPage() {
    const { trans } = useTrans();
    const { data, setData, errors, post, processing } = useForm({
        name: '',
        code: '',
        photo: '',
        status: 0,
        undo: 0,
    });
    const [validated, setValidated] = useState(false);
    const [active, setActive]: any = useState(data.status);
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
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('languages.store'));
    }
    //Upload Photo
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleFileChange = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        // 1. Hiển thị preview tạm thời bằng URL local (tùy chọn)
        // setPreviewUrl(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append('photo', file);

        setLoading(true);
        try {
            // 2. Gửi lên Laravel để lưu vào tmp
            const response = await axios.post(route('photo.upload'), formData);
            // 3. Cập nhật preview bằng URL thật từ server trả về
            // Giả sử Laravel trả về { "url": "http://domain.com" }
            setPreviewUrl(response.data.url);
            data.photo = response.data.file_name;
            console.log(data);

        } catch (error) {
            console.error("Upload lỗi:", error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <Row className="justify-content-center mb-4">
                <Col xs={12} md> <h1 className="text-3xl font-bold">{trans('hancms.languages.created')} {data.name != '' && (<span className='text-info'>: {data.name}</span>)} </h1></Col>
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
                            href={route('languages.index')}
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
                                <Form.Group as={Row} className="mb-3" controlId="formName">
                                    <Form.Label column sm="3">
                                        {trans('hancms.column.name')}
                                    </Form.Label>
                                    <Col sm>
                                        <Form.Control type='text' required
                                            onChange={e => setData('name', e.target.value)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {trans('hancms.message.error.required', { name: trans('hancms.column.name') })}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3" controlId="formName">
                                    <Form.Label column sm="3">
                                        Code
                                    </Form.Label>
                                    <Col sm>
                                        <Form.Control type='text' required
                                            onChange={e => setData('code', e.target.value)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {trans('hancms.message.error.required', { name: 'Code' })}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="3">
                                        {trans('hancms.column.image')}
                                    </Form.Label>
                                    <Col sm>
                                        <Form.Group controlId="file-upload" className="upload-container">
                                            <Form.Control type="file" hidden onChange={handleFileChange} accept="image/*" />
                                            <label htmlFor="file-upload" className={`square-box ${previewUrl ? 'has-image' : ''}`}>
                                                {loading ? (
                                                    <div className="loader"><Spinner animation="border" variant="warning" /></div>
                                                ) : previewUrl ? (
                                                    <img src={previewUrl} alt="Preview" className="preview-img" />
                                                ) : (
                                                    <div className="placeholder-photo">
                                                        <span className="icon mb-3">{<ImagePlus size={30} />}</span>
                                                        <span>{trans('hancms.button.choose_image')}</span>
                                                    </div>
                                                )}
                                            </label>
                                        </Form.Group>
                                    </Col>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Form>
            {/* <FieldGroup label="Photo" name="photo" error={errors.photo}>
                          <FileInput
                            name="photo"
                            accept="image/*"
                            error={errors.photo}
                            value={data.photo}
                            onChange={photo => setData('photo', photo as unknown as string)}
                          />
                        </FieldGroup> */}
        </div>
    )
}
CreatedPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.languages.created" children={page} />
);

export default CreatedPage;
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function MydModalWithGrid(props: any) {
    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                   {props.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="grid-example">
                {props.children}
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
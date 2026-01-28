import Spinner from 'react-bootstrap/Spinner';

export default function LoadingSpinner({ isLoading, children, ...props }: any) {
    return (
        <div>
            {isLoading &&
                <div style={{ position: 'fixed', background: 'rgba(0, 0, 0, .7)', backgroundAttachment: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spinner  {...props} animation="grow" variant={props.variant}
                    />
                </div>
            }
        </div>
    );
}

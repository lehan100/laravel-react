import { Button, Fade } from 'react-bootstrap';
import { useEffect, useState } from 'react';
export default function Face({ children, ...props }: any) {
    const [openRoute, setOpenRoute] = useState(false);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (props.index != undefined && props.index > -1) {
            setOpenRoute(true);
            setOpen(false);
        } else {
            setOpenRoute(false);
        }

    });
    return (
        <div className={open || openRoute ? 'is-open btn-fade-group' : 'btn-fade-group'}>
            <Button
                onClick={() => setOpen(!open)}
                aria-controls={props.id}
                className={open || openRoute ? 'is-open btn-fade w-100 py-2 text-indigo-200' : 'btn-fade w-100 py-2 text-indigo-200'}
                variant="link"
            >
                <div className="d-flex gap-2 align-items-center">
                    {props.icon}
                    <span>{props.title}</span>
                </div>
            </Button>
            <Fade in={open || openRoute} className='menu-narbar-item py-2 ps-5'>
                <div id={props.id}>
                    {children}
                </div>
            </Fade>
        </div>
    );
}

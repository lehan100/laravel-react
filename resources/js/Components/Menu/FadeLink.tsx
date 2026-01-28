import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
export default function FadeLink({ children, ...props }: any) {
    const [openRoute, setOpenRoute] = useState(false);
    const [open, setOpen] = useState(false);


    // const routersArray = [...props.routers];
    // console.log(routers.indexOf(props.routeIndex));
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
            <Link
                onClick={() => setOpen(!open)}
                href={props.href}
                className={open || openRoute ? 'is-open btn btn-fade w-100 py-2 text-indigo-200' : 'btn btn-fade w-100 py-2 text-indigo-200'}
            >
                <div className="d-flex gap-2 align-items-center">
                    {props.icon}
                    <span>{props.title}</span>
                </div>
            </Link>
        </div>
    );
}

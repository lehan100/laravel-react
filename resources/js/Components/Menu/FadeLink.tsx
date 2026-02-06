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
                className={`w-full flex items-center justify-between p-2 text-indigo-200 hover:bg-indigo-800 rounded-md transition-colors ${open || openRoute ? 'is-open' : ''}`}
            >
                <div className="flex items-center gap-2 p-3">
                    {props.icon}
                    <span className='font-medium'>{props.title}</span>
                </div>
            </Link>
        </div>
    );
}

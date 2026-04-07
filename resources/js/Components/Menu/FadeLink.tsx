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
        <div className={open || openRoute ? 'mb-3 rounded-2xl border border-white/10 bg-white/5 p-1 ring-1 ring-cyan-400/30' : 'mb-3 rounded-2xl border border-white/10 bg-white/5 p-1'}>
            <Link
                onClick={() => setOpen(!open)}
                href={props.href}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-slate-200 transition-colors hover:bg-white/5 hover:text-white ${open || openRoute ? 'bg-white/10 text-white' : ''}`}
            >
                <div className="flex items-center gap-2 p-3">
                    {props.icon}
                    <span className='font-medium'>{props.title}</span>
                </div>
            </Link>
        </div>
    );
}

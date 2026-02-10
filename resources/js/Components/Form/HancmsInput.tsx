
export function InputGroup({ label, children, align = 'start', ...props }: any) {
    return (
        <div className={`grid grid-cols-12 gap-4 ${align === 'center' ? 'items-center' : 'items-start'} ${props.className || ''}`}>
            <label className="col-span-12 sm:col-span-3 pt-2 text-sm font-bold text-gray-700" htmlFor={props.htmlFor}>{label}</label>
            <div className="col-span-12 sm:col-span-9">
                {children}
            </div>
        </div>
    );
}

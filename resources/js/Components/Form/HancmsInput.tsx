
export function InputGroup({ label, children, ...props }: any) {
    return (
        <div className="grid grid-cols-12 items-start gap-4">
            <label className="col-span-12 sm:col-span-3 pt-2 text-sm font-bold text-gray-700" htmlFor={props.htmlFor}>{label}</label>
            <div className="col-span-12 sm:col-span-9">
                {children}
            </div>
        </div>
    );
}

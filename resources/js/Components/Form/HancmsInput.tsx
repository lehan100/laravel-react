
import { Children, isValidElement, type ReactNode } from 'react';

function hasRequiredChild(children: ReactNode): boolean {
    return Children.toArray(children).some((child) => {
        if (!isValidElement(child)) {
            return false;
        }

        if ((child.props as { required?: boolean }).required) {
            return true;
        }

        return child.props?.children ? hasRequiredChild(child.props.children) : false;
    });
}

export function InputGroup({ label, children, align = 'start', stacked = false, required = false, ...props }: any) {
    const showRequired = required || hasRequiredChild(children);
    const labelContent = (
        <>
            <span>{label}</span>
            {showRequired ? <span className="ml-1 text-rose-500">*</span> : null}
        </>
    );

    if (stacked) {
        return (
            <div className={`flex flex-col gap-2 ${align === 'center' ? 'justify-center' : ''} ${props.className || ''}`}>
                <label className="text-sm font-bold text-gray-700" htmlFor={props.htmlFor}>{labelContent}</label>
                <div className="w-full">
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div className={`grid grid-cols-12 gap-4 ${align === 'center' ? 'items-center' : 'items-start'} ${props.className || ''}`}>
            <label className="col-span-12 pt-2 text-sm font-bold text-gray-700 sm:col-span-3" htmlFor={props.htmlFor}>{labelContent}</label>
            <div className="col-span-12 sm:col-span-9">
                {children}
            </div>
        </div>
    );
}


export function Checkbox({ children, ...props }: any) {
    return (
        <div className="grid grid-cols-12 items-center gap-4">
            <div className="hidden sm:block sm:col-span-3"></div>
            <div className="col-span-12 sm:col-span-9 flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                    {children}
                </label>
            </div>
        </div>
    );
}

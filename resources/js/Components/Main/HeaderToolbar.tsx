export default function HeaderToolbar({ title, children }: any) {
    return (
        <div className="flex flex-wrap justify-between items-center mb-6">
            <div className="w-full md:flex-1 mb-3 md:mb-0">
                <h1 className="text-xl font-bold text-gray-800">{title}</h1>
            </div>
            <div className="w-full md:w-auto">
                <div className="flex gap-2">
                    {children}
                </div>
            </div>
        </div>
    )
};
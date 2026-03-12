export default function HeaderToolbar({ title, children }: any) {
    return (
        <div className="flex flex-wrap justify-between items-center mb-10 md:mb-6">
            <div className="md:flex-1 md:mb-0">
                <h1 className="text-xl font-bold text-gray-800">{title}</h1>
            </div>
            <div className="md:w-auto">
                <div className="flex gap-2">
                    {children}
                </div>
            </div>
        </div>
    )
};
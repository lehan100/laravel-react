export default function Card({ title, children, className }: any) {
    return (
        <div className={`bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden ${className || ''}`}>
            {title && <div className="p-4 bg-indigo-800 text-white font-bold uppercase tracking-wider">
                {title}
            </div>
            }
            <div className="overflow-x-auto">
                {children}
            </div>
        </div>
    )
}
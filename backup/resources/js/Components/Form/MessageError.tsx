export default function MessageError({ children, ...props }: any) {
    return (
        <p className="text-red-500 text-xs mt-1">{children}</p>
    )
}
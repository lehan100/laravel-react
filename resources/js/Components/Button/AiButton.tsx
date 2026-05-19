import React from 'react';
import { Sparkles } from 'lucide-react';
import classNames from 'classnames';

interface AiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
    loading?: boolean;
}

export default function AiButton({
    children,
    icon,
    loading = false,
    className,
    disabled,
    type = 'button',
    ...props
}: AiButtonProps) {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={classNames(
                'inline-flex items-center justify-center gap-2 rounded-xl border-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white shadow-md transition-all hover:-translate-y-0.5 hover:from-fuchsia-400 hover:to-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60',
                !className?.includes('text-') && 'text-xs',
                !className?.includes('font-') && 'font-semibold',
                !className?.includes('px-') && 'px-3',
                !className?.includes('py-') && 'py-2',
                className
            )}
            {...props}
        >
            {icon ? icon : <Sparkles size={14} className="animate-pulse" />}
            {children}
        </button>
    );
}

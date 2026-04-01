'use client'

import { forwardRef } from 'react'
import { clsx } from 'clsx'

type Variant = 'primary' | 'impact' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant
    size?: Size
    loading?: boolean
    icon?: React.ReactNode
}

const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]'

const variants: Record<Variant, string> = {
    primary:
        'bg-[var(--color-accent)] text-white px-5 py-2.5 text-sm hover:bg-[var(--color-accent-hover)] shadow-[var(--shadow-glow-accent)] hover:shadow-none',
    impact:
        'bg-[var(--color-impact)] text-[var(--color-bg)] px-5 py-2.5 text-sm hover:bg-[var(--color-impact-hover)] shadow-[var(--shadow-glow-impact)] hover:shadow-none',
    secondary:
        'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] px-5 py-2.5 text-sm hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-muted)]',
    ghost:
        'text-[var(--color-text-muted)] px-5 py-2.5 text-sm hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]',
    danger:
        'bg-red-500/10 text-red-400 border border-red-500/20 px-5 py-2.5 text-sm hover:bg-red-500 hover:text-white',
}

const sizes: Record<Size, string> = {
    sm: '!px-3.5 !py-1.5 !text-xs !rounded-lg',
    md: '',
    lg: '!px-7 !py-3.5 !text-base !rounded-2xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', loading, icon, children, className, disabled, ...props }, ref) => (
        <button
            ref={ref}
            className={clsx(base, variants[variant], sizes[size], className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
                icon && <span className="w-4 h-4 flex-shrink-0">{icon}</span>
            )}
            {children}
        </button>
    )
)

Button.displayName = 'Button'

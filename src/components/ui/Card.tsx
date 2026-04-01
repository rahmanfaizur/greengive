import { clsx } from 'clsx'

interface CardProps {
    children: React.ReactNode
    className?: string
    glow?: boolean
}

const base =
    'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)]'
const glowExtra =
    'hover:border-[var(--color-accent)]/30 transition-all duration-300 hover:shadow-[var(--shadow-glow-accent)]'

export function Card({ children, className, glow }: CardProps) {
    return (
        <div className={clsx(base, glow && glowExtra, className)}>
            {children}
        </div>
    )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={clsx('mb-4', className)}>{children}</div>
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
    return <h3 className={clsx('text-lg font-bold text-[var(--color-text)]', className)}>{children}</h3>
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
    return <p className={clsx('text-sm text-[var(--color-text-muted)] mt-1', className)}>{children}</p>
}

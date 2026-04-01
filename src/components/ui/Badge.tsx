import { clsx } from 'clsx'

type BadgeVariant = 'active' | 'lapsed' | 'pending' | 'draft' | 'approved' | 'rejected' | 'paid' | 'default' | 'impact' | 'outline' | 'warning'

interface BadgeProps {
    variant?: BadgeVariant
    children: React.ReactNode
    className?: string
}

const base = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium'

const variants: Record<BadgeVariant, string> = {
    active: `${base} bg-[var(--color-impact-muted)] text-[var(--color-impact)]`,
    lapsed: `${base} bg-red-500/20 text-red-400`,
    pending: `${base} bg-[var(--color-warning)]/20 text-[var(--color-warning)]`,
    draft: `${base} bg-[var(--color-text-muted)]/20 text-[var(--color-text-muted)]`,
    approved: `${base} bg-[var(--color-impact-muted)] text-[var(--color-impact)]`,
    rejected: `${base} bg-red-500/20 text-red-400`,
    paid: `${base} bg-[var(--color-accent-muted)] text-[var(--color-accent)]`,
    default: `${base} bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]`,
    impact: `${base} bg-[var(--color-impact-muted)] text-[var(--color-impact)] border border-[var(--color-impact)]/20`,
    outline: `${base} bg-transparent border border-[var(--color-border)] text-[var(--color-text-muted)]`,
    warning: `${base} bg-orange-500/20 text-orange-400 border border-orange-500/20`,
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
    return (
        <span className={clsx(variants[variant], className)}>
            {children}
        </span>
    )
}

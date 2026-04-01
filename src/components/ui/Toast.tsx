'use client'

import { useEffect, useState, useCallback } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { clsx } from 'clsx'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastItem {
    id: string
    type: ToastType
    message: string
}

const listeners = new Set<(t: ToastItem) => void>()

export const toast = Object.assign(
    (message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).slice(2)
        listeners.forEach((fn) => fn({ id, type, message }))
    },
    {
        success: (msg: string) => toast(msg, 'success'),
        error: (msg: string) => toast(msg, 'error'),
        warning: (msg: string) => toast(msg, 'warning'),
        info: (msg: string) => toast(msg, 'info'),
    }
)

const iconMap: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle className="w-4 h-4 text-[var(--color-success)]" />,
    error: <XCircle className="w-4 h-4 text-red-400" />,
    warning: <AlertTriangle className="w-4 h-4 text-[var(--color-warning)]" />,
    info: <Info className="w-4 h-4 text-[var(--color-accent)]" />,
}

const borderMap: Record<ToastType, string> = {
    success: 'border-l-[var(--color-success)]',
    error: 'border-l-red-500',
    warning: 'border-l-[var(--color-warning)]',
    info: 'border-l-[var(--color-accent)]',
}

export function ToastProvider() {
    const [toasts, setToasts] = useState<ToastItem[]>([])

    const remove = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    const add = useCallback((t: ToastItem) => {
        setToasts((prev) => [...prev, t])
        setTimeout(() => remove(t.id), 4000)
    }, [remove])

    useEffect(() => {
        listeners.add(add)
        return () => { listeners.delete(add) }
    }, [add])

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 w-80">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={clsx(
                        'flex items-start gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] border-l-4 rounded-xl px-4 py-3 shadow-[var(--shadow-card)] animate-[slideUp_0.5s_ease_forwards]',
                        borderMap[t.type]
                    )}
                >
                    <span className="mt-0.5 flex-shrink-0">{iconMap[t.type]}</span>
                    <p className="text-sm text-[var(--color-text)] flex-1">{t.message}</p>
                    <button
                        onClick={() => remove(t.id)}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors flex-shrink-0"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            ))}
        </div>
    )
}

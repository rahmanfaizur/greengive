'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { clsx } from 'clsx'
import { Button } from './Button'

interface ModalProps {
    open: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const sizeClass = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl' }

export function Modal({ open, onClose, title, children, size = 'md', className }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return
        if (open) {
            dialog.showModal()
            document.body.style.overflow = 'hidden'
        } else {
            dialog.close()
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [open])

    return (
        <dialog
            ref={dialogRef}
            onCancel={onClose}
            onClick={(e) => { if (e.target === dialogRef.current) onClose() }}
            className={clsx(
                'backdrop:bg-black/70 backdrop:backdrop-blur-sm rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 w-full shadow-2xl',
                sizeClass[size],
                className
            )}
        >
            {title && (
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-[var(--color-text)]">{title}</h2>
                    <Button variant="ghost" size="sm" onClick={onClose} className="!p-1.5">
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            )}
            {children}
        </dialog>
    )
}

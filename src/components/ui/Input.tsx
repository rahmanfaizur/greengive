'use client'

import { forwardRef } from 'react'
import { clsx } from 'clsx'

const inputBase =
    'w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors duration-200'
const inputError = 'border-red-500 focus:border-red-500'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, className, id, ...props }, ref) => {
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={clsx(inputBase, error && inputError, className)}
                    {...props}
                />
                {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
                {hint && !error && <p className="text-[var(--color-text-muted)] text-xs mt-1">{hint}</p>}
            </div>
        )
    }
)
Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, className, id, ...props }, ref) => {
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={inputId}
                    rows={4}
                    className={clsx(inputBase, 'resize-none', error && inputError, className)}
                    {...props}
                />
                {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
            </div>
        )
    }
)
Textarea.displayName = 'Textarea'

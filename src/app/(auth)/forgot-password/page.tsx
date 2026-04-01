'use client'

import Link from 'next/link'
import { useState } from 'react'
import { resetPassword } from '../actions'
import { Button, Input } from '@/components/ui'

export default function ForgotPasswordPage() {
    const [done, setDone] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const result = await resetPassword(new FormData(e.currentTarget))
        setLoading(false)
        if (result?.error) return setError(result.error)
        setDone(true)
    }

    if (done) {
        return (
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-7 text-center">
                <div className="text-3xl mb-3">📬</div>
                <h1 className="text-lg font-bold mb-2">Check your inbox</h1>
                <p className="text-sm text-[var(--color-text-muted)]">
                    We sent a password reset link to your email.
                </p>
            </div>
        )
    }

    return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-7">
            <h1 className="text-xl font-bold mb-1">Reset password</h1>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">
                We&apos;ll send you a link to reset it
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Email" name="email" type="email" required placeholder="you@example.com" />

                {error && (
                    <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                <Button type="submit" className="w-full" loading={loading}>
                    Send reset link
                </Button>
            </form>

            <p className="text-center text-sm text-[var(--color-text-muted)] mt-4">
                <Link href="/login" className="hover:text-[var(--color-text)] transition-colors">
                    ← Back to login
                </Link>
            </p>
        </div>
    )
}

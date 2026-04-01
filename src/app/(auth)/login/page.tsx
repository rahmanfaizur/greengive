'use client'

import Link from 'next/link'
import { useState } from 'react'
import { login } from '../actions'
import { Button, Input } from '@/components/ui'

export default function LoginPage() {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError('')
        const result = await login(new FormData(e.currentTarget))
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-7">
            <h1 className="text-xl font-bold mb-1">Welcome back</h1>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">Log in to your GreenGive account</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Email" name="email" type="email" required placeholder="you@example.com" />
                <Input label="Password" name="password" type="password" required placeholder="••••••••" />

                {error && (
                    <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                <Button type="submit" className="w-full" loading={loading}>
                    Log in
                </Button>
            </form>

            <div className="mt-4 flex flex-col gap-2 text-center text-sm text-[var(--color-text-muted)]">
                <Link href="/forgot-password" className="hover:text-[var(--color-text)] transition-colors">
                    Forgot your password?
                </Link>
                <span>
                    No account?{' '}
                    <Link href="/signup" className="text-[var(--color-accent)] hover:underline">
                        Sign up
                    </Link>
                </span>
            </div>
        </div>
    )
}

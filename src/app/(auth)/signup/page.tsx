'use client'

import Link from 'next/link'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { signup } from '../actions'
import { Button, Input } from '@/components/ui'

function SignupContent() {
    const params = useSearchParams()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError('')
        const result = await signup(new FormData(e.currentTarget))
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-7">
            <h1 className="text-xl font-bold mb-1">Create your account</h1>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">
                Start playing, winning, and giving back
            </p>

            {params.get('charity') && (
                <div className="text-xs bg-[var(--color-impact-muted)] border border-[var(--color-impact)]/20 text-[var(--color-impact)] rounded-lg px-3 py-2 mb-4">
                    You&apos;ll support{' '}
                    <span className="font-semibold capitalize">{params.get('charity')?.replace(/-/g, ' ')}</span>{' '}
                    when you sign up
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Full name" name="full_name" required placeholder="Your name" />
                <Input label="Email" name="email" type="email" required placeholder="you@example.com" />
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    required
                    placeholder="Min 8 characters"
                    hint="At least 8 characters"
                />

                {/* hidden fields from query params */}
                {params.get('plan') && <input type="hidden" name="plan" value={params.get('plan')!} />}
                {params.get('charity') && <input type="hidden" name="charity_slug" value={params.get('charity')!} />}

                {error && (
                    <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                <Button type="submit" className="w-full" loading={loading}>
                    Create account
                </Button>
            </form>

            <p className="text-center text-sm text-[var(--color-text-muted)] mt-4">
                Already have an account?{' '}
                <Link href="/login" className="text-[var(--color-accent)] hover:underline">
                    Log in
                </Link>
            </p>
        </div>
    )
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-sm text-[var(--color-text-muted)]">Loading signup...</div>}>
            <SignupContent />
        </Suspense>
    )
}

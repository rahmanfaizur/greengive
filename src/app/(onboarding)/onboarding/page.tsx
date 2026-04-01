'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui'
import { Heart, Trophy } from 'lucide-react'

// Placeholder charities — will be fetched from Supabase in Phase 7
const charities = [
    { id: '1', name: 'Macmillan Cancer Support', category: 'Health' },
    { id: '2', name: 'Age UK', category: 'Social' },
    { id: '3', name: 'British Heart Foundation', category: 'Health' },
    { id: '4', name: 'Mind', category: 'Mental Health' },
]

export default function OnboardingPage() {
    const params = useSearchParams()
    // Try to grab pre-selected choices from URL
    const initialPlan = (params.get('plan') as 'monthly' | 'yearly') || 'monthly'
    const initialCharity = charities.find((c) => c.name.toLowerCase().includes(params.get('charity')?.replace(/-/g, ' ') || ''))?.id

    const [plan, setPlan] = useState<'monthly' | 'yearly'>(initialPlan)
    const [charityId, setCharityId] = useState<string>(initialCharity || '')
    const [charityPct, setCharityPct] = useState<number>(10)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleCheckout() {
        if (!charityId) {
            return setError('Please select a charity to support.')
        }
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan, charityId, charityPct }),
            })
            const data = await res.json()

            if (!res.ok) throw new Error(data.error || 'Failed to start checkout')

            // Redirect to Stripe Checkout
            window.location.href = data.url
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Configure your subscription</h1>
            <p className="text-[var(--color-text-muted)] mb-10">
                Choose how you want to play and who you want to support.
            </p>

            <div className="space-y-8">
                {/* Step 1: Plan */}
                <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[var(--color-accent-muted)] text-[var(--color-accent)] flex items-center justify-center text-xs">1</span>
                        Choose your plan
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => setPlan('monthly')}
                            className={`text-left p-4 rounded-xl border transition-all ${plan === 'monthly'
                                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-muted)]'
                                    : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                                }`}
                        >
                            <div className="font-semibold mb-1">Monthly</div>
                            <div className="text-2xl font-bold mb-2">£9.99</div>
                            <div className="text-xs text-[var(--color-text-muted)] mt-1">Billed every month</div>
                        </button>

                        <button
                            onClick={() => setPlan('yearly')}
                            className={`text-left p-4 rounded-xl border relative transition-all ${plan === 'yearly'
                                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-muted)]'
                                    : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                                }`}
                        >
                            <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--color-accent)] text-white uppercase tracking-wider">
                                Save £20
                            </span>
                            <div className="font-semibold mb-1">Yearly</div>
                            <div className="text-2xl font-bold mb-2">£99</div>
                            <div className="text-xs text-[var(--color-text-muted)] mt-1">Billed once a year</div>
                        </button>
                    </div>
                </section>

                {/* Step 2: Charity */}
                <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
                    <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[var(--color-impact-muted)] text-[var(--color-impact)] flex items-center justify-center text-xs">2</span>
                        Pick a charity
                    </h2>
                    <p className="text-sm text-[var(--color-text-muted)] pl-8 mb-5">
                        A portion of your subscription goes directly to them every month.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-3 pl-8">
                        {charities.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setCharityId(c.id)}
                                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${charityId === c.id
                                        ? 'border-[var(--color-impact)] bg-[var(--color-impact-muted)]'
                                        : 'border-[var(--color-border)] hover:border-[var(--color-impact)]/50'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${charityId === c.id ? 'bg-[var(--color-impact)] text-white' : 'bg-[var(--color-bg)] text-[var(--color-impact)]'
                                    }`}>
                                    <Heart className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold truncate">{c.name}</div>
                                    <div className="text-xs text-[var(--color-text-muted)]">{c.category}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Step 3: Percentage slider */}
                <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-[var(--color-accent-muted)] text-[var(--color-accent)] flex items-center justify-center text-xs">3</span>
                                Charity contribution
                            </h2>
                            <p className="text-sm text-[var(--color-text-muted)] pl-8">
                                How much of your subscription goes to charity? (Min 10%)
                            </p>
                        </div>
                        <div className="text-2xl font-bold text-[var(--color-impact)]">
                            {charityPct}%
                        </div>
                    </div>

                    <div className="pl-8">
                        <input
                            type="range"
                            min="10"
                            max="50"
                            step="5"
                            value={charityPct}
                            onChange={(e) => setCharityPct(Number(e.target.value))}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[var(--color-border)] accent-[var(--color-impact)] outline-none"
                        />
                        <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-2">
                            <span>10% (Min)</span>
                            <span>50% (Max)</span>
                        </div>

                        <div className="mt-6 p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center gap-3 text-sm">
                            <Trophy className="w-5 h-5 text-[var(--color-accent)]" />
                            <p className="text-[var(--color-text-muted)]">
                                The remaining <strong className="text-[var(--color-text)]">{100 - charityPct}%</strong> covers the prize pool (60% fixed) and platform running costs.
                            </p>
                        </div>
                    </div>
                </section>

                {error && (
                    <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                        {error}
                    </div>
                )}

                <Button
                    size="lg"
                    className="w-full text-lg"
                    variant="primary"
                    onClick={handleCheckout}
                    loading={loading}
                >
                    Proceed to payment {plan === 'yearly' ? '(£99/yr)' : '(£9.99/mo)'}
                </Button>
            </div>
        </div>
    )
}

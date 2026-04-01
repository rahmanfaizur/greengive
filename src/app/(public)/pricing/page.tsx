import Link from 'next/link'
import { Check } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui'

const plans = [
    {
        name: 'Monthly',
        price: '£9.99',
        period: '/month',
        yearly: false,
        features: [
            'Enter every monthly draw',
            'Up to 5 scores tracked',
            'Min 10% to your chosen charity',
            'Full dashboard access',
        ],
    },
    {
        name: 'Yearly',
        price: '£99',
        period: '/year',
        yearly: true,
        badge: 'Save £20',
        features: [
            'Everything in monthly',
            '2 months free',
            'Priority draw entry',
            'Yearly giving summary',
        ],
    },
]

export default function PricingPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 max-w-6xl mx-auto px-4 sm:px-6 pb-24">
                <div className="text-center mb-14">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-3">Straightforward pricing</h1>
                    <p className="text-[var(--color-text-muted)] max-w-md mx-auto">
                        Pick a plan. Your subscription funds prize pools and goes to the charity you choose.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    {plans.map((p) => (
                        <div
                            key={p.name}
                            className={`rounded-2xl border p-7 relative ${p.yearly
                                    ? 'border-[var(--color-accent)]/40 bg-[var(--color-accent-muted)]'
                                    : 'border-[var(--color-border)] bg-[var(--color-surface)]'
                                }`}
                        >
                            {p.badge && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[var(--color-accent)] text-white text-xs font-semibold">
                                    {p.badge}
                                </span>
                            )}

                            <h2 className="text-lg font-semibold mb-1">{p.name}</h2>
                            <div className="flex items-end gap-1 mb-6">
                                <span className="text-4xl font-bold">{p.price}</span>
                                <span className="text-[var(--color-text-muted)] text-sm mb-1">{p.period}</span>
                            </div>

                            <ul className="space-y-3 mb-7">
                                {p.features.map((f) => (
                                    <li key={f} className="flex items-start gap-2.5 text-sm">
                                        <Check className="w-4 h-4 text-[var(--color-impact)] flex-shrink-0 mt-0.5" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Link href={`/signup?plan=${p.name.toLowerCase()}`}>
                                <Button variant={p.yearly ? 'primary' : 'secondary'} className="w-full">
                                    Get started
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="mt-12 max-w-2xl mx-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
                    <h3 className="font-semibold mb-4">Where does my money go?</h3>
                    <div className="space-y-3">
                        {[
                            { label: 'Prize pool', pct: '60%', color: 'var(--color-accent)' },
                            { label: 'Your chosen charity', pct: '10%+', color: 'var(--color-impact)' },
                            { label: 'Platform & operations', pct: '30%', color: 'var(--color-text-muted)' },
                        ].map((row) => (
                            <div key={row.label} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{ background: row.color }} />
                                    {row.label}
                                </div>
                                <span className="font-semibold">{row.pct}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] mt-4">
                        You can increase your charity percentage above 10% any time in your settings.
                    </p>
                </div>
            </main>
            <Footer />
        </>
    )
}

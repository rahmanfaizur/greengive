import Link from 'next/link'
import { ArrowRight, Trophy, Heart, Target } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui'

export default function HomePage() {
    return (
        <>
            <Navbar />
            <main className="pt-16">
                <Hero />
                <HowItWorks />
                <PrizeTiers />
                <CharitySpotlight />
                <FinalCTA />
            </main>
            <Footer />
        </>
    )
}

function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
            {/* background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,170,0.08)_0%,transparent_60%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(108,99,255,0.07)_0%,transparent_60%)] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-impact-muted)] border border-[var(--color-impact)]/20 text-[var(--color-impact)] text-xs font-medium mb-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-impact)] animate-pulse" />
                    Golf that gives back
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
                    Your game.
                    <br />
                    <span style={{ background: 'linear-gradient(135deg, #6C63FF, #00D4AA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        Their future.
                    </span>
                </h1>

                <p className="text-lg sm:text-xl text-[var(--color-text-muted)] max-w-xl mx-auto mb-10 leading-relaxed">
                    Subscribe, enter your Stableford scores, and you&apos;re automatically in the monthly prize draw — while a portion of your fee goes straight to a charity you pick.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/signup">
                        <Button size="lg" variant="impact" icon={<ArrowRight className="w-5 h-5" />}>
                            Start giving back
                        </Button>
                    </Link>
                    <Link href="/how-it-works">
                        <Button size="lg" variant="secondary">
                            See how it works
                        </Button>
                    </Link>
                </div>

                <div className="mt-16 grid grid-cols-3 gap-6 max-w-sm mx-auto text-center">
                    {[
                        { value: '£0 extra', label: 'charity costs you nothing' },
                        { value: 'Monthly', label: 'prize draws' },
                        { value: '10%+', label: 'goes to your charity' },
                    ].map((s) => (
                        <div key={s.label}>
                            <p className="text-lg font-bold text-[var(--color-text)]">{s.value}</p>
                            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function HowItWorks() {
    const steps = [
        {
            icon: <Target className="w-6 h-6 text-[var(--color-accent)]" />,
            title: 'Subscribe',
            desc: 'Pick a monthly or yearly plan. A slice goes to prize pools, a slice goes to your charity.',
        },
        {
            icon: <Trophy className="w-6 h-6 text-[var(--color-impact)]" />,
            title: 'Log your scores',
            desc: 'Enter up to 5 Stableford scores. We keep a rolling window of your latest 5 — that\'s your draw entry.',
        },
        {
            icon: <Heart className="w-6 h-6 text-red-400" />,
            title: 'Win and give',
            desc: 'Every month we draw 5 numbers from the score range. Match 3, 4, or all 5 of yours and you win. Your charity gets funded either way.',
        },
    ]

    return (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
            <div className="text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-bold mb-3">Simple by design</h2>
                <p className="text-[var(--color-text-muted)]">No points systems, no leaderboards. Just golf, prizes, and impact.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {steps.map((s, i) => (
                    <div key={i} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 relative">
                        <span className="absolute top-4 right-4 text-xs font-bold text-[var(--color-text-subtle)]">0{i + 1}</span>
                        <div className="w-11 h-11 rounded-xl bg-[var(--color-bg)] flex items-center justify-center mb-4 border border-[var(--color-border)]">
                            {s.icon}
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

function PrizeTiers() {
    const tiers = [
        { match: '5 numbers', share: '40%', note: 'Jackpot — rolls over if unclaimed', highlight: true },
        { match: '4 numbers', share: '35%', note: 'Split between all 4-match winners', highlight: false },
        { match: '3 numbers', share: '25%', note: 'Split between all 3-match winners', highlight: false },
    ]

    return (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8 md:p-12">
                <div className="max-w-lg mb-10">
                    <h2 className="text-3xl font-bold mb-3">How prizes are split</h2>
                    <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                        60% of every subscription goes into the prize pool. It&apos;s divided across three match tiers every month, calculated at draw time.
                    </p>
                </div>

                <div className="space-y-3">
                    {tiers.map((t) => (
                        <div
                            key={t.match}
                            className={`flex items-center justify-between rounded-xl px-5 py-4 border ${t.highlight
                                    ? 'border-[var(--color-accent)]/30 bg-[var(--color-accent-muted)]'
                                    : 'border-[var(--color-border)] bg-[var(--color-bg)]'
                                }`}
                        >
                            <div>
                                <p className="font-semibold text-sm">{t.match}</p>
                                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t.note}</p>
                            </div>
                            <span className={`text-2xl font-bold ${t.highlight ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]'}`}>
                                {t.share}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function CharitySpotlight() {
    return (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-impact-muted)] text-[var(--color-impact)] text-xs font-medium mb-5">
                        <Heart className="w-3 h-3" /> Charity spotlight
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        You choose where the money goes
                    </h2>
                    <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
                        Pick from our verified charity directory when you sign up. A minimum of 10% of your subscription goes directly to them every month — more if you want to give extra.
                    </p>
                    <Link href="/charities">
                        <Button variant="secondary" icon={<ArrowRight className="w-4 h-4" />}>
                            Browse charities
                        </Button>
                    </Link>
                </div>

                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
                    {/* placeholder charity cards */}
                    {['Macmillan Cancer Support', 'Age UK', 'British Heart Foundation'].map((name) => (
                        <div key={name} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                            <div className="w-9 h-9 rounded-lg bg-[var(--color-impact-muted)] flex items-center justify-center flex-shrink-0">
                                <Heart className="w-4 h-4 text-[var(--color-impact)]" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">{name}</p>
                                <p className="text-xs text-[var(--color-text-muted)]">Verified charity</p>
                            </div>
                        </div>
                    ))}
                    <Link href="/charities" className="block text-center text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors pt-1">
                        View all charities →
                    </Link>
                </div>
            </div>
        </section>
    )
}

function FinalCTA() {
    return (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 pb-24">
            <div className="relative rounded-3xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] text-center px-8 py-16">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(108,99,255,0.12)_0%,transparent_70%)] pointer-events-none" />
                <div className="relative">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Ready to play with purpose?
                    </h2>
                    <p className="text-[var(--color-text-muted)] mb-8 max-w-md mx-auto">
                        Join GreenGive and start turning your golf rounds into something that matters.
                    </p>
                    <Link href="/signup">
                        <Button size="lg" variant="impact">
                            Get started — it&apos;s free to try
                        </Button>
                    </Link>
                    <p className="text-xs text-[var(--color-text-muted)] mt-4">No commitment. Cancel whenever.</p>
                </div>
            </div>
        </section>
    )
}

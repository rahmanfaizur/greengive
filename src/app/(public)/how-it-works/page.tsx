import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui'

const steps = [
    {
        n: '01',
        title: 'Subscribe to GreenGive',
        body: 'Choose monthly (£9.99) or yearly (£99). Your subscription is split automatically — 60% to the prize pool, at least 10% to charity, the rest keeps the platform running.',
    },
    {
        n: '02',
        title: 'Pick a charity',
        body: 'During sign-up you choose one charity from our verified directory. You can change it any time. Your monthly contribution goes directly to them.',
    },
    {
        n: '03',
        title: 'Log your last 5 scores',
        body: 'Enter your Stableford scores (1–45 each) with the date you played. We keep a rolling window of your latest 5. These are your draw numbers.',
    },
    {
        n: '04',
        title: 'The monthly draw',
        body: 'On draw day, we generate 5 random numbers from the Stableford range. Your scores are compared against the drawn numbers. Match 3, 4, or all 5 and you win a share of that tier\'s prize pool.',
    },
    {
        n: '05',
        title: 'Jackpot rollover',
        body: 'If nobody matches all 5 numbers, the jackpot (40% of that month\'s pool) carries over and adds to next month\'s top prize. It keeps growing until someone wins.',
    },
    {
        n: '06',
        title: 'Claiming your prize',
        body: 'Winners get an email. You upload a screenshot of your scores as verification. Once approved by our team, payment is sent. Your charity contribution happens regardless of whether you win.',
    },
]

export default function HowItWorksPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 max-w-4xl mx-auto px-4 sm:px-6 pb-24">
                <div className="mb-14">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">How GreenGive works</h1>
                    <p className="text-[var(--color-text-muted)] text-lg max-w-lg">
                        Six steps from signup to winning — and giving every single month.
                    </p>
                </div>

                <ol className="space-y-6">
                    {steps.map((s) => (
                        <li key={s.n} className="flex gap-6 items-start">
                            <span className="text-3xl font-bold text-[var(--color-text-subtle)] flex-shrink-0 w-10 leading-none pt-1">
                                {s.n}
                            </span>
                            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex-1">
                                <h2 className="font-semibold text-lg mb-2">{s.title}</h2>
                                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{s.body}</p>
                            </div>
                        </li>
                    ))}
                </ol>

                <div className="mt-14 text-center">
                    <Link href="/signup">
                        <Button size="lg" variant="impact" icon={<ArrowRight className="w-5 h-5" />}>
                            Get started
                        </Button>
                    </Link>
                </div>
            </main>
            <Footer />
        </>
    )
}

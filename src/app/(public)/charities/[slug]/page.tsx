import Link from 'next/link'
import { Heart, Calendar, ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui'

// static placeholder — replaced by Supabase fetch in Phase 7
const charityData: Record<string, { name: string; desc: string; longDesc: string; category: string; events: string[] }> = {
    macmillan: {
        name: 'Macmillan Cancer Support',
        desc: 'Supporting people living with cancer',
        longDesc: 'Macmillan Cancer Support improves the lives of people living with cancer. We provide physical, financial, and emotional support for people with cancer and their families.',
        category: 'Health',
        events: ['Macmillan Golf Day — June 2026', 'Coffee Morning Fundraiser — May 2026'],
    },
}

export default function CharityProfilePage({ params }: { params: { slug: string } }) {
    const charity = charityData[params.slug] ?? {
        name: 'Charity',
        desc: '',
        longDesc: 'This charity makes a real difference. Your monthly contribution helps fund their work directly.',
        category: 'Verified',
        events: [],
    }

    return (
        <>
            <Navbar />
            <main className="pt-24 max-w-4xl mx-auto px-4 sm:px-6 pb-24">
                <Link href="/charities" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-8 transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    All charities
                </Link>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <span className="text-xs text-[var(--color-text-muted)] mb-2 block">{charity.category}</span>
                            <h1 className="text-3xl sm:text-4xl font-bold mb-3">{charity.name}</h1>
                            <p className="text-[var(--color-text-muted)]">{charity.desc}</p>
                        </div>

                        <div className="w-full h-48 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center">
                            <Heart className="w-10 h-10 text-[var(--color-impact)]/40" />
                        </div>

                        <p className="text-[var(--color-text-muted)] leading-relaxed text-sm">{charity.longDesc}</p>

                        {charity.events.length > 0 && (
                            <div>
                                <h2 className="font-semibold mb-3">Upcoming events</h2>
                                <ul className="space-y-2">
                                    {charity.events.map((e) => (
                                        <li key={e} className="flex items-center gap-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3">
                                            <Calendar className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0" />
                                            {e}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* sidebar */}
                    <div className="space-y-4">
                        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5">
                            <div className="w-10 h-10 rounded-xl bg-[var(--color-impact-muted)] flex items-center justify-center mb-4">
                                <Heart className="w-5 h-5 text-[var(--color-impact)]" />
                            </div>
                            <p className="text-sm font-semibold mb-1">Support {charity.name}</p>
                            <p className="text-xs text-[var(--color-text-muted)] mb-4 leading-relaxed">
                                Pick this charity when you sign up and at least 10% of your subscription goes to them every month.
                            </p>
                            <Link href={`/signup?charity=${params.slug}`}>
                                <Button variant="impact" className="w-full">
                                    Choose this charity
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

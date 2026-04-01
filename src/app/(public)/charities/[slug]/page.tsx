import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Heart, Calendar, ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui'
import { createClient } from '@/lib/supabase/server'
import { DonateButton } from '@/components/features/DonateButton'

export default async function CharityProfilePage({ params }: { params: { slug: string } }) {
    const supabase = await createClient()

    // Fetch charity from DB
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: result } = await (supabase.from('charities') as any)
        .select('*')
        .eq('slug', params.slug)
        .single()

    if (!result) {
        notFound()
    }

    const charity: any = result

    // Safely parse events JSON array
    const events = Array.isArray(charity.events) ? charity.events : []

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
                            {charity.is_featured && <span className="text-xs font-semibold text-[var(--color-impact)] uppercase tracking-wider mb-2 block">Featured Partner</span>}
                            <h1 className="text-3xl sm:text-4xl font-bold mb-3">{charity.name}</h1>
                            <p className="text-[var(--color-text-muted)] text-lg">{charity.description}</p>
                        </div>

                        <div className="w-full h-48 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center overflow-hidden relative">
                            {charity.logo_url ? (
                                <img src={charity.logo_url} alt={charity.name} className="w-full h-full object-cover opacity-80" />
                            ) : (
                                <Heart className="w-10 h-10 text-[var(--color-impact)]/40" />
                            )}
                        </div>

                        <p className="text-[var(--color-text-muted)] leading-relaxed text-sm">
                            Your support makes a real difference. By selecting <strong>{charity.name}</strong> as your chosen charity on GreenGive, a guaranteed percentage of your subscription goes directly to funding their critical work every single month.
                        </p>

                        {events.length > 0 && (
                            <div>
                                <h2 className="font-semibold mb-3">Upcoming events</h2>
                                <ul className="space-y-2">
                                    {events.map((e: any, i: number) => (
                                        <li key={i} className="flex items-center gap-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3">
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

                            <div className="space-y-3">
                                <Link href={`/signup?charity=${params.slug}`}>
                                    <Button variant="impact" className="w-full">
                                        Select via Subscription
                                    </Button>
                                </Link>

                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="w-full border-t border-[var(--color-border)]" />
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-[var(--color-surface)] px-2 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Or</span>
                                    </div>
                                </div>

                                <DonateButton charityId={charity.id} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

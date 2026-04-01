import Link from 'next/link'
import { ArrowRight, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, Badge, Button } from '@/components/ui'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const metadata = { title: 'Charities | GreenGive' }

export default async function CharitiesPage() {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: charities } = await (supabase.from('charities') as any)
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('name')

    const list: any[] = charities || []

    return (
        <>
            <Navbar />
            <main className="pt-24 max-w-5xl mx-auto px-4 sm:px-6 pb-24">
                <div className="max-w-2xl mb-12">
                    <h1 className="text-4xl font-bold mb-4">Who we support</h1>
                    <p className="text-lg text-[var(--color-text-muted)] mb-6">
                        When you join GreenGive, you choose exactly where your automated donation goes.
                        All our partners are verified and directly benefit from your subscription.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(!charities || charities.length === 0) ? (
                        <div className="col-span-full py-12 text-center text-[var(--color-text-muted)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl border-dashed">
                            No active charities found. Admins need to add some!
                        </div>
                    ) : (
                        list.map((charity) => (
                            <Card key={charity.id} className="flex flex-col h-full group">
                                {charity.is_featured && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <Badge variant="impact">Featured</Badge>
                                    </div>
                                )}

                                <div className="h-32 bg-[var(--color-surface-hover)] flex items-center justify-center relative overflow-hidden">
                                    {charity.logo_url ? (
                                        <img src={charity.logo_url} alt={charity.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    ) : (
                                        <Heart className="w-8 h-8 text-[var(--color-impact)]/40" />
                                    )}
                                </div>

                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--color-impact)] transition-colors line-clamp-1">{charity.name}</h3>
                                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-6 line-clamp-3 flex-1">
                                        {charity.description}
                                    </p>

                                    <Link href={`/charities/${charity.slug}`} className="mt-auto">
                                        <Button variant="secondary" className="w-full justify-between group-hover:border-[var(--color-impact)] transition-colors">
                                            Learn more
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}

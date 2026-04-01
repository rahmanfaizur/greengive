import Link from 'next/link'
import { Heart, Search } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

// placeholder charities — replaced by real Supabase data in Phase 7
const charities = [
    { slug: 'macmillan', name: 'Macmillan Cancer Support', desc: 'Supporting people living with cancer', category: 'Health' },
    { slug: 'age-uk', name: 'Age UK', desc: 'Improving later life for everyone', category: 'Social' },
    { slug: 'british-heart', name: 'British Heart Foundation', desc: 'Fighting heart and circulatory disease', category: 'Health' },
    { slug: 'mind', name: 'Mind', desc: 'Mental health support and awareness', category: 'Mental Health' },
    { slug: 'shelter', name: 'Shelter', desc: 'Fighting the housing emergency', category: 'Housing' },
    { slug: 'rspca', name: 'RSPCA', desc: 'Preventing cruelty to animals', category: 'Animals' },
]

export default function CharitiesPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 max-w-6xl mx-auto px-4 sm:px-6 pb-24">
                <div className="mb-10">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-3">Our charities</h1>
                    <p className="text-[var(--color-text-muted)] max-w-lg">
                        Every verified charity on GreenGive receives monthly contributions from their supporters. Pick one when you sign up.
                    </p>
                </div>

                {/* search — wired up with real data in Phase 7 */}
                <div className="relative max-w-sm mb-10">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                    <input
                        type="search"
                        placeholder="Search charities..."
                        className="w-full pl-9 pr-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]"
                    />
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {charities.map((c) => (
                        <Link
                            key={c.slug}
                            href={`/charities/${c.slug}`}
                            className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 hover:border-[var(--color-impact)]/40 transition-all duration-200"
                        >
                            <div className="w-10 h-10 rounded-xl bg-[var(--color-impact-muted)] flex items-center justify-center mb-4">
                                <Heart className="w-5 h-5 text-[var(--color-impact)]" />
                            </div>
                            <span className="text-xs text-[var(--color-text-muted)] mb-1 block">{c.category}</span>
                            <h2 className="font-semibold mb-1 group-hover:text-[var(--color-impact)] transition-colors">{c.name}</h2>
                            <p className="text-sm text-[var(--color-text-muted)]">{c.desc}</p>
                        </Link>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    )
}

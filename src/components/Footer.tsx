import Link from 'next/link'
import { Heart } from 'lucide-react'

export function Footer() {
    return (
        <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] mt-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="col-span-2 md:col-span-1">
                    <div className="font-bold text-lg mb-2">
                        <span className="text-[var(--color-text)]">Green</span>
                        <span className="text-[var(--color-impact)]">Give</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                        Golf meets charity. Your scores enter monthly prize draws and fund the causes you care about.
                    </p>
                </div>

                <div>
                    <p className="text-xs font-semibold text-[var(--color-text)] uppercase tracking-wider mb-3">Platform</p>
                    <ul className="space-y-2">
                        {[['How it works', '/how-it-works'], ['Pricing', '/pricing'], ['Charities', '/charities']].map(([label, href]) => (
                            <li key={href}>
                                <Link href={href} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <p className="text-xs font-semibold text-[var(--color-text)] uppercase tracking-wider mb-3">Account</p>
                    <ul className="space-y-2">
                        {[['Sign up', '/signup'], ['Log in', '/login'], ['Dashboard', '/dashboard']].map(([label, href]) => (
                            <li key={href}>
                                <Link href={href} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <p className="text-xs font-semibold text-[var(--color-text)] uppercase tracking-wider mb-3">Legal</p>
                    <ul className="space-y-2">
                        {[['Privacy', '/privacy'], ['Terms', '/terms']].map(([label, href]) => (
                            <li key={href}>
                                <Link href={href} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="border-t border-[var(--color-border)] max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                <p className="text-xs text-[var(--color-text-muted)]">© {new Date().getFullYear()} GreenGive</p>
                <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                    Made with <Heart className="w-3 h-3 text-[var(--color-impact)]" /> for charity
                </p>
            </div>
        </footer>
    )
}

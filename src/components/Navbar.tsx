'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui'

const links = [
    { href: '/how-it-works', label: 'How it works' },
    { href: '/charities', label: 'Charities' },
    { href: '/pricing', label: 'Pricing' },
]

export function Navbar() {
    const [open, setOpen] = useState(false)

    return (
        <header className="fixed top-0 left-0 right-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="font-bold text-xl tracking-tight">
                        <span className="text-[var(--color-text)]">Green</span>
                        <span className="text-[var(--color-impact)]">Give</span>
                    </Link>

                    {/* desktop nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        {links.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                            >
                                {l.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/login">
                            <Button variant="ghost" size="sm">Log in</Button>
                        </Link>
                        <Link href="/signup">
                            <Button size="sm">Get started</Button>
                        </Link>
                    </div>

                    {/* mobile toggle */}
                    <button
                        className="md:hidden text-[var(--color-text-muted)]"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* mobile menu */}
            {open && (
                <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-4 flex flex-col gap-3">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                        >
                            {l.label}
                        </Link>
                    ))}
                    <div className="flex gap-2 pt-2">
                        <Link href="/login" className="flex-1">
                            <Button variant="secondary" size="sm" className="w-full">Log in</Button>
                        </Link>
                        <Link href="/signup" className="flex-1">
                            <Button size="sm" className="w-full">Get started</Button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}

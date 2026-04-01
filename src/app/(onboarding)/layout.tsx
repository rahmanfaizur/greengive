import type { Metadata } from 'next'
import { ToastProvider } from '@/components/ui'

export const metadata: Metadata = {
    title: 'Welcome to GreenGive',
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
            <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <span className="font-bold text-lg tracking-tight">
                        <span className="text-[var(--color-text)]">Green</span>
                        <span className="text-[var(--color-impact)]">Give</span>
                    </span>
                    <span className="text-xs font-medium text-[var(--color-text-subtle)] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-full px-3 py-1">
                        Setup
                    </span>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
                {children}
            </main>

            <ToastProvider />
        </div>
    )
}

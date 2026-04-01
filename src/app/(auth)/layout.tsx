import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sign in',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <a href="/" className="block text-center font-bold text-2xl mb-8">
                    <span className="text-[var(--color-text)]">Green</span>
                    <span className="text-[var(--color-impact)]">Give</span>
                </a>
                {children}
            </div>
        </div>
    )
}

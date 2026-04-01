import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LayoutDashboard, Award, Settings, LogOut } from 'lucide-react'
import { ToastProvider } from '@/components/ui'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const navItems = [
        { label: 'Overview', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: 'History & Prizes', href: '/dashboard/history', icon: <Award className="w-4 h-4" /> },
        { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-4 h-4" /> },
    ]

    return (
        <div className="min-h-screen bg-[var(--color-bg)] flex flex-col md:flex-row">
            {/* Sidebar (desktop) / Topbar (mobile) */}
            <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--color-border)] bg-[var(--color-surface)] flex-shrink-0">
                <div className="p-6">
                    <Link href="/" className="font-bold text-xl tracking-tight block mb-8">
                        <span className="text-[var(--color-text)]">Green</span>
                        <span className="text-[var(--color-impact)]">Give</span>
                    </Link>

                    <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors whitespace-nowrap"
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="hidden md:block p-6 mt-auto">
                    <form action="/auth/logout" method="post">
                        <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors w-full">
                            <LogOut className="w-4 h-4" />
                            Sign out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-4 sm:p-8 max-w-5xl">
                {children}
            </main>

            <ToastProvider />
        </div>
    )
}

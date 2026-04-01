import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LayoutDashboard, Users, Heart, Trophy, LogOut, Settings, BarChart } from 'lucide-react'
import { ToastProvider } from '@/components/ui'

export const metadata = { title: 'Admin | GreenGive' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase.from('users') as any).select('role').eq('id', user.id).single()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((profile as any)?.role !== 'admin') redirect('/dashboard')

    const navItems = [
        { label: 'Overview', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: 'Charities', href: '/admin/charities', icon: <Heart className="w-4 h-4" /> },
        { label: 'Draws & Winners', href: '/admin/draws', icon: <Trophy className="w-4 h-4" /> },
        { label: 'Users', href: '/admin/users', icon: <Users className="w-4 h-4" /> },
        { label: 'Reports', href: '/admin/reports', icon: <BarChart className="w-4 h-4" /> },
        { label: 'Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
    ]

    return (
        <div className="min-h-screen bg-[var(--color-bg)] flex flex-col md:flex-row">
            <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--color-border)] bg-[var(--color-surface)] flex-shrink-0">
                <div className="p-6">
                    <Link href="/" className="font-bold text-xl tracking-tight mb-8 flex items-center gap-2">
                        <div>
                            <span className="text-[var(--color-text)]">Green</span>
                            <span className="text-[var(--color-impact)]">Give</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full">
                            Admin
                        </span>
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

            <main className="flex-1 p-4 sm:p-8 max-w-7xl">
                {children}
            </main>

            <ToastProvider />
        </div>
    )
}

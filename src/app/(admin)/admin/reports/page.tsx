import { createAdminClient } from '@/lib/supabase/server'
import { Card, Button } from '@/components/ui'
import { Download, TrendingUp, Users, Heart } from 'lucide-react'

export const metadata = { title: 'Reports | Admin' }

export default async function AdminReportsPage() {
    const supabase = await createAdminClient()

    // Basic aggregates
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: usersRaw } = await (supabase.from('users') as any).select('id', { count: 'exact' })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: subsRaw } = await (supabase.from('subscriptions') as any).select('id', { count: 'exact' }).eq('status', 'active')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: drawsRaw } = await (supabase.from('draws') as any).select('total_pool')

    const totalUsers = usersRaw?.length || 0
    const activeSubs = subsRaw?.length || 0

    const draws: any[] = drawsRaw || []
    const allTimePool = draws.reduce((acc, d) => acc + (d.total_pool || 0), 0)

    // In a real app we'd aggregate charity_contributions table for exact numbers.
    // For demo: estimating 10% average charity slice. (Total revenue ~= Pool / 0.6)
    const totalRevenue = allTimePool / 0.6 || 0
    const estimatedCharity = totalRevenue * 0.1 || 0

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
                    <p className="text-[var(--color-text-muted)]">High-level financial and engagement overview.</p>
                </div>
                <form action="/api/admin/export-csv" method="POST">
                    <Button variant="secondary" type="submit" className="gap-2"><Download className="w-4 h-4" /> Export Full DB (CSV)</Button>
                </form>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-muted)] text-[var(--color-accent)] flex items-center justify-center mb-4">
                        <Users className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium text-[var(--color-text-muted)] mb-1">Total Users</p>
                    <p className="text-2xl font-bold">{totalUsers}</p>
                </Card>

                <Card className="p-6">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium text-[var(--color-text-muted)] mb-1">Active Subscribers</p>
                    <p className="text-2xl font-bold">{activeSubs}</p>
                </Card>

                <Card className="p-6">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-impact-muted)] text-[var(--color-impact)] flex items-center justify-center mb-4">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium text-[var(--color-text-muted)] mb-1">All-Time Prize Pool</p>
                    <p className="text-2xl font-bold">£{allTimePool.toFixed(2)}</p>
                </Card>

                <Card className="p-6">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center mb-4">
                        <Heart className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium text-[var(--color-text-muted)] mb-1">Est. Charity Impact</p>
                    <p className="text-2xl font-bold">£{estimatedCharity.toFixed(2)}</p>
                </Card>
            </div>

            <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Export Tools</h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-6">
                    You can securely export all core database tables (Users, Subscriptions, Contributions) to CSV format for external auditing or accounting software ingestion.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Button variant="secondary" className="gap-2 text-xs h-8">Users.csv</Button>
                    <Button variant="secondary" className="gap-2 text-xs h-8">Draws.csv</Button>
                    <Button variant="secondary" className="gap-2 text-xs h-8">Charity_Splits.csv</Button>
                </div>
            </Card>
        </div>
    )
}

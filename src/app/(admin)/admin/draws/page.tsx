import { createAdminClient } from '@/lib/supabase/server'
import { Card, Badge, Button } from '@/components/ui'
import Link from 'next/link'
import { Calendar, Eye } from 'lucide-react'

export const metadata = { title: 'Manage Draws | Admin' }

export default async function AdminDrawsPage() {
    const supabase = await createAdminClient()

    // Fetch draws with their winners count
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: draws } = await (supabase.from('draws') as any)
        .select('*, winners(count)')
        .order('month', { ascending: false })

    const list: any[] = draws || []

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Draws & Verification</h1>
                    <p className="text-[var(--color-text-muted)]">Manage monthly draws and verify winner proofs here.</p>
                </div>
                <form action="/api/draw/run" method="POST">
                    <Button variant="secondary" type="submit">Manually Trigger Auto-Draw</Button>
                </form>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[var(--color-surface)] border-b border-[var(--color-border)] uppercase text-[10px] tracking-wider text-[var(--color-text-muted)]">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Month</th>
                                <th className="px-6 py-4 font-semibold">Numbers</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Total Pool</th>
                                <th className="px-6 py-4 font-semibold">Winners</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {list.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-[var(--color-text-muted)]">
                                        No draws found. Wait for the cron or generate a draft manually.
                                    </td>
                                </tr>
                            ) : (
                                list.map((draw) => (
                                    <tr key={draw.id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                                        <td className="px-6 py-4 font-medium flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-[var(--color-text-muted)]" />
                                            {draw.month}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-[var(--color-impact)]">
                                            {draw.draw_numbers.join(', ')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {draw.status === 'draft' ? <Badge variant="default">Draft</Badge> : <Badge variant="impact">Published</Badge>}
                                        </td>
                                        <td className="px-6 py-4">
                                            £{draw.total_pool.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {draw.winners[0]?.count || 0}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/admin/draws/${draw.id}`}>
                                                <Button variant="secondary" className="h-8 px-3 text-xs">
                                                    <Eye className="w-3.5 h-3.5 mr-1" /> View Details
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}

import { createAdminClient } from '@/lib/supabase/server'
import { Card, Badge, Button } from '@/components/ui'
import Link from 'next/link'
import { ExternalLink, CheckCircle2, XCircle } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function AdminDrawDetailsPage({ params }: { params: { id: string } }) {
    const supabase = await createAdminClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: drawRaw } = await (supabase.from('draws') as any)
        .select('*')
        .eq('id', params.id)
        .single()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: winnersRaw } = await (supabase.from('winners') as any)
        .select('*, users(full_name, email)')
        .eq('draw_id', params.id)
        .order('prize_amount', { ascending: false })

    const draw: any = drawRaw
    const winners: any[] = winnersRaw || []

    // Server actions for approving/rejecting
    async function verifyWinner(formData: FormData) {
        'use server'
        const winnerId = formData.get('winnerId') as string
        const action = formData.get('action') as 'approve' | 'reject'
        const status = action === 'approve' ? 'verified' : 'rejected'

        const adminSupabase = await createAdminClient()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (adminSupabase.from('winners') as any).update({ status }).eq('id', winnerId)

        // Note: Here you would normally trigger sendEmail() to notify the user

        revalidatePath(`/admin/draws/${params.id}`)
    }

    async function publishDraw() {
        'use server'
        // A manually triggered publish hit to our own route
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/draw/publish`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${process.env.CRON_SECRET}` }
        })
        revalidatePath(`/admin/draws/${params.id}`)
        revalidatePath('/admin/draws')
    }

    if (!draw) return <div>Draw not found.</div>

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 mb-4">
                <Link href="/admin/draws" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">&larr; Back to Draws</Link>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Draw: {draw.month}</h1>
                    <p className="text-[var(--color-text-muted)]">Numbers: <strong className="text-[var(--color-impact)] font-mono">{draw.draw_numbers.join(', ')}</strong></p>
                </div>

                {draw.status === 'draft' && (
                    <form action={publishDraw}>
                        <Button variant="impact">Publish & Lock Winners</Button>
                    </form>
                )}
            </div>

            <Card className="p-6 overflow-x-auto">
                <h2 className="text-xl font-bold mb-4">Winners ({winners.length})</h2>
                <table className="w-full text-left text-sm">
                    <thead className="bg-[var(--color-surface)] border-b border-[var(--color-border)] uppercase text-[10px] tracking-wider text-[var(--color-text-muted)]">
                        <tr>
                            <th className="px-6 py-4 font-semibold">User</th>
                            <th className="px-6 py-4 font-semibold">Tier</th>
                            <th className="px-6 py-4 font-semibold">Prize</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold">Proof</th>
                            <th className="px-6 py-4 font-semibold text-right">Verification</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {winners.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-4 text-center">No winners in this draw.</td></tr>
                        ) : (
                            winners.map((w) => (
                                <tr key={w.id} className="hover:bg-[var(--color-surface-hover)]">
                                    <td className="px-6 py-4 font-medium">
                                        <div>{w.users?.full_name || 'Anonymous User'}</div>
                                        <div className="text-xs text-[var(--color-text-muted)] font-normal">{w.users?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 uppercase font-mono text-xs tracking-wider">{w.prize_tier}</td>
                                    <td className="px-6 py-4 text-[var(--color-accent)] font-medium">£{w.prize_amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        {w.status === 'pending_verification' && <Badge variant="warning">Pending</Badge>}
                                        {w.status === 'verified' && <Badge variant="impact">Verified</Badge>}
                                        {w.status === 'rejected' && <Badge variant="lapsed">Rejected</Badge>}
                                    </td>
                                    <td className="px-6 py-4">
                                        {w.proof_url ? (
                                            <a href={w.proof_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[var(--color-impact)] hover:underline">
                                                View <ExternalLink className="w-3 h-3" />
                                            </a>
                                        ) : (
                                            <span className="text-[var(--color-text-muted)] italic text-xs">Not uploaded</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {w.status === 'pending_verification' && w.proof_url && (
                                            <form action={verifyWinner} className="flex justify-end gap-2">
                                                <input type="hidden" name="winnerId" value={w.id} />
                                                <button type="submit" name="action" value="approve" className="p-1.5 rounded-md bg-green-500/10 text-green-500 hover:bg-green-500/20" title="Approve">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </button>
                                                <button type="submit" name="action" value="reject" className="p-1.5 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20" title="Reject">
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            </form>
                                        )}
                                        {w.status === 'verified' && <span className="text-xs text-green-500 font-medium">Approved</span>}
                                        {w.status === 'rejected' && <span className="text-xs text-red-500 font-medium">Rejected</span>}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    )
}

import { createAdminClient } from '@/lib/supabase/server'
import { Card, Badge, Button } from '@/components/ui'
import { CheckCircle2, XCircle } from 'lucide-react'

export const metadata = { title: 'Manage Users | Admin' }

export default async function AdminUsersPage() {
    const supabase = await createAdminClient()

    // Fetch users and their sub status
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: usersRaw } = await (supabase.from('users') as any)
        .select('*, subscriptions(status, plan, current_period_end)')
        .order('created_at', { ascending: false })

    const list: any[] = usersRaw || []

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Users</h1>
                <p className="text-[var(--color-text-muted)]">View all registered users and their subscription status.</p>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[var(--color-surface)] border-b border-[var(--color-border)] uppercase text-[10px] tracking-wider text-[var(--color-text-muted)]">
                            <tr>
                                <th className="px-6 py-4 font-semibold">User</th>
                                <th className="px-6 py-4 font-semibold">Role</th>
                                <th className="px-6 py-4 font-semibold">Subscription</th>
                                <th className="px-6 py-4 font-semibold">Plan</th>
                                <th className="px-6 py-4 font-semibold">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {list.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-[var(--color-text-muted)]">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                list.map((u) => {
                                    const sub = u.subscriptions?.[0]
                                    return (
                                        <tr key={u.id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                                            <td className="px-6 py-4 font-medium">
                                                <div>{u.full_name || 'No Name'}</div>
                                                <div className="text-xs text-[var(--color-text-muted)] font-normal">{u.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {u.role === 'admin' ? (
                                                    <Badge variant="impact">Admin</Badge>
                                                ) : (
                                                    <span className="text-xs text-[var(--color-text-muted)]">Member</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {sub?.status === 'active' ? (
                                                    <div className="flex items-center gap-1.5 text-green-500 font-medium">
                                                        <CheckCircle2 className="w-4 h-4" /> Active
                                                    </div>
                                                ) : sub?.status === 'canceled' ? (
                                                    <div className="flex items-center gap-1.5 text-red-400">
                                                        <XCircle className="w-4 h-4" /> Canceled
                                                    </div>
                                                ) : (
                                                    <div className="text-[var(--color-text-muted)]">None</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 uppercase font-mono text-xs tracking-wider">
                                                {sub?.plan || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-[var(--color-text-muted)]">
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}

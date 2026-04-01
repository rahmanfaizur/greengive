import { createAdminClient } from '@/lib/supabase/server'
import { CharityForm } from './CharityForm'
import { Card, Badge, Button } from '@/components/ui'
import { deleteCharity, toggleCharityStatus } from './actions'

export const metadata = { title: 'Manage Charities | Admin' }

export default async function AdminCharitiesPage() {
    const supabase = await createAdminClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: charities } = await (supabase.from('charities') as any)
        .select('*')
        .order('created_at', { ascending: false })

    const list: any[] = charities || []

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Charities</h1>
                <p className="text-[var(--color-text-muted)]">Manage the charities your subscribers can donate to.</p>
            </div>

            <CharityForm />

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[var(--color-surface)] border-b border-[var(--color-border)] uppercase text-[10px] tracking-wider text-[var(--color-text-muted)]">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Name</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Featured</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {!charities || charities.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-[var(--color-text-muted)]">
                                        No charities found. Add your first one above.
                                    </td>
                                </tr>
                            ) : (
                                list.map((charity) => (
                                    <tr key={charity.id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                                        <td className="px-6 py-4 font-medium">
                                            <div>{charity.name}</div>
                                            <div className="text-xs text-[var(--color-text-muted)] font-normal">{charity.slug}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <form action={async () => {
                                                'use server'
                                                await toggleCharityStatus(charity.id, charity.is_active || false)
                                            }}>
                                                <button type="submit">
                                                    {charity.is_active ? (
                                                        <Badge variant="impact">Active</Badge>
                                                    ) : (
                                                        <Badge variant="outline">Hidden</Badge>
                                                    )}
                                                </button>
                                            </form>
                                        </td>
                                        <td className="px-6 py-4">
                                            {charity.is_featured ? 'Yes' : 'No'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <form action={async () => {
                                                'use server'
                                                await deleteCharity(charity.id)
                                            }}>
                                                <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 px-3 text-xs">
                                                    Delete
                                                </Button>
                                            </form>
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

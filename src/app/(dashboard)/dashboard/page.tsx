import { createClient } from '@/lib/supabase/server'
import { ScoreForm } from './ScoreForm'
import { deleteScore } from './actions'
import { Trash2, Heart, Trophy } from 'lucide-react'

export const metadata = { title: 'Dashboard | GreenGive' }

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch the latest 5 scores
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: scoresRaw } = await (supabase.from('scores') as any)
        .select('*')
        .eq('user_id', user!.id)
        .order('played_at', { ascending: false })
        .order('created_at', { ascending: false })

    const scores: any[] = scoresRaw || []

    // Fetch subscription info
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: sub } = await (supabase.from('subscriptions') as any)
        .select('charity_id, charity_percentage')
        .eq('user_id', user!.id)
        .single()

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
                <p className="text-[var(--color-text-muted)]">
                    Manage your entries and see your impact.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Main Column: Scores */}
                <div className="md:col-span-2 space-y-6">
                    <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-1">Your Rolling 5</h2>
                            <p className="text-sm text-[var(--color-text-muted)]">
                                Enter your Stableford scores below. We automatically keep your 5 most recent rounds as your entry for the monthly draw.
                            </p>
                        </div>

                        <ScoreForm />

                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                                Current Draw Numbers
                            </h3>

                            {(!scores || scores.length === 0) ? (
                                <div className="py-8 text-center bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] border-dashed">
                                    <p className="text-sm text-[var(--color-text-muted)]">No scores entered yet. Log your first round above!</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {scores.map((s, i) => (
                                        <div key={s.id} className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                                <span className="w-8 flex-shrink-0 text-sm font-bold text-[var(--color-text-subtle)]">
                                                    0{i + 1}
                                                </span>
                                                <span className="text-2xl font-bold text-[var(--color-impact)]">
                                                    {s.stableford_score}
                                                </span>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-[var(--color-text-muted)]">Played on</span>
                                                    <span className="text-sm font-medium">{new Date(s.played_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <form action={async () => {
                                                'use server'
                                                await deleteScore(s.id)
                                            }}>
                                                <button type="submit" className="p-2 text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </form>
                                        </div>
                                    ))}

                                    {scores.length < 5 && (
                                        <div className="mt-4 p-3 rounded-lg bg-[var(--color-accent-muted)] border border-[var(--color-accent)]/20 text-xs text-[var(--color-accent)]">
                                            You need {5 - scores.length} more scores for a full 5-number draw entry. Until then, any scores you have will still be entered into the draw.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Current Draw Info */}
                    <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,rgba(108,99,255,0.1)_0%,transparent_60%)]" />

                        <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-muted)] text-[var(--color-accent)] flex items-center justify-center mb-4">
                            <Trophy className="w-5 h-5" />
                        </div>
                        <h2 className="font-semibold mb-1">Next Draw</h2>
                        <p className="text-sm text-[var(--color-text-muted)] mb-5">
                            The next monthly draw will take place on the <strong className="text-[var(--color-text)]">1st of next month</strong>. Match your rolling 5 to win!
                        </p>
                        <div className="p-3 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
                            <p className="text-xs text-[var(--color-text-muted)] mb-1">Current estimated jackpot</p>
                            <p className="text-xl font-bold text-[var(--color-accent)]">£1,250.00</p>
                        </div>
                    </section>

                    {/* Charity Impact */}
                    <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,rgba(0,212,170,0.1)_0%,transparent_60%)]" />

                        <div className="w-10 h-10 rounded-xl bg-[var(--color-impact-muted)] text-[var(--color-impact)] flex items-center justify-center mb-4">
                            <Heart className="w-5 h-5" />
                        </div>
                        <h2 className="font-semibold mb-1">Your Impact</h2>
                        <p className="text-sm text-[var(--color-text-muted)] mb-5">
                            You are currently donating <strong className="text-[var(--color-text)]">{sub?.charity_percentage || 10}%</strong> of your subscription directly to charity.
                        </p>

                        <div className="border-t border-[var(--color-border)] pt-4 mt-4 text-center">
                            <button disabled className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                Change charity or % in Settings
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

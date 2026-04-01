'use client'

import { useState } from 'react'
import { Card, Button, Badge, toast } from '@/components/ui'
import { Trophy, UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react'
import { uploadWinnerProof } from './actions'

interface WinnerBannerProps {
    winner: {
        id: string
        draw_id: string
        prize_tier: string
        prize_amount: number
        status: string
        proof_url: string | null
        draws: { month: string }
    }
}

export function WinnerBanner({ winner }: WinnerBannerProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        // Basic client validation
        if (file.size > 5 * 1024 * 1024) {
            setError('File must be less than 5MB')
            return
        }
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image (JPG/PNG)')
            return
        }

        setLoading(true)
        setError('')

        const formData = new FormData()
        formData.append('file', file)
        formData.append('winnerId', winner.id)

        const res = await uploadWinnerProof(formData)

        if (res?.error) {
            setError(res.error)
        } else {
            toast('Proof uploaded successfully. Our team will verify it shortly.')
        }

        setLoading(false)
    }

    return (
        <Card className="bg-[var(--color-accent-muted)] border-[var(--color-accent)]/20 p-6 relative overflow-hidden mb-8">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_top_right,rgba(108,99,255,0.15)_0%,transparent_60%)]" />

            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between relative z-10">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-6 h-6 text-[var(--color-accent)]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                            Congratulations! You're a winner!
                            {winner.status === 'pending_verification' && <Badge variant="warning">Action Required</Badge>}
                            {winner.status === 'verified' && <Badge variant="impact">Verified</Badge>}
                        </h2>
                        <p className="text-sm text-[var(--color-text-muted)]">
                            You matched numbers in the <strong>{winner.draws.month}</strong> draw for the <strong className="text-[var(--color-text)] uppercase">{winner.prize_tier}</strong> tier.
                            Your estimated prize is <strong className="text-[var(--color-accent)]">£{winner.prize_amount.toFixed(2)}</strong>.
                        </p>
                    </div>
                </div>

                <div className="flex-shrink-0">
                    {winner.status === 'pending_verification' && !winner.proof_url ? (
                        <div className="space-y-2 text-right">
                            <input
                                type="file"
                                id="proof-upload"
                                accept="image/*"
                                className="hidden"
                                onChange={handleUpload}
                                disabled={loading}
                            />
                            <Button type="button" variant="impact" loading={loading} className="w-full md:w-auto p-0">
                                <label htmlFor="proof-upload" className="flex items-center justify-center w-full h-full px-4 py-2 cursor-pointer">
                                    <UploadCloud className="w-4 h-4 mr-2" />
                                    {loading ? 'Uploading...' : 'Upload Scorecard Proof'}
                                </label>
                            </Button>
                            {error && <p className="text-xs text-red-500 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
                        </div>
                    ) : winner.status === 'pending_verification' && winner.proof_url ? (
                        <div className="text-sm font-medium px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            Proof uploaded, awaiting admin review
                        </div>
                    ) : winner.status === 'verified' ? (
                        <div className="text-sm font-medium px-4 py-2 rounded-lg bg-green-500/10 text-green-600 border border-green-500/20 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Prize approved! Payment processing.
                        </div>
                    ) : null}
                </div>
            </div>
        </Card>
    )
}

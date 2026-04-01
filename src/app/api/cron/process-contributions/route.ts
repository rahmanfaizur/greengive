import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

const MONTHLY_PRICE = 9.99
const YEARLY_MONTHLY_EQUIVALENT = 99.00 / 12

/**
 * Calculates how much each charity is owed for the current month based on active
 * subscriptions and their individual charity_percentage allocations.
 */
export async function POST(req: Request) {
    try {
        const supabase = await createAdminClient()
        const authHeader = req.headers.get('authorization')

        // Very basic cron protection
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const currentPeriod = new Date().toISOString().substring(0, 7) // YYYY-MM

        // Check if we already processed this month
        const { data: existing } = await supabase
            .from('charity_contributions')
            .select('id')
            .eq('period', currentPeriod)
            .limit(1)

        if (existing && existing.length > 0) {
            return NextResponse.json({ error: 'Contributions already processed for this period' }, { status: 400 })
        }

        // 1. Fetch all active subscriptions
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: subs } = await (supabase.from('subscriptions') as any)
            .select('user_id, plan, charity_id, charity_percentage')
            .eq('status', 'active')
            .not('charity_id', 'is', null)

        if (!subs || subs.length === 0) {
            return NextResponse.json({ success: true, message: 'No active subscriptions found.' })
        }

        // 2. Aggregate totals per charity
        const charityTotals = new Map<string, number>()
        const contributions = []

        for (const sub of subs) {
            const revenue = sub.plan === 'monthly' ? MONTHLY_PRICE : YEARLY_MONTHLY_EQUIVALENT
            // Safely apply percentage (e.g., 10% = 0.1)
            const pct = (sub.charity_percentage || 10) / 100
            const amountForCharity = revenue * pct

            contributions.push({
                user_id: sub.user_id,
                charity_id: sub.charity_id,
                amount: parseFloat(amountForCharity.toFixed(2)),
                period: currentPeriod,
                source: 'subscription'
            })

            const current = charityTotals.get(sub.charity_id) || 0
            charityTotals.set(sub.charity_id, current + amountForCharity)
        }

        // 3. Batch insert the contribution records
        const CHUNK_SIZE = 500
        for (let i = 0; i < contributions.length; i += CHUNK_SIZE) {
            const chunk = contributions.slice(i, i + CHUNK_SIZE)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase.from('charity_contributions') as any).insert(chunk)
            if (error) {
                console.error('Failed to insert chunk:', error)
            }
        }

        // Convert map to plain object for response JSON
        const totalsResponse = Object.fromEntries(charityTotals)

        return NextResponse.json({
            success: true,
            period: currentPeriod,
            recordsProcessed: contributions.length,
            charityTotals: totalsResponse
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

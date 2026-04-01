import { createAdminClient } from '@/lib/supabase/server'
import { calculateJackpotRollover } from './jackpot'

const MONTHLY_PRICE = 9.99
const YEARLY_MONTHLY_EQUIVALENT = 99.00 / 12
const PRIZE_POOL_PERCENTAGE = 0.60

// The distribution of the prize pool among the winning tiers
const TIER_SPLITS = {
    MATCH_5: 0.50, // 50% of the pool goes to the jackpot
    MATCH_4: 0.30, // 30% to 4 matches
    MATCH_3: 0.20, // 20% to 3 matches
}

export async function processDrawPublish(drawId: string, month: string, drawNumbers: number[]) {
    const supabase = await createAdminClient()

    // 1. Evaluate all active subscribers and their scores
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: activeSubs } = await (supabase.from('subscriptions') as any)
        .select('user_id, plan')
        .eq('status', 'active')

    let totalMonthlyRevenue = 0
    const entries = []

    if (activeSubs) {
        for (const sub of activeSubs) {
            // Calculate revenue contribution
            const rev = (sub as any).plan === 'monthly' ? MONTHLY_PRICE : YEARLY_MONTHLY_EQUIVALENT
            totalMonthlyRevenue += rev

            // Get their 5 latest scores
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: scores } = await (supabase.from('scores') as any)
                .select('stableford_score')
                .eq('user_id', (sub as any).user_id)
                .order('played_at', { ascending: false })
                .order('created_at', { ascending: false })
                .limit(5)

            if (scores && scores.length > 0) {
                // Evaluate matches
                let matchedCount = 0
                const userNumbers = scores.map((s: any) => s.stableford_score)

                // A user might have fewer than 5 scores, they still count as entries but with lower odds
                for (const drawNum of drawNumbers) {
                    if (userNumbers.includes(drawNum)) {
                        matchedCount++
                    }
                }

                let tier = 'none'
                if (matchedCount === 5) tier = '5match'
                if (matchedCount === 4) tier = '4match'
                if (matchedCount === 3) tier = '3match'

                entries.push({
                    draw_id: drawId,
                    user_id: (sub as any).user_id,
                    matched_count: matchedCount,
                    tier,
                })
            }
        }
    }

    // Insert all entries
    if (entries.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('draw_entries') as any).insert(entries)
    }

    // 2. Calculate Prize Pool
    const newPoolMoney = totalMonthlyRevenue * PRIZE_POOL_PERCENTAGE
    const rollover = await calculateJackpotRollover(month)

    const pool5 = (newPoolMoney * TIER_SPLITS.MATCH_5) + rollover
    const pool4 = newPoolMoney * TIER_SPLITS.MATCH_4
    const pool3 = newPoolMoney * TIER_SPLITS.MATCH_3
    const totalPool = pool5 + pool4 + pool3

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('prize_pools') as any).insert({
        draw_id: drawId,
        total_pool: totalPool,
        five_match_pool: pool5,
        four_match_pool: pool4,
        three_match_pool: pool3,
        jackpot_rollover_amount: rollover,
    })

    // 3. Generate Winners
    const winners = []

    // Count how many people are in each tier to split the pot
    const match5Count = entries.filter((e) => e.tier === '5match').length
    const match4Count = entries.filter((e) => e.tier === '4match').length
    const match3Count = entries.filter((e) => e.tier === '3match').length

    const payout5 = match5Count > 0 ? (pool5 / match5Count) : 0
    const payout4 = match4Count > 0 ? (pool4 / match4Count) : 0
    const payout3 = match3Count > 0 ? (pool3 / match3Count) : 0

    for (const entry of entries) {
        if (entry.tier === 'none') continue

        let amount = 0
        if (entry.tier === '5match') amount = payout5
        if (entry.tier === '4match') amount = payout4
        if (entry.tier === '3match') amount = payout3

        winners.push({
            draw_id: drawId,
            user_id: entry.user_id,
            prize_tier: entry.tier,
            prize_amount: amount,
            status: 'pending_verification',
        })
    }

    if (winners.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('winners') as any).insert(winners)
    }

    // 4. Update the draw status to published and lock in the jackpot
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('draws') as any).update({
        status: 'published',
        jackpot_carried_forward: match5Count === 0,
        jackpot_amount: pool5, // What carries to next month if nobody won
        published_at: new Date().toISOString()
    }).eq('id', drawId)

    return { success: true, newPoolMoney, rollover, winnersCount: winners.length }
}

import { createAdminClient } from '@/lib/supabase/server'

/**
 * Calculates if there is a jackpot rollover from the previous month.
 * This is used to carry forward unclaimed prize pools (e.g., if nobody matched 5 numbers).
 */
export async function calculateJackpotRollover(currentMonth: string): Promise<number> {
    const supabase = await createAdminClient()

    // Calculate previous month string (YYYY-MM)
    const [yearStr, monthStr] = currentMonth.split('-')
    let year = parseInt(yearStr)
    let month = parseInt(monthStr)

    if (month === 1) {
        month = 12
        year--
    } else {
        month--
    }

    const prevMonth = `${year}-${month.toString().padStart(2, '0')}`

    // Fetch previous draw
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: prevDraw } = await (supabase.from('draws') as any)
        .select('id, jackpot_amount, status')
        .eq('month', prevMonth)
        .single()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!prevDraw || (prevDraw as any).status !== 'published') {
        return 0 // No valid previous draw to roll over from
    }

    // Check if anyone matched 5 numbers in the previous draw
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: match5Count } = await (supabase.from('draw_entries') as any)
        .select('id', { count: 'exact', head: true })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .eq('draw_id', (prevDraw as any).id)
        .eq('matched_count', 5)

    // If nobody matched 5, the entire jackpot rolls over
    if (match5Count === 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (prevDraw as any).jackpot_amount || 0
    }

    return 0 // Reset jackpot if someone won it
}

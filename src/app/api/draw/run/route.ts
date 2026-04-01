import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { generateRandomDraw } from '@/lib/draw-engine/random'
import { generateWeightedDraw } from '@/lib/draw-engine/weighted'

// In a real app, this should be verified via a Cron Secret header
export async function POST(req: Request) {
    try {
        const supabase = await createAdminClient()
        const authHeader = req.headers.get('authorization')

        // Very basic cron protection. You should use proper Vercel Cron secrets.
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const currentMonth = new Date().toISOString().substring(0, 7)

        // Check if a published draw already exists for this month
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: existingDraw } = await (supabase.from('draws') as any)
            .select('id, status')
            .eq('month', currentMonth)
            .single()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (existingDraw && (existingDraw as any).status === 'published') {
            return NextResponse.json({ error: 'Draw already published' }, { status: 400 })
        }

        // Default to random if no config, but typically you'd fetch logic preference from platform_config
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: config } = await (supabase.from('platform_config') as any)
            .select('value')
            .eq('key', 'default_draw_logic')
            .single()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const logicType = (config as any)?.value === 'weighted' ? 'weighted' : 'random'
        const numbers = logicType === 'weighted' ? generateWeightedDraw() : generateRandomDraw()

        // Jackpots roll over from previous month if no 5-match
        // Let's calculate rollover (in Phase 6 we do the prize pool properly, here we just set the flags)
        // We will set jackpot_carried_forward = false for now until Phase 6

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: draw, error: insertError } = await (supabase.from('draws') as any).upsert({
            month: currentMonth,
            status: 'simulated', // Needs admin approval to move to 'published'!
            draw_numbers: numbers,
            logic_type: logicType,
            jackpot_carried_forward: false,
            jackpot_amount: 0
        }, { onConflict: 'month' }).select().single()

        if (insertError) throw insertError

        return NextResponse.json({ success: true, draw })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

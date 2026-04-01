import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { generateRandomDraw } from '@/lib/draw-engine/random'
import { generateWeightedDraw } from '@/lib/draw-engine/weighted'

export async function POST(req: Request) {
    try {
        const supabase = await createAdminClient()
        const body = await req.json()
        const { logicType, month } = body // e.g. { logicType: 'random', month: '2026-04' }

        if (!['random', 'weighted'].includes(logicType)) {
            return NextResponse.json({ error: 'Invalid logic type' }, { status: 400 })
        }

        // 1. Generate numbers
        const numbers = logicType === 'weighted' ? generateWeightedDraw() : generateRandomDraw()

        // 2. We can save this to draw_simulations if we had an existing draw table row,
        // but a lightweight simulation just returns the numbers to the admin UI.
        // Let's create a draft draw if it doesn't exist for the month, or just return the numbers.

        // Check if draw already published
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: existingDraw } = await (supabase.from('draws') as any)
            .select('status, id')
            .eq('month', month || new Date().toISOString().substring(0, 7))
            .single()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (existingDraw && (existingDraw as any).status === 'published') {
            return NextResponse.json({ error: 'Draw already published for this month.' }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            numbers,
            logic_type: logicType,
            month: month || new Date().toISOString().substring(0, 7)
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

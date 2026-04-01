import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { processDrawPublish } from '@/lib/draw-engine/prize-calc'

export async function POST(req: Request) {
    try {
        const supabase = await createAdminClient()
        const body = await req.json()
        const { drawId } = body

        if (!drawId) {
            return NextResponse.json({ error: 'drawId is required' }, { status: 400 })
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: draw } = await (supabase.from('draws') as any)
            .select('id, month, status, draw_numbers')
            .eq('id', drawId)
            .single()

        if (!draw) {
            return NextResponse.json({ error: 'Draw not found' }, { status: 404 })
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((draw as any).status === 'published') {
            return NextResponse.json({ error: 'Draw already published' }, { status: 400 })
        }

        // Process the draw (calculate prize pool, evaluate entries, generate winners)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await processDrawPublish(drawId, (draw as any).month, (draw as any).draw_numbers)

        return NextResponse.json({
            success: true,
            message: 'Draw successfully published and winners generated.',
            details: result
        })
    } catch (error: any) {
        console.error('Publish draw error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

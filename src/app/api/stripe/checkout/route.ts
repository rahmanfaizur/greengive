import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession, getOrCreateCustomer, PLANS } from '@/lib/stripe'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const planKey = body.plan as 'monthly' | 'yearly'
        const charityId = body.charityId as string
        const charityPct = body.charityPct as number

        if (!PLANS[planKey]) {
            return NextResponse.json({ error: 'invalid plan' }, { status: 400 })
        }
        if (!charityId || !charityPct || charityPct < 10 || charityPct > 50) {
            return NextResponse.json({ error: 'invalid charity config' }, { status: 400 })
        }

        // ensure stripe customer exists
        await getOrCreateCustomer(user.email!, user.id)

        // save choices temporarily in user meta or directly in sessions metadata
        // since we can't save to the subscriptions table until the webhook fires,
        // we'll pass it in the checkout session metadata.

        const checkoutUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`
        const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`

        const session = await createCheckoutSession(
            user.id,
            user.email!,
            PLANS[planKey].priceId,
            checkoutUrl,
            cancelUrl,
            charityId,
            charityPct
        )

        // supabase doesn't allow updating subscriptions here, waiting for stripe webhook.
        // we could insert a pending subscription row, but simpler to let webhook handle it.
        // However, we need to pass the charity config. We can update stripe subscription metadata via session:
        // we modified createCheckoutSession to accept metadata, let's pass the charity config there.

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error('Checkout error:', error)
        return NextResponse.json({ error: 'internal server error' }, { status: 500 })
    }
}

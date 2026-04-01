import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get('stripe-signature') as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    const supabase = await createAdminClient()

    try {
        switch (event.type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated': {
                const sub = event.data.object as Stripe.Subscription
                const userId = sub.metadata.userId
                const charityId = sub.metadata.charityId
                const charityPct = parseInt(sub.metadata.charityPct || '10')
                const plan = sub.items.data[0].price.id === process.env.STRIPE_MONTHLY_PRICE_ID ? 'monthly' : 'yearly'

                let status = 'lapsed'
                if (sub.status === 'active' || sub.status === 'trialing') status = 'active'
                if (sub.cancel_at_period_end) status = 'cancelled'

                if (userId) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    await (supabase.from('subscriptions') as any).upsert({
                        user_id: userId,
                        stripe_subscription_id: sub.id,
                        stripe_customer_id: sub.customer as string,
                        plan,
                        status,
                        // @ts-expect-error Stripe type doesn't know about current_period_end on object but it is there
                        current_period_end: new Date((sub.current_period_end || 0) * 1000).toISOString(),
                        ...(charityId ? { charity_id: charityId } : {}),
                        ...(charityPct ? { charity_percentage: charityPct } : {}),
                    }, { onConflict: 'stripe_subscription_id' }) // The schema has stripe_subscription_id UNIQUE.
                }
                break
            }
            case 'customer.subscription.deleted': {
                const sub = event.data.object as Stripe.Subscription
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await (supabase.from('subscriptions') as any)
                    .update({ status: 'lapsed' })
                    .eq('stripe_subscription_id', sub.id)
                break
            }
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('Webhook processing error:', error)
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
    }
}

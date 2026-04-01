import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { sum, charityId } = body

        const amount = parseInt(sum)

        if (isNaN(amount) || amount < 1) {
            return NextResponse.json({ error: 'Minimum donation is £1' }, { status: 400 })
        }

        if (!charityId) {
            return NextResponse.json({ error: 'charityId is required' }, { status: 400 })
        }

        const supabase = await createAdminClient()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: charity } = await (supabase.from('charities') as any).select('name').eq('id', charityId).single()

        if (!charity) {
            return NextResponse.json({ error: 'Charity not found' }, { status: 404 })
        }

        const checkoutUrl = `${process.env.NEXT_PUBLIC_APP_URL}/charities?donation_success=true`
        const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/charities`

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'gbp',
                        product_data: {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            name: `One-time Donation to ${(charity as any).name}`,
                            description: '100% of this one-time donation goes directly to the charity.',
                        },
                        unit_amount: amount * 100, // Stripe uses pennies
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                charityId,
                type: 'one_off_donation',
            },
            success_url: checkoutUrl,
            cancel_url: cancelUrl,
        })

        return NextResponse.json({ url: session.url })
    } catch (error: any) {
        console.error('Donation checkout error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

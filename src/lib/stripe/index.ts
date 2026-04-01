import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-03-25.dahlia',
    typescript: true,
})

export const PLANS = {
    monthly: {
        priceId: process.env.STRIPE_MONTHLY_PRICE_ID!,
        name: 'Monthly',
        amount: 999, // £9.99 in pence
        interval: 'month' as const,
    },
    yearly: {
        priceId: process.env.STRIPE_YEARLY_PRICE_ID!,
        name: 'Yearly',
        amount: 9900, // £99 in pence
        interval: 'year' as const,
    },
}

export async function createCheckoutSession(
    userId: string,
    email: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string
) {
    return stripe.checkout.sessions.create({
        customer_email: email,
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: { userId },
        subscription_data: {
            metadata: { userId },
        },
    })
}

export async function getOrCreateCustomer(email: string, userId: string) {
    const existing = await stripe.customers.list({ email, limit: 1 })
    if (existing.data.length > 0) return existing.data[0]
    return stripe.customers.create({ email, metadata: { userId } })
}

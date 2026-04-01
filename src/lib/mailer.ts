import { Resend } from 'resend'

// Safe default to prevent crashes if env var is missing during dev
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string | string[]
    subject: string
    html: string
}) {
    if (!resend) {
        console.warn(`[MAILER] Email intercepted (No RESEND_API_KEY set). To: ${to} | Subject: ${subject}`)
        return { success: true, simulated: true }
    }

    try {
        const data = await resend.emails.send({
            from: 'GreenGive <noreply@greengive.com>', // MUST BE VERIFIED IN RESEND
            to,
            subject,
            html,
        })
        return { success: true, data }
    } catch (error: any) {
        console.error('Email sending failed:', error)
        return { success: false, error }
    }
}

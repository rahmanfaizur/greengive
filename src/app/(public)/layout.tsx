import type { Metadata } from 'next'
import { ToastProvider } from '@/components/ui'

export const metadata: Metadata = {
    title: 'GreenGive — Play Golf. Win Prizes. Fund Charities.',
    description: 'Subscribe to the golf platform that gives back. Enter monthly prize draws with your Stableford scores and support the charity of your choice.',
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <ToastProvider />
        </>
    )
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import { Heart } from 'lucide-react'

export function DonateButton({ charityId }: { charityId: string }) {
    const [loading, setLoading] = useState(false)

    async function handleDonate() {
        setLoading(true)
        try {
            // In a real app you might have an input to let the user pick an amount, 
            // but for simplicity we're hardcoding a £10 one-off donation here.
            const res = await fetch('/api/stripe/donate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sum: '10', charityId }),
            })
            const data = await res.json()

            if (!res.ok) throw new Error(data.error)
            window.location.href = data.url
        } catch (err) {
            console.error(err)
            alert('Failed to start donation flow')
            setLoading(false)
        }
    }

    return (
        <Button
            variant="secondary"
            className="w-full justify-center"
            onClick={handleDonate}
            loading={loading}
            icon={<Heart className="w-4 h-4" />}
        >
            Donate £10 Now
        </Button>
    )
}

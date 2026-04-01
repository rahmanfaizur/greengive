'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Calendar, Plus } from 'lucide-react'
import { Button, Input, toast } from '@/components/ui'
import { addScore } from './actions'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" loading={pending} icon={<Plus className="w-4 h-4" />}>
            Log score
        </Button>
    )
}

export function ScoreForm() {
    const [error, setError] = useState('')

    async function clientAction(formData: FormData) {
        setError('')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: any = await addScore(formData)
        if (result?.error) {
            setError(result.error)
        } else {
            toast('Score added — your rolling 5 has been updated.')
            // form resets automatically due to action
        }
    }

    return (
        <form action={clientAction} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
                <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2 block">
                    Stableford Score
                </label>
                <Input
                    name="score"
                    type="number"
                    min="1"
                    max="45"
                    required
                    placeholder="e.g. 36"
                    className="bg-[var(--color-bg)]"
                />
            </div>

            <div className="flex-1 w-full">
                <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2 block">
                    Date Played
                </label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                    <Input
                        name="date"
                        type="date"
                        required
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="pl-9 bg-[var(--color-bg)]"
                    />
                </div>
            </div>

            <div className="w-full sm:w-auto mt-4 sm:mt-0">
                <SubmitButton />
            </div>

            {error && <p className="text-sm text-red-500 w-full basis-full mt-2">{error}</p>}
        </form>
    )
}

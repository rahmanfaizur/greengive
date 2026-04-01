'use client'

import { useRef, useState } from 'react'
import { Card, Input, Button } from '@/components/ui'
import { createCharity } from './actions'
import { toast } from '@/components/ui'

export function CharityForm() {
    const formRef = useRef<HTMLFormElement>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const res = await createCharity(formData)
        setLoading(false)

        if (res?.error) {
            toast(res.error) // Using simple string for our updated toast
        } else {
            toast('Charity added successfully.')
            formRef.current?.reset()
        }
    }

    return (
        <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Add New Charity</h2>
            <form ref={formRef} action={handleSubmit} className="space-y-4">

                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Charity Name</label>
                    <Input id="name" name="name" required placeholder="e.g. Macmillan Cancer Support" />
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Short Description</label>
                    <Input id="description" name="description" required placeholder="Brief mission statement..." />
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <input
                        type="checkbox"
                        id="is_featured"
                        name="is_featured"
                        className="w-4 h-4 rounded border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-impact)] focus:ring-[var(--color-impact)]"
                    />
                    <label htmlFor="is_featured" className="text-sm font-medium">
                        Feature this charity (shows at the top of the list)
                    </label>
                </div>

                <div className="pt-4">
                    <Button type="submit" variant="primary" loading={loading} className="w-full sm:w-auto">
                        Add Charity
                    </Button>
                </div>

            </form>
        </Card>
    )
}

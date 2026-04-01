'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'

export async function createCharity(formData: FormData) {
    const supabase = await createAdminClient()

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const is_featured = formData.get('is_featured') === 'on'

    if (!name || !description) return { error: 'Name and description required' }

    const slug = slugify(name)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('charities') as any).insert({
        name,
        slug,
        description,
        is_featured,
        is_active: true,
        events: [], // default empty
    })

    if (error) {
        // Basic unique constraint check
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((error as any).code === '23505') return { error: 'A charity with this name/slug already exists.' }
        return { error: error.message }
    }

    revalidatePath('/admin/charities')
    revalidatePath('/charities')
    return { success: true }
}

export async function toggleCharityStatus(id: string, currentStatus: boolean) {
    const supabase = await createAdminClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('charities') as any).update({ is_active: !currentStatus }).eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/charities')
    revalidatePath('/charities')
    return { success: true }
}

export async function deleteCharity(id: string) {
    const supabase = await createAdminClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('charities') as any).delete().eq('id', id)
    if (error) return { error: 'Cannot delete charity (might have existing contributions).' }
    revalidatePath('/admin/charities')
    revalidatePath('/charities')
    return { success: true }
}

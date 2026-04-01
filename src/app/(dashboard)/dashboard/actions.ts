'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addScore(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const score = parseInt(formData.get('score') as string)
    const datePlayed = formData.get('date') as string

    if (isNaN(score) || score < 1 || score > 45) {
        return { error: 'Score must be between 1 and 45' }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('scores') as any).insert({
        user_id: user.id,
        stableford_score: score,
        played_at: datePlayed,
    })

    // The DB trigger `enforce_rolling_five_scores` automatically removes oldest if > 5

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    return { success: true }
}

export async function deleteScore(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('scores')
        .delete()
        .match({ id, user_id: user.id })

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    return { success: true }
}

export async function uploadWinnerProof(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const file = formData.get('file') as File
    const winnerId = formData.get('winnerId') as string

    if (!file || !winnerId) return { error: 'Missing file or winner ID' }

    // Upload to Supabase Storage bucket 'winner_proofs'
    const ext = file.name.split('.').pop()
    const filename = `${winnerId}-${Date.now()}.${ext}`

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: uploadError } = await (supabase.storage as any).from('winner_proofs').upload(filename, file)
    if (uploadError) return { error: 'Failed to upload image. Please try again.' }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: urlData } = (supabase.storage as any).from('winner_proofs').getPublicUrl(filename)

    // Update the winner record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase.from('winners') as any).update({
        proof_url: urlData.publicUrl
    }).match({ id: winnerId, user_id: user.id })

    if (updateError) return { error: 'Failed to save proof URL securely.' }

    revalidatePath('/dashboard')
    return { success: true }
}

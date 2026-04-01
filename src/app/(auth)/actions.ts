'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) return { error: error.message }

    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const full_name = formData.get('full_name') as string

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
    })

    if (error) return { error: error.message }

    // create user row
    if (data.user) {
        const adminSupabase = await createAdminClient()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (adminSupabase.from('users') as any).insert({
            id: data.user.id,
            email,
            full_name,
            role: 'subscriber',
        })
    }

    const plan = formData.get('plan') as string
    const charity = formData.get('charity_slug') as string

    // redirect to onboarding with their pre-selected choices to complete checkout
    const params = new URLSearchParams()
    if (plan) params.set('plan', plan)
    if (charity) params.set('charity', charity)

    redirect(`/onboarding?${params.toString()}`)
}

export async function resetPassword(formData: FormData) {
    const email = formData.get('email') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/update-password`,
    })

    if (error) return { error: error.message }
    return { success: true }
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}

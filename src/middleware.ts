import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname

    // /admin/* needs login + admin role
    if (path.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single() as { data: { role: string } | null; error: unknown }
        if (profile?.role !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    // /onboarding needs login
    if (path.startsWith('/onboarding') && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // skip login/signup if already logged in
    if ((path === '/login' || path === '/signup') && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // /dashboard/* needs login
    if (path.startsWith('/dashboard')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        // let them into /dashboard/settings even if lapsed so they can resubscribe
        // bypass check if returning from a successful stripe checkout to avoid race condition with webhook
        if (!path.startsWith('/dashboard/settings') && request.nextUrl.searchParams.get('success') !== 'true') {
            // Check if they have an active subscription
            const { data: sub } = await supabase
                .from('subscriptions')
                .select('status')
                .eq('user_id', user.id)
                .single() as { data: { status: string } | null; error: unknown }

            if (!sub || sub.status !== 'active') {
                return NextResponse.redirect(new URL('/onboarding', request.url))
            }
        }
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}

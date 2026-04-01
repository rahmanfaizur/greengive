import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
    const supabase = await createAdminClient()

    // For a holistic backup, we could do multiple files. 
    // Let's just export users right now as the primary CSV functionality.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: users, error } = await (supabase.from('users') as any).select('*')

    if (error || !users) {
        return NextResponse.json({ error: 'Failed to export' }, { status: 500 })
    }

    // Convert JSON to CSV manually
    const headers = Object.keys(users[0] || {}).join(',')
    const rows = users.map((row: any) =>
        Object.values(row).map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
    )

    const csvFormat = [headers, ...rows].join('\n')

    return new NextResponse(csvFormat, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="users-export-${new Date().toISOString().split('T')[0]}.csv"`
        }
    })
}

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function sync() {
    console.log('Fetching users from auth...');
    const { data: users, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error('Error fetching users:', error);
        return;
    }

    console.log(`Found ${users.users.length} users. Upserting to public.users as Admin...`);

    for (const u of users.users) {
        const { error: insertErr } = await supabase.from('users').upsert({
            id: u.id,
            email: u.email,
            full_name: u.user_metadata?.full_name || 'Admin User',
            role: 'admin'
        });
        console.log(`- ${u.email}:`, insertErr ? insertErr.message : 'Success (Admin)');
    }
}

sync();

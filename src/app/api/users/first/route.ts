import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function GET() {
  const supabase = createServerClient();

  const { data: user, error: uErr } = await supabase
    .from('users')
    .select('id,email,created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (uErr || !user) return NextResponse.json({ error: uErr?.message || 'no user' }, { status: 404 });

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id,monthly_price,status,created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return NextResponse.json({ user, subscription });
}



import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  const supabase = createServerClient();
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const email: string = body?.email || `user_${Date.now()}@example.com`;
  const priceCents: number = typeof body?.monthly_price === 'number' ? body.monthly_price : 2500;

  // Insert user
  const { data: user, error: uErr } = await supabase
    .from('users')
    .insert([{ email }])
    .select('id,email,created_at')
    .single();
  if (uErr) return NextResponse.json({ error: uErr.message }, { status: 400 });

  // Insert subscription
  const { data: sub, error: sErr } = await supabase
    .from('subscriptions')
    .insert([{ user_id: user.id, monthly_price: priceCents, status: 'active' }])
    .select('id,user_id,monthly_price,status,created_at')
    .single();
  if (sErr) return NextResponse.json({ error: sErr.message }, { status: 400 });

  return NextResponse.json({ user, subscription: sub });
}

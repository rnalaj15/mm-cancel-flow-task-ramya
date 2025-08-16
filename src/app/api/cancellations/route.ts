import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

// POST /api/cancellations -> create/start a cancellation record
export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();
  const { user_id, subscription_id: incomingSubId, downsell_variant } = body;

  let subscription_id = incomingSubId as string | undefined;
  if (!subscription_id) {
    const { data: sub, error: subErr } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (subErr) return NextResponse.json({ error: subErr.message }, { status: 400 });
    subscription_id = sub?.id;
  }
  if (!subscription_id) return NextResponse.json({ error: 'subscription_id not found for user' }, { status: 400 });

  const { data, error } = await supabase
    .from('cancellations')
    .insert([
      { user_id, subscription_id, downsell_variant }
    ])
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ cancellation: data });
}

// PATCH /api/cancellations -> update fields as user progresses
export async function PATCH(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();
  const { id, ...updates } = body;

  const { data, error } = await supabase
    .from('cancellations')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ cancellation: data });
}



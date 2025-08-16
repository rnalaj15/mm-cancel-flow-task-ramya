import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

// PATCH /api/subscriptions -> mark pending_cancellation
export async function PATCH(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();
  const { id, pending_cancellation } = body;

  const { data, error } = await supabase
    .from('subscriptions')
    .update({ status: pending_cancellation ? 'pending_cancellation' : 'active' })
    .eq('id', id)
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ subscription: data });
}



import { NextResponse } from 'next/server';
import { getGroupedUsers } from '@/lib/getGroupedUsers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getGroupedUsers();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

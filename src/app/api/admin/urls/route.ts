import { NextRequest, NextResponse } from 'next/server';
import { getAllUrls } from '@/lib/db';

export async function GET(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ error: 'Admin password not configured' }, { status: 500 });
  }

  const provided = req.headers.get('x-admin-password');

  if (!provided || provided !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const urls = getAllUrls();
  return NextResponse.json({ urls });
}

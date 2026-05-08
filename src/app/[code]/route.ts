import { notFound } from 'next/navigation';
import { getUrlByCode, incrementClicks } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const row = getUrlByCode(code);

  if (!row) {
    notFound();
  }

  incrementClicks(code);

  return NextResponse.redirect(row.original_url, { status: 302 });
}

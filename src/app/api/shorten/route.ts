import { NextRequest, NextResponse } from 'next/server';
import { createShortUrl } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const code = createShortUrl(url);
    const host = req.headers.get('host') || 'localhost';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const shortUrl = `${protocol}://${host}/${code}`;

    return NextResponse.json({ shortUrl, code });
  } catch (err) {
    console.error('Shorten error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

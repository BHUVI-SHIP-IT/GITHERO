import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return new Response('Missing url parameter', { status: 400 });
  }

  // Only allow fetching from github.com and avatars.githubusercontent.com
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return new Response('Invalid URL', { status: 400 });
  }

  const allowed = ['avatars.githubusercontent.com', 'github.com', 'raw.githubusercontent.com'];
  if (!allowed.some((h) => parsed.hostname === h || parsed.hostname.endsWith('.' + h))) {
    return new Response('URL not allowed', { status: 403 });
  }

  try {
    const upstream = await fetch(url, { headers: { 'User-Agent': 'GitHero/1.0' } });
    const buffer = await upstream.arrayBuffer();
    const contentType = upstream.headers.get('content-type') || 'image/png';

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch {
    return new Response('Failed to fetch image', { status: 502 });
  }
}

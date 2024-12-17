import { NextResponse } from 'next/server';

export async function GET() {
  const username = process.env.LASTFM_USERNAME;
  const apiKey = process.env.LASTFM_API_KEY;

  if (!username || !apiKey) {
    console.error('Missing Last.fm credentials');
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json`,
      { 
        next: { revalidate: 30 },
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Last.fm API error:', response.status, errorText);
      return NextResponse.json({ error: 'Last.fm API error' }, { status: response.status });
    }

    const data = await response.json();
    
    if (!data.recenttracks?.track) {
      return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from Last.fm:', error);
    return NextResponse.json({ error: 'Failed to fetch track data' }, { status: 500 });
  }
}

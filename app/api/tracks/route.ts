import { getTrackDetails } from '@/app/actions/getTrackDetails';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

// Module-level cache that persists between requests
let currentFetch: {
  promise: Promise<any>;
  timestamp: number;
  key: string;
} | null = null;

const CACHE_DURATION = 1000; // 1 second cache

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const start = parseInt(searchParams.get('start') || '0');
  const end = parseInt(searchParams.get('end') || '50');
  
  const cacheKey = `${start}-${end}`;

  // Check if we have a valid cached response for this range
  if (currentFetch && 
      currentFetch.key === cacheKey && 
      Date.now() - currentFetch.timestamp < CACHE_DURATION) {
    console.log(`🔄 API: Returning cached tracks ${start}-${end}`);
    const response = new Response(
      JSON.stringify(await currentFetch.promise),
      {
        headers: {
          'Content-Type': 'application/json',
          // Cache for 1 minute, but allow serving stale data for up to 1 hour while revalidating
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=3600',
        },
      }
    );
    return response;
  }

  // Create new fetch promise
  const fetchPromise = (async () => {
    console.log(`🎵 API: Fetching tracks ${start}-${end}`);
    try {
      const tracks = await Promise.all(
        Array.from({ length: end - start }, (_, i) => getTrackDetails(i + start))
      );
      
      const validTracks = tracks.filter((track): track is NonNullable<typeof track> => track !== null);
      console.log(`✅ API: Got ${validTracks.length} tracks`);
      
      return validTracks;
    } catch (error) {
      console.error('❌ API: Error fetching tracks:', error);
      throw error;
    }
  })();

  // Update cache
  currentFetch = {
    promise: fetchPromise,
    timestamp: Date.now(),
    key: cacheKey
  };

  try {
    const data = await fetchPromise;
    const response = new Response(
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
          // Cache for 1 minute, but allow serving stale data for up to 1 hour while revalidating
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=3600',
        },
      }
    );
    return response;
  } catch (error) {
    return new Response('Error fetching tracks', { status: 500 });
  }
} 
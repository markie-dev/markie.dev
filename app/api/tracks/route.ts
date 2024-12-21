import { getTrackDetails } from '@/app/actions/getTrackDetails';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

// Module-level cache that persists between requests
let currentFetch: {
  promise: Promise<Response>;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 1000; // 1 second cache

export async function GET(request: NextRequest) {
  // Check if we have a valid cached response
  if (currentFetch && Date.now() - currentFetch.timestamp < CACHE_DURATION) {
    console.log('🔄 API: Returning cached response');
    return currentFetch.promise.then(r => r.clone());
  }

  // Create new fetch promise
  const fetchPromise = (async () => {
    const searchParams = request.nextUrl.searchParams;
    const start = parseInt(searchParams.get('start') || '0');
    const end = parseInt(searchParams.get('end') || '50');

    console.log(`🎵 API: Fetching tracks ${start}-${end}`);
    try {
      const tracks = await Promise.all(
        Array.from({ length: end - start }, (_, i) => getTrackDetails(i + start))
      );
      
      const validTracks = tracks.filter((track): track is NonNullable<typeof track> => track !== null);
      console.log(`✅ API: Got ${validTracks.length} tracks`);
      
      return Response.json(validTracks);
    } catch (error) {
      console.error('❌ API: Error fetching tracks:', error);
      return new Response('Error fetching tracks', { status: 500 });
    }
  })();

  // Update cache
  currentFetch = {
    promise: fetchPromise,
    timestamp: Date.now()
  };

  return fetchPromise;
} 
import { getTrackDetails } from '@/app/actions/getTrackDetails';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const index = parseInt(searchParams.get('index') || '0');
  

  try {
    const track = await getTrackDetails(index);
    
    if (!track) {
      return new Response('No more tracks', { status: 404 });
    }
    return Response.json(track);
  } catch (error) {
    console.error(`Error fetching track ${index}:`, error);
    return new Response('Error fetching track', { status: 500 });
  }
} 
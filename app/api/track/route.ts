import { getTrackDetails } from '../../actions/getTrackDetails';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start = parseInt(searchParams.get('start') || '0');
  const end = parseInt(searchParams.get('end') || '0');
  
  try {
    if (end > start) {
      // fetch multiple tracks
      const promises = [];
      for (let i = start; i < end; i++) {
        promises.push(getTrackDetails(i));
      }
      const tracks = await Promise.all(promises);
      const validTracks = tracks.filter(track => track !== null);
      return NextResponse.json(validTracks);
    } else {
      // fetch single track
      const track = await getTrackDetails(start);
      return NextResponse.json(track);
    }
  } catch (error) {
    console.error('Error fetching track(s):', error);
    return NextResponse.json(null);
  }
} 
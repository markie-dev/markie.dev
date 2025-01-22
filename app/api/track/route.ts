import { getTrackDetails } from '../../actions/getTrackDetails';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const index = parseInt(searchParams.get('index') || '0');
  
  try {
    const track = await getTrackDetails(index);
    return NextResponse.json(track);
  } catch (error) {
    console.error('Error fetching track:', error);
    return NextResponse.json(null);
  }
} 
'use server';

import { getTrackColors } from './getTrackColors';

const BASE_URL = process.env.VERCEL_ENV === 'production' 
  ? 'https://markie.dev' 
  : 'http://localhost:3000';

const DEFAULT_IMAGE = new URL('/default.webp', BASE_URL).toString();

export async function getTrackDetails(trackIndex: number) {
  const username = process.env.LASTFM_USERNAME;
  const apiKey = process.env.LASTFM_API_KEY;
  const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json`);
  if (!response.ok) return null;
  
  const data = await response.json();
  const track = data.recenttracks?.track?.[trackIndex];
  if (!track) return null;

  const albumArt = track?.image?.[3]?.['#text'] || DEFAULT_IMAGE;
  
  // Get colors and convert image to base64
  const [colors, base64Image] = await Promise.all([
    getTrackColors(albumArt),
    (async () => {
      try {
        const imageRes = await fetch(albumArt);
        if (!imageRes.ok) return null;
        
        const contentLength = parseInt(imageRes.headers.get('content-length') || '0');
        // Increased size limit to 2MB
        if (contentLength && contentLength < 2 * 1024 * 1024) {
          const buffer = Buffer.from(await imageRes.arrayBuffer());
          const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
          return `data:${contentType};base64,${buffer.toString('base64')}`;
        }
      } catch (error) {
        console.error('Failed to convert image to base64:', error);
      }
      return null;
    })()
  ]);
  
  const [color1, color2, color3, color4, color5] = colors || [];
  const trackUrl = track.url;

  return { 
    track, 
    color1, 
    color2, 
    color3, 
    color4, 
    color5, 
    trackUrl, 
    albumArt,
    base64Image
  };
}
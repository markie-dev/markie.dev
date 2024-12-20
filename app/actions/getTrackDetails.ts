'use server';

import { getTrackColors } from './getTrackColors';

export async function getTrackDetails(trackIndex: number) {
  const username = process.env.LASTFM_USERNAME;
  const apiKey = process.env.LASTFM_API_KEY;
  const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json`);
  if (!response.ok) return null;
  
  const data = await response.json();
  const track = data.recenttracks?.track?.[trackIndex];
  if (!track) return null;

  const albumArt = track.image?.[3]?.['#text'] || '/default.webp';
  const [color1, color2, color3, color4, color5] = await getTrackColors(albumArt);
  const trackUrl = track.url;
  return { track, color1, color2, color3, color4, color5, trackUrl, albumArt };
}
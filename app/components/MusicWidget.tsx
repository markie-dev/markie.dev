import { formatRelative } from 'date-fns';
import TrackTimestamp from './TrackTimestamp';

type MusicWidgetProps = {
  trackIndex?: number;
}

async function getImageColors(imageUrl: string): Promise<[string, string, string, string, string]> {
  const defaultColors: [string, string, string, string, string] = [
    'rgb(58, 58, 58)',
    'rgb(78, 78, 78)',
    'rgb(98, 98, 98)',
    'rgb(118, 118, 118)',
    'rgb(138, 138, 138)'
  ];

  try {
    const { createCanvas, loadImage } = require('@napi-rs/canvas');
    
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const image = await loadImage(buffer);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    const colors: number[][] = [];
    
    // Sample pixels at regular intervals
    for (let i = 0; i < pixels.length; i += 80) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      // Calculate HSL values
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const l = (max + min) / 510;  // Lightness
      const s = max === 0 ? 0 : (max - min) / max;  // Saturation
      
      // Only collect vibrant colors (high saturation, moderate lightness)
      if (s > 0.3 && l > 0.2 && l < 0.8) {
        colors.push([r, g, b]);
      }
    }

    // Sort colors by vibrancy (saturation * brightness)
    colors.sort((a, b) => {
      const vibrancyA = Math.max(...a) * (Math.max(...a) - Math.min(...a)) / 255;
      const vibrancyB = Math.max(...b) * (Math.max(...b) - Math.min(...b)) / 255;
      return vibrancyB - vibrancyA;
    });

    if (colors.length < 5) return defaultColors;

    // Get 5 distinct colors by taking every Nth color from the sorted array
    const step = Math.floor(colors.length / 5);
    const selectedColors = [0, 1, 2, 3, 4].map(i => 
      colors[Math.min(i * step, colors.length - 1)]
        .map(c => Math.round(Math.min(255, c * 1.1))) // Slight brightness boost
    );

    // Ensure we return exactly 5 colors with the correct type
    return selectedColors.map(color => `rgb(${color.join(',')})`) as [string, string, string, string, string];
    
  } catch (error) {
    console.error('Error extracting colors:', error);
    return defaultColors;
  }
}

// Helper functions for k-means clustering
function distance(a: number[], b: number[]): number {
  return Math.sqrt(
    Math.pow(a[0] - b[0], 2) +
    Math.pow(a[1] - b[1], 2) +
    Math.pow(a[2] - b[2], 2)
  );
}

function calculateCenter(cluster: number[][]): number[] {
  if (cluster.length === 0) return [0, 0, 0];
  return cluster.reduce((acc, color) => [
    acc[0] + color[0],
    acc[1] + color[1],
    acc[2] + color[2]
  ]).map(sum => Math.round(sum / cluster.length));
}

export default async function MusicWidget({ trackIndex = 0 }: MusicWidgetProps) {
  const ENABLE_BLUR_EFFECTS = true;
  
  const username = process.env.LASTFM_USERNAME;
  const apiKey = process.env.LASTFM_API_KEY;
  
  const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json`, { next: { revalidate: 60 } });
  if (!response.ok) return null;
  
  const data = await response.json();
  const track = data.recenttracks?.track?.[trackIndex];
  if (!track) return null;

  const albumArt = track.image?.[3]?.['#text'] || '/placeholder-album-art.png';
  const [color1, color2, color3, color4, color5] = await getImageColors(albumArt);

  const isNowPlaying = track['@attr']?.nowplaying === 'true';
  const timestamp = track.date 
    ? formatRelative(new Date(parseInt(track.date.uts) * 1000), new Date())
    : '';

  return (
    <a
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative overflow-hidden rounded-xl shadow-lg hover:scale-[1.02] transition-all duration-300"
    >
      {/* Base gradient layer with multiple color stops */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(145deg, 
            ${color1} 0%,
            ${color2} 20%,
            ${color3} 40%,
            ${color4} 60%,
            ${color5} 80%,
            ${color1} 100%
          )`,
          opacity: 0.85,
          filter: ENABLE_BLUR_EFFECTS ? 'brightness(0.7)' : 'none',
          backgroundSize: '200% 200%',
        }}
      />

      {/* Dynamic gradient overlay */}
      <div
        className="absolute inset-0 animate-gradient-fast"
        style={{
          background: `
            radial-gradient(circle at 0% 0%, ${color1}, transparent 50%),
            radial-gradient(circle at 100% 0%, ${color3}, transparent 50%),
            radial-gradient(circle at 100% 100%, ${color5}, transparent 50%),
            radial-gradient(circle at 0% 100%, ${color2}, transparent 50%)
          `,
          mixBlendMode: 'soft-light',
          opacity: ENABLE_BLUR_EFFECTS ? 0.8 : 0.5,
          backgroundSize: '200% 200%',
        }}
      />

      {/* Color accent spots */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 30% 20%, ${color4}, transparent 20%),
            radial-gradient(circle at 70% 80%, ${color2}, transparent 20%)
          `,
          opacity: 0.4,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.2] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          transform: 'scale(1.5)',
        }}
      />

      {/* Glass effect - only render if blur effects are enabled */}
      {ENABLE_BLUR_EFFECTS && (
        <div className="absolute inset-0 backdrop-blur-[2px] backdrop-brightness-105" />
      )}

      {/* Content */}
      <div className="relative p-4">
        <div className="flex items-center gap-4">
          {/* Album art with enhanced reflection */}
          <div className="shrink-0 relative">
            <img
              src={albumArt}
              alt={`${track.name} album art`}
              className="w-16 h-16 rounded-lg shadow-lg ring-1 ring-white/10"
              style={{
                boxShadow: '0 8px 20px rgb(0 0 0 / 0.3)',
              }}
            />
            <div 
              className="absolute -bottom-12 left-0 right-0 h-12 blur-sm opacity-30"
              style={{
                background: `linear-gradient(to bottom, ${color1}, transparent)`,
              }}
            />
          </div>

          <div className="flex flex-col text-white">
            <span className="text-sm font-medium opacity-90 text-white/80">
              <TrackTimestamp 
                date={track.date} 
                isNowPlaying={track['@attr']?.nowplaying === 'true'} 
              />
            </span>
            <span className="font-semibold text-lg leading-tight mt-0.5 drop-shadow-sm">
              {track.name}
            </span>
            <span className="text-sm mt-0.5 text-white/90">
              {track.artist['#text']}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

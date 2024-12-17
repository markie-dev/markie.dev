'use client'

import { useEffect, useState, useRef } from 'react';
import { MusicNote } from '@phosphor-icons/react';
import { format, formatDistanceToNow, formatRelative } from 'date-fns';
import ColorThief from 'colorthief';

type Track = {
  name: string;
  artist: {
    '#text': string;
  };
  url: string;
  image: {
    '#text': string;
    size: string;
  }[];
  date?: {
    '#text': string;
    uts: string;
  };
  '@attr'?: {
    nowplaying: string;
  };
};

type MusicWidgetProps = {
  trackIndex?: number;
}

export default function MusicWidget({ trackIndex = 0 }: MusicWidgetProps) {
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [dominantColor, setDominantColor] = useState('rgb(58, 58, 58)');
  const mounted = useRef(true);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const getDominantColor = async (imageUrl: string): Promise<string> => {
    try {
      return new Promise((resolve) => {
        if (imgRef.current) {
          imgRef.current.remove();
        }

        const img = new Image();
        imgRef.current = img;
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          try {
            const colorThief = new ColorThief();
            const palette = colorThief.getPalette(img, 8);
            
            const colorScores = palette.map(([r, g, b]) => {
              const saturation = Math.max(r, g, b) - Math.min(r, g, b);
              const brightness = (r + g + b) / 3;
              return { color: [r, g, b], saturation, brightness };
            });

            colorScores.sort((a, b) => {
              const aScore = (a.saturation * 2) - Math.abs(127 - a.brightness);
              const bScore = (b.saturation * 2) - Math.abs(127 - b.brightness);
              return bScore - aScore;
            });

            const color1 = `rgb(${colorScores[0].color.join(',')})`;
            const color2 = `rgb(${colorScores[1].color.join(',')})`;
            resolve(`linear-gradient(145deg, ${color1}, ${color2})`);
          } catch (error) {
            resolve('linear-gradient(145deg, rgb(58, 58, 58), rgb(38, 38, 38))');
          }
        };

        img.onerror = () => {
          resolve('linear-gradient(145deg, rgb(58, 58, 58), rgb(38, 38, 38))');
        };

        img.src = imageUrl;
      });
    } catch (error) {
      return 'linear-gradient(145deg, rgb(58, 58, 58), rgb(38, 38, 38))';
    }
  };

  useEffect(() => {
    mounted.current = true;
    let timeoutId: NodeJS.Timeout;

    const fetchTrack = async () => {
      if (!mounted.current) return;
      
      try {
        setLoading(true);
        const response = await fetch('/api');
        
        if (!mounted.current) return;
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        if (!mounted.current) return;
        
        if (data.recenttracks?.track?.[trackIndex]) {
          setTrack(data.recenttracks.track[trackIndex]);
          
          // Delay color extraction slightly to ensure proper image loading in Safari
          timeoutId = setTimeout(async () => {
            if (data.recenttracks.track[trackIndex].image?.[3]?.['#text'] && mounted.current) {
              const color = await getDominantColor(data.recenttracks.track[trackIndex].image[3]['#text']);
              if (mounted.current) {
                setDominantColor(color);
              }
            }
          }, 100);
        }
      } catch (error) {
        console.error('Error in fetchTrack:', error);
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    fetchTrack();
    const interval = setInterval(fetchTrack, 60000);

    return () => {
      mounted.current = false;
      clearInterval(interval);
      clearTimeout(timeoutId);
      if (imgRef.current) {
        imgRef.current.remove();
      }
    };
  }, [trackIndex]);

  useEffect(() => {
    if (!loading && track) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, track]);

  if (!track) return null;

  const isNowPlaying = track['@attr']?.nowplaying === 'true';
  const albumArt = track.image?.[3]?.['#text'] || '/placeholder-album-art.png';
  const timestamp = track.date 
    ? formatRelative(new Date(parseInt(track.date.uts) * 1000), new Date())
    : '';

  return (
    <a
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block overflow-hidden rounded-xl shadow-lg hover:scale-[1.02] transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: dominantColor,
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="p-4 flex items-center gap-4">
        <div className="shrink-0">
          <img
            src={albumArt}
            alt={`${track.name} album art`}
            className="w-16 h-16 rounded-lg shadow-md"
          />
        </div>

        <div className="flex flex-col text-white">
          <span className="text-sm opacity-80">
            {isNowPlaying ? 'Now Playing' : timestamp}
          </span>
          <span className="font-semibold text-lg leading-tight">
            {track.name}
          </span>
          <span className="text-sm opacity-90">
            {track.artist['#text']}
          </span>
        </div>

        {isNowPlaying && (
          <div className="ml-auto">
            <MusicNote size={24} weight="fill" className="animate-pulse text-white opacity-80" />
          </div>
        )}
      </div>
    </a>
  );
}

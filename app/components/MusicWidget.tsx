'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft } from '@phosphor-icons/react';
import TrackTimestamp from './TrackTimestamp';
import type { getTrackDetails } from '../actions/getTrackDetails';
import Image from 'next/image';

type MusicWidgetProps = {
  initialTracks: NonNullable<Awaited<ReturnType<typeof getTrackDetails>>>[];
}

export default function MusicWidget({ initialTracks }: MusicWidgetProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [tracks, setTracks] = useState(initialTracks);
  const [isLoading, setIsLoading] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);
  const ENABLE_BLUR_EFFECTS = true;
  const PRELOAD_THRESHOLD = 3; // Reduced since we know the limit
  const currentTrack = tracks[trackIndex];
  const touchStartX = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 50; // Minimum swipe distance to trigger navigation
  const [imageLoaded, setImageLoaded] = useState(false);

  const fetchMoreTracks = useCallback(async () => {
    if (isLoading || reachedEnd) {
      return;
    }
    setIsLoading(true);
    
    try {
      const nextIndex = tracks.length;
      
      const fetchPromises = Array.from({ length: PRELOAD_THRESHOLD }, (_, i) => {
        const index = nextIndex + i;
        if (index >= 50) {
          return Promise.resolve(null);
        }
        
        const timeLabel = `track-${index}`;
        
        return fetch(`/api/tracks?index=${index}`)
          .then(async res => {
            if (res.status === 404) {
              setReachedEnd(true);
              return null;
            }
            return res.json();
          })
          .then(track => {
            return track;
          })
          .catch(error => {
            console.error(`Failed to fetch track ${index}:`, error);
            return null;
          });
      });

      const newTracks = await Promise.all(fetchPromises);
      const validTracks = newTracks.filter(track => track !== null);
      
      if (validTracks.length === 0) {
        setReachedEnd(true);
        return;
      }
      
      setTracks(prev => [...prev, ...validTracks]);
    } catch (error) {
      console.error('Failed to fetch more tracks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [tracks.length, isLoading, reachedEnd]);

  useEffect(() => {
    const remainingTracks = tracks.length - trackIndex;
    
    if (remainingTracks <= PRELOAD_THRESHOLD && !reachedEnd) {
      fetchMoreTracks();
    }
  }, [trackIndex, tracks.length, fetchMoreTracks, reachedEnd]);

  const changeTrack = (newIndex: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setTrackIndex(newIndex);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 200);
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newIndex = trackIndex > 0 ? trackIndex - 1 : tracks.length - 1;
    changeTrack(newIndex);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newIndex = trackIndex < tracks.length - 1 ? trackIndex + 1 : 0;
    changeTrack(newIndex);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchEndX - touchStartX.current;

    if (Math.abs(swipeDistance) >= SWIPE_THRESHOLD) {
      if (swipeDistance > 0) {
        const newIndex = trackIndex > 0 ? trackIndex - 1 : tracks.length - 1;
        changeTrack(newIndex);
      } else {
        const newIndex = trackIndex < tracks.length - 1 ? trackIndex + 1 : 0;
        changeTrack(newIndex);
      }
    }
    touchStartX.current = null;
  };

  const preloadImages = useCallback((tracksToPreload: typeof tracks) => {
    tracksToPreload.forEach(track => {
      if (track?.albumArt) {
        const img = new window.Image();
        img.src = track.albumArt;
      }
    });
  }, []);

  useEffect(() => {
    const nextTracks = tracks.slice(trackIndex + 1, trackIndex + PRELOAD_THRESHOLD);
    preloadImages(nextTracks);
  }, [trackIndex, tracks, preloadImages]);

  useEffect(() => {
    setImageLoaded(false);
  }, [currentTrack.albumArt]);

  return (
    <div className="group relative hover:scale-[1.02] transition-transform duration-500 ease-out">
      {/* Previous Arrow */}
      <button
        onClick={handlePrevious}
        className={`
          absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10
          p-3 rounded-full bg-black/20 backdrop-blur-sm
          text-white/70 hover:text-white
          transition-all duration-200
          opacity-0 group-hover:opacity-100
          ${isTransitioning ? 'pointer-events-none' : ''}
        `}
        aria-label="Previous track"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Next Arrow */}
      <button
        onClick={handleNext}
        className={`
          absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-10
          p-3 rounded-full bg-black/20 backdrop-blur-sm
          text-white/70 hover:text-white
          transition-all duration-200
          opacity-0 group-hover:opacity-100
          ${isTransitioning ? 'pointer-events-none' : ''}
        `}
        aria-label="Next track"
      >
        <ArrowRight size={20} />
      </button>

      <a
        href={currentTrack.trackUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          block relative overflow-hidden rounded-xl shadow-lg 
          transition-opacity duration-200
          ${isTransitioning ? 'opacity-0' : 'opacity-100'}
        `}
        style={{
          transition: 'opacity 200ms ease-in-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Base gradient layer with multiple color stops */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(145deg, 
              ${currentTrack.color1} 0%,
              ${currentTrack.color2} 20%,
              ${currentTrack.color3} 40%,
              ${currentTrack.color4} 60%,
              ${currentTrack.color5} 80%,
              ${currentTrack.color1} 100%
            )`,
            backgroundSize: '200% 200%',
            opacity: 0.85,
            filter: ENABLE_BLUR_EFFECTS ? 'brightness(0.7)' : 'none',
          }}
        />

        {/* Dynamic gradient overlay */}
        <div
          className="absolute inset-0 animate-gradient-fast"
          style={{
            backgroundImage: `
              radial-gradient(circle at 0% 0%, ${currentTrack.color1}, transparent 50%),
              radial-gradient(circle at 100% 0%, ${currentTrack.color3}, transparent 50%),
              radial-gradient(circle at 100% 100%, ${currentTrack.color5}, transparent 50%),
              radial-gradient(circle at 0% 100%, ${currentTrack.color2}, transparent 50%)
            `,
            backgroundSize: '200% 200%',
            mixBlendMode: 'soft-light',
            opacity: ENABLE_BLUR_EFFECTS ? 0.8 : 0.5,
          }}
        />

        {/* Color accent spots */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 20%, ${currentTrack.color4}, transparent 20%),
              radial-gradient(circle at 70% 80%, ${currentTrack.color2}, transparent 20%)
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

        {/* Glass effect */}
        {ENABLE_BLUR_EFFECTS && (
          <div className="absolute inset-0 backdrop-blur-[2px] backdrop-brightness-105" />
        )}

        {/* Content */}
        <div className="relative p-4">
          <div className="flex items-center gap-4">
            {/* Album art */}
            <div className="relative shrink-0">
              <Image
                src={currentTrack.albumArt}
                alt={`${currentTrack.track.name} album art`}
                width={64}
                height={64}
                priority
                className={`
                  rounded-lg shadow-lg ring-1 ring-white/10
                  transition-opacity duration-300
                  ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                `}
                style={{
                  boxShadow: '0 8px 20px rgb(0 0 0 / 0.3)',
                }}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              )}
              <div 
                className="absolute -bottom-12 left-0 right-0 h-12 blur-sm opacity-30"
                style={{
                  background: `linear-gradient(to bottom, ${currentTrack.color1}, transparent)`,
                }}
              />
            </div>

            <div className="flex flex-col text-white min-w-0 flex-1">
              <span className="text-sm font-medium opacity-90 text-white/80">
                <TrackTimestamp 
                  date={currentTrack.track.date} 
                  isNowPlaying={currentTrack.track['@attr']?.nowplaying === 'true'} 
                />
              </span>
              <span className="font-semibold text-lg leading-tight mt-0.5 drop-shadow-sm truncate w-full max-w-[250px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[400px]">
                {currentTrack.track.name}
              </span>
              <span className="text-sm mt-0.5 text-white/90">
                {currentTrack.track.artist['#text']}
              </span>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

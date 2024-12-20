'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { ArrowRight, ArrowLeft } from '@phosphor-icons/react';
import TrackTimestamp from './TrackTimestamp';
import type { getTrackDetails } from '../actions/getTrackDetails';
import Image from 'next/image';
import { mix } from 'color2k';
import type { CSSProperties } from 'react';
import defaultAlbumArt from '@/public/default.webp';

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
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const [imageLoaded, setImageLoaded] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 50;
  const [currentColors, setCurrentColors] = useState({
    color1: initialTracks[0].color1,
    color2: initialTracks[0].color2,
    color3: initialTracks[0].color3,
    color4: initialTracks[0].color4,
    color5: initialTracks[0].color5,
  });
  const [colorProgress, setColorProgress] = useState(1);
  const [previousColors, setPreviousColors] = useState(currentColors);
  const animationRef = useRef<number | undefined>(undefined);
  const [isHovering, setIsHovering] = useState(false);

  const DEFAULT_ALBUM_ART = defaultAlbumArt.src;

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
    setTrackIndex(newIndex);
    setIsTransitioning(false);
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

  const preloadImage = useCallback((src: string) => {
    const imageUrl = src === '/default.webp' ? DEFAULT_ALBUM_ART : src;
    
    if (!imageUrl) {
      console.log('🚫 Skipping preload - No source provided');
      return Promise.resolve();
    }
    
    if (preloadedImages.has(imageUrl)) {
      console.log('✅ Image already preloaded:', imageUrl);
      return Promise.resolve();
    }

    console.log('🔄 Starting preload for:', imageUrl);
    
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        console.log('✅ Successfully preloaded:', imageUrl);
        setPreloadedImages(prev => new Set(prev).add(imageUrl));
        resolve(undefined);
      };
      img.onerror = (error) => {
        console.error('❌ Failed to preload:', imageUrl, error);
        reject(error);
      };
      img.src = imageUrl;
    });
  }, [preloadedImages]);

  useEffect(() => {
    const imagesToPreload = tracks
      .slice(trackIndex, trackIndex + PRELOAD_THRESHOLD)
      .map(track => track.albumArt)
      .filter(Boolean);

    console.log('🎵 Current track index:', trackIndex);
    console.log('🖼️ Images to preload:', imagesToPreload);

    Promise.all(imagesToPreload.map(src => preloadImage(src)))
      .then(() => console.log('✨ Finished preloading batch of images'))
      .catch(error => console.error('❌ Batch preload error:', error));
  }, [trackIndex, tracks, preloadImage]);

  useEffect(() => {
    setImageLoaded(false);
    console.log('🔄 Track changed to:', currentTrack.albumArt);
    
    // Check if it's the default album art
    const isDefaultArt = currentTrack.albumArt.includes('2a96cbd8b46e442fc41c2b86b821562f');
    
    if (isDefaultArt || preloadedImages.has(currentTrack.albumArt)) {
      console.log('✅ Image found in preloaded cache or is default art, showing immediately');
      // Add a small delay to prevent flickering
      setTimeout(() => setImageLoaded(true), 0);
    } else {
      console.log('⏳ Waiting for image to load...');
    }
  }, [currentTrack.albumArt, preloadedImages]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        handleNext(e as unknown as React.MouseEvent);
      } else {
        handlePrevious(e as unknown as React.MouseEvent);
      }
    }
    
    touchStartX.current = null;
  };

  const buttonBaseClasses = `
  absolute top-1/2 -translate-y-1/2 z-10
  p-3 rounded-full 
  bg-black/20 dark:bg-white/20 
  backdrop-blur-sm
  text-white/70 dark:text-black/70 
  hover:text-white dark:hover:text-black
  hidden md:block md:opacity-0 md:group-hover:opacity-100
  ${isTransitioning ? 'pointer-events-none' : ''}
`;

  useEffect(() => {
    setCurrentColors({
      color1: currentTrack.color1,
      color2: currentTrack.color2,
      color3: currentTrack.color3,
      color4: currentTrack.color4,
      color5: currentTrack.color5,
    });
  }, [currentTrack]);

  // Function to interpolate between colors
  const interpolatedColors = useMemo(() => {
    return {
      color1: mix(previousColors.color1, currentColors.color1, colorProgress),
      color2: mix(previousColors.color2, currentColors.color2, colorProgress),
      color3: mix(previousColors.color3, currentColors.color3, colorProgress),
      color4: mix(previousColors.color4, currentColors.color4, colorProgress),
      color5: mix(previousColors.color5, currentColors.color5, colorProgress),
    };
  }, [previousColors, currentColors, colorProgress]);

  // Handle color transitions when track changes
  useEffect(() => {
    setPreviousColors(interpolatedColors);
    setColorProgress(0);
    
    // Force a reset of hover state when track changes
    setIsHovering(false);
    
    const startTime = performance.now();
    const duration = 500;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setColorProgress(progress);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentTrack]);

  // Add Safari detection
  const isSafari = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }, []);

  const safariStyles: CSSProperties = isSafari ? {
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden'
  } : {};

  return (
    <div 
      className="group relative transform-gpu transition-transform duration-300 ease-out hover:scale-[1.02]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        willChange: 'transform'
      }}
    >
      {/* Previous Arrow */}
      <button
        onClick={handlePrevious}
        className={`
          ${buttonBaseClasses}
          left-0 md:-translate-x-1/2
          translate-x-2 md:-translate-x-1/2
        `}
        aria-label="Previous track"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Next Arrow */}
      <button
        onClick={handleNext}
        className={`
          ${buttonBaseClasses}
          right-0 md:translate-x-1/2
          -translate-x-2 md:translate-x-1/2
        `}
        aria-label="Next track"
      >
        <ArrowRight size={20} />
      </button>

      <a
        href={currentTrack.trackUrl}
        target="_blank"
        rel="noopener noreferrer"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`
          block relative overflow-hidden rounded-xl shadow-lg
          ${isTransitioning ? 'opacity-0' : 'opacity-100'}
        `}
        style={{
          WebkitMaskImage: isSafari ? '-webkit-radial-gradient(white, black)' : undefined,
          ...safariStyles
        }}
      >
        {/* Wrapper div for better corner rendering */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          {/* Base gradient layer */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(145deg, 
                ${interpolatedColors.color1} 0%,
                ${interpolatedColors.color2} 20%,
                ${interpolatedColors.color3} 40%,
                ${interpolatedColors.color4} 60%,
                ${interpolatedColors.color5} 80%,
                ${interpolatedColors.color1} 100%
              )`,
              backgroundSize: '200% 200%',
              opacity: 0.85,
              filter: 'brightness(0.7)',
              ...(isSafari ? safariStyles : {})
            }}
          />

          {/* Darkening overlay */}
          <div 
            className="absolute inset-0 bg-black/30"
            style={isSafari ? safariStyles : undefined}
          />

          {/* Dynamic gradient overlay */}
          <div
            className="absolute inset-0 animate-gradient-fast"
            style={{
              backgroundImage: `
                radial-gradient(circle at 0% 0%, ${interpolatedColors.color1}, transparent 50%),
                radial-gradient(circle at 100% 0%, ${interpolatedColors.color3}, transparent 50%),
                radial-gradient(circle at 100% 100%, ${interpolatedColors.color5}, transparent 50%),
                radial-gradient(circle at 0% 100%, ${interpolatedColors.color2}, transparent 50%)
              `,
              backgroundSize: '200% 200%',
              mixBlendMode: 'soft-light',
              opacity: 0.6,
              ...(isSafari ? safariStyles : {})
            }}
          />

          {/* Color accent spots */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 30% 20%, ${interpolatedColors.color4}, transparent 20%),
                radial-gradient(circle at 70% 80%, ${interpolatedColors.color2}, transparent 20%)
              `,
              opacity: 0.4,
              mixBlendMode: 'overlay',
              ...(isSafari ? safariStyles : {})
            }}
          />
        </div>

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
                src={currentTrack.albumArt === '/default.webp' ? DEFAULT_ALBUM_ART : currentTrack.albumArt}
                alt={`${currentTrack.track.name} album art`}
                width={64}
                height={64}
                priority
                className={`
                  rounded-lg shadow-lg ring-1 ring-white/10
                  transition-opacity duration-200
                  ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                `}
                style={{
                  boxShadow: '0 8px 20px rgb(0 0 0 / 0.3)',
                  WebkitFontSmoothing: 'antialiased',
                  WebkitBackfaceVisibility: 'hidden'
                }}
                onLoad={() => {
                  console.log('✅ Image loaded:', currentTrack.albumArt);
                  setImageLoaded(true);
                }}
                onError={() => {
                  console.error('❌ Image failed to load:', currentTrack.albumArt);
                  setImageLoaded(true); // Show the image anyway in case of error
                }}
              />
              {!imageLoaded && (
                <div 
                  className="absolute inset-0 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" 
                  style={{ width: '64px', height: '64px' }}
                />
              )}
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

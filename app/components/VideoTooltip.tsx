'use client';

import { useState } from 'react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { X } from '@phosphor-icons/react';

interface VideoTooltipProps {
  emoji: string;
  videoSrc: string;
  videoWidth?: string;
  videoHeight?: string;
  isVertical?: boolean;
  hasWebM?: boolean;
}

export default function VideoTooltip({ 
  emoji, 
  videoSrc, 
  videoWidth = "200px", 
  videoHeight = "300px",
  isVertical = true,
  hasWebM = false
}: VideoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const aspectRatio = isVertical ? "9/16" : "16/9";

  const renderVideoSources = () => (
    <>
      {hasWebM && <source src={videoSrc.replace('.mp4', '.webm')} type="video/webm" />}
      <source src={videoSrc} type="video/mp4" />
    </>
  );

  // Only render video when tooltip/modal is open
  const renderVideo = (className: string, style?: React.CSSProperties) => (
    <video 
      autoPlay 
      loop 
      muted 
      playsInline 
      preload="none"
      controls={false} 
      className={className}
      style={style}
      onLoadedData={() => setIsVideoLoaded(true)}
    >
      {renderVideoSources()}
    </video>
  );

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <div className="relative">
          <TooltipTrigger 
            className="transition-all duration-300 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-200/20 hover:scale-110 active:scale-95 transform-gpu"
            onClick={() => setIsOpen(true)}
          >
            <div className="relative group">
              <span className="transition-transform duration-300 inline-block group-hover:scale-110">
                {emoji}
              </span>
              <div className="absolute inset-0 bg-gray-500/10 dark:bg-gray-400/10 rounded-full scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10" />
            </div>
          </TooltipTrigger>
          <TooltipContent 
            className="hidden lg:block transition-all duration-300 transform-gpu"
            sideOffset={5}
          >
            {renderVideo(
              "rounded-lg object-cover shadow-xl ring-1 ring-black/10 transition-transform duration-300 hover:scale-105",
              { width: videoWidth, height: videoHeight }
            )}
          </TooltipContent>
          
          {/* Mobile video modal */}
          {isOpen && (
            <div 
              className={`lg:hidden fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[999999] transition-all duration-300 ${
                isVideoLoaded 
                  ? 'opacity-100 pointer-events-auto' 
                  : 'opacity-0 pointer-events-none'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <div 
                className={`${
                  isVertical ? 'w-[60vw] max-w-[300px]' : 'w-full max-w-[90vw]'
                } mx-4 transform transition-all duration-500 ease-out ${
                  isVideoLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  {renderVideo(
                    `w-full rounded-lg object-cover shadow-2xl ring-1 ring-white/20 ${
                      isVertical ? 'max-h-[70vh]' : 'max-h-[60vh]'
                    }`,
                    { aspectRatio }
                  )}
                  <button 
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/70 hover:scale-110 active:scale-90 transform-gpu"
                    onClick={() => setIsOpen(false)}
                  >
                    <X size={18} weight="bold" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Tooltip>
    </TooltipProvider>
  );
}
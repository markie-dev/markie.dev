'use client';

import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface VideoTooltipProps {
  emoji: string;
  videoSrc: string;
  videoWidth?: string;
  videoHeight?: string;
  isVertical?: boolean;
}

export default function VideoTooltip({ 
  emoji, 
  videoSrc, 
  videoWidth = "200px", 
  videoHeight = "300px",
  isVertical = true
}: VideoTooltipProps) {
  const aspectRatio = isVertical ? "9/16" : "16/9";
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <div className="group relative">
          <TooltipTrigger className="transition-colors p-1 rounded-md hover:bg-gray-200 dark:hover:bg-red-900/30">
            {emoji}
          </TooltipTrigger>
          <TooltipContent className="hidden lg:block">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              preload="auto" 
              controls={false} 
              className="rounded-lg object-cover"
              style={{ width: videoWidth, height: videoHeight }}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          </TooltipContent>
          {/* Mobile video */}
          <div className="lg:hidden fixed inset-0 flex items-center justify-center bg-black/50 opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-opacity duration-300 z-[999999]">
            <div 
              className="w-full max-w-[90vw] mx-4 transform scale-95 group-focus-within:scale-100 transition-transform duration-300 ease-out"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  preload="auto" 
                  controls={false} 
                  className={`w-full rounded-lg object-cover shadow-2xl ${
                    isVertical ? 'max-h-[60vh]' : 'max-h-[60vh]'
                  }`}
                  style={{
                    aspectRatio
                  }}
                >
                  <source src={videoSrc} type="video/mp4" />
                </video>
                <button 
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm"
                  onClick={() => {
                    const activeElement = document.activeElement as HTMLElement;
                    activeElement?.blur?.();
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      </Tooltip>
    </TooltipProvider>
  );
} 
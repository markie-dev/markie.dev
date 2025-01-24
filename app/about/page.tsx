'use client';

import { Suspense, useEffect, useState } from 'react';
import Image from "next/image";
import Footer from "../components/Footer";
import MusicWidget from "../components/MusicWidget";
import { Skeleton } from "@/components/ui/skeleton"
import VideoTooltip from "../components/VideoTooltip";
import type { getTrackDetails } from '../actions/getTrackDetails';
import { motion } from 'framer-motion';

export default function About() {
  const [initialTracks, setInitialTracks] = useState<NonNullable<Awaited<ReturnType<typeof getTrackDetails>>>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchInitialTrack() {
      try {
        // Only fetch the first track initially for fast loading
        const res = await fetch('/api/track?start=0');
        if (!res.ok) throw new Error('Failed to fetch track');
        const track = await res.json();
        
        if (track && isMounted) {
          setInitialTracks([track]);
          setIsLoading(false);
          
          // Fetch additional tracks in the background
          fetchAdditionalTracks([track]);
        }
      } catch (error) {
        console.error('Error fetching initial track:', error);
        if (isMounted) setIsLoading(false);
      }
    }

    async function fetchAdditionalTracks(existingTracks: NonNullable<Awaited<ReturnType<typeof getTrackDetails>>>[]) {
      try {
        const promises = [];
        for (let i = 1; i < 8; i++) {
          promises.push(fetch(`/api/track?index=${i}`).then(res => res.json()));
        }
        
        const additionalTracks = await Promise.all(promises);
        const validTracks = additionalTracks.filter(track => track !== null);
        
        if (isMounted) {
          setInitialTracks([...existingTracks, ...validTracks]);
        }
      } catch (error) {
        console.error('Error fetching additional tracks:', error);
      }
    }

    fetchInitialTrack();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col justify-between">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <motion.div 
              className="lg:w-1/2 lg:flex lg:items-center"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Image
                src="/about.png"
                alt="Marcus Ellison"
                className="rounded-lg shadow-md w-full h-auto object-contain max-w-[600px] mx-auto transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
                width={500}
                height={500}
                priority
                loading="eager"
              />
            </motion.div>

            {/* Bio Section */}
            <Suspense 
              fallback={
                <div className="lg:w-1/2 space-y-4">
                  <Skeleton className="h-6 w-full animate-pulse" />
                  <Skeleton className="h-6 w-3/4 animate-pulse" />
                  <Skeleton className="h-6 w-5/6 animate-pulse" />
                </div>
              }
            >
              <motion.div 
                className="lg:w-1/2 lg:flex lg:items-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              >
                <div className="space-y-4 text-lg">
                  <p className="transition-all duration-300 hover:translate-x-1">
                    My name is Marcus Ellison. I am studying Computer Science at the University of North Texas in the hope of becoming a <span className="text-red-800 dark:text-red-600 transition-colors duration-300 hover:text-red-500 dark:hover:text-red-400">Software Engineer</span>. Since I was a kid, I've known that computers would be my career. Later in life, I realized that it wasn't the hardware that I loved so much, but <span className="text-red-800 dark:text-red-600 transition-colors duration-300 hover:text-red-500 dark:hover:text-red-400">the software and user experience that I wanted to create.</span> Throughout my college courses, I've gained a lot of knowledge about programming languages, operating systems, compilers, and more.
                  </p>
                  <p className="transition-all duration-300 hover:translate-x-1">
                    Currently, I work at my school on the Datacomm team, keeping all 40,000 students online. This has taught me a lot about networking and I believe it will provide good experience for when I move on. Making projects on the side has always been exciting for me and I've learned that <span className="text-red-800 dark:text-red-600 transition-colors duration-300 hover:text-red-500 dark:hover:text-red-400">if all the available solutions aren't what you're looking for, create your own.</span>
                  </p>
                  <p className="transition-all duration-300 hover:translate-x-1">
                    When I'm not on VSCode or Figma, I love gaming, creating music, playing basketball, and hanging out with my cat, Beno.
                  </p>
                  {/* Video tooltips */}
                  <Suspense>
                    <div className="mt-8 flex flex-wrap gap-2 text-2xl">
                      <VideoTooltip 
                        emoji="👨‍💻" 
                        videoSrc="/setup.mp4" 
                        videoWidth="200px" 
                        videoHeight="300px" 
                        isVertical={true}
                        hasWebM={false}
                      />
                      <VideoTooltip 
                        emoji="🎮" 
                        videoSrc="/cs2_web.mp4" 
                        videoWidth="420px" 
                        videoHeight="250px" 
                        isVertical={false}
                        hasWebM={false}
                      />
                      <VideoTooltip 
                        emoji="🎧" 
                        videoSrc="/bladee.mp4" 
                        videoWidth="200px" 
                        videoHeight="300px" 
                        isVertical={true}
                        hasWebM={false}
                      />
                      <VideoTooltip 
                        emoji="🏀" 
                        videoSrc="/bball.mp4" 
                        videoWidth="200px" 
                        videoHeight="300px" 
                        isVertical={true}
                        hasWebM={true}
                      />
                      <VideoTooltip 
                        emoji="🐈" 
                        videoSrc="/beno.mp4" 
                        videoWidth="200px" 
                        videoHeight="300px" 
                        isVertical={true}
                        hasWebM={true}
                      />
                    </div>
                  </Suspense>
                  {/* Music Widget with its own suspense boundary */}
                  <Suspense 
                    fallback={
                      <div className="h-[120px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
                    }
                  >
                    <div className="hidden lg:block mt-8">
                      <div className="relative z-10 h-[120px]">
                        {isLoading ? (
                          <div className="relative p-4 rounded-xl bg-gray-100 dark:bg-gray-800/50 shadow-lg">
                            <div className="flex items-center gap-4">
                              {/* Album art skeleton */}
                              <Skeleton className="h-16 w-16 rounded-lg shrink-0" />
                              
                              {/* Text content skeleton */}
                              <div className="flex flex-col flex-1 gap-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-4 w-32" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <MusicWidget initialTracks={initialTracks} />
                        )}
                      </div>
                    </div>
                  </Suspense>
                </div>
              </motion.div>
            </Suspense>
          </div>

          {/* Mobile Music Widget */}
          <Suspense 
            fallback={
              <div className="h-[120px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
            }
          >
            <div className="lg:hidden mt-8 flex flex-col gap-4 h-[120px]">
              <div className="relative z-10 h-full">
                {isLoading ? (
                  <div className="relative p-4 rounded-xl bg-gray-100 dark:bg-gray-800/50 shadow-lg">
                    <div className="flex items-center gap-4">
                      {/* Album art skeleton */}
                      <Skeleton className="h-16 w-16 rounded-lg shrink-0" />
                      
                      {/* Text content skeleton */}
                      <div className="flex flex-col flex-1 gap-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <MusicWidget initialTracks={initialTracks} />
                )}
              </div>
            </div>
          </Suspense>
        </div>
        <Footer />
      </div>
    </div>
  );
}
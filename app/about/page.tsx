import { Suspense } from 'react';
import Image from "next/image";
import Footer from "../components/Footer";
import MusicWidget from "../components/MusicWidget";
import { Skeleton } from "@/components/ui/skeleton"
import VideoTooltip from "../components/VideoTooltip";

export default function About() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-between max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-10">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2">
              <Skeleton className="w-full h-[500px] rounded-lg" />
            </div>
            <div className="lg:w-1/2 space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    }>
      <div className="flex flex-col justify-between">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-10">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="lg:w-1/2 lg:flex lg:items-center">
                <Image
                  src="/about.png"
                  alt="Marcus Ellison"
                  className="rounded-lg shadow-md w-full h-auto object-contain max-w-[600px] mx-auto"
                  width={500}
                  height={500}
                />
              </div>

              {/* Bio Section */}
              <div className="lg:w-1/2 lg:flex lg:items-center">
                <div className="space-y-4 text-lg">
                  <p>My name is Marcus Ellison. I am studying Computer Science at the University of North Texas in the hope of becoming a <span className="text-red-800 dark:text-red-600">Software Engineer</span>. Since I was a kid, I've known that computers would be my career. Later in life, I realized that it wasn't the hardware that I loved so much, but <span className="text-red-800 dark:text-red-600">the software and user experience that I wanted to create.</span> Throughout my college courses, I've gained a lot of knowledge about programming languages, operating systems, compilers, and more.</p>
                  <p>Currently, I work at my school on the Datacomm team, keeping all 40,000 students online. This has taught me a lot about networking and I believe it will provide good experience for when I move on. Making projects on the side has always been exciting for me and I've learned that <span className="text-red-800 dark:text-red-600">if all the available solutions aren't what you're looking for, create your own.</span></p>
                  <p>When I'm not on VSCode or Figma, I love gaming, creating music, playing basketball, and hanging out with my cat, Beno.</p>
                  <div className="mt-8 flex flex-wrap gap-2 text-2xl">
                    <VideoTooltip 
                      emoji="👨‍💻" 
                      videoSrc="/setup.mp4" 
                      videoWidth="200px" 
                      videoHeight="300px" 
                      isVertical={true}
                    />
                    <VideoTooltip 
                      emoji="🎮" 
                      videoSrc="/cs2_web.mp4" 
                      videoWidth="420px" 
                      videoHeight="250px" 
                      isVertical={false}
                    />
                    <VideoTooltip 
                      emoji="🎧" 
                      videoSrc="/bladee.mp4" 
                      videoWidth="200px" 
                      videoHeight="300px" 
                      isVertical={true}
                    />
                    <VideoTooltip 
                      emoji="🏀" 
                      videoSrc="/bball.mp4" 
                      videoWidth="200px" 
                      videoHeight="300px" 
                      isVertical={true}
                    />
                    <VideoTooltip 
                      emoji="🐈" 
                      videoSrc="/beno.mp4" 
                      videoWidth="200px" 
                      videoHeight="300px" 
                      isVertical={true}
                    />
                  </div>
                  {/* Second Music Widget under bio */}
                  <div className="hidden lg:block mt-8">
                    <div className="relative z-10 h-[120px]">
                      <Suspense fallback={
                        <div className="p-4 flex items-center gap-4 rounded-xl bg-gray-200/80 dark:bg-gray-800/80 backdrop-blur-sm">
                          <div className="shrink-0">
                            <Skeleton className="w-16 h-16 rounded-lg" />
                          </div>
                          <div className="flex flex-col gap-2 flex-grow">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                        </div>
                      }>
                        <MusicWidget trackIndex={0} />
                      </Suspense>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Music Widgets with fixed height */}
            <div className="lg:hidden mt-8 flex flex-col gap-4 h-[120px]">
              <div className="relative z-10 h-full">
                <Suspense fallback={
                  <div className="p-4 flex items-center gap-4 rounded-xl bg-gray-200/80 dark:bg-gray-800/80 backdrop-blur-sm h-full">
                    <div className="shrink-0">
                      <Skeleton className="w-16 h-16 rounded-lg" />
                    </div>
                    <div className="flex flex-col gap-2 flex-grow">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                }>
                  <MusicWidget trackIndex={0} />
                </Suspense>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </Suspense>
  );
}
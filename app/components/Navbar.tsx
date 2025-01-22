'use client'

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from 'react';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isProjectsSection, setIsProjectsSection] = useState(false);

  useEffect(() => {
    const checkProjectsSection = () => {
      const projectsSection = document.getElementById('projects');
      if (!projectsSection) return;

      const threshold = window.innerWidth >= 640 ? 0.3 : 0.44;

      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsProjectsSection(entry.isIntersecting);
        },
        { threshold }
      );

      observer.observe(projectsSection);
      return () => observer.disconnect();
    };

    window.addEventListener('resize', checkProjectsSection);

    const timer = setTimeout(checkProjectsSection, 100);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkProjectsSection);
    };
  }, [pathname]);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 0) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);

    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  const scrollToProjects = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    const isAboutPage = pathname.includes('/about');
    
    if (isAboutPage) {
      await router.push('/#projects');
    }
    
    if (pathname === '/' && window.location.hash === '#projects') {
      window.location.hash = '';
    }
    
    const scrollToSection = (retryCount = 0) => {
      const projectsSection = document.getElementById('projects');
      if (!projectsSection) {
        if (retryCount < 20) {
          setTimeout(() => scrollToSection(retryCount + 1), 100);
        }
        return;
      }

      const navbar = document.querySelector('nav');
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const offsetPosition = projectsSection.offsetTop - navbarHeight + 24;
      
      const start = window.pageYOffset;
      const distance = offsetPosition - start;
      const duration = 300;
      let startTime: number | null = null;

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        
        window.scrollTo(0, start + distance * ease(progress));

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    };

    scrollToSection();
  };

  const scrollToTop = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    const scrollWithAnimation = () => {
      const start = window.pageYOffset;
      const duration = 800;
      let startTime: number | null = null;

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        
        window.scrollTo(0, start * (1 - ease(progress)));

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    };

    if (pathname !== '/') {
      await router.push('/');
    } else {
      scrollWithAnimation();
    }
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <nav className="backdrop-blur-md bg-white/60 dark:bg-background/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link 
              href="/" 
              onClick={scrollToTop} 
              className="cursor-pointer"
            >
              <h1 className="text-lg sm:text-2xl font-bold whitespace-nowrap dark:text-white">marcus ellison</h1>
            </Link>
            <div className="flex ml-6 sm:ml-12 text-gray-700 dark:text-gray-300 items-center gap-4 sm:gap-8 sm:text-lg">
              <Link 
                href="/#projects" 
                onClick={scrollToProjects} 
                className={`cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-300 ${
                  pathname === '/' && isProjectsSection 
                    ? 'after:w-full after:bg-red-800 dark:after:bg-red-600' 
                    : 'after:w-0 hover:after:w-full hover:after:bg-gray-500 dark:hover:after:bg-gray-400'
                }`}
              >
                projects
              </Link>
              <Link 
                href="/about" 
                className={`cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-300 ${
                  pathname === '/about' 
                    ? 'after:w-full after:bg-red-800 dark:after:bg-red-600' 
                    : 'after:w-0 hover:after:w-full hover:after:bg-gray-500 dark:hover:after:bg-gray-400'
                }`}
              >
                about
              </Link>
              <Link 
                href="/Resume_MarcusEllison_1.pdf" 
                target="_blank" 
                className="cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gray-500 dark:after:bg-gray-400 after:transition-all after:duration-300 hover:after:w-full hover:after:bg-gray-500 dark:hover:after:bg-gray-400"
              >
                resume
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

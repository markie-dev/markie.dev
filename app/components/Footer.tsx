'use client'

import { At, LinkedinLogo, GithubLogo, SunDim, MoonStars } from "@phosphor-icons/react";
import { useTheme } from "../providers/ThemeProvider";
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const handleEmail = () => {
    window.location.href = "mailto:marcus.d.ellison@gmail.com";
  };

  const handleLinkedIn = () => {
    window.open("https://www.linkedin.com/in/marcus-ellison-0974681b9/", "_blank");
  };

  const handleGithub = () => {
    window.open("https://github.com/markie-dev", "_blank");
  };

  const handleNameClick = () => {
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };

  return (
    <footer className="w-full mx-auto py-8">
      <div className="border-t-2 border-gray-400"></div>
      <div className="flex justify-between items-center mt-8">
        <div className="flex items-center gap-4">
          <button
            onClick={handleNameClick}
            className="text-lg sm:text-2xl font-bold hover:text-red-700 transition-colors duration-200"
          >
            marcus ellison
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 hover:scale-110 transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <SunDim size={30} weight="bold" className="hover:text-red-700 transition-colors duration-200" /> : <MoonStars size={30} weight="bold" className="hover:text-red-700 transition-colors duration-200" />}
            </button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handleEmail}
            className="p-2 rounded-full hover:bg-gray-100 hover:scale-110 transition-all duration-200"
            aria-label="Email"
          >
            <At size={30} weight="bold" className="hover:text-red-700 transition-colors duration-200" />
          </button>

          <button 
            onClick={handleGithub}
            className="p-2 rounded-full hover:bg-gray-100 hover:scale-110 transition-all duration-200"
            aria-label="GitHub"
          >
            <GithubLogo size={30} weight="bold" className="hover:text-red-700 transition-colors duration-200" />
          </button>

          <button 
            onClick={handleLinkedIn}
            className="p-2 rounded-full hover:bg-gray-100 hover:scale-110 transition-all duration-200"
            aria-label="LinkedIn"
          >
            <LinkedinLogo size={30} weight="bold" className="hover:text-red-700 transition-colors duration-200" />
          </button>
        </div>
      </div>
    </footer>
  );
}
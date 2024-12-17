'use client'

import { At, LinkedinLogo, FileText, GithubLogo } from "@phosphor-icons/react";

export default function IconGroup() {
  const handleEmail = () => {
    window.location.href = "mailto:marcus.d.ellison@gmail.com";
  };

  const handleLinkedIn = () => {
    window.open("https://www.linkedin.com/in/marcus-ellison-0974681b9/", "_blank");
  };

  const handleResume = () => {
    window.open("/resume.pdf", "_blank");
  };

  const handleGithub = () => {
    window.open("https://github.com/markie-dev", "_blank");
  };

  return (
    <div className="flex gap-2 mt-8">
      <button 
        onClick={handleEmail}
        className="p-2 rounded-full hover:bg-gray-100 hover:scale-110 transition-all duration-200"
        aria-label="Email"
      >
        <At size={30} weight="bold" className="hover:text-red-700 transition-colors duration-200" />
      </button>

      <button 
        onClick={handleResume}
        className="p-2 rounded-full hover:bg-gray-100 hover:scale-110 transition-all duration-200"
        aria-label="Resume"
      >
        <FileText size={30} weight="bold" className="hover:text-red-700 transition-colors duration-200" />
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
  );
}

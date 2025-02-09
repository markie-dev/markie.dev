import { Project } from "../types/project";

export const projects: Project[] = [
  {
    title: "harmony",
    description: "An iOS app that tracks your listening history and displays it in a minimalistic feed with color extraction and animations for each song. Uses background modes and APNs to seamlessly track listening history. Also allows users to add their friends in order to have a combined social feed for everyone.",
    technologies: ["SwiftUI", "UIKit", "Firebase", "Typescript"],
    media: {
      type: "image",
      sources: {
        image: "/harmony.jpg"
      },
      zoom: 1.01
    },
    githubUrl: "",
    liveUrl: "https://testflight.apple.com/join/6haub8wx"
  },
  {
    title: "Doctor Finder",
    description: "A website that allows users to find doctors in their area. Features include appointment scheduling, doctor reviews, patient symptoms, filtering, and more.",
    technologies: ["React", "Next.js", "Tailwind CSS", "TypeScript", "shadcn/ui", "Firebase"],
    media: {
      type: "video",
      sources: {
        mp4: "/doctorfinder.mp4",
        webm: "/doctorfinder.webm",
      },
      zoom: 1.01
    },
    githubUrl: "https://github.com/markie-dev/capstone2024",
    liveUrl: "https://capstone2024-five.vercel.app/"
  },
  {
    title: "Survive the Night",
    description: "A survival game where the player must collect different items and fight off zombies. This game was made using the (UNT developed) LARC engine for my Game Programming class.",
    technologies: ["C", "C++", "DirectX/Windows API"],
    media: {
      type: "video",
      sources: {
        mp4: "/survivethenight2.mp4",
        webm: "/survivethenight2.webm",
      },
      zoom: 1.0
    },
    githubUrl: "https://github.com/markie-dev/survivethenight",
    liveUrl: ""
  },
  {
    title: "nightcore.me",
    description: "A website that allows users to upload their audio files and generate nightcore versions of them.",
    technologies: ["Python", "Flask", "Figma"],
    media: {
      type: "image",
      sources: {
        image: "/nightcore_me.jpeg"
      },
      zoom: 1.5
    },
    githubUrl: "https://github.com/markie-dev/nightcore.me",
    liveUrl: "https://nightcore.me"
  },
  {
    title: "desc_race_A15",
    description: "An app developed for the CVE-2021-30955 race condition in iOS 15.1.1. A15 support (iPhone 13 and above) was added to allow exploitation of the vulnerability.",
    technologies: ["SwiftUI", "C", "Objective-C", "iOS"],
    media: {
      type: "video",
      sources: {
        mp4: "/desc_race.mp4",
        webm: "/desc_race.webm"
      },
      zoom: 1.0
    },
    githubUrl: "https://github.com/markie-dev/desc_race_A15",
    liveUrl: ""
  },
  {
    title: "keyFinder",
    description: "A tool that allows users to find the key for a given song on YouTube.",
    technologies: ["Python", "Essentia", "yt_dlp"],
    media: {
      type: "image",
      sources: {
        image: "/keyfinder.png"
      },
      zoom: 1.0
    },
    githubUrl: "https://github.com/markie-dev/keyFinder",
    liveUrl: ""
  }
]; 
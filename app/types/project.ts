export type Project = {
  title: string;
  description: string;
  technologies: string[];
  media: {
    type: 'video' | 'image';
    sources: {
      mp4?: string;
      webm?: string;
      image?: string;
    };
    zoom?: number;
  };
  githubUrl?: string;
  liveUrl?: string;
}; 
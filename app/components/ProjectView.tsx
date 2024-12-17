import { projects } from '../data/projects';
import ProjectLinks from './ProjectLinks';
import Image from 'next/image';

export default function ProjectView() {
  return (
    <div className="mt-16" id="projects">
      <div className="grid grid-cols-1 gap-8">
        {projects.map((project, index) => (
          <div key={index} className="bg-white dark:bg-zinc-900 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="aspect-video overflow-hidden">
              {project.media.type === 'video' ? (
                <video 
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls={false}
                >
                  {project.media.sources.webm && (
                    <source src={project.media.sources.webm} type="video/webm" />
                  )}
                  {project.media.sources.mp4 && (
                    <source src={project.media.sources.mp4} type="video/mp4" />
                  )}
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  src={project.media.sources.image!}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  style={{ 
                    transform: `scale(${project.media.zoom || 1})`,
                    transformOrigin: 'center center'
                  }}
                  width={1920}
                  height={1080}
                />
              )}
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 dark:text-white">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, techIndex) => (
                  <span 
                    key={techIndex}
                    className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 rounded-full text-sm text-gray-700 dark:text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <ProjectLinks 
                githubUrl={project.githubUrl} 
                liveUrl={project.liveUrl} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
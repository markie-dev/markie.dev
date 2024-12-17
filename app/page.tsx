import Image from "next/image";
import IconGroup from './components/IconGroup';
import ProjectView from './components/ProjectView';
import Footer from "./components/Footer";

export default function Home() {

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col mt-8 sm:mt-12 md:mt-16 lg:mt-20">
        <h1 className="text-3xl sm:text-4xl font-semibold sm:leading-normal">Howdy! I am a <span className="text-red-800">Software Engineer</span> that's committed to turning ideas into reality. Currently working on UNT's Datacomm team</h1>
        <h2 className="mt-12 text-xl sm:text-2xl font-semibold leading-normal">Bachelor's degree in Computer Science at the <span className="text-red-800">University of North Texas</span> (Spring 2025)</h2>
        <IconGroup />
        <ProjectView />
        <Footer />
      </div>
    </div>
  )
}

'use client';

import IconGroup from './components/IconGroup';
import ProjectView from './components/ProjectView';
import Footer from "./components/Footer";

import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col mt-8 sm:mt-12 md:mt-16 lg:mt-20">
        <motion.h1 
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl sm:text-4xl font-semibold sm:leading-normal hover:opacity-90 transition-all duration-300 cursor-default"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Howdy! I am a <span className="text-red-800 dark:text-red-600 hover:text-red-700 dark:hover:text-red-500 transition-colors duration-300">Software Engineer</span> that's committed to turning ideas into reality. Currently working on UNT's Datacomm team
          </motion.span>
        </motion.h1>
        <motion.h2 
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="mt-12 text-xl sm:text-2xl font-semibold leading-normal hover:opacity-90 transition-all duration-300 cursor-default"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            Bachelor's degree in Computer Science at the <span className="text-red-800 dark:text-red-600 hover:text-red-700 dark:hover:text-red-500 transition-colors duration-300">University of North Texas</span> (Spring 2025)
          </motion.span>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 1.0 }}
        >
          <IconGroup />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.0 }}
        >
          <ProjectView />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
        >
          <Footer />
        </motion.div>
      </div>
    </div>
  )
}

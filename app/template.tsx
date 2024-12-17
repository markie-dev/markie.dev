'use client'

import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    window.scrollTo(0, 0)
    
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <AnimatePresence mode="wait">
      <motion.main
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="pt-6 overflow-x-hidden"
        style={{ 
          minHeight: '100vh',
          position: 'relative',
          top: 0
        }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  )
} 
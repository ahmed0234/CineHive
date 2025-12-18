'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function OpeningAnimation() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  // Optimized Glitch keyframes for more aggressive "slicing"
  const glitchAnimation = {
    clipPath: [
      'inset(80% 0 1% 0)',
      'inset(10% 0 80% 0)',
      'inset(50% 0 30% 0)',
      'inset(18% 0 70% 0)',
      'inset(0% 0 0% 0)',
    ],
    x: [-2, 2, -1, 3, 0],
    filter: ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(-90deg)', 'hue-rotate(0deg)'],
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scaleY: 0.01,
            scaleX: 1.3,
            filter: 'brightness(10) contrast(2)',
            transition: { duration: 0.4, ease: [0.19, 1, 0.22, 1] },
          }}
          className="fixed inset-0 z-999 flex flex-col items-center justify-center bg-black overflow-hidden p-4 select-none"
        >
          {/* 1. BACKGROUND LAYERS */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
                backgroundSize: '50px 50px',
                transform: 'perspective(500px) rotateX(60deg) translateY(-100px)',
                maskImage: 'linear-gradient(to bottom, transparent, black, transparent)',
              }}
            />
            <motion.div
              animate={{ opacity: [0.05, 0.15, 0.05] }}
              transition={{ repeat: Infinity, duration: 0.1 }}
              className="absolute inset-0 bg-white/5 pointer-events-none"
            />
          </div>

          {/* 2. TEXT CONTENT */}
          <div className="relative z-10 flex flex-col items-center">
            <motion.span
              initial={{ opacity: 0, letterSpacing: '0.2em' }}
              animate={{ opacity: 1, letterSpacing: '1.2em' }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="text-cyan-500 font-mono text-[10px] md:text-xs mb-6 uppercase font-bold text-center"
            >
              System.Init: Portfolio
            </motion.span>

            <div className="relative group">
              {/* RGB SPLIT / GLITCH LAYERS - Delays reduced for higher frequency */}
              {[
                { color: 'text-red-500', delay: 0.3, x: -4 },
                { color: 'text-cyan-500', delay: 0.5, x: 4 },
              ].map((layer, i) => (
                <motion.h1
                  key={i}
                  animate={{
                    ...glitchAnimation,
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.2,
                    repeatDelay: layer.delay, // Much faster repeat
                  }}
                  className={`absolute left-0 top-0 ${layer.color} text-5xl sm:text-7xl md:text-9xl font-black italic tracking-tighter mix-blend-screen whitespace-nowrap`}
                >
                  AHMED HASSAN
                </motion.h1>
              ))}

              {/* MAIN TEXT WITH FREQUENT JITTER */}
              <motion.h1
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  x: [0, -1, 1, 0], // Added a small constant jitter
                }}
                transition={{
                  opacity: { duration: 0.8 },
                  x: { repeat: Infinity, duration: 0.4, repeatDelay: 1 },
                }}
                className="text-white text-5xl sm:text-7xl md:text-9xl font-black italic tracking-tighter whitespace-nowrap relative"
              >
                <motion.span
                  animate={{ color: ['#FFFFFF', '#FFFFFF', '#facc15'] }}
                  transition={{ duration: 3, times: [0, 0.7, 1] }}
                >
                  AHMED
                </motion.span>
                <span className="ml-4">HASSAN</span>

                {/* Frequent Overlay Glitch */}
                <motion.span
                  animate={{
                    opacity: [0, 1, 0.5, 0],
                    x: [0, 15, -15, 5, 0],
                    filter: ['blur(0px)', 'blur(2px)', 'blur(0px)'],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.15,
                    repeatDelay: 0.8, // Reduced from 3s to 0.8s
                  }}
                  className="absolute inset-0 text-white mix-blend-difference"
                >
                  AHMED HASSAN
                </motion.span>
              </motion.h1>
            </div>

            {/* 3. PROGRESS BAR */}
            <div className="mt-4 w-full h-[3px] bg-white/10 relative overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
                className="absolute inset-0 bg-linear-to-r from-transparent via-yellow-400 to-transparent shadow-[0_0_20px_#facc15]"
              />
            </div>
          </div>

          {/* 4. OVERLAYS */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] z-50 bg-size-[100%_4px,3px_100%]" />
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,1)]" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

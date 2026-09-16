import React from 'react'
import { Film } from 'lucide-react'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-red-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative flex flex-col items-center">
        {/* The Cinematic Aperture */}
        <div className="relative w-24 h-24 mb-8">
          {/* Outer Rotating Ring */}
          <div
            className="absolute inset-0 border-[2px] border-white/5 rounded-full animate-spin"
            style={{ animationDuration: '8s' }}
          />

          {/* Animated Glow Ring */}
          <div
            className="absolute inset-0 border-t-2 border-r-2 border-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-spin"
            style={{ animationDuration: '1.5s' }}
          />

          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse">
              <Film className="w-8 h-8 text-white/90" />
            </div>
          </div>
        </div>

        {/* Cinematic Text Reveal */}
        <div className="text-center">
          <h2 className="text-white font-light tracking-[0.4em] uppercase text-sm mb-2 animate-pulse">
            Studio Premiere
          </h2>

          {/* Progress Bar Container */}
          <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-red-600 to-transparent"
              style={{
                animation: 'loading-scan 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>

      {/* Embedded inline CSS for compositor-driven animation */}
      <style>{`
        @keyframes loading-scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

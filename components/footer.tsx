import React from 'react'
import { Github, Twitter, Instagram, Youtube, Film, Mail } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-zinc-950 text-zinc-400 py-12 mt-6 px-6 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-yellow-500 font-bold text-2xl tracking-tighter">
              <Film className="w-8 h-8" />
              <span>
                CINE<span className="text-white">FLOW</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Your ultimate destination for the latest movies, reviews, and cinematic insights. Stay
              updated with the world of entertainment.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold uppercase text-xs tracking-widest">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors duration-300">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors duration-300">
                  Movies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors duration-300">
                  Genres
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors duration-300">
                  New Releases
                </a>
              </li>
            </ul>
          </div>

          {/* Support/Info */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold uppercase text-xs tracking-widest">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors duration-300">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors duration-300">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors duration-300">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors duration-300">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Socials & Newsletter Hint */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold uppercase text-xs tracking-widest">Connect</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-zinc-900 rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-300"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-zinc-900 rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-zinc-900 rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-zinc-900 rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-300"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <div className="pt-2 flex items-center gap-2 text-xs">
              <Mail className="w-4 h-4 text-yellow-500" />
              <span>newsletter@cineflow.com</span>
            </div>
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        {/* Bottom Credits */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
          <p>© {currentYear} CineFlow Inc. All rights reserved.</p>
          <p className="text-zinc-500 tracking-wide uppercase">
            Website made by{' '}
            <span className="text-yellow-500 font-bold hover:underline cursor-pointer">~ Ahmed Hassan</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

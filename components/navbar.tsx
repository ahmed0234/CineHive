'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Film, Menu, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { searchMovies } from '@/app/server/action'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: '/movies', label: 'Movies' },
    { href: '/tv-seasons', label: 'TV Seasons' },
    { href: '/animations', label: 'Animations' },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border/100 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6  mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Film className="h-6 w-6 text-primary text-yellow-500" />
          <span className="text-xl font-bold tracking-tight">
            <span className="text-yellow-500">Cine</span>Hive
          </span>
        </Link>

        {/* Desktop Navigation - Center Links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Search - Right Side */}
        <div className="hidden items-center gap-3 md:flex">
          <span className="text-sm font-medium text-muted-foreground">Search</span>
          <div className="relative">
            <form action={searchMovies} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="movieName" // This must match formData.get("movieName")
                type="search"
                placeholder="Search movies..."
                className="h-9 w-[200px] pl-9 lg:w-[250px]"
              />
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-6 pt-6">
              {/* Mobile Logo */}
              <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                <Film className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold tracking-tight">CineHive</span>
              </Link>

              {/* Mobile Search */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-muted-foreground">Search</span>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="search" placeholder="Search movies..." className="pl-9" />
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-3">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}

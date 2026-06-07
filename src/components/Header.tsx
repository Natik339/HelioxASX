import React, { useState, useEffect } from 'react';
import { Menu, X, Dumbbell, ShieldCheck, Phone, MapPin, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GYM_DETAILS } from '../data';

interface HeaderProps {
  onBookClick: () => void;
  onMyBookingsClick: () => void;
  bookingsCount: number;
}

export default function Header({ onBookClick, onMyBookingsClick, bookingsCount }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Programs', href: '#programs' },
    { label: 'Trainer Squad', href: '#trainers' },
    { label: 'Weekly Timetable', href: '#timetable' },
    { label: 'Interactive Hub', href: '#calculators' },
    { label: 'Testimonials', href: '#reviews' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Location & Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Top Banner with Quick info */}
      <div className="bg-[#0A0A0A] text-zinc-400 text-xs border-b border-white/10 py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-yellow-400" />
              Kamla Nagar, Agra
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-yellow-400" />
              {GYM_DETAILS.phone}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-yellow-400 font-medium">Opens Daily: 6:00 AM - 10:30 PM (Mon-Sat)</span>
            <span className="text-zinc-600">|</span>
            <a
              href={GYM_DETAILS.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-yellow-400 flex items-center gap-1 transition-colors font-mono text-[11px]"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@helioxfitness</span>
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 shadow-xl py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="p-2 bg-yellow-400 rounded-sm shadow-lg group-hover:scale-105 transition-transform">
              <Dumbbell className="w-6 h-6 text-black stroke-[2.5]" />
            </div>
            <div>
              <span className="font-display font-black text-lg md:text-xl tracking-tighter text-white block">
                HELIOX
              </span>
              <span className="text-[10px] font-mono tracking-[0.25em] text-yellow-400 font-bold uppercase block -mt-1">
                Fitness Gym
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-xs font-semibold uppercase tracking-widest text-zinc-300 hover:text-yellow-400 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Call to Actions / Bookings */}
          <div className="hidden sm:flex items-center gap-3">
            {/* My Bookings Trigger */}
            <button
              onClick={onMyBookingsClick}
              className="relative px-3.5 py-1.5 rounded-lg border border-white/10 text-xs font-mono font-medium text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-900 transition-all flex items-center gap-2 cursor-pointer"
            >
              My Hub
              {bookingsCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 bg-yellow-400 text-[10px] font-bold text-black rounded-full">
                  {bookingsCount}
                </span>
              )}
            </button>

            <button
              onClick={onBookClick}
              className="bg-yellow-400 text-black px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-500/20 active:scale-[0.98]"
            >
              Book Free Trial
            </button>
          </div>

          {/* Mobile Hamburguer */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onMyBookingsClick}
              className="relative p-2 rounded-md border border-zinc-800 text-zinc-400 font-mono text-xs hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              Hub {bookingsCount > 0 && `(${bookingsCount})`}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-zinc-400 hover:text-white border border-zinc-800 rounded-md hover:bg-zinc-900 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden bg-[#0A0A0A] border-b border-white/10"
            >
              <div className="px-4 py-6 space-y-4">
                <div className="flex flex-col gap-3">
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="text-base font-semibold text-zinc-300 hover:text-yellow-400 py-1 border-b border-white/10 transition-all"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>

                <div className="pt-4 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onBookClick();
                    }}
                    className="w-full py-3 bg-yellow-400 font-bold text-black text-sm uppercase tracking-wider text-center shadow-lg cursor-pointer hover:bg-yellow-300"
                  >
                    🚀 Book Trial Now
                  </button>
                  <p className="text-center text-[10px] text-zinc-500 font-mono">
                    📍 {GYM_DETAILS.address}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

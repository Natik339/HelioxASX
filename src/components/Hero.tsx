import { ArrowRight, Star, Shield, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import { GYM_DETAILS } from '../data';

interface HeroProps {
  onBookClick: () => void;
  onJoinClick: () => void;
}

export default function Hero({ onBookClick, onJoinClick }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0A0A0A] px-4 pt-10 pb-20">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Atmospheric Orange Neon Glows */}
      <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-yellow-400/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-yellow-400/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Hero Content Grid */}
      <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left Side: Bold Marketing Typography */}
        <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-xs text-yellow-400 font-mono font-semibold"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
            </span>
            AGRA'S PREMIER FITNESS SENSATION
          </motion.div>

          {/* Core Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-black text-4xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight text-white uppercase"
          >
            BE STRONGER <br />
            THAN YOUR <br />
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              EXCUSES.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-zinc-400 max-w-xl font-light"
          >
            Experience premium strength training at <strong className="text-zinc-200 font-semibold">{GYM_DETAILS.name}</strong>. Powered by massive varieties of elite, high-quality machines, clean facilities, zero waiting lines, and expert trainers who guarantee your progress.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2"
          >
            <button
              onClick={onBookClick}
              className="bg-yellow-400 text-black px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-500/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group"
            >
              Book Free Trial
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onJoinClick}
              className="px-8 py-4 border border-white/10 bg-white/5 text-zinc-200 hover:text-white hover:border-white/30 transition-all text-xs font-bold uppercase tracking-widest text-center cursor-pointer"
            >
              Explore Membership
            </button>
          </motion.div>

          {/* Quick trust proofs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-zinc-900 w-full"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-2xl sm:text-3xl font-display font-black text-white">4.7</span>
                <div className="flex text-amber-500">
                  <Star className="w-4 h-4 fill-current text-amber-500" />
                </div>
              </div>
              <span className="text-xs text-zinc-500 font-mono tracking-wide uppercase">279+ Core Reviews</span>
            </div>

            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-display font-black text-white">Zero</span>
              <span className="text-xs text-zinc-500 font-mono tracking-wide uppercase">Equipment Waiting</span>
            </div>

            <div className="flex flex-col col-span-2 sm:col-span-1">
              <span className="text-2xl sm:text-3xl font-display font-black text-yellow-500">Agra's Best</span>
              <span className="text-xs text-zinc-500 font-mono tracking-wide uppercase">Spacious Layout</span>
            </div>
          </motion.div>

        </div>

        {/* Right Side: High Impact Visual Banner */}
        <div className="lg:col-span-5 relative flex justify-center items-center mt-6 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 w-full max-w-[420px] aspect-[3/4] group"
          >
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-10" />
            
            {/* The main picture */}
            <img
              src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop"
              alt="High intensity barbell lift athlete at Heliox Gym Agra"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {/* Float Badge 1 (Trainer support) */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#0A0A0A]/95 border border-white/10 backdrop-blur-md z-20 flex gap-3 items-center">
              <div className="p-2 bg-yellow-400/10 rounded-lg text-yellow-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-mono text-yellow-400 uppercase font-semibold">Motivating Vibe</p>
                <p className="text-sm font-semibold text-white">Friendly & Supportive Trainers</p>
              </div>
            </div>

            {/* Float Badge 2 (Cleanliness / space) */}
            <div className="absolute top-6 right-6 p-2 px-3 rounded-lg bg-zinc-950/90 border border-zinc-800 backdrop-blur-md z-20 flex gap-2 items-center">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-mono font-medium text-zinc-300">Clean & Well Sanitized</span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

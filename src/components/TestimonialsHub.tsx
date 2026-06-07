import { useState } from 'react';
import { TESTIMONIALS, GYM_DETAILS } from '../data';
import { Star, CheckCircle2, Quote, ArrowLeft, ArrowRight, MessageSquareCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TestimonialsHub() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const stats = [
    { stars: 5, percentage: 88 },
    { stars: 4, percentage: 8 },
    { stars: 3, percentage: 2 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 1 }
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section id="reviews" className="py-24 bg-[#0A0A0A] border-b border-white/10 relative">
      <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-yellow-400/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-yellow-400 uppercase">
            ⭐ Verified Customer Buzz
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-white mt-3 uppercase tracking-tight">
            Google Reviews Summary
          </h2>
          <p className="text-zinc-400 mt-4 text-sm font-light">
            Read authentic reviews from locals who train daily at Heliox Fitness Kamla Nagar. Our verified score comes from transparent equipment quality, friendly ambiance, and zero waiting time.
          </p>
        </div>

        {/* Central visual dashboard: Ratings panel & Review carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          
          {/* Cumulative Stats Card */}
          <div className="lg:col-span-4 bg-black/20 p-6 md:p-8 rounded-lg border border-white/10 text-left flex flex-col justify-between animate-none">
            <div>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">CUMULATIVE SCORE</p>
              
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-6xl font-display font-black text-white">{GYM_DETAILS.rating}</span>
                <span className="text-sm font-mono text-zinc-500">/ 5.0 Rating</span>
              </div>

              {/* Stars row */}
              <div className="flex items-center gap-1 text-yellow-400 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
                <span className="text-xs text-zinc-400 ml-2 font-mono">{GYM_DETAILS.reviewsCount} reviews</span>
              </div>

              {/* Progress bars of star weights */}
              <div className="space-y-2 mt-8">
                {stats.map((row) => (
                  <div key={row.stars} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-zinc-400 w-3">{row.stars}</span>
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-current shrink-0" />
                    <div className="flex-1 bg-zinc-950 rounded h-1.5 overflow-hidden">
                      <div
                        className="bg-yellow-400 h-1.5 rounded"
                        style={{ width: `${row.percentage}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 w-8 text-right">{row.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick quote highlight info */}
            <div className="pt-6 border-t border-white/10 mt-8">
              <span className="text-xs text-zinc-400 font-light italic">
                "Spacious, neat & tidy washrooms, variety of heavy machinery with positive atmosphere."
              </span>
            </div>
          </div>

          {/* Core Review Carousel */}
          <div className="lg:col-span-8 bg-black/40 p-6 md:p-10 rounded-lg border border-white/10 flex flex-col justify-between relative overflow-hidden text-left backdrop-blur-md">
            
            {/* Background design quotes icon */}
            <Quote className="absolute top-8 right-8 w-24 h-24 text-zinc-800/10 pointer-events-none stroke-[1.25]" />

            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Google Reviewer
                </span>

                <span className="text-xs text-zinc-500 font-mono">
                  {currentIndex + 1} of {TESTIMONIALS.length}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* Testimonial Stars */}
                  <div className="flex text-yellow-400 gap-0.5">
                    {[...Array(TESTIMONIALS[currentIndex].stars)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current text-yellow-400" />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-base md:text-lg text-zinc-200 font-light leading-relaxed">
                    "{TESTIMONIALS[currentIndex].text}"
                  </p>

                  {/* Profile info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-zinc-950 flex items-center justify-center font-display font-extrabold text-yellow-400 uppercase border border-white/10">
                      {TESTIMONIALS[currentIndex].name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">
                        {TESTIMONIALS[currentIndex].name}
                      </p>
                      <p className="text-xs font-mono text-zinc-500">
                        {TESTIMONIALS[currentIndex].role}・{TESTIMONIALS[currentIndex].date}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider arrows */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2">
                {TESTIMONIALS[currentIndex].likes && TESTIMONIALS[currentIndex].likes! > 0 && (
                  <span className="text-xs text-zinc-500 font-mono">
                    👍 {TESTIMONIALS[currentIndex].likes} people found this review helpful
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-950 transition-colors cursor-pointer"
                  aria-label="Previous testimonial"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-950 transition-colors cursor-pointer"
                  aria-label="Next testimonial"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Highlighted text bubbles listing user favorites */}
        <div className="p-6 rounded border border-white/10 bg-black/20 flex flex-wrap items-center justify-center gap-3">
          <span className="text-xs font-mono text-zinc-500 uppercase font-bold">What people highlighted:</span>
          <span className="text-xs py-1 px-3 bg-zinc-900 border border-white/10 text-zinc-300 rounded">🏋️ Top-quality Equipment</span>
          <span className="text-xs py-1 px-3 bg-zinc-900 border border-white/10 text-zinc-300 rounded">🧼 Neat washrooms</span>
          <span className="text-xs py-1 px-3 bg-zinc-900 border border-white/10 text-zinc-300 rounded">🤝 Friendly General Trainers</span>
          <span className="text-xs py-1 px-3 bg-zinc-900 border border-white/10 text-zinc-300 rounded">⚡ Motivating Atmosphere</span>
          <span className="text-xs py-1 px-3 bg-zinc-900 border border-white/10 text-zinc-300 rounded">💎 Zero Wait Time</span>
        </div>

      </div>
    </section>
  );
}

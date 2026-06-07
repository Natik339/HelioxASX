import { useState } from 'react';
import { SERVICES } from '../data';
import { Check, CalendarRange, ArrowRight, Activity } from 'lucide-react';
import { motion } from 'motion/react';

interface ServicesProps {
  onSelectServiceForBooking: (serviceName: string) => void;
}

export default function Services({ onSelectServiceForBooking }: ServicesProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'strength' | 'cardio' | 'mind'>('all');

  const categories = {
    all: "All Services",
    strength: "Strength & Resistance",
    cardio: "Aerobic & Burn",
    mind: "Flexibility & Wellness"
  };

  const getServiceCategory = (id: string) => {
    if (id === "weight-training" || id === "crossfit" || id === "personal-training") return "strength";
    if (id === "hiit" || id === "zumba" || id === "cycling" || id === "aerobics") return "cardio";
    return "mind"; // Yoga
  };

  const filteredServices = SERVICES.filter(service => {
    if (activeTab === 'all') return true;
    return getServiceCategory(service.id) === activeTab;
  });

  return (
    <section id="programs" className="py-24 bg-[#0A0A0A] border-b border-white/10 relative">
      {/* Decorative background light */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-yellow-400/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Title with Subtext */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-yellow-400 uppercase">
            ⚡ What We Do Best
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-white mt-3 uppercase tracking-tight">
            Class & Training Programs
          </h2>
          <p className="text-zinc-400 mt-4 text-base font-light">
            Heliox Fitness offers meticulously curated workout formats. Whether you want sheer athletic strength, highly coordinated weight loss, or restorative mind body connection, we have the space and machinery.
          </p>

          {/* Filtering Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {Object.entries(categories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`px-5 py-2 rounded text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === key
                    ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/10'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => (
            <motion.div
              layout
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group bg-zinc-900/40 border border-white/10 hover:border-yellow-400/30 rounded-lg overflow-hidden flex flex-col justify-between transition-all hover:bg-zinc-900/80 hover:shadow-2xl hover:shadow-yellow-950/10"
            >
              {/* Image Section */}
              <div className="relative aspect-video overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10 opacity-70" />
                <img
                  src={service.image}
                  alt={service.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Visual Category Icon Tag */}
                <div className="absolute top-4 left-4 p-2.5 rounded-lg bg-zinc-900/90 border border-white/10 text-yellow-400 backdrop-blur-md z-20">
                  <Activity className="w-4 h-4" />
                </div>
              </div>

              {/* Description Body */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-xl md:text-2xl text-white group-hover:text-yellow-400 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-zinc-400 font-light mt-2.5 line-clamp-3">
                    {service.description}
                  </p>

                  {/* Highlights/Benefits */}
                  <ul className="mt-5 space-y-2">
                    {service.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <span className="mt-0.5 p-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Conversion Button */}
                <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-medium text-zinc-500 tracking-wider uppercase">
                    Available Slots Daily
                  </span>
                  <button
                    onClick={() => onSelectServiceForBooking(service.name)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-yellow-400 hover:text-black hover:bg-yellow-400 hover:px-3 hover:py-1.5 transition-all rounded group/btn cursor-pointer"
                  >
                    <span>Instant Book</span>
                    <CalendarRange className="w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer of the Services: Interactive suggestion */}
        <div className="mt-16 p-8 rounded-lg bg-black/40 border border-white/10 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-yellow-400/10 text-[10px] text-yellow-400 font-mono font-bold">
              Agra Exclusive
            </span>
            <h4 className="font-display font-semibold text-lg text-white mt-1.5">
              Not sure which program matches your current stamina levels?
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Use our smart interactive BMI & Workout matching calculator just down below!
            </p>
          </div>
          <a
            href="#calculators"
            className="px-5 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 font-mono text-xs font-bold text-white transition-all text-center flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <span>Run Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
}

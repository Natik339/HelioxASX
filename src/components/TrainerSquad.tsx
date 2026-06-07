import { TRAINERS } from '../data';
import { Star, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface TrainerSquadProps {
  onHireClick: (trainerName: string) => void;
}

export default function TrainerSquad({ onHireClick }: TrainerSquadProps) {
  return (
    <section id="trainers" className="py-24 bg-[#0A0A0A] border-b border-white/10 relative">
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-yellow-400/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-yellow-400 uppercase">
            🤝 THE ENCOURAGING SQUAD
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-white mt-3 uppercase tracking-tight">
            Trainer Squad
          </h2>
          <p className="text-zinc-400 mt-4 text-sm font-light">
            Train with Agra's best guides. Our trainers are highly praised in Google reviews for their friendly support, professional routines, and core alignment.
          </p>
        </div>

        {/* Profiles list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TRAINERS.map((trainer, index) => (
            <motion.div
              layout
              key={trainer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-black/20 border border-white/10 rounded-lg overflow-hidden text-left flex flex-col justify-between hover:border-yellow-400/40 transition-colors group"
            >
              <div>
                {/* Visual Avatar */}
                <div className="relative aspect-square overflow-hidden bg-zinc-900 border-b border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-10 opacity-60" />
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* General Rating Bubble */}
                  <div className="absolute top-4 right-4 py-1 px-2.5 rounded bg-zinc-950/90 border border-white/10 text-xs font-mono font-bold text-yellow-400 flex items-center gap-1 backdrop-blur-md z-20">
                    <Star className="w-3.5 h-3.5 fill-current text-yellow-400" />
                    <span>{trainer.rating} Rating</span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6">
                  <p className="text-xs font-mono text-yellow-400 uppercase tracking-widest font-semibold">
                    {trainer.role}
                  </p>
                  <h3 className="font-display font-black text-2xl text-white mt-1 uppercase">
                    {trainer.name}
                  </h3>

                  {/* Motivational Quote */}
                  <p className="text-xs text-zinc-500 italic mt-3 font-light leading-relaxed border-l-2 border-yellow-400/40 pl-3">
                    "{trainer.quote}"
                  </p>

                  <div className="mt-6">
                    <h4 className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-2">SPECIALTIES:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {trainer.specialty.map((s, sIdx) => (
                        <span key={sIdx} className="text-[10px] px-2.5 py-1 bg-zinc-900 border border-zinc-850 rounded text-zinc-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking CTA trigger */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => onHireClick(trainer.name)}
                  className="w-full py-3 rounded bg-zinc-900 border border-white/10 text-xs font-mono font-bold text-zinc-300 group-hover:bg-yellow-400 group-hover:text-black group-hover:border-yellow-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Book Session with {trainer.name.split(' ')[0]}</span>
                </button>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

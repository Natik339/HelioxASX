import { useState, useEffect } from 'react';
import { TIMETABLE_CLASSES } from '../data';
import { Calendar, User, Clock, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TrainingClass } from '../types';
import { supabase } from '../supabase';

interface TimetableProps {
  onSelectClass: (c: TrainingClass) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Classes' },
  { id: 'hiit', label: 'HIIT & Cardio' },
  { id: 'crossfit', label: 'CrossFit' },
  { id: 'zumba', label: 'Zumba & Dance' },
  { id: 'yoga', label: 'Yoga' },
  { id: 'weights', label: 'Strength Zone' },
  { id: 'cycling', label: 'Cycling Sprints' }
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

const DAY_FULL_NAMES: Record<string, string> = {
  Mon: "Monday Schedule",
  Tue: "Tuesday Schedule",
  Wed: "Wednesday Schedule",
  Thu: "Thursday Schedule",
  Fri: "Friday Schedule",
  Sat: "Saturday Schedule"
};

export default function Timetable({ onSelectClass }: TimetableProps) {
  const [selectedDay, setSelectedDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'>('Mon');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [classes, setClasses] = useState<TrainingClass[]>(TIMETABLE_CLASSES);

  useEffect(() => {
    const fetchDbClasses = async () => {
      try {
        const { data, error } = await supabase.from('classes').select('*');
        if (!error && data && data.length > 0) {
          const normalized: TrainingClass[] = data.map(c => ({
            id: c.id,
            name: c.name,
            trainer: c.trainer_name,
            day: c.day as any,
            time: c.time_slot,
            category: c.category
          }));
          setClasses(normalized);
        }
      } catch (err) {
        console.warn("Could not query classes table, utilizing fallback list.", err);
      }
    };
    fetchDbClasses();
  }, []);

  // Filter schedules
  const classesToShow = classes.filter(c => {
    const dayMatch = c.day === selectedDay;
    const categoryMatch = selectedCategory === 'all' || c.category === selectedCategory;
    return dayMatch && categoryMatch;
  });

  return (
    <section id="timetable" className="py-24 bg-[#0A0A0A] border-b border-white/10 relative">
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-yellow-400/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
          <div className="text-left">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-yellow-400 uppercase">
              📅 Dynamic Calendar
            </span>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl text-white mt-3 uppercase tracking-tight">
              Weekly Timetable
            </h2>
            <p className="text-zinc-400 mt-2 text-sm font-light max-w-xl">
              Find your perfect workout session. Select any class card below to instantly pre-fill your Free Trial booking sheet.
            </p>
          </div>

          {/* Business Hours Note */}
          <div className="p-4 rounded bg-black/40 border border-white/10 text-left backdrop-blur-md">
            <p className="text-xs text-zinc-500 font-mono uppercase">Working Hours</p>
            <p className="text-sm font-bold text-white mt-0.5">6:00 AM - 10:30 PM</p>
            <p className="text-xs text-yellow-400 font-mono tracking-wide mt-1">Mon to Sat • Sundays Closed</p>
          </div>
        </div>

        {/* Days of the Week Selection Bar */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-black/40 p-2 rounded border border-white/10">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`py-3 rounded text-xs md:text-sm font-display font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedDay === day
                  ? 'bg-yellow-400 text-black shadow-md font-extrabold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Categories filters bar */}
        <div className="flex flex-wrap items-center gap-1.5 mt-6 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-zinc-100 text-zinc-950 font-bold'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Classes Scheduled Feed */}
        <div className="relative min-h-[300px]">
          <AnimatePresence mode="popLayout">
            {classesToShow.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {classesToShow.map((c) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={c.id}
                    className="p-5 bg-black/20 border border-white/10 hover:border-yellow-400/40 rounded-lg flex flex-col justify-between hover:shadow-xl hover:shadow-yellow-950/5 group text-left transition-all"
                  >
                    <div>
                      {/* Top metadata tag */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="p-1 px-2.5 rounded bg-zinc-900 text-[10px] text-zinc-400 font-mono uppercase tracking-wider border border-white/10">
                          {c.category}
                        </span>
                        <span className="text-[10px] text-yellow-400 font-semibold font-mono tracking-wider animate-pulse">
                          ● SPOTS OPEN
                        </span>
                      </div>

                      {/* Name of class */}
                      <h4 className="font-display font-extrabold text-lg text-white group-hover:text-yellow-400 transition-colors">
                        {c.name}
                      </h4>

                      {/* Details lines */}
                      <div className="space-y-2 mt-4">
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <Clock className="w-3.5 h-3.5 text-yellow-400" />
                          <span className="font-mono">{c.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <User className="w-3.5 h-3.5 text-yellow-400" />
                          <span>{c.trainer}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick booking link */}
                    <button
                      onClick={() => onSelectClass(c)}
                      className="mt-6 w-full py-2.5 rounded border border-white/10 group-hover:border-yellow-400/40 group-hover:bg-yellow-400 group-hover:text-black text-xs font-mono font-bold text-zinc-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Book Free Trial</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center border border-dashed border-white/10 rounded bg-black/20"
              >
                <Calendar className="w-10 h-10 text-zinc-600 mx-auto stroke-[1.25]" />
                <p className="text-sm font-semibold text-zinc-300 mt-4">
                  No classes scheduled in this track for {DAY_FULL_NAMES[selectedDay]}.
                </p>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                  General training floor is always open 6 AM to 10:30 PM with zero waiting time. Try selecting a different day or category.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Timetable schedule info box */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between p-4 rounded bg-black/40 border border-white/10 backdrop-blur-md gap-4">
          <p className="text-xs text-zinc-400 text-left">
            💡 <strong>Special note for beginners</strong>: General trainers are always available on the floor from opening space to close-up time for standard support, machine setups, and safety corrections.
          </p>
          <a
            href="#trainers"
            className="text-xs font-mono font-bold text-yellow-400 hover:text-yellow-300 flex items-center gap-1 group whitespace-nowrap"
          >
            Meet the Trainers
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

      </div>
    </section>
  );
}

import { GYM_DETAILS } from '../data';
import { Dumbbell, Phone, MapPin, Heart, ArrowUp, Instagram, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] text-zinc-400 text-xs border-t border-white/10 pt-16 pb-8 relative z-10 text-left">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Culmination branding */}
        <div className="space-y-4">
          <a href="#" className="flex items-center gap-2 group">
            <div className="p-2 bg-yellow-400 rounded shadow-lg">
              <Dumbbell className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-white block">
                HELIOX
              </span>
              <span className="text-[10px] font-mono tracking-[0.2em] text-yellow-400 font-bold uppercase block -mt-1">
                Fitness Gym
              </span>
            </div>
          </a>

          <p className="text-xs text-zinc-500 font-light leading-relaxed">
            Leading the path for premium bodybuilding, fat reduction workouts, high-intensity functional training, and community wellness in Kamla Nagar, Agra.
          </p>

          <div className="flex items-center gap-2 pt-2 text-xs text-zinc-400 font-mono">
            <span className="bg-yellow-400/10 text-yellow-400 font-bold px-2 py-0.5 rounded border border-yellow-400/20">
              4.7 ⭐
            </span>
            <span>Based on 279+ active reviews</span>
          </div>

          {/* Social Buttons */}
          <div className="flex items-center gap-3 pt-3">
            <a
              href={GYM_DETAILS.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-zinc-900 hover:bg-yellow-400 hover:text-black border border-white/5 rounded text-zinc-400 transition-colors"
              title="Follow Heliox Fitness on Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={GYM_DETAILS.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-zinc-900 hover:bg-yellow-400 hover:text-black border border-white/5 rounded text-zinc-400 transition-colors"
              title="Follow Heliox Fitness on Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={GYM_DETAILS.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-zinc-900 hover:bg-yellow-400 hover:text-black border border-white/5 rounded text-zinc-400 transition-colors"
              title="Follow Heliox Fitness on YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick scroll sections links */}
        <div>
          <h4 className="font-display font-bold text-white uppercase text-xs tracking-wider mb-5">
            Gym Guide
          </h4>
          <ul className="space-y-3 text-xs text-zinc-500">
            <li>
              <a href="#programs" className="hover:text-yellow-400 transition-colors">
                Class & Training Programs
              </a>
            </li>
            <li>
              <a href="#trainers" className="hover:text-yellow-400 transition-colors">
                Support Trainer Squad
              </a>
            </li>
            <li>
              <a href="#timetable" className="hover:text-yellow-400 transition-colors">
                Weekly Class Timetable
              </a>
            </li>
            <li>
              <a href="#calculators" className="hover:text-yellow-400 transition-colors">
                Interactive BMI Matcher
              </a>
            </li>
            <li>
              <a href="#reviews" className="hover:text-yellow-400 transition-colors">
                Google Reviews Feed
              </a>
            </li>
          </ul>
        </div>

        {/* Dynamic services list */}
        <div>
          <h4 className="font-display font-bold text-white uppercase text-xs tracking-wider mb-5">
            Our Disciplines
          </h4>
          <ul className="space-y-3 text-xs text-zinc-500">
            <li>HIIT exercise classes</li>
            <li>CrossFit Conditioning</li>
            <li>Authentic Yoga Flow</li>
            <li>Zumba & Dance Fitness</li>
            <li>Weight Hypertrophy</li>
            <li>Cycling Cadence</li>
          </ul>
        </div>

        {/* Contact info quickly */}
        <div className="space-y-4 text-xs font-light">
          <h4 className="font-display font-bold text-white uppercase tracking-wider text-xs mb-5">
            Direct Concierge Desk
          </h4>
          
          <div className="space-y-3">
            <div className="flex gap-2.5 items-start">
              <MapPin className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-zinc-500 leading-relaxed">
                {GYM_DETAILS.address} <br />
                Professors Colony, Ghatwasan, Kamla Nagar, Agra
              </p>
            </div>

            <div className="flex gap-2.5 items-center">
              <Phone className="w-4 h-4 text-yellow-400 shrink-0" />
              <p className="font-mono text-zinc-350 font-bold">{GYM_DETAILS.phone}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Extreme Bottom rights bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-650 gap-4">
        <p className="text-center font-light">
          © {currentYear} {GYM_DETAILS.name}. All legal rights reserved. Proudly serving Kamla Nagar & surrounding Agra regions.
        </p>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-zinc-650 uppercase">Follow Us:</span>
            <a
              href={GYM_DETAILS.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-yellow-400 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={GYM_DETAILS.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-yellow-400 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={GYM_DETAILS.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-yellow-400 transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-white font-mono cursor-pointer transition-colors"
          >
            <span>Return to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-yellow-400 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </footer>
  );
}

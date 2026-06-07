import React, { useState } from 'react';
import { SERVICES, GYM_DETAILS } from '../data';
import { Calendar, Phone, MapPin, CheckSquare, Sparkles, Trash2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Booking } from '../types';
import { supabase } from '../supabase';

interface BookingFormProps {
  initialService: string;
  initialDay: string;
  initialTimeSlot: string;
  onSubmitSuccess: () => void;
  bookings: Booking[];
  onDeleteBooking: (id: string) => void;
}

export default function BookingForm({
  initialService,
  initialDay,
  initialTimeSlot,
  onSubmitSuccess,
  bookings,
  onDeleteBooking
}: BookingFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(initialService || 'Weight Training');
  const [day, setDay] = useState(initialDay || 'Mon');
  const [time, setTime] = useState(initialTimeSlot || '08:00 AM - 09:00 AM');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sync state if initial changes
  React.useEffect(() => {
    if (initialService) setService(initialService);
    if (initialDay) setDay(initialDay);
    if (initialTimeSlot) setTime(initialTimeSlot);
  }, [initialService, initialDay, initialTimeSlot]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setSubmitting(true);

    // Save to local storage (for offline fallback persistence)
    const newBooking: Booking = {
      id: "book-" + Date.now(),
      name,
      phone,
      email: email || "N/A",
      service,
      date: day,
      timeSlot: time,
      notes,
      status: 'confirmed',
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    try {
      // Fetch authenticated user ID if any
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id || null;

      // Insert directly to Supabase bookings table
      const { error } = await supabase
        .from('bookings')
        .insert([{
          user_id: currentUserId,
          name,
          phone,
          email: email || "N/A",
          service,
          day,
          time_slot: time,
          notes,
          status: 'confirmed'
        }]);

      if (error) {
        console.warn("Supabase insert warning, falling back to local storage only:", error);
      }
    } catch (err) {
      console.error("Database connection failure:", err);
    }

    // Always keep offline local storage copy intact for perfect fallback assurance
    const existing = localStorage.getItem('heliox-bookings');
    const list = existing ? JSON.parse(existing) : [];
    list.unshift(newBooking);
    localStorage.setItem('heliox-bookings', JSON.stringify(list));

    setSubmitting(false);
    setSuccess(true);
    onSubmitSuccess();

    // Clear fields
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
  };

  return (
    <section id="contact" className="py-24 bg-[#0A0A0A] border-t border-white/10 relative">
      <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-yellow-400/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-yellow-400 uppercase">
            🚀 ZERO OBLIGATION TRIAL
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-white mt-3 uppercase tracking-tight">
            Book Free Trial Now
          </h2>
          <p className="text-zinc-400 mt-4 text-sm font-light">
            Claim your 1-Day free discovery pass or book a designated class slot below. No card required. Bring clean athletic shoes and start your journey.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Block: Business Desk Information */}
          <div className="lg:col-span-5 space-y-6 text-left">
            
            <div className="bg-black/20 p-6 md:p-8 rounded-lg border border-white/10">
              <h3 className="font-display font-bold text-xl text-white uppercase tracking-tight">
                Heliox Physical Spot
              </h3>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-wide mt-1">Official Location Desk</p>

              <div className="space-y-6 mt-8">
                {/* Item 1: Address */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-zinc-950 border border-white/10 rounded text-yellow-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100">Our Address</h4>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      {GYM_DETAILS.address} <br />
                      <span className="text-yellow-400/90 font-mono font-medium mt-1 inline-block">Kamla Nagar, near Best Gym Agra</span>
                    </p>
                  </div>
                </div>

                {/* Item 2: Phone */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-zinc-950 border border-white/10 rounded text-yellow-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100">Hotline Phone Dial</h4>
                    <p className="text-base font-mono font-bold text-white mt-1">
                      {GYM_DETAILS.phone}
                    </p>
                    <p className="text-[10px] text-zinc-500">Give us a ring between 6:00 AM & 10:30 PM</p>
                  </div>
                </div>

                {/* Item 3: Schedule */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-zinc-950 border border-white/10 rounded text-yellow-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100">Gym Shift Hours</h4>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Mon - Sat: 6:00 AM to 10:30 PM <br />
                      <strong className="text-yellow-400 font-mono font-semibold">Sundays Closed</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Static responsive Google Maps Mockup */}
            <div className="rounded-lg overflow-hidden border border-white/10 aspect-video relative bg-black/20 group">
              {/* Maps Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-zinc-950 to-zinc-950/20 z-10 text-left">
                <span className="text-[9px] font-mono uppercase bg-yellow-400 text-zinc-950 px-1.5 py-0.5 rounded font-bold">AGRA MAPS</span>
                <p className="text-sm font-bold text-white mt-1">Ghatwasan, Kamla Nagar, Agra</p>
                <p className="text-[10px] text-zinc-400">Easy accessibility with ample front car parking area.</p>
              </div>

              {/* Direct Mock Maps representation */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3548.163013233857!2d78.019808675451!3d27.21401387646877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397477610ab217cb%3A0xc6820fb052cf0f95!2sHeliox%20Fitness%20Gym!5e0!3m2!1sen!2sin!4v1717750000000!5m2!1sen!2sin" 
                className="w-full h-full border-0 opacity-80 group-hover:opacity-100 transition-opacity" 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right Block: Dynamic Enrollment Form */}
          <div className="lg:col-span-7 bg-black/20 p-6 md:p-10 rounded-lg border border-white/10 text-left">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center mb-6">
                    <CheckSquare className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">
                    Discovery Slot Locked!
                  </h3>
                  <p className="text-zinc-400 text-sm mt-3 max-w-sm mx-auto leading-relaxed">
                    Fantastic! Your trial reservation is verified. We saved this booking detail to your offline workspace hub (see "My Hub" dashboard).
                  </p>

                  <div className="p-4 bg-zinc-950 border border-white/10 rounded mt-6 max-w-xs mx-auto space-y-1">
                    <p className="text-xs text-zinc-500 font-mono">CONFIRMED PASS</p>
                    <p className="text-sm font-semibold text-white">{service}</p>
                    <p className="text-xs text-yellow-400 font-mono">{day} • {time}</p>
                  </div>

                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-8 px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs rounded transition-colors cursor-pointer"
                  >
                    Book Additional Session
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <h3 className="font-display font-bold text-xl text-white uppercase tracking-tight">
                      Enroll Instantly
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-zinc-400 mb-2">
                        Full Name <span className="text-yellow-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded py-3 px-4 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                        placeholder="e.g. Rajkumar Sharma"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-zinc-400 mb-2">
                        Contact Phone No <span className="text-yellow-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded py-3 px-4 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                        placeholder="e.g. 095577 xxxxx"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-zinc-400 mb-2">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded py-3 px-4 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                      placeholder="e.g. name@domain.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Selected Program */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-zinc-400 mb-2">
                        Class Program Session
                      </label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded py-3 px-4 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors appearance-none cursor-pointer"
                      >
                        {SERVICES.map((s) => (
                          <option key={s.id} value={s.name} className="bg-zinc-950">
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Preferred Day */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-zinc-400 mb-2">
                        Preferred Week Day
                      </label>
                      <select
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded py-3 px-4 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="Mon" className="bg-zinc-950">Monday (Operates 6am - 10:30pm)</option>
                        <option value="Tue" className="bg-zinc-950">Tuesday (Operates 6am - 10:30pm)</option>
                        <option value="Wed" className="bg-zinc-950">Wednesday (Operates 6am - 10:30pm)</option>
                        <option value="Thu" className="bg-zinc-950">Thursday (Operates 6am - 10:30pm)</option>
                        <option value="Fri" className="bg-zinc-950">Friday (Operates 6am - 10:30pm)</option>
                        <option value="Sat" className="bg-zinc-950">Saturday (Operates 6am - 10:30pm)</option>
                      </select>
                    </div>
                  </div>

                  {/* Time slot toggle selection */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-zinc-400 mb-2">
                      Preferred Time Slot Track
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        "07:00 AM - 08:00 AM",
                        "08:30 AM - 09:30 AM",
                        "10:00 AM - 11:00 AM",
                        "05:30 PM - 06:30 PM",
                        "07:00 PM - 08:00 PM",
                        "08:30 PM - 09:30 PM"
                      ].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTime(slot)}
                          className={`py-2 rounded border text-center text-xs font-mono transition-colors cursor-pointer ${
                            time === slot
                              ? 'bg-yellow-400 border-yellow-400 text-black font-extrabold'
                              : 'bg-[#0A0A0A] border-white/10 text-zinc-450 hover:border-white/20'
                          }`}
                        >
                          {slot.split(' - ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom goals goals notes input */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-zinc-400 mb-2">
                      Core Goals / Medical conditions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded py-3 px-4 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                      placeholder="e.g. Lose fat, build massive leg strength, improve posture, beginner at zumba matches..."
                    />
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-yellow-400 text-black font-display font-bold rounded text-xs tracking-widest uppercase shadow-xl shadow-yellow-500/10 hover:bg-yellow-300 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? "Locking reservation..." : "Submit Pass Booking Request"}
                  </button>

                  <p className="text-[10px] text-zinc-500 text-center">
                    🔒 Rest assured. We prioritize hygiene. Heliox requires clean footwear and follows standard security guidelines.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}

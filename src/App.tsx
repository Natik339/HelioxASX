import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import TrainerSquad from './components/TrainerSquad';
import Timetable from './components/Timetable';
import Calculators from './components/Calculators';
import TestimonialsHub from './components/TestimonialsHub';
import BookingForm from './components/BookingForm';
import MyBookingsTray from './components/MyBookingsTray';
import Footer from './components/Footer';

import { PRICING_PLANS, GALLERY_PHOTOS, GYM_DETAILS } from './data';
import { Booking, TrainingClass } from './types';
import { Check, ShieldCheck, HelpCircle, Dumbbell, Award, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from './supabase';

export default function App() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isMyHubOpen, setIsMyHubOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>(PRICING_PLANS);
  const [subscriptionAlert, setSubscriptionAlert] = useState<string | null>(null);

  // States for pre-filling class values in the Booking Intake form
  const [selectedService, setSelectedService] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  // Hydrate local bookings & sync Supabase information
  useEffect(() => {
    const saved = localStorage.getItem('heliox-bookings');
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to read bookings", err);
      }
    }

    // 1. Fetch plans dynamically from Supabase database (with offline local fallback)
    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase.from('membership_plans').select('*');
        if (!error && data && data.length > 0) {
          const normalized = data.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            period: p.period,
            features: p.features,
            popular: p.popular,
            accentColor: p.accent_color || "border-zinc-800 hover:border-zinc-700 font-mono"
          }));
          setPlans(normalized);
        }
      } catch (err) {
        console.warn("Could not query DB pricing plans. Utilizing fallback PRICING_PLANS array:", err);
      }
    };
    fetchPlans();

    // 2. Fetch authenticated session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setActiveUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setActiveUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleBookingAdded = () => {
    const saved = localStorage.getItem('heliox-bookings');
    if (saved) {
      setBookings(JSON.parse(saved));
    }
  };

  const handleDeleteBooking = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem('heliox-bookings', JSON.stringify(updated));
  };

  // Pre-fill selection events
  const handleSelectService = (serviceName: string) => {
    setSelectedService(serviceName);
    scrollToSection('#contact');
  };

  const handleSelectClass = (c: TrainingClass) => {
    setSelectedService(c.name);
    setSelectedDay(c.day);
    setSelectedTimeSlot(c.time);
    scrollToSection('#contact');
  };

  const handleSelectPlan = async (plan: any) => {
    // Check if user is authenticated via Supabase auth
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      setSubscriptionAlert(`Syncing and activating subscription for ${plan.name}...`);
      
      const startDate = new Date();
      const endDate = new Date();
      if (plan.id === 'quarterly') endDate.setMonth(endDate.getMonth() + 3);
      else if (plan.id === 'annual') endDate.setFullYear(endDate.getFullYear() + 1);
      else endDate.setMonth(endDate.getMonth() + 1);

      try {
        const { error } = await supabase
          .from('user_subscriptions')
          .insert([{
            user_id: session.user.id,
            plan_name: plan.name,
            price: plan.price,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            status: 'active'
          }]);

        if (error) throw error;

        setSubscriptionAlert(`🎉 Success! Subscription tier "${plan.name}" is now fully ACTIVE on your cloud profile.`);
        setTimeout(() => {
          setSubscriptionAlert(null);
          setIsMyHubOpen(true); // Open member portal drawer to display active plan badge!
        }, 2200);

      } catch (err: any) {
        setSubscriptionAlert(`Backend Error: ${err.message || 'Verification rejected'}`);
        setTimeout(() => setSubscriptionAlert(null), 4000);
      }
    } else {
      // Unauthenticated - Prefill in the Booking Trial Inquiry Form
      setSelectedService(`${plan.name} pass (₹${plan.price})`);
      setSubscriptionAlert(`Prefilled "${plan.name}" details. Please Sign In/Up in "My Hub" for secure cloud management.`);
      setTimeout(() => setSubscriptionAlert(null), 4500);
      scrollToSection('#contact');
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
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
    <div className="bg-[#0A0A0A] min-h-screen text-gray-100 selection:bg-yellow-400 selection:text-black font-sans antialiased">
      
      {/* Dynamic Header */}
      <Header
        onBookClick={() => scrollToSection('#contact')}
        onMyBookingsClick={() => setIsMyHubOpen(true)}
        bookingsCount={bookings.length}
      />

      {/* Hero visual banner section */}
      <Hero
        onBookClick={() => scrollToSection('#contact')}
        onJoinClick={() => scrollToSection('#pricing')}
      />

      {/* Services / training programs list */}
      <Services onSelectServiceForBooking={handleSelectService} />

      {/* Trainer Squad profiles */}
      <TrainerSquad onHireClick={(trainerName) => handleSelectService(`Personal Training with Coach ${trainerName}`)} />

      {/* Timetable weekly schedule */}
      <Timetable onSelectClass={handleSelectClass} />

      {/* Interactive Hub with BMI and Custom Plan Calculators */}
      <Calculators
        onPlanSelect={handleSelectPlan}
        onClassSelectByName={handleSelectService}
      />

      {/* Pricing Matrix Plans Grid */}
      <section id="pricing" className="py-24 bg-[#0A0A0A] border-b border-white/10 relative">
        <div className="absolute top-[20%] left-0 w-80 h-80 bg-yellow-400/5 rounded-full blur-[110px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Header text */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-yellow-400 uppercase">
              💎 Transparent Value tiers
            </span>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl text-white mt-3 uppercase tracking-tight">
              Flexible Pricing Plans
            </h2>
            <p className="text-zinc-400 mt-4 text-sm font-light">
              Choose the layout that empowers your routine. Select a membership plan card below to instantly prep an active booking on your device.
            </p>
          </div>

          {/* Subscription Confirmation Alert Block */}
          {subscriptionAlert && (
            <div className="max-w-2xl mx-auto mb-10 p-4 rounded-xl font-mono text-xs bg-zinc-900 border-2 border-yellow-400 text-yellow-400 text-center animate-pulse flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>{subscriptionAlert}</span>
            </div>
          )}

          {/* Pricing cards flex row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`p-6 rounded-2xl border bg-zinc-950/75 text-left flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative ${plan.accentColor}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-[10px] font-mono font-black text-black rounded-full tracking-wider uppercase shadow-md whitespace-nowrap">
                    ⭐ AGRA'S HIGHEST VALUE
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest font-bold">
                    {plan.name.split(' ')[0]} Category
                  </span>
                  <h3 className="font-display font-bold text-xl text-white mt-2 group-hover:text-yellow-400">
                    {plan.name}
                  </h3>

                  <div className="flex items-baseline gap-1 mt-5 pb-5 border-b border-zinc-900">
                    <span className="text-sm font-mono text-zinc-400 font-bold">₹</span>
                    <span className="text-4xl font-display font-black text-white">{plan.price}</span>
                    <span className="text-xs text-zinc-500 font-mono">/ {plan.period}</span>
                  </div>

                  {/* Bullet points benefits */}
                  <ul className="space-y-3 mt-6">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <span className="p-0.5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 mt-0.5 shrink-0">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </span>
                        <span className="leading-normal">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      plan.popular
                        ? 'bg-yellow-400 text-black hover:bg-yellow-300 shadow-lg shadow-yellow-400/20'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
                    }`}
                  >
                    Select Plan
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick facilities trust icons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 p-6 md:p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
            <div className="flex gap-4 items-center">
              <div className="p-3 rounded-xl bg-yellow-400/10 text-yellow-400">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white">Elite Varieties</h4>
                <p className="text-xs text-zinc-500 mt-1">Huge range of specialized lifting machines.</p>
              </div>
            </div>

            <div className="flex gap-4 items-center border-y sm:border-y-0 sm:border-x border-white/10 py-4 sm:py-0 sm:px-6">
              <div className="p-3 rounded-xl bg-yellow-400/10 text-yellow-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white">High Ambiance Ample</h4>
                <p className="text-xs text-zinc-500 mt-1">Super spacious layout & sanitized washrooms.</p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="p-3 rounded-xl bg-yellow-400/10 text-yellow-400">
                <Award className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white">Zero Wait Time</h4>
                <p className="text-xs text-zinc-500 mt-1">Dozens of equipment sets, no standing waiting.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Testimonials Summary segment */}
      <TestimonialsHub />

      {/* Visual Ambiance Gallery Grid */}
      <section id="gallery" className="py-24 bg-[#0A0A0A] border-b border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Gallery title */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-yellow-400 uppercase">
              🖼️ VISUAL TOUR
            </span>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl text-white mt-3 uppercase tracking-tight">
              Heliox Ambiance Gallery
            </h2>
            <p className="text-zinc-400 mt-4 text-sm font-light">
              Catch a glimpse of the energetic vibes, proper lighting setups, top-tier lifting zones, and spotless flooring layouts.
            </p>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GALLERY_PHOTOS.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="relative rounded-2xl overflow-hidden aspect-video border border-white/10 group bg-zinc-900"
              >
                {/* Visual dark overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10 text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[9px] font-mono uppercase bg-yellow-400 text-black px-1.5 py-0.5 rounded font-bold">
                    HELIOX INTERIOR
                  </span>
                  <p className="text-sm font-bold text-white mt-1">{photo.title}</p>
                </div>

                <img
                  src={photo.url}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Free Trial reservation inquiry Form block */}
      <BookingForm
        initialService={selectedService}
        initialDay={selectedDay}
        initialTimeSlot={selectedTimeSlot}
        onSubmitSuccess={handleBookingAdded}
        bookings={bookings}
        onDeleteBooking={handleDeleteBooking}
      />

      {/* Sticky footer visual information */}
      <Footer />

      {/* Floating Offline reserved items tray drawer */}
      <MyBookingsTray
        isOpen={isMyHubOpen}
        onClose={() => setIsMyHubOpen(false)}
        bookings={bookings}
        onDelete={handleDeleteBooking}
      />

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { supabase } from '../supabase';
import { 
  X, CalendarCheck, ShieldAlert, Phone, Trash2, CalendarCheck2, 
  User, Lock, Mail, LogIn, LogOut, Loader2, Sparkles, Plus, 
  Flame, Award, Scale, HelpCircle, Activity, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GYM_DETAILS } from '../data';

interface MyBookingsTrayProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onDelete: (id: string) => void;
  userId?: string | null;
  onAuthChange?: () => void;
}

interface SupabaseBooking {
  id: string;
  service: string;
  day: string;
  time_slot: string;
  name: string;
  phone: string;
  status: string;
  created_at: string;
}

interface UserProgressLog {
  id: string;
  weight: number;
  weight_unit: string;
  height_str: string;
  bmi: number;
  category: string;
  logged_at: string;
}

interface UserSubscription {
  id: string;
  plan_name: string;
  price: string;
  start_date: string;
  end_date: string;
  status: string;
}

export default function MyBookingsTray({ 
  isOpen, 
  onClose, 
  bookings, 
  onDelete,
  onAuthChange
}: MyBookingsTrayProps) {
  const [portalTab, setPortalTab] = useState<'offline' | 'supabase'>('supabase');
  
  // Supabase Auth and User Info States
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Authenticated states
  const [dbBookings, setDbBookings] = useState<SupabaseBooking[]>([]);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [progressLogs, setProgressLogs] = useState<UserProgressLog[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Quick Metric logging inside Portal states
  const [logWeight, setLogWeight] = useState('72');
  const [logHeight, setLogHeight] = useState('175');
  const [logWeightUnit, setLogWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [logStatusMessage, setLogStatusMessage] = useState('');

  // Hydrate user session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
        fetchUserData(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
        fetchUserData(session.user.id);
      } else {
        setProfile(null);
        setDbBookings([]);
        setSubscriptions([]);
        setProgressLogs([]);
      }
      if (onAuthChange) onAuthChange();
    });

    return () => subscription.unsubscribe();
  }, [isOpen]);

  const fetchUserProfile = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();
      if (!error && data) {
        setProfile(data);
      }
    } catch (err) {
      console.error("Error fetching user profile", err);
    }
  };

  const fetchUserData = async (uid: string) => {
    setDataLoading(true);
    try {
      // Fetch user specific bookings
      const { data: bData, error: bErr } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });
      
      if (!bErr && bData) setDbBookings(bData);

      // Fetch active subscriptions
      const { data: sData, error: sErr } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      if (!sErr && sData) setSubscriptions(sData);

      // Fetch user progress metrics logs
      const { data: pData, error: pErr } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', uid)
        .order('logged_at', { ascending: false });

      if (!pErr && pData) setProgressLogs(pData);
    } catch (err) {
      console.error("Failed to load authenticated dashboard data", err);
    } finally {
      setDataLoading(false);
    }
  };

  // Auth Functions
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (authMode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setLogStatusMessage("Welcome back! Loading your profile dashboard...");
      } else {
        // Sign Up Mode
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName || 'Valued Member',
            }
          }
        });
        if (error) throw error;

        // Safe check-in fallback if database trigger didn't write profiles successfully
        if (data?.user) {
          try {
            await supabase.from('profiles').upsert(
              { id: data.user.id, email, full_name: fullName || 'Valued Member' },
              { onConflict: 'id' }
            );
          } catch (profileErr) {
            console.warn("Client profile write completed:", profileErr);
          }
        }
        setLogStatusMessage("Account created successfully! Welcome to Heliox!");
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    setAuthLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  };

  // Metric Progress Log submission
  const handleAddProgressLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLogStatusMessage('');
    const wNum = parseFloat(logWeight);
    const hNum = parseFloat(logHeight);

    if (isNaN(wNum) || wNum <= 0 || isNaN(hNum) || hNum <= 0) {
      setLogStatusMessage("Please supply valid measurements.");
      return;
    }

    // Standard BMI: weight (kg) / height (m)^2
    let weightInKg = wNum;
    if (logWeightUnit === 'lbs') {
      weightInKg = wNum * 0.45359237;
    }
    const heightInM = hNum / 100;
    const bmi = parseFloat((weightInKg / (heightInM * heightInM)).toFixed(1));

    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi >= 18.5 && bmi < 24.9) category = 'Healthy Weight';
    else if (bmi >= 24.9 && bmi < 29.9) category = 'Overweight';
    else category = 'Obese Scale';

    try {
      const { error } = await supabase
        .from('user_progress')
        .insert([{
          user_id: user.id,
          weight: wNum,
          weight_unit: logWeightUnit,
          height_str: `${logHeight} cm`,
          bmi,
          category,
          notes: `Metric self-log on workspace`
        }]);

      if (error) throw error;

      setLogStatusMessage(`Logged ${bmi} BMI value!`);
      fetchUserData(user.id);
    } catch (err: any) {
      console.error(err);
      setLogStatusMessage("Database sync error: " + err.message);
    }
  };

  const handleDeleteProgressLog = async (logId: string) => {
    try {
      const { error } = await supabase
        .from('user_progress')
        .delete()
        .eq('id', logId);
      if (!error) {
        setProgressLogs(prev => prev.filter(p => p.id !== logId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelDbBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);
      if (!error) {
        setDbBookings(prev => prev.filter(b => b.id !== bookingId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-lg bg-[#0D0D0E] border-l border-white/10 shadow-2xl h-full flex flex-col justify-between text-left z-10"
      >
        {/* Main top sticky segment */}
        <div className="bg-[#0D0D0E] border-b border-white/5 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-yellow-400" />
              <div>
                <h3 className="font-display font-black text-lg text-white uppercase tracking-wider">
                  Heliox Member Hub
                </h3>
                <p className="text-[10px] text-zinc-500 font-mono">SUPABASE DIGITAL POWERED</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 px-2.5 text-[10px] font-mono font-medium text-zinc-400 hover:text-white border border-white/10 bg-black/45 rounded cursor-pointer transition-colors"
            >
              Close [Esc]
            </button>
          </div>

          {/* Tab switching */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/45 border border-white/5 rounded-md mt-6">
            <button
              onClick={() => setPortalTab('supabase')}
              className={`py-2 text-[10px] font-mono font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                portalTab === 'supabase' ? 'bg-zinc-800 text-yellow-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              🔒 Cloud Member Portal
            </button>
            <button
              onClick={() => setPortalTab('offline')}
              className={`py-2 text-[10px] font-mono font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                portalTab === 'offline' ? 'bg-zinc-800 text-yellow-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              📱 Guest Passes ({bookings.length})
            </button>
          </div>
        </div>

        {/* Outer Scroll Area container */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          
          {portalTab === 'offline' ? (
            /* Offline Fallback Area */
            <div className="space-y-4">
              <div className="bg-zinc-950 p-4 rounded border border-white/5">
                <span className="text-[9px] font-mono font-black text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                  FALLBACK OFFLINE PASSES
                </span>
                <p className="text-zinc-400 text-xs mt-2 font-light">
                  You are tracking reservations saved in your local web container cache. Upgrading to a Cloud Account allows sync and online active check-ins.
                </p>
              </div>

              {bookings.length > 0 ? (
                bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded bg-black/40 border border-white/5 flex flex-col justify-between gap-3 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-yellow-400/30" />
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[9px] font-mono font-semibold py-0.5 px-2 bg-yellow-400/10 text-yellow-400 rounded border border-yellow-400/20 uppercase tracking-widest">
                          Discovery Trial Pass
                        </span>
                        <h4 className="font-display font-medium text-base text-white mt-1.5 leading-snug">
                          {b.service}
                        </h4>
                      </div>
                      <span className="text-[9px] font-mono uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-black">
                        Active Local
                      </span>
                    </div>

                    <ul className="space-y-1 border-t border-zinc-900 pt-2.5 text-xs text-zinc-400 font-mono">
                      <li>Day: {b.date}</li>
                      <li>Slot: {b.timeSlot}</li>
                      <li>Booked For: {b.name}</li>
                    </ul>

                    <div className="flex items-center justify-between border-t border-zinc-900 pt-2 text-[10px] text-zinc-500">
                      <span>Saved {b.createdAt}</span>
                      <button
                        onClick={() => onDelete(b.id)}
                        className="text-rose-500 hover:text-rose-400 font-mono font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <CalendarCheck2 className="w-12 h-12 text-zinc-800 stroke-[1.25] mx-auto" />
                  <p className="text-sm font-semibold text-zinc-400 mt-4">No offline passes saved</p>
                  <p className="text-xs text-zinc-650 mt-2 max-w-xs mx-auto">
                    Select programs on the gym timetable, then submit a trial query to store safe reservations offline instantly.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Supabase Dynamic Member Portal Screen */
            <div className="space-y-6">
              
              {!user ? (
                /* Authentication Form if NOT authenticated */
                <div className="space-y-5 bg-black/40 p-5 rounded-lg border border-white/5">
                  <div className="text-center space-y-1 mb-4">
                    <User className="w-10 h-10 text-yellow-400 mx-auto" />
                    <h4 className="font-display font-bold text-base text-white uppercase tracking-wider">
                      {authMode === 'signin' ? 'Member Login Access' : 'Create Cloud Profile'}
                    </h4>
                    <p className="text-xs text-zinc-500 font-light max-w-xs mx-auto">
                      Access active user dashboards, metric tracking logs, and membership status checks.
                    </p>
                  </div>

                  {authError && (
                    <div className="p-3.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                      ⚠️ {authError}
                    </div>
                  )}

                  {logStatusMessage && (
                    <div className="p-3.5 rounded bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs">
                      ✨ {logStatusMessage}
                    </div>
                  )}

                  <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs font-mono">
                    {authMode === 'signup' && (
                      <div className="space-y-2">
                        <label className="block text-zinc-400 uppercase font-black tracking-wider text-[10px]">Your Full Name</label>
                        <div className="relative">
                          <span className="absolute left-3 top-3.5 text-zinc-500">
                            <Activity className="w-4 h-4" />
                          </span>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-[#1A1A1C] border border-white/10 rounded py-3.5 pl-9 pr-3 text-white focus:outline-none focus:border-yellow-400 text-xs"
                            placeholder="e.g. Yashraj Sharma"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="block text-zinc-400 uppercase font-black tracking-wider text-[10px]">Email Address</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3.5 text-zinc-500">
                          <Mail className="w-4 h-4" />
                        </span>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#1A1A1C] border border-white/10 rounded py-3.5 pl-9 pr-3 text-white focus:outline-none focus:border-yellow-400 text-xs"
                          placeholder="member@heliox.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-zinc-400 uppercase font-black tracking-wider text-[10px]">Secure Password</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3.5 text-zinc-500">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input
                          type="password"
                          required
                          value={password}
                          minLength={6}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-[#1A1A1C] border border-white/10 rounded py-3.5 pl-9 pr-3 text-white focus:outline-none focus:border-yellow-400 text-xs"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-display font-black uppercase text-xs tracking-widest rounded flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {authLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        authMode === 'signin' ? "Authenticate Password" : "Register Cloud Member"
                      )}
                    </button>
                  </form>

                  {/* Mode switcher feedback slider info */}
                  <div className="text-center pt-3 border-t border-white/5">
                    <button
                      onClick={() => {
                        setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                        setAuthError('');
                        setLogStatusMessage('');
                      }}
                      className="text-[11px] text-zinc-400 hover:text-yellow-400 font-mono transition-colors"
                    >
                      {authMode === 'signin' 
                        ? "New to Ghatwasan branch? Create account here &rarr;" 
                        : "Existing email? Member sign-in &rarr;"}
                    </button>
                  </div>
                </div>
              ) : (
                /* Authenticated User Dashboard */
                <div className="space-y-6">
                  
                  {/* Account Header Banner */}
                  <div className="bg-gradient-to-r from-zinc-950 to-zinc-900 border border-white/10 p-5 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono font-black text-yellow-400 uppercase bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                        CLOUD SESSION INDENT
                      </span>
                      <h4 className="font-display font-extrabold text-base text-white mt-2">
                        {profile?.full_name || user.email?.split('@')[0]}
                      </h4>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{user.email}</p>
                    </div>

                    <button
                      onClick={handleSignOut}
                      className="px-2.5 py-1.5 border border-white/10 bg-black/40 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/40 font-mono text-[10px] font-bold rounded flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>

                  {/* SUBSCRIPTION PLAN STATUS CARD */}
                  <div className="bg-black/45 p-4 rounded-lg border border-white/5 space-y-3">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-white/5">
                      <Award className="w-4 h-4 text-yellow-400" />
                      <h5 className="text-xs font-mono font-extrabold text-white uppercase tracking-wider">
                        My Subscription Tier
                      </h5>
                    </div>

                    {subscriptions.length > 0 ? (
                      subscriptions.map((sub) => (
                        <div key={sub.id} className="p-3 rounded bg-zinc-950 border border-yellow-400/20 flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-white text-sm">{sub.plan_name}</p>
                            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                              Renewal: {new Date(sub.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 font-bold uppercase rounded border border-emerald-500/30">
                            {sub.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="py-2">
                        <p className="text-zinc-550 text-xs font-mono">No Premium Subscriptions Active.</p>
                        <p className="text-[10px] text-zinc-500 mt-1">
                          Scroll to our Flexible Price tiers below, select any standard package, and secure your slot securely.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* SUPABASE SYNCHRONIZED REALTIME BOOKINGS */}
                  <div className="bg-black/45 p-4 rounded-lg border border-white/5 space-y-3">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-white/5">
                      <CalendarCheck className="w-4 h-4 text-emerald-400" />
                      <h5 className="text-xs font-mono font-extrabold text-white uppercase tracking-wider">
                        My Decisive Bookings ({dbBookings.length})
                      </h5>
                    </div>

                    {dataLoading ? (
                      <div className="flex justify-center items-center py-4 font-mono text-[11px] text-zinc-500 gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
                        Fetching Cloud Records...
                      </div>
                    ) : dbBookings.length > 0 ? (
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {dbBookings.map((b) => (
                          <div key={b.id} className="p-3 bg-zinc-950 rounded border border-white/5 flex flex-col gap-1 text-xs relative">
                            <button
                              onClick={() => handleCancelDbBooking(b.id)}
                              className="absolute top-3 right-3 text-zinc-550 hover:text-rose-450 p-1 rounded hover:bg-white/5"
                              title="Delete scheduling"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <p className="font-bold text-white pr-6">{b.service}</p>
                            <p className="text-[10px] text-zinc-400 font-mono">{b.day} • {b.time_slot}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-yellow-400/5 border border-yellow-400/20 text-yellow-400 font-bold uppercase rounded">
                                {b.status}
                              </span>
                              <span className="text-[9px] text-zinc-500 font-mono">Synced</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-550 text-xs font-mono py-1">No online reservations found.</p>
                    )}
                  </div>

                  {/* USER DYNAMIC HEALTH BMI PROGRESS LOGS */}
                  <div className="bg-black/45 p-4 rounded-lg border border-white/5 space-y-4">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-white/5">
                      <Scale className="w-4 h-4 text-yellow-500" />
                      <h5 className="text-xs font-mono font-extrabold text-white uppercase tracking-wider">
                        Dynamic Fitness Log (Cloud)
                      </h5>
                    </div>

                    {/* Progress logging inputs fields */}
                    <form onSubmit={handleAddProgressLog} className="grid grid-cols-12 gap-2 text-[10px] font-mono">
                      <div className="col-span-4">
                        <label className="block text-zinc-500 font-bold mb-1">Weight ({logWeightUnit})</label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          value={logWeight}
                          onChange={(e) => setLogWeight(e.target.value)}
                          className="w-full bg-[#161617] text-white p-2 border border-white/10 rounded focus:border-yellow-400 focus:outline-none"
                        />
                      </div>

                      <div className="col-span-4">
                        <label className="block text-zinc-500 font-bold mb-1">Height (cm)</label>
                        <input
                          type="number"
                          required
                          value={logHeight}
                          onChange={(e) => setLogHeight(e.target.value)}
                          className="w-full bg-[#161617] text-white p-2 border border-white/10 rounded focus:border-yellow-400 focus:outline-none"
                        />
                      </div>

                      <div className="col-span-4 flex flex-col justify-end">
                        <button
                          type="submit"
                          className="p-2 py-2.5 bg-yellow-400 text-black font-extrabold text-[10px] uppercase rounded text-center cursor-pointer hover:bg-yellow-300 transition-colors"
                        >
                          Log Metric
                        </button>
                      </div>
                    </form>

                    {/* Weight Unit Toggler inside drawer */}
                    <div className="flex gap-2 text-[9px] font-mono text-zinc-500">
                      <span>Unit:</span>
                      <button 
                        type="button" 
                        onClick={() => setLogWeightUnit('kg')} 
                        className={`font-semibold cursor-pointer ${logWeightUnit === 'kg' ? 'text-yellow-400 underline' : ''}`}
                      >
                        METRIC (KG)
                      </button>
                      <span>|</span>
                      <button 
                        type="button" 
                        onClick={() => setLogWeightUnit('lbs')} 
                        className={`font-semibold cursor-pointer ${logWeightUnit === 'lbs' ? 'text-yellow-400 underline' : ''}`}
                      >
                        IMPERIAL (LBS)
                      </button>
                    </div>

                    {logStatusMessage && (
                      <p className="text-[11px] text-yellow-400 font-mono font-medium">{logStatusMessage}</p>
                    )}

                    {/* Progress History View logs table */}
                    {progressLogs.length > 0 ? (
                      <div className="border-t border-white/5 pt-3">
                        <p className="text-[10px] font-mono font-bold text-zinc-400 mb-2 uppercase">Physical History Logs</p>
                        <div className="overflow-x-auto text-[10px] font-mono text-zinc-300">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="border-b border-white/5 text-zinc-500 font-bold">
                                <th className="pb-1.5">Date</th>
                                <th className="pb-1.5">Weight</th>
                                <th className="pb-1.5">BMI Info</th>
                                <th className="pb-1.5 text-right">Delete</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {progressLogs.slice(0, 5).map((log) => (
                                <tr key={log.id} className="hover:bg-zinc-950/20">
                                  <td className="py-2 text-[9px] text-zinc-500">
                                    {new Date(log.logged_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                  </td>
                                  <td className="py-2">{log.weight} {log.weight_unit}</td>
                                  <td className="py-2">
                                    <span className="font-extrabold text-white shrink-0 mr-1.5">{log.bmi}</span>
                                    <span className="text-[9px] text-zinc-400">{log.category.split(' ')[0]}</span>
                                  </td>
                                  <td className="py-2 text-right">
                                    <button
                                      onClick={() => handleDeleteProgressLog(log.id)}
                                      className="text-rose-500 hover:text-rose-400 transition-colors p-1"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <p className="text-zinc-600 text-[10px] font-mono">No progress metrics saved on profiles yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer contact info drawer box */}
        <div className="p-6 bg-black border-t border-white/10 space-y-4 text-xs">
          <div className="p-4 rounded bg-yellow-400/5 border border-yellow-400/15 flex gap-3 text-left">
            <ShieldAlert className="w-5 h-5 text-yellow-400 shrink-0" />
            <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
              Show these passes or account records at the reception desk upon reaching <strong className="text-zinc-200 font-semibold">Heliox Fitness Kamla Nagar, Agra</strong> for immediate trial approval.
            </p>
          </div>

          <a
            href={`tel:${GYM_DETAILS.phone}`}
            className="w-full py-3 rounded bg-yellow-400 text-black font-display font-bold text-center tracking-widest uppercase block cursor-pointer transition-colors hover:bg-yellow-300 flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 text-black stroke-[2.5]" />
            <span>Call Heliox Desk</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}

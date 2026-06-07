import React, { useState, useMemo, useEffect } from 'react';
import { SERVICES, PRICING_PLANS } from '../data';
import { Calculator, Sparkles, Scale, IndianRupee, HelpCircle, CheckCircle, ArrowRight, Plus, Trash2, History, Info, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CalculatorsProps {
  onPlanSelect: (customQuote: string) => void;
  onClassSelectByName: (className: string) => void;
}

interface BmiLog {
  id: string;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  heightStr: string;
  bmi: number;
  category: string;
  date: string;
}

export default function Calculators({ onPlanSelect, onClassSelectByName }: CalculatorsProps) {
  const [activeTab, setActiveTab] = useState<'bmi' | 'quote'>('bmi');

  // BMI Unit Systems State
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft-in'>('cm');

  // BMI Input values
  const [weight, setWeight] = useState<string>('70');
  const [height, setHeight] = useState<string>('175');
  const [heightFt, setHeightFt] = useState<string>('5');
  const [heightIn, setHeightIn] = useState<string>('9');

  // Calculated Result State
  const [bmiResult, setBmiResult] = useState<{
    bmi: number;
    category: string;
    advice: string;
    recommendedClass: string;
    minHealthyWeight: number;
    maxHealthyWeight: number;
    heightInM: number;
  } | null>(null);

  // Saved Logs history list
  const [bmiLogs, setBmiLogs] = useState<BmiLog[]>([]);

  // Load logs on component load
  useEffect(() => {
    const saved = localStorage.getItem('heliox-bmi-history');
    if (saved) {
      try {
        setBmiLogs(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to load BMI history logs", err);
      }
    }
  }, []);

  // Sync BMI state weights default values when units scale changes
  const handleWeightUnitToggle = (unit: 'kg' | 'lbs') => {
    if (unit === weightUnit) return;
    setWeightUnit(unit);
    const val = parseFloat(weight);
    if (!isNaN(val) && val > 0) {
      if (unit === 'lbs') {
        setWeight(Math.round(val * 2.20462).toString());
      } else {
        setWeight(Math.round(val / 2.20462).toString());
      }
    }
  };

  const handleHeightUnitToggle = (unit: 'cm' | 'ft-in') => {
    if (unit === heightUnit) return;
    setHeightUnit(unit);
    const val = parseFloat(height);
    if (!isNaN(val) && val > 0) {
      if (unit === 'ft-in') {
        const totalInches = val / 2.54;
        const ft = Math.floor(totalInches / 12);
        const inch = Math.round(totalInches % 12);
        setHeightFt(ft.toString());
        setHeightIn(inch.toString());
      } else {
        const ft = parseFloat(heightFt) || 0;
        const inch = parseFloat(heightIn) || 0;
        const cm = Math.round(((ft * 12) + inch) * 2.54);
        setHeight(cm.toString());
      }
    }
  };

  // BMI Calculation
  const handleCalculateBmi = (e: React.FormEvent) => {
    e.preventDefault();
    let weightInKg = 0;
    let heightInM = 0;

    const wNum = parseFloat(weight);
    if (isNaN(wNum) || wNum <= 0) return;

    if (weightUnit === 'kg') {
      weightInKg = wNum;
    } else {
      weightInKg = wNum * 0.45359237; // lbs to kg
    }

    if (heightUnit === 'cm') {
      const hNum = parseFloat(height);
      if (isNaN(hNum) || hNum <= 0) return;
      heightInM = hNum / 100;
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      const totalInches = (ft * 12) + inch;
      if (totalInches <= 0) return;
      heightInM = totalInches * 0.0254; // inches to meters
    }

    if (weightInKg > 0 && heightInM > 0) {
      const bmi = parseFloat((weightInKg / (heightInM * heightInM)).toFixed(1));
      let category = '';
      let advice = '';
      let recommendedClass = '';

      if (bmi < 18.5) {
        category = 'Underweight';
        advice = 'Focus on muscle hypertrophy and physical strength to gain healthy weight. Combine core weight training with premium protein layouts.';
        recommendedClass = 'Weight Training';
      } else if (bmi >= 18.5 && bmi < 24.9) {
        category = 'Healthy Weight';
        advice = 'Stellar! Balanced physical ratios. Keep up elite strength conditioning and power with HIIT & CrossFit sprints.';
        recommendedClass = 'CrossFit';
      } else if (bmi >= 24.9 && bmi < 29.9) {
        category = 'Overweight';
        advice = 'Increase metabolic thermic energy burn! High energy workouts combined with muscle weight resistance optimizing healthy toning.';
        recommendedClass = 'HIIT exercise classes';
      } else {
        category = 'Obese Scale';
        advice = 'Begin with structured, lower-joint cardiovascular cycling endurance workouts and step aerobics to build stamina safely.';
        recommendedClass = 'Cycling Class';
      }

      // Calculate Target Weights for BMI 18.5 and 24.9
      const minHealthyKg = 18.5 * (heightInM * heightInM);
      const maxHealthyKg = 24.9 * (heightInM * heightInM);

      const minHealthyWeight = weightUnit === 'kg' ? minHealthyKg : minHealthyKg * 2.20462;
      const maxHealthyWeight = weightUnit === 'kg' ? maxHealthyKg : maxHealthyKg * 2.20462;

      setBmiResult({
        bmi,
        category,
        advice,
        recommendedClass,
        minHealthyWeight: parseFloat(minHealthyWeight.toFixed(1)),
        maxHealthyWeight: parseFloat(maxHealthyWeight.toFixed(1)),
        heightInM
      });
    }
  };

  // Save Calculated BMI log to progress calendar history
  const handleSaveBmiLog = () => {
    if (!bmiResult) return;
    
    let heightDisplay = '';
    if (heightUnit === 'cm') {
      heightDisplay = `${height} cm`;
    } else {
      heightDisplay = `${heightFt}'${heightIn}" ft`;
    }

    const newLog: BmiLog = {
      id: `bmi-${Date.now()}`,
      weight: parseFloat(weight),
      weightUnit,
      heightStr: heightDisplay,
      bmi: bmiResult.bmi,
      category: bmiResult.category,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit'
      })
    };

    const updatedLogs = [newLog, ...bmiLogs];
    setBmiLogs(updatedLogs);
    localStorage.setItem('heliox-bmi-history', JSON.stringify(updatedLogs));
  };

  // Delete log from list
  const handleDeleteLog = (id: string) => {
    const updated = bmiLogs.filter(log => log.id !== id);
    setBmiLogs(updated);
    localStorage.setItem('heliox-bmi-history', JSON.stringify(updated));
  };

  // Custom Membership Config State
  const [duration, setDuration] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');
  const [hasPersonalTrainer, setHasPersonalTrainer] = useState<boolean>(false);
  const [hasNutrition, setHasNutrition] = useState<boolean>(false);
  const [hasLocker, setHasLocker] = useState<boolean>(false);

  // Custom Quote Calculation
  const quoteDetails = useMemo(() => {
    let basePrice = 1499;
    let baseName = "Standard Monthly Plan";

    if (duration === 'quarterly') {
      basePrice = 3799;
      baseName = "Elite 3-Month Plan";
    } else if (duration === 'annual') {
      basePrice = 11999;
      baseName = "Ultimate 12-Month Plan";
    }

    let trainerPremium = 0;
    if (hasPersonalTrainer) {
      if (duration === 'monthly') trainerPremium = 2500;
      else if (duration === 'quarterly') trainerPremium = 6000;
      else trainerPremium = 20000; // annual discounted rate
    }

    let nutritionPremium = 0;
    if (hasNutrition) {
      if (duration === 'monthly') nutritionPremium = 1000;
      else if (duration === 'quarterly') nutritionPremium = 2500;
      else nutritionPremium = 8000;
    }

    let lockerPremium = 0;
    if (hasLocker) {
      if (duration === 'monthly') lockerPremium = 400;
      else if (duration === 'quarterly') lockerPremium = 1000;
      else lockerPremium = 3000;
    }

    const total = basePrice + trainerPremium + nutritionPremium + lockerPremium;
    const itemsSelected: string[] = [baseName];
    if (hasPersonalTrainer) itemsSelected.push("1-on-1 Personal Trainer Squad");
    if (hasNutrition) itemsSelected.push("Custom Nutrition Plan chart");
    if (hasLocker) itemsSelected.push("Premium Secure Locker & Shake counter access");

    const desc = `${baseName} with customized options (${itemsSelected.slice(1).join(', ') || 'No add-ons'})`;

    return {
      basePrice,
      trainerPremium,
      nutritionPremium,
      lockerPremium,
      total,
      description: desc,
      itemsSelected
    };
  }, [duration, hasPersonalTrainer, hasNutrition, hasLocker]);

  // Gauge pointer metrics calculation
  const gaugePercentage = useMemo(() => {
    if (!bmiResult) return 0;
    const minBmi = 15;
    const maxBmi = 35;
    const val = bmiResult.bmi;
    const pct = ((val - minBmi) / (maxBmi - minBmi)) * 100;
    return Math.min(100, Math.max(0, pct));
  }, [bmiResult]);

  return (
    <section id="calculators" className="py-24 bg-[#0A0A0A] border-b border-white/10 relative">
      <div className="absolute top-10 right-10 w-80 h-80 bg-yellow-400/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-yellow-400 uppercase">
            ⚡ Interactive Gym Floor
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-white mt-3 uppercase tracking-tight">
            Interactive Fitness Hub
          </h2>
          <p className="text-zinc-400 mt-4 text-sm font-light">
            Measure your fitness status or customize your premium membership layout dynamically. Transparency is our highest standards.
          </p>

          {/* Tab toggler with premium design */}
          <div className="inline-flex rounded-lg bg-black/45 border border-white/10 p-1.5 mt-8 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('bmi')}
              className={`px-6 py-2.5 rounded text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'bmi'
                  ? 'bg-zinc-800 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Scale className="w-4 h-4 text-yellow-400" />
              BMI Pro-Tracker
            </button>
            <button
              onClick={() => setActiveTab('quote')}
              className={`px-6 py-2.5 rounded text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'quote'
                  ? 'bg-zinc-800 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <IndianRupee className="w-4 h-4 text-yellow-400" />
              Custom Plan Creator
            </button>
          </div>
        </div>

        {/* Dynamic Calculator Screens */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'bmi' ? (
            <div className="space-y-8">
              <div className="bg-black/20 p-6 md:p-10 rounded-lg border border-white/10 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
                
                {/* Left Column: inputs */}
                <form onSubmit={handleCalculateBmi} className="md:col-span-5 space-y-6 flex flex-col justify-start">
                  <div className="space-y-2">
                    <h3 className="font-display font-extrabold text-xl text-white uppercase tracking-tight flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-yellow-400" />
                      BMI Analysis
                    </h3>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      Toggle units scale below, enter your parameters, and discover your real-time body mass index category instantly.
                    </p>
                  </div>

                  {/* Unit Toggles */}
                  <div className="grid grid-cols-2 gap-4 pb-2 border-b border-white/5">
                    <div>
                      <p className="text-[10px] font-mono text-zinc-500 uppercase mb-1.5 font-bold">Weight Unit</p>
                      <div className="grid grid-cols-2 bg-black/40 border border-white/10 p-0.5 rounded">
                        <button
                          type="button"
                          onClick={() => handleWeightUnitToggle('kg')}
                          className={`py-1 text-[10px] font-mono font-bold uppercase rounded cursor-pointer transition-all ${weightUnit === 'kg' ? 'bg-yellow-400 text-black' : 'text-zinc-400 hover:text-zinc-250'}`}
                        >
                          METRIC (kg)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleWeightUnitToggle('lbs')}
                          className={`py-1 text-[10px] font-mono font-bold uppercase rounded cursor-pointer transition-all ${weightUnit === 'lbs' ? 'bg-yellow-400 text-black' : 'text-zinc-400 hover:text-zinc-250'}`}
                        >
                          IMPERIAL (lbs)
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-mono text-zinc-500 uppercase mb-1.5 font-bold">Height Unit</p>
                      <div className="grid grid-cols-2 bg-black/40 border border-white/10 p-0.5 rounded">
                        <button
                          type="button"
                          onClick={() => handleHeightUnitToggle('cm')}
                          className={`py-1 text-[10px] font-mono font-bold uppercase rounded cursor-pointer transition-all ${heightUnit === 'cm' ? 'bg-yellow-400 text-black' : 'text-zinc-400 hover:text-zinc-250'}`}
                        >
                          Metric (cm)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleHeightUnitToggle('ft-in')}
                          className={`py-1 text-[10px] font-mono font-bold uppercase rounded cursor-pointer transition-all ${heightUnit === 'ft-in' ? 'bg-yellow-400 text-black' : 'text-zinc-400 hover:text-zinc-250'}`}
                        >
                          Imperial (ft)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Weight Input */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-zinc-400 mb-2">
                        Weight ({weightUnit === 'kg' ? 'kg' : 'lbs'})
                      </label>
                      <input
                        type="number"
                        required
                        min="5"
                        max="500"
                        step="0.1"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded py-3 px-4 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                        placeholder={weightUnit === 'kg' ? 'e.g. 70' : 'e.g. 154'}
                      />
                    </div>

                    {/* Height Inputs */}
                    {heightUnit === 'cm' ? (
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase text-zinc-400 mb-2">
                          Height (cm)
                        </label>
                        <input
                          type="number"
                          required
                          min="50"
                          max="250"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          className="w-full bg-zinc-950 border border-white/10 rounded py-3 px-4 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                          placeholder="e.g. 175"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-mono font-bold uppercase text-zinc-400 mb-2">
                            Feet (ft)
                          </label>
                          <input
                            type="number"
                            required
                            min="2"
                            max="8"
                            value={heightFt}
                            onChange={(e) => setHeightFt(e.target.value)}
                            className="w-full bg-zinc-950 border border-white/10 rounded py-3 px-4 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                            placeholder="e.g. 5"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono font-bold uppercase text-zinc-400 mb-2">
                            Inches (in)
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            max="11"
                            value={heightIn}
                            onChange={(e) => setHeightIn(e.target.value)}
                            className="w-full bg-zinc-950 border border-white/10 rounded py-3 px-4 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                            placeholder="e.g. 9"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-mono font-bold rounded text-xs uppercase tracking-wider shadow-lg transition-colors cursor-pointer"
                  >
                    Calculate Body Index
                  </button>
                </form>

                {/* Right Column: Dynamic feedback results */}
                <div className="md:col-span-7 bg-black/40 p-6 md:p-8 rounded border border-white/10 flex flex-col justify-between backdrop-blur-md">
                  {bmiResult ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      {/* Calculated Header Tag */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-[10px] font-mono text-yellow-400 font-bold tracking-wider uppercase bg-yellow-400/10 px-2.5 py-1 rounded border border-yellow-400/20">
                          CALCULATED RATIOS
                        </span>
                        
                        <button
                          type="button"
                          onClick={handleSaveBmiLog}
                          className="px-3 py-1 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-yellow-400/30 text-white rounded text-[10px] font-mono flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Plus className="w-3 h-3 text-yellow-400" />
                          Save Progress Log
                        </button>
                      </div>

                      {/* Display Score and Category */}
                      <div>
                        <div className="flex items-baseline gap-4 mt-2">
                          <span className="text-5xl md:text-6xl font-display font-black text-white">
                            {bmiResult.bmi}
                          </span>
                          <span className="text-lg md:text-xl font-bold bg-yellow-400 text-transparent bg-clip-text uppercase font-mono tracking-wide">
                            {bmiResult.category}
                          </span>
                        </div>
                      </div>

                      {/* Custom Visual Colored Spectrum Bar */}
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 font-bold">
                          <span>15 (MIN)</span>
                          <span className="text-yellow-400/80">NORMAL (18.5 - 24.9)</span>
                          <span>35 (MAX)</span>
                        </div>
                        {/* Progressive Rainbow Strip */}
                        <div className="relative h-2.5 w-full rounded bg-zinc-900 border border-white/10 overflow-visible flex">
                          <div className="h-full w-[17.5%] bg-sky-500/80 rounded-l-xs" title="Underweight (<18.5)" />
                          <div className="h-full w-[32%] bg-emerald-500/80" title="Healthy weight (18.5 - 24.9)" />
                          <div className="h-full w-[25%] bg-amber-500/80" title="Overweight (24.9 - 29.9)" />
                          <div className="h-full w-[25.5%] bg-rose-600/80 rounded-r-xs" title="Obese (>=30)" />
                          
                          {/* Selector Pointer Pin */}
                          <motion.div
                            initial={{ left: 0 }}
                            animate={{ left: `${gaugePercentage}%` }}
                            transition={{ type: 'spring', damping: 15 }}
                            className="absolute -top-1 w-2.5 h-4 bg-white border border-black shadow-lg rounded-full -translate-x-1/2 flex justify-center"
                          >
                            <span className="absolute -top-4 text-[9px] font-mono font-black text-white">{bmiResult.bmi}</span>
                          </motion.div>
                        </div>
                        {/* Categorized intervals guides */}
                        <div className="grid grid-cols-4 text-center text-[10px] font-mono text-zinc-500 pt-1">
                          <span>Underweight</span>
                          <span className="text-emerald-400/70">Healthy</span>
                          <span className="text-amber-400/70">Overweight</span>
                          <span>Obese</span>
                        </div>
                      </div>

                      {/* Personalized target advice box */}
                      <div className="p-4 bg-zinc-950 border border-white/10 rounded">
                        <p className="text-xs text-zinc-400 font-light leading-relaxed">
                          {bmiResult.advice}
                        </p>
                      </div>

                      {/* Goal Weights Details & recommended class */}
                      <div className="border-t border-white/10 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-3 bg-white/5 rounded border border-white/5">
                          <p className="text-[10px] text-zinc-500 font-mono uppercase font-bold tracking-wider flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5 text-yellow-400" />
                            Healthy Target Weight
                          </p>
                          <p className="text-sm font-black text-white mt-1.5">
                            {bmiResult.minHealthyWeight} {weightUnit} - {bmiResult.maxHealthyWeight} {weightUnit}
                          </p>
                          <p className="text-[9px] text-zinc-400 mt-1 font-light leading-snug">
                            Ideal safe standard weight for your height parameter coordinates.
                          </p>
                        </div>

                        <div className="p-3 bg-white/5 rounded border border-white/5 flex flex-col justify-between items-start">
                          <div>
                            <p className="text-[10px] text-zinc-500 font-mono uppercase font-bold tracking-wider">
                              MATCHED CLASS
                            </p>
                            <p className="text-sm font-black text-white mt-1">{bmiResult.recommendedClass}</p>
                          </div>
                          
                          <button
                            onClick={() => onClassSelectByName(bmiResult.recommendedClass)}
                            className="mt-2 py-1.5 px-3 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] text-yellow-400 font-mono font-bold border border-yellow-400/20 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer w-full"
                          >
                            <span>Book This Trial class</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-8">
                      <Scale className="w-12 h-12 text-zinc-700 stroke-[1.25]" />
                      <p className="text-zinc-300 font-bold text-sm mt-4">Calculators System Standby</p>
                      <p className="text-xs text-zinc-500 mt-2 max-w-sm font-light">
                        Enter your weight and height parameters, choose Metric/Imperial scales on the left panel, and click calculate to discover your fit programs.
                      </p>
                    </div>
                  )}
                </div>

              </div>

              {/* Progress Calendar Logs section */}
              {bmiLogs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/20 rounded-lg border border-white/10 p-6 text-left"
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <History className="w-4.5 h-4.5 text-yellow-400" />
                      <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                        My Saved Progress Logs
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">
                      {bmiLogs.length} Records Loaded
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono">
                      <thead>
                        <tr className="border-b border-white/5 text-zinc-500 pb-2">
                          <th className="text-left py-2 font-bold uppercase tracking-wider">Date</th>
                          <th className="text-left py-2 font-bold uppercase tracking-wider">Height</th>
                          <th className="text-left py-2 font-bold uppercase tracking-wider">Weight</th>
                          <th className="text-left py-2 font-bold uppercase tracking-wider">BMI Value</th>
                          <th className="text-left py-2 font-bold uppercase tracking-wider">Assessment</th>
                          <th className="text-right py-2 font-bold uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {bmiLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3 text-zinc-400 text-[11px] font-medium">{log.date}</td>
                            <td className="py-3 text-zinc-300">{log.heightStr}</td>
                            <td className="py-3 text-zinc-300">
                              {log.weight} {log.weightUnit}
                            </td>
                            <td className="py-3 text-white font-extrabold">{log.bmi}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                log.category.includes('Healthy') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                log.category.includes('Overweight') ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                                log.category.includes('Underweight') ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                                'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}>
                                {log.category.split(' ')[0]}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => handleDeleteLog(log.id)}
                                className="p-1 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all cursor-pointer"
                                title="Remove parameter log"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            /* Custom quote plans generator */
            <div className="bg-black/20 p-6 md:p-10 rounded-lg border border-white/10 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
              
              {/* Config space */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <h3 className="font-display font-extrabold text-xl text-white uppercase tracking-tight flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    Configure Your Membership
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 font-light leading-relaxed">
                    Toggle your choice of base duration and custom personal training add-ons. Custom features will recalculate quote instantly.
                  </p>
                </div>

                {/* Base Duration Select */}
                <div className="space-y-3">
                  <label className="block text-xs font-mono font-bold uppercase text-zinc-400">
                    Step 1: Choose Billing Span Cycle
                  </label>
                  <div className="grid grid-cols-3 gap-2 bg-black p-1.5 rounded border border-white/10">
                    <button
                      onClick={() => setDuration('monthly')}
                      className={`py-2 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                        duration === 'monthly' ? 'bg-yellow-400 text-black font-extrabold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      1 Month
                    </button>
                    <button
                      onClick={() => setDuration('quarterly')}
                      className={`py-2 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                        duration === 'quarterly' ? 'bg-yellow-400 text-black font-extrabold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      3 Months
                    </button>
                    <button
                      onClick={() => setDuration('annual')}
                      className={`py-2 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                        duration === 'annual' ? 'bg-yellow-400 text-black font-extrabold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      1 Year
                    </button>
                  </div>
                </div>

                {/* Optional Power Add Ons */}
                <div className="space-y-3">
                  <label className="block text-xs font-mono font-bold uppercase text-zinc-400">
                    Step 2: Core Perks Add-Ons
                  </label>

                  <div className="space-y-2">
                    {/* Addon 1: Personal Trainer */}
                    <label
                      className={`p-4 rounded border flex items-center justify-between cursor-pointer transition-all ${
                        hasPersonalTrainer
                          ? 'bg-yellow-400/5 border-yellow-400/40 text-white'
                          : 'bg-black border-white/10 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={hasPersonalTrainer}
                          onChange={(e) => setHasPersonalTrainer(e.target.checked)}
                          className="accent-yellow-400 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="text-sm font-semibold text-white">Personal Trainer Squad Assistance</p>
                          <p className="not-italic text-[11px] text-zinc-500 font-light mt-0.5">
                            Daily 1x dedicated tracking, form safety, and intense motivating support on general floor.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-yellow-400">
                        {duration === 'monthly' ? '+₹2.5k' : duration === 'quarterly' ? '+₹6k' : '+₹20k'}
                      </span>
                    </label>

                    {/* Addon 2: Nutrition Chart */}
                    <label
                      className={`p-4 rounded border flex items-center justify-between cursor-pointer transition-all ${
                        hasNutrition
                          ? 'bg-yellow-400/5 border-yellow-400/40 text-white'
                          : 'bg-black border-white/10 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={hasNutrition}
                          onChange={(e) => setHasNutrition(e.target.checked)}
                          className="accent-yellow-400 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="text-sm font-semibold text-white">Custom Nutrition Diet Layout</p>
                          <p className="not-italic text-[11px] text-zinc-500 font-light mt-0.5">
                            Tailored macros & calorie structure reviewed bi-weekly on your phone dashboard.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-yellow-400">
                        {duration === 'monthly' ? '+₹1k' : duration === 'quarterly' ? '+₹2.5k' : '+₹8k'}
                      </span>
                    </label>

                    {/* Addon 3: Locker Access */}
                    <label
                      className={`p-4 rounded border flex items-center justify-between cursor-pointer transition-all ${
                        hasLocker
                          ? 'bg-yellow-400/5 border-yellow-400/40 text-white'
                          : 'bg-black border-white/10 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={hasLocker}
                          onChange={(e) => setHasLocker(e.target.checked)}
                          className="accent-yellow-400 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="text-sm font-semibold text-white">Private Locker & Beverage Bar</p>
                          <p className="not-italic text-[11px] text-zinc-500 font-light mt-0.5">
                            Dedicated secure cabin for belongings + pre-workout supplement discounts daily.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-yellow-400">
                        {duration === 'monthly' ? '+₹400' : duration === 'quarterly' ? '+₹1k' : '+₹3k'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Bill / Invoice View Column */}
              <div className="md:col-span-5 bg-black/40 p-6 md:p-8 rounded border border-white/10 flex flex-col justify-between backdrop-blur-md">
                <div>
                  <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest pb-3 border-b border-zinc-900">
                    RECEIPT SUMMARY
                  </h4>

                  <ul className="space-y-3 mt-4">
                    <li className="flex justify-between items-center text-xs text-zinc-400">
                      <span>Base Plan ({duration})</span>
                      <span className="font-mono text-zinc-200">
                        ₹{duration === 'monthly' ? '1,499' : duration === 'quarterly' ? '3,799' : '11,999'}
                      </span>
                    </li>

                    {hasPersonalTrainer && (
                      <li className="flex justify-between items-center text-xs text-zinc-400">
                        <span>Personal Coach support</span>
                        <span className="font-mono text-zinc-200">
                          +₹{duration === 'monthly' ? '2,500' : duration === 'quarterly' ? '6,000' : '20,000'}
                        </span>
                      </li>
                    )}

                    {hasNutrition && (
                      <li className="flex justify-between items-center text-xs text-zinc-400">
                        <span>Nutrition Planner</span>
                        <span className="font-mono text-zinc-200">
                          +₹{duration === 'monthly' ? '1,000' : duration === 'quarterly' ? '2,500' : '8,000'}
                        </span>
                      </li>
                    )}

                    {hasLocker && (
                      <li className="flex justify-between items-center text-xs text-zinc-400">
                        <span>Secure Premium Cabin</span>
                        <span className="font-mono text-zinc-200">
                          +₹{duration === 'monthly' ? '400' : duration === 'quarterly' ? '1,000' : '3,000'}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="pt-6 border-t border-white/10 mt-6 text-left">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-mono font-semibold text-zinc-400">Total Price</span>
                    <span className="text-3xl md:text-4xl font-display font-black text-white">
                      ₹{quoteDetails.total.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <p className="text-[10px] text-zinc-500 mt-2 font-light">
                    * All prices exclude taxes, subject to 1-on-1 verification desk. Fast enrollment guarantee.
                  </p>

                  <button
                    onClick={() => onPlanSelect(quoteDetails.description)}
                    className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-display font-bold rounded text-xs tracking-widest uppercase shadow-xl shadow-yellow-400/20 mt-6 cursor-pointer"
                  >
                    Select & Claim Trial
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </section>
  );
}

# HelioxASX ⚡💪

> Connect your vibe, sync your training, log your progress.
>
> 🌐 **Live URL:** [https://helioxasx.netlify.app/](https://helioxasx.netlify.app/)

**HelioxASX** is a premium, beautifully curated full-stack fitness and gym application designed for **Heliox Fitness Kamla Nagar & Agra regions**. Powered by **React 18, Vite, Tailwind CSS, Lucide Icons, and Supabase**, it represents the absolute peak of modern "vibe coding"—blending gorgeous negative space, micro-animations, high-contrast dark visual tones, and a real-time cloud-backed system.

---

## 🌟 The Core Idea

HelioxASX brings the physical powerhouse of raw iron, heavy Olympic lifting, and vibrant aerobics communities into a unified, high-performance digital ecosystem. Members have instant access to:
- **Cloud-Synced Member Hub:** Seamless email/password authentication via Supabase Auth.
- **Dynamic Program Pricing:** Dynamically fetched pricing plans and membership tiers directly from the database, complete with instant dashboard badge subscription activations for active sessions.
- **Timetable & Dynamic Schedules:** Interactive day-by-day filter cards that load live fitness class rosters and dedicated trainers.
- **Dynamic Health Metrics:** Built-in BMI and physical weight tracking tool synced with the logged-in profile table.
- **Dual-State Offline Fallback Engine:** A custom-constructed system that keeps local guests completely protected by storing reservation booking requests in `localStorage` cached memory if the connection is pending, then syncing to Supabase Cloud on auth.

---

## 🛠️ Supabase System Architecture

The database is built on top of high-speed relational postgres and Supabase Row Level Security (RLS) to protect individual data streams.

### Schema Blueprint Overview:
- `auth.users` &rarr; Handled securely by Supabase.
- `profiles` &rarr; Automatically generated whenever a new user registers on Auth via a database trigger function.
- `membership_plans` &rarr; Provides immediate pricing flexibility (Trial, Monthly, Quarterly, and Annual).
- `trainers` &rarr; Holds trainer rosters, specialties (HIIT, Yoga, Strength Conditioning), and imagery.
- `classes` &rarr; Maps available slots (HIIT, CrossFit core, dance fitness) with their scheduled times.
- `user_subscriptions` &rarr; Manages the purchase state and renewal timestamps of user-selected plans.
- `bookings` &rarr; Powers simple trial reservation passes or scheduled training check-ins.
- `user_progress` &rarr; Logs logs of weight history alongside real-time calculations of BMI zones.

---

## ⚙️ Quick Configuration & Credentials

The connection is configured to communicate with the following live parameters:

- **Project ID:** `ptozmgsrimjoxnpolovy`
- **Supabase Project URL:** `https://ptozmgsrimjoxnpolovy.supabase.co`
- **Supabase Publishable Key:** `sb_publishable_LTr69Z6TLonGf-IyKGOgzw_OlAjjLny`
- **Frontend Live Build:** [https://helioxasx.netlify.app/](https://helioxasx.netlify.app/) (Netlify) / [Alternative Live Build](https://heliox-fitness-gym-270482238240.asia-southeast1.run.app)

### 1️⃣ Setting up Environment File
Create a `.env` in the root of your project:
```env
VITE_SUPABASE_URL="https://ptozmgsrimjoxnpolovy.supabase.co"
VITE_SUPABASE_ANON_KEY="sb_publishable_LTr69Z6TLonGf-IyKGOgzw_OlAjjLny"
```

### 2️⃣ Paste Database Schema & Seed Data
To initialize all relational structures and trigger processes, paste the complete SQL script found in `/supabase-schema.sql` directly into your **Supabase SQL Editor** and click **Run**. This takes care of table creations, enabling Row Level Security (RLS) policies, hooks, and seeds of all classes, trainers, and prices.

---

## 🚀 Tech Stack & Core Libraries

- **Frontend:** React 18 / TypeScript
- **State Management:** Fully dynamic React Context + LocalStorage Cache fallback
- **Animations:** `motion/react` for buttery-smooth layout transitions and slide-in drawers
- **Icons:** Elegant minimal iconography using `lucide-react`
- **Styling:** Rapid fluid layouts using Tailwind CSS utilities styled inside the custom Inter & JetBrains Mono typography configurations
- **DB Client:** `@supabase/supabase-js`

---

## 🧠 Vibe Coding Philosophy

HelioxASX is engineered to represent aesthetic harmony:
- **No Unsolicited Clutter:** Designed around deep charcoal blacks (`#0D0D0E`), golden yellows (`#FACC15`), and elegant contrast panels. No tech-larping logs, ports, or telemetry lines. Only crisp interfaces.
- **Aesthetic Typography Touch:** Elegant "Inter" sans-serif layout titles paired with beautiful monospace "JetBrains Mono" status elements.
- **Frictionless UI/UX:** The Member Hub panel gracefully moves between standard Guest Passes (Offline cache) and full Cloud synchronizations instantly.

*Train heavy, log often. HelioxASX is ready for you.* ⚡

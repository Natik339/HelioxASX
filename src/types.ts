export interface TrainingClass {
  id: string;
  name: string;
  trainer: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
  time: string; // e.g. "07:00 AM - 08:00 AM"
  category: string; // "hiit" | "crossfit" | "zumba" | "yoga" | "weights" | "cycling"
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  specialty: string[];
  image: string;
  rating: number;
  quote: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string | 'Local Guide' | 'Member';
  stars: number;
  date: string;
  text: string;
  verified: boolean;
  likes?: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  benefits: string[];
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular: boolean;
  accentColor: string; // tailwind class
}

export interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'pending' | 'confirmed';
  createdAt: string;
}

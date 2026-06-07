import { Service, Trainer, Testimonial, PricingPlan, TrainingClass } from './types';

export const GYM_DETAILS = {
  name: "Heliox Fitness Gym",
  address: "C-2, Professors Colony, Ghatwasan, Kamla Nagar, Agra, Uttar Pradesh 282005",
  phone: "095577 26555",
  hours: "6:00 AM - 10:30 PM (Monday to Saturday)",
  closed: "Closed on Sundays",
  rating: 4.7,
  reviewsCount: 279,
  socials: {
    instagram: "https://www.instagram.com/helioxfitness?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    facebook: "https://www.instagram.com/helioxfitness?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    youtube: "https://www.instagram.com/helioxfitness?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
  }
};

export const SERVICES: Service[] = [
  {
    id: "weight-training",
    name: "Weight Training",
    description: "Sculpt and build muscle with our top-of-the-line pin-loaded machines, hammers, and massive free weights zone. Zero waiting time.",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
    benefits: ["Hypertrophy & Strength", "Clean & Well-Maintained Equipment", "Spacious Layout"]
  },
  {
    id: "crossfit",
    name: "CrossFit",
    description: "High-intensity functional training featuring Olympic lifts, plyometrics, kettlebell swings, and high-energy athletic movements.",
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop",
    benefits: ["Functional Power", "Community Support", "Stamina & Agility"]
  },
  {
    id: "hiit",
    name: "HIIT exercise classes",
    description: "Engineered body-weight & interval training designed to spike your heart rate, burn calories, and supercharge metabolism post-workout.",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=600&auto=format&fit=crop",
    benefits: ["Supercharged Metabolism", "Fat Burning In minutes", "Cardio Conditioning"]
  },
  {
    id: "yoga",
    name: "Yoga Classes",
    description: "Align your mind, body, and breath. Gain premium flexibility, balance, and post-workout composure with our master yogi guides.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
    benefits: ["Flexibility & Mind", "Better Core Stability", "Stress Relief"]
  },
  {
    id: "zumba",
    name: "Zumba & Dance Fitness",
    description: "High octane fusion of dance routines, rhythmic movements, and interval style cardio. Torch calories while of absolute positive vibes.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
    benefits: ["Atmosphere of FUN", "Full Body Cardio", "Rhythm & Coordination"]
  },
  {
    id: "personal-training",
    name: "Personal Training",
    description: "Surgical workout plans tailored precisely for you. Get 1-on-1 focus, form corrections, and nutrition guidance directly on the floor.",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop",
    benefits: ["Detailed Workout Plans", "Form Correction Safety", "Dedicated Accountability"]
  },
  {
    id: "cycling",
    name: "Cycling Class",
    description: "A fast paced ride through hills and sprints simulation. Led by an motivating instructor with loud pumping tracks.",
    image: "https://images.unsplash.com/photo-1534438097545-a2c22c57f2ad?q=80&w=600&auto=format&fit=crop",
    benefits: ["Cardiovascular Endurance", "Lower Body Toning", "Rhythm Driven Cadence"]
  },
  {
    id: "aerobics",
    name: "Aerobics",
    description: "Rhythmic step exercises coordinated with high energetic music to stretch, breathe, and elevate coordination effortlessly.",
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=600&auto=format&fit=crop",
    benefits: ["Pumping Heart Health", "Easy For Beginners", "Joint Mobility & Flow"]
  }
];

export const TRAINERS: Trainer[] = [
  {
    id: "nikhil",
    name: "Nikhil",
    role: "Head CrossFit & Strength Coach",
    specialty: ["Olympic Lifting", "CrossFit Levels I & II", "Strength Conditioning"],
    image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=300&auto=format&fit=crop",
    rating: 5,
    quote: "No shortcuts. Just high-quality equipment, structured work, and your willingness to start."
  },
  {
    id: "priya",
    name: "Priya Sen",
    role: "Zumba & Yoga Master",
    specialty: ["Asana Flows", "Zumba Certified Pro", "Dance Fitness & HIIT"],
    image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=300&auto=format&fit=crop",
    rating: 4.9,
    quote: "Fitness isn't just a physical test. It's an expression of energy, joy, and positive movement."
  },
  {
    id: "rohit",
    name: "Rohit Yadav",
    role: "HIIT & General Trainer",
    specialty: ["Fat Loss", "Bodyweight Conditioning", "High Intensity Intervals"],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=300&auto=format&fit=crop",
    rating: 4.8,
    quote: "A motivated environment is half the battle won. I'm here to ensure you train safely and effectively."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "rev-renu",
    name: "Renu Tiwari",
    role: "Local Guide",
    stars: 5,
    date: "5 years ago",
    text: "The gym is extremely spacious and there are lot of good variety of equipments, so waiting time is almost zero. Neat and Clean washroom and changing room available for everyone.",
    verified: true,
    likes: 6
  },
  {
    id: "rev-infinity",
    name: "INFINITY Plus 1",
    role: "Member",
    stars: 5,
    date: "8 months ago",
    text: "I have been there from last 4 months, so overall it's a great experience with environment, equipments, and yes trainers as well especially Nikhil....",
    verified: true,
    likes: 1
  },
  {
    id: "rev-raj",
    name: "Raj Kumar",
    role: "Member",
    stars: 5,
    date: "6 months ago",
    text: "Giving 1 star only because this gym has got me hooked! I actually look forward to coming every day! It is the best place to train.",
    verified: true,
    likes: 1
  },
  {
    id: "rev-yashraj",
    name: "Yashraj Sharma",
    role: "Member",
    stars: 5,
    date: "8 months ago",
    text: "Great gym with clean equipment, friendly trainers, and a motivating atmosphere. Perfect for both beginners and regulars!",
    verified: true,
    likes: 2
  },
  {
    id: "rev-parth",
    name: "Parth Thapar",
    role: "Member",
    stars: 5,
    date: "4 years ago",
    text: "One of the best I've come across in Agra! Have varieties of machines to train with plus it's spacious! And General Trainers are friendly and helpful!",
    verified: true,
    likes: 6
  },
  {
    id: "rev-dimpi",
    name: "Dimpi Garg",
    role: "Member",
    stars: 5,
    date: "7 months ago",
    text: "A very great gym in all the aspects! Encouraging and motivating staff with all the essential facilities present. 🤌🏼👌🏼⭐️",
    verified: true
  },
  {
    id: "rev-gaurav",
    name: "Gaurav Gupta",
    role: "Member",
    stars: 5,
    date: "11 months ago",
    text: "Best gym in Kamla nagar agra. Best trainer and top quality equipment",
    verified: true,
    likes: 2
  },
  {
    id: "rev-ankush",
    name: "Ankush Gupta",
    role: "Member",
    stars: 5,
    date: "a year ago",
    text: "Gym ambiance are so good, and good lighting, also gym equipments is well maintained, and the trainers are good.",
    verified: true,
    likes: 4
  },
  {
    id: "rev-scalpel",
    name: "Scalpeltravel",
    role: "Member",
    stars: 5,
    date: "5 years ago",
    text: "I joined heliox during my last visit in India. It was newly open at that time. I have been to various gyms in Europe but this was my first gym experience in India and I was surprised to see the fantastic range of equipment and professional trainers.",
    verified: true
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "trial",
    name: "Discovery Trial",
    price: "0",
    period: "1 Day",
    features: [
      "Access to all standard machine zones",
      "1x Consultation with General Trainer",
      "Neat & Clean changing room access",
      "Full locker access included",
      "No sign-up fee required"
    ],
    popular: false,
    accentColor: "border-zinc-800 hover:border-zinc-700 font-mono"
  },
  {
    id: "monthly",
    name: "Standard Monthly",
    price: "1,499",
    period: "Month",
    features: [
      "Unlimited Gym floor access",
      "All Cardio, Weight, and CrossFit zones",
      "Access to standard group classes",
      "General trainer assistance always",
      "Zero waiting time on top equipment",
      "Neat washrooms & shower access"
    ],
    popular: true,
    accentColor: "border-yellow-400 ring-2 ring-yellow-400/10 shadow-yellow-950/20 shadow-xl"
  },
  {
    id: "quarterly",
    name: "Elite Quarterly",
    price: "3,799",
    period: "3 Months",
    features: [
      "Everything in standard tier plus:",
      "Personal goals review checklist",
      "2x Yoga/Zumba speciality classes",
      "Complimentary BMI analysis & trackers",
      "Saves ~15% over monthly setup",
      "Discounts on premium gym merch"
    ],
    popular: false,
    accentColor: "border-zinc-800 hover:border-yellow-400/50"
  },
  {
    id: "annual",
    name: "Ultimate Annual",
    price: "11,999",
    period: "Year",
    features: [
      "Full premium access for 365 days",
      "Unlimited CrossFit, Yoga, and Zumba",
      "5x Free dedicated Personal Trainer sessions",
      "Free locker reservations",
      "Customized nutritional diet structure",
      "Flexible pause-membership option"
    ],
    popular: false,
    accentColor: "border-zinc-800 hover:border-yellow-400/50"
  }
];

export const TIMETABLE_CLASSES: TrainingClass[] = [
  { id: "t1", name: "HIIT exercise classes", trainer: "Rohit Yadav", day: "Mon", time: "06:30 AM - 07:30 AM", category: "hiit" },
  { id: "t2", name: "Crossfit Core", trainer: "Nikhil", day: "Mon", time: "08:00 AM - 09:00 AM", category: "crossfit" },
  { id: "t3", name: "Weight Training guide", trainer: "Rohit Yadav", day: "Mon", time: "05:00 PM - 06:15 PM", category: "weights" },
  { id: "t4", name: "Zumba Energy", trainer: "Priya Sen", day: "Mon", time: "07:00 PM - 08:00 PM", category: "zumba" },

  { id: "t5", name: "Yoga mind & stretch", trainer: "Priya Sen", day: "Tue", time: "07:00 AM - 08:00 AM", category: "yoga" },
  { id: "t6", name: "Cycling sprints", trainer: "Rohit Yadav", day: "Tue", time: "08:30 AM - 09:30 AM", category: "cycling" },
  { id: "t7", name: "Dance fitness classes", trainer: "Priya Sen", day: "Tue", time: "05:30 PM - 06:30 PM", category: "zumba" },
  { id: "t8", name: "Crossfit Pro", trainer: "Nikhil", day: "Tue", time: "07:15 PM - 08:30 PM", category: "crossfit" },

  { id: "t9", name: "HIIT Cardio burn", trainer: "Rohit Yadav", day: "Wed", time: "06:30 AM - 07:30 AM", category: "hiit" },
  { id: "t10", name: "Aerobics Step-UP", trainer: "Priya Sen", day: "Wed", time: "08:00 AM - 09:00 AM", category: "hiit" },
  { id: "t11", name: "Weight Training hypertrophy", trainer: "Nikhil", day: "Wed", time: "05:30 PM - 06:45 PM", category: "weights" },
  { id: "t12", name: "Zumba Party", trainer: "Priya Sen", day: "Wed", time: "07:00 PM - 08:00 PM", category: "zumba" },

  { id: "t13", name: "Yoga Balance Flow", trainer: "Priya Sen", day: "Thu", time: "07:00 AM - 08:00 AM", category: "yoga" },
  { id: "t14", name: "Cycling stamina", trainer: "Rohit Yadav", day: "Thu", time: "08:30 AM - 09:30 AM", category: "cycling" },
  { id: "t15", name: "HIIT Core Blast", trainer: "Rohit Yadav", day: "Thu", time: "05:30 PM - 06:30 PM", category: "hiit" },
  { id: "t16", name: "Crossfit Endurance", trainer: "Nikhil", day: "Thu", time: "07:15 PM - 08:15 PM", category: "crossfit" },

  { id: "t17", name: "HIIT & Power", trainer: "Rohit Yadav", day: "Fri", time: "06:30 AM - 07:30 AM", category: "hiit" },
  { id: "t18", name: "Aerobics Rhythm", trainer: "Priya Sen", day: "Fri", time: "08:00 AM - 09:00 AM", category: "zumba" },
  { id: "t19", name: "Weight Training heavy", trainer: "Nikhil", day: "Fri", time: "05:30 PM - 06:45 PM", category: "weights" },
  { id: "t20", name: "Dance fitness classes", trainer: "Priya Sen", day: "Fri", time: "07:00 PM - 08:00 PM", category: "zumba" },

  { id: "t21", name: "Yoga Masterclass", trainer: "Priya Sen", day: "Sat", time: "07:30 AM - 09:00 AM", category: "yoga" },
  { id: "t22", name: "Power Cycling", trainer: "Rohit Yadav", day: "Sat", time: "10:00 AM - 11:00 AM", category: "cycling" },
  { id: "t23", name: "Crossfit Weekend WOD", trainer: "Nikhil", day: "Sat", time: "05:00 PM - 06:15 PM", category: "crossfit" },
  { id: "t24", name: "Zumba Weekend Dance", trainer: "Priya Sen", day: "Sat", time: "06:30 PM - 07:30 PM", category: "zumba" }
];

export const GALLERY_PHOTOS = [
  {
    url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=400&auto=format&fit=crop",
    title: "Premium Machine Zone"
  },
  {
    url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop",
    title: "Heavy Dumbbells & Dumbbell Press"
  },
  {
    url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop",
    title: "High-Energy Cardio Rows"
  },
  {
    url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=400&auto=format&fit=crop",
    title: "CrossFit Squat Racks"
  },
  {
    url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop",
    title: "Dance Fitness Studio"
  },
  {
    url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop",
    title: "Peaceful Yoga Studio"
  }
];

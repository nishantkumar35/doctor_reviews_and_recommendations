import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Clock } from 'lucide-react';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const STATS = [
  { icon: Activity, title: 'AI Match', desc: 'Predicts specialty with 95% accuracy' },
  { icon: ShieldCheck, title: 'Verified Profiles', desc: 'All doctors are background checked' },
  { icon: Clock, title: 'Quick Booking', desc: 'Book appointments in under 60 seconds' }
];

const Features = () => {
  return (
    <motion.div 
      variants={itemVariants}
      className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3"
    >
      {STATS.map((stat, i) => (
        <div key={i} className="glass p-6 rounded-2xl text-left hover:border-primary/50 transition-colors group">
          <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <stat.icon size={24} />
          </div>
          <h3 className="text-white font-semibold mb-1">{stat.title}</h3>
          <p className="text-sm text-slate-500">{stat.desc}</p>
        </div>
      ))}
    </motion.div>
  );
};

export default Features;

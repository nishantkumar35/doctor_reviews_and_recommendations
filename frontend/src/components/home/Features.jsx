import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Clock } from 'lucide-react';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const STATS = [
  { icon: Activity,    title: 'AI Match',          desc: 'Predicts specialty with 95% accuracy' },
  { icon: ShieldCheck, title: 'Verified profiles',  desc: 'All doctors are background checked' },
  { icon: Clock,       title: 'Quick booking',      desc: 'Book appointments in under 60 seconds' },
];

const Features = () => {
  return (
    <motion.div
      variants={itemVariants}
      className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3"
    >
      {STATS.map((stat, i) => (
        <div
          key={i}
          className="
            group bg-white border border-blue-100 rounded-2xl p-6 text-left
            hover:border-blue-300 hover:shadow-[0_4px_16px_rgba(59,130,246,0.08)]
            transition-all duration-200
          "
        >
          <div className="
            h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4
            group-hover:bg-blue-100 transition-colors duration-200
          ">
            <stat.icon size={22} className="text-blue-600" strokeWidth={2} />
          </div>

          <h3 className="text-sm font-semibold text-slate-900 mb-1">
            {stat.title}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            {stat.desc}
          </p>
        </div>
      ))}
    </motion.div>
  );
};

export default Features;
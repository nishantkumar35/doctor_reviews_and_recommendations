import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Award } from 'lucide-react';

const DoctorInfo = ({ doctor }) => {
  if (!doctor) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center md:items-start"
    >
      <div className="relative">
        <img
          src={
            doctor.userId?.image ||
            `https://ui-avatars.com/api/?name=${doctor.userId?.name}`
          }
          alt={doctor.userId?.name}
          className="w-48 h-48 rounded-[2rem] object-cover border-4 border-white/5"
        />
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary px-4 py-1.5 rounded-full text-white text-sm font-bold shadow-lg flex items-center gap-2 whitespace-nowrap">
          <Star size={16} className="fill-white" />
          {doctor.averageRating || 0} ({doctor.reviewCount || 0} Reviews)
        </div>
      </div>

      <div className="flex-1 text-center md:text-left pt-2">
        <h1 className="text-4xl font-bold text-white mb-2">
          {doctor.userId?.name}
        </h1>
        <p className="text-primary font-medium text-lg mb-4">
          {doctor.specialization}
        </p>

        <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
          <span className="flex items-center gap-2 text-slate-400 text-sm bg-white/5 px-4 py-2 rounded-xl border border-white/5">
            <Award size={18} className="text-primary" />
            {doctor.experience} Yrs Experience
          </span>
          <span className="flex items-center gap-2 text-slate-400 text-sm bg-white/5 px-4 py-2 rounded-xl border border-white/5">
            <MapPin size={18} className="text-primary" />
            {doctor.clinicAddress}
          </span>
        </div>

        <p className="text-slate-400 leading-relaxed italic border-l-4 border-primary/20 pl-4 py-2">
          "
          {doctor.summary ||
            "A dedicated medical professional committed to providing the best care for patients."}
          "
        </p>
      </div>
    </motion.div>
  );
};

export default DoctorInfo;

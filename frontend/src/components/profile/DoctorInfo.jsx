import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Award } from 'lucide-react';

const DoctorInfo = ({ doctor }) => {
  if (!doctor) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white border border-blue-100 rounded-2xl p-7 flex flex-col md:flex-row gap-8 items-center md:items-start"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={
            doctor.userId?.image ||
            `https://ui-avatars.com/api/?name=${doctor.userId?.name}&background=dbeafe&color=1d4ed8&bold=true`
          }
          alt={doctor.userId?.name}
          className="w-36 h-36 rounded-2xl object-cover border-2 border-blue-50"
        />
        <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 whitespace-nowrap shadow-md shadow-blue-200">
          <Star size={11} className="fill-white stroke-none" />
          {doctor.averageRating || 0} ({doctor.reviewCount || 0} reviews)
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 text-center md:text-left pt-3">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          {doctor.userId?.name}
        </h1>
        <p className="text-blue-600 font-semibold text-sm mb-4">
          {doctor.specialization}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-5">
          <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <Award size={13} className="text-blue-500" strokeWidth={2} />
            {doctor.experience} yrs experience
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <MapPin size={13} className="text-blue-500" strokeWidth={2} />
            {doctor.clinicAddress}
          </span>
        </div>

        {/* Summary quote */}
        <p className="text-sm text-slate-500 leading-relaxed italic border-l-2 border-blue-200 pl-4">
          "{doctor.summary || 'A dedicated medical professional committed to providing the best care for patients.'}"
        </p>
      </div>
    </motion.div>
  );
};

export default DoctorInfo;
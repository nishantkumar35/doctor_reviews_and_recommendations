import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Star, ChevronRight } from 'lucide-react';

const SimilarDoctors = ({ similarDoctors }) => {
  if (!similarDoctors || similarDoctors.length === 0) return null;

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center gap-2 px-1 mb-4">
        <Users size={15} className="text-blue-500" strokeWidth={2} />
        <h3 className="text-sm font-bold text-slate-900">Similar doctors</h3>
      </div>

      <div className="space-y-2">
        {similarDoctors.map((simDoc, idx) => (
          <Link key={simDoc._id} to={`/doctor/${simDoc._id}`}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="
                group flex items-center gap-3
                bg-white border border-blue-100 rounded-2xl p-3
                hover:border-blue-300 hover:shadow-[0_2px_12px_rgba(59,130,246,0.08)]
                transition-all duration-150
              "
            >
              <img
                src={
                  simDoc.userId?.image ||
                  `https://ui-avatars.com/api/?name=${simDoc.userId?.name}&background=dbeafe&color=1d4ed8&bold=true`
                }
                alt={simDoc.userId?.name}
                className="h-11 w-11 rounded-xl object-cover border border-blue-50 flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                  {simDoc.userId?.name}
                </p>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {simDoc.specialization}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  <span className="text-[10px] font-semibold text-slate-400">
                    {simDoc.averageRating || 0} ({simDoc.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>

              <ChevronRight
                size={15}
                className="text-slate-300 group-hover:text-blue-400 transition-colors flex-shrink-0"
              />
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarDoctors;
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Star, ArrowRight } from 'lucide-react';

const SimilarDoctors = ({ similarDoctors }) => {
  if (!similarDoctors || similarDoctors.length === 0) return null;

  return (
    <div className="space-y-6 pt-4 mt-15">
      <h3 className="text-xl font-bold text-white flex items-center gap-3 px-2">
        <User size={20} className="text-primary" />
        Similar Doctors
      </h3>
      <div className="space-y-4">
        {similarDoctors.map((simDoc, idx) => (
          <Link key={simDoc._id} to={`/doctor/${simDoc._id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass my-3 group rounded-2xl overflow-hidden hover:border-primary/50 transition-all p-4 border border-white/5"
            >
              <div className="flex gap-4">
                <img
                  src={
                    simDoc.userId?.image ||
                    `https://ui-avatars.com/api/?name=${simDoc.userId?.name}`
                  }
                  alt={simDoc.userId?.name}
                  className="h-12 w-12 rounded-xl object-cover border border-white/10"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate">
                    {simDoc.userId?.name}
                  </h4>
                  <p className="text-slate-400 text-xs truncate">
                    {simDoc.specialization}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star
                      className="text-yellow-500 fill-yellow-500"
                      size={12}
                    />
                    <span className="text-[10px] font-medium text-slate-300">
                      {simDoc.averageRating || 0} ({simDoc.reviewCount || 0})
                    </span>
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="text-slate-600 group-hover:text-primary transition-colors self-center"
                />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarDoctors;

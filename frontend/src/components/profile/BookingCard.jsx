import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import Button from '../ui/Button';

const BookingCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-blue-100 rounded-2xl p-7 sticky top-28"
    >
      <h3 className="text-base font-bold text-slate-900 mb-5">
        Consultation
      </h3>

      {/* Info rows */}
      <div className="divide-y divide-slate-100">
        <div className="flex justify-between items-center py-3.5">
          <span className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar size={15} className="text-blue-500" strokeWidth={2} />
            Availability
          </span>
          <span className="text-sm font-semibold text-slate-900">Mon – Sat</span>
        </div>
        <div className="flex justify-between items-center py-3.5">
          <span className="flex items-center gap-2 text-sm text-slate-500">
            <Clock size={15} className="text-blue-500" strokeWidth={2} />
            Hours
          </span>
          <span className="text-sm font-semibold text-slate-900">10:00 – 18:00</span>
        </div>
      </div>

      <div className="mt-6 space-y-2.5">
        <Button className="w-full py-3 rounded-xl">
          Book appointment
        </Button>
        <Button
          variant="outline"
          className="w-full py-3 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          Send message
        </Button>
      </div>

      <p className="text-center text-[11px] text-slate-400 mt-5 leading-relaxed px-2">
        Consultation fees may vary based on specialist and treatment.
      </p>
    </motion.div>
  );
};

export default BookingCard;
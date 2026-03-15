import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import Button from '../ui/Button';

const BookingCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-8 rounded-[2rem] sticky top-28"
    >
      <h3 className="text-xl font-bold text-white mb-6">Consultation</h3>

      <div className="space-y-6 mb-8">
        <div className="flex justify-between items-center text-slate-400">
          <span className="flex items-center gap-2">
            <Calendar size={18} className="text-primary" /> Availability
          </span>
          <span className="text-white font-medium">Mon - Sat</span>
        </div>
        <div className="flex justify-between items-center text-slate-400">
          <span className="flex items-center gap-2">
            <Clock size={18} className="text-primary" /> Hours
          </span>
          <span className="text-white font-medium">10:00 - 18:00</span>
        </div>
      </div>

      <Button className="w-full py-4 rounded-2xl mb-4 text-lg">
        Book Appointment
      </Button>
      <Button
        variant="outline"
        className="w-full py-4 rounded-2xl border-white/5"
      >
        Send Message
      </Button>

      <p className="text-center text-[10px] text-slate-600 mt-6 px-4">
        * Consultation fees may vary based on specialist and treatment.
      </p>
    </motion.div>
  );
};

export default BookingCard;

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const Hero = ({ problem, setProblem, handleSearch }) => {
  return (
    <>
      {/* Badge */}
      <motion.div
        variants={itemVariants}
        className="mb-7 flex justify-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-medium">
          <Sparkles size={13} className="text-blue-500" />
          AI-powered healthcare prediction is here
        </div>
      </motion.div>

      {/* Heading */}
      <motion.h1
        variants={itemVariants}
        className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12] mb-6"
      >
        Find the right doctor <br />
        <span className="text-blue-600">based on your symptoms</span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        variants={itemVariants}
        className="text-base sm:text-lg leading-relaxed text-slate-500 mb-10 max-w-xl mx-auto"
      >
        Describe your symptoms in simple words and our advanced AI will
        match you with the best-rated specialists in your area.
      </motion.p>

      {/* Search bar */}
      <motion.form
        variants={itemVariants}
        onSubmit={handleSearch}
        className="mx-auto max-w-2xl"
      >
        <div className="
          flex flex-col sm:flex-row items-stretch gap-2.5
          bg-white border border-blue-100 rounded-2xl p-2
          shadow-[0_2px_12px_rgba(59,130,246,0.08)]
          focus-within:border-blue-300 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]
          transition-all duration-200
        ">
          <div className="flex-1 flex items-center gap-3 px-3">
            <Search size={16} className="text-slate-400 flex-shrink-0" />
            <input
              type="text"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="e.g. sharp pain in my chest, frequent headaches..."
              className="
                w-full bg-transparent border-none outline-none ring-0
                text-sm text-slate-800 placeholder:text-slate-400
                py-2 h-11
              "
            />
          </div>
          <Button type="submit" size="lg" className="sm:w-auto w-full shrink-0">
            Search specialists
          </Button>
        </div>
      </motion.form>
    </>
  );
};

export default Hero;
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
      <motion.div 
        variants={itemVariants}
        className="mb-8 flex justify-center"
      >
        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-400 ring-1 ring-white/10 hover:ring-white/20 transition-all bg-white/5 backdrop-blur-md">
          <span className="flex items-center gap-2">
            <Sparkles size={14} className="text-primary" />
            AI-Powered Healthcare Prediction is here.
          </span>
        </div>
      </motion.div>

      <motion.h1 
        variants={itemVariants}
        className="text-5xl font-bold tracking-tight text-white sm:text-7xl mb-8"
      >
        Find the Right Doctor <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Based on Your Symptoms</span>
      </motion.h1>

      <motion.p 
        variants={itemVariants}
        className="text-lg leading-8 text-slate-400 mb-12 max-w-2xl mx-auto"
      >
        Describe your symptoms in simple words, and our advanced AI will match you with the best-rated specialists in your area.
      </motion.p>

      <motion.form 
        variants={itemVariants}
        onSubmit={handleSearch}
        className="mx-auto max-w-2xl"
      >
        <div className="glass p-2 rounded-2xl flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input 
              placeholder="Describe your issue e.g. 'I have a sharp pain in my chest...'" 
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              icon={Search}
              className="border-none! bg-transparent!  ring-0! h-12! w-full"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 md:w-auto w-full">
            Search Specialists
          </Button>
        </div>
      </motion.form>
    </>
  );
};

export default Hero;

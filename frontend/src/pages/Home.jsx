import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Activity, ShieldCheck, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Home = () => {
  const [problem, setProblem] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (problem.trim()) {
      navigate(`/search?q=${encodeURIComponent(problem)}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="relative isolate pt-14">
      {/* Background blobs */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#0ea5e9] to-[#6366f1] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>

      <div className="container mx-auto px-6 ">
        <motion.div 
          className="mx-auto max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
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

          {/* Stats/Features */}
          <motion.div 
            variants={itemVariants}
            className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            {[
              { icon: Activity, title: 'AI Match', desc: 'Predicts specialty with 95% accuracy' },
              { icon: ShieldCheck, title: 'Verified Profiles', desc: 'All doctors are background checked' },
              { icon: Clock, title: 'Quick Booking', desc: 'Book appointments in under 60 seconds' }
            ].map((stat, i) => (
              <div key={i} className="glass p-6 rounded-2xl text-left hover:border-primary/50 transition-colors group">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon size={24} />
                </div>
                <h3 className="text-white font-semibold mb-1">{stat.title}</h3>
                <p className="text-sm text-slate-500">{stat.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;

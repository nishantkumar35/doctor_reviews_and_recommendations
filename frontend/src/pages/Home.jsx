import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';

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
      transition: { staggerChildren: 0.15 },
    },
  };

  return (
    <div className="relative isolate min-h-screen bg-[#f8faff] pt-14 overflow-hidden">

      {/* Subtle grid background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Top center glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 -z-10 w-[520px] h-[280px] bg-[radial-gradient(ellipse,rgba(59,130,246,0.09)_0%,transparent_70%)]" />

      <div className="container mx-auto px-6">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Hero
            problem={problem}
            setProblem={setProblem}
            handleSearch={handleSearch}
          />
          <Features />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
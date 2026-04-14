import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none";

  const variants = {
    primary:   "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
    secondary: "bg-sky-500 text-white hover:bg-sky-600 active:bg-sky-700",
    outline:   "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 hover:border-blue-300",
    ghost:     "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
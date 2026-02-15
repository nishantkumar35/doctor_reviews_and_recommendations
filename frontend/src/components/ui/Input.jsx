import React from "react";

const Input = ({ label, icon: Icon, error, ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm font-medium text-slate-400">{label}</label>
      )}
      <div className="flex items-center gap-2 px-3 h-11 rounded-xl bg-white/5 border border-white/10 focus-within:border-primary transition">
        {Icon && <Icon className="text-slate-500" size={18} />}

        <input
          className="bg-transparent border-none w-full h-full
             text-slate-50 placeholder:text-slate-600
             outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none"
          {...props}
        />
      </div>

      {error && <span className="text-xs text-accent">{error}</span>}
    </div>
  );
};

export default Input;

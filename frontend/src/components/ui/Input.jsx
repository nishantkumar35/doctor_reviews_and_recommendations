import React from "react";

const Input = ({ label, icon: Icon, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-slate-600">{label}</label>
      )}

      <div className={`
        flex items-center gap-2.5 h-11 px-3.5
        bg-white border rounded-[10px]
        transition-all duration-150
        ${error
          ? 'border-red-300 focus-within:border-red-400 focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]'
          : 'border-slate-200 focus-within:border-blue-300 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
        }
        ${className}
      `}>
        {Icon && (
          <Icon size={15} className="text-slate-400 flex-shrink-0" strokeWidth={2} />
        )}
        <input
          className="
            flex-1 h-full bg-transparent border-none outline-none ring-0
            text-sm text-slate-900 placeholder:text-slate-300
            focus:ring-0 focus:ring-offset-0 focus:shadow-none
          "
          {...props}
        />
      </div>

      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};

export default Input;
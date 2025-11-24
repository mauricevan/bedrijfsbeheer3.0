import React from 'react';

interface LandingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white-outline' | 'metallic';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const LandingButton: React.FC<LandingButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95";
  
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg focus:ring-primary-500 border border-transparent",
    secondary: "bg-slate-900 text-white hover:bg-slate-800 shadow-md focus:ring-slate-500 border border-transparent",
    outline: "bg-transparent text-primary-600 border-2 border-primary-600 hover:bg-primary-50",
    'white-outline': "bg-transparent text-white border-2 border-white/30 hover:bg-white hover:text-primary-600 backdrop-blur-sm hover:border-white",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    metallic: "bg-gradient-to-b from-slate-100 to-slate-200 text-slate-900 border border-slate-300 hover:bg-white shadow-sm hover:shadow-md",
  };

  const sizes = {
    sm: "px-5 py-2 text-sm",
    md: "px-7 py-3 text-base",
    lg: "px-9 py-4 text-lg",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};


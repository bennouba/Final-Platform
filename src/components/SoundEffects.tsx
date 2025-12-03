import React from 'react';
import { useSoundEffects } from '@/hooks/useSoundEffects';

// تم نقل useSoundEffects إلى hooks/useSoundEffects لاستيفاء قاعدة react-refresh/only-export-components

// مكون الأزرار مع المؤثرات الصوتية
export const SoundButton = ({ 
  children, 
  onClick, 
  className = "",
  variant = "default",
  ...props 
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "outline";
  [key: string]: any;
}) => {
  const { playClickSound, playHoverSound } = useSoundEffects();

  const handleClick = () => {
    playClickSound();
    onClick?.();
  };

  const handleMouseEnter = () => {
    playHoverSound();
  };

  const baseClasses = "transition-all duration-200 transform hover:scale-105 active:scale-95";
  const variantClasses = variant === "outline" 
    ? "border-2 border-primary text-primary hover:bg-primary hover:text-white"
    : "bg-primary text-white hover:bg-primary/90";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </button>
  );
};

// مكون الكارد مع التأثيرات
export const InteractiveCard = ({ 
  children, 
  className = "",
  onClick,
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  [key: string]: any;
}) => {
  const { playHoverSound } = useSoundEffects();

  const handleMouseEnter = () => {
    playHoverSound();
  };

  return (
    <div
      className={`transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer ${className}`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </div>
  );
};

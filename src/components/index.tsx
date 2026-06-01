import React, { useState, useEffect } from 'react';

export function useCurrentTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return time;
}

export function CurrentTime({ format = 'time', className = "" }: { format?: 'time' | 'date', className?: string }) {
  const time = useCurrentTime();
  
  if (format === 'time') {
    return <span className={className}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>;
  }
  
  // Custom date logic for App.tsx (05/31)
  const month = (time.getMonth() + 1).toString().padStart(2, '0');
  const date = time.getDate().toString().padStart(2, '0');
  return <span className={className}>{`${month}/${date}`}</span>;
}

export const BackgroundLines = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute left-[15%] top-[10%] w-px h-16 bg-gradient-to-b from-transparent to-gray-400/40"></div>
      <div className="absolute left-[45%] top-[30%] w-px h-24 bg-gradient-to-b from-transparent to-gray-400/30"></div>
      <div className="absolute left-[80%] top-[20%] w-px h-12 bg-gradient-to-b from-transparent to-gray-400/40"></div>
      
      <div className="absolute left-[25%] top-[60%] w-px h-20 bg-gradient-to-b from-transparent to-gray-400/30"></div>
      <div className="absolute left-[65%] top-[70%] w-px h-16 bg-gradient-to-b from-transparent to-gray-400/40"></div>
      <div className="absolute left-[85%] top-[50%] w-px h-32 bg-gradient-to-b from-transparent to-gray-400/20"></div>
      
      <div className="absolute left-6 top-0 w-px h-full bg-gradient-to-b from-gray-300/10 via-gray-300/30 to-gray-300/10"></div>
      <div className="absolute right-6 top-0 w-px h-full bg-gradient-to-b from-gray-300/10 via-gray-300/30 to-gray-300/10"></div>
    </div>
  );
};

export const IconChat = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1" />
    <circle cx="12" cy="15" r="3" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export function AppIcon({ icon, label, onClick, className = "" }: { icon: React.ReactNode, label: string, onClick?: () => void, className?: string }) {
  return (
    <div onClick={onClick} className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="w-[60px] h-[60px] rounded-[20px] bg-white/50 backdrop-blur-md shadow-[0_4px_16px_-4px_rgba(0,0,0,0.04)] border border-white/80 flex items-center justify-center text-gray-700 relative overflow-hidden transition-transform active:scale-95 cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent"></div>
        <div className="relative z-10 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <span className="text-[11px] text-gray-600 font-light tracking-widest">{label}</span>
    </div>
  );
}

export const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: (val: boolean) => void }) => (
  <div 
    onClick={() => onChange(!checked)}
    className={`w-12 h-[26px] rounded-full p-[2px] cursor-pointer transition-colors duration-200 ease-in-out ${checked ? 'bg-[#07C160]' : 'bg-[#e5e5e5]'}`}
  >
    <div className={`w-[22px] h-[22px] bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${checked ? 'translate-x-[22px]' : 'translate-x-0'}`} />
  </div>
);

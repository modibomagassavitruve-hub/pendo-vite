import React, { useState, useEffect } from 'react';
import { MessageCircle, Sparkles, X, ChevronRight } from 'lucide-react';

const FeedbackButton = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasShownInitial, setHasShownInitial] = useState(false);

  // Show tooltip briefly on first load
  useEffect(() => {
    if (!hasShownInitial) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
        setHasShownInitial(true);

        // Hide after 3 seconds
        setTimeout(() => {
          setShowTooltip(false);
        }, 3000);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [hasShownInitial]);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Tooltip */}
      <div
        className={`
          absolute right-full mr-4 top-1/2 -translate-y-1/2
          transition-all duration-500 ease-out
          ${showTooltip || isHovered
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-4 pointer-events-none'
          }
        `}
      >
        <div className="relative">
          {/* Tooltip content */}
          <div className="
            flex items-center gap-3
            bg-gradient-to-r from-[#1a2744] to-[#0f172a]
            backdrop-blur-xl
            px-5 py-3 rounded-2xl
            border border-white/10
            shadow-xl shadow-black/20
            whitespace-nowrap
          ">
            <div className="p-1.5 bg-purple-500/20 rounded-lg">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Donner mon avis</p>
              <p className="text-white/50 text-xs">Aidez-nous à améliorer PENDO</p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/30" />
          </div>

          {/* Arrow */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
            <div className="w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-[#1a2744]" />
          </div>
        </div>
      </div>

      {/* Main button */}
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="
          group relative
          overflow-hidden
          transition-all duration-500 ease-out
        "
        aria-label="Donner mon avis"
      >
        {/* Outer glow ring */}
        <div className={`
          absolute -inset-2 rounded-full
          bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-500
          opacity-0 blur-xl
          transition-opacity duration-500
          ${isHovered ? 'opacity-60' : 'opacity-0'}
        `} />

        {/* Pulse rings */}
        <div className="absolute inset-0">
          <div className={`
            absolute inset-0 rounded-full
            border-2 border-purple-500/50
            animate-ping
            ${isHovered ? 'opacity-0' : 'opacity-100'}
          `} />
          <div className={`
            absolute -inset-2 rounded-full
            border border-purple-500/30
            animate-pulse
            ${isHovered ? 'opacity-0' : 'opacity-100'}
          `} />
        </div>

        {/* Button body */}
        <div className={`
          relative
          flex items-center justify-center
          w-14 h-14
          rounded-full
          bg-gradient-to-br from-purple-500 via-fuchsia-500 to-purple-600
          shadow-lg shadow-purple-500/40
          transition-all duration-500
          ${isHovered ? 'scale-110 shadow-purple-500/60' : 'scale-100'}
        `}>
          {/* Inner gradient overlay */}
          <div className="
            absolute inset-0 rounded-full
            bg-gradient-to-t from-black/20 to-white/10
          " />

          {/* Shimmer effect */}
          <div className={`
            absolute inset-0 rounded-full overflow-hidden
          `}>
            <div className={`
              absolute inset-0
              bg-gradient-to-r from-transparent via-white/30 to-transparent
              translate-x-[-100%]
              transition-transform duration-700
              ${isHovered ? 'translate-x-[100%]' : 'translate-x-[-100%]'}
            `} />
          </div>

          {/* Icon */}
          <MessageCircle className={`
            relative z-10 w-6 h-6 text-white
            transition-all duration-300
            ${isHovered ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}
          `} />

          {/* Notification dot */}
          <div className="
            absolute -top-0.5 -right-0.5 z-20
            w-4 h-4
            bg-gradient-to-br from-amber-400 to-orange-500
            rounded-full
            border-2 border-[#0A0F1C]
            shadow-lg shadow-amber-500/50
            flex items-center justify-center
          ">
            <span className="text-[8px] font-bold text-white">!</span>
          </div>
        </div>

        {/* Floating particles on hover */}
        {isHovered && (
          <>
            <div className="
              absolute -top-4 left-1/2 -translate-x-1/2
              w-1 h-1 rounded-full bg-purple-400
              animate-float
            " style={{ animationDelay: '0s' }} />
            <div className="
              absolute -top-2 -left-2
              w-1.5 h-1.5 rounded-full bg-fuchsia-400
              animate-float
            " style={{ animationDelay: '0.2s' }} />
            <div className="
              absolute -top-3 -right-1
              w-1 h-1 rounded-full bg-pink-400
              animate-float
            " style={{ animationDelay: '0.4s' }} />
          </>
        )}
      </button>
    </div>
  );
};

export default FeedbackButton;

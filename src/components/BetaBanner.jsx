import React, { useState, useEffect } from 'react';
import { X, TestTube, MessageCircle, Sparkles, Rocket, Gift, ChevronRight } from 'lucide-react';

const BetaBanner = ({ onFeedbackClick }) => {
  const [isVisible, setIsVisible] = useState(() => {
    return localStorage.getItem('betaBannerDismissed') !== 'true';
  });
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => setIsAnimated(true), 100);
    }
  }, [isVisible]);

  const handleDismiss = () => {
    setIsAnimated(false);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('betaBannerDismissed', 'true');
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        relative overflow-hidden
        transition-all duration-500 ease-out
        ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}
      `}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 animate-gradient" style={{ backgroundSize: '200% 100%' }} />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-64 h-32 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/3 w-48 h-24 bg-fuchsia-400/20 rounded-full blur-2xl" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles className="absolute top-2 left-[10%] w-4 h-4 text-white/40 animate-float" style={{ animationDelay: '0s' }} />
        <Sparkles className="absolute top-3 left-[30%] w-3 h-3 text-white/30 animate-float" style={{ animationDelay: '0.5s' }} />
        <Sparkles className="absolute top-1 right-[25%] w-4 h-4 text-white/40 animate-float" style={{ animationDelay: '1s' }} />
        <Sparkles className="absolute top-2 right-[45%] w-3 h-3 text-white/30 animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="container mx-auto px-4 py-3.5 relative">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Left section */}
          <div className="flex items-center gap-4">
            {/* Beta badge with pulse */}
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 rounded-full blur animate-pulse" />
              <div className="relative flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/20">
                <TestTube className="w-4 h-4 text-white" />
                <span className="text-sm font-bold tracking-wide text-white">BÊTA</span>
              </div>
            </div>

            {/* Message */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-amber-300 hidden sm:block" />
                <p className="text-white font-medium">
                  <span className="font-bold">Bienvenue dans PENDO !</span>
                  <span className="hidden lg:inline text-white/80 ml-2">
                    Accès gratuit illimité pour tous les testeurs.
                  </span>
                </p>
              </div>
            </div>

            {/* Bonus indicator - desktop only */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-amber-400/20 rounded-lg border border-amber-400/30">
              <Gift className="w-4 h-4 text-amber-300" />
              <span className="text-sm text-amber-200 font-medium">Bonus early adopter</span>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Feedback button */}
            <button
              onClick={onFeedbackClick}
              className="
                group relative flex items-center gap-2
                bg-white hover:bg-white/90
                text-purple-700 font-semibold
                px-5 py-2.5 rounded-xl
                transition-all duration-300
                shadow-lg shadow-purple-900/20 hover:shadow-purple-900/30
                hover:-translate-y-0.5
                overflow-hidden
              "
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-100 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

              <MessageCircle className="w-4 h-4 relative z-10" />
              <span className="relative z-10 hidden sm:inline">Donner mon avis</span>
              <span className="relative z-10 sm:hidden">Avis</span>
              <ChevronRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="
                p-2.5 rounded-xl
                text-white/70 hover:text-white
                bg-white/0 hover:bg-white/10
                border border-transparent hover:border-white/20
                transition-all duration-300
              "
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetaBanner;

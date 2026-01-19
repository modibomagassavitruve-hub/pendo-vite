import React, { useState, useEffect } from 'react';
import {
  Globe,
  RefreshCw,
  Settings,
  MessageSquare,
  MessageCircle,
  User,
  TrendingUp,
  Sparkles,
  BarChart3,
  Newspaper,
  Briefcase,
  PieChart,
  Bell,
  Info,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Header = ({
  apiStatus,
  loading,
  activeTab,
  setActiveTab,
  refreshMarkets,
  openAdmin,
  onOpenLogin,
  userMenuComponent
}) => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Effet de scroll pour le header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items avec icônes
  const navItems = [
    { id: 'markets', icon: TrendingUp, label: t('navigation.markets') },
    { id: 'opportunities', icon: Sparkles, label: t('navigation.opportunities') },
    { id: 'news', icon: Newspaper, label: t('navigation.news') },
    { id: 'portfolio', icon: Briefcase, label: t('navigation.portfolio') },
    { id: 'analytics', icon: PieChart, label: t('navigation.analytics') },
    { id: 'notifications', icon: Bell, label: t('navigation.notifications') },
    { id: 'about', icon: Info, label: t('navigation.about') },
  ];

  const NavButton = ({ item, isMobile = false }) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;

    return (
      <button
        onClick={() => {
          setActiveTab(item.id);
          if (isMobile) setMobileMenuOpen(false);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setActiveTab(item.id);
            if (isMobile) setMobileMenuOpen(false);
          }
        }}
        aria-current={isActive ? 'page' : undefined}
        aria-label={item.label}
        role="tab"
        tabIndex={0}
        className={`
          group relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium
          transition-all duration-300 ease-out
          focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent
          ${isActive
            ? 'bg-white/15 text-white shadow-lg shadow-white/10'
            : 'text-white/70 hover:text-white hover:bg-white/10'
          }
          ${isMobile ? 'w-full justify-start text-base' : 'text-sm'}
        `}
      >
        <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} aria-hidden="true" />
        <span>{item.label}</span>
        {isActive && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent rounded-full" aria-hidden="true" />
        )}
      </button>
    );
  };

  return (
    <header
      role="banner"
      aria-label={t('header.mainNavigation') || 'Navigation principale'}
      className={`
        sticky top-0 z-50 transition-all duration-500
        ${scrolled
          ? 'bg-[#0A0F1C]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/20'
          : 'bg-gradient-to-r from-[#1E3A8A] via-[#1E40AF] to-[#1E3A8A]'
        }
      `}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-1/2 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl transition-opacity duration-500 ${scrolled ? 'opacity-30' : 'opacity-0'}`} />
        <div className={`absolute -top-1/2 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl transition-opacity duration-500 ${scrolled ? 'opacity-30' : 'opacity-0'}`} />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo avec animation */}
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => setActiveTab('markets')}>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-20 blur-lg transition-all duration-500" />
              <img
                src="/logo-pendo.svg"
                alt="PENDO"
                className="h-10 md:h-12 relative transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Tagline - visible sur desktop */}
            <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-white/20">
              <span className="text-white/60 text-sm font-medium">Marchés Africains</span>
              <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                LIVE
              </span>
            </div>
          </div>

          {/* Actions à droite */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Language Selector */}
            <div className="hidden md:block">
              <LanguageSelector />
            </div>

            {/* Forum Button */}
            <button
              onClick={() => setActiveTab('forum')}
              className={`
                hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
                transition-all duration-300
                ${activeTab === 'forum'
                  ? 'bg-white text-[#1E3A8A] shadow-lg shadow-white/20'
                  : 'text-white/80 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20'
                }
              `}
              title={t('navigation.forum')}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden md:inline">{t('navigation.forum')}</span>
            </button>

            {/* Chat Button */}
            <button
              onClick={() => setActiveTab('chat')}
              className={`
                hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
                transition-all duration-300
                ${activeTab === 'chat'
                  ? 'bg-white text-[#1E3A8A] shadow-lg shadow-white/20'
                  : 'text-white/80 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20'
                }
              `}
              title={t('navigation.chat')}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden md:inline">{t('navigation.chat')}</span>
            </button>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

            {/* User Menu ou bouton Connexion */}
            {userMenuComponent || (
              <button
                onClick={onOpenLogin}
                className="
                  group relative flex items-center gap-2 px-4 py-2.5
                  bg-gradient-to-r from-emerald-500 to-emerald-600
                  hover:from-emerald-400 hover:to-emerald-500
                  text-white font-semibold text-sm rounded-xl
                  transition-all duration-300
                  shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50
                  hover:-translate-y-0.5
                "
              >
                <User className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>{t('auth.login')}</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Navigation Desktop */}
        <nav className="hidden md:block border-t border-white/10 py-2">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => (
              <NavButton key={item.id} item={item} />
            ))}
          </div>
        </nav>

        {/* Navigation Mobile */}
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-300 ease-out
            ${mobileMenuOpen ? 'max-h-[500px] opacity-100 pb-4' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="pt-4 border-t border-white/10 space-y-1">
            {navItems.map((item) => (
              <NavButton key={item.id} item={item} isMobile />
            ))}

            {/* Mobile-only items */}
            <div className="pt-3 mt-3 border-t border-white/10 space-y-1">
              <button
                onClick={() => {
                  setActiveTab('forum');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t('navigation.forum')}</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('chat');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('navigation.chat')}</span>
              </button>
            </div>

            {/* Language selector mobile */}
            <div className="pt-3 mt-3 border-t border-white/10">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

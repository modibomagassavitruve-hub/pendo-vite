import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Globe,
  Heart,
  Github,
  Twitter,
  Linkedin,
  Mail,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Shield
} from 'lucide-react';

const Footer = ({ apiStatus }) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Mail, href: 'mailto:contact@pendo.africa', label: 'Email' },
  ];

  const footerLinks = {
    product: [
      { label: t('footer.markets') || 'Marchés', href: '#markets' },
      { label: t('footer.analytics') || 'Analytics', href: '#analytics' },
      { label: t('footer.portfolio') || 'Portfolio', href: '#portfolio' },
      { label: t('footer.api') || 'API', href: '#api' },
    ],
    resources: [
      { label: t('footer.documentation') || 'Documentation', href: '#docs' },
      { label: t('footer.blog') || 'Blog', href: '#blog' },
      { label: t('footer.faq') || 'FAQ', href: '#faq' },
      { label: t('footer.support') || 'Support', href: '#support' },
    ],
    legal: [
      { label: t('footer.privacy') || 'Confidentialité', href: '#privacy' },
      { label: t('footer.terms') || 'Conditions', href: '#terms' },
      { label: t('footer.cookies') || 'Cookies', href: '#cookies' },
    ],
  };

  return (
    <footer className="relative mt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1C] via-[#0f172a] to-[#0A0F1C]" />

      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative">
        {/* Main footer content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/logo-pendo.svg"
                  alt="PENDO"
                  className="h-10"
                />
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  BÊTA
                </span>
              </div>

              <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-sm">
                {t('footer.description') || 'La plateforme de référence pour suivre les marchés boursiers africains en temps réel.'}
              </p>

              {/* Status indicator */}
              <div className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm
                ${apiStatus.connected
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }
              `}>
                <span className={`w-2 h-2 rounded-full ${apiStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {apiStatus.connected ? t('footer.backendConnected') : t('footer.demoMode')}
              </div>

              {/* Social links */}
              <div className="flex items-center gap-3 mt-6">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="
                        p-2.5 rounded-xl
                        bg-white/5 hover:bg-white/10
                        text-white/40 hover:text-white
                        border border-white/5 hover:border-white/10
                        transition-all duration-300 hover:-translate-y-1
                      "
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Links sections */}
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                {t('footer.productTitle') || 'Produit'}
              </h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-white/50 hover:text-white text-sm transition-colors duration-300 flex items-center gap-1 group"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                {t('footer.resourcesTitle') || 'Ressources'}
              </h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-white/50 hover:text-white text-sm transition-colors duration-300 flex items-center gap-1 group"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                {t('footer.legalTitle') || 'Légal'}
              </h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-white/50 hover:text-white text-sm transition-colors duration-300 flex items-center gap-1 group"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-white/40">
                © {currentYear} PENDO - {t('footer.autoCollection')}
              </p>

              <div className="flex items-center gap-2 text-sm text-white/40">
                <span>{t('footer.madeWith') || 'Fait avec'}</span>
                <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                <span>{t('footer.forAfrica') || 'pour l\'Afrique'}</span>
                <Globe className="w-4 h-4 text-blue-400" />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs text-white/30">v1.0.0-beta</span>
                <span className="text-white/20">|</span>
                <span className="text-xs text-white/30">{t('footer.allRightsReserved') || 'Tous droits réservés'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

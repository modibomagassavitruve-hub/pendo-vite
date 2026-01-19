import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { languages } from '../i18n';
import { Globe, Check, ChevronDown, Search, Sparkles } from 'lucide-react';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredLang, setHoveredLang] = useState(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
    setSearchQuery('');
  };

  const currentLanguage = languages[i18n.language] || languages.fr;

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Group languages by region
  const languagesByRegion = {
    international: Object.keys(languages).filter(key => languages[key].region === 'international'),
    west: Object.keys(languages).filter(key => languages[key].region === 'west'),
    central: Object.keys(languages).filter(key => languages[key].region === 'central'),
    east: Object.keys(languages).filter(key => languages[key].region === 'east'),
    south: Object.keys(languages).filter(key => languages[key].region === 'south'),
  };

  // Filter languages based on search
  const filterLanguages = (langKeys) => {
    if (!searchQuery) return langKeys;
    return langKeys.filter(lng => {
      const lang = languages[lng];
      return (
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  const regionIcons = {
    international: '🌍',
    west: '🇳🇬',
    central: '🇨🇩',
    east: '🇰🇪',
    south: '🇿🇦',
  };

  const regionLabels = {
    international: t('languageSelector.international'),
    west: t('languageSelector.westAfrica'),
    central: t('languageSelector.centralAfrica'),
    east: t('languageSelector.eastAfrica'),
    south: t('languageSelector.southernAfrica'),
  };

  const renderLanguageButton = (lng) => {
    const isSelected = i18n.language === lng;
    const isHovered = hoveredLang === lng;

    return (
      <button
        key={lng}
        onClick={() => changeLanguage(lng)}
        onMouseEnter={() => setHoveredLang(lng)}
        onMouseLeave={() => setHoveredLang(null)}
        className={`
          w-full text-left px-4 py-3
          transition-all duration-300
          flex items-center gap-3
          rounded-xl mx-2 mb-1
          ${isSelected
            ? 'bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 text-white border border-purple-500/30'
            : 'text-white/70 hover:bg-white/10 hover:text-white border border-transparent'
          }
          ${isHovered && !isSelected ? 'translate-x-1' : ''}
        `}
        style={{ width: 'calc(100% - 1rem)' }}
      >
        {/* Flag with glow effect */}
        <div className="relative">
          <div className={`
            absolute inset-0 blur-md transition-opacity duration-300
            ${isSelected || isHovered ? 'opacity-50' : 'opacity-0'}
          `}>
            <span className="text-2xl">{languages[lng].flag}</span>
          </div>
          <span className={`
            relative text-2xl transition-transform duration-300
            ${isHovered ? 'scale-110' : 'scale-100'}
          `}>
            {languages[lng].flag}
          </span>
        </div>

        {/* Language info */}
        <div className="flex-1 min-w-0">
          <div className={`
            font-medium transition-colors duration-300
            ${isSelected ? 'text-purple-300' : ''}
          `}>
            {languages[lng].nativeName}
          </div>
          {languages[lng].name !== languages[lng].nativeName && (
            <div className="text-xs text-white/40 truncate">
              {languages[lng].name}
            </div>
          )}
        </div>

        {/* Check mark */}
        {isSelected && (
          <div className="p-1.5 bg-purple-500/30 rounded-lg">
            <Check className="w-4 h-4 text-purple-300" />
          </div>
        )}
      </button>
    );
  };

  const renderRegion = (regionKey) => {
    const filteredLangs = filterLanguages(languagesByRegion[regionKey]);
    if (filteredLangs.length === 0) return null;

    return (
      <div key={regionKey} className="py-2">
        <div className="px-4 py-2 flex items-center gap-2">
          <span className="text-lg">{regionIcons[regionKey]}</span>
          <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
            {regionLabels[regionKey]}
          </span>
          <span className="text-xs text-white/20">({filteredLangs.length})</span>
        </div>
        {filteredLangs.map(renderLanguageButton)}
      </div>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          group relative flex items-center gap-2 px-4 py-2.5
          rounded-xl overflow-hidden
          transition-all duration-300
          ${isOpen
            ? 'bg-white/15 border-white/20'
            : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/15'
          }
          border
        `}
        aria-label="Select language"
      >
        {/* Shimmer on hover */}
        <div className="
          absolute inset-0
          bg-gradient-to-r from-transparent via-white/10 to-transparent
          translate-x-[-100%] group-hover:translate-x-[100%]
          transition-transform duration-700
        " />

        <Globe className={`
          w-4 h-4 text-white/60 transition-all duration-300
          ${isOpen ? 'rotate-180 text-purple-400' : 'group-hover:text-white'}
        `} />

        <span className="text-lg transition-transform duration-300 group-hover:scale-110">
          {currentLanguage.flag}
        </span>

        <span className="hidden md:inline text-sm text-white/80 font-medium">
          {currentLanguage.nativeName}
        </span>

        <ChevronDown className={`
          w-4 h-4 text-white/40 transition-all duration-300
          ${isOpen ? 'rotate-180 text-purple-400' : ''}
        `} />
      </button>

      {/* Dropdown menu */}
      <div className={`
        absolute right-0 mt-2 w-80
        transition-all duration-300 ease-out origin-top-right
        ${isOpen
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }
      `}>
        <div className="
          relative overflow-hidden
          bg-gradient-to-b from-[#1a2744] to-[#0f172a]
          backdrop-blur-xl
          rounded-2xl
          border border-white/10
          shadow-2xl shadow-black/50
        ">
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl" />

          {/* Header with search */}
          <div className="relative p-4 border-b border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-white/80">
                {t('languageSelector.title') || 'Choisir une langue'}
              </span>
              <span className="text-xs text-white/30 ml-auto">
                {Object.keys(languages).length} langues
              </span>
            </div>

            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('languageSelector.search') || 'Rechercher...'}
                className="
                  w-full pl-10 pr-4 py-2.5
                  bg-white/5
                  border border-white/10 focus:border-purple-500/50
                  rounded-xl
                  text-sm text-white placeholder-white/30
                  outline-none
                  transition-all duration-300
                  focus:bg-white/10
                "
              />
            </div>
          </div>

          {/* Languages list */}
          <div className="relative max-h-[24rem] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {['international', 'west', 'central', 'east', 'south'].map((region, index, arr) => (
              <React.Fragment key={region}>
                {renderRegion(region)}
                {index < arr.length - 1 && filterLanguages(languagesByRegion[region]).length > 0 && (
                  <div className="mx-4 border-t border-white/5" />
                )}
              </React.Fragment>
            ))}

            {/* No results */}
            {searchQuery && Object.values(languagesByRegion).every(langs => filterLanguages(langs).length === 0) && (
              <div className="p-8 text-center">
                <div className="p-3 bg-white/5 rounded-full w-fit mx-auto mb-3">
                  <Search className="w-6 h-6 text-white/30" />
                </div>
                <p className="text-white/50 text-sm">
                  {t('languageSelector.noResults') || 'Aucun résultat'}
                </p>
                <p className="text-white/30 text-xs mt-1">
                  "{searchQuery}"
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="relative p-3 border-t border-white/5 bg-white/[0.02]">
            <p className="text-xs text-white/30 text-center">
              {t('languageSelector.footer') || '26 langues africaines supportées'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;

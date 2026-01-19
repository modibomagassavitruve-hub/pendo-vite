import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { Filter, X, ChevronDown, Search } from 'lucide-react';

const AdvancedFilters = ({ onFilterChange, exchanges = [], sectors = [] }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    exchange: 'all',
    sector: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
    priceMin: '',
    priceMax: '',
    changeMin: '',
    changeMax: ''
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      search: '',
      exchange: 'all',
      sector: 'all',
      sortBy: 'name',
      sortOrder: 'asc',
      priceMin: '',
      priceMax: '',
      changeMin: '',
      changeMax: ''
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'sortBy' || key === 'sortOrder') return false;
    if (key === 'exchange' && value === 'all') return false;
    if (key === 'sector' && value === 'all') return false;
    return value !== '' && value !== 'all';
  }).length;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-white font-semibold hover:text-orange-400 transition"
        >
          <Filter className="w-5 h-5" />
          <span>Filtres avancés</span>
          {activeFiltersCount > 0 && (
            <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-sm text-gray-400 hover:text-white transition flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Réinitialiser
          </button>
        )}
      </div>

      {/* Filter Content */}
      {isOpen && (
        <div className="space-y-4 pt-4 border-t border-gray-700">
          {/* Search */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Recherche</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder={t('placeholders.searchTickerName')}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Exchange and Sector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Bourse</label>
              <select
                value={filters.exchange}
                onChange={(e) => handleFilterChange('exchange', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="all">Toutes les bourses</option>
                {exchanges.map(ex => (
                  <option key={ex} value={ex}>{ex.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Secteur</label>
              <select
                value={filters.sector}
                onChange={(e) => handleFilterChange('sector', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="all">Tous les secteurs</option>
                {sectors.map(sec => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Fourchette de prix (XOF)</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={filters.priceMin}
                onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                placeholder={t('placeholders.min')}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
              <input
                type="number"
                value={filters.priceMax}
                onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                placeholder={t('placeholders.max')}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Change Range */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Variation (%)</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                step="0.1"
                value={filters.changeMin}
                onChange={(e) => handleFilterChange('changeMin', e.target.value)}
                placeholder="Min %"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
              <input
                type="number"
                step="0.1"
                value={filters.changeMax}
                onChange={(e) => handleFilterChange('changeMax', e.target.value)}
                placeholder="Max %"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Sort Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Trier par</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="name">Nom</option>
                <option value="symbol">Ticker</option>
                <option value="price">Prix</option>
                <option value="change">Variation</option>
                <option value="volume">Volume</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Ordre</label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="asc">Croissant</option>
                <option value="desc">Décroissant</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;

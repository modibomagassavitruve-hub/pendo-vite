import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Users, Globe, Shield, Zap, Award } from 'lucide-react';

const AboutUs = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: t('about.features.panAfrican.title'),
      description: t('about.features.panAfrican.description'),
      color: 'from-primary to-primary-dark'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: t('about.features.realtime.title'),
      description: t('about.features.realtime.description'),
      color: 'from-secondary to-secondary-dark'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t('about.features.secure.title'),
      description: t('about.features.secure.description'),
      color: 'from-accent to-accent-dark'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: t('about.features.tools.title'),
      description: t('about.features.tools.description'),
      color: 'from-primary-light to-primary'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t('about.features.community.title'),
      description: t('about.features.community.description'),
      color: 'from-secondary-light to-secondary'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: t('about.features.education.title'),
      description: t('about.features.education.description'),
      color: 'from-accent-light to-accent'
    }
  ];

  const stats = [
    { value: '7+', label: t('about.stats.markets') },
    { value: '500+', label: t('about.stats.stocks') },
    { value: '24/7', label: t('about.stats.support') },
    { value: '54', label: t('about.stats.countries') }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark py-20 px-4">
        <div className="container mx-auto text-center">
          <img src="/logo-pendo.svg" alt="PENDO" className="h-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6">{t('about.title')}</h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
            {t('about.subtitle')}
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('about.mission.title')}</h2>
          <div className="bg-slate-800 rounded-2xl p-8 shadow-xl">
            <p className="text-lg text-slate-300 leading-relaxed mb-4">
              {t('about.mission.description1')}
            </p>
            <p className="text-lg text-slate-300 leading-relaxed">
              {t('about.mission.description2')}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-16 px-4 bg-slate-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">{t('about.features.title')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800 rounded-xl p-6 hover:shadow-2xl transition group">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Markets Coverage */}
      <div className="py-16 px-4 bg-slate-800">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('about.markets.title')}</h2>
          <div className="bg-slate-900 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-secondary">{t('about.markets.west')}</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• BRVM (Côte d'Ivoire)</li>
                  <li>• Nigerian Exchange (NGX)</li>
                  <li>• Ghana Stock Exchange (GSE)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-secondary">{t('about.markets.east')}</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Nairobi Securities Exchange (NSE)</li>
                  <li>• Dar es Salaam Stock Exchange</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-secondary">{t('about.markets.south')}</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Johannesburg Stock Exchange (JSE)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-secondary">{t('about.markets.north')}</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Egyptian Exchange (EGX)</li>
                  <li>• Casablanca Stock Exchange</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('about.vision.title')}</h2>
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-8 border border-primary/30">
            <p className="text-lg text-slate-200 leading-relaxed text-center">
              {t('about.vision.description')}
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">{t('about.cta.title')}</h2>
          <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
            {t('about.cta.description')}
          </p>
          <button className="bg-secondary hover:bg-secondary-dark text-white px-8 py-3 rounded-lg text-lg font-semibold transition transform hover:scale-105 shadow-lg">
            {t('about.cta.button')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

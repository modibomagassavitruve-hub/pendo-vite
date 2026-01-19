import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import MarketsTab from './components/MarketsTab';
import OpportunitiesTab from './components/OpportunitiesTab';
import AdminPanel from './components/AdminPanel';
import MarketClosedPage from './components/MarketClosedPage';
import AlertModal from './components/AlertModal';
import { useMarkets } from './hooks/useMarkets';
import NewsSection from './components/NewsSection';
import PortfolioTabEnhanced from './components/PortfolioTabEnhanced';
import AnalyticsTab from './components/AnalyticsTab';
import NotificationBell from './components/NotificationBell';
import NotificationCenter from './components/NotificationCenter';
import LoginModal from './components/LoginModal';
import UserMenu from './components/UserMenu';
import ForumMain from './components/Forum/ForumMain';
import ChatMain from './components/Chat/ChatMain';
import AboutUs from './components/AboutUs';
import { useTranslation } from 'react-i18next';
import { runApiDiagnostic } from './utils/apiDiagnostic';

// Composants Phase Bêta
import BetaBanner from './components/BetaBanner';
import FeedbackButton from './components/FeedbackButton';
import FeedbackModal from './components/FeedbackModal';
import analyticsService from './services/analyticsService';

// Fonction pour vérifier si au moins un marché est ouvert
const isAnyMarketOpen = () => {
  const now = new Date();
  const day = now.getUTCDay();
  const hour = now.getUTCHours();
  const minute = now.getUTCMinutes();
  const currentTime = hour * 60 + minute;

  // Weekend = fermé
  if (day === 0 || day === 6) return false;

  // Horaires des marchés africains (en minutes UTC)
  const marketHours = [
    { open: 7 * 60, close: 15 * 60 },      // JSE: 07:00-15:00 UTC
    { open: 8 * 60 + 30, close: 13 * 60 + 30 }, // NGX: 08:30-13:30 UTC
    { open: 8 * 60, close: 12 * 60 + 15 }, // EGX: 08:00-12:15 UTC
    { open: 9 * 60, close: 15 * 60 },      // BRVM: 09:00-15:00 UTC
    { open: 7 * 60, close: 12 * 60 },      // NSE Kenya: 07:00-12:00 UTC
    { open: 9 * 60, close: 15 * 60 + 30 }, // Casa: 09:00-15:30 UTC
  ];

  return marketHours.some(m => currentTime >= m.open && currentTime <= m.close);
};

function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('markets');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [marketOpen, setMarketOpen] = useState(true);
  const [showClosedPage, setShowClosedPage] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const {
    markets,
    lastUpdate,
    loading,
    apiStatus,
    apiUrl,
    setApiUrl,
    checkApiStatus,
    loadMarkets,
    refreshMarkets,
    loadFallbackData
  } = useMarkets();

  useEffect(() => {
    // Diagnostic API (en DEV uniquement)
    if (process.env.NODE_ENV === 'development') {
      runApiDiagnostic();
    }

    checkApiStatus();
    loadMarkets();

    // Tracker la page d'accueil
    analyticsService.trackPageView('home');

    // Vérifier si les marchés sont ouverts
    const checkMarkets = () => {
      const isOpen = isAnyMarketOpen();
      setMarketOpen(isOpen);
    };

    checkMarkets();
    const interval = setInterval(checkMarkets, 60000); // Vérifier toutes les minutes

    return () => clearInterval(interval);
  }, []);

  // Si l'utilisateur choisit de voir la page "Marché Fermé"
  if (showClosedPage) {
    return (
      <>
        <MarketClosedPage 
          markets={markets}
          onSetAlert={() => setShowAlerts(true)}
        />
        <button
          onClick={() => setShowClosedPage(false)}
          className="fixed bottom-4 right-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition z-50 shadow-lg"
        >
          {t('market.viewData')}
        </button>
        {showAlerts && <AlertModal onClose={() => setShowAlerts(false)} />}
      </>
    );
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-900">
        {/* Banner Phase Bêta */}
        <BetaBanner onFeedbackClick={() => setShowFeedbackModal(true)} />

        {/* Login Modal */}
        <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />

        {/* Alert Modal */}
        {showAlerts && <AlertModal onClose={() => setShowAlerts(false)} />}

        {/* Admin Panel Modal */}
        {showAdmin && (
          <AdminPanel
            apiStatus={apiStatus}
            apiUrl={apiUrl}
            setApiUrl={setApiUrl}
            checkApiStatus={checkApiStatus}
            refreshMarkets={refreshMarkets}
            loadFallbackData={loadFallbackData}
            loading={loading}
            markets={markets}
            onClose={() => setShowAdmin(false)}
          />
        )}

      {/* Bannière Marché Fermé */}
      {!marketOpen && (
        <div className="bg-gradient-to-r from-accent to-accent-dark text-neutral-dark py-3 px-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌙</span>
              <span className="font-medium">{t('market.closed')}</span>
            </div>
            <button
              onClick={() => setShowClosedPage(true)}
              className="px-4 py-1 bg-neutral-dark/20 rounded-lg hover:bg-neutral-dark/30 transition text-sm"
            >
              {t('market.viewSchedule')}
            </button>
          </div>
        </div>
      )}

        {/* Header avec Forum, Chat et Connexion intégrés */}
        <Header
          apiStatus={apiStatus}
          loading={loading}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          refreshMarkets={refreshMarkets}
          openAdmin={() => setShowAdmin(true)}
          openAlerts={() => setShowAlerts(true)}
          marketOpen={marketOpen}
          onOpenLogin={() => setShowLogin(true)}
          userMenuComponent={<UserMenu onOpenLogin={() => setShowLogin(true)} />}
        />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'markets' && (
          <MarketsTab
            markets={markets}
            lastUpdate={lastUpdate}
            apiStatus={apiStatus}
            openAdmin={() => setShowAdmin(true)}
          />
        )}

        {activeTab === 'opportunities' && (
          <OpportunitiesTab />
            )}

            {activeTab === "news" && (
              <NewsSection />
            )}

            {activeTab === "portfolio" && (
              <PortfolioTabEnhanced />
        )}

        {activeTab === "analytics" && (
          <AnalyticsTab />
        )}

        {activeTab === "notifications" && (
          <NotificationCenter
            isOpen={true}
            onClose={() => setActiveTab('markets')}
          />
        )}

        {activeTab === "forum" && (
          <ForumMain />
        )}

        {activeTab === "chat" && (
          <ChatMain />
        )}

        {activeTab === "about" && (
          <AboutUs />
        )}
      </main>

        {/* Footer */}
        <Footer apiStatus={apiStatus} />

        {/* Bouton Feedback Flottant */}
        <FeedbackButton onClick={() => setShowFeedbackModal(true)} />

        {/* Modal de Feedback */}
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
        />
      </div>
    </AuthProvider>
  );
}

export default App;

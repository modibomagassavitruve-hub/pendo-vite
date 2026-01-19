import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User, LogOut, Settings, Activity, ChevronDown
} from 'lucide-react';

const UserMenu = ({ onOpenLogin }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <button
        onClick={onOpenLogin}
        className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold rounded-lg transition flex items-center gap-2"
      >
        <User className="w-5 h-5" />
        <span>Connexion</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition border border-gray-700"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 flex items-center justify-center text-white font-semibold">
          {user?.first_name?.[0]}{user?.last_name?.[0]}
        </div>
        <div className="text-left hidden md:block">
          <div className="text-white text-sm font-medium">
            {user?.first_name} {user?.last_name}
          </div>
          <div className="text-gray-400 text-xs">{user?.email}</div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden">
            {/* User info */}
            <div className="px-4 py-3 border-b border-gray-700">
              <div className="text-white font-medium">
                {user?.first_name} {user?.last_name}
              </div>
              <div className="text-gray-400 text-sm">{user?.email}</div>
              {user?.role && user.role !== 'user' && (
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded">
                    {user.role === 'premium' ? 'Premium' : 'Admin'}
                  </span>
                </div>
              )}
            </div>

            {/* Menu items */}
            <div className="py-2">
              <button
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition flex items-center gap-3"
              >
                <User className="w-4 h-4" />
                <span>Mon profil</span>
              </button>

              <button
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition flex items-center gap-3"
              >
                <Activity className="w-4 h-4" />
                <span>Mon activité</span>
              </button>

              <button
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition flex items-center gap-3"
              >
                <Settings className="w-4 h-4" />
                <span>Paramètres</span>
              </button>
            </div>

            {/* Logout */}
            <div className="border-t border-gray-700 py-2">
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 hover:text-red-300 transition flex items-center gap-3"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;

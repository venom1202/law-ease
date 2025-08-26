
import React from 'react';
import { LANGUAGE_OPTIONS } from '../constants';
import type { Language } from '../types';
import { BalanceIcon } from './icons/BalanceIcon';
import { UserIcon } from './icons/UserIcon';
import { LogoutIcon } from './icons/LogoutIcon';

interface HeaderProps {
  language: Language;
  setLanguage: (language: Language) => void;
  isAuthenticated: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ language, setLanguage, isAuthenticated, onLoginClick, onLogoutClick }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BalanceIcon className="w-8 h-8 text-indigo-600" />
          <span className="text-xl font-bold text-slate-800">LawEase</span>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-slate-100 border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            aria-label="Select language"
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {isAuthenticated ? (
            <button
              onClick={onLogoutClick}
              className="flex items-center gap-2 bg-slate-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
              aria-label="Logout"
            >
              <LogoutIcon className="w-5 h-5" />
              Logout
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Login or Sign Up"
            >
              <UserIcon className="w-5 h-5" />
              Login / Sign Up
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

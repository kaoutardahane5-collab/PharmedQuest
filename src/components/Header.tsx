import React from 'react';
import { Language, Theme, UserRole, User } from '../types';
import { translations } from '../utils/translations';
import { 
  Stethoscope, 
  Globe, 
  Palette, 
  ShieldCheck, 
  UserCheck, 
  Wifi, 
  WifiOff, 
  HelpCircle,
  BookOpen,
  Users,
  BarChart3,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  role: UserRole;
  onRoleToggle: () => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  user: User | null;
  activeView: 'landing' | 'hierarchy' | 'quiz' | 'results' | 'analytics' | 'study-room' | 'messages' | 'admin';
  onNavigate: (view: 'hierarchy' | 'analytics' | 'study-room' | 'messages' | 'admin' | 'landing') => void;
  onOpenSupport: () => void;
  announcement?: string;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  role,
  onRoleToggle,
  isOffline,
  onToggleOffline,
  user,
  activeView,
  onNavigate,
  onOpenSupport,
  announcement,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md border-b transition-colors duration-200 bg-white/90 border-slate-200 dark:bg-slate-900/90 dark:border-slate-800">
      {/* Top Banner for Faculty Announcements */}
      {announcement && (
        <div className="bg-gradient-to-r from-teal-700 via-cyan-700 to-teal-800 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
          <span>{announcement}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onNavigate(user ? 'hierarchy' : 'landing')} 
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                  Pharmed<span className="text-teal-600 dark:text-teal-400">Quest</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  DZ
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                {language === 'fr' ? 'Médecine & Pharmacie Algérie' : 'Algerian Medical & Pharmacy'}
              </p>
            </div>
          </button>

          {/* Navigation Links for Authenticated State */}
          {user && (
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => onNavigate('hierarchy')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeView === 'hierarchy' || activeView === 'quiz' || activeView === 'results'
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Cursus & QCMs' : 'Curriculum & MCQs'}</span>
              </button>

              <button
                onClick={() => onNavigate('study-room')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeView === 'study-room'
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Salle d Étude & Pomodoro' : 'Study Room & Pomodoro'}</span>
              </button>

              <button
                onClick={() => onNavigate('analytics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeView === 'analytics'
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Progression' : 'Analytics'}</span>
              </button>

              <button
                onClick={() => onNavigate('messages')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeView === 'messages'
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Messagerie' : 'Messages'}</span>
              </button>

              <button
                onClick={() => onNavigate('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeView === 'admin'
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                    : 'text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-200'
                }`}
                title="Espace Administrateur Sécurisé"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </nav>
          )}
        </div>

        {/* Right Controls: Language, Theme, Role Switcher, Offline Indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Offline simulator toggle */}
          <button
            onClick={onToggleOffline}
            title={isOffline ? t.offlineMode : t.onlineMode}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isOffline
                ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-600" /> : <Wifi className="w-3.5 h-3.5 text-emerald-600" />}
            <span className="hidden sm:inline">{isOffline ? t.offlineMode : 'En ligne'}</span>
          </button>

          {/* Theme Selector */}
          <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onThemeChange('light')}
              title="Thème Clair"
              className={`px-2 py-1 text-xs rounded-md transition-all ${
                theme === 'light'
                  ? 'bg-white text-teal-700 shadow-sm font-semibold dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              ☀️
            </button>
            <button
              onClick={() => onThemeChange('dark')}
              title="Thème Sombre"
              className={`px-2 py-1 text-xs rounded-md transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900 text-cyan-400 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              🌙
            </button>
            <button
              onClick={() => onThemeChange('pink')}
              title="Thème Rose Médical"
              className={`px-2 py-1 text-xs rounded-md transition-all ${
                theme === 'pink'
                  ? 'bg-pink-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-pink-600 dark:text-slate-400'
              }`}
            >
              🌸
            </button>
            <button
              onClick={() => onThemeChange('royal-green')}
              title="Thème Vert Royal"
              className={`px-2 py-1 text-xs rounded-md transition-all ${
                theme === 'royal-green'
                  ? 'bg-emerald-700 text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-emerald-700 dark:text-slate-400'
              }`}
            >
              🌿
            </button>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onLanguageChange('fr')}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                language === 'fr'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                language === 'en'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
              }`}
            >
              EN
            </button>
          </div>

          {/* Switch Role (Student vs Admin) */}
          <button
            onClick={onRoleToggle}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
              role === 'admin'
                ? 'bg-amber-500/10 text-amber-700 border-amber-300 hover:bg-amber-500/20 dark:text-amber-300'
                : 'bg-teal-500/10 text-teal-700 border-teal-300 hover:bg-teal-500/20 dark:text-teal-300'
            }`}
            title={t.switchRole}
          >
            {role === 'admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
            <span>{role === 'admin' ? t.roleAdmin : t.roleStudent}</span>
          </button>

          {/* Support button */}
          <button
            onClick={onOpenSupport}
            className="text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-slate-800 p-2 rounded-full transition-colors"
            title={t.support}
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* User Avatar if logged in */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full ring-2 ring-teal-500/30 object-cover"
              />
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold leading-none text-slate-800 dark:text-slate-200">{user.name}</p>
                <p className="text-[10px] text-teal-600 dark:text-teal-400 font-medium mt-0.5">
                  {user.subscriptionStatus === 'active' ? 'Premium 2500 DZD' : 'Essai Gratuit'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      {user && (
        <div className="lg:hidden flex items-center justify-around py-2 px-2 border-t border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-xs font-semibold">
          <button
            onClick={() => onNavigate('hierarchy')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg ${
              activeView === 'hierarchy' || activeView === 'quiz' || activeView === 'results'
                ? 'text-teal-700 bg-teal-50 dark:bg-teal-950 dark:text-teal-300'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cursus</span>
          </button>
          <button
            onClick={() => onNavigate('study-room')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg ${
              activeView === 'study-room'
                ? 'text-teal-700 bg-teal-50 dark:bg-teal-950 dark:text-teal-300'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Salle d étude</span>
          </button>
          <button
            onClick={() => onNavigate('analytics')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg ${
              activeView === 'analytics'
                ? 'text-teal-700 bg-teal-50 dark:bg-teal-950 dark:text-teal-300'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Stats</span>
          </button>
          <button
            onClick={() => onNavigate('messages')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg ${
              activeView === 'messages'
                ? 'text-teal-700 bg-teal-50 dark:bg-teal-950 dark:text-teal-300'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
          <button
            onClick={() => onNavigate('admin')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg ${
              activeView === 'admin'
                ? 'text-amber-800 bg-amber-100 dark:bg-amber-950 dark:text-amber-300'
                : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>
      )}
    </header>
  );
};

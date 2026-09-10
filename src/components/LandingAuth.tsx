import React, { useState } from 'react';
import { Language, SubscriptionConfig } from '../types';
import { translations } from '../utils/translations';
import { 
  CheckCircle, 
  ShieldCheck, 
  Sparkles, 
  BarChart2, 
  UploadCloud, 
  ArrowRight,
  Info,
  CreditCard,
  Building2,
  Smartphone
} from 'lucide-react';

interface LandingAuthProps {
  language: Language;
  subscriptionConfig: SubscriptionConfig;
  onLogin: (email: string, role: 'student' | 'admin') => void;
  onOpenPaymentModal: () => void;
  onSelectLanguage: (lang: Language) => void;
}

export const LandingAuth: React.FC<LandingAuthProps> = ({
  language,
  subscriptionConfig,
  onLogin,
  onOpenPaymentModal,
  onSelectLanguage,
}) => {
  const t = translations[language];
  const [email, setEmail] = useState('amine.khelil@univ-alger.dz');
  const [password, setPassword] = useState('••••••••');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('Dr. Amine Khelil');
  const [resetNotice, setResetNotice] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, email.includes('admin') ? 'admin' : 'student');
  };

  const handleQuickDemoStudent = () => {
    onLogin('student.pharmacie@univ-alger.dz', 'student');
  };

  const handleQuickDemoAdmin = () => {
    onLogin('admin.faculte@univ-alger.dz', 'admin');
  };

  return (
    <div className="pt-8 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* First-time Language Choice Bar */}
      <div className="mb-6 p-3 bg-teal-50 dark:bg-slate-800 rounded-xl border border-teal-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200">
          <span className="text-base">🇩🇿</span>
          <span className="font-semibold">{t.selectLanguageTitle} :</span>
          <span className="text-slate-600 dark:text-slate-400 hidden sm:inline">{t.selectLanguageDesc}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectLanguage('fr')}
            className={`px-3 py-1 rounded-md font-bold transition-all ${
              language === 'fr' 
                ? 'bg-teal-700 text-white shadow-sm' 
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            🇫🇷 Français
          </button>
          <button
            type="button"
            onClick={() => onSelectLanguage('en')}
            className={`px-3 py-1 rounded-md font-bold transition-all ${
              language === 'en' 
                ? 'bg-teal-700 text-white shadow-sm' 
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            🇬🇧 English
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Login / Register Form */}
        <section className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              {isRegisterMode 
                ? (language === 'fr' ? 'Créer un Compte Étudiant' : 'Create Student Account')
                : t.welcomeBack}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              {t.authSubtitle}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegisterMode && (
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">
                    {language === 'fr' ? 'Nom et Prénom' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none text-sm text-slate-900 dark:text-white transition-all"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">
                  {t.academicEmail}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none text-sm text-slate-900 dark:text-white transition-all"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">
                    {t.password}
                  </label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); setResetNotice(language === 'fr' ? 'Un lien de réinitialisation sécurisé a été préparé pour votre adresse institutionnelle.' : 'A secure password reset link has been queued for your institutional email.'); }} className="text-teal-600 dark:text-teal-400 text-xs font-medium hover:underline">
                    {t.forgotPassword}
                  </a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none text-sm text-slate-900 dark:text-white transition-all"
                />
              </div>

              {resetNotice && (
                <div className="p-3 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 rounded-lg text-xs text-teal-800 dark:text-teal-300">
                  {resetNotice}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg active:scale-[0.99] transition-all mt-2 flex items-center justify-center gap-2 text-sm"
              >
                <span>{isRegisterMode ? (language === 'fr' ? 'S inscrire et Démarrer' : 'Register & Start') : t.logIn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-500 font-semibold">
                  {t.orContinueWith}
                </span>
              </div>
            </div>

            {/* Quick 1-Click Access Buttons for Smooth Reviewing */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleQuickDemoStudent}
                  className="flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 py-2.5 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  <span>{language === 'fr' ? 'Accès Étudiant Démo' : 'Demo Student'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleQuickDemoAdmin}
                  className="flex items-center justify-center gap-2 border border-amber-300 dark:border-amber-800/60 py-2.5 px-3 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs font-semibold text-amber-800 dark:text-amber-300 transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>{language === 'fr' ? 'Accès Administrateur' : 'Admin Demo'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleQuickDemoStudent}
                className="w-full flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{t.google}</span>
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
              {isRegisterMode ? (
                <>
                  {language === 'fr' ? 'Vous avez déjà un compte ?' : 'Already have an account?'}{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegisterMode(false)}
                    className="text-teal-700 dark:text-teal-400 font-semibold hover:underline"
                  >
                    {t.logIn}
                  </button>
                </>
              ) : (
                <>
                  {t.dontHaveAccount}{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegisterMode(true)}
                    className="text-teal-700 dark:text-teal-400 font-semibold hover:underline"
                  >
                    {t.registerFree}
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Trust Indicator */}
          <div className="flex items-center gap-3 p-4 bg-teal-50/70 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800">
            <ShieldCheck className="w-6 h-6 text-teal-700 dark:text-teal-400 shrink-0" />
            <p className="text-xs text-teal-900 dark:text-teal-200 font-medium leading-relaxed">
              {t.trustIndicator}
            </p>
          </div>
        </section>

        {/* Right Side: Bento Grid Premium & Features */}
        <section className="lg:col-span-7 space-y-6">
          <div className="space-y-1">
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 rounded-full text-xs font-bold tracking-wide uppercase">
              {t.premiumAccess}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t.unlockFullMastery}
            </h2>
          </div>

          {/* Bento Grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pricing Card */}
            <div className="glass-panel p-6 rounded-2xl border-2 border-teal-500/30 dark:border-teal-500/40 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-3">
                <span className="bg-teal-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {t.bestValue}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-teal-700 dark:text-teal-400 mb-1">
                  {t.fullCurriculum}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-5">
                  {t.fullCurriculumDesc}
                </p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {subscriptionConfig.yearlyPriceDZD}
                  </span>
                  <span className="text-lg font-bold text-slate-700 dark:text-slate-300">DZD</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                    {language === 'fr' ? '/ an' : '/ year'}
                  </span>
                </div>
              </div>

              <ul className="space-y-2.5 mb-6 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>{t.feature1}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>{t.feature2}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>{t.feature3}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>{t.feature4}</span>
                </li>
              </ul>

              <button
                type="button"
                onClick={onOpenPaymentModal}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-xl font-bold text-xs tracking-wide shadow-md hover:shadow-lg transition-all"
              >
                {t.getStarted}
              </button>
            </div>

            {/* Local Algerian Payment Card */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-5 h-5 text-teal-700 dark:text-teal-400" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {t.localPayment}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  {t.localPaymentDesc}
                </p>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800/90 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700">
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/60 rounded-lg flex items-center justify-center text-blue-700 dark:text-blue-300 shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{t.ccpTransfer}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.ccpSub}</p>
                      <p className="text-[10px] font-mono font-medium text-slate-600 dark:text-slate-300 mt-0.5">
                        CCP: {subscriptionConfig.ccpNumber} Clé {subscriptionConfig.ccpKey}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800/90 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700">
                    <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/60 rounded-lg flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{t.baridiMob}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.baridiMobSub}</p>
                      <p className="text-[10px] font-mono font-medium text-slate-600 dark:text-slate-300 mt-0.5">
                        RIP: {subscriptionConfig.baridiMobRip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-3">
                  <Info className="w-4 h-4 shrink-0 text-teal-600 dark:text-teal-400" />
                  <span className="text-[11px] leading-tight">
                    {t.paymentNotice}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onOpenPaymentModal}
                  className="w-full flex items-center justify-center gap-2 border border-teal-600 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/50 py-2.5 rounded-lg text-xs font-semibold transition-colors"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{t.uploadReceipt}</span>
                </button>
              </div>
            </div>

            {/* Feature Box 1: AI Insights */}
            <div className="glass-panel p-4 rounded-xl flex items-center gap-3 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/80 flex items-center justify-center text-teal-700 dark:text-teal-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{t.aiInsights}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {language === 'fr' ? 'Explications médicales & astuces de résidanat' : 'Medical explanations & residency tips'}
                </p>
              </div>
            </div>

            {/* Feature Box 2: Analytics */}
            <div className="glass-panel p-4 rounded-xl flex items-center gap-3 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-cyan-50 dark:bg-cyan-950/80 flex items-center justify-center text-cyan-700 dark:text-cyan-400 shrink-0">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{t.analyticsBadge}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {language === 'fr' ? 'Points faibles, points forts & rang estimé' : 'Weak points, strengths & percentile rank'}
                </p>
              </div>
            </div>

            {/* Feature Box 3: Student Testimonial with Doctor/Student Avatar */}
            <div className="sm:col-span-2 glass-panel p-4 rounded-xl flex items-center gap-4 border border-slate-200 dark:border-slate-800">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-teal-500/20">
                <img
                  className="object-cover w-full h-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiz0KLuVr8yNifZRybrhSUgI4siK4ju0yzdOrM0KBvvHRcom58DHgpZPjs32yA2YnIMIfAiCdu1Pjj1iAtx88_4TBUzn8AcLIc1gjJ9x3ngbwwEuNwUjj59uHvt4aGC7Nl5UJoJCQnVIRdVwVcuSBTGr3MmEKGeRGuO1HG-16mMGubUgxOVg50CgDWhRSAO9oV8wCnElqIJE4JtYdffYYp7kKqqN3mpQqKa2ljZOZeOGlBawseyu0CsMgSqFCjDmXTQrTZOb_H5P9K"
                  alt="Student portrait"
                />
              </div>
              <div>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-snug">
                  {t.testimonialQuote}
                </p>
                <p className="text-[11px] font-bold text-teal-700 dark:text-teal-400 mt-1">
                  {t.testimonialAuthor}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

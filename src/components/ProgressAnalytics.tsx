import React from 'react';
import { Language, User } from '../types';
import { translations } from '../utils/translations';
import { 
  Flame, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle, 
  Award, 
  Target, 
  ArrowRight,
  BookOpen,
  Calendar
} from 'lucide-react';

interface ProgressAnalyticsProps {
  language: Language;
  user: User;
  onPracticeWeakTopic: (topic: string) => void;
  onBackToCurriculum: () => void;
}

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({
  language,
  user,
  onPracticeWeakTopic,
  onBackToCurriculum,
}) => {
  const t = translations[language];

  // Subject accuracy stats
  const subjectAccuracy = [
    { name: language === 'fr' ? 'Pharmacologie' : 'Pharmacology', score: 78, totalQ: 420 },
    { name: language === 'fr' ? 'Pharmacie Galénique' : 'Galenic Pharmacy', score: 85, totalQ: 290 },
    { name: language === 'fr' ? 'Chimie Thérapeutique' : 'Medicinal Chemistry', score: 62, totalQ: 310 },
    { name: language === 'fr' ? 'Cardiologie' : 'Cardiology', score: 74, totalQ: 380 },
    { name: language === 'fr' ? 'Pneumologie' : 'Pulmonology', score: 69, totalQ: 210 },
    { name: language === 'fr' ? 'Toxicologie Clinique' : 'Clinical Toxicology', score: 88, totalQ: 195 },
  ];

  const daysOfWeek = [
    { day: 'Lun', active: true },
    { day: 'Mar', active: true },
    { day: 'Mer', active: true },
    { day: 'Jeu', active: true },
    { day: 'Ven', active: true },
    { day: 'Sam', active: true },
    { day: 'Dim', active: true },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
      {/* Title & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            {t.progress}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t.analyticsTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.analyticsSubtitle}
          </p>
        </div>

        <button
          onClick={onBackToCurriculum}
          className="self-start sm:self-auto bg-teal-700 hover:bg-teal-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
        >
          <BookOpen className="w-4 h-4" />
          <span>{language === 'fr' ? 'Continuer mes révisions' : 'Resume Review'}</span>
        </button>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Flame className="w-7 h-7 fill-amber-500 text-amber-500 animate-bounce" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t.streakDays}</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{user.streakDays}</span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">jours consécutifs</span>
            </div>
          </div>
        </div>

        {/* Total Time */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t.totalStudyTime}</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{Math.round(user.totalStudyMinutes / 60)}h</span>
              <span className="text-xs text-slate-500">{user.totalStudyMinutes % 60}m</span>
            </div>
          </div>
        </div>

        {/* Solved Questions */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t.solvedQuestions}</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{user.completedQuizzes * 15}</span>
              <span className="text-xs text-slate-500">QCMs validés</span>
            </div>
          </div>
        </div>

        {/* Proficiency Level */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t.proficiencyLevel}</span>
            <div className="mt-0.5">
              <span className="text-base font-extrabold uppercase text-emerald-700 dark:text-emerald-400">
                {user.proficiencyLevel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Calendar Streak Box */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {language === 'fr' ? 'Régularité de révision (7 derniers jours)' : '7-Day Study Habit'}
            </h3>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            🔥 100% de complétion cette semaine
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((d, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center space-y-1"
            >
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{d.day}</span>
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xs font-bold shadow-xs">
                ✓
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Section: Weak & Strong Topics vs Accuracy Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Weak & Strong Topics */}
        <div className="lg:col-span-5 space-y-6">
          {/* Weak Topics */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {t.weakTopics}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'fr' 
                ? 'Sujets nécessitant un renforcement ciblé d après vos erreurs :' 
                : 'Topics requiring focused practice based on recent mistakes:'}
            </p>

            <div className="space-y-3">
              {user.weakTopics.map((topic, index) => (
                <div
                  key={index}
                  className="p-3.5 bg-rose-50/70 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/60 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{topic}</p>
                    <span className="text-[10px] text-rose-700 dark:text-rose-300 font-semibold">Taux de réussite : ~48%</span>
                  </div>

                  <button
                    onClick={() => onPracticeWeakTopic(topic)}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0 transition-colors shadow-xs"
                  >
                    <span>{t.practiceWeakTopic}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Strong Topics */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Target className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {t.strongTopics}
              </h3>
            </div>
            <div className="space-y-2">
              {user.strongTopics.map((topic, index) => (
                <div
                  key={index}
                  className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-slate-900 dark:text-white">{topic}</span>
                  <span className="text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px]">88% de réussite</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Accuracy Rate by Subject */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {t.accuracyRate} {language === 'fr' ? 'par module' : 'by module'}
              </h3>
            </div>
            <span className="text-xs text-slate-500">Moyenne globale : 76%</span>
          </div>

          <div className="space-y-4">
            {subjectAccuracy.map((sub, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{sub.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[10px]">{sub.totalQ} QCMs</span>
                    <span className={`font-bold ${sub.score >= 75 ? 'text-teal-600 dark:text-teal-400' : 'text-amber-600'}`}>
                      {sub.score}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      sub.score >= 80 
                        ? 'bg-gradient-to-r from-teal-600 to-emerald-500' 
                        : sub.score >= 70 
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-500' 
                        : 'bg-gradient-to-r from-amber-500 to-orange-500'
                    }`}
                    style={{ width: `${sub.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Données issues des examens nationaux de résidanat</span>
            <span className="text-teal-600 font-semibold">Mis à jour en temps réel</span>
          </div>
        </div>
      </div>
    </div>
  );
};

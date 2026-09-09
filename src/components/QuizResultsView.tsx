import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Language, MCQQuestion, ProficiencyLevel } from '../types';
import { translations } from '../utils/translations';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  RotateCcw, 
  ArrowLeft, 
  Sparkles, 
  Award, 
  Check, 
  X,
  ChevronDown
} from 'lucide-react';

interface QuizResultsViewProps {
  language: Language;
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  timeSpentSeconds: number;
  questions: MCQQuestion[];
  userAnswers: Record<string, number[]>;
  lessonTitle: string;
  moduleTitle: string;
  proficiencyLevel: ProficiencyLevel;
  onRetryQuiz: () => void;
  onBackToLessons: () => void;
  onAskAIExplanation: (question: MCQQuestion) => void;
}

export const QuizResultsView: React.FC<QuizResultsViewProps> = ({
  language,
  score,
  totalQuestions,
  correctCount,
  incorrectCount,
  timeSpentSeconds,
  questions,
  userAnswers,
  lessonTitle,
  moduleTitle,
  proficiencyLevel,
  onRetryQuiz,
  onBackToLessons,
  onAskAIExplanation,
}) => {
  const t = translations[language];

  // Confetti on high score
  useEffect(() => {
    if (score >= 60) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [score]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  // Estimated percentile rank among residency candidates
  const estimatedRank = Math.min(99, Math.max(10, Math.round(score * 0.95 + 4)));

  return (
    <div className="py-8 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
      {/* Results Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-2 border-teal-500/30 dark:border-teal-500/40 text-center space-y-6 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20">
          <Trophy className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-teal-700 dark:text-teal-400">
            {moduleTitle} • {lessonTitle}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t.quizCompleted}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === 'fr' 
              ? 'Évaluation synchronisée avec votre profil de révision.' 
              : 'Evaluation synchronized with your residency prep profile.'}
          </p>
        </div>

        {/* Big Score Display */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-5xl sm:text-6xl font-black tracking-tight text-teal-700 dark:text-teal-400">
            {score}%
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            {correctCount} {language === 'fr' ? 'bonnes réponses sur' : 'correct out of'} {totalQuestions}
          </span>
        </div>

        {/* 4 Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
            <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t.correctAnswers}
            </span>
            <p className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-1">{correctCount}</p>
          </div>

          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800/60">
            <span className="text-[10px] uppercase font-bold text-rose-800 dark:text-rose-300 flex items-center justify-center gap-1">
              <XCircle className="w-3.5 h-3.5" />
              {t.incorrectAnswers}
            </span>
            <p className="text-xl font-black text-rose-700 dark:text-rose-400 mt-1">{incorrectCount}</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {t.timeSpent}
            </span>
            <p className="text-xl font-black text-slate-800 dark:text-slate-200 mt-1">{formatTime(timeSpentSeconds)}</p>
          </div>

          <div className="p-3 bg-cyan-50 dark:bg-cyan-950/40 rounded-xl border border-cyan-200 dark:border-cyan-800/60">
            <span className="text-[10px] uppercase font-bold text-cyan-800 dark:text-cyan-300 flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5" />
              {t.estimatedRank}
            </span>
            <p className="text-xl font-black text-cyan-700 dark:text-cyan-400 mt-1">Top {100 - estimatedRank}%</p>
          </div>
        </div>

        {/* Dynamic Proficiency Level Banner */}
        <div className="p-4 bg-teal-50 dark:bg-teal-950/50 rounded-xl border border-teal-200 dark:border-teal-800 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-left">
            <TrendingUp className="w-5 h-5 text-teal-700 dark:text-teal-400 shrink-0" />
            <div>
              <p className="font-bold text-teal-950 dark:text-teal-200">
                {t.proficiencyLevel} : <span className="uppercase text-teal-700 dark:text-teal-300">{proficiencyLevel}</span>
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                {language === 'fr' ? 'Niveau recalculé automatiquement selon vos performances universitaires.' : 'Automatically updated based on accuracy.'}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-teal-700 text-white rounded-full font-bold uppercase text-[10px] shrink-0">
            {proficiencyLevel}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onRetryQuiz}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.retryQuiz}</span>
          </button>

          <button
            onClick={onBackToLessons}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToLessons}</span>
          </button>
        </div>
      </div>

      {/* Comprehensive Question-by-Question Review */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-teal-600" />
          <span>{t.reviewQuestions}</span>
        </h3>

        <div className="space-y-4">
          {questions.map((q, qIndex) => {
            const studentAns = userAnswers[q.id] || [];
            const correctAns = q.correctOptionIndexes;
            const isMatch =
              studentAns.length === correctAns.length &&
              studentAns.every((idx) => correctAns.includes(idx));

            const qText = language === 'fr' ? q.questionTextFr : q.questionTextEn;
            const qOptions = language === 'fr' ? q.optionsFr : q.optionsEn;

            return (
              <div
                key={q.id}
                className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center">
                      {qIndex + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {q.facultySource}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                      isMatch
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {isMatch ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    <span>{isMatch ? t.correctAnswers : t.incorrectAnswers}</span>
                  </span>
                </div>

                <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                  {qText}
                </p>

                {/* Options display with correct vs student indicators */}
                <div className="space-y-2 text-xs">
                  {qOptions.map((opt, optIdx) => {
                    const isSelected = studentAns.includes(optIdx);
                    const isCorrect = correctAns.includes(optIdx);

                    let itemClass = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300';
                    if (isCorrect) {
                      itemClass = 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 font-bold text-emerald-900 dark:text-emerald-200';
                    } else if (isSelected && !isCorrect) {
                      itemClass = 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 ${itemClass}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-white/70 dark:bg-slate-700 text-[10px] font-bold flex items-center justify-center">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] font-bold shrink-0">
                          {isSelected && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                              {language === 'fr' ? 'Votre choix' : 'Your choice'}
                            </span>
                          )}
                          {isCorrect && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                              {language === 'fr' ? 'Réponse exacte' : 'Correct answer'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation text */}
                <div className="p-3 bg-teal-50/50 dark:bg-teal-950/30 rounded-xl border border-teal-100 dark:border-teal-900 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{language === 'fr' ? 'Explication de la faculté & consensus :' : 'Academic Explanation:'}</span>
                    </p>
                    <button
                      onClick={() => onAskAIExplanation(q)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{language === 'fr' ? 'Analyse IA Détaillée' : 'AI Deep Dive'}</span>
                    </button>
                  </div>
                  <p>{language === 'fr' ? q.explanationFr : q.explanationEn}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

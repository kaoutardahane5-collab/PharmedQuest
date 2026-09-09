import React, { useState, useEffect } from 'react';
import { Sparkles, X, BookOpen, Stethoscope, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { MCQQuestion, Language } from '../types';

interface AIExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: MCQQuestion | null;
  moduleTitle?: string;
  lessonTitle?: string;
  userAnswerIndexes?: number[];
  language: Language;
}

export const AIExplanationModal: React.FC<AIExplanationModalProps> = ({
  isOpen,
  onClose,
  question,
  moduleTitle,
  lessonTitle,
  userAnswerIndexes,
  language,
}) => {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string>('');
  const [source, setSource] = useState<'gemini' | 'fallback'>('gemini');

  useEffect(() => {
    if (!isOpen || !question) {
      setExplanation('');
      return;
    }

    const fetchExplanation = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/ai/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionText: language === 'fr' ? question.questionTextFr : question.questionTextEn,
            options: language === 'fr' ? question.optionsFr : question.optionsEn,
            correctOptionIndexes: question.correctOptionIndexes,
            studentAnswerIndexes: userAnswerIndexes || [],
            module: moduleTitle,
            lesson: lessonTitle,
            language,
          }),
        });

        const data = await res.json();
        setExplanation(data.explanation || '');
        setSource(data.source || 'gemini');
      } catch (err) {
        setExplanation(
          language === 'fr'
            ? 'Explication clinique universitaire : La réponse correcte est conforme aux recommandations thérapeutiques et pharmacologiques en vigueur.'
            : 'Academic explanation: The correct answer follows standard medical guidelines and pharmacology recommendations.'
        );
        setSource('fallback');
      } finally {
        setLoading(false);
      }
    };

    fetchExplanation();
  }, [isOpen, question, language, moduleTitle, lessonTitle, userAnswerIndexes]);

  if (!isOpen || !question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/40 dark:to-cyan-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>{language === 'fr' ? 'Tuteur IA PharmedQuest' : 'PharmedQuest AI Tutor'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  {source === 'gemini' ? 'Gemini 3.8 Flash' : 'Consensus Médical'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {moduleTitle || 'Module'} • {lessonTitle || 'Leçon'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question snapshot */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
          <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <p className="line-clamp-2 italic">
            "{language === 'fr' ? question.questionTextFr : question.questionTextEn}"
          </p>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-sm">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-teal-200 dark:border-teal-900 border-t-teal-600 animate-spin" />
                <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400 absolute inset-0 m-auto" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {language === 'fr' ? 'Génération de l’explication clinique...' : 'Generating clinical breakdown...'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {language === 'fr'
                    ? 'Analyse des distracteurs et règles universitaires en cours'
                    : 'Analyzing distractors and academic guidelines'}
                </p>
              </div>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-line">
              {explanation}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
            <span>
              {language === 'fr'
                ? 'Conforme aux annales de résidanat et EMD universitaires'
                : 'Aligned with residency examination topics'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            {language === 'fr' ? 'Fermer' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

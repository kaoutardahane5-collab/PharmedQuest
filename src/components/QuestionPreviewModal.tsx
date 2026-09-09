import React, { useState } from 'react';
import { X, CheckCircle, HelpCircle, BookOpen, GraduationCap, Sparkles, Send, FileEdit } from 'lucide-react';
import { MCQQuestion, SubjectModule, LessonChapter } from '../types';

interface QuestionPreviewModalProps {
  question: Partial<MCQQuestion>;
  modules: SubjectModule[];
  lessons: LessonChapter[];
  onClose: () => void;
  onPublish?: () => void;
  onSaveDraft?: () => void;
  onEdit?: () => void;
  isNewQuestion?: boolean;
}

export const QuestionPreviewModal: React.FC<QuestionPreviewModalProps> = ({
  question,
  modules,
  lessons,
  onClose,
  onPublish,
  onSaveDraft,
  onEdit,
  isNewQuestion,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'fr' | 'en'>('fr');
  const [simulatedSelected, setSimulatedSelected] = useState<number[]>([]);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);

  const matchedModule = modules.find(m => m.id === question.moduleId);
  const matchedLesson = lessons.find(l => l.id === question.lessonId);

  const questionText = selectedLanguage === 'fr' 
    ? (question.questionTextFr || question.questionTextEn || '') 
    : (question.questionTextEn || question.questionTextFr || '');

  const options = selectedLanguage === 'fr'
    ? (question.optionsFr && question.optionsFr.length > 0 ? question.optionsFr : question.optionsEn || [])
    : (question.optionsEn && question.optionsEn.length > 0 ? question.optionsEn : question.optionsFr || []);

  const explanation = selectedLanguage === 'fr'
    ? (question.explanationFr || question.explanationEn || '')
    : (question.explanationEn || question.explanationFr || '');

  const correctOptionIndexes = question.correctOptionIndexes || [0];
  const isMultiple = (question.correctOptionIndexes?.length || 1) > 1;

  const handleToggleOption = (index: number) => {
    if (hasSubmittedAnswer) return;
    if (isMultiple) {
      if (simulatedSelected.includes(index)) {
        setSimulatedSelected(simulatedSelected.filter(i => i !== index));
      } else {
        setSimulatedSelected([...simulatedSelected, index]);
      }
    } else {
      setSimulatedSelected([index]);
    }
  };

  const optionLetters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div id="question-preview-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Aperçu Réel Étudiant
            </span>
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
              <button
                onClick={() => setSelectedLanguage('fr')}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${selectedLanguage === 'fr' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                FR
              </button>
              <button
                onClick={() => setSelectedLanguage('en')}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${selectedLanguage === 'en' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                EN
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Metadata bar */}
        <div className="px-5 py-2.5 bg-slate-950/50 border-b border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium capitalize flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-teal-400" />
            {question.professionId === 'pharmacy' ? 'Pharmacie' : 'Médecine'}
          </span>
          {matchedModule && (
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-blue-400" />
              {matchedModule.titleFr}
            </span>
          )}
          {matchedLesson && (
            <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-400">
              {matchedLesson.titleFr}
            </span>
          )}
          <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
            question.difficulty === 'easy' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
            question.difficulty === 'hard' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
            'bg-amber-950 text-amber-300 border border-amber-800'
          }`}>
            {question.difficulty === 'easy' ? 'Facile' : question.difficulty === 'hard' ? 'Difficile' : 'Moyen'}
          </span>
          <span className="text-slate-500 font-mono text-[11px]">
            {question.facultySource || 'Faculté d\'Alger'} • {question.examYear || 2024}
          </span>
        </div>

        {/* Question Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Question Text */}
          <div className="bg-slate-950/60 p-4 sm:p-5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2 font-mono">
              <span>{isMultiple ? 'QCM • Réponses Multiples' : 'QCS • Réponse Unique'}</span>
              <span>Question #{question.id || 'Nouveau'}</span>
            </div>
            <p className="text-base sm:text-lg font-medium text-white leading-relaxed">
              {questionText || "Aucun énoncé saisi pour l'instant."}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isMultiple ? 'Options de réponse (Cochez les bonnes réponses)' : 'Options de réponse (Sélectionnez la bonne réponse)'}
            </div>
            {options.map((opt, idx) => {
              const isSelected = simulatedSelected.includes(idx);
              const isCorrect = correctOptionIndexes.includes(idx);

              let optionStyle = 'bg-slate-800/60 border-slate-700 text-slate-200 hover:border-slate-600';
              if (hasSubmittedAnswer) {
                if (isCorrect) {
                  optionStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-100 ring-1 ring-emerald-500';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'bg-rose-950/60 border-rose-500 text-rose-100 ring-1 ring-rose-500';
                } else {
                  optionStyle = 'bg-slate-800/30 border-slate-800 text-slate-500';
                }
              } else if (isSelected) {
                optionStyle = 'bg-teal-950/60 border-teal-500 text-white ring-1 ring-teal-500';
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleToggleOption(idx)}
                  className={`p-3 sm:p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${optionStyle}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    hasSubmittedAnswer && isCorrect
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : isSelected
                      ? 'bg-teal-500 text-slate-950'
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    {optionLetters[idx] || idx + 1}
                  </div>
                  <div className="flex-1 text-sm font-normal leading-relaxed pt-0.5">
                    {opt || <span className="text-slate-600 italic">(Option vide)</span>}
                  </div>
                  {hasSubmittedAnswer && isCorrect && (
                    <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-900/50 shrink-0">
                      Bonne Réponse
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Simulate Check Button */}
          {!hasSubmittedAnswer ? (
            <button
              onClick={() => setHasSubmittedAnswer(true)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Tester la validation de réponse comme un étudiant</span>
            </button>
          ) : (
            <div className="space-y-3">
              <div className="p-4 bg-slate-950 rounded-xl border border-teal-500/30">
                <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Explication & Rationale Clinique</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {explanation || "Aucune explication renseignée."}
                </p>
              </div>
              <button
                onClick={() => {
                  setHasSubmittedAnswer(false);
                  setSimulatedSelected([]);
                }}
                className="text-xs text-slate-400 hover:text-slate-200 underline font-medium"
              >
                Réinitialiser le test
              </button>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Modifier</span>
              </button>
            )}
            {onSaveDraft && (
              <button
                onClick={onSaveDraft}
                className="px-3 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
              >
                Enregistrer Brouillon
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-medium transition-colors"
            >
              Fermer
            </button>
            {onPublish && (
              <button
                onClick={onPublish}
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isNewQuestion ? 'Publier le QCM' : 'Enregistrer & Mettre en Ligne'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

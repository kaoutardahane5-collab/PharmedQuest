import React, { useState, useEffect } from 'react';
import { Language, MCQQuestion } from '../types';
import { translations } from '../utils/translations';
import { playChimeSound } from '../utils/audio';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Flag, 
  Slash, 
  MessageSquare, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  Send, 
  Loader2,
  HelpCircle,
  Award
} from 'lucide-react';

interface MCQQuizViewProps {
  language: Language;
  questions: MCQQuestion[];
  quizMode: 'training' | 'exam';
  lessonTitle: string;
  moduleTitle: string;
  onFinishQuiz: (results: {
    score: number;
    totalQuestions: number;
    correctCount: number;
    incorrectCount: number;
    timeSpentSeconds: number;
    answers: Record<string, number[]>;
  }) => void;
  onExitQuiz: () => void;
  onReportQuestion: (questionId: string, reason: string, suggestion: string) => void;
  onAddComment: (questionId: string, text: string) => void;
}

export const MCQQuizView: React.FC<MCQQuizViewProps> = ({
  language,
  questions,
  quizMode,
  lessonTitle,
  moduleTitle,
  onFinishQuiz,
  onExitQuiz,
  onReportQuestion,
  onAddComment,
}) => {
  const t = translations[language];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number[]>>({});
  const [strikethroughs, setStrikethroughs] = useState<Record<string, number[]>>({});
  const [strikethroughActive, setStrikethroughActive] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [isAnswerValidated, setIsAnswerValidated] = useState(false);
  
  // Timers
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  
  // AI State
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isSimplified, setIsSimplified] = useState(false);
  const [complementaryMCQ, setComplementaryMCQ] = useState<any | null>(null);

  // Modals / Panels
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSuggestion, setReportSuggestion] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');

  const currentQ = questions[currentIndex];
  const total = questions.length;

  // Timer counter
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Current selections
  const currentSelections = selectedAnswers[currentQ?.id] || [];
  const currentStrikes = strikethroughs[currentQ?.id] || [];

  // Toggle option selection
  const handleSelectOption = (idx: number) => {
    if (strikethroughActive) {
      // In strikethrough mode, toggle strike
      setStrikethroughs((prev) => {
        const current = prev[currentQ.id] || [];
        const updated = current.includes(idx)
          ? current.filter((i) => i !== idx)
          : [...current, idx];
        return { ...prev, [currentQ.id]: updated };
      });
      return;
    }

    if (quizMode === 'training' && isAnswerValidated) {
      return; // Locked after validation in training mode
    }

    setSelectedAnswers((prev) => {
      if (currentQ.isMultipleChoice) {
        const current = prev[currentQ.id] || [];
        const updated = current.includes(idx)
          ? current.filter((i) => i !== idx)
          : [...current, idx];
        return { ...prev, [currentQ.id]: updated };
      } else {
        return { ...prev, [currentQ.id]: [idx] };
      }
    });
  };

  // Toggle flag
  const toggleFlag = () => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }));
  };

  // Validate answer in training mode
  const handleValidate = () => {
    setIsAnswerValidated(true);
    const correct = currentQ.correctOptionIndexes;
    const student = selectedAnswers[currentQ.id] || [];
    const isCorrect =
      correct.length === student.length &&
      correct.every((val) => student.includes(val));

    if (isCorrect) {
      playChimeSound('success');
    }
  };

  // Go to next question or finish
  const handleNext = () => {
    setAiExplanation(null);
    setIsSimplified(false);
    setComplementaryMCQ(null);
    setIsAnswerValidated(false);

    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleCompleteQuiz();
    }
  };

  // Finalize and calculate score
  const handleCompleteQuiz = () => {
    let correctCount = 0;
    let incorrectCount = 0;

    questions.forEach((q) => {
      const student = selectedAnswers[q.id] || [];
      const correct = q.correctOptionIndexes;
      const isMatch =
        correct.length === student.length &&
        correct.every((val) => student.includes(val));

      if (isMatch) {
        correctCount += 1;
      } else {
        incorrectCount += 1;
      }
    });

    const score = Math.round((correctCount / total) * 100);

    playChimeSound('complete');

    onFinishQuiz({
      score,
      totalQuestions: total,
      correctCount,
      incorrectCount,
      timeSpentSeconds: secondsElapsed,
      answers: selectedAnswers,
    });
  };

  // Request AI Explanation
  const handleAskAIExplanation = async (simplify: boolean = false) => {
    setIsAILoading(true);
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: language === 'fr' ? currentQ.questionTextFr : currentQ.questionTextEn,
          options: language === 'fr' ? currentQ.optionsFr : currentQ.optionsEn,
          correctOptionIndexes: currentQ.correctOptionIndexes,
          studentAnswerIndexes: selectedAnswers[currentQ.id] || [],
          module: moduleTitle,
          lesson: lessonTitle,
          language,
        }),
      });
      const data = await res.json();
      setAiExplanation(data.explanation || currentQ.explanationFr);
      setIsSimplified(simplify);
    } catch {
      setAiExplanation(language === 'fr' ? currentQ.explanationFr : currentQ.explanationEn);
    } finally {
      setIsAILoading(false);
    }
  };

  // Request complementary AI question
  const handleGenerateComplementaryMCQ = async () => {
    setIsAILoading(true);
    try {
      const res = await fetch('/api/ai/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: moduleTitle,
          lesson: lessonTitle,
          language,
        }),
      });
      const data = await res.json();
      setComplementaryMCQ(data);
    } catch {
      // Fallback
      setComplementaryMCQ({
        question:
          language === 'fr'
            ? 'Question complémentaire : Quel est le principal paramètre pharmacocinétique mesurant la vitesse d élimination d un principe actif ?'
            : 'Complementary Question: Which main pharmacokinetic parameter measures the rate of drug elimination?',
        options:
          language === 'fr'
            ? ['La clairance totale', 'Le volume de distribution', 'La biodisponibilité', 'Le Cmax', 'La fixation aux protéines']
            : ['Total clearance', 'Volume of distribution', 'Bioavailability', 'Cmax', 'Protein binding'],
        correctIndexes: [0],
        explanation:
          language === 'fr'
            ? 'La clairance (Cl) représente le volume de plasma totalement épuré d un médicament par unité de temps.'
            : 'Clearance represents the volume of plasma cleared of drug per unit time.',
      });
    } finally {
      setIsAILoading(false);
    }
  };

  // Submit error report
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    onReportQuestion(currentQ.id, reportReason, reportSuggestion);
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setShowReportModal(false);
      setReportReason('');
      setReportSuggestion('');
    }, 1500);
  };

  // Submit comment
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(currentQ.id, newCommentText);
    setNewCommentText('');
  };

  if (!currentQ) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Aucune question disponible.</p>
        <button onClick={onExitQuiz} className="mt-4 text-teal-600 font-bold">Retour</button>
      </div>
    );
  }

  const isFlagged = flaggedQuestions[currentQ.id];
  const questionText = language === 'fr' ? currentQ.questionTextFr : currentQ.questionTextEn;
  const options = language === 'fr' ? currentQ.optionsFr : currentQ.optionsEn;

  return (
    <div className="py-6 px-4 sm:px-6 max-w-4xl mx-auto space-y-6">
      {/* Quiz Top Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onExitQuiz}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Quitter"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-400 tracking-wider">
              {moduleTitle} • {lessonTitle}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {t.question} {currentIndex + 1} {t.of} {total}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                {currentQ.isMultipleChoice ? t.multipleChoiceNotice : t.singleChoiceNotice}
              </span>
            </div>
          </div>
        </div>

        {/* Controls: Timer, Strikethrough, Flag, Comments */}
        <div className="flex items-center gap-2">
          {/* Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>{formatTime(secondsElapsed)}</span>
          </div>

          {/* Strikethrough Tool Toggle */}
          <button
            onClick={() => setStrikethroughActive(!strikethroughActive)}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              strikethroughActive
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 ring-2 ring-rose-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
            title={t.strikethrough}
          >
            <Slash className="w-4 h-4" />
          </button>

          {/* Flag question */}
          <button
            onClick={toggleFlag}
            className={`p-2 rounded-xl text-xs font-semibold transition-all ${
              isFlagged
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
            title={isFlagged ? t.flagged : t.flagQuestion}
          >
            <Flag className={`w-4 h-4 ${isFlagged ? 'fill-current' : ''}`} />
          </button>

          {/* Report incorrect question */}
          <button
            onClick={() => setShowReportModal(true)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            title={t.reportQuestion}
          >
            <AlertTriangle className="w-4 h-4" />
          </button>

          {/* Comments */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors relative"
            title={t.commentQuestion}
          >
            <MessageSquare className="w-4 h-4" />
            {currentQ.comments?.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {currentQ.comments.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-teal-600 to-cyan-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Source Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800">
            <Award className="w-3.5 h-3.5 text-teal-600" />
            <span>{currentQ.facultySource}</span>
          </span>

          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {t.difficulty} : {currentQ.difficulty === 'easy' ? t.easy : currentQ.difficulty === 'medium' ? t.medium : t.hard}
          </span>
        </div>

        {/* Question Statement */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
          {questionText}
        </h3>

        {/* Options List */}
        <div className="space-y-3">
          {options.map((opt, idx) => {
            const isSelected = currentSelections.includes(idx);
            const isStruck = currentStrikes.includes(idx);
            const isCorrect = currentQ.correctOptionIndexes.includes(idx);

            // Coloring when validated in training mode
            let optionStyles = 'border-slate-200 dark:border-slate-800 hover:border-teal-500/50';
            let letterStyles = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';

            if (quizMode === 'training' && isAnswerValidated) {
              if (isCorrect) {
                optionStyles = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/40 text-emerald-950 dark:text-emerald-200';
                letterStyles = 'bg-emerald-600 text-white';
              } else if (isSelected && !isCorrect) {
                optionStyles = 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 ring-2 ring-rose-500/40 text-rose-950 dark:text-rose-200';
                letterStyles = 'bg-rose-600 text-white';
              }
            } else if (isSelected) {
              optionStyles = 'border-teal-600 bg-teal-50/60 dark:bg-teal-950/40 ring-2 ring-teal-600/30 text-teal-950 dark:text-teal-200';
              letterStyles = 'bg-teal-700 text-white font-bold';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 group relative ${optionStyles} ${
                  isStruck ? 'opacity-40 line-through' : ''
                }`}
              >
                <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${letterStyles}`}>
                  {String.fromCharCode(65 + idx)}
                </span>

                <span className="text-sm font-medium leading-normal flex-1">
                  {opt}
                </span>

                {quizMode === 'training' && isAnswerValidated && (
                  <div className="shrink-0 mt-0.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Validation or Next Action */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {strikethroughActive && (
              <span className="text-rose-600 dark:text-rose-400 font-semibold">
                {language === 'fr' ? 'Mode rayage actif : cliquez sur une option pour l éliminer visuellement.' : 'Strike-through mode active.'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {quizMode === 'training' && !isAnswerValidated ? (
              <button
                onClick={handleValidate}
                disabled={currentSelections.length === 0}
                className="bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all"
              >
                {t.validateAnswer}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={quizMode === 'exam' && currentSelections.length === 0}
                className="bg-gradient-to-r from-teal-700 to-cyan-600 hover:from-teal-800 hover:to-cyan-700 disabled:opacity-40 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-1.5 transition-all"
              >
                <span>{currentIndex === total - 1 ? t.finishQuiz : t.nextQuestion}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* AI Learning Assistant Section (In Training mode after validation or anytime user taps) */}
        {(isAnswerValidated || quizMode === 'training') && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => handleAskAIExplanation(false)}
                disabled={isAILoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600/10 via-cyan-600/10 to-teal-600/10 border border-teal-500/30 text-teal-800 dark:text-teal-300 font-bold text-xs hover:bg-teal-500/20 transition-all shadow-xs"
              >
                {isAILoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-500" />
                )}
                <span>{t.aiExplanationButton}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAskAIExplanation(true)}
                  disabled={isAILoading}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {t.simplifyConceptButton}
                </button>
                <button
                  onClick={handleGenerateComplementaryMCQ}
                  disabled={isAILoading}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {t.generateComplementaryQuestion}
                </button>
              </div>
            </div>

            {/* AI Explanation Box */}
            {(aiExplanation || isAnswerValidated) && (
              <div className="p-5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-slate-800 dark:text-slate-200 space-y-2 leading-relaxed">
                <div className="flex items-center gap-2 font-bold text-teal-800 dark:text-teal-300 text-sm">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>
                    {isSimplified
                      ? (language === 'fr' ? 'Explication Simplifiée (Concept Clé)' : 'Simplified Concept')
                      : (language === 'fr' ? 'Raisonnement & Analyse Médicale' : 'Clinical Rationale')}
                  </span>
                </div>
                <div className="whitespace-pre-line text-slate-700 dark:text-slate-300 font-sans">
                  {aiExplanation || (language === 'fr' ? currentQ.explanationFr : currentQ.explanationEn)}
                </div>
              </div>
            )}

            {/* Complementary Practice MCQ */}
            {complementaryMCQ && (
              <div className="p-5 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-800 dark:text-cyan-300 text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    {language === 'fr' ? 'QCM d Entraînement Complémentaire Généré par IA' : 'Complementary Practice MCQ by AI'}
                  </span>
                  <button
                    onClick={() => setComplementaryMCQ(null)}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >
                    Fermer
                  </button>
                </div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {complementaryMCQ.question}
                </p>
                <div className="space-y-1.5">
                  {complementaryMCQ.options.map((opt: string, i: number) => (
                    <div
                      key={i}
                      className={`p-2 rounded-lg border text-xs ${
                        complementaryMCQ.correctIndexes?.includes(i)
                          ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 font-bold text-emerald-900 dark:text-emerald-200'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {String.fromCharCode(65 + i)}: {opt}
                    </div>
                  ))}
                </div>
                {complementaryMCQ.explanation && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                    💡 {complementaryMCQ.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Community Comments Drawer */}
      {showComments && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              <span>{t.commentQuestion}</span>
            </h4>
            <span className="text-xs text-slate-500">
              {currentQ.comments?.length || 0} {language === 'fr' ? 'commentaires de résidents' : 'peer comments'}
            </span>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {(!currentQ.comments || currentQ.comments.length === 0) ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic py-2">
                {language === 'fr' ? 'Aucun commentaire pour l instant. Soyez le premier à partager une astuce !' : 'No comments yet. Share the first tip!'}
              </p>
            ) : (
              currentQ.comments.map((c) => (
                <div key={c.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-700 dark:text-teal-300">{c.userName}</span>
                    <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-snug">{c.text}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handlePostComment} className="flex gap-2">
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder={language === 'fr' ? 'Partager une remarque ou un mnémonique...' : 'Share a mnemonic or clinical tip...'}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-teal-600"
            />
            <button
              type="submit"
              className="bg-teal-700 hover:bg-teal-800 text-white p-2 rounded-lg text-xs font-semibold"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Report Question Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {language === 'fr' ? 'Signaler une erreur sur ce QCM' : 'Report an Issue with this MCQ'}
                </h3>
              </div>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            {reportSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="font-bold text-sm text-slate-900 dark:text-white">
                  {language === 'fr' ? 'Signalement transmis à l administration' : 'Report submitted to administrators'}
                </p>
                <p className="text-xs text-slate-500">
                  {language === 'fr' ? 'Notre comité médical révisera la question rapidement.' : 'Our medical board will review the question.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'fr' ? 'Motif du signalement' : 'Reason for report'}
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs"
                  >
                    <option value="">{language === 'fr' ? '-- Choisissez un motif --' : '-- Select reason --'}</option>
                    <option value="Mauvaise correction">Mauvaise réponse indiquée comme exacte</option>
                    <option value="Faute de frappe ou énoncé ambigu">Énoncé ambigu ou faute de frappe</option>
                    <option value="Mise à jour des consensus">Consensus médical obsolète / mis à jour</option>
                    <option value="Autre">Autre remarque</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'fr' ? 'Correction ou source suggérée' : 'Suggested correction / reference'}
                  </label>
                  <textarea
                    value={reportSuggestion}
                    onChange={(e) => setReportSuggestion(e.target.value)}
                    rows={3}
                    placeholder={language === 'fr' ? 'Ex : Selon les recos ESC 2023, la bonne réponse est B car...' : 'E.g., According to ESC 2023 guidelines...'}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg"
                  >
                    Envoyer le signalement
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

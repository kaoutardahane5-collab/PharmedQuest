import React, { useState, useEffect } from 'react';
import { 
  Language, 
  Profession, 
  AcademicYear, 
  SubjectModule, 
  LessonChapter, 
  MCQQuestion 
} from '../types';
import { 
  X, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Check, 
  HelpCircle,
  Building2,
  Calendar,
  Layers,
  FileQuestion,
  Trash2,
  Plus
} from 'lucide-react';

interface NewQCMModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  professions: Profession[];
  academicYears: AcademicYear[];
  modules: SubjectModule[];
  lessons: LessonChapter[];
  initialProfessionId?: string;
  initialYearId?: string;
  initialModuleId?: string;
  initialLessonId?: string;
  onSaveQuestion: (question: Partial<MCQQuestion>) => Promise<void>;
}

export const NewQCMModal: React.FC<NewQCMModalProps> = ({
  isOpen,
  onClose,
  language,
  professions,
  academicYears,
  modules,
  lessons,
  initialProfessionId,
  initialYearId,
  initialModuleId,
  initialLessonId,
  onSaveQuestion,
}) => {
  // Form State
  const [profession, setProfession] = useState<'pharmacy' | 'medicine'>('pharmacy');
  const [academicYearId, setAcademicYearId] = useState<string>('');
  const [moduleId, setModuleId] = useState<string>('');
  const [lessonId, setLessonId] = useState<string>('');

  const [facultySource, setFacultySource] = useState<string>(
    "Faculté de Médecine et Pharmacie d'Alger - EMD & Résidanat"
  );
  const [examYear, setExamYear] = useState<number>(2024);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isMultipleChoice, setIsMultipleChoice] = useState<boolean>(false);

  const [questionTextFr, setQuestionTextFr] = useState<string>('');
  const [questionTextEn, setQuestionTextEn] = useState<string>('');

  const [options, setOptions] = useState<string[]>([
    '',
    '',
    '',
    '',
    ''
  ]);
  const [correctOptionIndexes, setCorrectOptionIndexes] = useState<number[]>([0]);

  const [explanationFr, setExplanationFr] = useState<string>('');
  const [explanationEn, setExplanationEn] = useState<string>('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize or synchronize selections when opened
  useEffect(() => {
    if (!isOpen) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    const initialProf = (initialProfessionId === 'medicine' || initialProfessionId === 'pharmacy')
      ? initialProfessionId
      : 'pharmacy';
    setProfession(initialProf);

    const validYears = academicYears.filter(y => y.professionId === initialProf);
    const targetYear = (initialYearId && validYears.some(y => y.id === initialYearId))
      ? initialYearId
      : validYears[0]?.id || '';
    setAcademicYearId(targetYear);

    const validMods = modules.filter(m => m.professionId === initialProf && m.academicYearId === targetYear);
    const targetMod = (initialModuleId && validMods.some(m => m.id === initialModuleId))
      ? initialModuleId
      : validMods[0]?.id || '';
    setModuleId(targetMod);

    const validLessons = lessons.filter(l => l.moduleId === targetMod);
    const targetLesson = (initialLessonId && validLessons.some(l => l.id === initialLessonId))
      ? initialLessonId
      : validLessons[0]?.id || '';
    setLessonId(targetLesson);
  }, [isOpen, initialProfessionId, initialYearId, initialModuleId, initialLessonId, academicYears, modules, lessons]);

  // When profession changes, cascade down
  const handleProfessionChange = (newProf: 'pharmacy' | 'medicine') => {
    setProfession(newProf);
    const matchingYears = academicYears.filter(y => y.professionId === newProf);
    const firstYear = matchingYears[0]?.id || '';
    setAcademicYearId(firstYear);

    const matchingMods = modules.filter(m => m.professionId === newProf && m.academicYearId === firstYear);
    const firstMod = matchingMods[0]?.id || '';
    setModuleId(firstMod);

    const matchingLessons = lessons.filter(l => l.moduleId === firstMod);
    setLessonId(matchingLessons[0]?.id || '');
  };

  // When year changes, cascade down
  const handleYearChange = (newYearId: string) => {
    setAcademicYearId(newYearId);
    const matchingMods = modules.filter(m => m.professionId === profession && m.academicYearId === newYearId);
    const firstMod = matchingMods[0]?.id || '';
    setModuleId(firstMod);

    const matchingLessons = lessons.filter(l => l.moduleId === firstMod);
    setLessonId(matchingLessons[0]?.id || '');
  };

  // When module changes, cascade to lesson
  const handleModuleChange = (newModId: string) => {
    setModuleId(newModId);
    const matchingLessons = lessons.filter(l => l.moduleId === newModId);
    setLessonId(matchingLessons[0]?.id || '');
  };

  // Toggle correct option
  const toggleCorrectOption = (index: number) => {
    if (isMultipleChoice) {
      if (correctOptionIndexes.includes(index)) {
        if (correctOptionIndexes.length > 1) {
          setCorrectOptionIndexes(correctOptionIndexes.filter(i => i !== index));
        }
      } else {
        setCorrectOptionIndexes([...correctOptionIndexes, index].sort((a, b) => a - b));
      }
    } else {
      setCorrectOptionIndexes([index]);
    }
  };

  const handleOptionChange = (idx: number, val: string) => {
    const updated = [...options];
    updated[idx] = val;
    setOptions(updated);
  };

  const handleAddOption = () => {
    if (options.length < 8) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (idx: number) => {
    if (options.length <= 2) return;
    const updated = options.filter((_, i) => i !== idx);
    setOptions(updated);
    setCorrectOptionIndexes(
      correctOptionIndexes
        .filter(i => i !== idx)
        .map(i => (i > idx ? i - 1 : i))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!questionTextFr.trim()) {
      setErrorMsg(language === 'fr' ? "Veuillez saisir l'énoncé du QCM." : "Please enter the question statement.");
      return;
    }

    const cleanOptions = options.map(o => o.trim()).filter(Boolean);
    if (cleanOptions.length < 2) {
      setErrorMsg(language === 'fr' ? "Veuillez saisir au moins 2 options de réponse non-vides." : "Please enter at least 2 non-empty options.");
      return;
    }

    if (correctOptionIndexes.length === 0) {
      setErrorMsg(language === 'fr' ? "Veuillez cocher au moins une bonne réponse (A, B, C, D ou E)." : "Please select at least one correct option.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Partial<MCQQuestion> = {
        professionId: profession,
        academicYearId,
        moduleId,
        lessonId,
        facultySource: facultySource.trim() || "Faculté de Médecine et Pharmacie d'Alger",
        examYear: Number(examYear) || 2024,
        questionTextFr: questionTextFr.trim(),
        questionTextEn: questionTextEn.trim() || undefined,
        optionsFr: cleanOptions,
        optionsEn: cleanOptions,
        correctOptionIndexes: correctOptionIndexes.filter(i => i < cleanOptions.length),
        isMultipleChoice,
        explanationFr: explanationFr.trim() || "Aucune explication fournie pour cette question.",
        explanationEn: explanationEn.trim() || undefined,
        difficulty,
        isDraft: false,
        isDeleted: false,
        comments: [],
      };

      await onSaveQuestion(payload);

      setSuccessMsg(
        language === 'fr' 
          ? "🎉 QCM ajouté avec succès ! Il est désormais disponible dans vos entraînements et concours." 
          : "🎉 MCQ successfully created and added to the question bank!"
      );

      // Reset text inputs for next quick addition
      setQuestionTextFr('');
      setQuestionTextEn('');
      setOptions(['', '', '', '', '']);
      setCorrectOptionIndexes([0]);
      setExplanationFr('');
      setExplanationEn('');

      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || (language === 'fr' ? "Erreur lors de l'enregistrement du QCM." : "Failed to save question."));
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currentAvailableYears = academicYears.filter(y => y.professionId === profession);
  const currentAvailableModules = modules.filter(m => m.professionId === profession && m.academicYearId === academicYearId);
  const currentAvailableLessons = lessons.filter(l => l.moduleId === moduleId);

  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-teal-950/50 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{language === 'fr' ? 'Rédiger un Nouveau QCM' : 'Add a New MCQ Question'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                  {language === 'fr' ? 'Banque de questions' : 'Question Bank'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'fr' 
                  ? 'Associez ce QCM à la discipline, au module et au cours universitaire correspondant.' 
                  : 'Link this MCQ to the correct profession, module, and university lecture.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Notifications */}
          {errorMsg && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-200 rounded-xl text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-teal-950/70 border border-teal-700 text-teal-200 rounded-xl text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Section 1: Pedagogical Hierarchy (Discipline, Year, Module, Lesson) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? '1. Emplacement Pédagogique' : '1. Pedagogical Location'}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Profession */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {language === 'fr' ? 'Discipline' : 'Profession'}
                </label>
                <select
                  value={profession}
                  onChange={(e) => handleProfessionChange(e.target.value as 'pharmacy' | 'medicine')}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500 transition-colors"
                >
                  <option value="pharmacy">💊 Pharmacie</option>
                  <option value="medicine">🩺 Médecine</option>
                </select>
              </div>

              {/* Academic Year */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {language === 'fr' ? 'Année d\'études' : 'Academic Year'}
                </label>
                <select
                  value={academicYearId}
                  onChange={(e) => handleYearChange(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500 transition-colors"
                >
                  {currentAvailableYears.map(y => (
                    <option key={y.id} value={y.id}>
                      {language === 'fr' ? y.labelFr : y.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Module */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {language === 'fr' ? 'Module / Matière' : 'Module / Subject'}
                </label>
                <select
                  value={moduleId}
                  onChange={(e) => handleModuleChange(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500 transition-colors"
                >
                  {currentAvailableModules.map(m => (
                    <option key={m.id} value={m.id}>
                      {language === 'fr' ? m.titleFr : m.titleEn}
                    </option>
                  ))}
                  {currentAvailableModules.length === 0 && (
                    <option value="">{language === 'fr' ? 'Aucun module trouvé' : 'No module found'}</option>
                  )}
                </select>
              </div>

              {/* Lesson */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {language === 'fr' ? 'Cours / Chapitre' : 'Lecture / Chapter'}
                </label>
                <select
                  value={lessonId}
                  onChange={(e) => setLessonId(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500 transition-colors"
                >
                  {currentAvailableLessons.map(l => (
                    <option key={l.id} value={l.id}>
                      {language === 'fr' ? l.titleFr : l.titleEn}
                    </option>
                  ))}
                  {currentAvailableLessons.length === 0 && (
                    <option value="">{language === 'fr' ? 'Aucun cours trouvé' : 'No lecture found'}</option>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Question Meta & Examination Origin */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? '2. Origine & Caractéristiques' : '2. Origin & Characteristics'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {language === 'fr' ? 'Faculté / Épreuve Source' : 'Faculty / Exam Source'}
                </label>
                <input
                  type="text"
                  value={facultySource}
                  onChange={(e) => setFacultySource(e.target.value)}
                  placeholder="ex: Faculté d'Alger - Résidanat"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {language === 'fr' ? 'Année du Concours / Examen' : 'Exam Year'}
                </label>
                <input
                  type="number"
                  min={1990}
                  max={2030}
                  value={examYear}
                  onChange={(e) => setExamYear(parseInt(e.target.value) || 2024)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {language === 'fr' ? 'Niveau de Difficulté' : 'Difficulty Level'}
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500 transition-colors"
                >
                  <option value="easy">{language === 'fr' ? '🟢 Facile (Notions de base)' : '🟢 Easy'}</option>
                  <option value="medium">{language === 'fr' ? '🟡 Moyen (Standard Résidanat)' : '🟡 Medium'}</option>
                  <option value="hard">{language === 'fr' ? '🔴 Difficile (Pièges & Cas complexes)' : '🔴 Hard'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Question Statement */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
                <FileQuestion className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? '3. Énoncé du QCM' : '3. Question Statement'}</span>
              </div>

              {/* Single vs Multiple choice toggle */}
              <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400">
                  {language === 'fr' ? 'Type :' : 'Type :'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsMultipleChoice(false);
                    if (correctOptionIndexes.length > 1) {
                      setCorrectOptionIndexes([correctOptionIndexes[0]]);
                    }
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                    !isMultipleChoice 
                      ? 'bg-teal-600 text-white shadow-xs' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {language === 'fr' ? 'Choix Unique (QCS)' : 'Single Choice'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsMultipleChoice(true)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                    isMultipleChoice 
                      ? 'bg-teal-600 text-white shadow-xs' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {language === 'fr' ? 'Choix Multiple (QCM)' : 'Multiple Choice'}
                </button>
              </div>
            </div>

            <div>
              <textarea
                value={questionTextFr}
                onChange={(e) => setQuestionTextFr(e.target.value)}
                placeholder={
                  language === 'fr'
                    ? "Rédigez ici l'énoncé complet du QCM..."
                    : "Enter the complete question prompt here..."
                }
                rows={3}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500 transition-colors placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Section 4: Options with selection checkboxes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
                <Check className="w-3.5 h-3.5" />
                <span>
                  {language === 'fr' 
                    ? '4. Options de Réponse & Corrigé' 
                    : '4. Answer Options & Answer Key'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                {language === 'fr' 
                  ? 'Cliquez sur la lettre pour cocher la bonne réponse' 
                  : 'Click option letter to mark as correct'}
              </span>
            </div>

            <div className="space-y-2.5">
              {options.map((opt, idx) => {
                const isCorrect = correctOptionIndexes.includes(idx);
                const letter = optionLetters[idx] || String(idx + 1);

                return (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all ${
                      isCorrect 
                        ? 'bg-emerald-950/40 border-emerald-600/80 ring-1 ring-emerald-500/30' 
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    {/* Correct Toggle Button */}
                    <button
                      type="button"
                      onClick={() => toggleCorrectOption(idx)}
                      title={isCorrect ? 'Réponse exacte cochée' : 'Marquer comme réponse exacte'}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                        isCorrect
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {letter}
                    </button>

                    {/* Option Text Input */}
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Proposition ${letter}...`}
                      className="flex-1 bg-transparent border-none text-white text-xs sm:text-sm focus:outline-none placeholder:text-slate-600 px-2"
                    />

                    {/* Status Badge */}
                    {isCorrect && (
                      <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 hidden sm:inline">
                        {language === 'fr' ? 'VRAI' : 'CORRECT'}
                      </span>
                    )}

                    {/* Remove option button (if > 2) */}
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Supprimer cette option"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Option Button */}
            {options.length < 8 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="mt-1 text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? '+ Ajouter une proposition' : '+ Add an option'}</span>
              </button>
            )}
          </div>

          {/* Section 5: Detailed Medical Explanation */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? '5. Explication Médicale & Justification' : '5. Detailed Explanation'}</span>
            </div>

            <textarea
              value={explanationFr}
              onChange={(e) => setExplanationFr(e.target.value)}
              placeholder={
                language === 'fr'
                  ? "Détaillez le mécanisme physiopathologique, pharmacologique ou clinique justifiant la réponse..."
                  : "Provide clinical and pharmacological reasoning for the correct answer..."
              }
              rows={3}
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500 transition-colors placeholder:text-slate-500"
            />
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-all"
            >
              {language === 'fr' ? 'Annuler' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-teal-500/20 active:scale-[0.99] transition-all flex items-center gap-2 text-xs sm:text-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>{language === 'fr' ? 'Enregistrement en cours...' : 'Saving question...'}</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{language === 'fr' ? 'Enregistrer & Intégrer le QCM' : 'Save & Publish MCQ'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

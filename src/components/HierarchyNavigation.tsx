import React from 'react';
import { 
  Language, 
  Profession, 
  AcademicYear, 
  SubjectModule, 
  LessonChapter 
} from '../types';
import { translations } from '../utils/translations';
import { 
  Pill, 
  Stethoscope, 
  ChevronRight, 
  Check, 
  Lock, 
  BookOpen, 
  Sparkles, 
  DownloadCloud, 
  Play, 
  Clock, 
  HelpCircle,
  RotateCcw,
  PlusCircle
} from 'lucide-react';

interface HierarchyNavigationProps {
  language: Language;
  professions: Profession[];
  academicYears: AcademicYear[];
  modules: SubjectModule[];
  lessons: LessonChapter[];
  selectedProfession: Profession | null;
  selectedYear: AcademicYear | null;
  selectedModule: SubjectModule | null;
  selectedLesson: LessonChapter | null;
  quizMode: 'training' | 'exam';
  onSelectProfession: (p: Profession) => void;
  onSelectYear: (y: AcademicYear) => void;
  onSelectModule: (m: SubjectModule) => void;
  onSelectLesson: (l: LessonChapter) => void;
  onSetQuizMode: (mode: 'training' | 'exam') => void;
  onStartQuiz: () => void;
  onResetToStep: (step: 'profession' | 'year' | 'module' | 'lesson') => void;
  onDownloadLesson: (lessonId: string) => void;
  onOpenNewQCM?: () => void;
}

export const HierarchyNavigation: React.FC<HierarchyNavigationProps> = ({
  language,
  professions,
  academicYears,
  modules,
  lessons,
  selectedProfession,
  selectedYear,
  selectedModule,
  selectedLesson,
  quizMode,
  onSelectProfession,
  onSelectYear,
  onSelectModule,
  onSelectLesson,
  onSetQuizMode,
  onStartQuiz,
  onResetToStep,
  onDownloadLesson,
  onOpenNewQCM,
}) => {
  const t = translations[language];

  // Filter years according strictly to selected profession
  const availableYears = academicYears.filter(
    (y) => selectedProfession && y.professionId === selectedProfession.id
  );

  // Filter modules according strictly to selected academic year
  const availableModules = modules.filter(
    (m) => selectedYear && m.academicYearId === selectedYear.id
  );

  // Filter lessons according strictly to selected module
  const availableLessons = lessons.filter(
    (l) => selectedModule && l.moduleId === selectedModule.id
  );

  // Determine current active step
  const currentStep = !selectedProfession
    ? 1
    : !selectedYear
    ? 2
    : !selectedModule
    ? 3
    : !selectedLesson
    ? 4
    : 5;

  return (
    <div className="py-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Strict Hierarchy Stepper Indicator */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {/* Step 1: Profession */}
          <button
            onClick={() => onResetToStep('profession')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedProfession
                ? 'bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 hover:bg-teal-100'
                : currentStep === 1
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-current">
              {selectedProfession ? <Check className="w-3 h-3" /> : '1'}
            </span>
            <span>{selectedProfession ? (language === 'fr' ? selectedProfession.nameFr : selectedProfession.nameEn) : t.stepProfession}</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 shrink-0" />

          {/* Step 2: Academic Year */}
          <button
            onClick={() => selectedProfession && onResetToStep('year')}
            disabled={!selectedProfession}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedYear
                ? 'bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 hover:bg-teal-100'
                : currentStep === 2
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 dark:text-slate-500 disabled:opacity-40'
            }`}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-current">
              {selectedYear ? <Check className="w-3 h-3" /> : !selectedProfession ? <Lock className="w-2.5 h-2.5" /> : '2'}
            </span>
            <span>{selectedYear ? (language === 'fr' ? selectedYear.labelFr : selectedYear.labelEn) : t.stepYear}</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 shrink-0" />

          {/* Step 3: Module */}
          <button
            onClick={() => selectedYear && onResetToStep('module')}
            disabled={!selectedYear}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedModule
                ? 'bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 hover:bg-teal-100'
                : currentStep === 3
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 dark:text-slate-500 disabled:opacity-40'
            }`}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-current">
              {selectedModule ? <Check className="w-3 h-3" /> : !selectedYear ? <Lock className="w-2.5 h-2.5" /> : '3'}
            </span>
            <span>{selectedModule ? (language === 'fr' ? selectedModule.titleFr : selectedModule.titleEn) : t.stepModule}</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 shrink-0" />

          {/* Step 4: Lesson */}
          <button
            onClick={() => selectedModule && onResetToStep('lesson')}
            disabled={!selectedModule}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedLesson
                ? 'bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 hover:bg-teal-100'
                : currentStep === 4
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 dark:text-slate-500 disabled:opacity-40'
            }`}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-current">
              {selectedLesson ? <Check className="w-3 h-3" /> : !selectedModule ? <Lock className="w-2.5 h-2.5" /> : '4'}
            </span>
            <span className="truncate max-w-[140px] sm:max-w-none">
              {selectedLesson ? (language === 'fr' ? selectedLesson.titleFr : selectedLesson.titleEn) : t.stepLesson}
            </span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 shrink-0" />

          {/* Step 5: Start Quiz */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              currentStep === 5
                ? 'bg-amber-600 text-white shadow-sm animate-pulse'
                : 'text-slate-400 dark:text-slate-500 opacity-40'
            }`}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-current">
              {currentStep === 5 ? <Play className="w-3 h-3 fill-current" /> : <Lock className="w-2.5 h-2.5" />}
            </span>
            <span>{t.stepQuiz}</span>
          </div>
        </div>
      </div>

      {/* CASE POUR AJOUTER UN NOUVEAU QCM */}
      {onOpenNewQCM && (
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-teal-500/40 bg-gradient-to-r from-slate-900/95 via-teal-950/40 to-slate-900/95 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-teal-400">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 shrink-0">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {language === 'fr' ? 'Case de Rédaction : Ajouter un Nouveau QCM' : 'Case: Add a New MCQ Question'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  {language === 'fr' ? '+ Nouveau QCM' : '+ New MCQ'}
                </span>
              </div>
              <p className="text-xs text-slate-300 dark:text-slate-400 mt-0.5 max-w-2xl">
                {language === 'fr' 
                  ? "Vous disposez d'un nouveau QCM d'examen ou d'annales de résidanat ? Cliquez sur cette case pour saisir l'énoncé, les propositions A-B-C-D-E et le corrigé officiel." 
                  : 'Have an official exam or residency question? Click this box to input the statement, choices, and detailed answer key.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenNewQCM}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-teal-500/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'fr' ? 'Ajouter un QCM' : 'Add MCQ'}</span>
          </button>
        </div>
      )}

      {/* STEP 1: Select Profession */}
      {currentStep === 1 && (
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t.chooseProfessionTitle}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t.chooseProfessionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {professions.map((prof) => (
              <button
                key={prof.id}
                onClick={() => onSelectProfession(prof)}
                className="group text-left glass-panel p-6 sm:p-8 rounded-2xl border-2 border-transparent hover:border-teal-500/50 dark:hover:border-teal-400/50 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {prof.id === 'pharmacy' ? (
                      <Pill className="w-8 h-8" />
                    ) : (
                      <Stethoscope className="w-8 h-8" />
                    )}
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {prof.totalYears} {language === 'fr' ? 'Années de formation' : 'Academic Years'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {language === 'fr' ? prof.nameFr : prof.nameEn}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                  {language === 'fr' ? prof.subtitleFr : prof.subtitleEn}
                </p>

                <div className="flex items-center text-xs font-bold text-teal-700 dark:text-teal-400 group-hover:translate-x-1 transition-transform">
                  <span>{language === 'fr' ? 'Choisir cette filière' : 'Select field of study'}</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* STEP 2: Select Academic Year */}
      {currentStep === 2 && selectedProfession && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t.chooseYearTitle}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {selectedProfession.id === 'pharmacy' ? 'Pharmacie' : 'Médecine'} • {t.chooseYearSubtitle}
              </p>
            </div>
            <button
              onClick={() => onResetToStep('profession')}
              className="flex items-center gap-1 text-xs text-teal-700 dark:text-teal-400 font-semibold hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.backStep}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableYears.map((year) => (
              <button
                key={year.id}
                onClick={() => onSelectYear(year)}
                className="group text-left glass-panel p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 shadow-xs hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-extrabold text-sm flex items-center justify-center">
                    {year.yearNumber}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {year.modulesCount} {language === 'fr' ? 'Modules' : 'Subjects'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-teal-600 transition-colors">
                  {language === 'fr' ? year.labelFr : year.labelEn}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {language === 'fr' ? year.descriptionFr : year.descriptionEn}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* STEP 3: Select Subject / Module */}
      {currentStep === 3 && selectedYear && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t.chooseModuleTitle}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {language === 'fr' ? selectedYear.labelFr : selectedYear.labelEn} • {t.chooseModuleSubtitle}
              </p>
            </div>
            <button
              onClick={() => onResetToStep('year')}
              className="flex items-center gap-1 text-xs text-teal-700 dark:text-teal-400 font-semibold hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.backStep}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {availableModules.map((module) => (
              <button
                key={module.id}
                onClick={() => onSelectModule(module)}
                className="group text-left glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {module.code}
                    </span>
                    {module.isPopular && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Résidanat Top</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-teal-600 transition-colors">
                    {language === 'fr' ? module.titleFr : module.titleEn}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                    {language === 'fr' ? module.descriptionFr : module.descriptionEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{module.lessonsCount} {language === 'fr' ? 'Chapitres' : 'Lessons'}</span>
                  <span className="font-semibold text-teal-700 dark:text-teal-400 flex items-center">
                    {module.questionCount} QCMs
                    <ChevronRight className="w-4 h-4 ml-0.5" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* STEP 4: Select Lesson / Chapter */}
      {currentStep === 4 && selectedModule && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t.chooseLessonTitle}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {language === 'fr' ? selectedModule.titleFr : selectedModule.titleEn} • {t.chooseLessonSubtitle}
              </p>
            </div>
            <button
              onClick={() => onResetToStep('module')}
              className="flex items-center gap-1 text-xs text-teal-700 dark:text-teal-400 font-semibold hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.backStep}</span>
            </button>
          </div>

          <div className="space-y-3">
            {availableLessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="glass-panel p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                      {language === 'fr' ? lesson.titleFr : lesson.titleEn}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{lesson.questionCount} QCMs de concours</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>~{lesson.estimatedMinutes} min</span>
                      </span>
                      <span>•</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownloadLesson(lesson.id);
                        }}
                        className="flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:underline"
                      >
                        <DownloadCloud className="w-3.5 h-3.5" />
                        <span>{lesson.isDownloaded ? (language === 'fr' ? 'Téléchargé (Hors-ligne)' : 'Downloaded') : `${language === 'fr' ? 'Télécharger' : 'Download'} (${lesson.downloadSize})`}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectLesson(lesson)}
                  className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs hover:shadow-md flex items-center justify-center gap-1.5 transition-all shrink-0"
                >
                  <span>{language === 'fr' ? 'Sélectionner ce cours' : 'Select Lesson'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STEP 5: Ready to Start Quiz */}
      {currentStep === 5 && selectedLesson && (
        <section className="glass-panel p-6 sm:p-8 rounded-2xl border-2 border-teal-500/30 dark:border-teal-500/40 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                {language === 'fr' ? 'Prêt pour l évaluation' : 'Ready for Evaluation'}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {language === 'fr' ? selectedLesson.titleFr : selectedLesson.titleEn}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === 'fr' ? selectedProfession?.nameFr : selectedProfession?.nameEn} • {language === 'fr' ? selectedYear?.labelFr : selectedYear?.labelEn} • {language === 'fr' ? selectedModule?.titleFr : selectedModule?.titleEn}
              </p>
            </div>

            <button
              onClick={() => onResetToStep('lesson')}
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 font-semibold"
            >
              {language === 'fr' ? 'Changer de cours' : 'Change Lesson'}
            </button>
          </div>

          {/* Quiz Mode Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {language === 'fr' ? 'Mode de passage' : 'Quiz Mode'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onSetQuizMode('training')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  quizMode === 'training'
                    ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/40 ring-2 ring-teal-600/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{t.trainingMode}</span>
                  {quizMode === 'training' && <Check className="w-4 h-4 text-teal-600" />}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'fr' 
                    ? 'Visualisez la correction et l explication du tuteur IA après chaque question.' 
                    : 'View instant correction and AI tutor explanation after each question.'}
                </p>
              </button>

              <button
                type="button"
                onClick={() => onSetQuizMode('exam')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  quizMode === 'exam'
                    ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/40 ring-2 ring-teal-600/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{t.examMode}</span>
                  {quizMode === 'exam' && <Check className="w-4 h-4 text-teal-600" />}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'fr' 
                    ? 'Conditions réelles de concours : chronomètre global et bilan complet à la fin.' 
                    : 'Real exam conditions: global countdown timer and final comprehensive report.'}
                </p>
              </button>
            </div>
          </div>

          {/* Launch Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>
                {language === 'fr' 
                  ? 'Questions extraites des examens officiels et annales de résidanat.' 
                  : 'Official university examination and residency question bank.'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {onOpenNewQCM && (
                <button
                  type="button"
                  onClick={onOpenNewQCM}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl border border-teal-500/40 text-teal-300 hover:text-white hover:bg-teal-950/50 hover:border-teal-400 font-semibold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-teal-400" />
                  <span>{language === 'fr' ? '+ Ajouter un QCM à ce cours' : '+ Add MCQ to this lecture'}</span>
                </button>
              )}

              <button
                onClick={onStartQuiz}
                className="w-full sm:w-auto bg-gradient-to-r from-teal-700 to-cyan-600 hover:from-teal-800 hover:to-cyan-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{t.startQuiz}</span>
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  Language, 
  Profession, 
  AcademicYear, 
  SubjectModule, 
  LessonChapter, 
  MCQQuestion, 
  SubscriptionConfig,
  ReportedQuestion,
  StudentSuggestion,
  AdminChecklist,
  AdminUser
} from '../types';
import { translations } from '../utils/translations';
import { QuestionPreviewModal } from './QuestionPreviewModal';
import { AdminWelcomeChecklistModal } from './AdminWelcomeChecklistModal';
import { 
  ShieldCheck, 
  Database, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  AlertTriangle, 
  DollarSign, 
  Bell, 
  BookOpen, 
  Layers, 
  Save,
  Users,
  Eye,
  Sparkles,
  Copy,
  MoveRight,
  RotateCcw,
  Search,
  Filter,
  GraduationCap,
  Settings,
  HelpCircle,
  Clock,
  FolderOpen,
  ArrowRight,
  LogOut,
  Check,
  X,
  FileCheck,
  AlertCircle
} from 'lucide-react';

interface AdminDashboardProps {
  language: Language;
  adminUser?: AdminUser | null;
  professions: Profession[];
  academicYears: AcademicYear[];
  modules: SubjectModule[];
  lessons: LessonChapter[];
  questions: MCQQuestion[];
  reportedQuestions: ReportedQuestion[];
  suggestedQuestions?: StudentSuggestion[];
  subscriptionConfig: SubscriptionConfig;
  announcement: string;
  checklist?: AdminChecklist;
  onUpdateAnnouncement: (text: string) => Promise<void> | void;
  onUpdateSubscriptionConfig: (config: SubscriptionConfig) => Promise<void> | void;
  onAddQuestion: (q: Partial<MCQQuestion>) => Promise<void> | void;
  onUpdateQuestion?: (id: string, q: Partial<MCQQuestion>) => Promise<void> | void;
  onSoftDeleteQuestion?: (id: string) => Promise<void> | void;
  onRestoreQuestion?: (id: string) => Promise<void> | void;
  onPermanentDeleteQuestion?: (id: string) => Promise<void> | void;
  onDuplicateQuestion?: (id: string) => Promise<void> | void;
  onMoveQuestion?: (id: string, newLessonId: string, newModuleId?: string) => Promise<void> | void;
  onResolveReport: (id: string, action: 'approved' | 'dismissed') => Promise<void> | void;
  onResolveSuggestion?: (id: string, action: 'approved' | 'rejected') => Promise<void> | void;
  onAddModule: (mod: Partial<SubjectModule>) => Promise<void> | void;
  onDeleteModule?: (id: string) => Promise<void> | void;
  onAddLesson: (les: Partial<LessonChapter>) => Promise<void> | void;
  onDeleteLesson?: (id: string) => Promise<void> | void;
  onAddYear?: (year: Partial<AcademicYear>) => Promise<void> | void;
  onSwitchToStudentView?: () => void;
  onAdminLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  language,
  adminUser,
  professions,
  academicYears,
  modules,
  lessons,
  questions,
  reportedQuestions,
  suggestedQuestions = [],
  subscriptionConfig,
  announcement,
  checklist = {
    adminCreated: true,
    languagesConfigured: true,
    pharmacyConfigured: true,
    medicineConfigured: true,
    yearsConfigured: true,
    subjectsConfigured: true,
    lessonsConfigured: true,
    qcmsConfigured: true,
    pricingConfigured: true,
    settingsReviewed: true,
  },
  onUpdateAnnouncement,
  onUpdateSubscriptionConfig,
  onAddQuestion,
  onUpdateQuestion,
  onSoftDeleteQuestion,
  onRestoreQuestion,
  onPermanentDeleteQuestion,
  onDuplicateQuestion,
  onMoveQuestion,
  onResolveReport,
  onResolveSuggestion,
  onAddModule,
  onDeleteModule,
  onAddLesson,
  onDeleteLesson,
  onAddYear,
  onSwitchToStudentView,
  onAdminLogout,
}) => {
  const t = translations[language];

  // Active Top Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'questions' | 'community' | 'pricing' | 'announcements' | 'settings'>('overview');

  // Checklist modal state
  const [showChecklistModal, setShowChecklistModal] = useState(false);

  // --- QUESTION MANAGEMENT STATES ---
  const [questionSubTab, setQuestionSubTab] = useState<'active' | 'drafts' | 'trash'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProfession, setFilterProfession] = useState<'all' | 'pharmacy' | 'medicine'>('all');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [filterLesson, setFilterLesson] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  // Question Creation / Editing Modal
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // Form fields for Question
  const [qProfession, setQProfession] = useState<'pharmacy' | 'medicine'>('pharmacy');
  const [qAcademicYear, setQAcademicYear] = useState<string>(academicYears[0]?.id || 'pharmacy-1');
  const [qModule, setQModule] = useState<string>(modules[0]?.id || '');
  const [qLesson, setQLesson] = useState<string>(lessons[0]?.id || '');
  const [qFaculty, setQFaculty] = useState<string>("Faculté de Médecine et Pharmacie d'Alger (Résidanat 2024)");
  const [qExamYear, setQExamYear] = useState<number>(2024);
  const [qTextFr, setQTextFr] = useState<string>('');
  const [qTextEn, setQTextEn] = useState<string>('');
  const [qOptions, setQOptions] = useState<string[]>(['', '', '', '', '']);
  const [qCorrectIndexes, setQCorrectIndexes] = useState<number[]>([0]);
  const [qIsMultiple, setQIsMultiple] = useState<boolean>(false);
  const [qExplanationFr, setQExplanationFr] = useState<string>('');
  const [qExplanationEn, setQExplanationEn] = useState<string>('');
  const [qDifficulty, setQDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [qFormError, setQFormError] = useState<string | null>(null);

  // Live Preview Modal
  const [previewQuestionData, setPreviewQuestionData] = useState<Partial<MCQQuestion> | null>(null);

  // Move Question Modal
  const [movingQuestion, setMovingQuestion] = useState<MCQQuestion | null>(null);
  const [targetMoveLessonId, setTargetMoveLessonId] = useState<string>('');

  // Permanent Delete Confirmation Modal
  const [deleteConfirmQuestionId, setDeleteConfirmQuestionId] = useState<string | null>(null);

  // --- CURRICULUM MANAGEMENT STATES ---
  const [curriculumProfession, setCurriculumProfession] = useState<'pharmacy' | 'medicine'>('pharmacy');
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [newModTitleFr, setNewModTitleFr] = useState('');
  const [newModCode, setNewModCode] = useState('');
  const [newModYearId, setNewModYearId] = useState(academicYears[0]?.id || 'pharmacy-1');
  const [newModDescFr, setNewModDescFr] = useState('');

  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [lessonParentModuleId, setLessonParentModuleId] = useState('');
  const [newLessonTitleFr, setNewLessonTitleFr] = useState('');
  const [newLessonMinutes, setNewLessonMinutes] = useState(25);

  // --- PRICING STATES ---
  const [yearlyDZD, setYearlyDZD] = useState(subscriptionConfig.yearlyPriceDZD);
  const [monthlyDZD, setMonthlyDZD] = useState(subscriptionConfig.monthlyPriceDZD);
  const [freeTrialDays, setFreeTrialDays] = useState(subscriptionConfig.freeTrialDays);
  const [ccpNum, setCcpNum] = useState(subscriptionConfig.ccpNumber);
  const [ccpKey, setCcpKey] = useState(subscriptionConfig.ccpKey);
  const [ccpHolder, setCcpHolder] = useState(subscriptionConfig.ccpHolder);
  const [baridiRip, setBaridiRip] = useState(subscriptionConfig.baridiMobRip);
  const [baridiPhone, setBaridiPhone] = useState(subscriptionConfig.baridiMobPhone);
  const [pricingSuccessMsg, setPricingSuccessMsg] = useState(false);

  // --- ANNOUNCEMENT STATES ---
  const [announcementText, setAnnouncementText] = useState(announcement);
  const [announcementSaved, setAnnouncementSaved] = useState(false);

  // Filter years according to selected profession
  const availableYearsForQ = useMemo(() => {
    return academicYears.filter(y => y.professionId === qProfession);
  }, [academicYears, qProfession]);

  const availableModulesForQ = useMemo(() => {
    return modules.filter(m => m.professionId === qProfession && m.academicYearId === qAcademicYear);
  }, [modules, qProfession, qAcademicYear]);

  const availableLessonsForQ = useMemo(() => {
    return lessons.filter(l => l.moduleId === qModule);
  }, [lessons, qModule]);

  // Filtered Questions in bank
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      // Sub-tab filter (active vs draft vs trash)
      if (questionSubTab === 'trash') {
        if (!q.isDeleted) return false;
      } else if (questionSubTab === 'drafts') {
        if (q.isDeleted || !q.isDraft) return false;
      } else {
        // Active
        if (q.isDeleted || q.isDraft) return false;
      }

      // Profession filter
      if (filterProfession !== 'all' && q.professionId !== filterProfession) return false;

      // Year filter
      if (filterYear !== 'all' && q.academicYearId !== filterYear) return false;

      // Module filter
      if (filterModule !== 'all' && q.moduleId !== filterModule) return false;

      // Lesson filter
      if (filterLesson !== 'all' && q.lessonId !== filterLesson) return false;

      // Difficulty filter
      if (filterDifficulty !== 'all' && q.difficulty !== filterDifficulty) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const textFr = (q.questionTextFr || '').toLowerCase();
        const textEn = (q.questionTextEn || '').toLowerCase();
        const expFr = (q.explanationFr || '').toLowerCase();
        const source = (q.facultySource || '').toLowerCase();
        if (!textFr.includes(query) && !textEn.includes(query) && !expFr.includes(query) && !source.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [questions, questionSubTab, filterProfession, filterYear, filterModule, filterLesson, filterDifficulty, searchQuery]);

  // Open New Question Modal
  const handleOpenNewQuestionModal = (defaultModuleId?: string, defaultLessonId?: string) => {
    setEditingQuestionId(null);
    const targetMod = modules.find(m => m.id === defaultModuleId) || modules[0];
    const targetProf = targetMod?.professionId || 'pharmacy';
    const targetYear = targetMod?.academicYearId || 'pharmacy-1';
    const targetLes = lessons.find(l => l.id === defaultLessonId) || lessons.find(l => l.moduleId === targetMod?.id) || lessons[0];

    setQProfession(targetProf);
    setQAcademicYear(targetYear);
    setQModule(targetMod?.id || '');
    setQLesson(targetLes?.id || '');
    setQFaculty(targetProf === 'pharmacy' ? "Faculté de Pharmacie d'Alger - EMD 2024" : "Faculté de Médecine d'Alger - Résidanat 2024");
    setQExamYear(2024);
    setQTextFr('');
    setQTextEn('');
    setQOptions(['', '', '', '', '']);
    setQCorrectIndexes([0]);
    setQIsMultiple(false);
    setQExplanationFr('');
    setQExplanationEn('');
    setQDifficulty('medium');
    setShowQuestionModal(true);
  };

  // Open Edit Question Modal
  const handleOpenEditQuestionModal = (q: MCQQuestion) => {
    setEditingQuestionId(q.id);
    setQProfession(q.professionId || 'pharmacy');
    setQAcademicYear(q.academicYearId || 'pharmacy-1');
    setQModule(q.moduleId);
    setQLesson(q.lessonId);
    setQFaculty(q.facultySource);
    setQExamYear(q.examYear);
    setQTextFr(q.questionTextFr);
    setQTextEn(q.questionTextEn || q.questionTextFr);
    setQOptions(q.optionsFr.length > 0 ? [...q.optionsFr] : ['', '', '', '', '']);
    setQCorrectIndexes(q.correctOptionIndexes);
    setQIsMultiple(q.correctOptionIndexes.length > 1);
    setQExplanationFr(q.explanationFr);
    setQExplanationEn(q.explanationEn || q.explanationFr);
    setQDifficulty(q.difficulty);
    setShowQuestionModal(true);
  };

  // Toggle Correct Index in form
  const handleToggleCorrectOption = (idx: number) => {
    if (qIsMultiple) {
      if (qCorrectIndexes.includes(idx)) {
        if (qCorrectIndexes.length > 1) {
          setQCorrectIndexes(qCorrectIndexes.filter(i => i !== idx));
        }
      } else {
        setQCorrectIndexes([...qCorrectIndexes, idx].sort((a, b) => a - b));
      }
    } else {
      setQCorrectIndexes([idx]);
    }
  };

  // Save Question
  const handleSaveQuestion = async (isDraft: boolean = false) => {
    if (!qTextFr.trim()) {
      setQFormError("Veuillez saisir l'énoncé du QCM.");
      return;
    }

    const cleanOptions = qOptions.filter(o => o.trim().length > 0);
    if (cleanOptions.length < 2) {
      setQFormError("Veuillez saisir au moins 2 options de réponse.");
      return;
    }
    setQFormError(null);

    const questionPayload: Partial<MCQQuestion> = {
      professionId: qProfession,
      academicYearId: qAcademicYear,
      moduleId: qModule,
      lessonId: qLesson,
      facultySource: qFaculty,
      examYear: qExamYear,
      questionTextFr: qTextFr.trim(),
      questionTextEn: qTextEn.trim() || qTextFr.trim(),
      optionsFr: cleanOptions,
      optionsEn: cleanOptions,
      correctOptionIndexes: qCorrectIndexes.filter(i => i < cleanOptions.length),
      isMultipleChoice: qIsMultiple,
      explanationFr: qExplanationFr.trim(),
      explanationEn: qExplanationEn.trim() || qExplanationFr.trim(),
      difficulty: qDifficulty,
      isDraft,
    };

    if (editingQuestionId) {
      if (onUpdateQuestion) {
        await onUpdateQuestion(editingQuestionId, questionPayload);
      }
    } else {
      await onAddQuestion(questionPayload);
    }

    setShowQuestionModal(false);
  };

  // Open Preview from Form
  const handlePreviewCurrentForm = () => {
    const cleanOptions = qOptions.filter(o => o.trim().length > 0);
    setPreviewQuestionData({
      id: editingQuestionId || 'nouveau',
      professionId: qProfession,
      academicYearId: qAcademicYear,
      moduleId: qModule,
      lessonId: qLesson,
      facultySource: qFaculty,
      examYear: qExamYear,
      questionTextFr: qTextFr,
      questionTextEn: qTextEn || qTextFr,
      optionsFr: cleanOptions,
      optionsEn: cleanOptions,
      correctOptionIndexes: qCorrectIndexes,
      isMultipleChoice: qIsMultiple,
      explanationFr: qExplanationFr,
      explanationEn: qExplanationEn || qExplanationFr,
      difficulty: qDifficulty,
    });
  };

  // Save Pricing
  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateSubscriptionConfig({
      ...subscriptionConfig,
      yearlyPriceDZD: Number(yearlyDZD),
      monthlyPriceDZD: Number(monthlyDZD),
      freeTrialDays: Number(freeTrialDays),
      ccpNumber: ccpNum,
      ccpKey: ccpKey,
      ccpHolder: ccpHolder,
      baridiMobRip: baridiRip,
      baridiMobPhone: baridiPhone,
    });
    setPricingSuccessMsg(true);
    setTimeout(() => setPricingSuccessMsg(false), 3500);
  };

  // Save Announcement
  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateAnnouncement(announcementText);
    setAnnouncementSaved(true);
    setTimeout(() => setAnnouncementSaved(false), 3500);
  };

  // Add Module Submit
  const handleAddModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModTitleFr.trim()) return;
    await onAddModule({
      titleFr: newModTitleFr.trim(),
      titleEn: newModTitleFr.trim(),
      code: newModCode.trim() || 'MOD-AUTO',
      academicYearId: newModYearId,
      professionId: curriculumProfession,
      descriptionFr: newModDescFr.trim(),
      icon: curriculumProfession === 'pharmacy' ? 'pill' : 'stethoscope',
      color: curriculumProfession === 'pharmacy' ? 'from-teal-600 to-teal-800' : 'from-blue-600 to-indigo-800',
    });
    setNewModTitleFr('');
    setNewModCode('');
    setNewModDescFr('');
    setShowAddModuleModal(false);
  };

  // Add Lesson Submit
  const handleAddLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitleFr.trim() || !lessonParentModuleId) return;
    await onAddLesson({
      moduleId: lessonParentModuleId,
      titleFr: newLessonTitleFr.trim(),
      titleEn: newLessonTitleFr.trim(),
      estimatedMinutes: Number(newLessonMinutes),
    });
    setNewLessonTitleFr('');
    setShowAddLessonModal(false);
  };

  return (
    <div id="admin-dashboard-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white pb-20">
      {/* Top Super Admin Nav Bar */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <ShieldCheck className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white">PharmedQuest Admin Center</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Connecté en tant que <strong className="text-slate-200">{adminUser?.name || 'Administrateur Propriétaire'}</strong> ({adminUser?.email || 'admin@pharmedquest.dz'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowChecklistModal(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Guide & Checklist</span>
            </button>

            {onSwitchToStudentView && (
              <button
                onClick={onSwitchToStudentView}
                className="px-3 py-1.5 bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Vue Étudiant</span>
              </button>
            )}

            {onAdminLogout && (
              <button
                onClick={onAdminLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl border border-slate-800 transition-colors"
                title="Déconnexion Administrateur"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto gap-1 border-t border-slate-800/60 no-scrollbar text-xs font-semibold">
          {[
            { id: 'overview', label: "Vue d'ensemble", icon: Database },
            { id: 'curriculum', label: 'Structure Académique', icon: BookOpen },
            { id: 'questions', label: `Banque de QCMs (${questions.filter(q => !q.isDeleted).length})`, icon: Sparkles },
            { id: 'community', label: `Modération (${reportedQuestions.filter(r => r.status === 'pending').length + suggestedQuestions.filter(s => s.status === 'pending').length})`, icon: Users },
            { id: 'pricing', label: 'Tarifs & CCP', icon: DollarSign },
            { id: 'announcements', label: 'Annonces', icon: Bell },
            { id: 'settings', label: 'Paramètres', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 whitespace-nowrap flex items-center gap-2 border-b-2 transition-all ${
                  isActive
                    ? 'border-teal-500 text-teal-400 bg-teal-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Top metrics grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
                  <span>Banque de QCMs Active</span>
                  <Sparkles className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {questions.filter(q => !q.isDeleted && !q.isDraft).length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                  <span className="text-emerald-400 font-semibold">{questions.filter(q => q.professionId === 'pharmacy' && !q.isDeleted).length} Pharma</span>
                  <span>•</span>
                  <span className="text-cyan-400 font-semibold">{questions.filter(q => q.professionId === 'medicine' && !q.isDeleted).length} Médecine</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
                  <span>Modules & Matières</span>
                  <BookOpen className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">{modules.length}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Sur {academicYears.length} années universitaires
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
                  <span>Leçons & Chapitres</span>
                  <Layers className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white">{lessons.length}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Tous connectés à la banque de questions
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
                  <span>Modération en Attente</span>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-2xl font-bold text-rose-400">
                  {reportedQuestions.filter(r => r.status === 'pending').length + suggestedQuestions.filter(s => s.status === 'pending').length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {reportedQuestions.filter(r => r.status === 'pending').length} signalements • {suggestedQuestions.filter(s => s.status === 'pending').length} suggestions
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-teal-950/20 to-slate-900 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-teal-400" />
                  Administration du Contenu Pédagogique
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ajoutez directement de nouvelles questions officielles ou structurez vos modules universitaires.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => handleOpenNewQuestionModal()}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un QCM</span>
                </button>
                <button
                  onClick={() => {
                    setCurriculumProfession('pharmacy');
                    setShowAddModuleModal(true);
                  }}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-teal-400" />
                  <span>Nouveau Module</span>
                </button>
                <button
                  onClick={() => setActiveTab('pricing')}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Abonnements DZD</span>
                </button>
              </div>
            </div>

            {/* Specialties Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pharmacy summary */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Cursus Pharmacie</h4>
                      <p className="text-[11px] text-slate-400">5 Années d'études • EMDs & Résidanat</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFilterProfession('pharmacy');
                      setActiveTab('questions');
                    }}
                    className="text-xs text-teal-400 hover:text-teal-300 font-semibold"
                  >
                    Voir les QCMs →
                  </button>
                </div>

                <div className="space-y-2.5">
                  {academicYears.filter(y => y.professionId === 'pharmacy').map(year => {
                    const yearModules = modules.filter(m => m.academicYearId === year.id);
                    const yearQuestions = questions.filter(q => q.academicYearId === year.id && !q.isDeleted);
                    return (
                      <div key={year.id} className="p-3 bg-slate-950/60 rounded-xl flex items-center justify-between border border-slate-800/80">
                        <div>
                          <div className="text-xs font-bold text-slate-200">{year.labelFr}</div>
                          <div className="text-[11px] text-slate-500">{yearModules.length} modules configurés</div>
                        </div>
                        <div className="text-xs font-mono font-bold text-teal-400">
                          {yearQuestions.length} QCMs
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Medicine summary */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Cursus Médecine</h4>
                      <p className="text-[11px] text-slate-400">6 Années d'études • Clinique & Résidanat</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFilterProfession('medicine');
                      setActiveTab('questions');
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    Voir les QCMs →
                  </button>
                </div>

                <div className="space-y-2.5">
                  {academicYears.filter(y => y.professionId === 'medicine').map(year => {
                    const yearModules = modules.filter(m => m.academicYearId === year.id);
                    const yearQuestions = questions.filter(q => q.academicYearId === year.id && !q.isDeleted);
                    return (
                      <div key={year.id} className="p-3 bg-slate-950/60 rounded-xl flex items-center justify-between border border-slate-800/80">
                        <div>
                          <div className="text-xs font-bold text-slate-200">{year.labelFr}</div>
                          <div className="text-[11px] text-slate-500">{yearModules.length} modules configurés</div>
                        </div>
                        <div className="text-xs font-mono font-bold text-cyan-400">
                          {yearQuestions.length} QCMs
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CURRICULUM MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'curriculum' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Header & Specialty Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-teal-400" />
                  Structure Académique & Modules
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Organisez les années, matières et chapitres. Chaque modification est synchronisée instantanément sur les applications étudiantes.
                </p>
              </div>

              {/* Toggle Pharmacy / Medicine */}
              <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setCurriculumProfession('pharmacy')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    curriculumProfession === 'pharmacy'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Pharmacie (5 ans)
                </button>
                <button
                  onClick={() => setCurriculumProfession('medicine')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    curriculumProfession === 'medicine'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Médecine (6 ans)
                </button>
              </div>
            </div>

            {/* Academic Years for selected profession */}
            <div className="space-y-6">
              {academicYears
                .filter(y => y.professionId === curriculumProfession)
                .map(year => {
                  const yearModules = modules.filter(m => m.academicYearId === year.id);

                  return (
                    <div key={year.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                      {/* Year title bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80 mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-400 border border-teal-800 text-xs font-bold uppercase tracking-wider">
                              Année {year.yearNumber}
                            </span>
                            <h3 className="text-base font-bold text-white">{year.labelFr}</h3>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{year.descriptionFr}</p>
                        </div>
                        <button
                          onClick={() => {
                            setNewModYearId(year.id);
                            setShowAddModuleModal(true);
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                        >
                          <Plus className="w-3.5 h-3.5 text-teal-400" />
                          <span>Ajouter une Matière</span>
                        </button>
                      </div>

                      {/* Modules list */}
                      {yearModules.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                          Aucun module pour cette année. Cliquez sur "Ajouter une Matière" pour commencer.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {yearModules.map(mod => {
                            const modLessons = lessons.filter(l => l.moduleId === mod.id);
                            const modQuestions = questions.filter(q => q.moduleId === mod.id && !q.isDeleted);

                            return (
                              <div key={mod.id} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="px-2 py-0.5 bg-slate-800 text-teal-300 rounded font-mono text-xs font-semibold">
                                        {mod.code}
                                      </span>
                                      <h4 className="text-sm font-bold text-white">{mod.titleFr}</h4>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-0.5">{mod.descriptionFr}</p>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400 font-mono">
                                      {modQuestions.length} QCMs
                                    </span>
                                    <button
                                      onClick={() => {
                                        setLessonParentModuleId(mod.id);
                                        setShowAddLessonModal(true);
                                      }}
                                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                                    >
                                      <Plus className="w-3 h-3 text-teal-400" />
                                      <span>Ajouter Leçon</span>
                                    </button>
                                    <button
                                      onClick={() => handleOpenNewQuestionModal(mod.id)}
                                      className="px-2.5 py-1 bg-teal-950 hover:bg-teal-900 border border-teal-800 text-teal-300 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                                    >
                                      <Plus className="w-3 h-3" />
                                      <span>Créer QCM</span>
                                    </button>
                                    {onDeleteModule && (
                                      <button
                                        onClick={() => {
                                          if (confirm(`Supprimer le module "${mod.titleFr}" et toutes ses leçons/QCMs associés ?`)) {
                                            onDeleteModule(mod.id);
                                          }
                                        }}
                                        className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                                        title="Supprimer le module"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Lessons under module */}
                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {modLessons.map(lesson => {
                                    const lessonQCount = questions.filter(q => q.lessonId === lesson.id && !q.isDeleted).length;
                                    return (
                                      <div key={lesson.id} className="p-2.5 bg-slate-900 border border-slate-800/80 rounded-lg flex items-center justify-between gap-2 text-xs">
                                        <div className="flex-1 truncate">
                                          <div className="font-semibold text-slate-200 truncate">{lesson.titleFr}</div>
                                          <div className="text-[11px] text-slate-500">{lessonQCount} QCMs • ~{lesson.estimatedMinutes} min</div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <button
                                            onClick={() => handleOpenNewQuestionModal(mod.id, lesson.id)}
                                            className="p-1 text-teal-400 hover:bg-teal-950/50 rounded"
                                            title="Ajouter un QCM dans ce chapitre"
                                          >
                                            <Plus className="w-3.5 h-3.5" />
                                          </button>
                                          {onDeleteLesson && (
                                            <button
                                              onClick={() => {
                                                if (confirm(`Supprimer la leçon "${lesson.titleFr}" ?`)) {
                                                  onDeleteLesson(lesson.id);
                                                }
                                              }}
                                              className="p-1 text-slate-500 hover:text-rose-400 rounded"
                                              title="Supprimer la leçon"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: MCQ QUESTIONS BANK */}
        {/* ========================================================================= */}
        {activeTab === 'questions' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-400" />
                  Gestion de la Banque de QCMs
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Rédigez, modifiez, prévisualisez et organisez les questions universitaires pour les examens et le résidanat.
                </p>
              </div>

              <button
                id="admin-add-new-qcm-btn"
                onClick={() => handleOpenNewQuestionModal()}
                className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all self-start sm:self-auto active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau QCM Universitaire</span>
              </button>
            </div>

            {/* Sub-tabs: Active, Drafts, Trash */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <button
                onClick={() => setQuestionSubTab('active')}
                className={`px-3.5 py-1.5 rounded-xl transition-colors ${
                  questionSubTab === 'active'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Actifs ({questions.filter(q => !q.isDeleted && !q.isDraft).length})
              </button>
              <button
                onClick={() => setQuestionSubTab('drafts')}
                className={`px-3.5 py-1.5 rounded-xl transition-colors ${
                  questionSubTab === 'drafts'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Brouillons ({questions.filter(q => !q.isDeleted && q.isDraft).length})
              </button>
              <button
                onClick={() => setQuestionSubTab('trash')}
                className={`px-3.5 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${
                  questionSubTab === 'trash'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Corbeille ({questions.filter(q => q.isDeleted).length})</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Recherche instantanée (énoncé, explication clinique, source faculté, mot-clé)..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                {/* Profession filter */}
                <select
                  value={filterProfession}
                  onChange={(e) => {
                    setFilterProfession(e.target.value as any);
                    setFilterYear('all');
                    setFilterModule('all');
                    setFilterLesson('all');
                  }}
                  className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl p-2 focus:outline-none focus:border-teal-500"
                >
                  <option value="all">Toutes Spécialités</option>
                  <option value="pharmacy">Pharmacie</option>
                  <option value="medicine">Médecine</option>
                </select>

                {/* Academic Year filter */}
                <select
                  value={filterYear}
                  onChange={(e) => {
                    setFilterYear(e.target.value);
                    setFilterModule('all');
                    setFilterLesson('all');
                  }}
                  className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl p-2 focus:outline-none focus:border-teal-500"
                >
                  <option value="all">Toutes Années</option>
                  {academicYears
                    .filter(y => filterProfession === 'all' || y.professionId === filterProfession)
                    .map(y => (
                      <option key={y.id} value={y.id}>{y.labelFr}</option>
                    ))}
                </select>

                {/* Module filter */}
                <select
                  value={filterModule}
                  onChange={(e) => {
                    setFilterModule(e.target.value);
                    setFilterLesson('all');
                  }}
                  className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl p-2 focus:outline-none focus:border-teal-500"
                >
                  <option value="all">Tous Modules</option>
                  {modules
                    .filter(m => (filterProfession === 'all' || m.professionId === filterProfession) && (filterYear === 'all' || m.academicYearId === filterYear))
                    .map(m => (
                      <option key={m.id} value={m.id}>{m.titleFr}</option>
                    ))}
                </select>

                {/* Lesson filter */}
                <select
                  value={filterLesson}
                  onChange={(e) => setFilterLesson(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl p-2 focus:outline-none focus:border-teal-500"
                >
                  <option value="all">Toutes Leçons</option>
                  {lessons
                    .filter(l => filterModule === 'all' || l.moduleId === filterModule)
                    .map(l => (
                      <option key={l.id} value={l.id}>{l.titleFr}</option>
                    ))}
                </select>

                {/* Difficulty filter */}
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl p-2 focus:outline-none focus:border-teal-500"
                >
                  <option value="all">Toutes Difficultés</option>
                  <option value="easy">Facile</option>
                  <option value="medium">Moyen</option>
                  <option value="hard">Difficile</option>
                </select>
              </div>
            </div>

            {/* Questions List */}
            {filteredQuestions.length === 0 ? (
              <div className="p-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
                <HelpCircle className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-semibold text-slate-400">Aucun QCM trouvé dans cette section</p>
                <p className="text-xs text-slate-500 mt-1">Essayez d'ajuster les filtres ou cliquez sur "Nouveau QCM Universitaire" pour en créer un.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredQuestions.map(q => {
                  const mod = modules.find(m => m.id === q.moduleId);
                  const les = lessons.find(l => l.id === q.lessonId);
                  const isMultiple = (q.correctOptionIndexes?.length || 1) > 1;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        q.isDeleted
                          ? 'bg-rose-950/20 border-rose-900/40 text-slate-400'
                          : q.isDraft
                          ? 'bg-amber-950/20 border-amber-900/40'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Top Bar of card */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800/80 text-xs">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] ${
                            q.professionId === 'pharmacy' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          }`}>
                            {q.professionId === 'pharmacy' ? 'Pharmacie' : 'Médecine'}
                          </span>
                          {mod && (
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                              {mod.titleFr}
                            </span>
                          )}
                          {les && (
                            <span className="px-2 py-0.5 rounded bg-slate-800/60 text-slate-400">
                              {les.titleFr}
                            </span>
                          )}
                          <span className="text-[11px] text-slate-500 font-mono">
                            {q.facultySource} • {q.examYear}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            q.difficulty === 'easy' ? 'text-emerald-400' : q.difficulty === 'hard' ? 'text-rose-400' : 'text-amber-400'
                          }`}>
                            {q.difficulty}
                          </span>
                          {q.isDraft && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                              Brouillon
                            </span>
                          )}
                          {q.isDeleted && (
                            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                              Corbeille
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5">
                          {/* Live Preview Button */}
                          <button
                            onClick={() => setPreviewQuestionData(q)}
                            className="p-1.5 text-slate-400 hover:text-teal-300 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Aperçu Étudiant Réel"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* If in trash: restore or permanent delete */}
                          {q.isDeleted ? (
                            <>
                              {onRestoreQuestion && (
                                <button
                                  onClick={() => onRestoreQuestion(q.id)}
                                  className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                                  title="Restaurer le QCM"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Restaurer</span>
                                </button>
                              )}
                              {onPermanentDeleteQuestion && (
                                <button
                                  onClick={() => setDeleteConfirmQuestionId(q.id)}
                                  className="p-1.5 text-rose-400 hover:bg-rose-950/60 rounded-lg transition-colors"
                                  title="Suppression Définitive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              {/* Edit */}
                              <button
                                onClick={() => handleOpenEditQuestionModal(q)}
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                title="Modifier le QCM"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {/* Duplicate */}
                              {onDuplicateQuestion && (
                                <button
                                  onClick={() => onDuplicateQuestion(q.id)}
                                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                  title="Dupliquer le QCM (Créer une copie)"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                              )}

                              {/* Move */}
                              <button
                                onClick={() => {
                                  setMovingQuestion(q);
                                  setTargetMoveLessonId(q.lessonId);
                                }}
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                title="Déplacer vers un autre chapitre"
                              >
                                <MoveRight className="w-4 h-4" />
                              </button>

                              {/* Soft delete */}
                              {onSoftDeleteQuestion && (
                                <button
                                  onClick={() => onSoftDeleteQuestion(q.id)}
                                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                                  title="Mettre à la corbeille"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Question Text */}
                      <p className="text-sm font-semibold text-white leading-relaxed mb-3">
                        {q.questionTextFr}
                      </p>

                      {/* Options preview */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {q.optionsFr.map((opt, idx) => {
                          const isCorrect = q.correctOptionIndexes.includes(idx);
                          return (
                            <div
                              key={idx}
                              className={`p-2 rounded-lg border flex items-center gap-2 ${
                                isCorrect
                                  ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                                  : 'bg-slate-950/50 border-slate-800 text-slate-400'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] shrink-0 ${
                                isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {['A', 'B', 'C', 'D', 'E'][idx]}
                              </span>
                              <span className="truncate">{opt}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation preview */}
                      {q.explanationFr && (
                        <div className="mt-2.5 p-2 bg-slate-950/40 border border-slate-800/60 rounded-lg text-xs text-slate-400 flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{q.explanationFr}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: COMMUNITY MODERATION (REPORTS & SUGGESTIONS) */}
        {/* ========================================================================= */}
        {activeTab === 'community' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-400" />
                Modération & Participation Communautaire
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Examinez les signalements d'anomalies sur les QCMs et validez les propositions soumises par les étudiants et résidents.
              </p>
            </div>

            {/* Reports Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Signalements d'Étudiants sur les Questions</h3>
                </div>
                <span className="text-xs text-slate-400">
                  {reportedQuestions.filter(r => r.status === 'pending').length} en attente
                </span>
              </div>

              {reportedQuestions.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">Aucun signalement en attente.</div>
              ) : (
                <div className="space-y-3">
                  {reportedQuestions.map(rep => {
                    const linkedQuestion = questions.find(q => q.id === rep.questionId);
                    return (
                      <div key={rep.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-200">{rep.studentName}</span>
                            <span className="text-slate-500">• {rep.timestamp}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              rep.status === 'pending' ? 'bg-amber-950 text-amber-400' :
                              rep.status === 'approved' ? 'bg-emerald-950 text-emerald-400' :
                              'bg-slate-800 text-slate-400'
                            }`}>
                              {rep.status}
                            </span>
                          </div>
                          <div className="text-rose-300 font-semibold">Motif : {rep.reason}</div>
                          {rep.suggestion && <div className="text-slate-400">Correction suggérée : {rep.suggestion}</div>}
                          {linkedQuestion && (
                            <div className="text-slate-500 italic mt-1">
                              Énoncé QCM : "{linkedQuestion.questionTextFr}"
                            </div>
                          )}
                        </div>

                        {rep.status === 'pending' && (
                          <div className="flex items-center gap-2 shrink-0">
                            {linkedQuestion && (
                              <button
                                onClick={() => handleOpenEditQuestionModal(linkedQuestion)}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Éditer QCM</span>
                              </button>
                            )}
                            <button
                              onClick={() => onResolveReport(rep.id, 'approved')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
                            >
                              Valider & Résolu
                            </button>
                            <button
                              onClick={() => onResolveReport(rep.id, 'dismissed')}
                              className="px-3 py-1.5 border border-slate-700 hover:bg-slate-800 text-slate-400 rounded-lg text-xs font-medium transition-colors"
                            >
                              Classer
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Suggestions Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <h3 className="text-sm font-bold text-white">Propositions de QCMs par les Étudiants</h3>
                </div>
                <span className="text-xs text-slate-400">
                  {suggestedQuestions.filter(s => s.status === 'pending').length} en attente de revue
                </span>
              </div>

              {suggestedQuestions.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">Aucune proposition en attente.</div>
              ) : (
                <div className="space-y-4">
                  {suggestedQuestions.map(sug => (
                    <div key={sug.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-teal-300">{sug.studentName}</span>
                          <span className="text-slate-500">• {sug.timestamp}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            sug.status === 'pending' ? 'bg-amber-950 text-amber-400' :
                            sug.status === 'approved' ? 'bg-emerald-950 text-emerald-400' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {sug.status}
                          </span>
                        </div>
                        <span className="text-slate-500 font-mono text-[11px]">{sug.facultySource}</span>
                      </div>

                      <p className="text-sm font-semibold text-white">{sug.questionText}</p>

                      <div className="space-y-1 text-xs">
                        {sug.options.map((opt, i) => (
                          <div key={i} className={`p-1.5 rounded flex items-center gap-2 ${sug.correctIndexes.includes(i) ? 'bg-emerald-950/60 text-emerald-300 font-medium' : 'text-slate-400'}`}>
                            <span className="font-bold">{['A', 'B', 'C', 'D', 'E'][i]} :</span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>

                      {sug.explanation && (
                        <p className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                          Explication : {sug.explanation}
                        </p>
                      )}

                      {sug.status === 'pending' && onResolveSuggestion && (
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
                          <button
                            onClick={() => onResolveSuggestion(sug.id, 'rejected')}
                            className="px-3 py-1.5 border border-slate-700 hover:bg-slate-800 text-slate-400 rounded-lg text-xs font-medium transition-colors"
                          >
                            Refuser
                          </button>
                          <button
                            onClick={() => onResolveSuggestion(sug.id, 'approved')}
                            className="px-4 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approuver & Publier dans la Banque</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: PRICING & SUBSCRIPTION CONFIG */}
        {/* ========================================================================= */}
        {activeTab === 'pricing' && (
          <div className="max-w-3xl space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Tarifs d'Abonnement & Coordonnées Bancaires Algérie (DZD)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configurez le prix en dinars algériens ainsi que vos coordonnées de virement CCP et BaridiMob pour le règlement des abonnements étudiants.
              </p>
            </div>

            {pricingSuccessMsg && (
              <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Les tarifs et coordonnées de paiement ont été mis à jour et synchronisés en direct.</span>
              </div>
            )}

            <form onSubmit={handleSavePricing} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              {/* Prices in DZD */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Grille Tarifaire (Dinars Algériens)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Tarif Annuel (DZD)</label>
                    <input
                      type="number"
                      value={yearlyDZD}
                      onChange={(e) => setYearlyDZD(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Tarif Mensuel (DZD)</label>
                    <input
                      type="number"
                      value={monthlyDZD}
                      onChange={(e) => setMonthlyDZD(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Essai Gratuit (Jours)</label>
                    <input
                      type="number"
                      value={freeTrialDays}
                      onChange={(e) => setFreeTrialDays(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* CCP Info */}
              <div className="pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Coordonnées CCP (Algérie Poste)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">Numéro de Compte CCP</label>
                    <input
                      type="text"
                      value={ccpNum}
                      onChange={(e) => setCcpNum(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Clé CCP</label>
                    <input
                      type="text"
                      value={ccpKey}
                      onChange={(e) => setCcpKey(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 font-mono"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs text-slate-400 mb-1">Nom du Titulaire du Compte</label>
                    <input
                      type="text"
                      value={ccpHolder}
                      onChange={(e) => setCcpHolder(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* BaridiMob Info */}
              <div className="pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Coordonnées BaridiMob
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">RIP BaridiMob (20 Chiffres)</label>
                    <input
                      type="text"
                      value={baridiRip}
                      onChange={(e) => setBaridiRip(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Numéro de Téléphone BaridiMob</label>
                    <input
                      type="text"
                      value={baridiPhone}
                      onChange={(e) => setBaridiPhone(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les Tarifs & Coordonnées</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: BROADCAST ANNOUNCEMENTS */}
        {/* ========================================================================= */}
        {activeTab === 'announcements' && (
          <div className="max-w-3xl space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-teal-400" />
                Bannière d'Annonce Officielle
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Diffusez un message d'information ou une alerte en temps réel au sommet de l'application de tous les étudiants.
              </p>
            </div>

            {announcementSaved && (
              <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>L'annonce a été mise à jour et diffusée aux étudiants.</span>
              </div>
            )}

            <form onSubmit={handleSaveAnnouncement} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Texte du Message de Diffusion
                </label>
                <textarea
                  rows={3}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="Ex: 📢 Concours de Résidanat 2024 : Les 150 nouveaux QCMs officiels sont disponibles !"
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 leading-relaxed"
                />
              </div>

              {/* Live Preview */}
              <div className="p-3 bg-slate-950 rounded-xl border border-teal-500/30">
                <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wider mb-1.5">
                  Aperçu de la Bannière Étudiant :
                </div>
                <div className="p-2.5 bg-gradient-to-r from-teal-950/80 to-emerald-950/80 border border-teal-500/30 rounded-lg text-xs text-teal-200 font-medium">
                  {announcementText || "(Bannière vide)"}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Publier et Diffuser l'Annonce</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: SETTINGS & CHECKLIST */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-teal-400" />
                Paramètres Système & Sécurité
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Gouvernance du compte Administrateur Principal et intégrité de la plateforme PharmedQuest.
              </p>
            </div>

            {/* Admin Profile Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-slate-950 text-xl font-bold shadow-lg">
                  {adminUser?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{adminUser?.name || 'Administrateur Propriétaire'}</h3>
                    <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-500/30 text-emerald-400 rounded-full text-[10px] font-bold uppercase">
                      OWNER / SUPER ADMIN
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{adminUser?.email || 'admin@pharmedquest.dz'}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Autorisation absolue • Gestion des accès et des contenus</p>
                </div>
              </div>
            </div>

            {/* Checklist trigger card */}
            <div className="p-5 bg-gradient-to-r from-teal-950/40 to-slate-900 border border-teal-500/30 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  Feuille de Route & Checklist de Mise en Service
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Consultez la checklist des 10 étapes clés pour finaliser le déploiement de vos modules et QCMs.
                </p>
              </div>
              <button
                onClick={() => setShowChecklistModal(true)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
              >
                Ouvrir la Checklist
              </button>
            </div>

            {/* Security stats */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Sécurité & Architecture
              </h4>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span>Stockage Dynamique</span>
                  <span className="text-emerald-400 font-mono font-semibold">Base de Données JSON Synchronisée</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span>Chiffrement des Mots de Passe</span>
                  <span className="text-slate-200 font-mono">scrypt (Node.js Crypto)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span>Autorisation des APIs Admin</span>
                  <span className="text-emerald-400 font-mono">Token Sécurisé (x-admin-token)</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Verrouillage One-Time Setup</span>
                  <span className="text-emerald-400 font-semibold">Actif • Route publique fermée</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT MCQ QUESTION */}
      {/* ========================================================================= */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  {editingQuestionId ? 'Modifier le QCM Universitaire' : 'Rédiger un Nouveau QCM'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Associez le QCM à la bonne discipline, module et leçon universitaire.
                </p>
              </div>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {qFormError && (
                <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{qFormError}</span>
                </div>
              )}

              {/* Hierarchy selections */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Specialty */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Spécialité
                  </label>
                  <select
                    value={qProfession}
                    onChange={(e) => {
                      const newProf = e.target.value as 'pharmacy' | 'medicine';
                      setQProfession(newProf);
                      const matchingYears = academicYears.filter(y => y.professionId === newProf);
                      const firstYear = matchingYears[0]?.id || '';
                      setQAcademicYear(firstYear);
                      const matchingMods = modules.filter(m => m.professionId === newProf && m.academicYearId === firstYear);
                      const firstMod = matchingMods[0]?.id || '';
                      setQModule(firstMod);
                      const matchingLes = lessons.filter(l => l.moduleId === firstMod);
                      setQLesson(matchingLes[0]?.id || '');
                    }}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                  >
                    <option value="pharmacy">Pharmacie</option>
                    <option value="medicine">Médecine</option>
                  </select>
                </div>

                {/* Academic Year */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Année Universitaire
                  </label>
                  <select
                    value={qAcademicYear}
                    onChange={(e) => {
                      const newYear = e.target.value;
                      setQAcademicYear(newYear);
                      const matchingMods = modules.filter(m => m.professionId === qProfession && m.academicYearId === newYear);
                      const firstMod = matchingMods[0]?.id || '';
                      setQModule(firstMod);
                      const matchingLes = lessons.filter(l => l.moduleId === firstMod);
                      setQLesson(matchingLes[0]?.id || '');
                    }}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                  >
                    {availableYearsForQ.map(y => (
                      <option key={y.id} value={y.id}>{y.labelFr}</option>
                    ))}
                  </select>
                </div>

                {/* Module */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Matière / Module
                  </label>
                  <select
                    value={qModule}
                    onChange={(e) => {
                      const newMod = e.target.value;
                      setQModule(newMod);
                      const matchingLes = lessons.filter(l => l.moduleId === newMod);
                      setQLesson(matchingLes[0]?.id || '');
                    }}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                  >
                    {availableModulesForQ.map(m => (
                      <option key={m.id} value={m.id}>{m.titleFr}</option>
                    ))}
                  </select>
                </div>

                {/* Lesson */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Leçon / Chapitre
                  </label>
                  <select
                    value={qLesson}
                    onChange={(e) => setQLesson(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                  >
                    {availableLessonsForQ.map(l => (
                      <option key={l.id} value={l.id}>{l.titleFr}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Source & Exam year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Origine / Faculté d'Examen (EMD / Résidanat)
                  </label>
                  <input
                    type="text"
                    value={qFaculty}
                    onChange={(e) => setQFaculty(e.target.value)}
                    placeholder="Ex: Faculté de Médecine d'Alger (Résidanat 2024)"
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Année de Concours
                  </label>
                  <input
                    type="number"
                    value={qExamYear}
                    onChange={(e) => setQExamYear(Number(e.target.value))}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>
              </div>

              {/* Single vs Multiple choice & Difficulty */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-300">Format de question :</span>
                  <label className="inline-flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="qType"
                      checked={!qIsMultiple}
                      onChange={() => {
                        setQIsMultiple(false);
                        setQCorrectIndexes([qCorrectIndexes[0] || 0]);
                      }}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span>Choix Unique (QCS)</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="qType"
                      checked={qIsMultiple}
                      onChange={() => setQIsMultiple(true)}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span>Choix Multiple (QCM)</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300">Difficulté :</span>
                  {(['easy', 'medium', 'hard'] as const).map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setQDifficulty(d)}
                      className={`px-2 py-0.5 rounded text-xs font-semibold capitalize transition-colors ${
                        qDifficulty === d
                          ? d === 'easy' ? 'bg-emerald-600 text-white' : d === 'hard' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {d === 'easy' ? 'Facile' : d === 'hard' ? 'Difficile' : 'Moyen'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Text (French) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Énoncé du QCM (Français) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={qTextFr}
                  onChange={(e) => setQTextFr(e.target.value)}
                  placeholder="Rédigez ici l'énoncé complet du QCM..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500 leading-relaxed"
                />
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Options de Réponse & Sélection des Bonnes Réponses *
                </label>
                <p className="text-[11px] text-slate-400">
                  Cliquez sur la pastille de lettre (A, B, C...) pour marquer la ou les réponses correctes.
                </p>

                {qOptions.map((opt, idx) => {
                  const isCorrect = qCorrectIndexes.includes(idx);
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleCorrectOption(idx)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                          isCorrect
                            ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-400'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title={isCorrect ? "Bonne réponse (cliquez pour décocher)" : "Cocher comme bonne réponse"}
                      >
                        {['A', 'B', 'C', 'D', 'E'][idx]}
                      </button>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...qOptions];
                          newOpts[idx] = e.target.value;
                          setQOptions(newOpts);
                        }}
                        placeholder={`Option ${['A', 'B', 'C', 'D', 'E'][idx]}...`}
                        className={`flex-1 p-2 bg-slate-950 border rounded-xl text-xs sm:text-sm text-white focus:outline-none transition-colors ${
                          isCorrect ? 'border-emerald-500/60 bg-emerald-950/20' : 'border-slate-700 focus:border-teal-500'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Explanation / Rationale */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Explication Détaillée & Rationale Clinique (Justification de la Réponse)
                </label>
                <textarea
                  rows={3}
                  value={qExplanationFr}
                  onChange={(e) => setQExplanationFr(e.target.value)}
                  placeholder="Expliquez pourquoi ces réponses sont correctes, avec références médicales ou pharmaceutiques..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500 leading-relaxed"
                />
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePreviewCurrentForm}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Aperçu Étudiant Réel</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveQuestion(true)}
                  className="px-4 py-2 border border-amber-600/40 hover:bg-amber-950/40 text-amber-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  Enregistrer Brouillon
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveQuestion(false)}
                  className="px-5 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{editingQuestionId ? 'Mettre à Jour' : 'Publier Immédiatement'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: LIVE PREVIEW MODAL */}
      {/* ========================================================================= */}
      {previewQuestionData && (
        <QuestionPreviewModal
          question={previewQuestionData}
          modules={modules}
          lessons={lessons}
          onClose={() => setPreviewQuestionData(null)}
          onPublish={showQuestionModal ? () => {
            setPreviewQuestionData(null);
            handleSaveQuestion(false);
          } : undefined}
          onSaveDraft={showQuestionModal ? () => {
            setPreviewQuestionData(null);
            handleSaveQuestion(true);
          } : undefined}
          isNewQuestion={!editingQuestionId}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL: MOVE QUESTION MODAL */}
      {/* ========================================================================= */}
      {movingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MoveRight className="w-4 h-4 text-teal-400" />
              Déplacer le QCM vers un autre chapitre
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sélectionnez le chapitre de destination pour la question :
              <br />
              <strong className="text-slate-200">"{movingQuestion.questionTextFr.slice(0, 80)}..."</strong>
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Chapitre / Leçon Cible
              </label>
              <select
                value={targetMoveLessonId}
                onChange={(e) => setTargetMoveLessonId(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
              >
                {lessons.map(l => {
                  const mod = modules.find(m => m.id === l.moduleId);
                  return (
                    <option key={l.id} value={l.id}>
                      {mod ? `[${mod.titleFr}] ` : ''}{l.titleFr}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setMovingQuestion(null)}
                className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-medium"
              >
                Annuler
              </button>
              <button
                onClick={async () => {
                  if (onMoveQuestion && targetMoveLessonId) {
                    await onMoveQuestion(movingQuestion.id, targetMoveLessonId);
                  }
                  setMovingQuestion(null);
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold"
              >
                Déplacer le QCM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PERMANENT DELETE CONFIRMATION */}
      {/* ========================================================================= */}
      {deleteConfirmQuestionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 border border-rose-900/60 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-950 border border-rose-600/40 flex items-center justify-center text-rose-400 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-white">Suppression Définitive</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Êtes-vous sûr de vouloir supprimer définitivement cette question de la base de données ? Cette action est irréversible.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmQuestionId(null)}
                className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-medium"
              >
                Annuler
              </button>
              <button
                onClick={async () => {
                  if (onPermanentDeleteQuestion && deleteConfirmQuestionId) {
                    await onPermanentDeleteQuestion(deleteConfirmQuestionId);
                  }
                  setDeleteConfirmQuestionId(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20"
              >
                Supprimer Définitivement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD MODULE */}
      {/* ========================================================================= */}
      {showAddModuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-400" />
                Ajouter une Matière / Module
              </h3>
              <button
                onClick={() => setShowAddModuleModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddModuleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Intitulé du Module (ex: Pharmacologie Médicale) *
                </label>
                <input
                  type="text"
                  required
                  value={newModTitleFr}
                  onChange={(e) => setNewModTitleFr(e.target.value)}
                  placeholder="Intitulé officiel..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Code Matière (ex: PHARM-PHARMA-3)
                </label>
                <input
                  type="text"
                  value={newModCode}
                  onChange={(e) => setNewModCode(e.target.value)}
                  placeholder="Code court..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Année Universitaire de rattachement
                </label>
                <select
                  value={newModYearId}
                  onChange={(e) => setNewModYearId(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                >
                  {academicYears
                    .filter(y => y.professionId === curriculumProfession)
                    .map(y => (
                      <option key={y.id} value={y.id}>{y.labelFr}</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Description succincte
                </label>
                <input
                  type="text"
                  value={newModDescFr}
                  onChange={(e) => setNewModDescFr(e.target.value)}
                  placeholder="Thématiques du programme..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModuleModal(false)}
                  className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Créer le Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD LESSON */}
      {/* ========================================================================= */}
      {showAddLessonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-400" />
                Ajouter une Leçon / Chapitre
              </h3>
              <button
                onClick={() => setShowAddLessonModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLessonSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Intitulé de la Leçon (ex: Anti-inflammatoires non stéroïdiens AINS) *
                </label>
                <input
                  type="text"
                  required
                  value={newLessonTitleFr}
                  onChange={(e) => setNewLessonTitleFr(e.target.value)}
                  placeholder="Intitulé du cours..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Module Parent
                </label>
                <select
                  value={lessonParentModuleId}
                  onChange={(e) => setLessonParentModuleId(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                >
                  {modules.map(m => (
                    <option key={m.id} value={m.id}>{m.titleFr}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Durée estimée d'apprentissage (minutes)
                </label>
                <input
                  type="number"
                  value={newLessonMinutes}
                  onChange={(e) => setNewLessonMinutes(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLessonModal(false)}
                  className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Ajouter la Leçon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADMIN WELCOME CHECKLIST */}
      {/* ========================================================================= */}
      {showChecklistModal && (
        <AdminWelcomeChecklistModal
          adminName={adminUser?.name || 'Administrateur'}
          checklist={checklist}
          onNavigateTab={(tab) => {
            setActiveTab(tab as any);
            setShowChecklistModal(false);
          }}
          onClose={() => setShowChecklistModal(false)}
        />
      )}
    </div>
  );
};

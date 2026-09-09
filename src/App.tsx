import React, { useState, useEffect, useCallback } from 'react';
import { 
  Language, 
  Theme, 
  UserRole, 
  User, 
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
} from './types';
import { 
  curriculumProfessions, 
  curriculumYears, 
  curriculumModules, 
  curriculumLessons, 
  curriculumQuestions, 
  initialSubscriptionConfig,
  initialReportedQuestions
} from './data/curriculum';
import { Header } from './components/Header';
import { LandingAuth } from './components/LandingAuth';
import { HierarchyNavigation } from './components/HierarchyNavigation';
import { MCQQuizView } from './components/MCQQuizView';
import { QuizResultsView } from './components/QuizResultsView';
import { ProgressAnalytics } from './components/ProgressAnalytics';
import { OnlineStudyRoom } from './components/OnlineStudyRoom';
import { SecureMessaging } from './components/SecureMessaging';
import { AdminDashboard } from './components/AdminDashboard';
import { PaymentReceiptModal } from './components/PaymentReceiptModal';
import { SupportModal } from './components/SupportModal';
import { FirstAdminSetup } from './components/FirstAdminSetup';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminWelcomeChecklistModal } from './components/AdminWelcomeChecklistModal';
import { AIExplanationModal } from './components/AIExplanationModal';
import {
  checkAdminStatus,
  getStoredAdminToken,
  getStoredAdminUser,
  removeStoredAdminToken,
  verifyAdminSession,
  fetchPublicContent,
  fetchAdminContent,
  apiSaveModule,
  apiDeleteModule,
  apiSaveLesson,
  apiDeleteLesson,
  apiSaveYear,
  apiSaveQuestion,
  apiSoftDeleteQuestion,
  apiRestoreQuestion,
  apiPermanentDeleteQuestion,
  apiDuplicateQuestion,
  apiMoveQuestion,
  apiResolveReport,
  apiResolveSuggestion,
  apiUpdatePricing,
  apiUpdateAnnouncement
} from './utils/api';

export default function App() {
  // App Config & Settings
  const [language, setLanguage] = useState<Language>('fr');
  const [theme, setTheme] = useState<Theme>('light');
  const [role, setRole] = useState<UserRole>('student');
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [announcement, setAnnouncement] = useState<string>(
    '📢 Inscriptions au Concours National de Résidanat (Session 2024/2025) : Les annales officielles sont à jour !'
  );

  // Admin Account & Auth
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isFirstAdminSetupOpen, setIsFirstAdminSetupOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isAdminChecklistModalOpen, setIsAdminChecklistModalOpen] = useState(false);

  // Subscription Configuration (controlled by Admin)
  const [subscriptionConfig, setSubscriptionConfig] = useState<SubscriptionConfig>(initialSubscriptionConfig);

  // Active Navigation View
  const [activeView, setActiveView] = useState<
    'landing' | 'hierarchy' | 'quiz' | 'results' | 'analytics' | 'study-room' | 'messages' | 'admin'
  >('landing');

  // Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [selectedAIQuestion, setSelectedAIQuestion] = useState<MCQQuestion | null>(null);

  // Authenticated User State (Student)
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr_amine_khelil',
    name: 'Dr. Amine Khelil',
    email: 'amine.khelil@univ-alger.dz',
    role: 'student',
    faculty: "Faculté de Médecine d'Alger",
    profession: 'pharmacy',
    academicYear: 5,
    academicYearId: 'pharma_y5',
    subscriptionStatus: 'trial',
    trialDaysRemaining: 7,
    streakDays: 8,
    totalStudyMinutes: 490,
    completedQuizzes: 34,
    proficiencyLevel: 'advanced',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    weakTopics: ['Pharmacocinétique Non-Linéaire', 'Anti-inflammatoires Stéroïdiens (Corticoïdes)', 'Insuffisance Rénale Aiguë'],
    strongTopics: ['Pharmacologie des AINS', 'Pharmacie Galénique - Formes Solides', 'Toxicologie des Salicylés'],
  });

  // Dynamic Database State (loaded from backend & synced in real-time)
  const [professions, setProfessions] = useState<Profession[]>(curriculumProfessions);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(curriculumYears);
  const [modules, setModules] = useState<SubjectModule[]>(curriculumModules);
  const [lessons, setLessons] = useState<LessonChapter[]>(curriculumLessons);
  const [questions, setQuestions] = useState<MCQQuestion[]>(curriculumQuestions);
  const [reportedQuestions, setReportedQuestions] = useState<ReportedQuestion[]>(initialReportedQuestions);
  const [suggestedQuestions, setSuggestedQuestions] = useState<StudentSuggestion[]>([]);
  const [checklist, setChecklist] = useState<AdminChecklist>({
    adminCreated: false,
    languagesConfigured: true,
    pharmacyConfigured: true,
    medicineConfigured: true,
    yearsConfigured: true,
    subjectsConfigured: true,
    lessonsConfigured: true,
    qcmsConfigured: true,
    pricingConfigured: true,
    settingsReviewed: true,
  });

  // Strict Hierarchy Selections
  const [selectedProfession, setSelectedProfession] = useState<Profession | null>(null);
  const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(null);
  const [selectedModule, setSelectedModule] = useState<SubjectModule | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<LessonChapter | null>(null);
  const [quizMode, setQuizMode] = useState<'training' | 'exam'>('training');

  // Active Quiz State
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<MCQQuestion[]>([]);
  const [quizResults, setQuizResults] = useState<{
    score: number;
    totalQuestions: number;
    correctCount: number;
    incorrectCount: number;
    timeSpentSeconds: number;
    answers: Record<string, number[]>;
  } | null>(null);

  // Apply Theme Classes to Document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-light', 'theme-dark', 'theme-pink', 'theme-royal-green');

    if (theme === 'dark') {
      root.classList.add('dark', 'theme-dark');
    } else if (theme === 'pink') {
      root.classList.add('theme-pink');
    } else if (theme === 'royal-green') {
      root.classList.add('theme-royal-green');
    } else {
      root.classList.add('theme-light');
    }
  }, [theme]);

  // Load Content from Backend
  const loadDynamicContent = useCallback(async () => {
    try {
      const data = await fetchPublicContent();
      if (data.professions?.length) setProfessions(data.professions);
      if (data.academicYears?.length) setAcademicYears(data.academicYears);
      if (data.modules?.length) setModules(data.modules);
      if (data.lessons?.length) setLessons(data.lessons);
      if (data.questions?.length) setQuestions(data.questions);
      if (data.subscriptionConfig) setSubscriptionConfig(data.subscriptionConfig);
      if (data.announcement) setAnnouncement(data.announcement);
    } catch (err) {
      console.warn('Using local fallback curriculum content:', err);
    }
  }, []);

  // Refresh full Admin Content
  const refreshAdminContent = useCallback(async () => {
    try {
      const data = await fetchAdminContent();
      if (data.professions?.length) setProfessions(data.professions);
      if (data.academicYears?.length) setAcademicYears(data.academicYears);
      if (data.modules?.length) setModules(data.modules);
      if (data.lessons?.length) setLessons(data.lessons);
      if (data.questions?.length) setQuestions(data.questions);
      if (data.reportedQuestions) setReportedQuestions(data.reportedQuestions);
      if (data.suggestedQuestions) setSuggestedQuestions(data.suggestedQuestions);
      if (data.subscriptionConfig) setSubscriptionConfig(data.subscriptionConfig);
      if (data.announcement) setAnnouncement(data.announcement);
      if (data.checklist) setChecklist(data.checklist);
    } catch (err) {
      console.error('Failed to load admin content:', err);
    }
  }, []);

  // Initial Boot: Check Super Admin Status and Verify Token
  useEffect(() => {
    async function initApp() {
      try {
        // 1. Check if first super admin setup is required
        const status = await checkAdminStatus();
        if (status.adminSetupRequired) {
          setIsFirstAdminSetupOpen(true);
        } else {
          // Check if admin is currently logged in
          const token = getStoredAdminToken();
          if (token) {
            const isValid = await verifyAdminSession();
            if (isValid) {
              const storedUser = getStoredAdminUser();
              if (storedUser) {
                setAdminUser(storedUser);
              }
            } else {
              removeStoredAdminToken();
            }
          }
        }

        // 2. Fetch public content
        await loadDynamicContent();
      } catch (err) {
        console.error('App init error:', err);
      }
    }

    initApp();
  }, [loadDynamicContent]);

  // Handle first admin setup completion
  const handleFirstAdminCreated = (admin: AdminUser) => {
    setAdminUser(admin);
    setRole('admin');
    setActiveView('admin');
    setIsFirstAdminSetupOpen(false);
    setIsAdminChecklistModalOpen(true);
    refreshAdminContent();
  };

  // Handle admin login success
  const handleAdminLoginSuccess = (admin: AdminUser) => {
    setAdminUser(admin);
    setRole('admin');
    setActiveView('admin');
    setIsAdminLoginModalOpen(false);
    refreshAdminContent();
  };

  // Handle admin logout
  const handleAdminLogout = () => {
    removeStoredAdminToken();
    setAdminUser(null);
    setRole('student');
    setActiveView('hierarchy');
  };

  // Login handler from landing page
  const handleLogin = (email: string, targetRole: 'student' | 'admin') => {
    if (targetRole === 'admin') {
      if (adminUser) {
        setRole('admin');
        setActiveView('admin');
        refreshAdminContent();
      } else {
        setIsAdminLoginModalOpen(true);
      }
      return;
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: 'Dr. Amine Khelil',
      email,
      role: 'student',
      faculty: "Faculté de Médecine d'Alger (Ziania)",
      profession: 'pharmacy',
      academicYear: 5,
      academicYearId: 'pharma_y5',
      subscriptionStatus: 'trial',
      trialDaysRemaining: 7,
      streakDays: 8,
      totalStudyMinutes: 490,
      completedQuizzes: 34,
      proficiencyLevel: 'advanced',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      weakTopics: ['Pharmacocinétique Non-Linéaire', 'Anti-inflammatoires Stéroïdiens', 'Insuffisance Rénale'],
      strongTopics: ['Pharmacologie des AINS', 'Pharmacie Galénique', 'Toxicologie Clinique'],
    };

    setCurrentUser(newUser);
    setRole('student');
    setActiveView('hierarchy');
  };

  // Toggle role switch (between Student and Admin)
  const handleRoleToggle = () => {
    if (role === 'admin') {
      setRole('student');
      setActiveView('hierarchy');
    } else {
      if (adminUser) {
        setRole('admin');
        setActiveView('admin');
        refreshAdminContent();
      } else {
        setIsAdminLoginModalOpen(true);
      }
    }
  };

  // Unified navigation router
  const handleNavigate = (view: 'hierarchy' | 'analytics' | 'study-room' | 'messages' | 'admin' | 'landing') => {
    if (view === 'landing') {
      setCurrentUser(null);
      setActiveView('landing');
    } else if (view === 'admin') {
      if (adminUser) {
        setRole('admin');
        setActiveView('admin');
        refreshAdminContent();
      } else {
        setIsAdminLoginModalOpen(true);
      }
    } else {
      setActiveView(view);
    }
  };

  // Hierarchy Navigation Handlers (Strict academic cascade)
  const handleSelectProfession = (p: Profession) => {
    setSelectedProfession(p);
    setSelectedYear(null);
    setSelectedModule(null);
    setSelectedLesson(null);
  };

  const handleSelectYear = (y: AcademicYear) => {
    setSelectedYear(y);
    setSelectedModule(null);
    setSelectedLesson(null);
  };

  const handleSelectModule = (m: SubjectModule) => {
    setSelectedModule(m);
    setSelectedLesson(null);
  };

  const handleSelectLesson = (l: LessonChapter) => {
    setSelectedLesson(l);
  };

  const handleResetToStep = (step: 'profession' | 'year' | 'module' | 'lesson') => {
    if (step === 'profession') {
      setSelectedProfession(null);
      setSelectedYear(null);
      setSelectedModule(null);
      setSelectedLesson(null);
    } else if (step === 'year') {
      setSelectedYear(null);
      setSelectedModule(null);
      setSelectedLesson(null);
    } else if (step === 'module') {
      setSelectedModule(null);
      setSelectedLesson(null);
    } else if (step === 'lesson') {
      setSelectedLesson(null);
    }
    setActiveView('hierarchy');
  };

  // Start MCQ Quiz
  const handleStartQuiz = () => {
    if (!selectedLesson) return;

    let lessonQs = questions.filter((q) => !q.isDeleted && !q.isDraft && q.lessonId === selectedLesson.id);
    if (lessonQs.length === 0) {
      lessonQs = questions.filter((q) => !q.isDeleted && !q.isDraft && q.moduleId === selectedModule?.id);
    }
    if (lessonQs.length === 0) {
      lessonQs = questions.filter((q) => !q.isDeleted && !q.isDraft);
    }

    setActiveQuizQuestions(lessonQs);
    setActiveView('quiz');
  };

  // Finish Quiz and update student stats
  const handleFinishQuiz = (results: {
    score: number;
    totalQuestions: number;
    correctCount: number;
    incorrectCount: number;
    timeSpentSeconds: number;
    answers: Record<string, number[]>;
  }) => {
    setQuizResults(results);

    if (currentUser) {
      const newMinutes = currentUser.totalStudyMinutes + Math.round(results.timeSpentSeconds / 60);
      const newCompleted = currentUser.completedQuizzes + 1;
      let newLevel = currentUser.proficiencyLevel;

      if (results.score >= 80 && newCompleted >= 30) {
        newLevel = 'expert';
      } else if (results.score >= 65) {
        newLevel = 'advanced';
      } else if (results.score >= 50) {
        newLevel = 'intermediate';
      }

      setCurrentUser({
        ...currentUser,
        totalStudyMinutes: newMinutes,
        completedQuizzes: newCompleted,
        proficiencyLevel: newLevel,
        streakDays: currentUser.streakDays,
      });
    }

    setActiveView('results');
  };

  // Lesson offline download simulation
  const handleDownloadLesson = (lessonId: string) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === lessonId ? { ...l, isDownloaded: !l.isDownloaded } : l))
    );
  };

  // Submit report on question
  const handleReportQuestion = async (questionId: string, reason: string, suggestion: string) => {
    const newReport: ReportedQuestion = {
      id: `rep_${Date.now()}`,
      questionId,
      studentName: currentUser?.name || 'Étudiant',
      reason,
      suggestion,
      timestamp: new Date().toLocaleDateString('fr-FR'),
      status: 'pending',
    };
    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport),
      });
    } catch {
      // Offline fallback
    }
    setReportedQuestions((prev) => [newReport, ...prev]);
  };

  // Post comment on question
  const handleAddComment = (questionId: string, text: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              comments: [
                ...q.comments,
                {
                  id: `comm_${Date.now()}`,
                  userName: currentUser?.name || 'Étudiant',
                  userAvatar: currentUser?.avatar || '',
                  text,
                  timestamp: "À l'instant",
                },
              ],
            }
          : q
      )
    );
  };

  // --- ADMIN MUTATION HANDLERS (Connected directly to persistent backend API) ---

  const handleAdminAddQuestion = async (newQ: Partial<MCQQuestion>) => {
    const saved = await apiSaveQuestion(newQ);
    setQuestions((prev) => [saved, ...prev.filter(q => q.id !== saved.id)]);
  };

  const handleAdminUpdateQuestion = async (id: string, updated: Partial<MCQQuestion>) => {
    const saved = await apiSaveQuestion({ ...updated, id });
    setQuestions((prev) => prev.map((q) => (q.id === id ? saved : q)));
  };

  const handleAdminSoftDeleteQuestion = async (id: string) => {
    await apiSoftDeleteQuestion(id);
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, isDeleted: true, deletedAt: new Date().toISOString() } : q)));
  };

  const handleAdminRestoreQuestion = async (id: string) => {
    await apiRestoreQuestion(id);
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, isDeleted: false, deletedAt: undefined } : q)));
  };

  const handleAdminPermanentDeleteQuestion = async (id: string) => {
    await apiPermanentDeleteQuestion(id);
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleAdminDuplicateQuestion = async (id: string) => {
    const duplicated = await apiDuplicateQuestion(id);
    setQuestions((prev) => [duplicated, ...prev]);
  };

  const handleAdminMoveQuestion = async (id: string, newLessonId: string, newModuleId?: string) => {
    const moved = await apiMoveQuestion(id, newLessonId, newModuleId);
    setQuestions((prev) => prev.map((q) => (q.id === id ? moved : q)));
  };

  const handleAdminResolveReport = async (reportId: string, action: 'approved' | 'dismissed') => {
    await apiResolveReport(reportId, action);
    setReportedQuestions((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action } : r))
    );
  };

  const handleAdminResolveSuggestion = async (suggestionId: string, action: 'approved' | 'rejected') => {
    await apiResolveSuggestion(suggestionId, action);
    setSuggestedQuestions((prev) =>
      prev.map((s) => (s.id === suggestionId ? { ...s, status: action } : s))
    );
  };

  const handleAdminAddModule = async (mod: Partial<SubjectModule>) => {
    const saved = await apiSaveModule(mod);
    setModules((prev) => {
      const idx = prev.findIndex(m => m.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [...prev, saved];
    });
  };

  const handleAdminDeleteModule = async (id: string) => {
    await apiDeleteModule(id);
    setModules((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAdminAddLesson = async (les: Partial<LessonChapter>) => {
    const saved = await apiSaveLesson(les);
    setLessons((prev) => {
      const idx = prev.findIndex(l => l.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [...prev, saved];
    });
  };

  const handleAdminDeleteLesson = async (id: string) => {
    await apiDeleteLesson(id);
    setLessons((prev) => prev.filter((l) => l.id !== id));
  };

  const handleAdminAddYear = async (year: Partial<AcademicYear>) => {
    const saved = await apiSaveYear(year);
    setAcademicYears((prev) => {
      const idx = prev.findIndex(y => y.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [...prev, saved];
    });
  };

  const handleAdminUpdatePricing = async (newConfig: SubscriptionConfig) => {
    const saved = await apiUpdatePricing(newConfig);
    setSubscriptionConfig(saved);
  };

  const handleAdminUpdateAnnouncement = async (newText: string) => {
    const saved = await apiUpdateAnnouncement(newText);
    setAnnouncement(saved);
  };

  // Subscription receipt approved
  const handleReceiptApproved = () => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        subscriptionStatus: 'active',
      });
    }
  };

  // Quick practice of weak topic
  const handlePracticeWeakTopic = (topic: string) => {
    const foundModule = modules.find((m) =>
      topic.toLowerCase().includes('ains') || topic.toLowerCase().includes('pharmac')
        ? m.id === 'mod_pharma_3'
        : m.id === 'mod_med_cardio'
    ) || modules[0];

    const prof = professions.find((p) => p.id === foundModule.professionId) || professions[0];
    const year = academicYears.find((y) => y.id === foundModule.academicYearId) || academicYears[0];
    const lesson = lessons.find((l) => l.moduleId === foundModule.id) || lessons[0];

    setSelectedProfession(prof);
    setSelectedYear(year);
    setSelectedModule(foundModule);
    setSelectedLesson(lesson);
    setQuizMode('training');
    setActiveQuizQuestions(questions.filter((q) => !q.isDeleted && !q.isDraft && q.moduleId === foundModule.id));
    setActiveView('quiz');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-teal-500 selection:text-white transition-colors duration-200">
      {/* Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeChange={setTheme}
        role={role}
        onRoleToggle={handleRoleToggle}
        isOffline={isOffline}
        onToggleOffline={() => setIsOffline(!isOffline)}
        user={currentUser}
        activeView={activeView}
        onNavigate={handleNavigate}
        onOpenSupport={() => setIsSupportModalOpen(true)}
        announcement={announcement}
      />

      {/* Main App Content Router */}
      <main className="flex-1">
        {/* VIEW 1: Landing / Auth Screen */}
        {activeView === 'landing' && (
          <LandingAuth
            language={language}
            subscriptionConfig={subscriptionConfig}
            onLogin={handleLogin}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
            onSelectLanguage={setLanguage}
          />
        )}

        {/* VIEW 2: Academic Hierarchy Navigation */}
        {activeView === 'hierarchy' && (
          <HierarchyNavigation
            language={language}
            professions={professions}
            academicYears={academicYears}
            modules={modules}
            lessons={lessons}
            selectedProfession={selectedProfession}
            selectedYear={selectedYear}
            selectedModule={selectedModule}
            selectedLesson={selectedLesson}
            quizMode={quizMode}
            onSelectProfession={handleSelectProfession}
            onSelectYear={handleSelectYear}
            onSelectModule={handleSelectModule}
            onSelectLesson={handleSelectLesson}
            onSetQuizMode={setQuizMode}
            onStartQuiz={handleStartQuiz}
            onResetToStep={handleResetToStep}
            onDownloadLesson={handleDownloadLesson}
          />
        )}

        {/* VIEW 3: Interactive MCQ Quiz */}
        {activeView === 'quiz' && selectedLesson && (
          <MCQQuizView
            language={language}
            questions={activeQuizQuestions}
            quizMode={quizMode}
            lessonTitle={language === 'fr' ? selectedLesson.titleFr : selectedLesson.titleEn}
            moduleTitle={language === 'fr' ? (selectedModule?.titleFr || '') : (selectedModule?.titleEn || '')}
            onFinishQuiz={handleFinishQuiz}
            onExitQuiz={() => setActiveView('hierarchy')}
            onReportQuestion={handleReportQuestion}
            onAddComment={handleAddComment}
          />
        )}

        {/* VIEW 4: Quiz Results & Review */}
        {activeView === 'results' && quizResults && selectedLesson && (
          <QuizResultsView
            language={language}
            score={quizResults.score}
            totalQuestions={quizResults.totalQuestions}
            correctCount={quizResults.correctCount}
            incorrectCount={quizResults.incorrectCount}
            timeSpentSeconds={quizResults.timeSpentSeconds}
            questions={activeQuizQuestions}
            userAnswers={quizResults.answers}
            lessonTitle={language === 'fr' ? selectedLesson.titleFr : selectedLesson.titleEn}
            moduleTitle={language === 'fr' ? (selectedModule?.titleFr || '') : (selectedModule?.titleEn || '')}
            proficiencyLevel={currentUser?.proficiencyLevel || 'intermediate'}
            onRetryQuiz={handleStartQuiz}
            onBackToLessons={() => setActiveView('hierarchy')}
            onAskAIExplanation={(q) => setSelectedAIQuestion(q)}
          />
        )}

        {/* VIEW 5: Student Progress & Analytics */}
        {activeView === 'analytics' && currentUser && (
          <ProgressAnalytics
            language={language}
            user={currentUser}
            onPracticeWeakTopic={handlePracticeWeakTopic}
            onBackToCurriculum={() => setActiveView('hierarchy')}
          />
        )}

        {/* VIEW 6: Virtual Study Room & Pomodoro */}
        {activeView === 'study-room' && currentUser && (
          <OnlineStudyRoom
            language={language}
            user={currentUser}
          />
        )}

        {/* VIEW 7: Secure Peer Messaging */}
        {activeView === 'messages' && currentUser && (
          <SecureMessaging
            language={language}
            currentUser={currentUser}
          />
        )}

        {/* VIEW 8: Administrator Control Dashboard */}
        {activeView === 'admin' && (
          <AdminDashboard
            language={language}
            adminUser={adminUser}
            professions={professions}
            academicYears={academicYears}
            modules={modules}
            lessons={lessons}
            questions={questions}
            reportedQuestions={reportedQuestions}
            suggestedQuestions={suggestedQuestions}
            subscriptionConfig={subscriptionConfig}
            announcement={announcement}
            checklist={checklist}
            onUpdateAnnouncement={handleAdminUpdateAnnouncement}
            onUpdateSubscriptionConfig={handleAdminUpdatePricing}
            onAddQuestion={handleAdminAddQuestion}
            onUpdateQuestion={handleAdminUpdateQuestion}
            onSoftDeleteQuestion={handleAdminSoftDeleteQuestion}
            onRestoreQuestion={handleAdminRestoreQuestion}
            onPermanentDeleteQuestion={handleAdminPermanentDeleteQuestion}
            onDuplicateQuestion={handleAdminDuplicateQuestion}
            onMoveQuestion={handleAdminMoveQuestion}
            onResolveReport={handleAdminResolveReport}
            onResolveSuggestion={handleAdminResolveSuggestion}
            onAddModule={handleAdminAddModule}
            onDeleteModule={handleAdminDeleteModule}
            onAddLesson={handleAdminAddLesson}
            onDeleteLesson={handleAdminDeleteLesson}
            onAddYear={handleAdminAddYear}
            onSwitchToStudentView={() => {
              setRole('student');
              setActiveView('hierarchy');
            }}
            onAdminLogout={handleAdminLogout}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">PharmedQuest DZ</span>
            <span>•</span>
            <span>{language === 'fr' ? 'Plateforme Médicale & Pharmaceutique Universitaire' : 'University Medical & Pharmacy Platform'}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setIsSupportModalOpen(true)} className="hover:underline">
              {language === 'fr' ? 'Aide & Contact CCP' : 'Help & CCP'}
            </button>
            <button onClick={() => alert('Conforme aux maquettes pédagogiques du Ministère de l Enseignement Supérieur (MESRS Algérie).')} className="hover:underline">
              {language === 'fr' ? 'Conformité MESRS' : 'Curriculum Compliance'}
            </button>
            <button onClick={() => setIsPaymentModalOpen(true)} className="text-teal-600 font-semibold hover:underline">
              {language === 'fr' ? 'BaridiMob 2500 DZD' : 'BaridiMob 2500 DZD'}
            </button>
          </div>
        </div>
      </footer>

      {/* First-Time Super Admin Setup Modal */}
      {isFirstAdminSetupOpen && (
        <FirstAdminSetup
          language={language}
          onAdminCreated={handleFirstAdminCreated}
          onCancel={() => setIsFirstAdminSetupOpen(false)}
        />
      )}

      {/* Admin Login Modal (When Owner/Admin wants to sign in) */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onSuccess={handleAdminLoginSuccess}
        onTriggerSetupIfRequired={() => setIsFirstAdminSetupOpen(true)}
      />

      {/* Admin Welcome Checklist Modal (After setup or opened from dashboard) */}
      {isAdminChecklistModalOpen && adminUser && (
        <AdminWelcomeChecklistModal
          adminName={adminUser.name}
          checklist={checklist}
          onNavigateTab={() => setIsAdminChecklistModalOpen(false)}
          onClose={() => setIsAdminChecklistModalOpen(false)}
        />
      )}

      {/* AI Deep Dive Explanation Modal */}
      <AIExplanationModal
        isOpen={!!selectedAIQuestion}
        onClose={() => setSelectedAIQuestion(null)}
        question={selectedAIQuestion}
        moduleTitle={language === 'fr' ? selectedModule?.titleFr : selectedModule?.titleEn}
        lessonTitle={language === 'fr' ? selectedLesson?.titleFr : selectedLesson?.titleEn}
        userAnswerIndexes={selectedAIQuestion && quizResults ? quizResults.answers[selectedAIQuestion.id] : []}
        language={language}
      />

      {/* Local Algerian Payment & Receipt Modal */}
      <PaymentReceiptModal
        language={language}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        subscriptionConfig={subscriptionConfig}
        onReceiptApproved={handleReceiptApproved}
      />

      {/* Support & FAQ Modal */}
      <SupportModal
        language={language}
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </div>
  );
}

import {
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

const ADMIN_TOKEN_KEY = 'pq_admin_token';
const ADMIN_USER_KEY = 'pq_admin_user';

export function getStoredAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setStoredAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function removeStoredAdminToken(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

export function getStoredAdminUser(): AdminUser | null {
  const raw = localStorage.getItem(ADMIN_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredAdminUser(user: AdminUser): void {
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

function getAuthHeaders(): Record<string, string> {
  const token = getStoredAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'x-admin-token': token } : {})
  };
}

// Check admin status (whether first setup is needed)
export async function checkAdminStatus(): Promise<{ adminSetupRequired: boolean; hasSuperAdmin: boolean }> {
  const res = await fetch('/api/auth/status');
  if (!res.ok) {
    throw new Error('Impossible de vérifier le statut administratif.');
  }
  return res.json();
}

// One-time super admin setup
export async function setupFirstAdmin(name: string, email: string, password: string): Promise<{ admin: AdminUser; token: string }> {
  const res = await fetch('/api/auth/setup-admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erreur lors de la configuration initiale de l\'administrateur.');
  }
  setStoredAdminToken(data.token);
  setStoredAdminUser(data.admin);
  return data;
}

// Admin login
export async function loginAdmin(email: string, password: string): Promise<{ admin: AdminUser; token: string }> {
  const res = await fetch('/api/auth/admin-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Identifiants administrateur incorrects.');
  }
  setStoredAdminToken(data.token);
  setStoredAdminUser(data.admin);
  return data;
}

// Verify admin token
export async function verifyAdminSession(): Promise<boolean> {
  const token = getStoredAdminToken();
  if (!token) return false;
  try {
    const res = await fetch('/api/auth/verify-admin', {
      headers: { 'x-admin-token': token },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Public content retrieval
export async function fetchPublicContent(): Promise<{
  professions: Profession[];
  academicYears: AcademicYear[];
  modules: SubjectModule[];
  lessons: LessonChapter[];
  questions: MCQQuestion[];
  subscriptionConfig: SubscriptionConfig;
  announcement: string;
}> {
  const res = await fetch('/api/content');
  if (!res.ok) {
    throw new Error('Erreur lors du chargement des données pédagogiques.');
  }
  return res.json();
}

// Admin content retrieval
export async function fetchAdminContent(): Promise<{
  professions: Profession[];
  academicYears: AcademicYear[];
  modules: SubjectModule[];
  lessons: LessonChapter[];
  questions: MCQQuestion[];
  reportedQuestions: ReportedQuestion[];
  suggestedQuestions: StudentSuggestion[];
  subscriptionConfig: SubscriptionConfig;
  announcement: string;
  checklist: AdminChecklist;
  stats: {
    totalQuestions: number;
    activeQuestions: number;
    draftQuestions: number;
    deletedQuestions: number;
    pendingReports: number;
    pendingSuggestions: number;
    totalModules: number;
    totalLessons: number;
  };
}> {
  const res = await fetch('/api/admin/content', {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Erreur de session administrateur.');
  }
  return res.json();
}

// Admin Operations
export async function apiSaveModule(moduleData: Partial<SubjectModule>): Promise<SubjectModule> {
  const res = await fetch('/api/admin/modules', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(moduleData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur lors de la sauvegarde du module.');
  }
  return res.json();
}

export async function apiDeleteModule(id: string): Promise<boolean> {
  const res = await fetch(`/api/admin/modules/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.ok;
}

export async function apiSaveLesson(lessonData: Partial<LessonChapter>): Promise<LessonChapter> {
  const res = await fetch('/api/admin/lessons', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(lessonData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur lors de la sauvegarde de la leçon.');
  }
  return res.json();
}

export async function apiDeleteLesson(id: string): Promise<boolean> {
  const res = await fetch(`/api/admin/lessons/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.ok;
}

export async function apiSaveYear(yearData: Partial<AcademicYear>): Promise<AcademicYear> {
  const res = await fetch('/api/admin/years', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(yearData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur lors de la sauvegarde de l\'année.');
  }
  return res.json();
}

export async function apiSaveQuestion(questionData: Partial<MCQQuestion>): Promise<MCQQuestion> {
  const res = await fetch('/api/admin/questions', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(questionData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur lors de la sauvegarde de la question.');
  }
  return res.json();
}

export async function apiSoftDeleteQuestion(id: string): Promise<boolean> {
  const res = await fetch(`/api/admin/questions/${id}/soft-delete`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return res.ok;
}

export async function apiRestoreQuestion(id: string): Promise<boolean> {
  const res = await fetch(`/api/admin/questions/${id}/restore`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return res.ok;
}

export async function apiPermanentDeleteQuestion(id: string): Promise<boolean> {
  const res = await fetch(`/api/admin/questions/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.ok;
}

export async function apiDuplicateQuestion(id: string): Promise<MCQQuestion> {
  const res = await fetch(`/api/admin/questions/${id}/duplicate`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur lors de la duplication.');
  }
  return res.json();
}

export async function apiMoveQuestion(id: string, newLessonId: string, newModuleId?: string): Promise<MCQQuestion> {
  const res = await fetch(`/api/admin/questions/${id}/move`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ newLessonId, newModuleId }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur lors du déplacement.');
  }
  return res.json();
}

export async function apiResolveReport(id: string, action: 'approved' | 'dismissed'): Promise<boolean> {
  const res = await fetch(`/api/admin/reports/${id}/resolve`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ action }),
  });
  return res.ok;
}

export async function apiResolveSuggestion(id: string, action: 'approved' | 'rejected'): Promise<boolean> {
  const res = await fetch(`/api/admin/suggestions/${id}/resolve`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ action }),
  });
  return res.ok;
}

export async function apiUpdatePricing(config: SubscriptionConfig): Promise<SubscriptionConfig> {
  const res = await fetch('/api/admin/pricing', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(config),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur lors de la mise à jour des tarifs.');
  }
  return res.json();
}

export async function apiUpdateAnnouncement(announcement: string): Promise<string> {
  const res = await fetch('/api/admin/announcements', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ announcement }),
  });
  const data = await res.json();
  return data.announcement;
}

export async function apiUpdateChecklist(checklist: Partial<AdminChecklist>): Promise<AdminChecklist> {
  const res = await fetch('/api/admin/checklist', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(checklist),
  });
  return res.json();
}

export async function apiAskAIExplanation(payload: {
  questionText: string;
  options: string[];
  correctAnswers: string[];
  language: 'fr' | 'en';
  profession?: string;
  moduleName?: string;
  lessonName?: string;
}): Promise<string> {
  const res = await fetch('/api/ai/explain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data.explanation;
}

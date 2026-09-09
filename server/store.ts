import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { 
  Profession, 
  AcademicYear, 
  SubjectModule, 
  LessonChapter, 
  MCQQuestion, 
  SubscriptionConfig,
  ReportedQuestion,
  StudentSuggestion,
  AdminChecklist
} from '../src/types';
import { 
  PROFESSIONS, 
  ACADEMIC_YEARS, 
  SUBJECT_MODULES, 
  LESSON_CHAPTERS, 
  MCQ_QUESTIONS, 
  INITIAL_SUBSCRIPTION_CONFIG,
  initialReportedQuestions 
} from '../src/data/curriculum';

export interface AdminAccountRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: 'super_admin';
  isOwner: true;
  createdAt: string;
}

export interface DatabaseSchema {
  admin: AdminAccountRecord | null;
  adminTokens: Record<string, { adminId: string; createdAt: string; expiresAt: number }>;
  checklist: AdminChecklist;
  professions: Profession[];
  academicYears: AcademicYear[];
  modules: SubjectModule[];
  lessons: LessonChapter[];
  questions: MCQQuestion[];
  reportedQuestions: ReportedQuestion[];
  suggestedQuestions: StudentSuggestion[];
  subscriptionConfig: SubscriptionConfig;
  announcement: string;
  enrolledStudentsCount: number;
  quizzesCompletedCount: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultChecklist: AdminChecklist = {
  adminCreated: false,
  languagesConfigured: true,
  pharmacyConfigured: true,
  medicineConfigured: true,
  yearsConfigured: true,
  subjectsConfigured: true,
  lessonsConfigured: true,
  qcmsConfigured: true,
  pricingConfigured: false,
  settingsReviewed: false,
};

const initialSuggestedQuestions: StudentSuggestion[] = [
  {
    id: 'sug-1',
    studentName: 'Dr. Mehdi Slimani (Résident R2)',
    studentEmail: 'mehdi.slimani@univ-alger.dz',
    professionId: 'medicine',
    academicYearId: 'med_y6',
    moduleId: 'mod_med_cardio',
    lessonId: 'les_med_cardio_1',
    questionText: "Quel est le délai maximal recommandé pour réaliser une angioplastie primaire (PCI) après premier contact médical dans le STEMI ?",
    options: [
      "Dans les 60 minutes",
      "Dans les 120 minutes (2 heures)",
      "Dans les 24 heures",
      "Dans les 48 heures",
      "Uniquement après fibrinolyse systématique"
    ],
    correctIndexes: [1],
    explanation: "Selon les recommandations ESC de prise en charge du syndrome coronarien avec sus-décalage de ST, le délai premier contact médical - ballonnet doit être inférieur à 120 minutes.",
    facultySource: "Faculté de Médecine d'Alger - EMD Urgences",
    difficulty: 'medium',
    isMultipleChoice: false,
    timestamp: '2024-10-18',
    status: 'pending'
  }
];

function getInitialDatabase(): DatabaseSchema {
  return {
    admin: null, // Starts as null so First-time Setup Flow triggers!
    adminTokens: {},
    checklist: defaultChecklist,
    professions: PROFESSIONS,
    academicYears: ACADEMIC_YEARS,
    modules: SUBJECT_MODULES,
    lessons: LESSON_CHAPTERS,
    questions: MCQ_QUESTIONS.map(q => ({
      ...q,
      isDraft: false,
      isDeleted: false,
      createdAt: '2024-01-01',
    })),
    reportedQuestions: initialReportedQuestions,
    suggestedQuestions: initialSuggestedQuestions,
    subscriptionConfig: INITIAL_SUBSCRIPTION_CONFIG,
    announcement: "📢 Plateforme PharmedQuest Algérie : La banque de QCMs officiels de résidanat et d'EMD est à jour !",
    enrolledStudentsCount: 10482,
    quizzesCompletedCount: 48920,
  };
}

let dbCache: DatabaseSchema | null = null;

export function getDatabase(): DatabaseSchema {
  if (dbCache) return dbCache;

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      dbCache = JSON.parse(raw);
      return dbCache!;
    } catch (e) {
      console.error('Error reading db.json, recreating initial DB:', e);
    }
  }

  const initial = getInitialDatabase();
  saveDatabase(initial);
  dbCache = initial;
  return dbCache;
}

export function saveDatabase(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    dbCache = data;
  } catch (e) {
    console.error('Error saving db.json:', e);
  }
}

// Password utilities
function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, generatedSalt, 64).toString('hex');
  return { hash, salt: generatedSalt };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const calculated = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(calculated, 'hex'), Buffer.from(hash, 'hex'));
  } catch (e) {
    return false;
  }
}

// Token generation
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// --- Admin Setup & Auth APIs ---

export function getAdminStatus(): {
  adminSetupRequired: boolean;
  adminExists: boolean;
  adminEmail?: string;
  adminName?: string;
} {
  const db = getDatabase();
  const exists = !!db.admin;
  return {
    adminSetupRequired: !exists,
    adminExists: exists,
    adminEmail: exists ? db.admin?.email : undefined,
    adminName: exists ? db.admin?.name : undefined,
  };
}

export function setupFirstAdmin(name: string, email: string, password: string): {
  success: boolean;
  admin: { id: string; name: string; email: string; role: string; isOwner: boolean };
  token: string;
} {
  const db = getDatabase();

  if (db.admin) {
    throw new Error('Le compte Administrateur Principal existe déjà. La configuration initiale est verrouillée définitivement.');
  }

  if (!name || name.trim().length < 2) {
    throw new Error("Veuillez fournir un nom d'administrateur valide.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    throw new Error("L'adresse e-mail de l'administrateur est invalide.");
  }

  if (!password || password.length < 8) {
    throw new Error('Le mot de passe doit comporter au moins 8 caractères.');
  }

  const { hash, salt } = hashPassword(password);
  const adminId = `admin_${Date.now()}`;
  const newAdmin: AdminAccountRecord = {
    id: adminId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: hash,
    salt,
    role: 'super_admin',
    isOwner: true,
    createdAt: new Date().toISOString(),
  };

  const token = generateToken();
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

  db.admin = newAdmin;
  db.adminTokens = {
    [token]: {
      adminId,
      createdAt: new Date().toISOString(),
      expiresAt,
    },
  };
  db.checklist.adminCreated = true;

  saveDatabase(db);

  return {
    success: true,
    admin: {
      id: newAdmin.id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: 'super_admin',
      isOwner: true,
    },
    token,
  };
}

export function loginAdmin(email: string, password: string): {
  success: boolean;
  admin: { id: string; name: string; email: string; role: string; isOwner: boolean };
  token: string;
} {
  const db = getDatabase();

  if (!db.admin) {
    throw new Error("Aucun compte administrateur n'a encore été créé. Veuillez procéder à la configuration initiale.");
  }

  if (db.admin.email.toLowerCase() !== email.trim().toLowerCase()) {
    throw new Error('Identifiants administrateur incorrects.');
  }

  const isValid = verifyPassword(password, db.admin.passwordHash, db.admin.salt);
  if (!isValid) {
    throw new Error('Identifiants administrateur incorrects.');
  }

  const token = generateToken();
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

  if (!db.adminTokens) db.adminTokens = {};
  db.adminTokens[token] = {
    adminId: db.admin.id,
    createdAt: new Date().toISOString(),
    expiresAt,
  };

  saveDatabase(db);

  return {
    success: true,
    admin: {
      id: db.admin.id,
      name: db.admin.name,
      email: db.admin.email,
      role: 'super_admin',
      isOwner: true,
    },
    token,
  };
}

export function verifyAdminToken(token?: string): boolean {
  if (!token) return false;
  const db = getDatabase();
  const session = db.adminTokens?.[token];
  if (!session) return false;
  if (session.expiresAt < Date.now()) {
    delete db.adminTokens[token];
    saveDatabase(db);
    return false;
  }
  return true;
}

// --- Content Queries ---

export function getPublicContent() {
  const db = getDatabase();
  // Filter out deleted questions and drafts for students
  const activeQuestions = db.questions.filter(q => !q.isDeleted && !q.isDraft);

  return {
    professions: db.professions,
    academicYears: db.academicYears,
    modules: db.modules,
    lessons: db.lessons,
    questions: activeQuestions,
    subscriptionConfig: db.subscriptionConfig,
    announcement: db.announcement,
  };
}

export function getAdminContent() {
  const db = getDatabase();
  return {
    professions: db.professions,
    academicYears: db.academicYears,
    modules: db.modules,
    lessons: db.lessons,
    questions: db.questions, // Includes drafts & soft-deleted
    reportedQuestions: db.reportedQuestions,
    suggestedQuestions: db.suggestedQuestions,
    subscriptionConfig: db.subscriptionConfig,
    announcement: db.announcement,
    checklist: db.checklist,
    stats: {
      totalQuestions: db.questions.filter(q => !q.isDeleted).length,
      publishedQuestions: db.questions.filter(q => !q.isDeleted && !q.isDraft).length,
      draftQuestions: db.questions.filter(q => !q.isDeleted && q.isDraft).length,
      deletedQuestions: db.questions.filter(q => q.isDeleted).length,
      pharmacyQuestions: db.questions.filter(q => !q.isDeleted && q.professionId === 'pharmacy').length,
      medicineQuestions: db.questions.filter(q => !q.isDeleted && q.professionId === 'medicine').length,
      modulesCount: db.modules.length,
      lessonsCount: db.lessons.length,
      pendingReportsCount: db.reportedQuestions.filter(r => r.status === 'pending').length,
      pendingSuggestionsCount: db.suggestedQuestions.filter(s => s.status === 'pending').length,
      enrolledStudents: db.enrolledStudentsCount,
      completedQuizzes: db.quizzesCompletedCount,
    },
  };
}

// --- Academic Structure Modifications ---

export function addOrUpdateModule(moduleData: Partial<SubjectModule>): SubjectModule {
  const db = getDatabase();
  let mod: SubjectModule;

  if (moduleData.id) {
    const idx = db.modules.findIndex(m => m.id === moduleData.id);
    if (idx !== -1) {
      db.modules[idx] = { ...db.modules[idx], ...moduleData } as SubjectModule;
      mod = db.modules[idx];
    } else {
      mod = moduleData as SubjectModule;
      db.modules.push(mod);
    }
  } else {
    mod = {
      id: `mod_${moduleData.professionId}_${Date.now()}`,
      academicYearId: moduleData.academicYearId || 'pharmacy-1',
      professionId: moduleData.professionId || 'pharmacy',
      yearNumber: moduleData.yearNumber || 1,
      titleFr: moduleData.titleFr || 'Nouveau Module',
      titleEn: moduleData.titleEn || 'New Subject',
      code: moduleData.code || 'MOD-NEW',
      icon: moduleData.icon || 'book-open',
      color: moduleData.color || 'from-teal-600 to-teal-800',
      descriptionFr: moduleData.descriptionFr || '',
      descriptionEn: moduleData.descriptionEn || '',
      lessonsCount: 0,
      questionCount: 0,
    };
    db.modules.push(mod);
  }

  // Update modulesCount on corresponding academicYear
  const yearIdx = db.academicYears.findIndex(y => y.id === mod.academicYearId);
  if (yearIdx !== -1) {
    db.academicYears[yearIdx].modulesCount = db.modules.filter(m => m.academicYearId === mod.academicYearId).length;
  }

  db.checklist.subjectsConfigured = true;
  saveDatabase(db);
  return mod;
}

export function deleteModule(moduleId: string): boolean {
  const db = getDatabase();
  const mod = db.modules.find(m => m.id === moduleId);
  if (!mod) return false;

  db.modules = db.modules.filter(m => m.id !== moduleId);
  // Also remove lessons and questions or reassign them
  db.lessons = db.lessons.filter(l => l.moduleId !== moduleId);
  db.questions = db.questions.filter(q => q.moduleId !== moduleId);

  // Update year count
  const yearIdx = db.academicYears.findIndex(y => y.id === mod.academicYearId);
  if (yearIdx !== -1) {
    db.academicYears[yearIdx].modulesCount = db.modules.filter(m => m.academicYearId === mod.academicYearId).length;
  }

  saveDatabase(db);
  return true;
}

export function addOrUpdateLesson(lessonData: Partial<LessonChapter>): LessonChapter {
  const db = getDatabase();
  let lesson: LessonChapter;

  if (lessonData.id) {
    const idx = db.lessons.findIndex(l => l.id === lessonData.id);
    if (idx !== -1) {
      db.lessons[idx] = { ...db.lessons[idx], ...lessonData } as LessonChapter;
      lesson = db.lessons[idx];
    } else {
      lesson = lessonData as LessonChapter;
      db.lessons.push(lesson);
    }
  } else {
    lesson = {
      id: `les_${Date.now()}`,
      moduleId: lessonData.moduleId || db.modules[0]?.id || 'mod-default',
      titleFr: lessonData.titleFr || 'Nouveau Chapitre',
      titleEn: lessonData.titleEn || 'New Chapter',
      questionCount: 0,
      estimatedMinutes: lessonData.estimatedMinutes || 25,
      downloadSize: '1.2 MB',
      isDownloaded: false,
      order: db.lessons.filter(l => l.moduleId === lessonData.moduleId).length + 1,
    };
    db.lessons.push(lesson);
  }

  // Update module lessonsCount
  const modIdx = db.modules.findIndex(m => m.id === lesson.moduleId);
  if (modIdx !== -1) {
    db.modules[modIdx].lessonsCount = db.lessons.filter(l => l.moduleId === lesson.moduleId).length;
  }

  db.checklist.lessonsConfigured = true;
  saveDatabase(db);
  return lesson;
}

export function deleteLesson(lessonId: string): boolean {
  const db = getDatabase();
  const lesson = db.lessons.find(l => l.id === lessonId);
  if (!lesson) return false;

  db.lessons = db.lessons.filter(l => l.id !== lessonId);
  db.questions = db.questions.filter(q => q.lessonId !== lessonId);

  const modIdx = db.modules.findIndex(m => m.id === lesson.moduleId);
  if (modIdx !== -1) {
    db.modules[modIdx].lessonsCount = db.lessons.filter(l => l.moduleId === lesson.moduleId).length;
  }

  saveDatabase(db);
  return true;
}

// --- Academic Years ---

export function addOrUpdateYear(yearData: Partial<AcademicYear>): AcademicYear {
  const db = getDatabase();
  let year: AcademicYear;

  if (yearData.id) {
    const idx = db.academicYears.findIndex(y => y.id === yearData.id);
    if (idx !== -1) {
      db.academicYears[idx] = { ...db.academicYears[idx], ...yearData } as AcademicYear;
      year = db.academicYears[idx];
    } else {
      year = yearData as AcademicYear;
      db.academicYears.push(year);
    }
  } else {
    const nextYearNum = db.academicYears.filter(y => y.professionId === yearData.professionId).length + 1;
    year = {
      id: `${yearData.professionId}-${nextYearNum}`,
      professionId: yearData.professionId || 'pharmacy',
      yearNumber: nextYearNum,
      labelFr: `${nextYearNum}ème Année ${yearData.professionId === 'pharmacy' ? 'Pharmacie' : 'Médecine'}`,
      labelEn: `${nextYearNum}th Year ${yearData.professionId === 'pharmacy' ? 'Pharmacy' : 'Medicine'}`,
      descriptionFr: yearData.descriptionFr || 'Programme académique universitaire',
      descriptionEn: yearData.descriptionEn || 'University academic curriculum',
      modulesCount: 0,
    };
    db.academicYears.push(year);
  }

  db.checklist.yearsConfigured = true;
  saveDatabase(db);
  return year;
}

// --- Questions CRUD ---

export function addOrUpdateQuestion(qData: Partial<MCQQuestion>): MCQQuestion {
  const db = getDatabase();
  let q: MCQQuestion;

  if (qData.id) {
    const idx = db.questions.findIndex(x => x.id === qData.id);
    if (idx !== -1) {
      db.questions[idx] = {
        ...db.questions[idx],
        ...qData,
        updatedAt: new Date().toISOString(),
      };
      q = db.questions[idx];
    } else {
      q = {
        ...qData,
        updatedAt: new Date().toISOString(),
      } as MCQQuestion;
      db.questions.unshift(q);
    }
  } else {
    q = {
      id: `q_${Date.now()}`,
      lessonId: qData.lessonId || db.lessons[0]?.id || '',
      moduleId: qData.moduleId || db.modules[0]?.id || '',
      professionId: qData.professionId || 'pharmacy',
      academicYearId: qData.academicYearId || 'pharmacy-1',
      facultySource: qData.facultySource || "Faculté de Médecine et Pharmacie d'Alger",
      examYear: qData.examYear || new Date().getFullYear(),
      questionTextFr: qData.questionTextFr || '',
      questionTextEn: qData.questionTextEn || qData.questionTextFr || '',
      optionsFr: qData.optionsFr || ['', '', '', ''],
      optionsEn: qData.optionsEn || qData.optionsFr || ['', '', '', ''],
      correctOptionIndexes: qData.correctOptionIndexes && qData.correctOptionIndexes.length > 0 ? qData.correctOptionIndexes : [0],
      isMultipleChoice: (qData.correctOptionIndexes?.length || 1) > 1,
      explanationFr: qData.explanationFr || '',
      explanationEn: qData.explanationEn || qData.explanationFr || '',
      difficulty: qData.difficulty || 'medium',
      comments: [],
      isDraft: qData.isDraft ?? false,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.questions.unshift(q);
  }

  // Recalculate module and lesson question counts
  recalcQuestionCounts(db);
  db.checklist.qcmsConfigured = true;
  saveDatabase(db);
  return q;
}

export function softDeleteQuestion(id: string): boolean {
  const db = getDatabase();
  const q = db.questions.find(x => x.id === id);
  if (!q) return false;
  q.isDeleted = true;
  q.deletedAt = new Date().toISOString();
  recalcQuestionCounts(db);
  saveDatabase(db);
  return true;
}

export function restoreQuestion(id: string): boolean {
  const db = getDatabase();
  const q = db.questions.find(x => x.id === id);
  if (!q) return false;
  q.isDeleted = false;
  delete q.deletedAt;
  recalcQuestionCounts(db);
  saveDatabase(db);
  return true;
}

export function permanentDeleteQuestion(id: string): boolean {
  const db = getDatabase();
  const countBefore = db.questions.length;
  db.questions = db.questions.filter(x => x.id !== id);
  if (db.questions.length !== countBefore) {
    recalcQuestionCounts(db);
    saveDatabase(db);
    return true;
  }
  return false;
}

export function duplicateQuestion(id: string): MCQQuestion | null {
  const db = getDatabase();
  const original = db.questions.find(x => x.id === id);
  if (!original) return null;

  const copy: MCQQuestion = {
    ...original,
    id: `q_copy_${Date.now()}`,
    questionTextFr: `${original.questionTextFr} (Copie)`,
    questionTextEn: `${original.questionTextEn} (Copy)`,
    isDraft: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [],
  };

  db.questions.unshift(copy);
  recalcQuestionCounts(db);
  saveDatabase(db);
  return copy;
}

export function moveQuestion(id: string, newLessonId: string, newModuleId?: string): MCQQuestion | null {
  const db = getDatabase();
  const q = db.questions.find(x => x.id === id);
  if (!q) return null;

  const targetLesson = db.lessons.find(l => l.id === newLessonId);
  q.lessonId = newLessonId;
  if (targetLesson) {
    q.moduleId = targetLesson.moduleId;
    const targetMod = db.modules.find(m => m.id === targetLesson.moduleId);
    if (targetMod) {
      q.professionId = targetMod.professionId;
      q.academicYearId = targetMod.academicYearId;
    }
  } else if (newModuleId) {
    q.moduleId = newModuleId;
  }

  q.updatedAt = new Date().toISOString();
  recalcQuestionCounts(db);
  saveDatabase(db);
  return q;
}

function recalcQuestionCounts(db: DatabaseSchema) {
  const activeQuestions = db.questions.filter(q => !q.isDeleted && !q.isDraft);

  // Update lessons
  for (const lesson of db.lessons) {
    lesson.questionCount = activeQuestions.filter(q => q.lessonId === lesson.id).length;
  }

  // Update modules
  for (const mod of db.modules) {
    mod.questionCount = activeQuestions.filter(q => q.moduleId === mod.id).length;
  }
}

// --- Reports & Suggestions ---

export function addReport(reportData: Omit<ReportedQuestion, 'id' | 'timestamp' | 'status'>): ReportedQuestion {
  const db = getDatabase();
  const rep: ReportedQuestion = {
    ...reportData,
    id: `rep_${Date.now()}`,
    timestamp: new Date().toLocaleDateString('fr-FR'),
    status: 'pending',
  };
  db.reportedQuestions.unshift(rep);
  saveDatabase(db);
  return rep;
}

export function resolveReport(id: string, action: 'approved' | 'dismissed'): boolean {
  const db = getDatabase();
  const rep = db.reportedQuestions.find(r => r.id === id);
  if (!rep) return false;
  rep.status = action;
  saveDatabase(db);
  return true;
}

export function addSuggestion(sugData: Omit<StudentSuggestion, 'id' | 'timestamp' | 'status'>): StudentSuggestion {
  const db = getDatabase();
  const sug: StudentSuggestion = {
    ...sugData,
    id: `sug_${Date.now()}`,
    timestamp: new Date().toLocaleDateString('fr-FR'),
    status: 'pending',
  };
  db.suggestedQuestions.unshift(sug);
  saveDatabase(db);
  return sug;
}

export function resolveSuggestion(id: string, action: 'approved' | 'rejected'): { success: boolean; publishedQuestion?: MCQQuestion } {
  const db = getDatabase();
  const sug = db.suggestedQuestions.find(s => s.id === id);
  if (!sug) return { success: false };

  sug.status = action;

  if (action === 'approved') {
    // Convert suggestion to official MCQ and publish
    const newQ: MCQQuestion = {
      id: `q_sug_${Date.now()}`,
      lessonId: sug.lessonId,
      moduleId: sug.moduleId,
      professionId: sug.professionId,
      academicYearId: sug.academicYearId,
      facultySource: sug.facultySource || "Proposition étudiante validée par le comité",
      examYear: new Date().getFullYear(),
      questionTextFr: sug.questionText,
      questionTextEn: sug.questionText,
      optionsFr: sug.options,
      optionsEn: sug.options,
      correctOptionIndexes: sug.correctIndexes,
      isMultipleChoice: sug.isMultipleChoice,
      explanationFr: sug.explanation,
      explanationEn: sug.explanation,
      difficulty: sug.difficulty,
      comments: [],
      isDraft: false,
      isDeleted: false,
      createdAt: new Date().toISOString(),
    };
    db.questions.unshift(newQ);
    recalcQuestionCounts(db);
    saveDatabase(db);
    return { success: true, publishedQuestion: newQ };
  }

  saveDatabase(db);
  return { success: true };
}

// --- Subscriptions & Announcements & Checklist ---

export function updateSubscriptionConfig(config: SubscriptionConfig): SubscriptionConfig {
  const db = getDatabase();
  db.subscriptionConfig = { ...db.subscriptionConfig, ...config };
  db.checklist.pricingConfigured = true;
  saveDatabase(db);
  return db.subscriptionConfig;
}

export function updateAnnouncement(text: string): string {
  const db = getDatabase();
  db.announcement = text;
  saveDatabase(db);
  return db.announcement;
}

export function updateChecklist(itemKey: keyof AdminChecklist, value: boolean): AdminChecklist {
  const db = getDatabase();
  db.checklist[itemKey] = value;
  saveDatabase(db);
  return db.checklist;
}

export type Language = 'fr' | 'en';
export type Theme = 'light' | 'dark' | 'pink' | 'royal-green';
export type UserRole = 'student' | 'admin';
export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  profession: 'pharmacy' | 'medicine' | null;
  academicYear: number | null;
  academicYearId?: string;
  faculty: string;
  subscriptionStatus: 'active' | 'trial' | 'expired';
  subscriptionPlan?: 'monthly' | 'yearly' | 'free_trial';
  subscriptionExpiryDate?: string;
  trialDaysRemaining?: number;
  streakDays: number;
  totalStudyMinutes: number;
  proficiencyLevel: ProficiencyLevel;
  completedQuizzes: number;
  completedQuizzesCount?: number;
  totalQuestionsAnswered?: number;
  correctQuestionsCount?: number;
  weakTopics: string[];
  strongTopics: string[];
}

export interface Profession {
  id: 'pharmacy' | 'medicine';
  nameFr: string;
  nameEn: string;
  subtitleFr: string;
  subtitleEn: string;
  totalYears: number;
  icon: string;
  color: string;
}

export interface AcademicYear {
  id: string; // e.g. "pharmacy-3"
  professionId: 'pharmacy' | 'medicine';
  yearNumber: number;
  labelFr: string;
  labelEn: string;
  descriptionFr: string;
  descriptionEn: string;
  modulesCount: number;
}

export interface SubjectModule {
  id: string; // e.g. "pharm-3-pharmacology"
  academicYearId: string;
  professionId: 'pharmacy' | 'medicine';
  yearNumber: number;
  titleFr: string;
  titleEn: string;
  code: string;
  icon: string;
  color: string;
  descriptionFr: string;
  descriptionEn: string;
  lessonsCount: number;
  questionCount: number;
  isPopular?: boolean;
}

export interface LessonChapter {
  id: string; // e.g. "pharm-3-pharmaco-nsaid"
  moduleId: string;
  titleFr: string;
  titleEn: string;
  questionCount: number;
  estimatedMinutes: number;
  downloadSize: string;
  isDownloaded: boolean;
  order: number;
}

export interface MCQComment {
  id: string;
  userName: string;
  userAvatar: string;
  faculty: string;
  text: string;
  timestamp: string;
}

export interface MCQQuestion {
  id: string;
  lessonId: string;
  moduleId: string;
  professionId?: 'pharmacy' | 'medicine';
  academicYearId?: string;
  facultySource: string; // e.g. "Faculté de Médecine d'Alger (Résidanat 2023)"
  examYear: number;
  questionTextFr: string;
  questionTextEn: string;
  optionsFr: string[];
  optionsEn: string[];
  correctOptionIndexes: number[]; // e.g. [1] or [0, 2] for multiple
  isMultipleChoice: boolean;
  explanationFr: string;
  explanationEn: string;
  difficulty: 'easy' | 'medium' | 'hard';
  comments: MCQComment[];
  isDraft?: boolean;
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentSuggestion {
  id: string;
  studentName: string;
  studentEmail?: string;
  professionId: 'pharmacy' | 'medicine';
  academicYearId: string;
  moduleId: string;
  lessonId: string;
  questionText: string;
  options: string[];
  correctIndexes: number[];
  explanation: string;
  facultySource: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isMultipleChoice: boolean;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AdminChecklist {
  adminCreated: boolean;
  languagesConfigured: boolean;
  pharmacyConfigured: boolean;
  medicineConfigured: boolean;
  yearsConfigured: boolean;
  subjectsConfigured: boolean;
  lessonsConfigured: boolean;
  qcmsConfigured: boolean;
  pricingConfigured: boolean;
  settingsReviewed: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin';
  isOwner: boolean;
  createdAt: string;
}

export interface ReportedQuestion {
  id: string;
  questionId: string;
  studentName: string;
  reason: string;
  suggestion: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'dismissed';
}

export interface QuizAttempt {
  id: string;
  lessonId: string;
  lessonTitle: string;
  moduleTitle: string;
  professionId: 'pharmacy' | 'medicine';
  academicYearNumber: number;
  timestamp: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  percentage: number;
  timeSpentSeconds: number;
  estimatedPercentileRank: number; // e.g. 92%
  answers: Record<string, number[]>; // questionId -> selectedIndexes
}

export interface QuestionReport {
  id: string;
  questionId: string;
  questionText: string;
  lessonTitle: string;
  studentName: string;
  studentEmail: string;
  reason: string;
  suggestedCorrection: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface StudyPeer {
  id: string;
  name: string;
  avatar: string;
  profession: 'pharmacy' | 'medicine';
  year: number;
  faculty: string;
  currentActivity: string;
  isOnline: boolean;
  isPomodoroActive: boolean;
  pomodoroMinutesRemaining: number;
  reactionsCount: number;
}

export interface SubscriptionConfig {
  yearlyPriceDZD: number;
  monthlyPriceDZD: number;
  freeTrialDays: number;
  ccpNumber: string;
  ccpKey: string;
  ccpHolder: string;
  baridiMobRip: string;
  baridiMobPhone: string;
  activeAnnouncementFr: string;
  activeAnnouncementEn: string;
  announcementEnabled: boolean;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isSelf: boolean;
}

export interface Conversation {
  peerId: string;
  peerName: string;
  peerAvatar: string;
  peerFaculty: string;
  peerProfession: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  isBlocked: boolean;
}

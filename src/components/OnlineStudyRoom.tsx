import React, { useState, useEffect } from 'react';
import { Language, User } from '../types';
import { translations } from '../utils/translations';
import { playChimeSound } from '../utils/audio';
import { 
  Users, 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Sparkles, 
  Heart, 
  Flame, 
  GraduationCap,
  Volume2
} from 'lucide-react';

interface OnlineStudyRoomProps {
  language: Language;
  user: User;
}

interface Peer {
  id: string;
  name: string;
  faculty: string;
  currentModule: string;
  avatar: string;
  isFocusing: boolean;
  minutesFocusToday: number;
}

export const OnlineStudyRoom: React.FC<OnlineStudyRoomProps> = ({
  language,
  user,
}) => {
  const t = translations[language];

  // Pomodoro states
  const [pomodoroMode, setPomodoroMode] = useState<'work' | 'break'>('work');
  const [workDurationMinutes, setWorkDurationMinutes] = useState(25);
  const [breakDurationMinutes, setBreakDurationMinutes] = useState(5);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(3);

  // Floating encouragement toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live peers mock data
  const [peers, setPeers] = useState<Peer[]>([
    {
      id: 'p1',
      name: 'Dr. Yasmine B.',
      faculty: 'Faculté de Médecine d Alger (Ziania)',
      currentModule: 'Cardiologie - HTA & Insuffisance Cardiaque',
      avatar: 'https://images.unsplash.com/photo-1594824813580-0a37952737a4?w=150&auto=format&fit=crop&q=80',
      isFocusing: true,
      minutesFocusToday: 180,
    },
    {
      id: 'p2',
      name: 'Amine K.',
      faculty: 'Faculté de Pharmacie d Alger',
      currentModule: 'Pharmacologie Clinique - AINS',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      isFocusing: true,
      minutesFocusToday: 210,
    },
    {
      id: 'p3',
      name: 'Nadia S.',
      faculty: 'Faculté de Médecine d Oran',
      currentModule: 'Pneumologie - Asthme & BPCO',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
      isFocusing: true,
      minutesFocusToday: 145,
    },
    {
      id: 'p4',
      name: 'Karim M.',
      faculty: 'CHU Benbadis Constantine',
      currentModule: 'Pharmacie Galénique - Formes Sèches',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
      isFocusing: false,
      minutesFocusToday: 95,
    },
    {
      id: 'p5',
      name: 'Ines T.',
      faculty: 'Faculté de Médecine de Sétif',
      currentModule: 'Neurologie - AVC Ischémique',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      isFocusing: true,
      minutesFocusToday: 160,
    },
  ]);

  // Pomodoro countdown effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timeLeftSeconds === 0) {
      playChimeSound('pomodoro');
      if (pomodoroMode === 'work') {
        setCompletedSessions((prev) => prev + 1);
        setPomodoroMode('break');
        setTimeLeftSeconds(breakDurationMinutes * 60);
        showEncouragement(language === 'fr' ? '🎉 Session terminée ! Prenez 5 minutes de pause méritée.' : '🎉 Session complete! Enjoy your 5-min break.');
      } else {
        setPomodoroMode('work');
        setTimeLeftSeconds(workDurationMinutes * 60);
        showEncouragement(language === 'fr' ? '💪 Prêt pour une nouvelle session de focus ?' : '💪 Ready for another focus session?');
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeftSeconds, pomodoroMode, workDurationMinutes, breakDurationMinutes, language]);

  const showEncouragement = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleToggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeftSeconds((pomodoroMode === 'work' ? workDurationMinutes : breakDurationMinutes) * 60);
  };

  const handleChangeDuration = (workMin: number, breakMin: number) => {
    setIsTimerRunning(false);
    setWorkDurationMinutes(workMin);
    setBreakDurationMinutes(breakMin);
    setTimeLeftSeconds(workMin * 60);
    setPomodoroMode('work');
  };

  const handleSendKudos = (peerName: string, reaction: string) => {
    showEncouragement(`${reaction} ${language === 'fr' ? 'Envoyé avec succès à' : 'Sent to'} ${peerName} !`);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              {language === 'fr' ? '142 Étudiants en ligne actuellement' : '142 Students studying live'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t.studyRoomTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.studyRoomSubtitle}
          </p>
        </div>
      </div>

      {/* Grid: Left Pomodoro Timer & Stats, Right Live Peer Room */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 5 Cols: Pomodoro Timer */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border-2 border-teal-500/30 dark:border-teal-500/40 text-center space-y-6 shadow-sm">
            {/* Mode Tag */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handleChangeDuration(25, 5)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  workDurationMinutes === 25
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                25 / 5 min
              </button>
              <button
                onClick={() => handleChangeDuration(50, 10)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  workDurationMinutes === 50
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                50 / 10 min
              </button>
            </div>

            {/* Circular Timer Visual */}
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-slate-100 dark:stroke-slate-800"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-teal-600 transition-all duration-1000"
                  strokeWidth="6"
                  strokeDasharray={276.46}
                  strokeDashoffset={
                    276.46 -
                    (276.46 *
                      timeLeftSeconds) /
                      ((pomodoroMode === 'work' ? workDurationMinutes : breakDurationMinutes) * 60)
                  }
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                  {formatTime(timeLeftSeconds)}
                </span>
                <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mt-1">
                  {pomodoroMode === 'work' ? (language === 'fr' ? 'Session Focus' : 'Focus Session') : (language === 'fr' ? 'Pause Café' : 'Coffee Break')}
                </span>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleToggleTimer}
                className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>{t.pause}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>{t.startTimer}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResetTimer}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={t.resetTimer}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Session Stats */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-center">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold">{language === 'fr' ? 'Sessions aujourd hui' : 'Sessions today'}</span>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{completedSessions} cycles</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold">{language === 'fr' ? 'Temps de focus' : 'Focus time'}</span>
                <p className="text-lg font-bold text-teal-600 dark:text-teal-400 mt-0.5">{completedSessions * 25} min</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Live Peers in Algeria */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-teal-600" />
              <span>{language === 'fr' ? 'Étudiants en révision active' : 'Live Studying Peers'}</span>
            </h3>
            <span className="text-xs text-slate-500">
              {language === 'fr' ? 'Facultés d Alger, Oran, Constantine...' : 'Alger, Oran, Constantine...'}
            </span>
          </div>

          <div className="space-y-3">
            {peers.map((peer) => (
              <div
                key={peer.id}
                className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-500/20"
                    />
                    {peer.isFocusing && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{peer.name}</h4>
                      <span className="text-[10px] text-teal-700 dark:text-teal-400 font-medium">
                        {peer.faculty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                      📖 {peer.currentModule}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {peer.minutesFocusToday} min de focus aujourd hui
                    </span>
                  </div>
                </div>

                {/* Encouragement Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => handleSendKudos(peer.name, '☕')}
                    className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 hover:scale-110 transition-transform"
                    title="Offrir un café"
                  >
                    ☕
                  </button>
                  <button
                    onClick={() => handleSendKudos(peer.name, '🔥')}
                    className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 hover:scale-110 transition-transform"
                    title="Courage !"
                  >
                    🔥
                  </button>
                  <button
                    onClick={() => handleSendKudos(peer.name, '👏')}
                    className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 hover:scale-110 transition-transform"
                    title="Bravo"
                  >
                    👏
                  </button>
                  <button
                    onClick={() => handleSendKudos(peer.name, '🧠')}
                    className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 hover:scale-110 transition-transform"
                    title="Focus maximal"
                  >
                    🧠
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

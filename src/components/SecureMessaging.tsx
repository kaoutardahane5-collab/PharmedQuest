import React, { useState } from 'react';
import { Language, User } from '../types';
import { translations } from '../utils/translations';
import { 
  MessageSquare, 
  Send, 
  ShieldAlert, 
  UserX, 
  CheckCheck, 
  Search,
  Lock,
  GraduationCap
} from 'lucide-react';

interface SecureMessagingProps {
  language: Language;
  currentUser: User;
}

interface Conversation {
  id: string;
  peerName: string;
  peerFaculty: string;
  peerAvatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  messages: {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
  }[];
}

export const SecureMessaging: React.FC<SecureMessagingProps> = ({
  language,
  currentUser,
}) => {
  const t = translations[language];

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'c1',
      peerName: 'Dr. Yasmine B.',
      peerFaculty: 'Résidente CHU Mustapha Bacha Alger',
      peerAvatar: 'https://images.unsplash.com/photo-1594824813580-0a37952737a4?w=150&auto=format&fit=crop&q=80',
      lastMessage: 'Pour le QCM sur l Insuffisance Cardiaque, rappelle-toi que les bêta-bloquants sont contre-indiqués en poussée aiguë.',
      timestamp: '14:22',
      unread: true,
      messages: [
        {
          id: 'm1',
          senderId: 'currentUser',
          text: 'Salut Yasmine ! Est-ce que tu as une astuce pour retenir les contre-indications des bêta-bloquants en cardio ?',
          timestamp: '14:15',
        },
        {
          id: 'm2',
          senderId: 'c1',
          text: 'Salut ! Utilise le mnémonique B-A-S-H : Bradycardie, Asthme/BPCO sévère, Shock cardiogénique, et BAV haut degré.',
          timestamp: '14:18',
        },
        {
          id: 'm3',
          senderId: 'c1',
          text: 'Pour le QCM sur l Insuffisance Cardiaque, rappelle-toi que les bêta-bloquants sont contre-indiqués en poussée aiguë.',
          timestamp: '14:22',
        },
      ],
    },
    {
      id: 'c2',
      peerName: 'Amine K.',
      peerFaculty: '5ème Année Pharmacie Alger',
      peerAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      lastMessage: 'Oui, la biodisponibilité IV est toujours égale à 1 (100%).',
      timestamp: 'Hier',
      unread: false,
      messages: [
        {
          id: 'm4',
          senderId: 'currentUser',
          text: 'Est-ce que tu révises la pharmacocinétique ce soir ?',
          timestamp: 'Hier 19:10',
        },
        {
          id: 'm5',
          senderId: 'c2',
          text: 'Oui, la biodisponibilité IV est toujours égale à 1 (100%).',
          timestamp: 'Hier 19:15',
        },
      ],
    },
  ]);

  const [activeConvId, setActiveConvId] = useState<string>('c1');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    const newMessage = {
      id: `m_${Date.now()}`,
      senderId: 'currentUser',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConv.id
          ? {
              ...c,
              lastMessage: inputText,
              timestamp: 'À l instant',
              messages: [...c.messages, newMessage],
            }
          : c
      )
    );

    setInputText('');
  };

  const handleBlockUser = () => {
    setActionNotice(language === 'fr' ? 'Utilisateur bloqué. Vous ne recevrez plus de messages.' : 'User blocked.');
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleReportUser = () => {
    setActionNotice(language === 'fr' ? 'Signalement transmis à l administration.' : 'Report submitted to moderation.');
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            {language === 'fr' ? 'Messagerie Étudiante Sécurisée' : 'Secure Student Messaging'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t.messagesTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-teal-600" />
            <span>{t.messagesSafeNotice}</span>
          </p>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 rounded-xl text-xs text-teal-800 dark:text-teal-300 transition-all">
          {actionNotice}
        </div>
      )}

      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
        {/* Left Side: Conversations List (4 cols) */}
        <div className="md:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col">
          {/* Search bar */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={language === 'fr' ? 'Rechercher un collègue...' : 'Search peer...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none w-full text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {conversations.map((conv) => {
              const isSelected = conv.id === activeConvId;
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-teal-950/40'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <img
                    src={conv.peerAvatar}
                    alt={conv.peerName}
                    className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {conv.peerName}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1">{conv.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-teal-700 dark:text-teal-400 font-medium truncate">
                      {conv.peerFaculty}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Chat Window (8 cols) */}
        {activeConv ? (
          <div className="md:col-span-8 flex flex-col h-[520px]">
            {/* Chat header */}
            <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activeConv.peerAvatar}
                  alt={activeConv.peerName}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-none">
                    {activeConv.peerName}
                  </h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {activeConv.peerFaculty}
                  </span>
                </div>
              </div>

              {/* Moderation actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleReportUser}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs transition-colors"
                  title={t.reportUser}
                >
                  <ShieldAlert className="w-4 h-4" />
                </button>
                <button
                  onClick={handleBlockUser}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs transition-colors"
                  title={t.blockUser}
                >
                  <UserX className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-900/30">
              {activeConv.messages.map((m) => {
                const isMe = m.senderId === 'currentUser';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                        isMe
                          ? 'bg-teal-700 text-white rounded-br-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-xs'
                      }`}
                    >
                      <p className="leading-relaxed">{m.text}</p>
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 px-1">
                      {m.timestamp}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Input field */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.typeMessagePlaceholder}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-teal-600"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1 transition-all"
              >
                <span>{t.sendMessage}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        ) : (
          <div className="md:col-span-8 flex items-center justify-center text-xs text-slate-400 p-8">
            Sélectionnez une discussion
          </div>
        )}
      </div>
    </div>
  );
};

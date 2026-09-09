import React from 'react';
import { Language } from '../types';
import { HelpCircle, Mail, Phone, BookOpen, ShieldCheck } from 'lucide-react';

interface SupportModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  language,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel max-w-lg w-full p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
            <HelpCircle className="w-5 h-5" />
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              {language === 'fr' ? 'Centre d Aide & Support Étudiant' : 'Help & Student Support'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white">
              {language === 'fr' ? 'Comment s organise la navigation ?' : 'How does navigation work?'}
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'fr' 
                ? 'La progression est rigoureusement hiérarchique : Filière (Pharmacie/Médecine) → Année d étude → Module (ex: Pharmacologie) → Cours (ex: AINS) → QCMs. Vous ne pouvez pas sauter d étapes afin de garantir une assimilation méthodique.'
                : 'Navigation follows a strict hierarchy: Profession → Academic Year → Module → Lesson → MCQs.'}
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white">
              {language === 'fr' ? 'Comment payer par CCP ou BaridiMob ?' : 'Payment via CCP or BaridiMob'}
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'fr'
                ? 'Effectuez un virement de 2500 DZD vers le compte CCP ou BaridiMob affiché sur la page d accueil. Ensuite, cliquez sur « Télécharger le reçu » pour activer instantanément votre accès.'
                : 'Transfer the 2500 DZD fee via CCP or BaridiMob and upload the receipt.'}
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white">
              {language === 'fr' ? 'D où proviennent les QCMs ?' : 'Where do MCQs come from?'}
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'fr'
                ? 'Les questions sont tirées des annales officielles des concours de résidanat et des épreuves EMD des facultés d Alger, d Oran, de Constantine, de Sétif et d Annaba. Elles sont révisées par des résidents et enseignants.'
                : 'Questions come from official residency examinations across Algerian medical and pharmacy faculties.'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-slate-500">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              <span>contact@pharmedquest.dz</span>
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Alger, Algérie</span>
            </span>
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

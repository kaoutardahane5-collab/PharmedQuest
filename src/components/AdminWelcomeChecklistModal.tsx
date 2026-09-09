import React from 'react';
import { CheckCircle2, Circle, ArrowRight, X, Sparkles, BookOpen, Layers, DollarSign, Settings, GraduationCap, ShieldCheck } from 'lucide-react';
import { AdminChecklist } from '../types';

interface AdminWelcomeChecklistModalProps {
  adminName: string;
  checklist: AdminChecklist;
  onNavigateTab: (tab: 'content' | 'questions' | 'reports' | 'pricing' | 'announcements' | 'settings') => void;
  onClose: () => void;
}

export const AdminWelcomeChecklistModal: React.FC<AdminWelcomeChecklistModalProps> = ({
  adminName,
  checklist,
  onNavigateTab,
  onClose,
}) => {
  const steps = [
    {
      id: 'adminCreated',
      label: 'Compte Administrateur Principal initialisé',
      desc: 'Votre profil OWNER / SUPER ADMIN est configuré et sécurisé.',
      completed: checklist.adminCreated,
      icon: ShieldCheck,
      tab: 'settings' as const,
    },
    {
      id: 'languagesConfigured',
      label: 'Définir les langues de la plateforme (Français & Anglais)',
      desc: 'Les étudiants peuvent basculer entre le français et l’anglais instantanément.',
      completed: checklist.languagesConfigured,
      icon: Settings,
      tab: 'settings' as const,
    },
    {
      id: 'pharmacyConfigured',
      label: 'Configurer le cursus Pharmacie (1ère à 5ème Année)',
      desc: 'Organisez les années universitaires, les semestres et les matières.',
      completed: checklist.pharmacyConfigured,
      icon: GraduationCap,
      tab: 'content' as const,
    },
    {
      id: 'medicineConfigured',
      label: 'Configurer le cursus Médecine (1ère à 6ème Année)',
      desc: 'Modules cliniques, pédiatrie, cardiologie, chirurgie et stages.',
      completed: checklist.medicineConfigured,
      icon: GraduationCap,
      tab: 'content' as const,
    },
    {
      id: 'yearsConfigured',
      label: 'Vérifier ou ajouter des années académiques personnalisées',
      desc: 'Créez des cohortes ou des années supplémentaires selon les facultés.',
      completed: checklist.yearsConfigured,
      icon: Layers,
      tab: 'content' as const,
    },
    {
      id: 'subjectsConfigured',
      label: 'Ajouter ou éditer des modules & matières d’examen',
      desc: 'Définissez le code matière, les couleurs et les descriptions.',
      completed: checklist.subjectsConfigured,
      icon: BookOpen,
      tab: 'content' as const,
    },
    {
      id: 'lessonsConfigured',
      label: 'Structurer les chapitres et leçons par module',
      desc: 'Associez chaque leçon à un temps estimé d’apprentissage.',
      completed: checklist.lessonsConfigured,
      icon: Layers,
      tab: 'content' as const,
    },
    {
      id: 'qcmsConfigured',
      label: 'Alimenter la banque de QCMs avec prévisualisation',
      desc: 'Rédigez les questions d’annales, les explications et les sources EMD / Résidanat.',
      completed: checklist.qcmsConfigured,
      icon: Sparkles,
      tab: 'questions' as const,
    },
    {
      id: 'pricingConfigured',
      label: 'Configurer les tarifs d’abonnement & coordonnées CCP / BaridiMob',
      desc: 'Fixez les tarifs en DZD et renseignez vos identifiants de paiement bancaire.',
      completed: checklist.pricingConfigured,
      icon: DollarSign,
      tab: 'pricing' as const,
    },
    {
      id: 'settingsReviewed',
      label: 'Vérifier la bannière d’annonce & les réglages généraux',
      desc: 'Diffusez des messages d’information officiels à tous les étudiants.',
      completed: checklist.settingsReviewed,
      icon: Settings,
      tab: 'announcements' as const,
    },
  ];

  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div id="admin-welcome-checklist-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border-b border-slate-800 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-2 border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Guide d'initialisation du Propriétaire</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Bienvenue sur votre Dashboard, {adminName} !
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Voici votre feuille de route pour déployer le contenu pédagogique et configurer la plateforme.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-slate-300">Progression de mise en service</span>
              <span className="font-bold text-teal-400">{completedCount} / {steps.length} ({progressPercent}%)</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Checklist items list */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 divide-y divide-slate-800/40">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={`pt-3 first:pt-0 flex items-center justify-between gap-3 group p-2 rounded-xl transition-colors ${
                  step.completed ? 'bg-slate-950/30' : 'hover:bg-slate-800/50 cursor-pointer'
                }`}
                onClick={() => {
                  onNavigateTab(step.tab);
                  onClose();
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {step.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600 group-hover:text-teal-400 transition-colors shrink-0" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${step.completed ? 'text-slate-300 line-through' : 'text-white group-hover:text-teal-300 transition-colors'}`}>
                        {step.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-teal-400 group-hover:translate-x-0.5 transition-all">
                  <span>Ouvrir</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
          <span className="text-xs text-slate-500">
            Vous pouvez rouvrir cette checklist à tout moment depuis les Paramètres.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Accéder au Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

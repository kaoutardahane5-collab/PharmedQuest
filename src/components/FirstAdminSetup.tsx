import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Mail, KeyRound, Check, AlertCircle, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';
import { Language } from '../types';
import { setupFirstAdmin } from '../utils/api';

interface FirstAdminSetupProps {
  language: Language;
  onAdminCreated: (adminData: { id: string; name: string; email: string; role: string; isOwner: boolean }, token: string) => void;
  onCancel?: () => void;
}

export const FirstAdminSetup: React.FC<FirstAdminSetupProps> = ({
  onAdminCreated,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Password strength validation
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isFormValid = name.trim().length >= 2 && email.includes('@') && hasMinLength && passwordsMatch && acceptedTerms;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const data = await setupFirstAdmin(name.trim(), email.trim().toLowerCase(), password);
      onAdminCreated(data.admin, data.token);
    } catch (err: any) {
      setErrorMessage(err.message || "Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="first-admin-setup-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 relative z-10">
        {/* Top badge */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Configuration Initiale Unique • One-Time Setup</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">v2.4 SecOps</span>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Initialiser le Compte Administrateur Principal
          </h1>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Bienvenue sur le panneau de gouvernance de <span className="font-semibold text-teal-300">PharmedQuest</span>. Aucun administrateur n'est encore configuré. En tant que propriétaire, définissez vos identifiants pour déverrouiller la gestion des matières, des leçons et de la banque de QCMs.
          </p>
        </div>

        {/* Notice of permanent lock */}
        <div className="mb-6 p-3.5 bg-amber-950/30 border border-amber-600/30 rounded-xl flex items-start gap-3 text-xs text-amber-300/90 leading-relaxed">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-200">Verrouillage de sécurité :</span> Dès la création de ce compte <strong className="text-amber-100">OWNER / SUPER ADMIN</strong>, cette page sera désactivée de manière irrévocable. Personne d'autre ne pourra s'enregistrer comme administrateur.
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-500/40 rounded-xl text-red-200 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Admin Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Nom complet & Titre (ex: Dr. Amine Benali)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-setup-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Nom Prénom (Propriétaire)"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              />
            </div>
          </div>

          {/* Admin Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Adresse e-mail d'administration
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-setup-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pharmedquest.dz"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Mot de passe administrateur sécurisé
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-setup-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 caractères"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              />
            </div>
            {/* Strength badges */}
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${hasMinLength ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'}`}>
                {hasMinLength && <Check className="w-3 h-3" />} ≥ 8 caractères
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${hasUpper ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'}`}>
                {hasUpper && <Check className="w-3 h-3" />} 1 majuscule
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${hasNumber ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'}`}>
                {hasNumber && <Check className="w-3 h-3" />} 1 chiffre
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-setup-confirm-password-input"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Répétez le mot de passe"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              />
            </div>
            {password && confirmPassword && (
              <p className={`mt-1.5 text-xs ${passwordsMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                {passwordsMatch ? '✓ Les mots de passe correspondent parfaitement.' : '✕ Les mots de passe ne correspondent pas.'}
              </p>
            )}
          </div>

          {/* Agreement checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                id="admin-setup-terms-checkbox"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-700 text-teal-600 focus:ring-teal-500 bg-slate-950"
              />
              <span className="text-xs text-slate-300 leading-normal">
                Je confirme être le propriétaire légitime et administrateur principal de PharmedQuest. Je certifie la conformité des contenus médicaux et pharmaceutiques qui seront publiés.
              </span>
            </label>
          </div>

          {/* Submit button */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-sm font-medium transition-colors"
              >
                Annuler
              </button>
            )}
            <button
              id="admin-setup-submit-btn"
              type="submit"
              disabled={!isFormValid || loading}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold shadow-lg transition-all ${
                isFormValid && !loading
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white shadow-teal-500/20 active:scale-[0.99]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Chiffrement et initialisation du compte...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Créer mon Compte Super Admin & Ouvrir le Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Hachage cryptographique scrypt</span>
          <span>Session autorisée 30 jours</span>
          <span>Algérie • DZD Support</span>
        </div>
      </div>
    </div>
  );
};

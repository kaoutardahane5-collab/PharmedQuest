import React, { useState } from 'react';
import { Language, SubscriptionConfig } from '../types';
import { translations } from '../utils/translations';
import { 
  CreditCard, 
  UploadCloud, 
  CheckCircle2, 
  Building2, 
  Smartphone, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface PaymentReceiptModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  subscriptionConfig: SubscriptionConfig;
  onReceiptApproved: () => void;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  language,
  isOpen,
  onClose,
  subscriptionConfig,
  onReceiptApproved,
}) => {
  const t = translations[language];

  const [paymentType, setPaymentType] = useState<'ccp' | 'baridimob'>('baridimob');
  const [transactionRef, setTransactionRef] = useState('DZ-2024-884920');
  const [selectedFileName, setSelectedFileName] = useState<string | null>('recu_baridimob_2500dzd.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onReceiptApproved();
        onClose();
        setIsSuccess(false);
      }, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel max-w-lg w-full p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-teal-700 dark:text-teal-400" />
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              {language === 'fr' ? 'Paiement Local & Validation' : 'Local Payment & Receipt'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              {language === 'fr' ? 'Abonnement Activé avec Succès !' : 'Subscription Successfully Activated!'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {language === 'fr' 
                ? 'Votre reçu a été vérifié. Vous avez désormais un accès illimité à tous les QCMs et à l IA.' 
                : 'Your receipt was verified. Full access is now unlocked.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Payment method selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentType('baridimob')}
                className={`p-3 rounded-xl border flex items-center gap-2 text-left transition-all ${
                  paymentType === 'baridimob'
                    ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/50 ring-2 ring-teal-600/30 font-bold text-teal-900 dark:text-teal-200'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <p className="leading-tight">BaridiMob</p>
                  <span className="text-[10px] font-normal text-slate-500">Virement instantané</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType('ccp')}
                className={`p-3 rounded-xl border flex items-center gap-2 text-left transition-all ${
                  paymentType === 'ccp'
                    ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/50 ring-2 ring-teal-600/30 font-bold text-teal-900 dark:text-teal-200'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <p className="leading-tight">Virement CCP</p>
                  <span className="text-[10px] font-normal text-slate-500">Poste Algérienne</span>
                </div>
              </button>
            </div>

            {/* Target Account Information */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500">Coordonnées de virement :</span>
              {paymentType === 'baridimob' ? (
                <div>
                  <p className="font-mono font-bold text-slate-900 dark:text-white">RIP : {subscriptionConfig.baridiMobRip}</p>
                  <p className="text-[11px] text-slate-500">Montant : {subscriptionConfig.yearlyPriceDZD} DZD</p>
                </div>
              ) : (
                <div>
                  <p className="font-mono font-bold text-slate-900 dark:text-white">CCP : {subscriptionConfig.ccpNumber} Clé {subscriptionConfig.ccpKey}</p>
                  <p className="text-[11px] text-slate-500">Montant : {subscriptionConfig.yearlyPriceDZD} DZD</p>
                </div>
              )}
            </div>

            {/* Transaction number */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Numéro de transaction ou de bordereau
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>

            {/* File upload receipt */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Capture d écran du reçu (PDF, JPG, PNG)
              </label>
              <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 rounded-xl p-4 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors text-center">
                <UploadCloud className="w-6 h-6 text-teal-600" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {selectedFileName || 'Cliquez pour sélectionner le reçu ou glissez-déposez ici'}
                </span>
                <span className="text-[10px] text-slate-400">Taille max : 10 Mo</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <AlertCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>Validation automatique instantanée par OCR pour le test.</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-md flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span>Vérification en cours...</span>
                ) : (
                  <span>Valider mon abonnement (2500 DZD)</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

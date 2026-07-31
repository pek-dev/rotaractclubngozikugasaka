import React, { useState } from 'react';
import { MembershipFormData } from '../types';
import { X, Check, ArrowRight, UserPlus, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const MembershipModal: React.FC<MembershipModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<MembershipFormData>({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    occupation: '',
    interests: [],
    motivation: '',
    availability: 'Week-ends',
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      if (exists) {
        return { ...prev, interests: prev.interests.filter((i) => i !== interest) };
      } else {
        return { ...prev, interests: [...prev.interests, interest] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onShowToast('Candidature envoyée avec succès ! Le bureau du club vous recontactera sous 48h. 🌟', 'success');
      onClose();
      setStep(1);
    }, 1500);
  };

  const availableInterests = [
    'Santé publique & Don de sang',
    'Reboisement & Environnement',
    'Éducation & Soutien scolaire',
    'Action Humanitaire & Orphelinats',
    'Formations en Leadership',
    'Communication & Réseaux Sociaux',
    'Organisation d Événements / Gala',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-800 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 shrink-0">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-poppins text-gray-900 dark:text-white">
              Candidature d adhésion
            </h3>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
              Rotaract Club Ngozi Kugasaka
            </p>
          </div>
        </div>

        {/* Stepper Progress */}
        <div className="flex items-center justify-between mb-8 px-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-poppins transition-colors ${
                  step >= s
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }`}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 hidden sm:inline">
                {s === 1 ? 'Profil' : s === 2 ? 'Engagements' : 'Validation'}
              </span>
              {s < 3 && <div className="w-8 sm:w-16 h-0.5 bg-gray-200 dark:bg-gray-800" />}
            </div>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Marie-Claire Uwimana"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                    Adresse Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@exemple.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                    Téléphone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+257 67 301 044"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                    Âge (18 - 30 ans) *
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="35"
                    required
                    placeholder="Ex: 22"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                    Profession / Statut *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Étudiant(e), Enseignant..."
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-600"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!formData.fullName || !formData.email || !formData.phone || !formData.age}
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition-colors flex items-center gap-2 disabled:opacity-40"
                >
                  Suivant : Centres d intérêt
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-2">
                Sélectionnez vos domaines de prédilection :
              </label>

              <div className="flex flex-wrap gap-2">
                {availableInterests.map((interest) => {
                  const isSelected = formData.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        isSelected
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-rose-300'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {interest}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                  Pourquoi souhaitez-vous rejoindre le Rotaract Ngozi Kugasaka ?
                </label>
                <textarea
                  rows={3}
                  placeholder="Quelles sont vos motivations et ce que vous espérez apporter..."
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-600 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300"
                >
                  Retour
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition-colors flex items-center gap-2"
                >
                  Suivant : Récapitulatif
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200 space-y-2">
                <div className="font-bold text-sm font-poppins flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-rose-600" />
                  Récapitulatif de votre candidature :
                </div>
                <div><strong>Nom :</strong> {formData.fullName} ({formData.age} ans)</div>
                <div><strong>Email / Tél :</strong> {formData.email} • {formData.phone}</div>
                <div><strong>Profession :</strong> {formData.occupation}</div>
                <div>
                  <strong>Centres d intérêt :</strong>{' '}
                  {formData.interests.length > 0 ? formData.interests.join(', ') : 'Aucun sélectionné'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-[11px] text-gray-500 dark:text-gray-400">
                En soumettant cette candidature, vous acceptez d être contacté(e) par le comité d adhésion du club pour un entretien amical de présentation.
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300"
                >
                  Modifier
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Soumission...' : 'Confirmer mon inscription'}
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

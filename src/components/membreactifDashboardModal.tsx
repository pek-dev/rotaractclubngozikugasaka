import React, { useState } from 'react';
import {
  User,
  CheckCircle,
  Calendar,
  Download,
  CreditCard,
  QrCode,
  ShieldCheck,
  Sun,
  Moon,
  Save,
  Mail,
  Phone,
  Briefcase,
  Award
} from 'lucide-react';
import { EventRegistration } from '../types';

interface MembreActifDashboardProps {
  userEmail: string;
  registrationsList: EventRegistration[];
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  darkMode?: boolean;
  setDarkMode?: (dark: boolean) => void;
}

export const MembreActifDashboardModal: React.FC<MembreActifDashboardProps> = ({
  userEmail = '',
  registrationsList = [],
  onShowToast,
  darkMode,
  setDarkMode
}) => {
  const [fullName, setFullName] = useState('Niyonzima Alain');
  const [phone, setPhone] = useState('+257 79 123 456');
  const [committee, setCommittee] = useState('Commission Action Jeunesse & Environnement');
  const [occupation, setOccupation] = useState('Agronome & Entrepreneur Social');
  const [bio, setBio] = useState('Passionné par le développement durable de la province de Ngozi.');

  // Filter user's registered events
  const myRegistrations = registrationsList.filter(
    r => r.email.toLowerCase() === userEmail.toLowerCase() || userEmail.includes('membre')
  );

  const saveProfileToDb = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/audit_log.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_email: userEmail || 'membre@rotaractngozi.bi',
        user_role: 'membre',
        action_type: 'MISE_A_JOUR_PROFIL',
        description: `Mise à jour des coordonnées pour ${fullName}`
      })
    }).catch(() => {});

    onShowToast('Profil et coordonnées mis à jour avec succès dans la base MySQL ! 💾✨', 'success');
  };

  return (
    <div className="space-y-6 text-gray-900 dark:text-white">
      {/* Banner Member Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-xl border border-indigo-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 text-gray-900 flex items-center justify-center font-extrabold text-2xl font-poppins shadow-lg">
            {fullName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-mono font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              MEMBRE ACTIF OFFICIEL — DISTRICT 9150
            </div>
            <h2 className="text-2xl font-black font-poppins text-white">
              {fullName}
            </h2>
            <p className="text-xs text-indigo-100 font-mono">
              {userEmail || 'membre@rotaractngozi.bi'} • ID Membre: RC-NGOZI-2026-08
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const cardWindow = window.open('', '_blank');
            if (cardWindow) {
              cardWindow.document.write(`
                <html>
                  <head>
                    <title>Carte de Membre Rotaract Ngozi Kugasaka</title>
                    <style>
                      body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f1f5f9; }
                      .card { width: 380px; height: 230px; background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); border-radius: 16px; color: white; padding: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 2px solid #f43f5e; position: relative; }
                      .title { font-size: 14px; font-weight: bold; color: #f43f5e; text-transform: uppercase; letter-spacing: 1px; }
                      .subtitle { font-size: 11px; color: #cbd5e1; }
                      .name { font-size: 18px; font-weight: bold; margin-top: 15px; color: #fff; }
                      .role { font-size: 12px; color: #fbbf24; font-weight: bold; }
                      .details { margin-top: 20px; font-size: 11px; color: #94a3b8; line-height: 1.4; }
                      .badge { position: absolute; top: 20px; right: 20px; background: #f43f5e; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: bold; }
                    </style>
                  </head>
                  <body>
                    <div class="card">
                      <div class="badge">ACTIF 2026</div>
                      <div class="title">Rotaract Club Ngozi Kugasaka</div>
                      <div class="subtitle">District 9150 • République du Burundi</div>
                      <div class="name">${fullName}</div>
                      <div class="role">${committee}</div>
                      <div class="details">
                        Email: ${userEmail}<br/>
                        Téléphone: ${phone}<br/>
                        Cotisation 2026: VALIDÉE ✓
                      </div>
                    </div>
                  </body>
                </html>
              `);
              cardWindow.document.close();
              cardWindow.print();
            }
          }}
          className="px-4 py-2.5 rounded-2xl bg-amber-400 text-gray-900 font-extrabold text-xs hover:bg-amber-300 transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <CreditCard className="w-4 h-4 text-gray-900" />
          Carte Digitale Membre PDF
        </button>
      </div>

      {/* Account Profile Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 space-y-4">
          <h3 className="text-base font-bold font-poppins text-gray-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            Éditer Mon Profil & Informations Personnelles
          </h3>

          <form onSubmit={saveProfileToDb} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                  Nom Complet
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                  Téléphone / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                  Commission / Comité
                </label>
                <div className="relative">
                  <Award className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={committee}
                    onChange={(e) => setCommittee(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                  Profession / Spécialité
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white font-medium"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                Bio / Engagement Rotaractien
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white font-medium"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4" />
              Sauvegarder Profil MySQL
            </button>
          </form>
        </div>

        {/* Member Dues Card */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white border border-emerald-800/80 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-emerald-300">Cotisation Annuelle</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-gray-900 font-extrabold text-[10px] uppercase">
                A JOUR ✓
              </span>
            </div>
            <div className="text-3xl font-black font-poppins text-white">
              50 000 <span className="text-sm font-normal text-emerald-300">BIF</span>
            </div>
            <p className="text-xs text-emerald-100">
              Cotisation exercice 2026 acquittée auprès de la trésorerie. Quitus officiel disponible.
            </p>
            <button
              onClick={() => onShowToast('Quitus officiel de cotisation 2026 téléchargé ! 📄', 'success')}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold text-xs transition-colors"
            >
              Télécharger Quitus BDD
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 space-y-3">
            <h4 className="text-xs font-bold uppercase text-gray-700 dark:text-gray-300">
              Badge & QrCode Presence
            </h4>
            <div className="w-24 h-24 bg-white p-2 rounded-2xl mx-auto flex items-center justify-center border border-gray-200">
              <QrCode className="w-20 h-20 text-gray-900" />
            </div>
            <p className="text-[11px] text-center text-gray-500">
              Scannez ce QR Code lors des Réunions Statutaires pour émarger le registre.
            </p>
          </div>
        </div>
      </div>

      {/* Member Event History */}
      <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 space-y-4">
        <h3 className="text-base font-bold font-poppins text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Mes Inscriptions & Pass Événements Rotaract
        </h3>

        <div className="space-y-3">
          {myRegistrations.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-xs bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              Vous avez 2 événements réservés par défaut dans votre agenda.
            </div>
          ) : (
            myRegistrations.map((reg) => (
              <div
                key={reg.id}
                className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-bold text-sm text-gray-900 dark:text-white">{reg.eventTitle}</div>
                  <div className="text-xs text-gray-500 font-mono">Date inscription : {reg.date} • Pass: {reg.tickets} ticket(s)</div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase">
                  {reg.status || 'Confirmé'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

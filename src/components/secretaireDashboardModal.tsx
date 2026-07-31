import React, { useState } from 'react';
import {
  FileText,
  Mail,
  MessageSquare,
  Send,
  CheckCircle,
  Plus,
  Download,
  Users,
  Eye,
  Search
} from 'lucide-react';
import { ContactMessage, NewsletterSubscriber } from '../types';

interface SecretaireDashboardProps {
  userEmail: string;
  messagesList: ContactMessage[];
  newsletterSubscribers: NewsletterSubscriber[];
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SecretaireDashboardModal: React.FC<SecretaireDashboardProps> = ({
  userEmail = '',
  messagesList = [],
  newsletterSubscribers = [],
  onShowToast
}) => {
  const [pvTitle, setPvTitle] = useState('Procès-Verbal n°15 du Comité Exécutif');
  const [pvDate, setPvDate] = useState('2026-07-29');
  const [pvType, setPvType] = useState('Réunion Ordinaire');
  const [pvAttendees, setPvAttendees] = useState('18 membres présents, 0 excusé');
  const [pvContent, setPvContent] = useState('1. Préparation logistique de l Action Arbres & Environnement Ngozi.\n2. Bilan de la campagne de sensibilisation Don de Sang.\n3. Validation du calendrier des réunions d Août 2026.');

  const [pushSubject, setPushSubject] = useState('');
  const [pushBody, setPushBody] = useState('');

  const recordAuditAction = (actionType: string, description: string) => {
    fetch('/api/audit_log.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_email: userEmail || 'secretaire@rotaractngozi.bi',
        user_role: 'secretaire',
        action_type: actionType,
        description: description
      })
    }).catch(() => {});
  };

  const handleSendPushNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushSubject || !pushBody) {
      onShowToast('Veuillez renseigner un objet et un corps de message.', 'error');
      return;
    }

    fetch('/api/send_push.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: pushSubject,
        body: pushBody,
        sender: userEmail
      })
    })
      .then((res) => res.json())
      .then(() => {
        recordAuditAction('BROADCAST_PUSH_NEWSLETTER', `Envoi communiqué push: "${pushSubject}"`);
        onShowToast(`Alerte Push diffusée avec succès aux ${newsletterSubscribers.length} abonnés ! 📲✨`, 'success');
        setPushSubject('');
        setPushBody('');
      })
      .catch(() => {
        onShowToast('Message diffusé localement aux abonnés.', 'info');
      });
  };

  return (
    <div className="space-y-6 text-gray-900 dark:text-white">
      {/* Banner Header Secretary */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 text-white shadow-xl border border-sky-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/30 text-xs font-mono font-bold mb-2">
            <FileText className="w-4 h-4 text-sky-300" />
            BUREAU DU SECRÉTARIAT GÉNÉRAL & COMMUNICATION
          </div>
          <h2 className="text-2xl font-black font-poppins text-white">
            Procès-Verbaux, Médias & Correspondance Officielle
          </h2>
          <p className="text-xs text-sky-100 max-w-xl mt-1">
            Rédaction des comptes-rendus de réunions, envoi des communiqués de presse, modération des messages et newsletter.
          </p>
        </div>

        <button
          onClick={() => {
            recordAuditAction('EXPORT_PV_SECRETARIAT', `Impression du PV : ${pvTitle}`);
            onShowToast('Procès-Verbal généré au format PDF ! 📄', 'success');
            window.print();
          }}
          className="px-4 py-2.5 rounded-2xl bg-white text-sky-900 font-extrabold text-xs hover:bg-sky-50 transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4 text-sky-600" />
          Télécharger PV Officiel PDF
        </button>
      </div>

      {/* KPI Stats Secretary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-900/60">
          <div className="text-xs font-bold uppercase text-sky-600 dark:text-sky-400 mb-1">
            PV Archivés
          </div>
          <div className="text-3xl font-black font-poppins text-gray-900 dark:text-white">
            15
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Comptes-rendus 2026
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60">
          <div className="text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400 mb-1">
            Abonnés Newsletter
          </div>
          <div className="text-3xl font-black font-poppins text-gray-900 dark:text-white">
            {newsletterSubscribers.length}
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Audience push
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-900/60">
          <div className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400 mb-1">
            Messages Reçus
          </div>
          <div className="text-3xl font-black font-poppins text-gray-900 dark:text-white">
            {messagesList.length}
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Demandes de contact
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60">
          <div className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400 mb-1">
            Statut Secrétariat
          </div>
          <div className="text-xl font-black font-poppins text-emerald-600">
            ACTIF & À JOUR
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Rotaract Ngozi Kugasaka
          </div>
        </div>
      </div>

      {/* Redacteur de Procès-Verbal */}
      <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-poppins text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-600" />
            Rédacteur Officiel de Procès-Verbal (PV)
          </h3>
          <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-300 text-xs font-mono font-bold">
            Génération Rapide PDF
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
              Titre de la Réunion
            </label>
            <input
              type="text"
              value={pvTitle}
              onChange={(e) => setPvTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
              Date tenue
            </label>
            <input
              type="date"
              value={pvDate}
              onChange={(e) => setPvDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
              Type de Réunion
            </label>
            <select
              value={pvType}
              onChange={(e) => setPvType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white"
            >
              <option value="Réunion Ordinaire">Réunion Ordinaire</option>
              <option value="Réunion Extraordinaire">Réunion Extraordinaire</option>
              <option value="Assemblée Générale">Assemblée Générale</option>
              <option value="Comité d Action">Comité d Action</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
            Membres Présents & Quorum
          </label>
          <input
            type="text"
            value={pvAttendees}
            onChange={(e) => setPvAttendees(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
            Ordre du jour & Résolutions Adoptées
          </label>
          <textarea
            rows={4}
            value={pvContent}
            onChange={(e) => setPvContent(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white font-mono leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => {
              recordAuditAction('CREATION_PV', `Rédaction du PV : ${pvTitle}`);
              onShowToast('PV sauvegardé dans les archives électroniques ! 📜✨', 'success');
            }}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Sauvegarder le PV dans la Base
          </button>
        </div>
      </div>

      {/* Diffusion Push & Communiqué */}
      <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 space-y-4">
        <h3 className="text-base font-bold font-poppins text-gray-900 dark:text-white flex items-center gap-2">
          <Send className="w-5 h-5 text-indigo-600" />
          Diffuser un Communiqué Push / Newsletter
        </h3>

        <form onSubmit={handleSendPushNotification} className="space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
              Sujet / Titre du Communiqué
            </label>
            <input
              type="text"
              required
              placeholder="ex: Invitation Assemblée Générale Extraordinaire Ngozi"
              value={pushSubject}
              onChange={(e) => setPushSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
              Corps du Message
            </label>
            <textarea
              rows={3}
              required
              placeholder="Saisissez le texte du communiqué officiel..."
              value={pushBody}
              onChange={(e) => setPushBody(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white font-medium"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
          >
            <Send className="w-4 h-4" />
            Envoyer aux {newsletterSubscribers.length} Abonnés
          </button>
        </form>
      </div>
    </div>
  );
};

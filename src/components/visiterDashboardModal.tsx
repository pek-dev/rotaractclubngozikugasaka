import React, { useState } from 'react';
import {
  User,
  CheckCircle,
  Clock,
  Send,
  Calendar,
  FileText,
  HelpCircle,
  Award,
  Sparkles,
  MapPin,
  HeartHandshake
} from 'lucide-react';
import { MembershipFormData } from '../types';

interface VisiterDashboardProps {
  userEmail: string;
  applicationsList: MembershipFormData[];
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onRequestOpenMembership?: () => void;
}

export const VisiterDashboardModal: React.FC<VisiterDashboardProps> = ({
  userEmail = '',
  applicationsList = [],
  onShowToast,
  onRequestOpenMembership
}) => {
  // Find application for visitor/postulant
  const myApplication = applicationsList.find(
    a => a.email.toLowerCase() === userEmail.toLowerCase()
  ) || {
    id: 'app-vis-1',
    fullName: 'Postulant Visiteur',
    email: userEmail || 'visiteur@gmail.com',
    phone: '+257 69 000 111',
    age: '24',
    occupation: 'Jeune Professionnel Ngozi',
    interests: 'Environnement, Santé Publique, Action Sociale',
    motivation: 'Rejoindre la grande famille du Rotaract Club Ngozi Kugasaka pour servir la communauté.',
    availability: 'Samedis 15h - 17h',
    applicationDate: '2026-07-25',
    status: 'En attente'
  };

  return (
    <div className="space-y-6 text-gray-900 dark:text-white">
      {/* Visitor Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-800 via-rose-900 to-purple-950 text-white shadow-xl border border-rose-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/30 text-xs font-mono font-bold mb-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            PORTAIL POSTULANT & VISITEUR ROTARACT
          </div>
          <h2 className="text-2xl font-black font-poppins text-white">
            Suivi de Candidature & Découverte du Club
          </h2>
          <p className="text-xs text-amber-100 max-w-xl mt-1">
            Bienvenue ! Suivez en direct le traitement de votre dossier d adhésion par le Bureau Exécutif et découvrez nos prochaines actions.
          </p>
        </div>

        <button
          onClick={() => {
            if (onRequestOpenMembership) onRequestOpenMembership();
            else onShowToast('Formulaire de candidature à l adhésion ouvert ! 📝', 'info');
          }}
          className="px-4 py-2.5 rounded-2xl bg-amber-400 text-gray-900 font-extrabold text-xs hover:bg-amber-300 transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <FileText className="w-4 h-4 text-gray-900" />
          Déposer un Dossier d Adhésion
        </button>
      </div>

      {/* Application Status Banner */}
      <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div>
            <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Statut Officiel du Dossier</span>
            <h3 className="text-lg font-bold font-poppins text-gray-900 dark:text-white mt-0.5">
              Candidature d Adhésion au Rotaract Ngozi
            </h3>
          </div>

          <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold font-mono uppercase flex items-center gap-1.5 self-start sm:self-auto ${
            myApplication.status === 'Accepté' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
            'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
          }`}>
            <Clock className="w-4 h-4" />
            {myApplication.status || 'En attente de revue'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-1">
            <span className="font-bold text-gray-500 uppercase text-[10px]">Candidat :</span>
            <div className="font-bold text-sm text-gray-900 dark:text-white">{myApplication.fullName}</div>
            <div className="text-gray-500">{myApplication.email} • {myApplication.phone}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-1">
            <span className="font-bold text-gray-500 uppercase text-[10px]">Parcours & Disponibilité :</span>
            <div className="font-semibold text-gray-900 dark:text-white">{myApplication.occupation}</div>
            <div className="text-gray-500">Dispo : {myApplication.availability}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-amber-600" />
            Message du Bureau Exécutif :
          </div>
          <p>
            Votre dossier est actuellement à l étude par le Président et la Commission Adhésion. Vous serez invité(e) comme observateur(trice) à notre prochaine réunion statutaire à Ngozi.
          </p>
        </div>
      </div>

      {/* Rotary Orientation Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 space-y-3">
          <h4 className="text-sm font-bold font-poppins text-gray-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-600" />
            Lieu & Horaires des Réunions
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            <strong>Quand ?</strong> Tous les 2<sup>ème</sup> et 4<sup>ème</sup> Samedis du mois à 15h00.<br/>
            <strong>Où ?</strong> Salle de Réunion de la Maison des Jeunes, Quartier Résidentiel, Ville de Ngozi, Burundi.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 space-y-3">
          <h4 className="text-sm font-bold font-poppins text-gray-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            Les Critères d Intégration
          </h4>
          <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
            <li>Avoir entre 18 et 30 ans.</li>
            <li>Résider ou exercer en Province de Ngozi.</li>
            <li>Assister à au moins 3 réunions comme invité.</li>
            <li>Participer à une action caritative du club.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

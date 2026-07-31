import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Calendar,
  Database,
  Plus,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Download,
  Activity,
  FileText,
  Clock,
  Eye,
  RefreshCw,
  Search
} from 'lucide-react';
import { EventRegistration, MembershipFormData, Activity as ActivityType } from '../types';

interface PresidentDashboardProps {
  userEmail: string;
  registrationsList: EventRegistration[];
  applicationsList: MembershipFormData[];
  activitiesList: ActivityType[];
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onApproveCandidate?: (id: string) => void;
}

export const PresidentDashboardModal: React.FC<PresidentDashboardProps> = ({
  userEmail = '',
  registrationsList = [],
  applicationsList = [],
  activitiesList = [],
  onShowToast,
  onApproveCandidate
}) => {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch audit logs from MySQL API
  const fetchAuditLogs = () => {
    setLoadingLogs(true);
    fetch('/api/audit_log.php')
      .then(async (res) => {
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (data && data.logs) {
          setAuditLogs(data.logs);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingLogs(false));
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const recordAuditAction = (actionType: string, description: string) => {
    fetch('/api/audit_log.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_email: userEmail || 'president@rotaractngozi.bi',
        user_role: 'president',
        action_type: actionType,
        description: description
      })
    })
      .then(() => fetchAuditLogs())
      .catch(() => {});
  };

  const pendingApplications = applicationsList.filter(a => a.status === 'En attente');
  const totalRevenue = registrationsList.reduce((sum, r) => sum + (r.tickets * 5000), 0);

  return (
    <div className="space-y-6 text-gray-900 dark:text-white">
      {/* Banner Header President */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 text-white shadow-xl border border-rose-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/30 text-rose-200 border border-rose-400/30 text-xs font-mono font-bold mb-2">
            <ShieldCheck className="w-4 h-4 text-rose-300" />
            TABLEAU DE BORD EXÉCUTIF — PRÉSIDENCE DU CLUB
          </div>
          <h2 className="text-2xl font-black font-poppins text-white">
            Pilotage Stratégique & Administration Centrale
          </h2>
          <p className="text-xs text-rose-100 max-w-xl mt-1">
            Supervision globale du Rotaract Club Ngozi Kugasaka (District 9150). Validation des candidatures, suivi budgétaire et journal d audit MySQL.
          </p>
        </div>

        <button
          onClick={() => {
            recordAuditAction('EXPORT_RAPPORT_PRESIDENCE', 'Génération du rapport exécutif trimestriel PDF');
            onShowToast('Rapport exécutif imprimé et consigné dans l audit ! 📄', 'success');
            window.print();
          }}
          className="px-4 py-2.5 rounded-2xl bg-white text-rose-900 font-extrabold text-xs hover:bg-rose-50 transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4 text-rose-600" />
          Rapport Exécutif PDF
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60">
          <div className="text-xs font-bold uppercase text-rose-600 dark:text-rose-400 mb-1 flex items-center justify-between">
            <span>Candidatures</span>
            <Users className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-black font-poppins text-gray-900 dark:text-white">
            {pendingApplications.length} <span className="text-xs font-normal text-amber-600">en attente</span>
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Sur {applicationsList.length} demandes totales
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60">
          <div className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 mb-1 flex items-center justify-between">
            <span>Billetterie Global</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black font-poppins text-gray-900 dark:text-white">
            {totalRevenue.toLocaleString()} <span className="text-xs text-emerald-600">BIF</span>
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            {registrationsList.reduce((acc, r) => acc + r.tickets, 0)} pass confirmés
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60">
          <div className="text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400 mb-1 flex items-center justify-between">
            <span>Projets Actifs</span>
            <Activity className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black font-poppins text-gray-900 dark:text-white">
            {activitiesList.length}
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Actions communautaires
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-900/60">
          <div className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400 mb-1 flex items-center justify-between">
            <span>Audit MySQL</span>
            <Database className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-black font-poppins text-gray-900 dark:text-white">
            {auditLogs.length}
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Logs d actions enregistrés
          </div>
        </div>
      </div>

      {/* Candidatures Validation Panel */}
      <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-poppins text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-rose-600" />
              Validation Exécutive des Candidatures à l Adhésion
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Approuvez ou refusez les demandes d intégration des nouveaux membres.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs font-mono">
            {pendingApplications.length} en attente
          </span>
        </div>

        <div className="space-y-3">
          {pendingApplications.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-xs font-medium bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              ✓ Aucune candidature en attente de validation présidentielle.
            </div>
          ) : (
            pendingApplications.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="font-bold text-sm text-gray-900 dark:text-white">{app.fullName}</div>
                  <div className="text-xs text-gray-500 font-mono">{app.email} • {app.phone} • Occupation: {app.occupation}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mt-1 italic">
                    « {app.motivation || "Motivation à servir la communauté de Ngozi."} »
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      if (onApproveCandidate) onApproveCandidate(app.id);
                      recordAuditAction('APPROBATION_MEMBRE', `Validation du candidat ${app.fullName} (${app.email})`);
                      onShowToast(`Candidat ${app.fullName} approuvé et membre actif ! 👑`, 'success');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approuver
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Audit Logs Table MySQL */}
      <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold font-poppins text-gray-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-600" />
              Journal d Audit MySQL (`audit_logs`) & Traçabilité
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Enregistrement automatique serveur de chaque action administrative et modification.
            </p>
          </div>

          <button
            onClick={fetchAuditLogs}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingLogs ? 'animate-spin' : ''}`} />
            Actualiser BDD
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold uppercase">
              <tr>
                <th className="p-3">Horodatage</th>
                <th className="p-3">Utilisateur</th>
                <th className="p-3">Rôle</th>
                <th className="p-3">Type Action</th>
                <th className="p-3">Description</th>
                <th className="p-3">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-400">
                    Aucun log d audit récent trouvé.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log: any, idx: number) => (
                  <tr key={log.id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-3 font-mono text-gray-500 text-[11px]">{log.created_at || 'Instant T'}</td>
                    <td className="p-3 font-bold text-gray-900 dark:text-white">{log.user_email}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-mono text-[10px] font-bold uppercase">
                        {log.user_role}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400 font-mono text-[11px]">{log.action_type}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{log.description}</td>
                    <td className="p-3 font-mono text-gray-400 text-[10px]">{log.ip_address || '127.0.0.1'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

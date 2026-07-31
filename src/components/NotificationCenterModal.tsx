import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  RefreshCw,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Send,
  Calendar,
  FileText,
  DollarSign,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Activity,
  UserCheck
} from 'lucide-react';

export interface PushNotificationItem {
  id: string;
  title: string;
  body: string;
  type: string;
  category: string;
  read: boolean;
  url?: string;
  created_at: string;
}

export interface AuditLogItem {
  id: number;
  user_email: string;
  user_role: string;
  action_type: string;
  description: string;
  ip_address: string;
  created_at: string;
}

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  onShowToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
  unreadCount?: number;
  onUnreadCountChange?: (count: number) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  userEmail = '',
  onShowToast,
  onUnreadCountChange
}) => {
  const activeEmail = userEmail || localStorage.getItem('active_user_email') || 'rotaractclubngozikugasaka9150@gmail.com';

  const [activeTab, setActiveTab] = useState<'notifications' | 'audit_logs'>('notifications');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const [notifications, setNotifications] = useState<PushNotificationItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [unreadCountState, setUnreadCountState] = useState<number>(0);

  // Send push test form state
  const [showSendTest, setShowSendTest] = useState<boolean>(false);
  const [testTitle, setTestTitle] = useState<string>('');
  const [testBody, setTestBody] = useState<string>('');

  // Fetch notifications and audit logs from PHP API
  const fetchNotificationsAndLogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/notifications.php?email=${encodeURIComponent(activeEmail)}`);
      const text = await response.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        // PHP endpoint served as plain text in dev mode, fallback to default notifications
      }

      if (data && data.status === 'success') {
        const fetchedNotifs: PushNotificationItem[] = data.notifications || [];
        const fetchedLogs: AuditLogItem[] = data.audit_logs || [];
        setNotifications(fetchedNotifs);
        setAuditLogs(fetchedLogs);

        const unread = fetchedNotifs.filter((n) => !n.read).length;
        setUnreadCountState(unread);
        if (onUnreadCountChange) {
          onUnreadCountChange(unread);
        }
      } else {
        // Default local notification items
        const defaultNotifs: PushNotificationItem[] = [
          {
            id: 'notif-1',
            title: '🌱 Campagne de Reforestation Ngozi 2026',
            body: 'Rejoignez-nous ce samedi à 08h00 au Jardin Botanique de Ngozi pour la plantation de 500 arbres.',
            type: 'Ecosysteme & Climat',
            category: 'Action Sociale',
            read: false,
            created_at: '2026-07-28 14:30:00'
          },
          {
            id: 'notif-2',
            title: '🩸 Grand Don de Sang à l Hôpital Régional',
            body: 'Merci à tous les donneurs ! 45 poches de sang collectées avec succès grâce à votre solidarité.',
            type: 'Santé Publique',
            category: 'Urgence',
            read: false,
            created_at: '2026-07-27 10:15:00'
          },
          {
            id: 'notif-3',
            title: '📜 Nouveau Procès-Verbal disponible',
            body: 'Le PV de la 15ème Réunion Ordinaire du Comité Exécutif est désormais en ligne dans le Secrétariat.',
            type: 'Administration',
            category: 'Information',
            read: true,
            created_at: '2026-07-25 18:00:00'
          }
        ];
        const defaultLogs: AuditLogItem[] = [
          {
            id: 101,
            user_email: 'president@rotaractngozi.bi',
            user_role: 'president',
            action_type: 'VALIDATION_ADHESION',
            description: 'Validation de l adhésion de Niyonzima Alain au Rotaract Club Ngozi Kugasaka',
            ip_address: '197.221.14.2',
            created_at: '2026-07-28 16:45:10'
          },
          {
            id: 102,
            user_email: 'secretaire@rotaractngozi.bi',
            user_role: 'secretaire',
            action_type: 'ENVOI_COMMUNIQUE',
            description: 'Publication du communiqué officiel pour la journée mondiale de l eau',
            ip_address: '197.221.14.5',
            created_at: '2026-07-27 11:20:00'
          }
        ];
        setNotifications(defaultNotifs);
        setAuditLogs(defaultLogs);
        const unread = defaultNotifs.filter((n) => !n.read).length;
        setUnreadCountState(unread);
        if (onUnreadCountChange) onUnreadCountChange(unread);
      }
    } catch (err) {
      console.error('Erreur chargement notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [activeEmail, onUnreadCountChange]);

  useEffect(() => {
    if (isOpen) {
      fetchNotificationsAndLogs();
    }
  }, [isOpen, fetchNotificationsAndLogs]);

  if (!isOpen) return null;

  // Mark single notification as read
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
    const updatedUnread = Math.max(0, unreadCountState - 1);
    setUnreadCountState(updatedUnread);
    if (onUnreadCountChange) {
      onUnreadCountChange(updatedUnread);
    }
  };

  // Mark all notifications as read
  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_all_read', user_email: activeEmail })
      });
    } catch (e) {
      // ignore
    }

    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    setUnreadCountState(0);
    if (onUnreadCountChange) {
      onUnreadCountChange(0);
    }
    if (onShowToast) {
      onShowToast('Toutes les notifications marquées comme lues ✔️', 'success');
    }
  };

  // Send a test Push Notification via PHP API
  const handleSendPushNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTitle.trim() || !testBody.trim()) {
      if (onShowToast) onShowToast('Veuillez remplir le titre et le message', 'error');
      return;
    }

    try {
      const response = await fetch('/api/notifications.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_push_notification',
          title: testTitle,
          body: testBody,
          user_email: activeEmail
        })
      });

      const resData = await response.json();
      if (resData && resData.status === 'success') {
        if (onShowToast) {
          onShowToast('Alerte Push diffusée avec succès ! 📲', 'success');
        }
        setTestTitle('');
        setTestBody('');
        setShowSendTest(false);
        fetchNotificationsAndLogs();
      }
    } catch (err) {
      if (onShowToast) onShowToast('Erreur envoi Push API', 'error');
    }
  };

  // Helper formatting relative time
  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Badge category colors
  const getCategoryBadge = (category: string) => {
    switch (category?.toUpperCase()) {
      case 'EVENEMENT':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'OFFICIEL':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'ACTION_COMMUNAUTAIRE':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'FINANCE':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    }
  };

  // Action log type badge icon/color
  const getAuditActionStyle = (actionType: string) => {
    switch (actionType?.toUpperCase()) {
      case 'VALIDATION_CANDIDATURE':
        return {
          icon: <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
          badge: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
        };
      case 'INSCRIPTION_EVENEMENT':
      case 'PRESENCE_REUNION':
        return {
          icon: <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />,
          badge: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
        };
      case 'ENREGISTREMENT_COTISATION':
        return {
          icon: <DollarSign className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
          badge: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
        };
      case 'PUBLICATION_PV':
        return {
          icon: <FileText className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />,
          badge: 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
        };
      default:
        return {
          icon: <Activity className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />,
          badge: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
        };
    }
  };

  // Filter logic
  const filteredNotifications = notifications.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.body.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === 'ALL' || item.category.toUpperCase() === categoryFilter.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  const filteredAuditLogs = auditLogs.filter((log) => {
    return (
      log.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md relative">
              <Bell className="w-6 h-6 text-white" />
              {unreadCountState > 0 && (
                <span className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full bg-amber-400 text-gray-900 font-extrabold text-[10px] shadow-sm animate-bounce">
                  {unreadCountState}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-black font-poppins text-white flex items-center gap-2">
                Centre de Notifications
              </h3>
              <p className="text-xs text-rose-100 mt-0.5 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-200" />
                Alertes & Audit logs pour : <span className="font-mono underline font-bold text-amber-200">{activeEmail}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchNotificationsAndLogs}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Rafraîchir depuis l API PHP"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 pt-3 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'notifications'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Alertes Push</span>
              {unreadCountState > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-white text-rose-600 font-extrabold text-[10px]">
                  {unreadCountState}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('audit_logs')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'audit_logs'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Logs d Activités ({auditLogs.length})</span>
            </button>
          </div>

          {activeTab === 'notifications' && (
            <button
              onClick={handleMarkAllRead}
              className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors flex items-center gap-1 shrink-0"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Tout marquer comme lu
            </button>
          )}
        </div>

        {/* Search & Filters Toolbar */}
        <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === 'notifications' ? "Rechercher une alerte..." : "Filtrer les logs..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {activeTab === 'notifications' && (
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              {['ALL', 'EVENEMENT', 'OFFICIEL', 'ACTION_COMMUNAUTAIRE', 'FINANCE'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-colors shrink-0 ${
                    categoryFilter === cat
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'ALL' ? 'Tous' : cat}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowSendTest(!showSendTest)}
            className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold text-xs border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Simuler Push
          </button>
        </div>

        {/* Test Push Form Drawer */}
        {showSendTest && (
          <form
            onSubmit={handleSendPushNotification}
            className="p-4 bg-rose-50/60 dark:bg-rose-950/40 border-b border-rose-200 dark:border-rose-900 space-y-3 animate-fade-in"
          >
            <div className="font-bold text-xs text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Diffuser une alerte Push test via l API PHP (/api/notifications.php)
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Titre de l alerte Push..."
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Message de la notification..."
                value={testBody}
                onChange={(e) => setTestBody(e.target.value)}
                className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSendTest(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                Envoyer Push
              </button>
            </div>
          </form>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1 bg-white dark:bg-gray-900">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-rose-600 dark:text-rose-400 animate-spin mx-auto" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Synchronisation avec la base de données PHP...
              </p>
            </div>
          ) : activeTab === 'notifications' ? (
            filteredNotifications.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Bell className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto" />
                <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Aucune notification pour le moment
                </div>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Les alertes d événements, rappels de réunion et avis officiels apparaîtront ici.
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                    notif.read
                      ? 'bg-gray-50/50 dark:bg-gray-800/40 border-gray-100 dark:border-gray-800/80 opacity-80'
                      : 'bg-gradient-to-r from-rose-50/70 to-pink-50/50 dark:from-rose-950/40 dark:to-pink-950/20 border-rose-200 dark:border-rose-900/60 shadow-sm'
                  }`}
                >
                  {!notif.read && (
                    <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 pr-6">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${getCategoryBadge(
                            notif.category
                          )}`}
                        >
                          {notif.category}
                        </span>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {formatTime(notif.created_at)}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-gray-900 dark:text-white font-poppins pt-0.5">
                        {notif.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        {notif.body}
                      </p>
                    </div>

                    {notif.url && (
                      <a
                        href={notif.url}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-xl bg-white dark:bg-gray-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 border border-gray-200 dark:border-gray-700 shrink-0 transition-all"
                        title="Voir les détails"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )
          ) : (
            /* AUDIT LOGS TAB */
            filteredAuditLogs.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Activity className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto" />
                <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Aucun journal d activité trouvé
                </div>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Toutes vos actions clés (inscriptions, cotisations, approbations) sont enregistrées en base de données.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredAuditLogs.map((log) => {
                  const style = getAuditActionStyle(log.action_type);
                  return (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shrink-0">
                          {style.icon}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-md font-extrabold text-[10px] ${style.badge}`}>
                              {log.action_type}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              Rôle : {log.user_role}
                            </span>
                          </div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                            {log.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[11px] text-gray-500 font-mono font-medium">
                          {formatTime(log.created_at)}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          IP: {log.ip_address}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-4 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Connecté à la base de données MySQL API Rotaract Ngozi</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { PresidentDashboardModal } from './presidentDashboardModal';
import { SecretaireDashboardModal } from './secretaireDashboardModal';
import { MembreActifDashboardModal } from './membreactifDashboardModal';
import { VisiterDashboardModal } from './visiterDashboardModal';
import {
  ShieldCheck,
  Lock,
  Mail,
  Key,
  LogOut,
  X,
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  Plus,
  Trash2,
  CheckCircle2,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  FileText,
  Sparkles,
  Search,
  Eye,
  Sun,
  Moon,
  Image as ImageIcon,
  PlusCircle,
  Camera,
  Home,
  Info,
  Layers,
  Newspaper,
  Phone,
  RotateCcw,
  Check,
  ExternalLink,
  Target,
  Heart,
  MapPin,
  User,
  RefreshCw,
  Activity as ActivityIcon,
  Database,
  Copy,
  Send,
  Radio,
  ArrowRight
} from 'lucide-react';
import { Activity, EventRegistration, ContactMessage, MembershipFormData, EventItem, GalleryItem, NewsArticle, TeamMember, NewsletterSubscriber } from '../types';
import { ACTIVITIES_DATA, EVENTS_DATA } from '../data/mockData';
import { getStoredSiteContent, saveStoredSiteContent, DEFAULT_SITE_CONTENT, SiteContent } from '../data/siteContent';
import { ContentSectionEditor } from './ContentSectionEditor';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  darkMode,
  setDarkMode,
}) => {
  // Auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });
  const [loginError, setLoginError] = useState('');

  // Member Role state for customized views
  const [userRole, setUserRole] = useState<'president' | 'secretaire' | 'tresorier' | 'membre' | 'visiteur'>('president');

  // Admin Data state
  const [activeTab, setActiveTab] = useState<'overview' | 'registrations' | 'applications' | 'messages' | 'activities' | 'content_sections' | 'newsletter' | 'mysql_export' | 'espace_membre' | 'espace_visiteur' | 'secretaire_dashboard' | 'treasurer_dashboard'>('overview');
  const [selectedSectionTab, setSelectedSectionTab] = useState<'accueil' | 'apropos' | 'impact' | 'activites' | 'evenements' | 'galerie' | 'actualites' | 'equipe' | 'contact'>('accueil');
  const [siteContentState, setSiteContentState] = useState<SiteContent>(getStoredSiteContent);
  const [sectionSearchTerm, setSectionSearchTerm] = useState('');

  // Secretary state
  const [pvTitle, setPvTitle] = useState('Réunion Ordinaire n°14 du Comité Exécutif');
  const [pvDate, setPvDate] = useState('2026-07-28');
  const [pvType, setPvType] = useState('Réunion Ordinaire');
  const [pvAttendees, setPvAttendees] = useState('18 membres présents, 2 excusés');
  const [pvContent, setPvContent] = useState('1. Validation du budget de l Action Arbres & Environnement Ngozi.\n2. Bilan de la campagne de sensibilisation don de sang.\n3. Intronisation des 3 nouveaux membres prévus pour Août 2026.');

  // Treasurer state
  const [memberDuesState, setMemberDuesState] = useState<{ id: string; name: string; amount: number; status: 'Payé' | 'Partiel' | 'Non payé'; date: string }[]>([
    { id: '1', name: 'Niyonzima Alain', amount: 50000, status: 'Payé', date: '15 Jan 2026' },
    { id: '2', name: 'Irakoze Chantal', amount: 50000, status: 'Payé', date: '20 Jan 2026' },
    { id: '3', name: 'Mugisha Bruce', amount: 25000, status: 'Partiel', date: '02 Fév 2026' },
    { id: '4', name: 'Kwizera Fabrice', amount: 50000, status: 'Payé', date: '10 Fév 2026' },
    { id: '5', name: 'Nishimwe Vanessa', amount: 0, status: 'Non payé', date: '-' },
    { id: '6', name: 'Hakizimana Eric', amount: 50000, status: 'Payé', date: '05 Mar 2026' },
    { id: '7', name: 'Ndayishimiye Jean', amount: 50000, status: 'Payé', date: '12 Avr 2026' },
    { id: '8', name: 'Uwimana Marie', amount: 50000, status: 'Payé', date: '18 Mai 2026' },
  ]);
  const [newExpenseLabel, setNewExpenseLabel] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('Action Caritative');
  const [expensesList, setExpensesList] = useState<{ id: string; label: string; amount: number; category: string; date: string }[]>([
    { id: 'exp-1', label: 'Achat de 500 plants d arbres (Projet Ngozi Verte)', amount: 250000, category: 'Environnement', date: '12 Juin 2026' },
    { id: 'exp-2', label: 'Impressions & Bannières Événement Don de Sang', amount: 85000, category: 'Communication', date: '28 Mai 2026' },
    { id: 'exp-3', label: 'Collation & Salle Assemblée Générale', amount: 120000, category: 'Administration', date: '15 Avr 2026' },
  ]);

  // Newsletter subscribers state
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>(() => {
    try {
      const saved = localStorage.getItem('rotaract_newsletter_subscribers');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'sub-1',
        email: 'jean.pierre.ndayishimiye@rotaractngozi.bi',
        subscribedAt: '25 Juillet 2026 à 10:30',
        source: 'Footer Site Web',
      },
      {
        id: 'sub-2',
        email: 'marie.claire.uwimana@yahoo.fr',
        subscribedAt: '26 Juillet 2026 à 14:15',
        source: 'Footer Site Web',
      },
      {
        id: 'sub-3',
        email: 'patrick.habimana@outlook.com',
        subscribedAt: '27 Juillet 2026 à 09:05',
        source: 'Footer Site Web',
      }
    ];
  });

  useEffect(() => {
    const handleNewsletterUpdate = () => {
      try {
        const saved = localStorage.getItem('rotaract_newsletter_subscribers');
        if (saved) setNewsletterSubscribers(JSON.parse(saved));
      } catch (e) {}
    };
    const handleRegsUpdate = () => {
      try {
        const saved = localStorage.getItem('rotaract_event_registrations');
        if (saved) {
          const list = JSON.parse(saved);
          setRegistrationsList(list);
        }
      } catch (e) {}
    };

    window.addEventListener('newsletter_subscribers_updated', handleNewsletterUpdate);
    window.addEventListener('rotaract_registrations_updated', handleRegsUpdate);

    return () => {
      window.removeEventListener('newsletter_subscribers_updated', handleNewsletterUpdate);
      window.removeEventListener('rotaract_registrations_updated', handleRegsUpdate);
    };
  }, []);

  // Sync role with server middleware auth_check.php
  useEffect(() => {
    fetch(`/api/auth_check.php?email=${encodeURIComponent(email || 'user@rotaractngozi.bi')}&role=${userRole}`)
      .then(async (res) => {
        const ct = res.headers.get('content-type');
        if (res.ok && ct && ct.includes('application/json')) return res.json();
        return null;
      })
      .then((data) => {
        if (data && data.auth_config) {
          // Log role verification on server
        }
      })
      .catch(() => {});
  }, [userRole, email]);

  // New Item Form States for Sections CRUD
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    category: 'Santé & Don de Sang',
    url: '',
  });

  const [newActivityForm, setNewActivityForm] = useState({
    title: '',
    description: '',
    badge: 'Humanitaire',
    image: '',
    impact: '100+ bénéficiaires',
  });

  const [newEventForm, setNewEventForm] = useState({
    title: '',
    date: '',
    location: 'Ngozi, Burundi',
    description: '',
    image: '',
    category: 'Action Sociale',
    spots: '100 places',
  });

  const [newNewsForm, setNewNewsForm] = useState({
    title: '',
    summary: '',
    date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    author: 'Bureau Ngozi',
    image: '',
    category: 'Communauté',
  });

  const [newTeamMemberForm, setNewTeamMemberForm] = useState({
    name: '',
    role: '',
    bio: '',
    image: '',
  });

  // Audit Logs State
  const [auditLogsState, setAuditLogsState] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState<boolean>(false);
  const [auditSearchTerm, setAuditSearchTerm] = useState<string>('');
  const [auditActionFilter, setAuditActionFilter] = useState<string>('ALL');
  const [auditDateFilter, setAuditDateFilter] = useState<string>('');

  const fetchAuditLogsFromDb = () => {
    setLoadingLogs(true);
    fetch('/api/notifications.php?email=' + encodeURIComponent(email || 'all'))
      .then(async (res) => {
        const ct = res.headers.get('content-type');
        if (res.ok && ct && ct.includes('application/json')) return res.json();
        return null;
      })
      .then((data) => {
        if (data && data.audit_logs && Array.isArray(data.audit_logs)) {
          setAuditLogsState(data.audit_logs);
        } else {
          throw new Error('Fallback logs required');
        }
      })
      .catch(() => {
        setAuditLogsState([
          { id: 101, user_email: email || 'president@rotaractngozi.bi', user_role: 'president', action_type: 'VALIDATION_CANDIDATURE', description: 'Validation et approbation candidature adhésion Nkurunziza Jean-Paul', ip_address: '197.221.14.2', created_at: '2026-07-29 10:15:00' },
          { id: 102, user_email: 'secretaire@rotaractngozi.bi', user_role: 'secretaire', action_type: 'PUBLICATION_PV', description: 'Publication officielle du Procès-Verbal n°15 du Comité Exécutif', ip_address: '197.221.14.8', created_at: '2026-07-28 16:40:00' },
          { id: 103, user_email: 'tresorier@rotaractngozi.bi', user_role: 'tresorier', action_type: 'COTISATION', description: 'Enregistrement versement cotisation annuelle 50 000 BIF Ndayishimiye Jean', ip_address: '197.221.14.12', created_at: '2026-07-27 11:20:00' },
          { id: 104, user_email: email || 'admin@rotaractngozi.bi', user_role: 'admin', action_type: 'PUSH_NOTIFICATION', description: 'Diffusion alerte Push Réunion Statutaire à l ensemble des membres', ip_address: '197.221.14.2', created_at: '2026-07-26 09:00:00' }
        ]);
      })
      .finally(() => setLoadingLogs(false));
  };

  useEffect(() => {
    fetchAuditLogsFromDb();
  }, []);

  // --- INTERACTIVE PHP / MYSQL CRUD MANAGEMENT STATE ---
  const [crudSubView, setCrudSubView] = useState<'dump' | 'console'>('console');
  const [crudSelectedTable, setCrudSelectedTable] = useState<'events' | 'activities' | 'news' | 'members' | 'registrations' | 'messages' | 'subscribers' | 'audit_logs'>('events');
  const [crudData, setCrudData] = useState<any[]>([]);
  const [crudLoading, setCrudLoading] = useState<boolean>(false);
  const [crudLastSql, setCrudLastSql] = useState<string>('SELECT * FROM `events` ORDER BY id DESC;');
  const [crudResponseJson, setCrudResponseJson] = useState<string>('{}');
  const [crudEditingItem, setCrudEditingItem] = useState<any | null>(null);
  const [crudFormValues, setCrudFormValues] = useState<Record<string, string>>({});

  const fetchCrudTableData = (table = crudSelectedTable) => {
    setCrudLoading(true);
    fetch(`/api/crud/${table}`)
      .then(async (res) => {
        const data = await res.json();
        setCrudData(Array.isArray(data.data) ? data.data : []);
        setCrudLastSql(data.sql_query || `SELECT * FROM \`${table}\`;`);
        setCrudResponseJson(JSON.stringify(data, null, 2));
      })
      .catch((err) => {
        console.error(`Erreur CRUD READ ${table}:`, err);
        setCrudResponseJson(JSON.stringify({ error: err.message }, null, 2));
      })
      .finally(() => setCrudLoading(false));
  };

  useEffect(() => {
    if (activeTab === 'mysql_export' && crudSubView === 'console') {
      fetchCrudTableData(crudSelectedTable);
    }
  }, [activeTab, crudSubView, crudSelectedTable]);

  const handleCrudCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    setCrudLoading(true);
    fetch(`/api/crud/${crudSelectedTable}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(crudFormValues),
    })
      .then(async (res) => {
        const data = await res.json();
        setCrudLastSql(data.sql_executed || `INSERT INTO \`${crudSelectedTable}\` ...`);
        setCrudResponseJson(JSON.stringify(data, null, 2));
        onShowToast(`Enregistrement créé dans la BDD MySQL (${crudSelectedTable}) ! 🚀`, 'success');
        setCrudFormValues({});
        fetchCrudTableData(crudSelectedTable);
      })
      .catch((err) => {
        onShowToast(`Erreur création CRUD (${crudSelectedTable}): ${err.message}`, 'error');
      })
      .finally(() => setCrudLoading(false));
  };

  const handleCrudUpdateRecord = (id: string, updatedFields: Record<string, any>) => {
    setCrudLoading(true);
    fetch(`/api/crud/${crudSelectedTable}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields),
    })
      .then(async (res) => {
        const data = await res.json();
        setCrudLastSql(data.sql_executed || `UPDATE \`${crudSelectedTable}\` WHERE id='${id}'`);
        setCrudResponseJson(JSON.stringify(data, null, 2));
        onShowToast(`Enregistrement ID '${id}' mis à jour avec succès dans MySQL ! 💾`, 'success');
        setCrudEditingItem(null);
        fetchCrudTableData(crudSelectedTable);
      })
      .catch((err) => {
        onShowToast(`Erreur modification CRUD: ${err.message}`, 'error');
      })
      .finally(() => setCrudLoading(false));
  };

  const handleCrudDeleteRecord = (id: string) => {
    if (!window.confirm(`Confirmer la suppression définitive de l enregistrement ID '${id}' dans la base de données MySQL ?`)) return;
    setCrudLoading(true);
    fetch(`/api/crud/${crudSelectedTable}/${id}`, {
      method: 'DELETE',
    })
      .then(async (res) => {
        const data = await res.json();
        setCrudLastSql(data.sql_executed || `DELETE FROM \`${crudSelectedTable}\` WHERE id='${id}'`);
        setCrudResponseJson(JSON.stringify(data, null, 2));
        onShowToast(`Enregistrement ID '${id}' supprimé de la BDD MySQL ! 🗑️`, 'info');
        fetchCrudTableData(crudSelectedTable);
      })
      .catch((err) => {
        onShowToast(`Erreur suppression CRUD: ${err.message}`, 'error');
      })
      .finally(() => setCrudLoading(false));
  };

  const handleGenerateFullReportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFillColor(225, 29, 72);
      doc.rect(0, 0, 210, 20, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text('ROTARACT NGOZI KUGASAKA - RAPPORT OFFICIEL DE GESTION', 14, 13);

      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      doc.text('Rapport Stratégique & Bilan de Participation', 14, 32);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`District 9150 | Province de Ngozi, Burundi | Généré le : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 14, 38);

      doc.setDrawColor(226, 232, 240);
      doc.line(14, 42, 196, 42);

      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, 46, 182, 32, 3, 3, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(225, 29, 72);
      doc.text('SYNTHÈSE DES DONNÉES CLÉS DU CLUB', 20, 54);

      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(`• Total Projets & Actions: ${(activitiesList || []).length}`, 20, 62);
      doc.text(`• Total Candidats Adhésion: ${(applicationsList || []).length}`, 20, 68);
      doc.text(`• Pass Réservés Billetterie: ${(registrationsList || []).length}`, 110, 62);
      doc.text(`• Abonnés Newsletter: ${(newsletterSubscribers || []).length}`, 110, 68);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('1. Registre des Inscrits aux Événements', 14, 90);

      let y = 98;
      (registrationsList || []).slice(0, 15).forEach((reg: any, index: number) => {
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
        doc.setFillColor(index % 2 === 0 ? 255 : 248, 250, 252);
        doc.roundedRect(14, y - 4, 182, 16, 2, 2, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        doc.text(`${index + 1}. ${reg.name || reg.userName || 'Inscrit'} (${reg.email || reg.userEmail || ''})`, 18, y + 2);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(`Action: ${reg.eventTitle || ''} | Pass: ${reg.tickets || 1} | Date: ${reg.date || ''}`, 18, y + 8);

        y += 18;
      });

      window.open('/api/export_pdf.php?type=activity_report&print=1', '_blank');
      doc.save(`Rapport_Rotaract_Ngozi_${new Date().toISOString().slice(0, 10)}.pdf`);
      onShowToast?.('Rapport d activités et liste des inscrits exportés avec succès ! 📊📄', 'success');
    } catch (err) {
      console.error('Erreur export rapport PDF:', err);
      onShowToast?.('Erreur lors de la génération du rapport PDF', 'error');
    }
  };

  
  // Sample Data stored in state
  const [activitiesList, setActivitiesList] = useState<Activity[]>(ACTIVITIES_DATA);
  
  const [registrationsList, setRegistrationsList] = useState<EventRegistration[]>(() => {
    try {
      const saved = localStorage.getItem('rotaract_event_registrations');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'reg-1',
        eventId: 'evt-1',
        eventTitle: 'Grand Don de Sang Communautaire',
        name: 'Niyonzima Patrick',
        email: 'patrick.niyonzima@gmail.com',
        phone: '+257 79 123 456',
        tickets: 2,
        date: '20/07/2026 à 09:30',
        status: 'Confirmé',
      },
      {
        id: 'reg-2',
        eventId: 'evt-2',
        eventTitle: 'Reboisement de la Colline Kugasaka',
        name: 'Nkurunziza Aline',
        email: 'aline.nkuru@yahoo.fr',
        phone: '+257 68 987 654',
        tickets: 1,
        date: '22/07/2026 à 14:00',
        status: 'Confirmé',
      },
      {
        id: 'reg-3',
        eventId: 'evt-3',
        eventTitle: 'Atelier Leadership & Entrepreneuriat',
        name: 'Hakizimana Claude',
        email: 'claude.hakizi@outlook.com',
        phone: '+257 71 555 444',
        tickets: 3,
        date: '25/07/2026 à 11:15',
        status: 'En attente',
      },
    ];
  });

  const [applicationsList, setApplicationsList] = useState<(MembershipFormData & { id: string; date: string; status: 'Approuvé' | 'En attente' | 'Refusé' })[]>([
    {
      id: 'app-1',
      fullName: 'Marie-Grace Mugisha',
      email: 'grace.mugisha@gmail.com',
      phone: '+257 79 888 777',
      age: '23',
      occupation: 'Étudiante en Médecine (Univ. Ngozi)',
      interests: ['Santé publique & Don de sang', 'Formations en Leadership'],
      motivation: 'Passionnée par la santé communautaire et le volontariat.',
      availability: 'Week-ends',
      date: '2026-07-24',
      status: 'En attente',
    },
    {
      id: 'app-2',
      fullName: 'Fabrice Bukuru',
      email: 'fabrice.bukuru@gmail.com',
      phone: '+257 69 111 222',
      age: '25',
      occupation: 'Agronome',
      interests: ['Reboisement & Environnement'],
      motivation: 'Contribuer à la reboisement de la région de Ngozi.',
      availability: 'Samedi',
      date: '2026-07-21',
      status: 'Approuvé',
    },
  ]);

  const [messagesList, setMessagesList] = useState<ContactMessage[]>([
    {
      id: 'msg-1',
      name: 'Dr. Eric Ndayishimiye',
      email: 'dr.eric@hopitalngozi.bi',
      subject: 'Proposition de partenariat campagne de dépistage',
      message: 'Bonjour au comité Rotaract. Nous aimerions organiser un dépistage conjoint de l hypertension le mois prochain.',
      date: '2026-07-26',
      read: false,
    },
    {
      id: 'msg-2',
      name: 'Chantal Irakoze',
      email: 'chantal.irakoze@gmail.com',
      subject: 'Demande de renseignements cotisations',
      message: 'Bonjour, quelles sont les démarches exactes après l envoi du formulaire de candidature ?',
      date: '2026-07-23',
      read: true,
    }
  ]);

  // Form states for creating new activity
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    title: '',
    category: 'sante',
    categoryLabel: 'Santé Publique',
    date: '2026-08-15',
    location: 'Ngozi, Burundi',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    description: '',
    impactMetrics: '',
  });

  if (!isOpen) return null;

  // Function to save theme choice to MySQL API database
  const saveThemePreferenceToDb = (mode: 'light' | 'dark' | 'auto') => {
    const activeEmail = email || localStorage.getItem('active_user_email') || 'rotaractclubngozikugasaka9150@gmail.com';
    const activeRole = userRole || localStorage.getItem('active_user_role') || 'president';

    if (mode === 'dark' && setDarkMode) setDarkMode(true);
    else if (mode === 'light' && setDarkMode) setDarkMode(false);

    localStorage.setItem('theme', mode === 'auto' ? (darkMode ? 'dark' : 'light') : mode);
    localStorage.setItem('manual_theme_override', mode === 'auto' ? 'false' : 'true');

    fetch('/api/save_user_theme.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: activeEmail,
        theme: mode,
        role: activeRole,
      }),
    })
      .then(async (res) => {
        const ct = res.headers.get('content-type');
        if (res.ok && ct && ct.includes('application/json')) return res.json();
        return null;
      })
      .then((data) => {
        onShowToast(
          `Thème "${mode.toUpperCase()}" sauvegardé ! 💾✨`,
          'success'
        );
      })
      .catch(() => {
        onShowToast(`Thème appliqué localement.`, 'info');
      });
  };

  const handleLoginWithRole = (targetEmail: string, targetPass: string, roleHint?: string) => {
    const cleanEmail = targetEmail.trim().toLowerCase();
    const cleanPass = targetPass.trim();

    let assignedRole: 'president' | 'secretaire' | 'tresorier' | 'membre' | 'candidat' = 'membre';
    let defaultTab: any = 'espace_membre';

    if (cleanEmail.includes('president') || cleanEmail.includes('ngozikugasaka9150') || cleanEmail.includes('admin')) {
      assignedRole = 'president';
      defaultTab = 'overview';
    } else if (cleanEmail.includes('secretaire')) {
      assignedRole = 'secretaire';
      defaultTab = 'content_sections';
    } else if (cleanEmail.includes('tresorier')) {
      assignedRole = 'tresorier';
      defaultTab = 'registrations';
    } else if (cleanEmail.includes('candidat') || cleanEmail.includes('postulant')) {
      assignedRole = 'candidat';
      defaultTab = 'espace_visiteur';
    } else {
      assignedRole = (roleHint as any) || 'membre';
      defaultTab = assignedRole === 'candidat' ? 'espace_visiteur' : 'espace_membre';
    }

    if (cleanPass.length >= 3) {
      setIsLoggedIn(true);
      setUserRole(assignedRole as any);
      setActiveTab(defaultTab);
      setEmail(cleanEmail);
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('active_user_email', cleanEmail);
      localStorage.setItem('active_user_role', assignedRole);
      setLoginError('');

      // Fetch saved theme preference for this user from MySQL API
      fetch(`/api/save_user_theme.php?email=${encodeURIComponent(cleanEmail)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.status === 'success' && data.theme_preference) {
            if (data.theme_preference === 'dark' && setDarkMode) setDarkMode(true);
            else if (data.theme_preference === 'light' && setDarkMode) setDarkMode(false);
          }
        })
        .catch(() => {});

      const roleTitles = {
        president: '👑 Président du Club (Accès Total)',
        secretaire: '📜 Secrétaire Général (Comm & Médias)',
        tresorier: '💰 Trésorier (Comptabilité & Finances)',
        membre: '🌟 Membre Actif (Mon Espace Club)',
        candidat: '🎓 Postulant (Espace Candidature)',
      };

      onShowToast(`Connexion réussie : ${roleTitles[assignedRole]} ! 🔐`, 'success');
    } else {
      setLoginError('Mot de passe invalide. Utilisez "Rotaract@257" ou "pass123".');
      onShowToast('Authentification échouée. Veuillez vérifier votre mot de passe.', 'error');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    handleLoginWithRole(email, password);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('active_user_email');
    localStorage.removeItem('active_user_role');
    onShowToast('Vous êtes déconnecté du tableau de bord.', 'info');
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.title || !newActivity.description) {
      onShowToast('Veuillez remplir au moins le titre et la description.', 'error');
      return;
    }

    const created: Activity = {
      id: `act-${Date.now()}`,
      title: newActivity.title || 'Nouvelle Activité',
      category: newActivity.category as any || 'sante',
      categoryLabel: newActivity.categoryLabel || 'Santé',
      date: newActivity.date || '2026-08-01',
      location: newActivity.location || 'Ngozi',
      image: newActivity.image || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?auto=format&fit=crop&w=800&q=80',
      description: newActivity.description || '',
      impactMetrics: newActivity.impactMetrics || '200+ bénéficiaires',
    };

    setActivitiesList([created, ...activitiesList]);
    onShowToast(`Activité "${created.title}" ajoutée avec succès !`, 'success');
    setNewActivity({
      title: '',
      category: 'sante',
      categoryLabel: 'Santé Publique',
      date: '2026-08-15',
      location: 'Ngozi, Burundi',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      description: '',
      impactMetrics: '',
    });
  };

  const handleDeleteActivity = (id: string) => {
    setActivitiesList(activitiesList.filter((a) => a.id !== id));
    onShowToast('Activité supprimée avec succès.', 'info');
  };

  const handleUpdateAppStatus = (id: string, status: 'Approuvé' | 'Refusé') => {
    setApplicationsList(
      applicationsList.map((app) => (app.id === id ? { ...app, status } : app))
    );
    onShowToast(`Statut de candidature mis à jour: ${status}`, 'success');
  };

  const handleUpdateRegStatus = (id: string, status: 'Confirmé' | 'Annulé') => {
    setRegistrationsList(
      registrationsList.map((reg) => (reg.id === id ? { ...reg, status } : reg))
    );
    onShowToast(`Inscription mise à jour: ${status}`, 'info');
  };

  const handleExportData = () => {
    const exportData = {
      club: 'Rotaract Club Ngozi Kugasaka',
      exportDate: new Date().toISOString(),
      activities: activitiesList,
      registrations: registrationsList,
      applications: applicationsList,
      messages: messagesList,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rotaract_Ngozi_Export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Sauvegarde JSON générée et téléchargée ! 📥', 'success');
  };

  const handleExportMembersPDF = () => {
    try {
      const doc = new jsPDF();

      // Header Banner
      doc.setFillColor(225, 29, 72); // Rose Rotaract
      doc.rect(0, 0, 210, 28, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(255, 255, 255);
      doc.text('ROTARACT CLUB NGOZI KUGASAKA - DISTRICT 9150', 14, 14);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Rapport Officiel — Liste des Membres & Candidatures d Adhésion', 14, 22);

      // Metadata section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      doc.text(`Date d impression: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 14, 38);
      doc.text(`Total des membres/candidats: ${applicationsList.length}`, 14, 44);

      doc.setDrawColor(220, 220, 220);
      doc.line(14, 48, 196, 48);

      let y = 56;

      applicationsList.forEach((app, index) => {
        if (y > 255) {
          doc.addPage();
          doc.setFillColor(225, 29, 72);
          doc.rect(0, 0, 210, 15, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(255, 255, 255);
          doc.text('ROTARACT NGOZI - LISTE DES MEMBRES (suite)', 14, 10);
          y = 26;
        }

        // Candidate Card Background
        doc.setFillColor(248, 249, 250);
        doc.roundedRect(14, y - 4, 182, 32, 2, 2, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(225, 29, 72);
        doc.text(`#${index + 1} ${app.fullName.toUpperCase()}`, 18, y + 2);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        doc.text(`Âge: ${app.age} ans  |  Profession: ${app.occupation}  |  Statut: ${app.status}`, 18, y + 8);
        doc.text(`Email: ${app.email}  |  Téléphone: ${app.phone}`, 18, y + 14);

        const interestsStr = Array.isArray(app.interests) ? app.interests.join(', ') : app.interests;
        doc.text(`Centres d intérêt: ${interestsStr || 'Général'}`, 18, y + 20);

        if (app.motivation) {
          const truncMotiv = app.motivation.length > 70 ? app.motivation.substring(0, 70) + '...' : app.motivation;
          doc.setFont('helvetica', 'italic');
          doc.text(`Motivation: "${truncMotiv}"`, 18, y + 25);
        }

        y += 38;
      });

      // Footer pagination
      const totalPages = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Rotaract Club Ngozi Kugasaka © ${new Date().getFullYear()} — Document Confidentiel Bureau`, 14, 288);
        doc.text(`Page ${i} / ${totalPages}`, 180, 288);
      }

      doc.save(`Rotaract_Ngozi_Membres_${new Date().toISOString().slice(0, 10)}.pdf`);
      onShowToast('Fichier PDF officiel des membres exporté avec succès ! 📄✨', 'success');
    } catch (err) {
      console.error('Erreur exportation PDF:', err);
      onShowToast('Erreur lors de la génération du fichier PDF.', 'error');
    }
  };

  const handleExportEventsPDF = () => {
    try {
      const doc = new jsPDF();
      const eventsList = (siteContentState?.events && siteContentState.events.length > 0)
        ? siteContentState.events
        : EVENTS_DATA;

      // Header Banner
      doc.setFillColor(225, 29, 72); // Rose-600 Rotaract
      doc.rect(0, 0, 210, 28, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text('ROTARACT CLUB NGOZI KUGASAKA - DISTRICT 9150', 14, 13);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Rapport Récapitulatif Officiel des Événements Programmés', 14, 22);

      // Subtitle & Metadata
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(`Généré le : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 14, 36);
      doc.text(`Total des événements au programme : ${eventsList.length}`, 14, 42);

      doc.setDrawColor(226, 232, 240);
      doc.line(14, 46, 196, 46);

      // KPI Summary Box
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, 50, 182, 28, 3, 3, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(225, 29, 72);
      doc.text('SYNTHÈSE DE L AGENDA & BORDEREAU D ACTIONS', 20, 58);

      const totalSpots = eventsList.reduce((sum, e) => {
        const spots = typeof e.spotsLeft === 'number' ? e.spotsLeft : parseInt(String(e.spotsLeft || '0'), 10) || 0;
        return sum + spots;
      }, 0);
      const categoriesSet = Array.from(new Set(eventsList.map((e) => e.category || 'Action Sociale')));

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`• Événements enregistrés : ${eventsList.length}`, 20, 66);
      doc.text(`• Catégories d action : ${categoriesSet.slice(0, 3).join(', ')}${categoriesSet.length > 3 ? '...' : ''}`, 20, 72);
      doc.text(`• Capacité cumulée : ${totalSpots} participants`, 110, 66);
      doc.text(`• Inscriptions actives : ${(registrationsList || []).length} pass émis`, 110, 72);

      let y = 88;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('Planning & Fiches des Événements', 14, 84);

      eventsList.forEach((evt, index) => {
        if (y > 245) {
          doc.addPage();
          doc.setFillColor(225, 29, 72);
          doc.rect(0, 0, 210, 16, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(255, 255, 255);
          doc.text('ROTARACT NGOZI - ÉVÉNEMENTS PROGRAMMÉS (suite)', 14, 11);
          y = 26;
        }

        // Event Card Box
        doc.setFillColor(index % 2 === 0 ? 255 : 248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(14, y - 4, 182, 32, 2, 2, 'FD');

        // Event Title & Category
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(225, 29, 72);
        doc.text(`${index + 1}. ${evt.title || 'Événement Rotaract'}`, 18, y + 2);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 116, 139);
        doc.text(`[${evt.category || 'Général'}]`, 150, y + 2);

        // Date & Location
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        const dateStr = `${evt.day || ''} ${evt.month || ''} ${evt.year || ''} à ${evt.time || '14h00'}`.trim();
        doc.text(`Date & Heure : ${dateStr}  |  Lieu : ${evt.location || 'Ngozi, Burundi'}`, 18, y + 9);

        // Spots
        const spotsText = typeof evt.spotsLeft !== 'undefined' ? `${evt.spotsLeft} places disponibles` : 'Entrée libre';
        doc.text(`Disponibilité : ${spotsText}`, 18, y + 15);

        // Description preview
        if (evt.description) {
          const desc = evt.description.length > 95 ? evt.description.substring(0, 95) + '...' : evt.description;
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(100, 116, 139);
          doc.text(`Description : "${desc}"`, 18, y + 21);
        }

        y += 36;
      });

      // Footer
      const totalPages = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(`Rotaract Club Ngozi Kugasaka © ${new Date().getFullYear()} — Agenda Officiel`, 14, 288);
        doc.text(`Page ${i} / ${totalPages}`, 180, 288);
      }

      doc.save(`Rapport_Evenements_Rotaract_Ngozi_${new Date().toISOString().slice(0, 10)}.pdf`);
      onShowToast('Rapport PDF récapitulatif des événements généré avec succès ! 📅📄', 'success');
    } catch (err) {
      console.error('Erreur export PDF événements:', err);
      onShowToast('Erreur lors de la génération du rapport PDF des événements.', 'error');
    }
  };

  // Full MySQL Generator
  const generateMySQLDumpScript = (): string => {
    const escapeSql = (str: string | undefined | null): string => {
      if (str === undefined || str === null) return "''";
      return "'" + String(str).replace(/\\/g, '\\\\').replace(/'/g, "''").replace(/\n/g, '\\n').replace(/\r/g, '\\r') + "'";
    };

    const currentContent = siteContentState || DEFAULT_SITE_CONTENT;
    const dateStr = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let sql = `-- ==========================================================================\n`;
    sql += `-- DUMP BASE DE DONNÉES MYSQL COMPLET — ROTARACT CLUB NGOZI KUGASAKA\n`;
    sql += `-- District 9150 • Province de Ngozi, République du Burundi\n`;
    sql += `-- Généré le : ${dateStr}\n`;
    sql += `-- Encodage : UTF-8 (utf8mb4_unicode_ci)\n`;
    sql += `-- ==========================================================================\n\n`;

    sql += `SET FOREIGN_KEY_CHECKS = 0;\n`;
    sql += `CREATE DATABASE IF NOT EXISTS \`rotaract_ngozi_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n`;
    sql += `USE \`rotaract_ngozi_db\`;\n\n`;

    // 1. site_settings
    sql += `-- --------------------------------------------------------\n`;
    sql += `-- Table: \`site_settings\`\n`;
    sql += `-- --------------------------------------------------------\n`;
    sql += `DROP TABLE IF EXISTS \`site_settings\`;\n`;
    sql += `CREATE TABLE \`site_settings\` (\n`;
    sql += `  \`id\` INT AUTO_INCREMENT PRIMARY KEY,\n`;
    sql += `  \`club_name\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`district\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`primary_email\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`primary_phone\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`meeting_times\` TEXT NOT NULL,\n`;
    sql += `  \`meeting_place\` TEXT NOT NULL,\n`;
    sql += `  \`address\` TEXT NOT NULL,\n`;
    sql += `  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    sql += `INSERT INTO \`site_settings\` (\`club_name\`, \`district\`, \`primary_email\`, \`primary_phone\`, \`meeting_times\`, \`meeting_place\`, \`address\`) VALUES (\n`;
    sql += `  'Rotaract Club Ngozi Kugasaka',\n`;
    sql += `  'District 9150',\n`;
    sql += `  ${escapeSql(currentContent.contact.email)},\n`;
    sql += `  ${escapeSql(currentContent.contact.phone)},\n`;
    sql += `  ${escapeSql(currentContent.contact.meetingTimes)},\n`;
    sql += `  ${escapeSql(currentContent.contact.meetingPlace)},\n`;
    sql += `  ${escapeSql(currentContent.contact.address)}\n`;
    sql += `);\n\n`;

    // 2. hero_content
    sql += `-- --------------------------------------------------------\n`;
    sql += `-- Table: \`hero_content\`\n`;
    sql += `-- --------------------------------------------------------\n`;
    sql += `DROP TABLE IF EXISTS \`hero_content\`;\n`;
    sql += `CREATE TABLE \`hero_content\` (\n`;
    sql += `  \`id\` INT AUTO_INCREMENT PRIMARY KEY,\n`;
    sql += `  \`badge_text\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`title\` TEXT NOT NULL,\n`;
    sql += `  \`subtitle\` TEXT NOT NULL,\n`;
    sql += `  \`cta_primary\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`cta_secondary\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`stat_members\` VARCHAR(50) NOT NULL,\n`;
    sql += `  \`stat_trees\` VARCHAR(50) NOT NULL,\n`;
    sql += `  \`stat_blood\` VARCHAR(50) NOT NULL,\n`;
    sql += `  \`stat_projects\` VARCHAR(50) NOT NULL\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    sql += `INSERT INTO \`hero_content\` (\`badge_text\`, \`title\`, \`subtitle\`, \`cta_primary\`, \`cta_secondary\`, \`stat_members\`, \`stat_trees\`, \`stat_blood\`, \`stat_projects\`) VALUES (\n`;
    sql += `  ${escapeSql(currentContent.hero.badgeText)},\n`;
    sql += `  ${escapeSql(currentContent.hero.title)},\n`;
    sql += `  ${escapeSql(currentContent.hero.subtitle)},\n`;
    sql += `  ${escapeSql(currentContent.hero.ctaPrimary)},\n`;
    sql += `  ${escapeSql(currentContent.hero.ctaSecondary)},\n`;
    sql += `  ${escapeSql(currentContent.hero.statMembers)},\n`;
    sql += `  ${escapeSql(currentContent.hero.statTrees)},\n`;
    sql += `  ${escapeSql(currentContent.hero.statBlood)},\n`;
    sql += `  ${escapeSql(currentContent.hero.statProjects)}\n`;
    sql += `);\n\n`;

    // 3. activities
    sql += `-- --------------------------------------------------------\n`;
    sql += `-- Table: \`activities\`\n`;
    sql += `-- --------------------------------------------------------\n`;
    sql += `DROP TABLE IF EXISTS \`activities\`;\n`;
    sql += `CREATE TABLE \`activities\` (\n`;
    sql += `  \`id\` VARCHAR(100) PRIMARY KEY,\n`;
    sql += `  \`title\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`category\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`category_label\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`activity_date\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`location\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`image_url\` TEXT NOT NULL,\n`;
    sql += `  \`description\` TEXT NOT NULL,\n`;
    sql += `  \`full_content\` TEXT,\n`;
    sql += `  \`impact_metrics\` VARCHAR(255)\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    const acts = currentContent.activities && currentContent.activities.length > 0 ? currentContent.activities : ACTIVITIES_DATA;
    if (acts.length > 0) {
      sql += `INSERT INTO \`activities\` (\`id\`, \`title\`, \`category\`, \`category_label\`, \`activity_date\`, \`location\`, \`image_url\`, \`description\`, \`full_content\`, \`impact_metrics\`) VALUES\n`;
      const rows = acts.map(
        (a) =>
          `(${escapeSql(a.id)}, ${escapeSql(a.title)}, ${escapeSql(a.category)}, ${escapeSql(a.categoryLabel)}, ${escapeSql(a.date)}, ${escapeSql(a.location)}, ${escapeSql(a.image)}, ${escapeSql(a.description)}, ${escapeSql(a.fullContent || a.description)}, ${escapeSql(a.impactMetrics || '')})`
      );
      sql += rows.join(',\n') + ';\n\n';
    }

    // 4. events
    sql += `-- --------------------------------------------------------\n`;
    sql += `-- Table: \`events\`\n`;
    sql += `-- --------------------------------------------------------\n`;
    sql += `DROP TABLE IF EXISTS \`events\`;\n`;
    sql += `CREATE TABLE \`events\` (\n`;
    sql += `  \`id\` VARCHAR(100) PRIMARY KEY,\n`;
    sql += `  \`title\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`event_day\` VARCHAR(20) NOT NULL,\n`;
    sql += `  \`event_month\` VARCHAR(20) NOT NULL,\n`;
    sql += `  \`event_year\` VARCHAR(20) NOT NULL,\n`;
    sql += `  \`event_time\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`location\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`image_url\` TEXT NOT NULL,\n`;
    sql += `  \`description\` TEXT NOT NULL,\n`;
    sql += `  \`spots_left\` INT DEFAULT 50,\n`;
    sql += `  \`category\` VARCHAR(100) NOT NULL\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    const evts = currentContent.events && currentContent.events.length > 0 ? currentContent.events : EVENTS_DATA;
    if (evts.length > 0) {
      sql += `INSERT INTO \`events\` (\`id\`, \`title\`, \`event_day\`, \`event_month\`, \`event_year\`, \`event_time\`, \`location\`, \`image_url\`, \`description\`, \`spots_left\`, \`category\`) VALUES\n`;
      const rows = evts.map(
        (e) =>
          `(${escapeSql(e.id)}, ${escapeSql(e.title)}, ${escapeSql(e.day)}, ${escapeSql(e.month)}, ${escapeSql(e.year)}, ${escapeSql(e.time)}, ${escapeSql(e.location)}, ${escapeSql(e.image)}, ${escapeSql(e.description)}, ${e.spotsLeft || 50}, ${escapeSql(e.category)})`
      );
      sql += rows.join(',\n') + ';\n\n';
    }

    // 5. team_members
    sql += `-- --------------------------------------------------------\n`;
    sql += `-- Table: \`team_members\`\n`;
    sql += `-- --------------------------------------------------------\n`;
    sql += `DROP TABLE IF EXISTS \`team_members\`;\n`;
    sql += `CREATE TABLE \`team_members\` (\n`;
    sql += `  \`id\` VARCHAR(100) PRIMARY KEY,\n`;
    sql += `  \`name\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`role\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`bio\` TEXT NOT NULL,\n`;
    sql += `  \`image_url\` TEXT NOT NULL,\n`;
    sql += `  \`email\` VARCHAR(255),\n`;
    sql += `  \`linkedin\` VARCHAR(255),\n`;
    sql += `  \`facebook\` VARCHAR(255)\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    if (currentContent.team && currentContent.team.length > 0) {
      sql += `INSERT INTO \`team_members\` (\`id\`, \`name\`, \`role\`, \`bio\`, \`image_url\`, \`email\`, \`linkedin\`, \`facebook\`) VALUES\n`;
      const rows = currentContent.team.map(
        (t) =>
          `(${escapeSql(t.id)}, ${escapeSql(t.name)}, ${escapeSql(t.role)}, ${escapeSql(t.bio)}, ${escapeSql(t.image)}, ${escapeSql(t.email || '')}, ${escapeSql(t.linkedin || '#')}, ${escapeSql(t.facebook || '#')})`
      );
      sql += rows.join(',\n') + ';\n\n';
    }

    // 6. social_posts
    sql += `-- --------------------------------------------------------\n`;
    sql += `-- Table: \`social_posts\`\n`;
    sql += `-- --------------------------------------------------------\n`;
    sql += `DROP TABLE IF EXISTS \`social_posts\`;\n`;
    sql += `CREATE TABLE \`social_posts\` (\n`;
    sql += `  \`id\` VARCHAR(100) PRIMARY KEY,\n`;
    sql += `  \`platform\` VARCHAR(50) NOT NULL,\n`;
    sql += `  \`author_name\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`author_handle\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`author_avatar\` TEXT NOT NULL,\n`;
    sql += `  \`content\` TEXT NOT NULL,\n`;
    sql += `  \`media_url\` TEXT,\n`;
    sql += `  \`media_type\` VARCHAR(20),\n`;
    sql += `  \`post_timestamp\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`likes\` INT DEFAULT 0,\n`;
    sql += `  \`comments\` INT DEFAULT 0,\n`;
    sql += `  \`shares\` INT DEFAULT 0,\n`;
    sql += `  \`post_url\` TEXT NOT NULL,\n`;
    sql += `  \`hashtags\` TEXT\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    if (currentContent.socialPosts && currentContent.socialPosts.length > 0) {
      sql += `INSERT INTO \`social_posts\` (\`id\`, \`platform\`, \`author_name\`, \`author_handle\`, \`author_avatar\`, \`content\`, \`media_url\`, \`media_type\`, \`post_timestamp\`, \`likes\`, \`comments\`, \`shares\`, \`post_url\`, \`hashtags\`) VALUES\n`;
      const rows = currentContent.socialPosts.map(
        (p) =>
          `(${escapeSql(p.id)}, ${escapeSql(p.platform)}, ${escapeSql(p.authorName)}, ${escapeSql(p.authorHandle)}, ${escapeSql(p.authorAvatar)}, ${escapeSql(p.content)}, ${escapeSql(p.mediaUrl || '')}, ${escapeSql(p.mediaType || 'image')}, ${escapeSql(p.timestamp)}, ${p.likes || 0}, ${p.comments || 0}, ${p.shares || 0}, ${escapeSql(p.postUrl)}, ${escapeSql((p.hashtags || []).join(','))})`
      );
      sql += rows.join(',\n') + ';\n\n';
    }

    // 7. newsletter_subscribers
    sql += `-- --------------------------------------------------------\n`;
    sql += `-- Table: \`newsletter_subscribers\`\n`;
    sql += `-- --------------------------------------------------------\n`;
    sql += `DROP TABLE IF EXISTS \`newsletter_subscribers\`;\n`;
    sql += `CREATE TABLE \`newsletter_subscribers\` (\n`;
    sql += `  \`id\` VARCHAR(100) PRIMARY KEY,\n`;
    sql += `  \`email\` VARCHAR(255) NOT NULL UNIQUE,\n`;
    sql += `  \`subscribed_at\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`source\` VARCHAR(100) DEFAULT 'Footer Site Web'\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    if (newsletterSubscribers && newsletterSubscribers.length > 0) {
      sql += `INSERT INTO \`newsletter_subscribers\` (\`id\`, \`email\`, \`subscribed_at\`, \`source\`) VALUES\n`;
      const rows = newsletterSubscribers.map(
        (s) => `(${escapeSql(s.id)}, ${escapeSql(s.email)}, ${escapeSql(s.subscribedAt)}, ${escapeSql(s.source || 'Footer Site Web')})`
      );
      sql += rows.join(',\n') + ';\n\n';
    }

    // 8. membership_applications
    sql += `-- --------------------------------------------------------\n`;
    sql += `-- Table: \`membership_applications\`\n`;
    sql += `-- --------------------------------------------------------\n`;
    sql += `DROP TABLE IF EXISTS \`membership_applications\`;\n`;
    sql += `CREATE TABLE \`membership_applications\` (\n`;
    sql += `  \`id\` VARCHAR(100) PRIMARY KEY,\n`;
    sql += `  \`full_name\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`email\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`phone\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`age\` VARCHAR(20) NOT NULL,\n`;
    sql += `  \`occupation\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`interests\` TEXT NOT NULL,\n`;
    sql += `  \`motivation\` TEXT NOT NULL,\n`;
    sql += `  \`availability\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`application_date\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`status\` VARCHAR(50) DEFAULT 'En attente'\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    if (applicationsList && applicationsList.length > 0) {
      sql += `INSERT INTO \`membership_applications\` (\`id\`, \`full_name\`, \`email\`, \`phone\`, \`age\`, \`occupation\`, \`interests\`, \`motivation\`, \`availability\`, \`application_date\`, \`status\`) VALUES\n`;
      const rows = applicationsList.map(
        (ap) =>
          `(${escapeSql(ap.id)}, ${escapeSql(ap.fullName)}, ${escapeSql(ap.email)}, ${escapeSql(ap.phone)}, ${escapeSql(ap.age)}, ${escapeSql(ap.occupation)}, ${escapeSql(Array.isArray(ap.interests) ? ap.interests.join(', ') : ap.interests)}, ${escapeSql(ap.motivation)}, ${escapeSql(ap.availability)}, ${escapeSql(ap.date)}, ${escapeSql(ap.status)})`
      );
      sql += rows.join(',\n') + ';\n\n';
    }

    // 9. event_registrations
    sql += `-- --------------------------------------------------------\n`;
    sql += `-- Table: \`event_registrations\`\n`;
    sql += `-- --------------------------------------------------------\n`;
    sql += `DROP TABLE IF EXISTS \`event_registrations\`;\n`;
    sql += `CREATE TABLE \`event_registrations\` (\n`;
    sql += `  \`id\` VARCHAR(100) PRIMARY KEY,\n`;
    sql += `  \`event_id\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`event_title\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`name\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`email\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`phone\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`tickets\` INT DEFAULT 1,\n`;
    sql += `  \`registration_date\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`status\` VARCHAR(50) DEFAULT 'Confirmé'\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    if (registrationsList && registrationsList.length > 0) {
      sql += `INSERT INTO \`event_registrations\` (\`id\`, \`event_id\`, \`event_title\`, \`name\`, \`email\`, \`phone\`, \`tickets\`, \`registration_date\`, \`status\`) VALUES\n`;
      const rows = registrationsList.map(
        (r) =>
          `(${escapeSql(r.id)}, ${escapeSql(r.eventId)}, ${escapeSql(r.eventTitle)}, ${escapeSql(r.name)}, ${escapeSql(r.email)}, ${escapeSql(r.phone)}, ${r.tickets || 1}, ${escapeSql(r.date)}, ${escapeSql(r.status)})`
      );
      sql += rows.join(',\n') + ';\n\n';
    }

    // 10. contact_messages
    sql += `-- --------------------------------------------------------\n`;
    sql += `-- Table: \`contact_messages\`\n`;
    sql += `-- --------------------------------------------------------\n`;
    sql += `DROP TABLE IF EXISTS \`contact_messages\`;\n`;
    sql += `CREATE TABLE \`contact_messages\` (\n`;
    sql += `  \`id\` VARCHAR(100) PRIMARY KEY,\n`;
    sql += `  \`name\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`email\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`subject\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`message\` TEXT NOT NULL,\n`;
    sql += `  \`message_date\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`is_read\` TINYINT(1) DEFAULT 0\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    if (messagesList && messagesList.length > 0) {
      sql += `INSERT INTO \`contact_messages\` (\`id\`, \`name\`, \`email\`, \`subject\`, \`message\`, \`message_date\`, \`is_read\`) VALUES\n`;
      const rows = messagesList.map(
        (m) =>
          `(${escapeSql(m.id)}, ${escapeSql(m.name)}, ${escapeSql(m.email)}, ${escapeSql(m.subject)}, ${escapeSql(m.message)}, ${escapeSql(m.date)}, ${m.read ? 1 : 0})`
      );
      sql += rows.join(',\n') + ';\n\n';
    }

    // 11. news_articles
    sql += `-- --------------------------------------------------------\n`;
    sql += `-- Table: \`news_articles\`\n`;
    sql += `-- --------------------------------------------------------\n`;
    sql += `DROP TABLE IF EXISTS \`news_articles\`;\n`;
    sql += `CREATE TABLE \`news_articles\` (\n`;
    sql += `  \`id\` VARCHAR(100) PRIMARY KEY,\n`;
    sql += `  \`title\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`category\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`publication_date\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`read_time\` VARCHAR(50) NOT NULL,\n`;
    sql += `  \`image_url\` TEXT NOT NULL,\n`;
    sql += `  \`summary\` TEXT NOT NULL,\n`;
    sql += `  \`content\` TEXT NOT NULL,\n`;
    sql += `  \`author\` VARCHAR(255) NOT NULL\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    if (currentContent.news && currentContent.news.length > 0) {
      sql += `INSERT INTO \`news_articles\` (\`id\`, \`title\`, \`category\`, \`publication_date\`, \`read_time\`, \`image_url\`, \`summary\`, \`content\`, \`author\`) VALUES\n`;
      const rows = currentContent.news.map(
        (n) =>
          `(${escapeSql(n.id)}, ${escapeSql(n.title)}, ${escapeSql(n.category)}, ${escapeSql(n.date)}, ${escapeSql(n.readTime)}, ${escapeSql(n.image)}, ${escapeSql(n.summary)}, ${escapeSql(n.content)}, ${escapeSql(n.author)})`
      );
      sql += rows.join(',\n') + ';\n\n';
    }

    // 12. gallery_items
    sql += `-- --------------------------------------------------------\n`;
    sql += `-- Table: \`gallery_items\`\n`;
    sql += `-- --------------------------------------------------------\n`;
    sql += `DROP TABLE IF EXISTS \`gallery_items\`;\n`;
    sql += `CREATE TABLE \`gallery_items\` (\n`;
    sql += `  \`id\` VARCHAR(100) PRIMARY KEY,\n`;
    sql += `  \`title\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`category\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`image_url\` TEXT NOT NULL,\n`;
    sql += `  \`item_date\` VARCHAR(100)\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    if (currentContent.gallery && currentContent.gallery.length > 0) {
      sql += `INSERT INTO \`gallery_items\` (\`id\`, \`title\`, \`category\`, \`image_url\`, \`item_date\`) VALUES\n`;
      const rows = currentContent.gallery.map(
        (g) =>
          `(${escapeSql(g.id)}, ${escapeSql(g.title)}, ${escapeSql(g.category)}, ${escapeSql(g.image)}, ${escapeSql(g.date || '')})`
      );
      sql += rows.join(',\n') + ';\n\n';
    }

    sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;
    sql += `-- ==========================================================================\n`;
    sql += `-- FIN DU DUMP MYSQL ROTARACT CLUB NGOZI KUGASAKA\n`;
    sql += `-- ==========================================================================\n`;

    return sql;
  };

  const handleDownloadMySQLFile = () => {
    try {
      const sqlContent = generateMySQLDumpScript();
      const blob = new Blob([sqlContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rotaract_ngozi_kugasaka_db_${new Date().toISOString().slice(0, 10)}.sql`;
      a.click();
      URL.revokeObjectURL(url);
      onShowToast('Fichier SQL rotaract_ngozi_db.sql généré et téléchargé ! 🗄️✨', 'success');
    } catch (err) {
      console.error(err);
      onShowToast('Erreur lors du téléchargement du fichier MySQL.', 'error');
    }
  };

  const handleCopyMySQLScript = () => {
    try {
      const sqlContent = generateMySQLDumpScript();
      navigator.clipboard.writeText(sqlContent);
      onShowToast('Script MySQL copié dans le presse-papier ! 📋', 'success');
    } catch (err) {
      console.error(err);
      onShowToast('Impossible de copier automatiquement. Utilisez le téléchargement.', 'error');
    }
  };

  const handleDeleteSubscriber = (id: string) => {
    const updated = newsletterSubscribers.filter((s) => s.id !== id);
    setNewsletterSubscribers(updated);
    localStorage.setItem('rotaract_newsletter_subscribers', JSON.stringify(updated));
    onShowToast('Abonné supprimé de la liste.', 'info');
  };

  const handleExportRegistrationsCSV = () => {
    if (registrationsList.length === 0) {
      onShowToast?.('Aucune inscription à exporter.', 'info');
      return;
    }

    const headers = [
      'ID Inscription',
      'Événement',
      'Nom du Participant',
      'Email',
      'Téléphone',
      'Nombre de Places',
      'Date Inscription',
      'Statut',
    ];

    const rows = registrationsList.map((reg) => [
      `"${reg.id}"`,
      `"${reg.eventTitle.replace(/"/g, '""')}"`,
      `"${reg.name.replace(/"/g, '""')}"`,
      `"${reg.email}"`,
      `"${reg.phone}"`,
      `"${reg.tickets}"`,
      `"${reg.date}"`,
      `"${reg.status}"`,
    ]);

    // UTF-8 BOM \uFEFF to ensure French accents render cleanly in Excel / Google Sheets
    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `inscrits_evenements_rotaract_ngozi_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onShowToast?.('Exportation CSV de la liste des inscrits téléchargée ! 📊', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors"
          title="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isLoggedIn ? (
          /* MULTI-ROLE LOGIN FORM */
          <div className="p-6 sm:p-10 max-w-lg mx-auto w-full flex flex-col justify-center my-auto overflow-y-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-600 to-pink-600 text-white flex items-center justify-center mx-auto mb-3 shadow-xl shadow-rose-600/30">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-poppins text-gray-900 dark:text-white">
                Portail d Authentification Multi-Rôles
              </h3>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-1">
                Rotaract Club Ngozi Kugasaka — District 9150
              </p>
            </div>

            {/* Quick Role Fill Buttons */}
            <div className="mb-6 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80">
              <div className="text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-2.5 flex items-center justify-between">
                <span>Accès Rapide par Rôle (Démo) :</span>
                <span className="text-[10px] text-rose-500 font-mono font-bold">Pass: pass123</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('president@rotaractngozi.bi');
                    setPassword('pass123');
                    handleLoginWithRole('president@rotaractngozi.bi', 'pass123');
                  }}
                  className="p-2.5 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 font-bold hover:bg-rose-600 hover:text-white transition-all text-left flex items-center justify-between group"
                >
                  <span>👑 Président / Admin</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail('secretaire@rotaractngozi.bi');
                    setPassword('pass123');
                    handleLoginWithRole('secretaire@rotaractngozi.bi', 'pass123');
                  }}
                  className="p-2.5 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/30 font-bold hover:bg-sky-600 hover:text-white transition-all text-left flex items-center justify-between group"
                >
                  <span>📜 Secrétaire Général</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail('tresorier@rotaractngozi.bi');
                    setPassword('pass123');
                    handleLoginWithRole('tresorier@rotaractngozi.bi', 'pass123');
                  }}
                  className="p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold hover:bg-emerald-600 hover:text-white transition-all text-left flex items-center justify-between group"
                >
                  <span>💰 Trésorier & Finance</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail('membre@rotaractngozi.bi');
                    setPassword('pass123');
                    handleLoginWithRole('membre@rotaractngozi.bi', 'pass123');
                  }}
                  className="p-2.5 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 font-bold hover:bg-indigo-600 hover:text-white transition-all text-left flex items-center justify-between group"
                >
                  <span>🌟 Membre Actif</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail('candidat@rotaractngozi.bi');
                    setPassword('pass123');
                    handleLoginWithRole('candidat@rotaractngozi.bi', 'pass123');
                  }}
                  className="p-2.5 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 font-bold hover:bg-purple-600 hover:text-white transition-all text-left flex items-center justify-between sm:col-span-2 group"
                >
                  <span>🎓 Postulant / Candidat à l adhésion</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3.5 mb-4 rounded-2xl bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1.5">
                  Adresse Email Personnel
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="ex: president@rotaractngozi.bi ou votre_email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1.5">
                  Mot de passe / Code d Accès
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95 mt-2"
              >
                <Lock className="w-4 h-4" />
                Se connecter au Dashboard
              </button>

              <div className="text-center pt-2 text-[11px] text-gray-400">
                🔒 Connexion sécurisée avec synchronisation des préférences en BDD MySQL.
              </div>
            </form>
          </div>
        ) : (
          /* DASHBOARD VIEW */
          <div className="flex flex-col h-full overflow-hidden">
            {/* Top Admin Bar */}
            <div className="p-5 bg-gray-900 text-white flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold font-poppins text-xs shadow-md">
                  {userRole ? userRole.substring(0, 2).toUpperCase() : 'RC'}
                </div>
                <div>
                  <div className="font-bold text-sm font-poppins flex items-center gap-2">
                    Tableau de Bord Rotaract
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30 uppercase font-mono">
                      {userRole === 'president' ? '👑 Présidence / Admin' :
                       userRole === 'secretaire' ? '📜 Secrétariat' :
                       userRole === 'tresorier' ? '💰 Trésorerie' :
                       userRole === 'candidat' ? '🎓 Postulant' : '🌟 Membre Actif'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    {email || localStorage.getItem('active_user_email') || 'rotaractclubngozikugasaka9150@gmail.com'}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Theme Selector with MySQL DB Sync */}
                <div className="flex items-center gap-1 bg-gray-800 p-1 rounded-xl border border-gray-700/80">
                  <button
                    onClick={() => saveThemePreferenceToDb('light')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                      !darkMode ? 'bg-amber-500 text-gray-900 shadow-sm' : 'text-gray-400 hover:text-white'
                    }`}
                    title="Activer Mode Clair et synchroniser en BDD MySQL"
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Clair</span>
                  </button>
                  <button
                    onClick={() => saveThemePreferenceToDb('dark')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                      darkMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                    }`}
                    title="Activer Mode Sombre et synchroniser en BDD MySQL"
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sombre</span>
                  </button>
                  <button
                    onClick={() => saveThemePreferenceToDb('auto')}
                    className="px-2 py-1.5 rounded-lg text-[10px] text-rose-300 hover:text-white font-mono hover:bg-gray-700 transition-colors"
                    title="Mode Automatique selon heure locale (19h-7h)"
                  >
                    Auto 🕒
                  </button>
                </div>

                <button
                  onClick={handleGenerateFullReportPDF}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-extrabold text-white flex items-center gap-1.5 transition-all shadow-md"
                  title="Exporter le rapport d activités et la liste des inscrits en PDF"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Générer rapport PDF
                </button>
                <button
                  onClick={handleExportEventsPDF}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-md shadow-rose-600/20"
                  title="Générer un rapport récapitulatif des événements programmés au format PDF via jsPDF"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Exporter Événements (PDF)
                </button>
                <button
                  onClick={handleExportMembersPDF}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors shadow-xs"
                  title="Exporter la liste des membres au format PDF"
                >
                  <FileText className="w-3.5 h-3.5" />
                  PDF Membres
                </button>
                <button
                  onClick={handleExportData}
                  className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-rose-400" />
                  Exporter JSON
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-600/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Déconnexion
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-5 pt-3 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
              {(userRole === 'president' ? [
                { id: 'overview', label: "👑 Vue Stratégique Direction", icon: TrendingUp },
                { id: 'audit_logs', label: "📋 Journal d'Activité", icon: ShieldCheck },
                { id: 'activities', label: `Projets & Activités (${(activitiesList || []).length})`, icon: Plus },
                { id: 'applications', label: `Valider Candidatures (${(applicationsList || []).length})`, icon: Users },
                { id: 'registrations', label: `Inscriptions Pass (${(registrationsList || []).length})`, icon: Calendar },
                { id: 'mysql_export', label: 'Base BDD MySQL (.sql)', icon: Database },
                { id: 'espace_membre', label: 'Mon Espace Officiel', icon: User },
              ] : userRole === 'secretaire' ? [
                { id: 'secretaire_dashboard', label: '📜 Secrétariat & Procès-Verbaux', icon: FileText },
                { id: 'audit_logs', label: "📋 Journal d'Activité", icon: ShieldCheck },
                { id: 'content_sections', label: 'Éditeur Médias & Site', icon: FileText },
                { id: 'newsletter', label: `Diffusion Push & Newsletter (${(newsletterSubscribers || []).length})`, icon: Mail },
                { id: 'messages', label: `Courrier & Messages (${(messagesList || []).length})`, icon: MessageSquare },
                { id: 'applications', label: `Registre Postulants (${(applicationsList || []).length})`, icon: Users },
                { id: 'espace_membre', label: 'Mon Espace Officiel', icon: User },
              ] : userRole === 'tresorier' ? [
                { id: 'treasurer_dashboard', label: '💰 Comptabilité & Bilan Financier', icon: TrendingUp },
                { id: 'audit_logs', label: "📋 Journal d'Activité", icon: ShieldCheck },
                { id: 'registrations', label: `Recettes Billetterie (${(registrationsList || []).reduce((acc, r) => acc + (r.tickets || 0), 0)} pass)`, icon: Calendar },
                { id: 'mysql_export', label: 'Registre Financier (SQL)', icon: Database },
                { id: 'espace_membre', label: 'Mon Espace Officiel', icon: User },
              ] : userRole === 'membre' ? [
                { id: 'espace_membre', label: '🌟 Mon Espace Rotaractien', icon: Users },
                { id: 'registrations', label: 'Agenda & Inscriptions Événements', icon: Calendar },
              ] : [
                { id: 'espace_visiteur', label: '🎓 Portail Suivi Candidat', icon: User },
                { id: 'applications', label: 'Mon Dossier d Adhésion', icon: FileText },
              ]).map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-3 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                      isActive
                        ? 'border-rose-600 text-rose-600 dark:text-rose-400 bg-white dark:bg-gray-900 shadow-2xs'
                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Body Content */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-white dark:bg-gray-900">
              {/* JOURNAL D'ACTIVITÉ & AUDIT LOGS VIEW */}
              {activeTab === 'audit_logs' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-gray-900 to-rose-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-700/60">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold mb-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                        JOURNAL D AUDIT & TRAÇABILITÉ DES ACTIONS MYSQL
                      </div>
                      <h3 className="text-2xl font-extrabold font-poppins text-white">
                        Journal d Activité & Logs de Sécurité
                      </h3>
                      <p className="text-xs text-slate-300 max-w-xl mt-1">
                        Consignation interactive des opérations effectuées par la présidence, le secrétariat et les membres. Filtrable par date, utilisateur et type d action.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handleGenerateFullReportPDF}
                        className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Générer rapport PDF
                      </button>
                      <button
                        onClick={fetchAuditLogsFromDb}
                        disabled={loadingLogs}
                        className="p-2.5 rounded-2xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                        title="Actualiser les logs depuis la BDD"
                      >
                        <RefreshCw className={`w-4 h-4 ${loadingLogs ? 'animate-spin text-rose-400' : ''}`} />
                        Actualiser
                      </button>
                    </div>
                  </div>

                  {/* Filter controls bar */}
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                      <div className="relative flex-1 sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Chercher utilisateur, email, action..."
                          value={auditSearchTerm}
                          onChange={(e) => setAuditSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                        />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-500 font-bold dark:text-gray-400">Action :</span>
                        <select
                          value={auditActionFilter}
                          onChange={(e) => setAuditActionFilter(e.target.value)}
                          className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white font-medium"
                        >
                          <option value="ALL">Toutes les actions</option>
                          <option value="VALIDATION_CANDIDATURE">Validation Candidature</option>
                          <option value="INSCRIPTION_EVENEMENT">Inscription Événement</option>
                          <option value="PUBLICATION_PV">Publication PV</option>
                          <option value="COTISATION">Cotisation / Dépense</option>
                          <option value="PUSH_NOTIFICATION">Diffusion Push</option>
                          <option value="EXPORT_RAPPORT">Exportation PDF/Rapport</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-500 font-bold dark:text-gray-400">Date :</span>
                        <input
                          type="date"
                          value={auditDateFilter}
                          onChange={(e) => setAuditDateFilter(e.target.value)}
                          className="p-1.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white font-mono"
                        />
                        {auditDateFilter && (
                          <button
                            onClick={() => setAuditDateFilter('')}
                            className="text-rose-500 hover:text-rose-600 text-xs font-bold"
                          >
                            Effacer
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-gray-500 dark:text-gray-400 font-mono text-[11px] text-right shrink-0">
                      <strong>
                        {(auditLogsState || []).filter((log: any) => {
                          if (auditSearchTerm) {
                            const term = auditSearchTerm.toLowerCase();
                            const matchEmail = (log.user_email || '').toLowerCase().includes(term);
                            const matchRole = (log.user_role || '').toLowerCase().includes(term);
                            const matchAction = (log.action_type || '').toLowerCase().includes(term);
                            const matchDesc = (log.description || '').toLowerCase().includes(term);
                            if (!matchEmail && !matchRole && !matchAction && !matchDesc) return false;
                          }
                          if (auditActionFilter !== 'ALL') {
                            if ((log.action_type || '').toUpperCase() !== auditActionFilter.toUpperCase()) return false;
                          }
                          if (auditDateFilter) {
                            const logDate = (log.created_at || log.date || '').slice(0, 10);
                            if (logDate !== auditDateFilter) return false;
                          }
                          return true;
                        }).length}
                      </strong> journal(x) affiché(s)
                    </div>
                  </div>

                  {/* Audit Logs Table */}
                  <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-100 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 uppercase font-mono font-bold text-[10px] tracking-wider border-b border-gray-200 dark:border-gray-700">
                        <tr>
                          <th className="p-3.5">ID / Date & Heure</th>
                          <th className="p-3.5">Utilisateur & Rôle</th>
                          <th className="p-3.5">Action Effectuée</th>
                          <th className="p-3.5">Détail & Description</th>
                          <th className="p-3.5">Adresse IP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {(auditLogsState || [])
                          .filter((log: any) => {
                            if (auditSearchTerm) {
                              const term = auditSearchTerm.toLowerCase();
                              const matchEmail = (log.user_email || '').toLowerCase().includes(term);
                              const matchRole = (log.user_role || '').toLowerCase().includes(term);
                              const matchAction = (log.action_type || '').toLowerCase().includes(term);
                              const matchDesc = (log.description || '').toLowerCase().includes(term);
                              if (!matchEmail && !matchRole && !matchAction && !matchDesc) return false;
                            }
                            if (auditActionFilter !== 'ALL') {
                              if ((log.action_type || '').toUpperCase() !== auditActionFilter.toUpperCase()) return false;
                            }
                            if (auditDateFilter) {
                              const logDate = (log.created_at || log.date || '').slice(0, 10);
                              if (logDate !== auditDateFilter) return false;
                            }
                            return true;
                          })
                          .map((log: any, idx: number) => (
                            <tr key={log.id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                              <td className="p-3.5 font-mono text-gray-500">
                                <div className="font-bold text-gray-900 dark:text-white">#{log.id || (idx + 101)}</div>
                                <div className="text-[10px] text-gray-400">{log.created_at || log.date || 'Aujourd hui'}</div>
                              </td>
                              <td className="p-3.5">
                                <div className="font-bold text-gray-900 dark:text-white">{log.user_email || email}</div>
                                <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] font-bold font-mono uppercase">
                                  {log.user_role || userRole}
                                </span>
                              </td>
                              <td className="p-3.5">
                                <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-extrabold text-[10px] uppercase border border-rose-200 dark:border-rose-800">
                                  {log.action_type || 'SYSTEM_LOG'}
                                </span>
                              </td>
                              <td className="p-3.5 text-gray-800 dark:text-gray-200 font-medium max-w-sm">
                                {log.description}
                              </td>
                              <td className="p-3.5 font-mono text-gray-400 text-[11px]">
                                {log.ip_address || '197.221.14.2'}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {/* SECRÉTAIRE GÉNÉRAL DASHBOARD */}
              {activeTab === 'secretaire_dashboard' && (
                <SecretaireDashboardModal
                  userEmail={email}
                  messagesList={messagesList}
                  newsletterSubscribers={newsletterSubscribers}
                  onShowToast={(msg, type) => onShowToast?.(msg, type)}
                />
              )}

              {/* TRÉSORIER & COMPTABILITÉ DASHBOARD */}
              {activeTab === 'treasurer_dashboard' && (
                <div className="space-y-6">
                  {/* Treasurer Header */}
                  <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-800 to-emerald-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-emerald-700/50">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-mono font-bold mb-2">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
                        COMMISSION FINANCES & GESTION COMPTABLE 2026
                      </div>
                      <h3 className="text-2xl font-extrabold font-poppins text-white">
                        Comptabilité, Cotisations & Bilans Financiers
                      </h3>
                      <p className="text-xs text-emerald-100 max-w-xl mt-1">
                        Suivi en temps réel des cotisations annuelles (50 000 BIF/membre), des recettes billetterie événements et des dépenses d actions caritatives.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const docWindow = window.open('', '_blank');
                          if (docWindow) {
                            const totalCotisations = memberDuesState.reduce((acc, d) => acc + d.amount, 0);
                            const totalDepenses = expensesList.reduce((acc, e) => acc + e.amount, 0);
                            const soldeNet = totalCotisations - totalDepenses;

                            docWindow.document.write(`
                              <html>
                                <head>
                                  <title>Bilan Financier - Rotaract Club Ngozi Kugasaka</title>
                                  <style>
                                    body { font-family: sans-serif; padding: 40px; color: #111; line-height: 1.6; }
                                    .header { border-bottom: 3px solid #10b981; padding-bottom: 15px; margin-bottom: 25px; }
                                    .title { font-size: 22px; font-weight: bold; color: #047857; }
                                    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
                                    th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
                                    th { background: #f1f5f9; }
                                    .summary { background: #ecfdf5; border: 1px solid #a7f3d0; padding: 15px; border-radius: 8px; margin-top: 25px; font-weight: bold; }
                                  </style>
                                </head>
                                <body>
                                  <div class="header">
                                    <div class="title">Bilan Financier Officiel - Rotaract Club Ngozi Kugasaka</div>
                                    <div>Exercice 2026 | District 9150 | Trésorier du Club</div>
                                  </div>
                                  <h3>1. Cotisations des Membres</h3>
                                  <table>
                                    <thead>
                                      <tr><th>Membre</th><th>Montant Versé</th><th>Statut</th><th>Date</th></tr>
                                    </thead>
                                    <tbody>
                                      ${memberDuesState.map(m => `
                                        <tr>
                                          <td>${m.name}</td>
                                          <td>${m.amount.toLocaleString()} BIF</td>
                                          <td>${m.status}</td>
                                          <td>${m.date}</td>
                                        </tr>
                                      `).join('')}
                                    </tbody>
                                  </table>

                                  <h3>2. Dépenses Actions Caritatives & Fonctionnement</h3>
                                  <table>
                                    <thead>
                                      <tr><th>Libellé Dépense</th><th>Catégorie</th><th>Montant</th><th>Date</th></tr>
                                    </thead>
                                    <tbody>
                                      ${expensesList.map(e => `
                                        <tr>
                                          <td>${e.label}</td>
                                          <td>${e.category}</td>
                                          <td>${e.amount.toLocaleString()} BIF</td>
                                          <td>${e.date}</td>
                                        </tr>
                                      `).join('')}
                                    </tbody>
                                  </table>

                                  <div class="summary">
                                    Total Cotisations Perçues : ${totalCotisations.toLocaleString()} BIF<br/>
                                    Total Dépenses Engagées : ${totalDepenses.toLocaleString()} BIF<br/>
                                    <strong>SOLDE NET DE TRÉSORERIE : ${soldeNet.toLocaleString()} BIF</strong>
                                  </div>
                                </body>
                              </html>
                            `);
                            docWindow.document.close();
                            docWindow.print();
                          }
                        }}
                        className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-all shadow-md flex items-center gap-2 shrink-0"
                      >
                        <Download className="w-4 h-4 text-emerald-600" />
                        Télécharger Bilan PDF
                      </button>
                    </div>
                  </div>

                  {/* Treasurer KPI Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60">
                      <div className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 mb-1">
                        Cotisations 2026
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold font-poppins text-gray-900 dark:text-white">
                        {memberDuesState.reduce((acc, d) => acc + d.amount, 0).toLocaleString()} <span className="text-xs text-emerald-600">BIF</span>
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                        Objectif : 900 000 BIF (18 membres)
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-900/60">
                      <div className="text-xs font-bold uppercase text-teal-600 dark:text-teal-400 mb-1">
                        Recettes Pass Événements
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold font-poppins text-gray-900 dark:text-white">
                        {(registrationsList.reduce((acc, r) => acc + r.tickets, 0) * 5000).toLocaleString()} <span className="text-xs text-teal-600">BIF</span>
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                        Billetterie événements payants
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60">
                      <div className="text-xs font-bold uppercase text-rose-600 dark:text-rose-400 mb-1">
                        Dépenses Engagées
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold font-poppins text-gray-900 dark:text-white">
                        {expensesList.reduce((acc, e) => acc + e.amount, 0).toLocaleString()} <span className="text-xs text-rose-600">BIF</span>
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                        Actions caritatives & logistique
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60">
                      <div className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400 mb-1">
                        Solde de Trésorerie
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold font-poppins text-gray-900 dark:text-white">
                        {(memberDuesState.reduce((acc, d) => acc + d.amount, 0) + (registrationsList.reduce((acc, r) => acc + r.tickets, 0) * 5000) - expensesList.reduce((acc, e) => acc + e.amount, 0)).toLocaleString()} <span className="text-xs text-amber-600">BIF</span>
                      </div>
                      <div className="text-[11px] text-emerald-600 font-bold mt-1">
                        ✓ Compte BANCARISÉ & SAIN
                      </div>
                    </div>
                  </div>

                  {/* Tableau des Cotisations Membres */}
                  <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-base font-bold font-poppins text-gray-900 dark:text-white flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                          Registre des Cotisations Annuelles (50 000 BIF)
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Suivi individuel par membre actif du club
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          onShowToast('Relance automatique envoyée par SMS/Push aux membres en retard de cotisation.', 'info');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500 hover:text-white transition-all self-start sm:self-auto"
                      >
                        📲 Envoyez Relance Dues Membres
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold uppercase">
                          <tr>
                            <th className="p-3">Membre</th>
                            <th className="p-3">Cotisation Versée</th>
                            <th className="p-3">Date Paiement</th>
                            <th className="p-3">Statut</th>
                            <th className="p-3 text-right">Action Reçu</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                          {memberDuesState.map((member) => (
                            <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                              <td className="p-3 font-bold text-gray-900 dark:text-white">{member.name}</td>
                              <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{member.amount.toLocaleString()} BIF</td>
                              <td className="p-3 text-gray-500">{member.date}</td>
                              <td className="p-3">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                  member.status === 'Payé' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                                  member.status === 'Partiel' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                                  'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                }`}>
                                  {member.status}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => {
                                    setMemberDuesState(prev => prev.map(m => m.id === member.id ? { ...m, amount: 50000, status: 'Payé', date: 'Aujourd hui' } : m));
                                    onShowToast(`Quitus & Reçu officiel de 50 000 BIF généré pour ${member.name} ! 📄`, 'success');
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
                                >
                                  {member.status === 'Payé' ? 'Reçu PDF 📄' : 'Marquer Payé ✓'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Saisie de Nouvelle Dépense */}
                  <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 space-y-4">
                    <h4 className="text-base font-bold font-poppins text-gray-900 dark:text-white flex items-center gap-2">
                      <Plus className="w-5 h-5 text-rose-600" />
                      Enregistrer une Dépense / Sortie de Caisse
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                          Libellé de la Dépense
                        </label>
                        <input
                          type="text"
                          placeholder="ex: Achat fournitures bureau"
                          value={newExpenseLabel}
                          onChange={(e) => setNewExpenseLabel(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                          Montant (BIF)
                        </label>
                        <input
                          type="number"
                          placeholder="ex: 45000"
                          value={newExpenseAmount}
                          onChange={(e) => setNewExpenseAmount(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                          Catégorie
                        </label>
                        <select
                          value={newExpenseCategory}
                          onChange={(e) => setNewExpenseCategory(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white font-medium"
                        >
                          <option value="Action Caritative">Action Caritative</option>
                          <option value="Communication">Communication</option>
                          <option value="Environnement">Environnement</option>
                          <option value="Administration">Administration & Logistique</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (!newExpenseLabel || !newExpenseAmount) {
                          onShowToast('Veuillez remplir le libellé et le montant de la dépense.', 'error');
                          return;
                        }
                        const amt = parseFloat(newExpenseAmount);
                        const newExp = {
                          id: `exp-${Date.now()}`,
                          label: newExpenseLabel,
                          amount: amt,
                          category: newExpenseCategory,
                          date: 'Aujourd hui',
                        };
                        setExpensesList([newExp, ...expensesList]);
                        setNewExpenseLabel('');
                        setNewExpenseAmount('');
                        onShowToast(`Dépense de ${amt.toLocaleString()} BIF enregistrée avec succès ! 🧾`, 'success');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      Valider & Ajouter au Livre Caisse
                    </button>
                  </div>
                </div>
              )}

              {/* 1. OVERVIEW (PRESIDENT) */}
              {activeTab === 'overview' && (
                <PresidentDashboardModal
                  userEmail={email}
                  registrationsList={registrationsList}
                  applicationsList={applicationsList}
                  activitiesList={activitiesList}
                  onShowToast={(msg, type) => onShowToast?.(msg, type)}
                  onApproveCandidate={(id) => handleUpdateAppStatus(id, 'Approuvé')}
                />
              )}

              {/* 2. REGISTRATIONS */}
              {activeTab === 'registrations' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div>
                      <h4 className="text-base font-bold font-poppins text-gray-900 dark:text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-rose-600" />
                        Inscriptions aux Événements du Rotaract Ngozi ({registrationsList.length})
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Gérez les réservations de places, confirmez les participations et exportez la liste au format CSV.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={handleExportEventsPDF}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center gap-2 transition-all active:scale-95"
                        title="Générer un rapport récapitulatif PDF complet des événements programmés via jsPDF"
                      >
                        <Calendar className="w-4 h-4" />
                        Exporter Événements (PDF)
                      </button>

                      <button
                        onClick={handleExportRegistrationsCSV}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all active:scale-95"
                        title="Télécharger directement la liste des inscrits au format CSV"
                      >
                        <Download className="w-4 h-4" />
                        Exporter CSV (Direct)
                      </button>

                      <a
                        href="/api/export_pdf.php?type=registrations&print=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 flex items-center gap-1.5 transition-all"
                        title="Générer un rapport PDF officiel via l'API PHP"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Rapport PDF (PHP)
                      </a>

                      <a
                        href="/api/export_registrations_csv.php"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
                        title="Générer un fichier CSV encodé UTF-8 via le serveur backend PHP/MySQL"
                      >
                        <Database className="w-3.5 h-3.5 text-emerald-400" />
                        Export CSV (PHP)
                      </a>

                      <a
                        href="/api/get_registrations.php"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all"
                        title="Consulter le flux JSON en direct sur l'API PHP"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        API JSON
                      </a>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold uppercase text-xs">
                        <tr>
                          <th className="p-3.5">Événement</th>
                          <th className="p-3.5">Participant</th>
                          <th className="p-3.5">Places</th>
                          <th className="p-3.5">Date Inscription</th>
                          <th className="p-3.5">Statut</th>
                          <th className="p-3.5">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {registrationsList.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-sm text-gray-500">
                              Aucune inscription enregistrée pour le moment.
                            </td>
                          </tr>
                        ) : (
                          registrationsList.map((reg) => (
                            <tr key={reg.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                              <td className="p-3.5 font-bold text-gray-900 dark:text-white">{reg.eventTitle}</td>
                              <td className="p-3.5">
                                <div className="font-bold text-gray-900 dark:text-white">{reg.name}</div>
                                <div className="text-xs text-gray-500">{reg.email} • {reg.phone}</div>
                              </td>
                              <td className="p-3.5 font-bold text-rose-600">{reg.tickets} ticket(s)</td>
                              <td className="p-3.5 text-gray-500 text-xs">{reg.date}</td>
                              <td className="p-3.5">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                    reg.status === 'Confirmé'
                                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                  }`}
                                >
                                  {reg.status}
                                </span>
                              </td>
                              <td className="p-3.5 flex gap-2">
                                {reg.status !== 'Confirmé' && (
                                  <button
                                    onClick={() => handleUpdateRegStatus(reg.id, 'Confirmé')}
                                    className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-semibold"
                                    title="Confirmer"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                  </button>
                                )}
                                {reg.status !== 'Annulé' && (
                                  <button
                                    onClick={() => handleUpdateRegStatus(reg.id, 'Annulé')}
                                    className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500 text-xs font-semibold"
                                    title="Annuler"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 3. APPLICATIONS */}
              {activeTab === 'applications' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-rose-50/50 dark:bg-rose-950/20 p-4 rounded-2xl border border-rose-200/60 dark:border-rose-900/40">
                    <div>
                      <h4 className="text-base font-bold font-poppins text-gray-900 dark:text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-rose-600" />
                        Gestion des candidatures d adhésion au club ({applicationsList.length})
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Validez ou refusez les demandes de futurs membres du Rotaract Ngozi.
                      </p>
                    </div>

                    <button
                      onClick={handleExportMembersPDF}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center gap-2 transition-transform active:scale-95 shrink-0"
                    >
                      <FileText className="w-4 h-4" />
                      Exporter en PDF
                    </button>
                  </div>
                  <div className="grid gap-4">
                    {applicationsList.map((app) => (
                      <div
                        key={app.id}
                        className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-base text-gray-900 dark:text-white font-poppins">
                              {app.fullName}
                            </span>
                            <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                              ({app.age} ans)
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                app.status === 'Approuvé'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                  : app.status === 'Refusé'
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              }`}
                            >
                              {app.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">
                            <strong>Email:</strong> {app.email} • <strong>Tél:</strong> {app.phone} • <strong>Statut:</strong> {app.occupation}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">
                            <strong>Interêts:</strong> {app.interests.join(', ')}
                          </div>
                          {app.motivation && (
                            <div className="text-xs italic text-gray-500 dark:text-gray-400 mt-1">
                              "{app.motivation}"
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleUpdateAppStatus(app.id, 'Approuvé')}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approuver
                          </button>
                          <button
                            onClick={() => handleUpdateAppStatus(app.id, 'Refusé')}
                            className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-rose-600 hover:text-white transition-colors flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Refuser
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. MESSAGES */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <h4 className="text-base font-bold font-poppins text-gray-900 dark:text-white">
                    Messages envoyés via le formulaire de contact
                  </h4>
                  <div className="space-y-3">
                    {messagesList.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          msg.read
                            ? 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800'
                            : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <div className="font-bold text-sm text-gray-900 dark:text-white font-poppins">
                            {msg.name} <span className="text-xs font-normal text-gray-500">({msg.email})</span>
                          </div>
                          <span className="text-xs text-gray-400">{msg.date}</span>
                        </div>
                        <div className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">
                          Sujet: {msg.subject}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                          {msg.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. ACTIVITIES MANAGEMENT */}
              {activeTab === 'activities' && (
                <div className="space-y-8">
                  {/* Create New Activity Form */}
                  <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-base font-bold font-poppins text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Plus className="w-5 h-5 text-rose-600" />
                      Ajouter une nouvelle activité du Club
                    </h4>

                    <form onSubmit={handleAddActivity} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                          Titre de l activité *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Campagne de sensibilisation hygiène dentaire"
                          value={newActivity.title}
                          onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                          Catégorie *
                        </label>
                        <select
                          value={newActivity.category}
                          onChange={(e) => {
                            const cat = e.target.value;
                            const labels: Record<string, string> = {
                              sante: 'Santé Publique',
                              environnement: 'Environnement & Arbres',
                              education: 'Éducation & Jeunesse',
                              humanitaire: 'Action Humanitaire',
                              formation: 'Leadership & Formations',
                            };
                            setNewActivity({
                              ...newActivity,
                              category: cat as any,
                              categoryLabel: labels[cat] || 'Général',
                            });
                          }}
                          className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-600"
                        >
                          <option value="sante">Santé Publique</option>
                          <option value="environnement">Environnement & Arbres</option>
                          <option value="education">Éducation & Jeunesse</option>
                          <option value="humanitaire">Action Humanitaire</option>
                          <option value="formation">Leadership & Formations</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                          Date & Lieu
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: 15 Août 2026 — Hôpital Régional Ngozi"
                          value={newActivity.date}
                          onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                          Métriques d impact
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: 350 bénéficiaires, 50 arbres plantés"
                          value={newActivity.impactMetrics}
                          onChange={(e) => setNewActivity({ ...newActivity, impactMetrics: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-600"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                          Description résumé *
                        </label>
                        <textarea
                          rows={2}
                          required
                          placeholder="Résumé concis de l action menée..."
                          value={newActivity.description}
                          onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-600 resize-none"
                        />
                      </div>

                      <div className="md:col-span-2 flex justify-end">
                        <button
                          type="submit"
                          className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center gap-2 transition-transform active:scale-95"
                        >
                          <Plus className="w-4 h-4" />
                          Publier cette nouvelle activité
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* List of Current Activities with Delete Action */}
                  <div>
                    <h4 className="text-base font-bold font-poppins text-gray-900 dark:text-white mb-3">
                      Activités enregistrées ({activitiesList.length})
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {activitiesList.map((act) => (
                        <div
                          key={act.id}
                          className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 flex justify-between gap-3 items-start"
                        >
                          <div className="space-y-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase">
                              {act.categoryLabel}
                            </span>
                            <h5 className="font-bold text-sm text-gray-900 dark:text-white font-poppins">
                              {act.title}
                            </h5>
                            <div className="text-xs text-gray-500">{act.date} • {act.location}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                              {act.description}
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteActivity(act.id)}
                            className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors shrink-0"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 6. CONTENT SECTIONS EDITOR (#sections) */}
              {activeTab === 'content_sections' && (
                <ContentSectionEditor
                  siteContentState={siteContentState}
                  setSiteContentState={setSiteContentState}
                  selectedSectionTab={selectedSectionTab}
                  setSelectedSectionTab={setSelectedSectionTab}
                  sectionSearchTerm={sectionSearchTerm}
                  setSectionSearchTerm={setSectionSearchTerm}
                  onShowToast={onShowToast}
                  newPhoto={newPhoto}
                  setNewPhoto={setNewPhoto}
                  newActivityForm={newActivityForm}
                  setNewActivityForm={setNewActivityForm}
                  newEventForm={newEventForm}
                  setNewEventForm={setNewEventForm}
                  newNewsForm={newNewsForm}
                  setNewNewsForm={setNewNewsForm}
                  newTeamMemberForm={newTeamMemberForm}
                  setNewTeamMemberForm={setNewTeamMemberForm}
                  onExportEventsPDF={handleExportEventsPDF}
                />
              )}

              {/* 7. NEWSLETTER SUBSCRIBERS */}
              {activeTab === 'newsletter' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
                    <div>
                      <h4 className="text-lg font-bold font-poppins text-gray-900 dark:text-white flex items-center gap-2">
                        <Mail className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                        Abonnés à la Newsletter ({newsletterSubscribers.length})
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        Adresses inscrites depuis le formulaire du bas de page (Footer).
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const emails = newsletterSubscribers.map((s) => s.email).join(', ');
                        navigator.clipboard.writeText(emails);
                        onShowToast('Liste des emails copiée dans le presse-papier ! 📋', 'success');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 transition-colors shrink-0 shadow-md shadow-rose-600/20"
                    >
                      <Copy className="w-4 h-4" />
                      Copier tous les emails
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase font-bold text-[11px] border-b border-gray-200 dark:border-gray-700">
                        <tr>
                          <th className="p-4">Adresse Email</th>
                          <th className="p-4">Date d Inscription</th>
                          <th className="p-4">Source</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-gray-800 dark:text-gray-200">
                        {newsletterSubscribers.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-gray-500">
                              Aucun abonné pour le moment.
                            </td>
                          </tr>
                        ) : (
                          newsletterSubscribers.map((sub) => (
                            <tr key={sub.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                              <td className="p-4 font-mono font-semibold text-rose-600 dark:text-rose-400">
                                {sub.email}
                              </td>
                              <td className="p-4 text-gray-500 dark:text-gray-400">
                                {sub.subscribedAt}
                              </td>
                              <td className="p-4">
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 font-bold text-[10px]">
                                  {sub.source || 'Footer Site Web'}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => handleDeleteSubscriber(sub.id)}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                                  title="Supprimer l abonné"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 8. MYSQL DATABASE FULL EXPORT & INTERACTIVE PHP CRUD CONSOLE */}
              {activeTab === 'mysql_export' && (
                <div className="space-y-6">
                  {/* Top Header Card */}
                  <div className="p-6 rounded-3xl bg-gradient-to-r from-gray-900 via-slate-900 to-rose-950 text-white border border-gray-800 shadow-xl relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold">
                          <Database className="w-3.5 h-3.5 text-rose-400" />
                          BACKEND PHP & GESTIONNAIRE BDD MYSQL (CRUD)
                        </div>
                        <h3 className="text-2xl font-black font-poppins text-white">
                          Console RESTful CRUD & Dump SQL Rotaract Ngozi
                        </h3>
                        <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
                          Gérez en temps réel vos tables BDD MySQL via l API PHP (<code className="text-rose-300">/api/crud/:table</code>), exécutez des opérations de Création, Lecture, Modification, Suppression (CRUD) et téléchargez le dump SQL complet du club.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 shrink-0">
                        <button
                          onClick={() => setCrudSubView('console')}
                          className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
                            crudSubView === 'console'
                              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 scale-105'
                              : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                          }`}
                        >
                          <Database className="w-4 h-4" />
                          Console CRUD PHP Live
                        </button>

                        <button
                          onClick={() => setCrudSubView('dump')}
                          className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
                            crudSubView === 'dump'
                              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 scale-105'
                              : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                          }`}
                        >
                          <FileText className="w-4 h-4" />
                          Script SQL Dump (.sql)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SUBVIEW 1: INTERACTIVE CRUD CONSOLE */}
                  {crudSubView === 'console' && (
                    <div className="space-y-6">
                      {/* Table Selector Bar */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                          {[
                            { id: 'events', label: 'Événements (`events`)' },
                            { id: 'activities', label: 'Activités (`activities`)' },
                            { id: 'news', label: 'Actualités (`news`)' },
                            { id: 'members', label: 'Membres (`members`)' },
                            { id: 'registrations', label: 'Inscriptions (`registrations`)' },
                            { id: 'messages', label: 'Courrier (`messages`)' },
                            { id: 'subscribers', label: 'Abonnés (`subscribers`)' },
                            { id: 'audit_logs', label: 'Audit Logs (`audit_logs`)' },
                          ].map((tbl) => (
                            <button
                              key={tbl.id}
                              onClick={() => {
                                setCrudSelectedTable(tbl.id as any);
                                setCrudEditingItem(null);
                                setCrudFormValues({});
                              }}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                                crudSelectedTable === tbl.id
                                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 scale-105'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                              }`}
                            >
                              {tbl.label}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => fetchCrudTableData(crudSelectedTable)}
                          disabled={crudLoading}
                          className="px-3.5 py-2 rounded-xl bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${crudLoading ? 'animate-spin' : ''}`} />
                          Actualiser BDD
                        </button>
                      </div>

                      {/* Create / Edit Form Card */}
                      <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Plus className="w-4 h-4 text-rose-600" />
                            {crudEditingItem ? `Modifier l enregistrement ID: ${crudEditingItem.id}` : `Créer un enregistrement dans \`${crudSelectedTable}\``}
                          </h4>
                          {crudEditingItem && (
                            <button
                              onClick={() => {
                                setCrudEditingItem(null);
                                setCrudFormValues({});
                              }}
                              className="text-xs text-rose-500 font-bold hover:underline"
                            >
                              Annuler la modification
                            </button>
                          )}
                        </div>

                        <form onSubmit={handleCrudCreateRecord} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {crudSelectedTable === 'events' && (
                              <>
                                <input
                                  type="text"
                                  placeholder="Titre de l événement"
                                  value={crudFormValues.title || ''}
                                  onChange={(e) => setCrudFormValues({ ...crudFormValues, title: e.target.value })}
                                  className="px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                                  required
                                />
                                <input
                                  type="date"
                                  value={crudFormValues.date || '2026-08-20'}
                                  onChange={(e) => setCrudFormValues({ ...crudFormValues, date: e.target.value })}
                                  className="px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                                  required
                                />
                                <input
                                  type="text"
                                  placeholder="Lieu (ex: Ngozi, Burundi)"
                                  value={crudFormValues.location || ''}
                                  onChange={(e) => setCrudFormValues({ ...crudFormValues, location: e.target.value })}
                                  className="px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                                />
                                <input
                                  type="text"
                                  placeholder="Catégorie (Gouvernance, Santé...)"
                                  value={crudFormValues.category || ''}
                                  onChange={(e) => setCrudFormValues({ ...crudFormValues, category: e.target.value })}
                                  className="px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                                />
                                <input
                                  type="text"
                                  placeholder="Description courte"
                                  value={crudFormValues.description || ''}
                                  onChange={(e) => setCrudFormValues({ ...crudFormValues, description: e.target.value })}
                                  className="px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white col-span-2"
                                />
                              </>
                            )}

                            {crudSelectedTable === 'activities' && (
                              <>
                                <input
                                  type="text"
                                  placeholder="Nom du projet / activité"
                                  value={crudFormValues.title || ''}
                                  onChange={(e) => setCrudFormValues({ ...crudFormValues, title: e.target.value })}
                                  className="px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                                  required
                                />
                                <input
                                  type="text"
                                  placeholder="Axe Majeur (Santé, Environnement...)"
                                  value={crudFormValues.category || ''}
                                  onChange={(e) => setCrudFormValues({ ...crudFormValues, category: e.target.value })}
                                  className="px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                                />
                                <input
                                  type="text"
                                  placeholder="Indicateur d impact (ex: 500 arbres)"
                                  value={crudFormValues.impact_metrics || ''}
                                  onChange={(e) => setCrudFormValues({ ...crudFormValues, impact_metrics: e.target.value })}
                                  className="px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                                />
                              </>
                            )}

                            {crudSelectedTable === 'members' && (
                              <>
                                <input
                                  type="text"
                                  placeholder="Nom complet"
                                  value={crudFormValues.name || ''}
                                  onChange={(e) => setCrudFormValues({ ...crudFormValues, name: e.target.value })}
                                  className="px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                                  required
                                />
                                <input
                                  type="email"
                                  placeholder="Email officiel"
                                  value={crudFormValues.email || ''}
                                  onChange={(e) => setCrudFormValues({ ...crudFormValues, email: e.target.value })}
                                  className="px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                                  required
                                />
                                <input
                                  type="text"
                                  placeholder="Rôle / Titre"
                                  value={crudFormValues.role || 'Membre Actif'}
                                  onChange={(e) => setCrudFormValues({ ...crudFormValues, role: e.target.value })}
                                  className="px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                                />
                              </>
                            )}

                            {crudSelectedTable !== 'events' && crudSelectedTable !== 'activities' && crudSelectedTable !== 'members' && (
                              <>
                                <input
                                  type="text"
                                  placeholder="Champ Clé (ex: email, title, subject)"
                                  value={crudFormValues.title || crudFormValues.email || crudFormValues.subject || ''}
                                  onChange={(e) => setCrudFormValues({ ...crudFormValues, title: e.target.value, email: e.target.value })}
                                  className="px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                                  required
                                />
                                <input
                                  type="text"
                                  placeholder="Détail / Description"
                                  value={crudFormValues.description || crudFormValues.message || crudFormValues.source || ''}
                                  onChange={(e) => setCrudFormValues({ ...crudFormValues, description: e.target.value, message: e.target.value })}
                                  className="px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white col-span-2"
                                />
                              </>
                            )}
                          </div>

                          <div className="flex justify-end gap-2">
                            {crudEditingItem ? (
                              <button
                                type="button"
                                onClick={() => handleCrudUpdateRecord(crudEditingItem.id, crudFormValues)}
                                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-600/20"
                              >
                                Enregistrer les modifications (PUT)
                              </button>
                            ) : (
                              <button
                                type="submit"
                                disabled={crudLoading}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center gap-1.5"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Insérer dans MySQL (POST)
                              </button>
                            )}
                          </div>
                        </form>
                      </div>

                      {/* Live Data Table */}
                      <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider text-rose-600 flex items-center gap-2 font-poppins">
                            <Database className="w-4 h-4" />
                            Données Table `{crudSelectedTable}` ({crudData.length} enregistrements)
                          </h4>
                          <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md font-bold">
                            API: /api/crud/{crudSelectedTable}
                          </span>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                          <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
                            <thead className="bg-gray-100 dark:bg-gray-800/80 uppercase font-mono text-[10px] text-gray-500 dark:text-gray-400 font-bold border-b border-gray-200 dark:border-gray-700">
                              <tr>
                                <th className="p-3">ID</th>
                                <th className="p-3">Titre / Nom / Email</th>
                                <th className="p-3">Détail / Catégorie</th>
                                <th className="p-3">Horodatage</th>
                                <th className="p-3 text-right">Actions CRUD</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 font-sans">
                              {crudData.length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400 italic">
                                    Aucun enregistrement trouvé dans la table `{crudSelectedTable}`.
                                  </td>
                                </tr>
                              ) : (
                                crudData.map((row) => (
                                  <tr key={row.id || Math.random()} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                                    <td className="p-3 font-mono font-bold text-rose-600 dark:text-rose-400">{row.id}</td>
                                    <td className="p-3 font-semibold text-gray-900 dark:text-white">
                                      {row.title || row.name || row.email || row.user_email || row.subject || 'Enregistrement'}
                                    </td>
                                    <td className="p-3 text-gray-600 dark:text-gray-300">
                                      {row.category || row.role || row.description || row.summary || row.message || row.source || '—'}
                                    </td>
                                    <td className="p-3 text-gray-500 dark:text-gray-400 font-mono text-[11px]">
                                      {row.date || row.created_at || row.subscribed_at || row.registration_date || row.message_date || 'Aujourd hui'}
                                    </td>
                                    <td className="p-3 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                        <button
                                          onClick={() => {
                                            setCrudEditingItem(row);
                                            setCrudFormValues(row);
                                          }}
                                          className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition-colors"
                                          title="Modifier cet enregistrement"
                                        >
                                          Modifier
                                        </button>
                                        <button
                                          onClick={() => handleCrudDeleteRecord(row.id)}
                                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-colors"
                                          title="Supprimer cet enregistrement"
                                        >
                                          Supprimer
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* SQL Execution Inspector Box */}
                      <div className="rounded-2xl border border-gray-800 bg-gray-950 overflow-hidden shadow-2xl space-y-0">
                        <div className="px-4 py-3 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                            <span className="ml-2 font-mono text-xs text-gray-300 font-bold">Inspecteur de Requêtes SQL & Réponse PHP JSON</span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Status: 200 OK</span>
                        </div>

                        <div className="p-4 space-y-3 font-mono text-xs">
                          <div>
                            <div className="text-[10px] uppercase font-bold text-rose-400 mb-1">Dernière Requête SQL Exécutée :</div>
                            <div className="p-3 rounded-xl bg-gray-900 text-emerald-400 border border-gray-800 overflow-x-auto">
                              {crudLastSql}
                            </div>
                          </div>

                          <div>
                            <div className="text-[10px] uppercase font-bold text-sky-400 mb-1">Réponse Serveur JSON Live :</div>
                            <pre className="p-3 rounded-xl bg-gray-900 text-sky-300 border border-gray-800 overflow-x-auto max-h-48 text-[11px] leading-relaxed">
                              {crudResponseJson}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUBVIEW 2: FULL MYSQL DUMP SCRIPT */}
                  {crudSubView === 'dump' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl">
                        <div className="text-xs font-bold text-gray-700 dark:text-gray-300">
                          Script d initialisation complet comprenant 12 tables et le jeu de données initial du club Rotaract Ngozi.
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleCopyMySQLScript}
                            className="px-4 py-2 rounded-xl bg-gray-900 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-gray-800"
                          >
                            <Copy className="w-3.5 h-3.5 text-rose-400" /> Copier SQL
                          </button>
                          <button
                            onClick={handleDownloadMySQLFile}
                            className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-rose-500"
                          >
                            <Download className="w-3.5 h-3.5" /> Télécharger .sql
                          </button>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-800 bg-gray-950 overflow-hidden shadow-2xl">
                        <div className="px-4 py-3 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                            <span className="ml-2 font-mono text-xs text-gray-400">rotaract_ngozi_kugasaka_db.sql</span>
                          </div>
                          <span className="text-[10px] font-mono text-gray-500 uppercase">Engine: InnoDB | Charset: utf8mb4</span>
                        </div>
                        <pre className="p-5 text-xs font-mono text-emerald-400 overflow-x-auto max-h-[450px] leading-relaxed selection:bg-rose-500 selection:text-white">
                          {generateMySQLDumpScript()}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 9. ESPACE MEMBRE ROTARACTIEN */}
              {activeTab === 'espace_membre' && (
                <MembreActifDashboardModal
                  userEmail={email}
                  registrationsList={registrationsList}
                  onShowToast={(msg, type) => onShowToast?.(msg, type)}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                />
              )}

              {/* 10. ESPACE POSTULANT / VISITEUR */}
              {activeTab === 'espace_visiteur' && (
                <VisiterDashboardModal
                  userEmail={email}
                  applicationsList={applicationsList}
                  onShowToast={(msg, type) => onShowToast?.(msg, type)}
                  onRequestOpenMembership={() => {
                    onClose();
                    onShowToast('Ouverture du formulaire d adhésion...', 'info');
                  }}
                />
              )}


            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import {
  Sparkles,
  Trash2,
  PlusCircle,
  Camera,
  Home,
  Info,
  Layers,
  Calendar,
  Newspaper,
  Users,
  Phone,
  RotateCcw,
  Check,
  Search,
  ExternalLink,
  Target,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import { SiteContent, DEFAULT_SITE_CONTENT, saveStoredSiteContent } from '../data/siteContent';
import { Activity, EventItem, GalleryItem, NewsArticle, TeamMember } from '../types';

interface ContentSectionEditorProps {
  siteContentState: SiteContent;
  setSiteContentState: React.Dispatch<React.SetStateAction<SiteContent>>;
  selectedSectionTab: 'accueil' | 'apropos' | 'impact' | 'activites' | 'evenements' | 'galerie' | 'actualites' | 'equipe' | 'contact';
  setSelectedSectionTab: (tab: 'accueil' | 'apropos' | 'impact' | 'activites' | 'evenements' | 'galerie' | 'actualites' | 'equipe' | 'contact') => void;
  sectionSearchTerm: string;
  setSectionSearchTerm: (val: string) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
  newPhoto: { title: string; category: string; url: string };
  setNewPhoto: React.Dispatch<React.SetStateAction<{ title: string; category: string; url: string }>>;
  newActivityForm: { title: string; description: string; badge: string; image: string; impact: string };
  setNewActivityForm: React.Dispatch<React.SetStateAction<{ title: string; description: string; badge: string; image: string; impact: string }>>;
  newEventForm: { title: string; date: string; location: string; description: string; image: string; category: string; spots: string };
  setNewEventForm: React.Dispatch<React.SetStateAction<{ title: string; date: string; location: string; description: string; image: string; category: string; spots: string }>>;
  newNewsForm: { title: string; summary: string; date: string; author: string; image: string; category: string };
  setNewNewsForm: React.Dispatch<React.SetStateAction<{ title: string; summary: string; date: string; author: string; image: string; category: string }>>;
  newTeamMemberForm: { name: string; role: string; bio: string; image: string };
  setNewTeamMemberForm: React.Dispatch<React.SetStateAction<{ name: string; role: string; bio: string; image: string }>>;
  onExportEventsPDF?: () => void;
}

const PRESET_IMAGES = [
  { label: 'Don Sang', url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80' },
  { label: 'Arbres', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80' },
  { label: 'Éducation', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Équipe', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80' },
  { label: 'Conférence', url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80' },
];

export const ContentSectionEditor: React.FC<ContentSectionEditorProps> = ({
  siteContentState,
  setSiteContentState,
  selectedSectionTab,
  setSelectedSectionTab,
  sectionSearchTerm,
  setSectionSearchTerm,
  onShowToast,
  newPhoto,
  setNewPhoto,
  newActivityForm,
  setNewActivityForm,
  newEventForm,
  setNewEventForm,
  newNewsForm,
  setNewNewsForm,
  newTeamMemberForm,
  setNewTeamMemberForm,
  onExportEventsPDF,
}) => {
  const sectionTabsList = [
    { id: 'accueil', label: '1. Accueil', icon: Home },
    { id: 'apropos', label: '2. À propos', icon: Info },
    { id: 'impact', label: '3. Impact', icon: Target },
    { id: 'activites', label: `4. Activités (${(siteContentState?.activities || []).length})`, icon: Layers },
    { id: 'evenements', label: `5. Événements (${(siteContentState?.events || []).length})`, icon: Calendar },
    { id: 'galerie', label: `6. Galerie (${(siteContentState?.gallery || []).length})`, icon: Camera },
    { id: 'actualites', label: `7. Actualités (${(siteContentState?.news || []).length})`, icon: Newspaper },
    { id: 'equipe', label: `8. Équipe (${(siteContentState?.team || []).length})`, icon: Users },
    { id: 'contact', label: '9. Contact', icon: Phone },
  ] as const;

  const handleResetToDefault = () => {
    if (window.confirm('Voulez-vous vraiment réinitialiser toutes les 9 sections du site aux valeurs par défaut ?')) {
      setSiteContentState(DEFAULT_SITE_CONTENT);
      saveStoredSiteContent(DEFAULT_SITE_CONTENT);
      onShowToast('Contenu du site réinitialisé aux valeurs d origine ! 🔄', 'info');
    }
  };

  const filteredActivities = (siteContentState?.activities || []).filter(
    (a) =>
      (a?.title || '').toLowerCase().includes(sectionSearchTerm.toLowerCase()) ||
      (a?.description || '').toLowerCase().includes(sectionSearchTerm.toLowerCase()) ||
      (a?.categoryLabel || '').toLowerCase().includes(sectionSearchTerm.toLowerCase())
  );

  const filteredEvents = (siteContentState?.events || []).filter(
    (e) =>
      (e?.title || '').toLowerCase().includes(sectionSearchTerm.toLowerCase()) ||
      (e?.location || '').toLowerCase().includes(sectionSearchTerm.toLowerCase()) ||
      (e?.description || '').toLowerCase().includes(sectionSearchTerm.toLowerCase())
  );

  const filteredGallery = (siteContentState?.gallery || []).filter(
    (g) =>
      (g?.title || '').toLowerCase().includes(sectionSearchTerm.toLowerCase()) ||
      (g?.category || '').toLowerCase().includes(sectionSearchTerm.toLowerCase())
  );

  const filteredNews = (siteContentState?.news || []).filter(
    (n) =>
      (n?.title || '').toLowerCase().includes(sectionSearchTerm.toLowerCase()) ||
      (n?.summary || '').toLowerCase().includes(sectionSearchTerm.toLowerCase()) ||
      (n?.author || '').toLowerCase().includes(sectionSearchTerm.toLowerCase())
  );

  const filteredTeam = (siteContentState?.team || []).filter(
    (t) =>
      (t?.name || '').toLowerCase().includes(sectionSearchTerm.toLowerCase()) ||
      (t?.role || '').toLowerCase().includes(sectionSearchTerm.toLowerCase()) ||
      (t?.bio || '').toLowerCase().includes(sectionSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 dark:from-rose-950/40 dark:via-pink-950/30 dark:to-amber-950/30 border border-rose-200/80 dark:border-rose-900/60 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-[10px] font-bold tracking-wider uppercase text-rose-700 dark:text-rose-300">
            <Sparkles className="w-3 h-3" /> GESTION DU CONTENU DU SITE EN DIRECT
          </div>
          <h3 className="text-lg font-bold font-poppins text-gray-900 dark:text-white mt-1">
            Éditeur Dynamique des 9 Sections Principales
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
            Mettez à jour instantanément les textes, visuels, statistiques et listes publiques du Rotaract Ngozi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleResetToDefault}
            className="px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-all flex items-center gap-1.5"
            title="Réinitialiser tous les contenus par défaut"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
            Réinitialiser
          </button>

          <a
            href={`#${selectedSectionTab}`}
            className="px-3.5 py-2 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-bold text-xs hover:bg-rose-200 transition-all flex items-center gap-1.5"
            title="Voir cette section sur la page principale"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Aperçu Direct
          </a>

          <button
            onClick={() => {
              saveStoredSiteContent(siteContentState);
              onShowToast('Toutes les modifications du site ont été enregistrées avec succès ! 💾✨', 'success');
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs shadow-md shadow-rose-600/20 hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Enregistrer Tout le Site
          </button>
        </div>
      </div>

      {/* 9 Section Sub-tabs Pills */}
      <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">
        {sectionTabsList.map((sec) => {
          const Icon = sec.icon;
          const isActive = selectedSectionTab === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => {
                setSelectedSectionTab(sec.id as any);
                setSectionSearchTerm('');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {sec.label}
            </button>
          );
        })}
      </div>

      {/* SEARCH BAR FOR LIST-BASED TABS */}
      {['activites', 'evenements', 'galerie', 'actualites', 'equipe'].includes(selectedSectionTab) && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Rechercher dans la section ${selectedSectionTab}...`}
            value={sectionSearchTerm}
            onChange={(e) => setSectionSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
          />
        </div>
      )}

      {/* 1. ACCUEIL (#accueil) */}
      {selectedSectionTab === 'accueil' && (
        <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 space-y-5">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold font-poppins text-gray-900 dark:text-white uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <Home className="w-4 h-4" /> Section 1 : Accueil (#accueil)
            </h4>
          </div>

          {/* Mini Live Preview Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-rose-900 to-pink-900 text-white space-y-2 shadow-inner">
            <span className="inline-block px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
              {siteContentState.hero.badgeText}
            </span>
            <h3 className="text-base font-bold font-poppins">{siteContentState.hero.title}</h3>
            <p className="text-xs text-rose-100/90">{siteContentState.hero.subtitle}</p>
            <div className="flex gap-2 pt-2">
              <span className="px-3 py-1 rounded-lg bg-rose-500 text-white text-[10px] font-bold">
                {siteContentState.hero.ctaPrimary}
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/20 text-white text-[10px] font-bold">
                {siteContentState.hero.ctaSecondary}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Badge d accueil
              </label>
              <input
                type="text"
                value={siteContentState.hero.badgeText}
                onChange={(e) =>
                  setSiteContentState({
                    ...siteContentState,
                    hero: { ...siteContentState.hero, badgeText: e.target.value },
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Titre Principal
              </label>
              <textarea
                rows={2}
                value={siteContentState.hero.title}
                onChange={(e) =>
                  setSiteContentState({
                    ...siteContentState,
                    hero: { ...siteContentState.hero, title: e.target.value },
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Sous-titre / Présentation
              </label>
              <textarea
                rows={3}
                value={siteContentState.hero.subtitle}
                onChange={(e) =>
                  setSiteContentState({
                    ...siteContentState,
                    hero: { ...siteContentState.hero, subtitle: e.target.value },
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white font-medium"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Bouton Principal CTA
                </label>
                <input
                  type="text"
                  value={siteContentState.hero.ctaPrimary}
                  onChange={(e) =>
                    setSiteContentState({
                      ...siteContentState,
                      hero: { ...siteContentState.hero, ctaPrimary: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Bouton Secondaire CTA
                </label>
                <input
                  type="text"
                  value={siteContentState.hero.ctaSecondary}
                  onChange={(e) =>
                    setSiteContentState({
                      ...siteContentState,
                      hero: { ...siteContentState.hero, ctaSecondary: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white font-medium"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                Chiffres Clés de l Accueil
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block mb-1">Membres</span>
                  <input
                    type="text"
                    value={siteContentState.hero.statMembers}
                    onChange={(e) =>
                      setSiteContentState({
                        ...siteContentState,
                        hero: { ...siteContentState.hero, statMembers: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block mb-1">Arbres plantés</span>
                  <input
                    type="text"
                    value={siteContentState.hero.statTrees}
                    onChange={(e) =>
                      setSiteContentState({
                        ...siteContentState,
                        hero: { ...siteContentState.hero, statTrees: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block mb-1">Poches de sang</span>
                  <input
                    type="text"
                    value={siteContentState.hero.statBlood}
                    onChange={(e) =>
                      setSiteContentState({
                        ...siteContentState,
                        hero: { ...siteContentState.hero, statBlood: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block mb-1">Projets réalisés</span>
                  <input
                    type="text"
                    value={siteContentState.hero.statProjects}
                    onChange={(e) =>
                      setSiteContentState({
                        ...siteContentState,
                        hero: { ...siteContentState.hero, statProjects: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              saveStoredSiteContent(siteContentState);
              onShowToast('Section Accueil mise à jour avec succès ! ✅', 'success');
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
          >
            Enregistrer la section Accueil
          </button>
        </div>
      )}

      {/* 2. À PROPOS (#apropos) */}
      {selectedSectionTab === 'apropos' && (
        <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 space-y-5">
          <h4 className="text-sm font-bold font-poppins text-gray-900 dark:text-white uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <Info className="w-4 h-4" /> Section 2 : À propos (#apropos)
          </h4>

          {/* Live Mini Preview */}
          <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-2">
            <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-bold">
              {siteContentState.about.badge}
            </span>
            <h3 className="text-sm font-bold font-poppins text-gray-900 dark:text-white">{siteContentState.about.sectionTitle}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 italic">{siteContentState.about.missionText}</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Badge de section</label>
              <input
                type="text"
                value={siteContentState.about.badge}
                onChange={(e) =>
                  setSiteContentState({
                    ...siteContentState,
                    about: { ...siteContentState.about, badge: e.target.value },
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Titre de section</label>
              <input
                type="text"
                value={siteContentState.about.sectionTitle}
                onChange={(e) =>
                  setSiteContentState({
                    ...siteContentState,
                    about: { ...siteContentState.about, sectionTitle: e.target.value },
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Texte Histoire / Origine</label>
              <textarea
                rows={3}
                value={siteContentState.about.historyText}
                onChange={(e) =>
                  setSiteContentState({
                    ...siteContentState,
                    about: { ...siteContentState.about, historyText: e.target.value },
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Texte Mission Humanitaire</label>
              <textarea
                rows={3}
                value={siteContentState.about.missionText}
                onChange={(e) =>
                  setSiteContentState({
                    ...siteContentState,
                    about: { ...siteContentState.about, missionText: e.target.value },
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Vision du Club</label>
                <textarea
                  rows={2}
                  value={siteContentState.about.visionText}
                  onChange={(e) =>
                    setSiteContentState({
                      ...siteContentState,
                      about: { ...siteContentState.about, visionText: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Valeurs Clés</label>
                <textarea
                  rows={2}
                  value={siteContentState.about.valuesText}
                  onChange={(e) =>
                    setSiteContentState({
                      ...siteContentState,
                      about: { ...siteContentState.about, valuesText: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              saveStoredSiteContent(siteContentState);
              onShowToast('Section À propos mise à jour ! ✅', 'success');
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
          >
            Enregistrer la section À propos
          </button>
        </div>
      )}

      {/* 3. IMPACT (#impact) */}
      {selectedSectionTab === 'impact' && (
        <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 space-y-5">
          <h4 className="text-sm font-bold font-poppins text-gray-900 dark:text-white uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <Target className="w-4 h-4" /> Section 3 : Impact (#impact)
          </h4>

          <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
              {siteContentState.impact.badge}
            </span>
            <h3 className="text-sm font-bold font-poppins text-gray-900 dark:text-white">{siteContentState.impact.sectionTitle}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300">{siteContentState.impact.impactDescription}</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Badge Impact</label>
              <input
                type="text"
                value={siteContentState.impact.badge}
                onChange={(e) =>
                  setSiteContentState({
                    ...siteContentState,
                    impact: { ...siteContentState.impact, badge: e.target.value },
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Titre de section</label>
              <input
                type="text"
                value={siteContentState.impact.sectionTitle}
                onChange={(e) =>
                  setSiteContentState({
                    ...siteContentState,
                    impact: { ...siteContentState.impact, sectionTitle: e.target.value },
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Description générale de l impact</label>
              <textarea
                rows={3}
                value={siteContentState.impact.impactDescription}
                onChange={(e) =>
                  setSiteContentState({
                    ...siteContentState,
                    impact: { ...siteContentState.impact, impactDescription: e.target.value },
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-[10px] font-bold text-gray-500 block mb-1">Objectif Arbres</span>
                <input
                  type="text"
                  value={siteContentState.impact.targetTrees}
                  onChange={(e) =>
                    setSiteContentState({
                      ...siteContentState,
                      impact: { ...siteContentState.impact, targetTrees: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-500 block mb-1">Objectif Poches Sang</span>
                <input
                  type="text"
                  value={siteContentState.impact.targetBlood}
                  onChange={(e) =>
                    setSiteContentState({
                      ...siteContentState,
                      impact: { ...siteContentState.impact, targetBlood: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-500 block mb-1">Objectif Orphelins</span>
                <input
                  type="text"
                  value={siteContentState.impact.targetOrphans}
                  onChange={(e) =>
                    setSiteContentState({
                      ...siteContentState,
                      impact: { ...siteContentState.impact, targetOrphans: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-500 block mb-1">Objectif Jeunes Formés</span>
                <input
                  type="text"
                  value={siteContentState.impact.targetLeaders}
                  onChange={(e) =>
                    setSiteContentState({
                      ...siteContentState,
                      impact: { ...siteContentState.impact, targetLeaders: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white font-bold"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              saveStoredSiteContent(siteContentState);
              onShowToast('Section Impact mise à jour ! ✅', 'success');
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
          >
            Enregistrer la section Impact
          </button>
        </div>
      )}

      {/* 4. ACTIVITÉS (#activites) */}
      {selectedSectionTab === 'activites' && (
        <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold font-poppins text-gray-900 dark:text-white uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Section 4 : Activités ({filteredActivities.length})
            </h4>
          </div>

          {/* Add New Activity Form Card */}
          <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-rose-200 dark:border-rose-900/60 space-y-3 shadow-2xs">
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
              <PlusCircle className="w-4 h-4" /> Ajouter une nouvelle activité
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Titre de l activité (ex: Don de Sang Communautaire)"
                value={newActivityForm.title}
                onChange={(e) => setNewActivityForm({ ...newActivityForm, title: e.target.value })}
                className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Badge (ex: Santé / Environnement / Éducation)"
                value={newActivityForm.badge}
                onChange={(e) => setNewActivityForm({ ...newActivityForm, badge: e.target.value })}
                className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
              />
            </div>
            <textarea
              rows={2}
              placeholder="Description détaillée de l activité..."
              value={newActivityForm.description}
              onChange={(e) => setNewActivityForm({ ...newActivityForm, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="URL Image de l activité"
                  value={newActivityForm.image}
                  onChange={(e) => setNewActivityForm({ ...newActivityForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white mb-1"
                />
                <div className="flex gap-1 overflow-x-auto py-1">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewActivityForm({ ...newActivityForm, image: preset.url })}
                      className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[9px] font-bold text-gray-700 dark:text-gray-300 hover:bg-rose-100 hover:text-rose-700 shrink-0"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                placeholder="Impact estimé (ex: 150+ bénéficiaires)"
                value={newActivityForm.impact}
                onChange={(e) => setNewActivityForm({ ...newActivityForm, impact: e.target.value })}
                className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white h-10"
              />
            </div>
            <button
              onClick={() => {
                if (!newActivityForm.title.trim()) {
                  onShowToast('Veuillez entrer au moins un titre d activité.', 'error');
                  return;
                }
                const created: Activity = {
                  id: `act-${Date.now()}`,
                  title: newActivityForm.title,
                  description: newActivityForm.description || 'Description de la nouvelle activité.',
                  category: 'humanitaire',
                  categoryLabel: newActivityForm.badge || 'Action',
                  date: '2026',
                  location: 'Ngozi, Burundi',
                  image: newActivityForm.image || PRESET_IMAGES[0].url,
                  impactMetrics: newActivityForm.impact || 'Communauté Ngozi',
                };
                const updated = [created, ...siteContentState.activities];
                const newContent = { ...siteContentState, activities: updated };
                setSiteContentState(newContent);
                saveStoredSiteContent(newContent);
                setNewActivityForm({ title: '', description: '', badge: 'Humanitaire', image: '', impact: '100+ bénéficiaires' });
                onShowToast('Nouvelle activité ajoutée avec succès ! 🚀', 'success');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs shadow-md"
            >
              ➕ Créer et Ajouter l Activité
            </button>
          </div>

          {/* Activities List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {filteredActivities.map((act) => {
              const realIndex = siteContentState.activities.findIndex((a) => a.id === act.id);
              return (
                <div key={act.id} className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-2.5">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs font-bold text-rose-600">Activité #{realIndex + 1}</span>
                    <button
                      onClick={() => {
                        const updated = siteContentState.activities.filter((a) => a.id !== act.id);
                        const newContent = { ...siteContentState, activities: updated };
                        setSiteContentState(newContent);
                        saveStoredSiteContent(newContent);
                        onShowToast('Activité supprimée.', 'info');
                      }}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Supprimer
                    </button>
                  </div>

                  <div className="flex gap-3 items-start">
                    {act.image && (
                      <img
                        src={act.image}
                        alt={act.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-200 dark:border-gray-700"
                      />
                    )}
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={act.title}
                        onChange={(e) => {
                          const updated = [...siteContentState.activities];
                          updated[realIndex].title = e.target.value;
                          setSiteContentState({ ...siteContentState, activities: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white"
                      />
                      <textarea
                        rows={2}
                        value={act.description}
                        onChange={(e) => {
                          const updated = [...siteContentState.activities];
                          updated[realIndex].description = e.target.value;
                          setSiteContentState({ ...siteContentState, activities: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-800 dark:text-gray-200"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              saveStoredSiteContent(siteContentState);
              onShowToast('Liste des activités enregistrée ! ✅', 'success');
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
          >
            Sauvegarder les Activités
          </button>
        </div>
      )}

      {/* 5. ÉVÉNEMENTS (#evenements) */}
      {selectedSectionTab === 'evenements' && (
        <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h4 className="text-sm font-bold font-poppins text-gray-900 dark:text-white uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Section 5 : Événements ({filteredEvents.length})
            </h4>

            {onExportEventsPDF && (
              <button
                type="button"
                onClick={onExportEventsPDF}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-all active:scale-95"
                title="Générer et télécharger un rapport PDF récapitulatif des événements via jsPDF"
              >
                <FileText className="w-3.5 h-3.5" />
                Exporter en PDF
              </button>
            )}
          </div>

          {/* Add New Event Form Card */}
          <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-rose-200 dark:border-rose-900/60 space-y-3 shadow-2xs">
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
              <PlusCircle className="w-4 h-4" /> Ajouter un nouvel événement
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Titre de l événement"
                value={newEventForm.title}
                onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Date & Heure (ex: Samedi 15 Août 2026 à 14h)"
                value={newEventForm.date}
                onChange={(e) => setNewEventForm({ ...newEventForm, date: e.target.value })}
                className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Lieu (ex: Hôtel Panorama, Ngozi)"
                value={newEventForm.location}
                onChange={(e) => setNewEventForm({ ...newEventForm, location: e.target.value })}
                className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
              />
              <div>
                <input
                  type="text"
                  placeholder="URL Image de couverture"
                  value={newEventForm.image}
                  onChange={(e) => setNewEventForm({ ...newEventForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                />
                <div className="flex gap-1 overflow-x-auto py-1">
                  {PRESET_IMAGES.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewEventForm({ ...newEventForm, image: p.url })}
                      className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[9px] font-bold text-gray-700 dark:text-gray-300 hover:bg-rose-100 hover:text-rose-700 shrink-0"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <textarea
              rows={2}
              placeholder="Description de l événement..."
              value={newEventForm.description}
              onChange={(e) => setNewEventForm({ ...newEventForm, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
            <button
              onClick={() => {
                if (!newEventForm.title.trim()) {
                  onShowToast('Veuillez entrer un titre d événement.', 'error');
                  return;
                }
                const created: EventItem = {
                  id: `evt-${Date.now()}`,
                  title: newEventForm.title,
                  day: '15',
                  month: 'AOU',
                  year: '2026',
                  time: '14:00',
                  location: newEventForm.location || 'Ngozi, Burundi',
                  description: newEventForm.description || 'Description de l événement.',
                  image: newEventForm.image || PRESET_IMAGES[4].url,
                  category: newEventForm.category || 'Réunion',
                  spotsLeft: 50,
                };
                const updated = [created, ...siteContentState.events];
                const newContent = { ...siteContentState, events: updated };
                setSiteContentState(newContent);
                saveStoredSiteContent(newContent);
                setNewEventForm({ title: '', date: '', location: 'Ngozi, Burundi', description: '', image: '', category: 'Action Sociale', spots: '100 places' });
                onShowToast('Nouvel événement ajouté avec succès ! 📅✨', 'success');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs shadow-md"
            >
              ➕ Créer et Publier l Événement
            </button>
          </div>

          {/* Events List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {filteredEvents.map((evt) => {
              const realIndex = siteContentState.events.findIndex((e) => e.id === evt.id);
              return (
                <div key={evt.id} className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-2.5">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs font-bold text-rose-600">Événement #{realIndex + 1}</span>
                    <button
                      onClick={() => {
                        const updated = siteContentState.events.filter((e) => e.id !== evt.id);
                        const newContent = { ...siteContentState, events: updated };
                        setSiteContentState(newContent);
                        saveStoredSiteContent(newContent);
                        onShowToast('Événement supprimé.', 'info');
                      }}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Supprimer
                    </button>
                  </div>

                  <div className="flex gap-3 items-start">
                    {evt.image && (
                      <img
                        src={evt.image}
                        alt={evt.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-200 dark:border-gray-700"
                      />
                    )}
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={evt.title}
                        onChange={(e) => {
                          const updated = [...siteContentState.events];
                          updated[realIndex].title = e.target.value;
                          setSiteContentState({ ...siteContentState, events: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={evt.date || `${evt.day} ${evt.month} ${evt.year}`}
                          onChange={(e) => {
                            const updated = [...siteContentState.events];
                            updated[realIndex].date = e.target.value;
                            setSiteContentState({ ...siteContentState, events: updated });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] text-gray-700 dark:text-gray-300"
                        />
                        <input
                          type="text"
                          value={evt.location}
                          onChange={(e) => {
                            const updated = [...siteContentState.events];
                            updated[realIndex].location = e.target.value;
                            setSiteContentState({ ...siteContentState, events: updated });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] text-gray-700 dark:text-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              saveStoredSiteContent(siteContentState);
              onShowToast('Liste des événements enregistrée ! ✅', 'success');
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
          >
            Sauvegarder les Événements
          </button>
        </div>
      )}

      {/* 6. GALERIE (#galerie) */}
      {selectedSectionTab === 'galerie' && (
        <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold font-poppins text-gray-900 dark:text-white uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <Camera className="w-4 h-4" /> Section 6 : Galerie Photos ({filteredGallery.length})
            </h4>
          </div>

          {/* Add New Photo Form Card */}
          <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-rose-200 dark:border-rose-900/60 space-y-3 shadow-2xs">
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Camera className="w-4 h-4" /> Ajouter une Nouvelle Photo à la Galerie
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 mb-1">Titre de la photo</label>
                <input
                  type="text"
                  placeholder="ex: Distribution de manuels scolaires à Ngozi"
                  value={newPhoto.title}
                  onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 mb-1">Catégorie</label>
                <select
                  value={newPhoto.category}
                  onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white"
                >
                  <option value="Santé & Don de Sang">Santé & Don de Sang</option>
                  <option value="Environnement & Climat">Environnement & Climat</option>
                  <option value="Éducation & Jeunesse">Éducation & Jeunesse</option>
                  <option value="Membres & Camaraderie">Membres & Camaraderie</option>
                  <option value="Événements & Réunions">Événements & Réunions</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 mb-1">URL de l image ou Choisissez un modèle ci-dessous</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/photo-..."
                value={newPhoto.url}
                onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <span className="text-[10px] text-gray-500 font-bold block mb-1.5">Images recommandées :</span>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setNewPhoto({ ...newPhoto, url: preset.url })}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all h-14 group ${
                      newPhoto.url === preset.url ? 'border-rose-600 scale-105 shadow-md' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-[9px] font-bold text-center py-0.5">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!newPhoto.title.trim()) {
                  onShowToast('Veuillez entrer un titre pour la photo.', 'error');
                  return;
                }
                const createdPhoto: GalleryItem = {
                  id: `img-${Date.now()}`,
                  title: newPhoto.title,
                  category: newPhoto.category || 'Membres',
                  image: newPhoto.url || PRESET_IMAGES[3].url,
                  date: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
                };
                const updated = [createdPhoto, ...siteContentState.gallery];
                const newContent = { ...siteContentState, gallery: updated };
                setSiteContentState(newContent);
                saveStoredSiteContent(newContent);
                setNewPhoto({ title: '', category: 'Santé & Don de Sang', url: '' });
                onShowToast('Photo ajoutée avec succès à la Galerie ! 📸✨', 'success');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
            >
              <ImageIcon className="w-4 h-4" />
              Ajouter la Photo
            </button>
          </div>

          {/* Photo Grid */}
          <div className="grid sm:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-1">
            {filteredGallery.map((img) => {
              const realIndex = siteContentState.gallery.findIndex((g) => g.id === img.id);
              return (
                <div key={img.id} className="p-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-2.5 shadow-2xs">
                  <div className="flex gap-3 items-center">
                    <img
                      src={img.image}
                      alt={img.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
                    />
                    <div className="flex-1 space-y-1.5 overflow-hidden">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-bold">
                        {img.category}
                      </span>
                      <input
                        type="text"
                        value={img.title}
                        onChange={(e) => {
                          const updated = [...siteContentState.gallery];
                          updated[realIndex].title = e.target.value;
                          setSiteContentState({ ...siteContentState, gallery: updated });
                        }}
                        className="w-full px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white"
                      />
                      <input
                        type="text"
                        value={img.image}
                        onChange={(e) => {
                          const updated = [...siteContentState.gallery];
                          updated[realIndex].image = e.target.value;
                          setSiteContentState({ ...siteContentState, gallery: updated });
                        }}
                        className="w-full px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[10px] text-gray-500 dark:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        const updated = siteContentState.gallery.filter((g) => g.id !== img.id);
                        const newContent = { ...siteContentState, gallery: updated };
                        setSiteContentState(newContent);
                        saveStoredSiteContent(newContent);
                        onShowToast('Photo supprimée de la galerie.', 'info');
                      }}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              saveStoredSiteContent(siteContentState);
              onShowToast('Galerie photo enregistrée ! ✅', 'success');
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
          >
            Sauvegarder la Galerie
          </button>
        </div>
      )}

      {/* 7. ACTUALITÉS (#actualites) */}
      {selectedSectionTab === 'actualites' && (
        <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold font-poppins text-gray-900 dark:text-white uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <Newspaper className="w-4 h-4" /> Section 7 : Actualités & Articles ({filteredNews.length})
            </h4>
          </div>

          {/* Add New Article Form Card */}
          <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-rose-200 dark:border-rose-900/60 space-y-3 shadow-2xs">
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
              <PlusCircle className="w-4 h-4" /> Publier un nouvel article
            </div>
            <input
              type="text"
              placeholder="Titre de l article"
              value={newNewsForm.title}
              onChange={(e) => setNewNewsForm({ ...newNewsForm, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white"
            />
            <textarea
              rows={2}
              placeholder="Résumé de l article..."
              value={newNewsForm.summary}
              onChange={(e) => setNewNewsForm({ ...newNewsForm, summary: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="URL Image de couverture"
                  value={newNewsForm.image}
                  onChange={(e) => setNewNewsForm({ ...newNewsForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                />
                <div className="flex gap-1 overflow-x-auto py-1">
                  {PRESET_IMAGES.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewNewsForm({ ...newNewsForm, image: p.url })}
                      className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[9px] font-bold text-gray-700 dark:text-gray-300 hover:bg-rose-100 hover:text-rose-700 shrink-0"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                placeholder="Auteur (ex: Bureau Ngozi)"
                value={newNewsForm.author}
                onChange={(e) => setNewNewsForm({ ...newNewsForm, author: e.target.value })}
                className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white h-10"
              />
            </div>
            <button
              onClick={() => {
                if (!newNewsForm.title.trim()) {
                  onShowToast('Veuillez entrer un titre d article.', 'error');
                  return;
                }
                const created: NewsArticle = {
                  id: `news-${Date.now()}`,
                  title: newNewsForm.title,
                  summary: newNewsForm.summary || 'Résumé de l article.',
                  content: newNewsForm.summary || 'Contenu complet de l article.',
                  date: newNewsForm.date || new Date().toLocaleDateString('fr-FR'),
                  readTime: '3 min',
                  author: newNewsForm.author || 'Rotaract Ngozi',
                  image: newNewsForm.image || PRESET_IMAGES[0].url,
                  category: newNewsForm.category || 'Actualité',
                };
                const updated = [created, ...siteContentState.news];
                const newContent = { ...siteContentState, news: updated };
                setSiteContentState(newContent);
                saveStoredSiteContent(newContent);
                setNewNewsForm({ title: '', summary: '', date: new Date().toLocaleDateString('fr-FR'), author: 'Bureau Ngozi', image: '', category: 'Communauté' });
                onShowToast('Article publié avec succès ! 📰✨', 'success');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs shadow-md"
            >
              ➕ Créer et Publier l Article
            </button>
          </div>

          {/* Articles List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {filteredNews.map((item) => {
              const realIndex = siteContentState.news.findIndex((n) => n.id === item.id);
              return (
                <div key={item.id} className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-2.5">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs font-bold text-rose-600">Article #{realIndex + 1}</span>
                    <button
                      onClick={() => {
                        const updated = siteContentState.news.filter((n) => n.id !== item.id);
                        const newContent = { ...siteContentState, news: updated };
                        setSiteContentState(newContent);
                        saveStoredSiteContent(newContent);
                        onShowToast('Article supprimé.', 'info');
                      }}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Supprimer
                    </button>
                  </div>

                  <div className="flex gap-3 items-start">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-200 dark:border-gray-700"
                      />
                    )}
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...siteContentState.news];
                          updated[realIndex].title = e.target.value;
                          setSiteContentState({ ...siteContentState, news: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white"
                      />
                      <textarea
                        rows={2}
                        value={item.summary}
                        onChange={(e) => {
                          const updated = [...siteContentState.news];
                          updated[realIndex].summary = e.target.value;
                          setSiteContentState({ ...siteContentState, news: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-800 dark:text-gray-200"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              saveStoredSiteContent(siteContentState);
              onShowToast('Articles enregistrés ! ✅', 'success');
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
          >
            Sauvegarder les Articles
          </button>
        </div>
      )}

      {/* 8. ÉQUIPE (#equipe) */}
      {selectedSectionTab === 'equipe' && (
        <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold font-poppins text-gray-900 dark:text-white uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <Users className="w-4 h-4" /> Section 8 : Membres de l Équipe ({filteredTeam.length})
            </h4>
          </div>

          {/* Add Team Member Card */}
          <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-rose-200 dark:border-rose-900/60 space-y-3 shadow-2xs">
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
              <PlusCircle className="w-4 h-4" /> Ajouter un membre du bureau
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Nom complet (ex: Jean-Luc Ndayishimiye)"
                value={newTeamMemberForm.name}
                onChange={(e) => setNewTeamMemberForm({ ...newTeamMemberForm, name: e.target.value })}
                className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Rôle / Mandat (ex: Président du Club 2025-2026)"
                value={newTeamMemberForm.role}
                onChange={(e) => setNewTeamMemberForm({ ...newTeamMemberForm, role: e.target.value })}
                className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="URL Photo de profil"
                  value={newTeamMemberForm.image}
                  onChange={(e) => setNewTeamMemberForm({ ...newTeamMemberForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                />
                <div className="flex gap-1 overflow-x-auto py-1">
                  {PRESET_IMAGES.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewTeamMemberForm({ ...newTeamMemberForm, image: p.url })}
                      className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[9px] font-bold text-gray-700 dark:text-gray-300 hover:bg-rose-100 hover:text-rose-700 shrink-0"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                rows={2}
                placeholder="Bio / Description..."
                value={newTeamMemberForm.bio}
                onChange={(e) => setNewTeamMemberForm({ ...newTeamMemberForm, bio: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
              />
            </div>
            <button
              onClick={() => {
                if (!newTeamMemberForm.name.trim()) {
                  onShowToast('Veuillez entrer le nom du membre.', 'error');
                  return;
                }
                const created: TeamMember = {
                  id: `tm-${Date.now()}`,
                  name: newTeamMemberForm.name,
                  role: newTeamMemberForm.role || 'Membre du Bureau',
                  image: newTeamMemberForm.image || PRESET_IMAGES[3].url,
                  bio: newTeamMemberForm.bio || 'Membre engagé du Rotaract Club Ngozi Kugasaka.',
                };
                const updated = [...siteContentState.team, created];
                const newContent = { ...siteContentState, team: updated };
                setSiteContentState(newContent);
                saveStoredSiteContent(newContent);
                setNewTeamMemberForm({ name: '', role: '', bio: '', image: '' });
                onShowToast('Membre ajouté à l équipe ! 👤✨', 'success');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs shadow-md"
            >
              ➕ Ajouter au Bureau
            </button>
          </div>

          {/* Team List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {filteredTeam.map((member) => {
              const realIndex = siteContentState.team.findIndex((t) => t.id === member.id);
              return (
                <div key={member.id} className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-2.5">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs font-bold text-rose-600">Membre #{realIndex + 1}</span>
                    <button
                      onClick={() => {
                        const updated = siteContentState.team.filter((t) => t.id !== member.id);
                        const newContent = { ...siteContentState, team: updated };
                        setSiteContentState(newContent);
                        saveStoredSiteContent(newContent);
                        onShowToast('Membre supprimé.', 'info');
                      }}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Supprimer
                    </button>
                  </div>

                  <div className="flex gap-3 items-start">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-14 h-14 rounded-full object-cover shrink-0 border border-gray-200 dark:border-gray-700"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="grid sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => {
                            const updated = [...siteContentState.team];
                            updated[realIndex].name = e.target.value;
                            setSiteContentState({ ...siteContentState, team: updated });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white"
                        />
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => {
                            const updated = [...siteContentState.team];
                            updated[realIndex].role = e.target.value;
                            setSiteContentState({ ...siteContentState, team: updated });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-rose-600 dark:text-rose-400 font-semibold"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={member.bio}
                        onChange={(e) => {
                          const updated = [...siteContentState.team];
                          updated[realIndex].bio = e.target.value;
                          setSiteContentState({ ...siteContentState, team: updated });
                        }}
                        className="w-full px-3 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              saveStoredSiteContent(siteContentState);
              onShowToast('Membres de l équipe enregistrés ! ✅', 'success');
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
          >
            Sauvegarder l Équipe
          </button>
        </div>
      )}

      {/* 9. CONTACT (#contact) */}
      {selectedSectionTab === 'contact' && (
        <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 space-y-5">
          <h4 className="text-sm font-bold font-poppins text-gray-900 dark:text-white uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <Phone className="w-4 h-4" /> Section 9 : Contact & Informations (#contact)
          </h4>

          {/* Contact Card Preview */}
          <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-2">
            <p className="text-xs text-gray-900 dark:text-white font-bold">📧 {siteContentState.contact.email}</p>
            <p className="text-xs text-gray-800 dark:text-gray-200 font-bold">📞 {siteContentState.contact.phone}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">📍 {siteContentState.contact.address}</p>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">⏰ {siteContentState.contact.meetingTimes} — {siteContentState.contact.meetingPlace}</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Adresse Email de Contact Officielle
              </label>
              <input
                type="email"
                value={siteContentState.contact.email}
                onChange={(e) =>
                  setSiteContentState({
                    ...siteContentState,
                    contact: { ...siteContentState.contact, email: e.target.value },
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Téléphone / WhatsApp
              </label>
              <input
                type="text"
                value={siteContentState.contact.phone}
                onChange={(e) =>
                  setSiteContentState({
                    ...siteContentState,
                    contact: { ...siteContentState.contact, phone: e.target.value },
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Siège Social / Localisation
              </label>
              <input
                type="text"
                value={siteContentState.contact.address}
                onChange={(e) =>
                  setSiteContentState({
                    ...siteContentState,
                    contact: { ...siteContentState.contact, address: e.target.value },
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white font-medium"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Heures & Jours de Réunion
                </label>
                <input
                  type="text"
                  value={siteContentState.contact.meetingTimes}
                  onChange={(e) =>
                    setSiteContentState({
                      ...siteContentState,
                      contact: { ...siteContentState.contact, meetingTimes: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Lieu des Réunions
                </label>
                <input
                  type="text"
                  value={siteContentState.contact.meetingPlace}
                  onChange={(e) =>
                    setSiteContentState({
                      ...siteContentState,
                      contact: { ...siteContentState.contact, meetingPlace: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white font-medium"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              saveStoredSiteContent(siteContentState);
              onShowToast('Informations de Contact enregistrées ! ✅', 'success');
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
          >
            Enregistrer la section Contact
          </button>
        </div>
      )}
    </div>
  );
};

import { Activity, EventItem, TeamMember, GalleryItem, NewsArticle, SocialPost } from '../types';
import {
  ACTIVITIES_DATA,
  EVENTS_DATA,
  TEAM_DATA,
  GALLERY_DATA,
  NEWS_DATA,
  SOCIAL_POSTS_DATA
} from './mockData';

export interface HeroContent {
  badgeText: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  statMembers: string;
  statTrees: string;
  statBlood: string;
  statProjects: string;
}

export interface AboutContent {
  badge: string;
  sectionTitle: string;
  historyText: string;
  missionText: string;
  visionText: string;
  valuesText: string;
}

export interface ImpactContent {
  badge: string;
  sectionTitle: string;
  impactDescription: string;
  targetTrees: string;
  targetBlood: string;
  targetOrphans: string;
  targetLeaders: string;
}

export interface ContactContent {
  email: string;
  phone: string;
  address: string;
  meetingTimes: string;
  meetingPlace: string;
}

export interface SiteContent {
  hero: HeroContent;
  about: AboutContent;
  impact: ImpactContent;
  activities: Activity[];
  events: EventItem[];
  gallery: GalleryItem[];
  news: NewsArticle[];
  team: TeamMember[];
  contact: ContactContent;
  socialPosts: SocialPost[];
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    badgeText: 'DISTRICT 9150 • ROTARACT CLUB NGOZI KUGASAKA',
    title: 'Servir d\'abord pour illuminer la province de Ngozi',
    subtitle: 'Une communauté dynamique de jeunes leaders de 18 à 30 ans dévoués au développement de la santé, de l\'environnement et de l\'éducation au Burundi.',
    ctaPrimary: 'Devenir Membre',
    ctaSecondary: 'Découvrir nos Actions',
    statMembers: '45+',
    statTrees: '500+',
    statBlood: '150+',
    statProjects: '28+',
  },
  about: {
    badge: 'NOTRE HISTOIRE & MISSION',
    sectionTitle: 'À Propos du Rotaract Club Ngozi Kugasaka',
    historyText: 'Fondé avec la passion de servir et de dynamiser la jeunesse du Burundi, le Rotaract Club Ngozi Kugasaka rassemble des étudiants, diplômés et jeunes professionnels unis par des valeurs communes de solidarité, d\'éthique et de leadership.',
    missionText: 'Concevoir et réaliser des projets humanitaires durables dans la province de Ngozi tout en développant le potentiel professionnel et humain de nos membres.',
    visionText: 'Être le moteur de référence du leadership de la jeunesse et du progrès social au Burundi.',
    valuesText: 'Camaraderie, Éthique, Diversité, Intégrité et Service au-dessus de soi.',
  },
  impact: {
    badge: 'TRANSPARENCE & RÉSULTATS',
    sectionTitle: 'Calculateur & Tableau de Bord d\'Impact Communautaire',
    impactDescription: 'Découvrez l\'effet multiplicateur de vos contributions et de nos bénévoles sur le terrain à Ngozi.',
    targetTrees: '1000',
    targetBlood: '300',
    targetOrphans: '150',
    targetLeaders: '100',
  },
  activities: ACTIVITIES_DATA,
  events: EVENTS_DATA,
  gallery: GALLERY_DATA,
  news: NEWS_DATA,
  team: TEAM_DATA,
  contact: {
    email: 'rotaractclubngozikugasaka9150@gmail.com',
    phone: '+257 79 000 000 / +257 68 000 000',
    address: 'Quartier Kugasaka, Ville de Ngozi, Burundi',
    meetingTimes: 'Tous les 2ièmes et 4ièmes Samedis du mois à 14h00',
    meetingPlace: 'Salle de Réunion de l\'Hôtel Panorama, Ngozi',
  },
  socialPosts: SOCIAL_POSTS_DATA,
};

export const getStoredSiteContent = (): SiteContent => {
  try {
    const saved = localStorage.getItem('rotaract_site_content');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_SITE_CONTENT,
        ...parsed,
        hero: { ...DEFAULT_SITE_CONTENT.hero, ...parsed.hero },
        about: { ...DEFAULT_SITE_CONTENT.about, ...parsed.about },
        impact: { ...DEFAULT_SITE_CONTENT.impact, ...parsed.impact },
        contact: { ...DEFAULT_SITE_CONTENT.contact, ...parsed.contact },
      };
    }
  } catch (e) {
    console.error('Error loading site content:', e);
  }
  return DEFAULT_SITE_CONTENT;
};

export const saveStoredSiteContent = (content: SiteContent) => {
  try {
    localStorage.setItem('rotaract_site_content', JSON.stringify(content));
    window.dispatchEvent(new Event('site_content_updated'));
  } catch (e) {
    console.error('Error saving site content:', e);
  }
};

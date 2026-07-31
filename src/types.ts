export interface Activity {
  id: string;
  title: string;
  category: 'sante' | 'environnement' | 'education' | 'humanitaire' | 'formation';
  categoryLabel: string;
  date: string;
  location: string;
  image: string;
  description: string;
  fullContent?: string;
  impactMetrics?: string;
}

export interface EventItem {
  id: string;
  title: string;
  day: string;
  month: string;
  year: string;
  time: string;
  location: string;
  image: string;
  description: string;
  spotsLeft: number;
  category: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  email?: string;
  linkedin?: string;
  facebook?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  date?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  summary: string;
  content: string;
  author: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'adhesion' | 'activites' | 'partenariat' | 'general';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  mode?: 'gemini' | 'fallback' | 'fallback_error';
}

export interface MembershipFormData {
  fullName: string;
  email: string;
  phone: string;
  age: string;
  occupation: string;
  interests: string[];
  motivation: string;
  availability: string;
}

export interface AdminUser {
  email: string;
  isLoggedIn: boolean;
  name: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone: string;
  tickets: number;
  date: string;
  status: 'Confirmé' | 'En attente' | 'Annulé';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export interface SocialPost {
  id: string;
  platform: 'instagram' | 'twitter' | 'facebook' | 'youtube';
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  postUrl: string;
  hashtags: string[];
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  source: string;
}


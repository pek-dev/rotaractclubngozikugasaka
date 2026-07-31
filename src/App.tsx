import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ValuesSection } from './components/ValuesSection';
import { AboutSection } from './components/AboutSection';
import { ImpactCalculator } from './components/ImpactCalculator';
import { ActivitiesSection } from './components/ActivitiesSection';
import { EventsSection } from './components/EventsSection';
import { EventsCalendar } from './components/EventsCalendar';
import { SocialWallSection } from './components/SocialWallSection';
import { PartnersSection } from './components/PartnersSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { TeamSection } from './components/TeamSection';
import { GallerySection } from './components/GallerySection';
import { NewsSection } from './components/NewsSection';
import { NewsletterSection } from './components/NewsletterSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { ContactMapSection } from './components/ContactMapSection';
import { Footer } from './components/Footer';
import { AIChatbot } from './components/AIChatbot';
import { MembershipModal } from './components/MembershipModal';
import { EventRegisterModal } from './components/EventRegisterModal';
import { VideoModal } from './components/VideoModal';
import { SearchModal } from './components/SearchModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { LibraryModal } from './components/LibraryModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { InstallationBanner } from './components/InstallationBanner';
import { Toast, ToastMessage } from './components/Toast';
import { SectionAnimated } from './components/SectionAnimated';

import {
  ACTIVITIES_DATA,
  EVENTS_DATA,
  TEAM_DATA,
  TESTIMONIALS_DATA,
  GALLERY_DATA,
  NEWS_DATA,
  FAQ_DATA,
} from './data/mockData';
import { EventItem } from './types';
import { getStoredSiteContent, SiteContent } from './data/siteContent';

export default function App() {
  // Check if current local hour is night (7 PM / 19:00 to 6:59 AM)
  const isNightTime = (): boolean => {
    const hour = new Date().getHours();
    return hour >= 19 || hour < 7;
  };

  const [siteContent, setSiteContent] = useState<SiteContent>(getStoredSiteContent);

  useEffect(() => {
    const handleUpdate = () => {
      setSiteContent(getStoredSiteContent());
    };
    window.addEventListener('site_content_updated', handleUpdate);
    return () => window.removeEventListener('site_content_updated', handleUpdate);
  }, []);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    // If user explicitly saved a choice in this session, respect it
    if (savedTheme === 'dark') return true;
    if (savedTheme === 'light') return false;
    // Otherwise default to local time check
    return isNightTime();
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(2);
  const [selectedEventForRegister, setSelectedEventForRegister] = useState<EventItem | null>(null);

  // Sync dark mode class on HTML & BODY elements & handle time-based auto switch
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Fetch initial theme preference from MySQL DB if active user logged in
  useEffect(() => {
    const activeEmail = localStorage.getItem('active_user_email');
    if (activeEmail) {
      fetch(`/api/save_user_theme.php?email=${encodeURIComponent(activeEmail)}`)
        .then(async (res) => {
          const ct = res.headers.get('content-type');
          if (res.ok && ct && ct.includes('application/json')) return res.json();
          return null;
        })
        .then((data) => {
          if (data && data.status === 'success' && data.theme_preference) {
            if (data.theme_preference === 'dark') {
              setDarkMode(true);
            } else if (data.theme_preference === 'light') {
              setDarkMode(false);
            }
          }
        })
        .catch(() => {});
    }
  }, []);

  // Periodic automatic local time re-evaluation
  useEffect(() => {
    const checkInterval = setInterval(() => {
      // Only auto-switch if user hasn't explicitly clicked manual toggle in localStorage override
      const userHasManualPreference = localStorage.getItem('manual_theme_override') === 'true';
      if (!userHasManualPreference) {
        const night = isNightTime();
        if (night !== darkMode) {
          setDarkMode(night);
          showToast(
            night
              ? '🌙 Passage automatique en mode sombre selon l heure locale (19h - 7h).'
              : '☀️ Passage automatique en mode clair selon l heure locale (7h - 19h).',
            'info'
          );
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [darkMode]);

  // Handle user manual dark mode toggle with cross-device BDD sync
  const handleToggleDarkMode = (val: boolean) => {
    setDarkMode(val);
    localStorage.setItem('manual_theme_override', 'true');
    localStorage.setItem('theme', val ? 'dark' : 'light');

    const activeEmail = localStorage.getItem('active_user_email') || 'visiteur@rotaractngozi.bi';
    const activeRole = localStorage.getItem('active_user_role') || 'visiteur';

    // Sync to MySQL Database API
    fetch('/api/save_user_theme.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: activeEmail,
        theme: val ? 'dark' : 'light',
        role: activeRole,
      }),
    }).catch(() => {});

    showToast(
      val ? 'Mode sombre activé (Synchronisé BDD MySQL) 🌙' : 'Mode clair activé (Synchronisé BDD MySQL) ☀️',
      'info'
    );
  };

  // Show Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-rose-500 selection:text-white transition-colors duration-300">
      {/* Toast Notifications */}
      <Toast toasts={toasts} onRemoveToast={removeToast} />

      {/* Header & Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={handleToggleDarkMode}
        onOpenMembership={() => setIsMembershipOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadCount={unreadNotificationsCount}
      />

      {/* Main Sections */}
      <main id="main">
        {/* Hero Section */}
        <Hero
          heroContent={siteContent.hero}
          onOpenVideo={() => setIsVideoOpen(true)}
          onOpenMembership={() => setIsMembershipOpen(true)}
        />

        {/* Core Values */}
        <SectionAnimated>
          <ValuesSection />
        </SectionAnimated>

        {/* About Club Section */}
        <SectionAnimated>
          <AboutSection
            aboutContent={siteContent.about}
            onOpenMembership={() => setIsMembershipOpen(true)}
          />
        </SectionAnimated>

        {/* Impact Calculator Simulator */}
        <SectionAnimated>
          <ImpactCalculator
            impactContent={siteContent.impact}
            onOpenMembership={() => setIsMembershipOpen(true)}
          />
        </SectionAnimated>

        {/* Activities Section */}
        <SectionAnimated>
          <ActivitiesSection activities={siteContent.activities} />
        </SectionAnimated>

        {/* Events Agenda Section */}
        <SectionAnimated>
          <EventsSection
            events={siteContent.events}
            onSelectEventToRegister={(evt) => setSelectedEventForRegister(evt)}
          />
        </SectionAnimated>

        {/* Interactive Events Calendar (BDD MySQL API) */}
        <SectionAnimated>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <EventsCalendar
              onSelectEventToRegister={(evt) => setSelectedEventForRegister(evt)}
              onShowToast={showToast}
            />
          </div>
        </SectionAnimated>

        {/* Social Wall & Live Aggregator Section */}
        <SectionAnimated>
          <SocialWallSection
            socialPosts={siteContent.socialPosts}
            onShowToast={showToast}
          />
        </SectionAnimated>

        {/* Partners Section */}
        <SectionAnimated>
          <PartnersSection />
        </SectionAnimated>

        {/* Testimonials */}
        <SectionAnimated>
          <TestimonialsSection testimonials={TESTIMONIALS_DATA} />
        </SectionAnimated>

        {/* Team Members */}
        <SectionAnimated>
          <TeamSection team={siteContent.team} />
        </SectionAnimated>

        {/* Photo Gallery with Lightbox */}
        <SectionAnimated>
          <GallerySection gallery={siteContent.gallery} />
        </SectionAnimated>

        {/* News & Articles */}
        <SectionAnimated>
          <NewsSection
            news={siteContent.news}
            onShowToast={showToast}
            onOpenLibrary={() => setIsLibraryOpen(true)}
          />
        </SectionAnimated>

        {/* Newsletter Subscription Section */}
        <SectionAnimated>
          <NewsletterSection onShowToast={showToast} />
        </SectionAnimated>

        {/* Searchable FAQ Accordion */}
        <SectionAnimated>
          <FaqSection
            faqs={FAQ_DATA}
            onOpenChat={() => {
              showToast('L Assistant IA est à votre écoute en bas à gauche de votre écran ! 🤖', 'info');
            }}
          />
        </SectionAnimated>

        {/* Contact Form Section */}
        <SectionAnimated>
          <ContactSection
            contactContent={siteContent.contact}
            onShowToast={showToast}
          />
        </SectionAnimated>

        {/* Interactive Location Map Section */}
        <SectionAnimated>
          <ContactMapSection
            address={siteContent.contact.address}
            meetingPlace={siteContent.contact.meetingPlace}
            meetingTimes={siteContent.contact.meetingTimes}
            phone={siteContent.contact.phone}
            onShowToast={showToast}
          />
        </SectionAnimated>
      </main>

      {/* Footer */}
      <Footer onShowToast={showToast} onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* AI Chatbot Widget */}
      <AIChatbot />

      {/* Membership Application Modal */}
      <MembershipModal
        isOpen={isMembershipOpen}
        onClose={() => setIsMembershipOpen(false)}
        onShowToast={showToast}
      />

      {/* Event Ticket Registration Modal */}
      <EventRegisterModal
        event={selectedEventForRegister}
        onClose={() => setSelectedEventForRegister(null)}
        onShowToast={showToast}
      />

      {/* Video Presentation Modal */}
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />

      {/* Global Site Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectEvent={(evt) => setSelectedEventForRegister(evt)}
      />

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onShowToast={showToast}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Offline Library Modal (IndexedDB) */}
      <LibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onShowToast={showToast}
      />

      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onShowToast={showToast}
        unreadCount={unreadNotificationsCount}
        onUnreadCountChange={(c) => setUnreadNotificationsCount(c)}
      />

      {/* PWA Installation Prompt Banner */}
      <InstallationBanner onShowToast={showToast} />
    </div>
  );
}

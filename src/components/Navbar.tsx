import React, { useState, useEffect } from 'react';
import { Globe, Moon, Sun, Menu, X, ArrowRight, UserPlus, Search, ShieldCheck, BookMarked, Bell } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenMembership: () => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  onOpenLibrary: () => void;
  onOpenNotifications?: () => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  onOpenMembership,
  onOpenSearch,
  onOpenAdmin,
  onOpenLibrary,
  onOpenNotifications,
  unreadCount = 0,
}) => {

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['accueil', 'apropos', 'impact', 'activites', 'evenements', 'socialwall', 'galerie', 'actualites', 'equipe', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#accueil', label: 'Accueil', id: 'accueil' },
    { href: '#apropos', label: 'À propos', id: 'apropos' },
    { href: '#impact', label: 'Impact', id: 'impact' },
    { href: '#activites', label: 'Activités', id: 'activites' },
    { href: '#evenements', label: 'Événements', id: 'evenements' },
    { href: '#socialwall', label: 'Mur Social', id: 'socialwall' },
    { href: '#galerie', label: 'Galerie', id: 'galerie' },
    { href: '#actualites', label: 'Actualités', id: 'actualites' },
    { href: '#equipe', label: 'Équipe', id: 'equipe' },
    { href: '#contact', label: 'Contact', id: 'contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-800/50 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#accueil" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-md shadow-rose-500/10 border border-gray-100 dark:border-gray-800 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                <img
                  src="/rotaract_logo.jpg"
                  alt="Rotaract Club Ngozi - Kugasaka Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900" />
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white text-base leading-tight font-poppins">
                Rotaract Club
              </div>
              <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 tracking-wide">
                Ngozi Kugasaka
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={`text-sm font-medium transition-colors relative py-1 ${
                  activeSection === link.id
                    ? 'text-rose-600 dark:text-rose-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400'
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 dark:bg-rose-400 rounded-full" />
                )}
              </a>
            ))}
          </div>

          {/* Action buttons */}
          <div className="hidden lg:flex items-center gap-2.5">
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                title="Centre de Notifications & Audit logs"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-black text-[9px] flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={onOpenLibrary}
              className="p-2.5 rounded-xl text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors relative"
              title="Ma Bibliothèque Hors-Ligne (IndexedDB)"
              aria-label="Bibliothèque"
            >
              <BookMarked className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Rechercher sur le site"
              aria-label="Rechercher"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative group"
              aria-label="Mode sombre"
              title={darkMode ? "Mode Sombre actif (Bascule automatique 19h - 7h)" : "Mode Clair actif (Bascule automatique 7h - 19h)"}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={onOpenAdmin}
              className="px-3.5 py-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold text-xs transition-all flex items-center gap-1.5 border border-gray-200 dark:border-gray-700"
              title="Tableau de bord administration"
            >
              <ShieldCheck className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Admin</span>
            </button>

            <button
              onClick={onOpenMembership}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-sm shadow-md shadow-rose-600/30 hover:shadow-lg hover:shadow-rose-600/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Rejoindre
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile buttons */}
          <div className="flex lg:hidden items-center gap-2">
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-rose-600 text-white font-black text-[8px] flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Mode sombre"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Menu mobile"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 p-6 shadow-2xl transition-all">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                  activeSection === link.id
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="w-full py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Rechercher une activité ou un événement
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold text-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                Tableau de Bord Admin
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMembership();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Candidater pour devenir membre
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

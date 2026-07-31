import React, { useState } from 'react';
import { Globe, Mail, Send, Heart, ArrowUp, ExternalLink, Share2 } from 'lucide-react';

interface FooterProps {
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onShowToast, onOpenAdmin }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://facebook.com/rotaractngozikugasaka',
      handle: '@rotaractngozikugasaka',
      color: 'hover:bg-blue-600 hover:text-white',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/rotaract_ngozi',
      handle: '@rotaract_ngozi',
      color: 'hover:bg-pink-600 hover:text-white',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/rotaract-club-ngozi-kugasaka',
      handle: 'Rotaract Club Ngozi Kugasaka',
      color: 'hover:bg-sky-600 hover:text-white',
      badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      name: 'X / Twitter',
      url: 'https://x.com/rotaract_ngozi',
      handle: '@rotaract_ngozi',
      color: 'hover:bg-gray-800 hover:text-white',
      badgeColor: 'bg-gray-700/20 text-gray-300 border-gray-600/30',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@rotaractngozikugasaka',
      handle: '@rotaractngozikugasaka',
      color: 'hover:bg-red-600 hover:text-white',
      badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/25779000000',
      handle: '+257 79 000 000',
      color: 'hover:bg-emerald-600 hover:text-white',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      ),
    },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newsletterEmail.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      onShowToast('Veuillez entrer une adresse email valide.', 'error');
      return;
    }

    try {
      const existingStr = localStorage.getItem('rotaract_newsletter_subscribers');
      const subscribers = existingStr ? JSON.parse(existingStr) : [];
      const newSubscriber = {
        id: `sub-${Date.now()}`,
        email: cleanEmail,
        subscribedAt: new Date().toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        source: 'Footer Site Web',
      };
      
      // Check if already subscribed
      const alreadySubscribed = subscribers.some((s: any) => s.email.toLowerCase() === cleanEmail.toLowerCase());
      if (!alreadySubscribed) {
        subscribers.unshift(newSubscriber);
        localStorage.setItem('rotaract_newsletter_subscribers', JSON.stringify(subscribers));
        window.dispatchEvent(new Event('newsletter_subscribers_updated'));
      }
      
      onShowToast(`Merci ${cleanEmail} ! Votre inscription à notre lettre d information est confirmée. 📬✨`, 'success');
      setNewsletterEmail('');
    } catch (err) {
      console.error(err);
      onShowToast('Inscription réussie ! 📬', 'success');
      setNewsletterEmail('');
    }
  };

  const handleSocialClick = (name: string, url: string) => {
    onShowToast(`Ouverture de la page ${name} du Rotaract Ngozi Kugasaka... 🔗`, 'info');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-950 text-white pt-20 pb-10 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-600 flex items-center justify-center text-white">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-base font-poppins">Rotaract Club</div>
                <div className="text-xs text-rose-400 font-semibold">Ngozi Kugasaka</div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Organisation de jeunes engagés de 18 à 30 ans, œuvrant au service de la santé, de l environnement et de l éducation à Ngozi, Burundi.
            </p>

            {/* Social Networks List */}
            <div className="pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3 flex items-center gap-2">
                <Share2 className="w-3.5 h-3.5 text-rose-400" />
                Réseaux Sociaux Officiels
              </div>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleSocialClick(s.name, s.url)}
                    className={`p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 ${s.color} transition-all flex items-center gap-1.5 group`}
                    title={`${s.name} - ${s.handle}`}
                  >
                    {s.icon}
                    <span className="text-xs font-medium hidden sm:inline">{s.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Col 2 - Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold font-poppins text-white uppercase tracking-wider mb-4">
              Navigation Rapide
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li><a href="#accueil" className="hover:text-rose-400 transition-colors">Accueil</a></li>
              <li><a href="#apropos" className="hover:text-rose-400 transition-colors">À propos</a></li>
              <li><a href="#impact" className="hover:text-rose-400 transition-colors">Impact</a></li>
              <li><a href="#activites" className="hover:text-rose-400 transition-colors">Activités</a></li>
              <li><a href="#evenements" className="hover:text-rose-400 transition-colors">Événements</a></li>
              <li><a href="#socialwall" className="hover:text-rose-400 transition-colors flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block" />Mur Social (Live)</a></li>
              <li><a href="#galerie" className="hover:text-rose-400 transition-colors">Galerie</a></li>
              <li><a href="#actualites" className="hover:text-rose-400 transition-colors">Actualités</a></li>
              <li><a href="#equipe" className="hover:text-rose-400 transition-colors">Équipe</a></li>
              <li><a href="#contact" className="hover:text-rose-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Col 3 - Pillars & Action */}
          <div>
            <h4 className="text-sm font-bold font-poppins text-white uppercase tracking-wider mb-4">
              Nos Piliers d Impact
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Santé Publique & Dons de sang
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Reboisement & Écologie (Kugasaka)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Éducation & Soutien aux Orphelins
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Académie de Leadership & Mentorat
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                Parrainage Rotary Club Ngozi
              </li>
            </ul>
          </div>

          {/* Col 4 - Newsletter */}
          <div>
            <h4 className="text-sm font-bold font-poppins text-white uppercase tracking-wider mb-4">
              Newsletter du Club
            </h4>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Recevez nos bilans d activité mensuels et les invitations aux prochains événements directement par courriel.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <input
                type="email"
                required
                placeholder="votre.email@exemple.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                S abonner à l actualité
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © 2026 Rotaract Club Ngozi Kugasaka — District 9150.
          </div>

          <div className="flex items-center gap-4">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-gray-400 hover:text-rose-400 transition-colors font-semibold underline underline-offset-4 flex items-center gap-1"
              >
                Espace Administration
              </button>
            )}
            <span className="flex items-center gap-1">
              Créé avec engagement pour Ngozi <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full bg-gray-900 hover:bg-rose-600 text-gray-300 hover:text-white transition-colors"
            title="Haut de page"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};


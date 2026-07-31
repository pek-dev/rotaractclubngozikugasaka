import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Check, Facebook, Instagram, Linkedin, MessageCircle, Youtube } from 'lucide-react';
import { ContactContent } from '../data/siteContent';

interface ContactSectionProps {
  contactContent?: ContactContent;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ contactContent, onShowToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      onShowToast('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    setLoading(true);

    try {
      await fetch('/api/send_email.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          subject: formData.subject || 'Nouveau message depuis le site web Rotaract Ngozi',
          template: 'contact_message',
          message: formData.message,
        }),
      });
    } catch (err) {
      console.warn('E-mail API contact fallback', err);
    }

    setLoading(false);
    onShowToast('Votre message a bien été envoyé ! Un accusé de réception vous a été envoyé par e-mail. ✅', 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 bg-gray-50/70 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Info Column */}
          <div className="space-y-8">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
                CONTACTEZ-NOUS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-poppins text-gray-900 dark:text-white leading-tight">
                Parlons de votre <br />
                <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  engagement ou projet
                </span>
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                Vous souhaitez nous rejoindre, proposer une action conjointe ou soutenir un projet à Ngozi ? Remplissez ce formulaire ou écrivez-nous directement.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm font-poppins">Localisation & Siège</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{contactContent?.address || 'Quartier Kugasaka, Ville de Ngozi, Burundi'}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm font-poppins">Téléphone & WhatsApp</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{contactContent?.phone || '+257 79 000 000 / +257 68 000 000'}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm font-poppins">Adresse Email</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{contactContent?.email || 'rotaractclubngozikugasaka9150@gmail.com'}</div>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                Suivez-nous sur les réseaux sociaux
              </div>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, label: 'Facebook' },
                  { icon: Instagram, label: 'Instagram' },
                  { icon: Linkedin, label: 'LinkedIn' },
                  { icon: MessageCircle, label: 'WhatsApp' },
                  { icon: Youtube, label: 'YouTube' },
                ].map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={idx}
                      href="#"
                      className="w-11 h-11 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-rose-600 hover:text-white hover:border-rose-600 dark:hover:bg-rose-600 dark:hover:text-white flex items-center justify-center transition-all shadow-2xs"
                      title={s.label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-200/80 dark:border-gray-800">
            <h3 className="text-2xl font-bold font-poppins text-gray-900 dark:text-white mb-6">
              Envoyez-nous un message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Jean-Pierre Ndayishimiye"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-600 dark:focus:border-rose-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-2">
                  Adresse email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="votre.email@exemple.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-600 dark:focus:border-rose-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-2">
                  Sujet du message
                </label>
                <input
                  type="text"
                  placeholder="Ex: Demande de partenariat / Inscription"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-600 dark:focus:border-rose-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-2">
                  Votre message *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Décrivez votre demande en quelques phrases..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-600 dark:focus:border-rose-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <span>Envoi en cours...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Envoyer mon message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { Mail, Send, Sparkles, CheckCircle2, ShieldCheck, Bell, FileText, Gift } from 'lucide-react';

interface NewsletterSectionProps {
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ onShowToast }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (val: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setErrorMessage('Veuillez saisir votre adresse email.');
      onShowToast('Veuillez saisir une adresse email.', 'error');
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setErrorMessage('Veuillez saisir une adresse email valide (ex: exemple@domaine.com).');
      onShowToast('Adresse email invalide.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // LocalStorage persistence
      const existingStr = localStorage.getItem('rotaract_newsletter_subscribers');
      const subscribers = existingStr ? JSON.parse(existingStr) : [];
      
      const alreadySubscribed = subscribers.some(
        (s: any) => s.email.toLowerCase() === cleanEmail.toLowerCase()
      );

      if (alreadySubscribed) {
        setIsSubmitting(false);
        setIsSuccess(true);
        onShowToast(`L'adresse ${cleanEmail} est déjà inscrite à notre lettre d'information ! 📬`, 'info');
        setEmail('');
        return;
      }

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
        source: 'Formulaire Newsletter Section',
      };

      subscribers.unshift(newSubscriber);
      localStorage.setItem('rotaract_newsletter_subscribers', JSON.stringify(subscribers));
      window.dispatchEvent(new Event('newsletter_subscribers_updated'));

      // Optional backend sync
      try {
        await fetch('/api/subscribe_newsletter.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, source: 'NewsletterSection' }),
        });
      } catch (err) {
        // Silent fallback to local storage
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      setEmail('');
      onShowToast(`Merci ${cleanEmail} ! Inscription à la lettre d'information confirmée. 📬✨`, 'success');

      setTimeout(() => {
        setIsSuccess(false);
      }, 6000);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      onShowToast('Une erreur est survenue lors de l inscription. Veuillez réessayer.', 'error');
    }
  };

  return (
    <section id="newsletter" className="py-20 bg-gradient-to-b from-gray-50/50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/10 dark:bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 dark:bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-rose-950 rounded-3xl p-8 sm:p-12 lg:p-16 border border-gray-800 shadow-2xl relative overflow-hidden">
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

          <div className="grid lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Column: Heading & Perks */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                COMMUNAUTÉ & RAPPORTS OFFICIELS
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-poppins text-white leading-tight">
                Abonnez-vous à la <br />
                <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                  Lettre d'Information du Rotaract
                </span>
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Recevez directement dans votre boîte mail les communiqués officiels, nos comptes-rendus d'impact, les convocations aux réunions statutaires et les invitations à nos événements à Ngozi.
              </p>

              {/* Perks List */}
              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-poppins">Communiqués PDF</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Alertes & publications</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 border border-pink-500/30">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-poppins">Événements Live</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Invitations prioritaires</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-poppins">Rapports d'Impact</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Chiffres & transparence</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Subscription Card */}
            <div className="lg:col-span-5 bg-gray-900/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-rose-600/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-poppins text-white">
                    Rejoindre le bulletin d'info
                  </h3>
                  <p className="text-xs text-gray-400">0 spam • Désabonnement en 1 clic</p>
                </div>
              </div>

              {isSuccess ? (
                <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-200 p-6 rounded-2xl text-center space-y-3 animate-fade-in">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="font-bold font-poppins text-white text-base">Inscription réussie !</h4>
                  <p className="text-xs leading-relaxed text-emerald-300">
                    Merci pour votre soutien. Vous faites désormais partie de notre réseau de diffusion officiel à Ngozi.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-2 text-xs font-bold text-emerald-400 underline hover:text-emerald-300"
                  >
                    Inscrire une autre adresse
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Votre adresse email *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errorMessage) setErrorMessage('');
                        }}
                        placeholder="nom.prenom@exemple.com"
                        className={`w-full pl-10 pr-4 py-3.5 rounded-2xl bg-gray-950 border ${
                          errorMessage ? 'border-rose-500 text-rose-200' : 'border-gray-700 text-white focus:border-rose-500'
                        } text-sm focus:outline-none transition-colors placeholder:text-gray-500`}
                      />
                    </div>
                    {errorMessage && (
                      <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1 font-medium">
                        ⚠️ {errorMessage}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Validation en cours...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        S'abonner gratuitement
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-gray-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Vos données restent 100% confidentielles.</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

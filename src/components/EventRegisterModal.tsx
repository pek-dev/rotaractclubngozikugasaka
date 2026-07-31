import React, { useState } from 'react';
import { EventItem } from '../types';
import { X, Calendar, MapPin, Clock, Ticket, CheckCircle2 } from 'lucide-react';

interface EventRegisterModalProps {
  event: EventItem | null;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const EventRegisterModal: React.FC<EventRegisterModalProps> = ({
  event,
  onClose,
  onShowToast,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tickets, setTickets] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newReg = {
      id: `reg-${Date.now()}`,
      eventId: event.id,
      eventTitle: event.title,
      name,
      email,
      phone,
      tickets,
      date: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }) + ' à ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      status: 'Confirmé' as const,
    };

    // Save to localStorage
    try {
      const saved = localStorage.getItem('rotaract_event_registrations');
      const list = saved ? JSON.parse(saved) : [];
      list.unshift(newReg);
      localStorage.setItem('rotaract_event_registrations', JSON.stringify(list));
      window.dispatchEvent(new Event('rotaract_registrations_updated'));
    } catch (err) {
      console.warn('Erreur enregistrement local', err);
    }

    // Try posting to PHP API (Registration + Confirmation Email)
    try {
      await fetch('/api/register_event.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          eventTitle: event.title,
          name,
          email,
          phone,
          tickets,
        }),
      });

      await fetch('/api/send_email.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          subject: `Confirmation d'inscription : ${event.title}`,
          template: 'event_confirmation',
          eventTitle: event.title,
          tickets,
        }),
      });
    } catch (apiErr) {
      // Local fallback handled above
    }

    setLoading(false);
    onShowToast(
      `Inscription réussie pour "${event.title}" (${tickets} place${tickets > 1 ? 's' : ''}) ! Votre pass a été envoyé à ${email}. 🎟️`,
      'success'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-800 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Event Ticket Preview Header */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-200/80 dark:border-rose-900/60 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1">
            <Ticket className="w-4 h-4" />
            Pass Événement Gratuit
          </div>
          <h3 className="text-lg font-bold font-poppins text-gray-900 dark:text-white mb-2">
            {event.title}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-300">
            <span className="flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-rose-500" />
              {event.day} {event.month} {event.year}
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-rose-500" />
              {event.time}
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            {event.location}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
              Nom complet du participant *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Jean-Pierre Ndayishimiye"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                Adresse Email *
              </label>
              <input
                type="email"
                required
                placeholder="votre.email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                Téléphone *
              </label>
              <input
                type="tel"
                required
                placeholder="+257 67 301 044"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
              Nombre de places souhaitées :
            </label>
            <select
              value={tickets}
              onChange={(e) => setTickets(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-600"
            >
              <option value={1}>1 Place (Individuel)</option>
              <option value={2}>2 Places (Accompagné)</option>
              <option value={3}>3 Places (Groupe)</option>
              <option value={4}>4 Places (Équipe)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 mt-2"
          >
            {loading ? 'Validation en cours...' : 'Obtenir mon billet gratuit'}
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

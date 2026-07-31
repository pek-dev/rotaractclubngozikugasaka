import React, { useState, useEffect } from 'react';
import { EventItem } from '../types';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { getStoredSiteContent } from '../data/siteContent';
import { EVENTS_DATA } from '../data/mockData';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Ticket,
  Search,
  Printer,
  Sparkles,
  RefreshCw,
  Share2,
  CalendarCheck,
  Tag,
  X
} from 'lucide-react';

interface EventsCalendarProps {
  onSelectEventToRegister?: (evt: EventItem) => void;
  onShowToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const EventsCalendar: React.FC<EventsCalendarProps> = ({
  onSelectEventToRegister,
  onShowToast,
}) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  
  // Date state (defaulting to August 2026 to align with club events)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 7, 1));
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(15);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeModalEvent, setActiveModalEvent] = useState<any | null>(null);

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Fetch events from PHP API backend or fallback to site content
  const fetchCalendarEvents = () => {
    setLoading(true);
    fetch('/api/get_events_calendar.php')
      .then(async (res) => {
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (data && data.events && Array.isArray(data.events)) {
          setEvents(data.events);
        } else {
          const siteContent = getStoredSiteContent();
          const list = (siteContent?.events && siteContent.events.length > 0) ? siteContent.events : EVENTS_DATA;
          setEvents(list.map((e) => ({
            id: e.id,
            title: e.title,
            date: `${e.year || '2026'}-${e.month === 'AOU' || e.month === 'AOÛT' ? '08' : '09'}-${String(e.day).padStart(2, '0')}`,
            time: e.time,
            location: e.location,
            category: e.category,
            description: e.description,
            image: e.image,
            seats_available: e.spotsLeft
          })));
        }
      })
      .catch((err) => {
        console.warn('Backend PHP non configuré ou hors-ligne, chargement depuis le contenu du site:', err);
        const siteContent = getStoredSiteContent();
        const list = (siteContent?.events && siteContent.events.length > 0) ? siteContent.events : EVENTS_DATA;
        setEvents(list.map((e) => ({
          id: e.id,
          title: e.title,
          date: `${e.year || '2026'}-${e.month === 'AOU' || e.month === 'AOÛT' ? '08' : '09'}-${String(e.day).padStart(2, '0')}`,
          time: e.time,
          location: e.location,
          category: e.category,
          description: e.description,
          image: e.image,
          seats_available: e.spotsLeft
        })));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCalendarEvents();
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDayNumber(null);
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDayNumber(null);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0

  // Category list extraction
  const categories = ['ALL', ...Array.from(new Set(events.map((e) => e.category || 'Général')))];

  // Helper to match events on specific day
  const getEventsForDay = (dayNum: number) => {
    return events.filter((evt) => {
      if (!evt.date) return false;
      const evtDate = new Date(evt.date);
      const isSameDay = evtDate.getDate() === dayNum;
      const isSameMonth = evtDate.getMonth() === month;
      const isSameYear = evtDate.getFullYear() === year;

      if (!isSameDay || !isSameMonth || !isSameYear) return false;

      if (selectedCategory !== 'ALL' && evt.category !== selectedCategory) return false;

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchTitle = (evt.title || '').toLowerCase().includes(term);
        const matchDesc = (evt.description || '').toLowerCase().includes(term);
        const matchLoc = (evt.location || '').toLowerCase().includes(term);
        if (!matchTitle && !matchDesc && !matchLoc) return false;
      }

      return true;
    });
  };

  const eventsForSelectedDay = selectedDayNumber ? getEventsForDay(selectedDayNumber) : [];

  const handlePrintEventDetail = (evt: any) => {
    setActiveModalEvent(evt);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div id="calendar-container" className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xl overflow-hidden my-8">
      {/* Calendar Top Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-gray-900 to-slate-950 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold mb-3">
            <CalendarCheck className="w-4 h-4 text-rose-400" />
            SYNCHRONISÉ MYSQL BDD • ROTARACT NGOZI
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-poppins text-white">
            Calendrier Mensuel Officiel des Événements
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-1 leading-relaxed">
            Consultez le planning interactif de nos actions sociales, ateliers et réunions du club. Cliquez sur un jour pour consulter la fiche complète ou imprimer le document.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 relative z-10 shrink-0">
          <button
            onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 shadow-md"
          >
            <CalendarIcon className="w-4 h-4" />
            {viewMode === 'calendar' ? 'Vue Liste' : 'Vue Grille Calendrier'}
          </button>

          <button
            onClick={fetchCalendarEvents}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20"
            title="Actualiser depuis le serveur MySQL"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-rose-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Controls Bar: Month Nav, Search & Category Filters */}
      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Month Navigation */}
        <div className="flex items-center gap-3 justify-between sm:justify-start">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevMonth}
              className="p-2.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-gray-800 transition-colors shadow-xs"
              title="Mois précédent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date(2026, 7, 1))}
              className="px-4 py-2.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-extrabold text-gray-700 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-gray-800 transition-colors shadow-xs"
            >
              Août 2026
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-gray-800 transition-colors shadow-xs"
              title="Mois suivant"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="text-lg font-black font-poppins text-gray-900 dark:text-white capitalize">
            {monthNames[month]} {year}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une activité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'Toutes les catégories' : c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid or List Body */}
      <div className="p-4 sm:p-8">
        {viewMode === 'calendar' ? (
          <div className="space-y-8">
            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
              {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((d) => (
                <div
                  key={d}
                  className="py-2 text-center text-xs font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 font-poppins"
                >
                  <span className="hidden sm:inline">{d}</span>
                  <span className="sm:hidden">{d.slice(0, 3)}</span>
                </div>
              ))}

              {/* Empty offset cells */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`offset-${i}`} className="h-20 sm:h-28 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20 border border-dashed border-gray-200/50 dark:border-gray-800" />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dayEvents = getEventsForDay(dayNum);
                const hasEvents = dayEvents.length > 0;
                const isSelected = selectedDayNumber === dayNum;

                return (
                  <button
                    key={`day-btn-${dayNum}`}
                    onClick={() => setSelectedDayNumber(dayNum)}
                    className={`h-22 sm:h-28 rounded-2xl p-2 flex flex-col justify-between text-left transition-all relative border ${
                      isSelected
                        ? 'bg-gradient-to-br from-rose-600 to-pink-600 text-white border-rose-500 shadow-xl scale-[1.03] z-10'
                        : hasEvents
                        ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/80 hover:border-rose-500 hover:shadow-md'
                        : 'bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`font-black font-poppins text-xs sm:text-sm ${isSelected ? 'text-white' : ''}`}>
                        {dayNum}
                      </span>
                      {hasEvents && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                          isSelected ? 'bg-white text-rose-600' : 'bg-rose-600 text-white'
                        }`}>
                          {dayEvents.length}
                        </span>
                      )}
                    </div>

                    {hasEvents && (
                      <div className="w-full space-y-1 mt-1 overflow-hidden">
                        {dayEvents.slice(0, 2).map((evt) => (
                          <div
                            key={evt.id}
                            className={`px-1.5 py-1 rounded-lg text-[10px] font-bold truncate ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-rose-600 text-white shadow-xs'
                            }`}
                          >
                            {evt.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Day Events List */}
            {selectedDayNumber && (
              <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-extrabold font-poppins text-gray-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-rose-600" />
                    Programme du {selectedDayNumber} {monthNames[month]} {year}
                  </h4>
                  <span className="text-xs font-mono font-bold text-gray-500">
                    {eventsForSelectedDay.length} action(s) trouvée(s)
                  </span>
                </div>

                {eventsForSelectedDay.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {eventsForSelectedDay.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/80 shadow-md flex flex-col justify-between gap-4"
                      >
                        <div className="flex gap-4">
                          <img
                            src={getOptimizedImageUrl(evt.image, 400)}
                            alt={evt.title}
                            loading="lazy"
                            decoding="async"
                            className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-gray-200 dark:border-gray-800"
                          />
                          <div className="space-y-1.5">
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-wider">
                              {evt.category}
                            </span>
                            <h5 className="font-extrabold text-sm text-gray-900 dark:text-white font-poppins line-clamp-1">
                              {evt.title}
                            </h5>
                            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-rose-500" /> {evt.time || '08:30 - 14:00'}
                              </div>
                              <div className="flex items-center gap-1 truncate">
                                <MapPin className="w-3.5 h-3.5 text-rose-500" /> {evt.location}
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                          {evt.description}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {evt.seats_available || evt.spotsLeft || 50} places
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handlePrintEventDetail(evt)}
                              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-rose-600 hover:text-white transition-colors"
                              title="Imprimer cette fiche d événement"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                if (onSelectEventToRegister) {
                                  onSelectEventToRegister({
                                    id: evt.id,
                                    day: evt.date ? new Date(evt.date).getDate().toString() : '15',
                                    month: 'AOU',
                                    title: evt.title,
                                    time: evt.time || '08:30',
                                    location: evt.location,
                                    category: evt.category,
                                    description: evt.description,
                                    image: evt.image,
                                    spotsLeft: evt.seats_available || 50
                                  });
                                }
                              }}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 flex items-center gap-1.5"
                            >
                              <Ticket className="w-3.5 h-3.5" />
                              S inscrire
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-gray-500">
                    Aucune activité programmée pour ce jour. Sélectionnez un autre jour sur la grille.
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* List Mode */
          <div className="space-y-4">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-rose-500 transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={getOptimizedImageUrl(evt.image, 300)}
                    alt={evt.title}
                    loading="lazy"
                    decoding="async"
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-gray-200 dark:border-gray-800"
                  />
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase">
                      {evt.category}
                    </span>
                    <h4 className="text-base font-extrabold text-gray-900 dark:text-white font-poppins mt-1">
                      {evt.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span className="flex items-center gap-1 font-bold text-rose-600">
                        <CalendarIcon className="w-3.5 h-3.5" /> {evt.date || '2026-08-15'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {evt.time || '08:30'}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {evt.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handlePrintEventDetail(evt)}
                    className="p-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-rose-600 hover:text-white transition-colors"
                    title="Imprimer l événement"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (onSelectEventToRegister) {
                        onSelectEventToRegister({
                          id: evt.id,
                          day: evt.date ? new Date(evt.date).getDate().toString() : '15',
                          month: 'AOU',
                          title: evt.title,
                          time: evt.time || '08:30',
                          location: evt.location,
                          category: evt.category,
                          description: evt.description,
                          image: evt.image,
                          spotsLeft: evt.seats_available || 50
                        });
                      }
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 flex items-center gap-2"
                  >
                    <Ticket className="w-4 h-4" />
                    S inscrire
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Printable Modal View for Selected Event */}
      {activeModalEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200 dark:border-gray-800 print-container">
            {/* Printed Letterhead (Visible when printing) */}
            <div className="hidden print-header-letterhead">
              <div className="flex justify-between items-center border-b-2 border-rose-600 pb-3 mb-4">
                <div>
                  <h1 className="text-xl font-bold text-rose-600">ROTARACT CLUB NGOZI KUGASAKA</h1>
                  <p className="text-xs text-gray-600">District 9150 • FICHE OFFICIELLE D ÉVÉNEMENT</p>
                </div>
                <div className="text-right text-xs font-mono font-bold">
                  REF: EVT-{activeModalEvent.id}<br/>
                  Imprimé le {new Date().toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-start no-print">
              <div>
                <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-xs font-black uppercase">
                  {activeModalEvent.category}
                </span>
                <h3 className="text-2xl font-bold font-poppins text-gray-900 dark:text-white mt-2">
                  {activeModalEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalEvent(null)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 no-print"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={getOptimizedImageUrl(activeModalEvent.image, 800)}
              alt={activeModalEvent.title}
              className="w-full h-48 object-cover rounded-2xl border border-gray-200 dark:border-gray-800"
            />

            <div className="space-y-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">{activeModalEvent.description}</p>
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 space-y-1.5 font-medium">
                <div><strong>Date :</strong> {activeModalEvent.date}</div>
                <div><strong>Horaire :</strong> {activeModalEvent.time}</div>
                <div><strong>Lieu :</strong> {activeModalEvent.location}</div>
                <div><strong>Organisateur :</strong> {activeModalEvent.organizer || 'Rotaract Ngozi Kugasaka'}</div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 no-print">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs flex items-center gap-2 hover:bg-gray-800"
              >
                <Printer className="w-4 h-4" /> Imprimer Document PDF
              </button>
              <button
                onClick={() => setActiveModalEvent(null)}
                className="px-4 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold text-xs"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

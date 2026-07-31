import React, { useState } from 'react';
import { EventItem } from '../types';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Ticket,
  ChevronLeft,
  ChevronRight,
  Grid,
  Info,
  CalendarCheck,
  Share2,
  Printer,
} from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';

interface EventsSectionProps {
  events: EventItem[];
  onSelectEventToRegister: (evt: EventItem) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ events, onSelectEventToRegister }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  // Default to August 2026 (or current date)
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date(2026, 7, 1)); // August 2026
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(15);

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const monthShorts: Record<string, number> = {
    JAN: 0, FÉV: 1, FEV: 1, MAR: 2, AVR: 3, MAI: 4, JUIN: 5,
    JUIL: 6, AOU: 7, AOÛ: 7, SEP: 8, OCT: 9, NOV: 10, DÉC: 11, DEC: 11
  };

  const handlePrevMonth = () => {
    setSelectedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDayNumber(null);
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDayNumber(null);
  };

  // Days in selected month calculation
  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0

  // Filter events matching selected month/year or match day
  const getEventsForDay = (dayNum: number) => {
    return events.filter((evt) => {
      const evtDay = parseInt(evt.day, 10);
      const evtMonthNum = monthShorts[evt.month.toUpperCase()] ?? 7; // Default August
      const evtYear = evt.year ? parseInt(evt.year, 10) : 2026;

      return evtDay === dayNum && evtMonthNum === month && evtYear === year;
    });
  };

  const eventsForSelectedDay = selectedDayNumber ? getEventsForDay(selectedDayNumber) : [];

  return (
    <section id="evenements" className="py-24 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            AGENDA & RENCONTRES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-poppins text-gray-900 dark:text-white">
            Prochains <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">Événements</span> à Ngozi
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Participez à nos conférences, assemblées générales et soirées caritatives. Places limitées — inscrivez-vous gratuitement dès maintenant !
          </p>

          {/* View Switcher Toggle */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex p-1.5 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
                Vue Cartes
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  viewMode === 'calendar'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                Vue Calendrier Interactif
              </button>
            </div>
          </div>
        </div>

        {/* 1. GRID VIEW */}
        {viewMode === 'grid' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="group bg-gray-50/70 dark:bg-gray-800/40 rounded-3xl overflow-hidden border border-gray-200/80 dark:border-gray-700/80 hover:border-rose-400 dark:hover:border-rose-800 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={getOptimizedImageUrl(evt.image, 800)}
                      alt={evt.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Calendar Badge */}
                    <div className="absolute top-4 right-4 bg-white dark:bg-gray-900 rounded-2xl px-4 py-2 text-center shadow-lg border border-gray-200/50 dark:border-gray-800 min-w-[64px]">
                      <div className="text-2xl font-extrabold font-poppins text-rose-600 dark:text-rose-400 leading-none">
                        {evt.day}
                      </div>
                      <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mt-1">
                        {evt.month}
                      </div>
                    </div>

                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gray-900/80 backdrop-blur-md text-white text-xs font-bold">
                      {evt.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-col gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-rose-500" />
                        {evt.time}
                      </div>
                      <div className="flex items-center gap-1.5 font-medium truncate">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {evt.location}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold font-poppins text-gray-900 dark:text-white mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {evt.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-gray-200/60 dark:border-gray-700/60 mt-4">
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {evt.spotsLeft} places
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/api/share.php?type=event&id=${evt.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-rose-600 hover:text-white transition-colors"
                      title="Partager cet événement (Aperçu Open Graph)"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => onSelectEventToRegister(evt)}
                      className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-transform active:scale-95"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      S inscrire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. INTERACTIVE CALENDAR VIEW */}
        {viewMode === 'calendar' && (
          <div className="bg-gray-50/80 dark:bg-gray-800/50 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-xl space-y-8">
            {/* Calendar Month Header & Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-rose-600 text-white shadow-md">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold font-poppins text-gray-900 dark:text-white capitalize">
                    {monthNames[month]} {year}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Cliquez sur un jour marqué pour voir les détails de l événement et réserver.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-gray-800 transition-colors"
                  title="Mois précédent"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedMonth(new Date(2026, 7, 1))}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Aujourd hui
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-gray-800 transition-colors"
                  title="Mois suivant"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => (
                <div
                  key={d}
                  className="py-2 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 font-poppins"
                >
                  {d}
                </div>
              ))}

              {/* Empty leading cells */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="h-20 sm:h-24 rounded-2xl bg-transparent" />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dayEvents = getEventsForDay(dayNum);
                const hasEvents = dayEvents.length > 0;
                const isSelected = selectedDayNumber === dayNum;

                return (
                  <button
                    key={`day-${dayNum}`}
                    onClick={() => setSelectedDayNumber(dayNum)}
                    className={`h-20 sm:h-24 rounded-2xl p-2 flex flex-col justify-between items-start transition-all relative border text-left ${
                      isSelected
                        ? 'bg-rose-600 text-white border-rose-600 shadow-lg scale-[1.02] z-10'
                        : hasEvents
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 hover:border-rose-500'
                        : 'bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className={`font-bold font-poppins text-xs sm:text-sm ${isSelected ? 'text-white' : ''}`}>
                      {dayNum}
                    </span>

                    {hasEvents && (
                      <div className="w-full space-y-1 mt-1">
                        {dayEvents.map((evt) => (
                          <div
                            key={evt.id}
                            className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold truncate ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-rose-600 text-white'
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

            {/* Selected Day Events Details Drawer */}
            {selectedDayNumber && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-bold font-poppins text-gray-900 dark:text-white flex items-center gap-2">
                    <Info className="w-5 h-5 text-rose-600" />
                    Événements du {selectedDayNumber} {monthNames[month]} {year}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {eventsForSelectedDay.length} événement(s) programmé(s)
                  </span>
                </div>

                {eventsForSelectedDay.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {eventsForSelectedDay.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col justify-between gap-4 shadow-sm"
                      >
                        <div className="flex gap-4">
                          <img
                            src={getOptimizedImageUrl(evt.image, 300)}
                            alt={evt.title}
                            loading="lazy"
                            decoding="async"
                            className="w-20 h-20 rounded-xl object-cover shrink-0 border border-gray-200 dark:border-gray-800"
                          />
                          <div className="space-y-1">
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
                              {evt.category}
                            </span>
                            <h5 className="font-bold text-sm text-gray-900 dark:text-white font-poppins">
                              {evt.title}
                            </h5>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-rose-500" />
                              {evt.time} • {evt.location}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                          <span className="text-xs text-rose-600 font-semibold">
                            {evt.spotsLeft} places restantes
                          </span>
                          <button
                            onClick={() => onSelectEventToRegister(evt)}
                            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20"
                          >
                            <Ticket className="w-3.5 h-3.5" />
                            Réserver
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Aucun événement spécial n est prévu pour le {selectedDayNumber} {monthNames[month]} {year}.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};


import React, { useState } from 'react';
import { Search, X, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { ACTIVITIES_DATA, EVENTS_DATA, NEWS_DATA, FAQ_DATA } from '../data/mockData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEvent: (evt: any) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectEvent }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredActivities = ACTIVITIES_DATA.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredEvents = EVENTS_DATA.filter(
    (e) =>
      e.title.toLowerCase().includes(query.toLowerCase()) ||
      e.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredNews = NEWS_DATA.filter(
    (n) =>
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.summary.toLowerCase().includes(query.toLowerCase())
  );

  const filteredFaqs = FAQ_DATA.filter(
    (f) =>
      f.question.toLowerCase().includes(query.toLowerCase()) ||
      f.answer.toLowerCase().includes(query.toLowerCase())
  );

  const hasQuery = query.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-gray-950/80 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800 relative animate-in fade-in zoom-in duration-150">
        <div className="relative mb-6">
          <Search className="w-5 h-5 text-rose-600 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoFocus
            placeholder="Rechercher une activité, un événement, une actualité..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm sm:text-base text-gray-900 dark:text-white focus:outline-none focus:border-rose-600"
          />
          <button
            onClick={onClose}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto space-y-6 pr-1">
          {!hasQuery ? (
            <div className="text-center py-10 text-gray-400 text-xs sm:text-sm">
              Tapez votre recherche ci-dessus pour parcourir l ensemble du site...
            </div>
          ) : (
            <>
              {/* Events */}
              {filteredEvents.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2">
                    Événements ({filteredEvents.length})
                  </h4>
                  <div className="space-y-2">
                    {filteredEvents.map((evt) => (
                      <div
                        key={evt.id}
                        onClick={() => {
                          onClose();
                          onSelectEvent(evt);
                        }}
                        className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-gray-100 dark:border-gray-800 cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-sm text-gray-900 dark:text-white font-poppins">
                            {evt.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-2">
                            <span>{evt.day} {evt.month}</span>
                            <span>•</span>
                            <span>{evt.location}</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-rose-600 dark:text-rose-400 shrink-0">
                          S inscrire
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activities */}
              {filteredActivities.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2">
                    Activités ({filteredActivities.length})
                  </h4>
                  <div className="space-y-2">
                    {filteredActivities.map((act) => (
                      <a
                        key={act.id}
                        href="#activites"
                        onClick={onClose}
                        className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-gray-100 dark:border-gray-800 block transition-colors"
                      >
                        <div className="font-bold text-sm text-gray-900 dark:text-white font-poppins">
                          {act.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                          {act.description}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* News */}
              {filteredNews.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2">
                    Actualités ({filteredNews.length})
                  </h4>
                  <div className="space-y-2">
                    {filteredNews.map((news) => (
                      <a
                        key={news.id}
                        href="#actualites"
                        onClick={onClose}
                        className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-gray-100 dark:border-gray-800 block transition-colors"
                      >
                        <div className="font-bold text-sm text-gray-900 dark:text-white font-poppins">
                          {news.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                          {news.summary}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs */}
              {filteredFaqs.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2">
                    Questions Réponses ({filteredFaqs.length})
                  </h4>
                  <div className="space-y-2">
                    {filteredFaqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800"
                      >
                        <div className="font-bold text-xs text-gray-900 dark:text-white">
                          Q: {faq.question}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          R: {faq.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredEvents.length === 0 &&
                filteredActivities.length === 0 &&
                filteredNews.length === 0 &&
                filteredFaqs.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    Aucun résultat trouvé pour "{query}".
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

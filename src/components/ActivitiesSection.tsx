import React, { useState } from 'react';
import { Activity } from '../types';
import { Search, MapPin, Calendar, ArrowRight, Eye, X, CheckCircle, Sparkles } from 'lucide-react';

interface ActivitiesSectionProps {
  activities: Activity[];
}

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({ activities }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [expanded, setExpanded] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'Toutes les actions' },
    { id: 'sante', label: 'Santé' },
    { id: 'environnement', label: 'Environnement' },
    { id: 'formation', label: 'Formation' },
    { id: 'humanitaire', label: 'Humanitaire' },
    { id: 'education', label: 'Éducation' },
  ];

  const filtered = activities.filter((act) => {
    const matchesCategory = selectedCategory === 'all' || act.category === selectedCategory;
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayed = expanded ? filtered : filtered.slice(0, 6);

  return (
    <section id="activites" className="py-24 bg-gray-50/70 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            NOS ACTIVITÉS SUR LE TERRAIN
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-poppins text-gray-900 dark:text-white">
            Des actions concrètes pour un <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">impact réel</span>
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Explorez nos projets récents à Ngozi et dans les communes voisines. Filtrez par domaine d intérêt ou utilisez la barre de recherche.
          </p>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setExpanded(false);
                }}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-rose-300 dark:hover:border-rose-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une action..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-600 dark:focus:border-rose-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Cards Grid */}
        {displayed.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8">
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Aucune activité ne correspond à vos critères de recherche.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold text-xs"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayed.map((act) => (
              <article
                key={act.id}
                className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200/80 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-rose-500/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={act.image}
                      alt={act.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-xs font-bold text-rose-600 dark:text-rose-400 shadow-sm">
                      {act.categoryLabel}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-rose-500" />
                        {act.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {act.location}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold font-poppins text-gray-900 dark:text-white mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {act.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                      {act.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between">
                  {act.impactMetrics ? (
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 truncate max-w-[190px]">
                      <Sparkles className="w-3 h-3 shrink-0" />
                      {act.impactMetrics}
                    </span>
                  ) : <span />}

                  <button
                    onClick={() => setActiveActivity(act)}
                    className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1 transition-all group-hover:translate-x-0.5"
                  >
                    Détails
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filtered.length > 6 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setExpanded(!expanded)}
              className="px-8 py-3.5 rounded-full border-2 border-rose-600 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-all font-bold text-sm shadow-sm"
            >
              {expanded ? 'Voir moins d activités' : `Voir toutes les activités (${filtered.length})`}
            </button>
          </div>
        )}
      </div>

      {/* Activity Detail Modal */}
      {activeActivity && (
        <div className="fixed inset-0 z-50 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
            <div className="relative h-64 sm:h-72">
              <img
                src={activeActivity.image}
                alt={activeActivity.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveActivity(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-900/70 text-white flex items-center justify-center hover:bg-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-xs">
                {activeActivity.categoryLabel}
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-rose-500" />
                  {activeActivity.date}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  {activeActivity.location}
                </span>
              </div>

              <h3 className="text-2xl font-bold font-poppins text-gray-900 dark:text-white">
                {activeActivity.title}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {activeActivity.fullContent || activeActivity.description}
              </p>

              {activeActivity.impactMetrics && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  Bilan d impact : {activeActivity.impactMetrics}
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setActiveActivity(null)}
                  className="px-6 py-2.5 rounded-full bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

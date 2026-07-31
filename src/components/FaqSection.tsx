import React, { useState } from 'react';
import { FAQItem } from '../types';
import { ChevronDown, HelpCircle, Search, MessageSquare } from 'lucide-react';

interface FaqSectionProps {
  faqs: FAQItem[];
  onOpenChat: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs, onOpenChat }) => {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [search, setSearch] = useState<string>('');

  const filtered = faqs.filter(
    (item) =>
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="py-24 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            FOIRE AUX QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-poppins text-gray-900 dark:text-white">
            Questions <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">Fréquentes</span>
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Trouvez rapidement des réponses concernant l adhésion, nos activités et les partenariats.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative mb-8">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une question..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-rose-600 dark:focus:border-rose-500 transition-colors"
          />
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <p className="text-center py-8 text-gray-500 text-sm">
              Aucune question ne correspond à votre recherche. Posez-la directement à notre Assistant IA !
            </p>
          ) : (
            filtered.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-rose-300 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/20 shadow-sm'
                      : 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold font-poppins text-sm sm:text-base text-gray-900 dark:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-rose-600 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-rose-100 dark:border-rose-950/40 pt-4">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* AI Prompt CTA */}
        <div className="mt-10 p-6 rounded-3xl bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-rose-500/10 border border-rose-200/80 dark:border-rose-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-gray-900 dark:text-white text-sm font-poppins">
              Une autre question spécifique ?
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
              Notre Assistant IA Gemini répond à toutes vos interrogations 24h/24.
            </div>
          </div>
          <button
            onClick={onOpenChat}
            className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center gap-2 shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            Demander à l IA
          </button>
        </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import {
  BookMarked,
  X,
  Search,
  Trash2,
  Download,
  Eye,
  Wifi,
  WifiOff,
  Clock,
  Calendar,
  FileText,
  User,
  ArrowRight,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { NewsArticle } from '../types';
import {
  getSavedArticles,
  removeArticleFromLibrary,
  clearLibrary,
  BookmarkedArticle,
} from '../utils/offlineDb';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [articles, setArticles] = useState<BookmarkedArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [readingArticle, setReadingArticle] = useState<BookmarkedArticle | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  const loadArticles = async () => {
    const list = await getSavedArticles();
    setArticles(list);
  };

  useEffect(() => {
    if (isOpen) {
      loadArticles();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUpdate = () => {
      loadArticles();
    };

    const handleOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener('library_updated', handleUpdate);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('library_updated', handleUpdate);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  if (!isOpen) return null;

  const handleRemove = async (id: string, title: string) => {
    await removeArticleFromLibrary(id);
    onShowToast?.(`"${title}" retiré de votre bibliothèque.`, 'info');
    loadArticles();
  };

  const handleClearAll = async () => {
    if (window.confirm('Voulez-vous supprimer tous les articles enregistrés dans votre bibliothèque ?')) {
      await clearLibrary();
      onShowToast?.('Bibliothèque réinitialisée.', 'info');
      loadArticles();
    }
  };

  const filteredArticles = articles.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = Array.from(new Set(articles.map((a) => a.category)));

  return (
    <div className="fixed inset-0 z-50 bg-gray-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden relative">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-900 via-gray-900 to-rose-950 text-white flex items-center justify-between border-b border-rose-800/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <BookMarked className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black font-poppins text-white">Ma Bibliothèque Hors-Ligne</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-bold text-xs">
                  IndexedDB
                </span>
              </div>
              <p className="text-xs text-rose-200/90 mt-0.5 flex items-center gap-2">
                <span>{articles.length} article(s) sauvegardé(s) pour lecture sans connexion</span>
                <span className="text-rose-400">•</span>
                <span className="flex items-center gap-1 font-semibold">
                  {isOnline ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Wifi className="w-3.5 h-3.5" /> En Ligne
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <WifiOff className="w-3.5 h-3.5" /> Mode Hors-Connexion
                    </span>
                  )}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="p-4 sm:p-5 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans ma bibliothèque..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {categories.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                }`}
              >
                Tous ({articles.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {articles.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3.5 py-2 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 hover:bg-rose-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Vider
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto">
                <BookMarked className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-extrabold font-poppins text-gray-900 dark:text-white">
                Votre bibliothèque est vide
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Cliquez sur le bouton d abonnement <span className="text-rose-600 font-bold">« Favori IndexedDB »</span> sur n importe quel article ou communiqué du site pour le lire plus tard, même sans connexion Internet !
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredArticles.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        {item.category}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3 h-3" /> Hors-Ligne OK
                      </span>
                    </div>

                    <h4 className="text-sm font-bold font-poppins text-gray-900 dark:text-white line-clamp-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-gray-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-rose-500" />
                        {item.publicationDate}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.readTime}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setReadingArticle(item)}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Lire hors-ligne
                    </button>

                    <button
                      onClick={() => handleRemove(item.id, item.title)}
                      className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      title="Retirer de la bibliothèque"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Read Article Offline Sub-Modal */}
        {readingArticle && (
          <div className="absolute inset-0 bg-white dark:bg-gray-900 z-20 flex flex-col overflow-y-auto p-6 sm:p-8 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                <Database className="w-4 h-4" />
                LECTURE HORS-LIGNE DEPUIS INDEXEDDB
              </div>
              <button
                onClick={() => setReadingArticle(null)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-rose-600 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-w-3xl mx-auto space-y-6 w-full">
              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-xs font-bold">
                {readingArticle.category}
              </span>

              <h2 className="text-2xl sm:text-3xl font-black font-poppins text-gray-900 dark:text-white leading-snug">
                {readingArticle.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 border-y border-gray-100 dark:border-gray-800 py-3">
                <span className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white">
                  <User className="w-4 h-4 text-rose-600" />
                  {readingArticle.author}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {readingArticle.publicationDate}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {readingArticle.readTime}
                </span>
              </div>

              {readingArticle.imageUrl && (
                <div className="rounded-2xl overflow-hidden shadow-md max-h-80 border border-gray-200 dark:border-gray-800">
                  <img
                    src={readingArticle.imageUrl}
                    alt={readingArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="prose dark:prose-invert max-w-none text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                <p className="font-semibold text-gray-900 dark:text-white text-base">
                  {readingArticle.summary}
                </p>
                <div className="whitespace-pre-line pt-2">
                  {readingArticle.content}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <button
                  onClick={() => setReadingArticle(null)}
                  className="px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold text-xs"
                >
                  Retour à la bibliothèque
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

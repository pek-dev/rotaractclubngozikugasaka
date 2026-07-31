import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../types';
import {
  Calendar,
  Clock,
  ArrowRight,
  User,
  X,
  Share2,
  Check,
  MessageCircle,
  Facebook,
  Linkedin,
  Twitter,
  Copy,
  FileText,
  Download,
  BookMarked,
  BookmarkCheck,
  Bell,
  CheckCircle2,
  Printer,
} from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import {
  saveArticleToLibrary,
  removeArticleFromLibrary,
  isArticleBookmarked,
} from '../utils/offlineDb';

interface NewsSectionProps {
  news: NewsArticle[];
  onShowToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
  onOpenLibrary?: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ news, onShowToast, onOpenLibrary }) => {
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [pushSubscribed, setPushSubscribed] = useState(false);

  // Check which articles are bookmarked in IndexedDB
  const checkBookmarks = async () => {
    const set = new Set<string>();
    for (const item of news) {
      const isSaved = await isArticleBookmarked(item.id);
      if (isSaved) set.add(item.id);
    }
    setBookmarkedIds(set);
  };

  useEffect(() => {
    checkBookmarks();
    window.addEventListener('library_updated', checkBookmarks);
    return () => window.removeEventListener('library_updated', checkBookmarks);
  }, [news]);

  const handleToggleBookmark = async (item: NewsArticle) => {
    const isSaved = bookmarkedIds.has(item.id);
    if (isSaved) {
      await removeArticleFromLibrary(item.id);
      onShowToast?.(`"${item.title}" retiré de votre bibliothèque IndexedDB.`, 'info');
    } else {
      await saveArticleToLibrary(item);
      onShowToast?.(`"${item.title}" sauvegardé dans votre bibliothèque pour lecture 100% hors-ligne ! 💾📚`, 'success');
    }
    checkBookmarks();
  };

  const handleSubscribePush = async () => {
    if (!('Notification' in window)) {
      onShowToast?.('Les notifications Push ne sont pas supportées par votre navigateur.', 'error');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPushSubscribed(true);

        // Register in PHP MySQL
        fetch('/api/push_subscribe.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'lecteur@rotaractngozi.bi',
            endpoint: 'push_sub_' + Date.now(),
          }),
        });

        // Trigger welcome push via Service Worker
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'SHOW_NOTIFICATION',
            title: 'Rotaract Ngozi Kugasaka 🔔',
            body: 'Notifications Push activées ! Vous recevrez nos alertes d actualités.',
            url: '/#actualites',
          });
        }

        onShowToast?.('Notifications Push activées avec succès ! Vous recevrez les alertes d actualités. 🔔✨', 'success');
      } else {
        onShowToast?.('Permission des notifications refusée.', 'error');
      }
    } catch (err) {
      onShowToast?.('Erreur lors de l activation des notifications.', 'error');
    }
  };

  const handleDownloadPDF = (item: NewsArticle) => {

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      onShowToast?.('Veuillez autoriser les fenêtres surgissantes pour télécharger le PDF.', 'error');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Communiqué Officiel - ${item.title}</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1a202c;
            line-height: 1.6;
            padding: 30px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #e11d48;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }
          .logo-text {
            font-size: 22px;
            font-weight: 800;
            color: #e11d48;
            letter-spacing: -0.5px;
          }
          .district-tag {
            font-size: 11px;
            font-weight: 700;
            color: #4b5563;
            text-transform: uppercase;
          }
          .ref-box {
            background-color: #f3f4f6;
            padding: 8px 14px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: bold;
            color: #374151;
            text-align: right;
          }
          .badge {
            display: inline-block;
            background-color: #ffe4e6;
            color: #be123c;
            font-weight: bold;
            font-size: 11px;
            padding: 4px 12px;
            border-radius: 20px;
            margin-bottom: 15px;
            text-transform: uppercase;
          }
          .title {
            font-size: 24px;
            font-weight: 800;
            color: #111827;
            margin-bottom: 15px;
            line-height: 1.3;
          }
          .meta {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 25px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 10px;
          }
          .chapeau {
            font-size: 14px;
            font-weight: bold;
            color: #be123c;
            background-color: #fff1f2;
            padding: 15px 20px;
            border-left: 4px solid #e11d48;
            border-radius: 6px;
            margin-bottom: 25px;
          }
          .content {
            font-size: 13px;
            color: #374151;
            white-space: pre-wrap;
            margin-bottom: 40px;
          }
          .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px dashed #d1d5db;
          }
          .sig-box {
            text-align: center;
            width: 45%;
          }
          .sig-title {
            font-size: 12px;
            font-weight: bold;
            color: #111827;
            margin-bottom: 40px;
          }
          .sig-line {
            border-top: 1px solid #9ca3af;
            margin-top: 40px;
            padding-top: 5px;
            font-size: 11px;
            color: #6b7280;
          }
          .footer {
            margin-top: 60px;
            text-align: center;
            font-size: 10px;
            color: #9ca3af;
            border-top: 1px solid #f3f4f6;
            padding-top: 15px;
          }
          .print-btn {
            background-color: #e11d48;
            color: white;
            border: none;
            padding: 10px 20px;
            font-weight: bold;
            border-radius: 8px;
            cursor: pointer;
            margin-bottom: 20px;
          }
          @media print {
            .print-btn { display: none; }
          }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">🖨️ Imprimer / Enregistrer en PDF</button>
        <div class="header">
          <div>
            <div class="logo-text">ROTARACT CLUB NGOZI KUGASAKA</div>
            <div class="district-tag">District 9150 • Province de Ngozi, République du Burundi</div>
          </div>
          <div class="ref-box">
            COMMUNIQUÉ OFFICIEL<br/>
            REF: ROT-NGOZI-${item.id.toUpperCase()}<br/>
            Date: ${item.date}
          </div>
        </div>

        <span class="badge">${item.category}</span>
        <h1 class="title">${item.title}</h1>

        <div class="meta">
          <strong>Auteur :</strong> ${item.author} | 
          <strong>Temps de lecture :</strong> ${item.readTime} | 
          <strong>Diffusion :</strong> Publique & Presse
        </div>

        <div class="chapeau">${item.summary}</div>

        <div class="content">${item.content}</div>

        <div class="signatures">
          <div class="sig-box">
            <div class="sig-title">Pour le Comité d'Action</div>
            <div class="sig-line">Président(e) du Rotaract Ngozi Kugasaka</div>
          </div>
          <div class="sig-box">
            <div class="sig-title">Pour la Commission de Communication</div>
            <div class="sig-line">Secrétaire Général(e) & Relations Publiques</div>
          </div>
        </div>

        <div class="footer">
          Rotaract Club Ngozi Kugasaka • Quartier Kugasaka, Ville de Ngozi, Burundi<br/>
          Email: rotaractclubngozikugasaka9150@gmail.com | Téléphone: +257 79 000 000 / +257 68 000 000<br/>
          Document officiel généré le ${new Date().toLocaleDateString('fr-FR')} — Rotaract District 9150
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 500);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    onShowToast?.('Génération du communiqué officiel au format PDF... 📄✨', 'success');
  };

  const handleShare = (platform: 'whatsapp' | 'facebook' | 'linkedin' | 'twitter' | 'copy', item: NewsArticle) => {
    // Generate full Open Graph sharing URL powered by PHP backend
    const ogShareUrl = window.location.origin + `/api/share.php?type=article&id=${item.id}`;
    const shareText = `Rotaract Club Ngozi Kugasaka: ${item.title}`;

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' - ' + ogShareUrl)}`, '_blank');
      onShowToast?.('Partage WhatsApp initié avec balises Open Graph ! 📱', 'info');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(ogShareUrl)}`, '_blank');
      onShowToast?.('Partage Facebook avec aperçu image Open Graph ! 🔵', 'info');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(ogShareUrl)}`, '_blank');
      onShowToast?.('Partage LinkedIn professionnel ! 💼', 'info');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(ogShareUrl)}`, '_blank');
      onShowToast?.('Partage Twitter / X avec carte enrichie ! 🐦', 'info');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(ogShareUrl);
      setCopiedId(item.id);
      onShowToast?.('Lien Open Graph de l article copié dans le presse-papier ! 📋✨', 'success');
      setTimeout(() => setCopiedId(null), 3000);
    }
  };

  return (
    <section id="actualites" className="py-24 bg-gray-50/70 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            ACTUALITÉS & ARTICLES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-poppins text-gray-900 dark:text-white">
            Restez informés de nos <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">dernières nouvelles</span>
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Communiquez sur nos accomplissements, les comptes-rendus de nos campagnes et les conseils de notre comité.
          </p>

          {/* Offline Library & Push Notification Toolbar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenLibrary}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-900 via-gray-900 to-rose-950 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-900/20 hover:scale-105 transition-all"
            >
              <BookMarked className="w-4 h-4 text-rose-400" />
              Ma Bibliothèque Hors-Ligne
              <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black">
                {bookmarkedIds.size}
              </span>
            </button>

            <button
              onClick={handleSubscribePush}
              className={`px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 border transition-all ${
                pushSubscribed
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border-emerald-300 dark:border-emerald-800'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-800 hover:border-rose-500'
              }`}
            >
              <Bell className={`w-4 h-4 ${pushSubscribed ? 'text-emerald-500 animate-bounce' : 'text-rose-500'}`} />
              {pushSubscribed ? 'Notifications Push Activées 🔔' : 'Activer les Alerte Push 🔔'}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {news.map((item) => {
            const isBookmarked = bookmarkedIds.has(item.id);
            return (
              <article
                key={item.id}
                className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200/80 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-rose-500/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative"
              >
                <div>
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={getOptimizedImageUrl(item.image, 800)}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-xs shadow-md">
                      {item.category}
                    </div>

                    {/* Bookmark Button directly on Card */}
                    <button
                      onClick={() => handleToggleBookmark(item)}
                      className={`absolute top-4 right-4 p-2.5 rounded-2xl shadow-lg backdrop-blur-md transition-all ${
                        isBookmarked
                          ? 'bg-rose-600 text-white shadow-rose-600/30 scale-110'
                          : 'bg-gray-900/70 text-white hover:bg-rose-600'
                      }`}
                      title={isBookmarked ? 'Retirer de ma bibliothèque' : 'Enregistrer pour lecture 100% hors-ligne'}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <BookMarked className="w-4 h-4" />}
                    </button>
                  </div>


                <div className="p-6">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-rose-500" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      {item.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-poppins text-gray-900 dark:text-white mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>
                </div>
              </div>

              {/* Social Share Bar + PDF Download + Read More */}
              <div className="p-6 pt-0 space-y-3 border-t border-gray-100 dark:border-gray-800 mt-4">
                <div className="flex items-center justify-between pt-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-rose-500" />
                    {item.author}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadPDF(item)}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white font-bold text-[11px] flex items-center gap-1 transition-all"
                      title="Télécharger le communiqué au format PDF"
                    >
                      <Download className="w-3 h-3" />
                      PDF
                    </button>

                    <button
                      onClick={() => setActiveArticle(item)}
                      className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 flex items-center gap-1 transition-all group-hover:translate-x-1"
                    >
                      Lire l article
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Social Share Buttons */}
                <div className="flex items-center justify-between gap-1 pt-2 border-t border-gray-100 dark:border-gray-800/60">
                  <span className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <Share2 className="w-3 h-3 text-rose-500" /> Partager:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleShare('whatsapp', item)}
                      className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                      title="Partager sur WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleShare('facebook', item)}
                      className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-colors"
                      title="Partager sur Facebook"
                    >
                      <Facebook className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleShare('linkedin', item)}
                      className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 hover:bg-sky-600 hover:text-white transition-colors"
                      title="Partager sur LinkedIn"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleShare('twitter', item)}
                      className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-900 hover:text-white transition-colors"
                      title="Partager sur Twitter/X"
                    >
                      <Twitter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleShare('copy', item)}
                      className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-colors"
                      title="Copier le lien de l article"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
        </div>
      </div>

      {/* Article Detail Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 max-h-[90vh] flex flex-col print-container">
            {/* Print Letterhead Header (visible only on paper print) */}
            <div className="hidden print-header-letterhead">
              <div className="flex justify-between items-center border-b-2 border-rose-600 pb-3 mb-4">
                <div>
                  <h1 className="text-xl font-bold text-rose-600">ROTARACT CLUB NGOZI KUGASAKA</h1>
                  <p className="text-xs text-gray-600">District 9150 • COMMUNIQUÉ OFFICIEL DE PRESSE</p>
                </div>
                <div className="text-right text-xs font-mono font-bold">
                  REF: ROT-ART-{activeArticle.id}<br/>
                  Date: {activeArticle.date}
                </div>
              </div>
            </div>

            <div className="relative h-64 shrink-0">
              <img
                src={getOptimizedImageUrl(activeArticle.image, 1000)}
                alt={activeArticle.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-900/70 text-white flex items-center justify-center hover:bg-gray-900 transition-colors no-print"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-xs">
                {activeArticle.category}
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4 overflow-y-auto">
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-rose-500" />
                  {activeArticle.date}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4 text-rose-500" />
                  Par {activeArticle.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-rose-500" />
                  {activeArticle.readTime}
                </span>
              </div>

              <h3 className="text-2xl font-bold font-poppins text-gray-900 dark:text-white">
                {activeArticle.title}
              </h3>

              <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                <p className="font-semibold text-rose-600 dark:text-rose-400">
                  {activeArticle.summary}
                </p>
                <p>{activeArticle.content}</p>
              </div>

              {/* Share, Print and PDF in modal */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
                    title="Imprimer cet article via les styles CSS print media query"
                  >
                    <Printer className="w-3.5 h-3.5 text-rose-400" /> Imprimer Document
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(activeArticle)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold flex items-center gap-1.5 hover:from-rose-500 hover:to-pink-500 shadow-md shadow-rose-600/20"
                  >
                    <Download className="w-3.5 h-3.5" /> Communiqué PDF
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleShare('whatsapp', activeArticle)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-emerald-500"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-6 py-2.5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold text-xs hover:bg-gray-300 transition-colors w-full sm:w-auto"
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

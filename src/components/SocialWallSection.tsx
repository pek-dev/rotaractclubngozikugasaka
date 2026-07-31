import React, { useState } from 'react';
import { SocialPost } from '../types';
import { RefreshCw, Heart, Share2, MessageCircle, ExternalLink, Search, Sparkles, Radio, Play } from 'lucide-react';

interface SocialWallSectionProps {
  socialPosts: SocialPost[];
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const SocialWallSection: React.FC<SocialWallSectionProps> = ({
  socialPosts,
  onShowToast,
}) => {
  const [activePlatform, setActivePlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('À l\'instant');
  const [likedPostIds, setLikedPostIds] = useState<Record<string, boolean>>({});
  const [postsState, setPostsState] = useState<SocialPost[]>(socialPosts || []);

  const handleRefresh = () => {
    setIsSyncing(true);
    onShowToast('Connexion aux API Instagram, X, Facebook & YouTube du club...', 'info');
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setLastSyncedTime(`Aujourd'hui à ${timeStr}`);
      onShowToast('Flux Social Wall synchronisé avec succès ! 📱✨', 'success');
    }, 1200);
  };

  const handleToggleLike = (postId: string) => {
    const isLiked = !likedPostIds[postId];
    setLikedPostIds((prev) => ({ ...prev, [postId]: isLiked }));

    setPostsState((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );

    if (isLiked) {
      onShowToast('Vous avez aimé cette publication ! ❤️', 'success');
    }
  };

  const handleShare = (post: SocialPost) => {
    navigator.clipboard?.writeText(post.postUrl);
    onShowToast(`Lien de la publication ${post.authorName} copié ! 🔗`, 'info');
  };

  const filteredPosts = postsState.filter((post) => {
    const matchesPlatform = activePlatform === 'all' || post.platform === activePlatform;
    const matchesSearch =
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.hashtags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPlatform && matchesSearch;
  });

  const getPlatformBadge = (platform: SocialPost['platform']) => {
    switch (platform) {
      case 'instagram':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 shadow-xs">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            Instagram
          </span>
        );
      case 'twitter':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white bg-gray-900 border border-gray-700 shadow-xs">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            X / Twitter
          </span>
        );
      case 'facebook':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white bg-blue-600 shadow-xs">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </span>
        );
      case 'youtube':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white bg-red-600 shadow-xs">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            YouTube
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section id="socialwall" className="py-20 bg-gray-50/50 dark:bg-gray-900/40 relative overflow-hidden border-t border-gray-200/60 dark:border-gray-800/60">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/5 dark:bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider mb-3 border border-rose-500/20">
            <Radio className="w-3.5 h-3.5 animate-pulse text-rose-500" />
            Mur Social & Flux Live
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-poppins text-gray-900 dark:text-white tracking-tight">
            Le Rotaract Ngozi en Temps Réel 📲
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            Restez connecté avec l actualité directe de nos équipes sur Instagram, Twitter, Facebook et YouTube. Suivez nos actions, nos photos sur le terrain et rejoignez la conversation.
          </p>
        </div>

        {/* Live Control Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Platform Tabs */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 w-full md:w-auto">
            <button
              onClick={() => setActivePlatform('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePlatform === 'all'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Tous les flux ({postsState.length})
            </button>
            <button
              onClick={() => setActivePlatform('instagram')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activePlatform === 'instagram'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Instagram
            </button>
            <button
              onClick={() => setActivePlatform('twitter')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activePlatform === 'twitter'
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              X / Twitter
            </button>
            <button
              onClick={() => setActivePlatform('facebook')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activePlatform === 'facebook'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Facebook
            </button>
            <button
              onClick={() => setActivePlatform('youtube')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activePlatform === 'youtube'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              YouTube
            </button>
          </div>

          {/* Search & Refresh Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filtrer par mot-clé ou hashtag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              onClick={handleRefresh}
              disabled={isSyncing}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs border border-gray-200 dark:border-gray-700 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-rose-500 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Actualiser Flux Live</span>
            </button>
          </div>
        </div>

        {/* Sync Status Banner */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-6 px-1">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Flux RSS et API Social Media agrégés • Synchro : <strong className="text-gray-700 dark:text-gray-200">{lastSyncedTime}</strong>
          </span>
          <span>{filteredPosts.length} publication(s) affichée(s)</span>
        </div>

        {/* Social Posts Cards Masonry / Grid */}
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
              Aucune publication ne correspond à votre filtre "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActivePlatform('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => {
              const isLiked = !!likedPostIds[post.id];
              return (
                <div
                  key={post.id}
                  className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden"
                >
                  {/* Top Header */}
                  <div className="p-5 pb-3">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          className="w-10 h-10 rounded-full object-cover border border-rose-500/30 shrink-0"
                        />
                        <div>
                          <div className="text-xs font-bold text-gray-900 dark:text-white font-poppins leading-snug">
                            {post.authorName}
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                            {post.authorHandle} • {post.timestamp}
                          </div>
                        </div>
                      </div>
                      {getPlatformBadge(post.platform)}
                    </div>

                    {/* Post text */}
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed font-normal whitespace-pre-line">
                      {post.content}
                    </p>

                    {/* Hashtags */}
                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {post.hashtags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setSearchQuery(tag)}
                            className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Media Preview if present */}
                  {post.mediaUrl && (
                    <div className="relative group/media overflow-hidden aspect-video bg-gray-100 dark:bg-gray-800">
                      <img
                        src={post.mediaUrl}
                        alt="Aperçu publication"
                        className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-500"
                      />
                      {post.mediaType === 'video' && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg backdrop-blur-xs group-hover/media:scale-110 transition-transform">
                            <Play className="w-6 h-6 fill-current ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions & Metrics Footer */}
                  <div className="p-4 bg-gray-50/60 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleToggleLike(post.id)}
                        className={`flex items-center gap-1.5 font-bold transition-colors ${
                          isLiked ? 'text-rose-600 dark:text-rose-400' : 'hover:text-rose-600 dark:hover:text-rose-400'
                        }`}
                        title="J aime"
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-rose-600' : ''}`} />
                        <span>{post.likes}</span>
                      </button>

                      <span className="flex items-center gap-1.5 font-medium" title="Commentaires">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </span>

                      <button
                        onClick={() => handleShare(post)}
                        className="flex items-center gap-1.5 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors"
                        title="Partager"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>{post.shares}</span>
                      </button>
                    </div>

                    <a
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 group/link"
                      title="Voir sur le réseau officiel"
                    >
                      <span>Voir post</span>
                      <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer CTA Banner for Social Media */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-gray-900 via-rose-950 to-gray-900 border border-rose-900/40 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold font-poppins">
              Abonnez-vous à nos comptes officiels ! 📣
            </h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Chaque mention, j aime et partage contribue à accroître la visibilité de nos projets humanitaires à Ngozi.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://instagram.com/rotaract_ngozi"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-md"
            >
              Suivre sur Instagram
            </a>
            <a
              href="https://facebook.com/rotaractngozikugasaka"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-blue-600 font-bold text-xs hover:bg-blue-500 transition-colors flex items-center gap-1.5 shadow-md"
            >
              Suivre sur Facebook
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

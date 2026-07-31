import React from 'react';
import { Play, ArrowRight, Sparkles, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { HeroContent } from '../data/siteContent';

interface HeroProps {
  heroContent: HeroContent;
  onOpenVideo: () => void;
  onOpenMembership: () => void;
}

export const Hero: React.FC<HeroProps> = ({ heroContent, onOpenVideo, onOpenMembership }) => {
  return (
    <section id="accueil" className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden bg-gradient-to-br from-rose-50/40 via-white to-pink-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-rose-950/20">
      {/* Background Decorative Blobs */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-rose-400/20 dark:bg-rose-600/10 rounded-full filter blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-400/20 dark:bg-pink-600/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full opacity-5 dark:opacity-10 pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(circle, #E11D48 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100/80 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-rose-600 dark:bg-rose-400 animate-ping" />
              <Sparkles className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              {heroContent.badgeText}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-poppins text-gray-900 dark:text-white leading-[1.15] tracking-tight">
              {heroContent.title}
            </h1>

            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
              {heroContent.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onOpenMembership}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold shadow-xl shadow-rose-600/30 hover:shadow-2xl hover:shadow-rose-600/40 hover:scale-[1.02] transition-all flex items-center gap-3 text-base"
              >
                {heroContent.ctaPrimary}
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onOpenVideo}
                className="px-6 py-4 rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-rose-600 dark:hover:border-rose-500 text-gray-800 dark:text-white font-semibold flex items-center gap-3 transition-all hover:bg-rose-50/50 dark:hover:bg-rose-950/20 group text-base"
              >
                <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                {heroContent.ctaSecondary}
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-gray-200/80 dark:border-gray-800">
              <div>
                <div className="text-3xl font-bold font-poppins text-gray-900 dark:text-white">{heroContent.statMembers}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Membres Actifs</div>
              </div>
              <div>
                <div className="text-3xl font-bold font-poppins text-gray-900 dark:text-white">{heroContent.statTrees}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Arbres Plantés</div>
              </div>
              <div>
                <div className="text-3xl font-bold font-poppins text-gray-900 dark:text-white">{heroContent.statBlood}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Poches de Sang</div>
              </div>
              <div>
                <div className="text-3xl font-bold font-poppins text-gray-900 dark:text-white">{heroContent.statProjects}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Projets Réalisés</div>
              </div>
            </div>
          </div>

          {/* Right Visual Frame */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50 dark:border-gray-800">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&auto=format&fit=crop&q=80"
                alt="Membres du Rotaract Club Ngozi Kugasaka"
                className="w-full h-[480px] lg:h-[560px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
            </div>

            {/* Floating Card 1 */}
            <div className="absolute -bottom-6 -left-6 sm:-left-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-800 flex items-center gap-4 max-w-xs">
              <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-600/30">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white text-sm font-poppins">Au service de Ngozi</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Impact humanitaire & solidarité locale.</div>
              </div>
            </div>

            {/* Floating Card 2 */}
            <div className="absolute -top-4 -right-4 sm:-right-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white text-xs">Depuis 2018</div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400">Certifié Rotary</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

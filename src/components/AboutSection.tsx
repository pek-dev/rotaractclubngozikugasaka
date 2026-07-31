import React from 'react';
import { CheckCircle2, Award, ArrowRight } from 'lucide-react';
import { AboutContent } from '../data/siteContent';

interface AboutSectionProps {
  aboutContent?: AboutContent;
  onOpenMembership: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ aboutContent, onOpenMembership }) => {
  return (
    <section id="apropos" className="py-24 bg-gray-50/70 dark:bg-gray-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Media Column */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50 dark:border-gray-800">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop&q=80"
                alt="Projets du Rotaract Club Ngozi Kugasaka"
                className="w-full h-[520px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent" />
            </div>

            {/* Experience badge */}
            <div className="absolute -bottom-8 -right-6 sm:-right-8 bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-200/60 dark:border-gray-800 text-center min-w-[180px]">
              <div className="text-4xl font-extrabold font-poppins bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                8+ Ans
              </div>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">
                D impact continu à Ngozi
              </div>
            </div>

            {/* Rotary affiliation badge */}
            <div className="absolute -top-6 -left-6 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-xl border border-gray-200/60 dark:border-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">Rotary Parrain</div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400">Rotary Club de Ngozi</div>
              </div>
            </div>
          </div>

          {/* Right Text Column */}
          <div className="space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
              {aboutContent?.badge || 'À PROPOS DE NOTRE CLUB'}
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-poppins text-gray-900 dark:text-white leading-tight">
              {aboutContent?.sectionTitle || 'À Propos du Rotaract Club Ngozi Kugasaka'}
            </h2>

            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
              {aboutContent?.historyText}
            </p>

            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
              {aboutContent?.missionText}
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { title: 'Mission Humanitaire', desc: aboutContent?.missionText || 'Actions concrètes de santé et d éducation.' },
                { title: 'Vision du Club', desc: aboutContent?.visionText || 'Être le moteur du leadership de la jeunesse.' },
                { title: 'Valeurs Clés', desc: aboutContent?.valuesText || 'Camaraderie, Éthique, Diversité et Service.' },
                { title: 'Transparence & Éthique', desc: 'Gestion exemplaire des ressources et engagements.' },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white font-poppins">{item.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenMembership}
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center gap-2"
              >
                Devenir membre volontaire
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#contact"
                className="px-6 py-3.5 rounded-full border border-gray-300 dark:border-gray-700 hover:border-rose-600 text-gray-800 dark:text-white font-semibold text-sm transition-colors"
              >
                Nous poser une question
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

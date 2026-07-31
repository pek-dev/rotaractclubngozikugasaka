import React from 'react';
import { PARTNERS_DATA } from '../data/mockData';
import { Globe, Award, GraduationCap, HeartPulse, Building2, BookOpenCheck, Palette, Code } from 'lucide-react';

export const PartnersSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe className="w-8 h-8 text-rose-600" />;
      case 'Award': return <Award className="w-8 h-8 text-blue-600" />;
      case 'GraduationCap': return <GraduationCap className="w-8 h-8 text-emerald-600" />;
      case 'HeartPulse': return <HeartPulse className="w-8 h-8 text-red-600" />;
      case 'Building2': return <Building2 className="w-8 h-8 text-amber-600" />;
      case 'BookOpenCheck': return <BookOpenCheck className="w-8 h-8 text-indigo-600" />;
      case 'Palette': return <Palette className="w-8 h-8 text-purple-600" />;
      case 'Code': return <Code className="w-8 h-8 text-cyan-600" />;
      default: return <Globe className="w-8 h-8 text-rose-600" />;
    }
  };

  return (
    <section className="py-20 bg-gray-50/60 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
            NOS PARTENAIRES DE CONFIANCE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-poppins text-gray-900 dark:text-white">
            Ils accompagnent nos <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">actions</span> à Ngozi
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {PARTNERS_DATA.map((partner, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col items-center justify-center text-center hover:scale-105 hover:border-rose-300 dark:hover:border-rose-800 transition-all duration-300 group"
            >
              <div className="mb-2 group-hover:scale-110 transition-transform">
                {getIcon(partner.icon)}
              </div>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 font-poppins leading-snug">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

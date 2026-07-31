import React from 'react';
import { Heart, Users, Target, Sprout } from 'lucide-react';

export const ValuesSection: React.FC = () => {
  const values = [
    {
      icon: Heart,
      title: 'Service Humanitaire',
      description: 'Nous mettons nos compétences et notre énergie au service de la santé, de l éducation et du bien-être des communautés vulnérables.',
      color: 'from-rose-500 to-pink-500',
      bgLight: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400',
    },
    {
      icon: Users,
      title: 'Amitié & Fraternité',
      description: 'Nous tissons des liens sincères et durables entre jeunes issus de divers horizons, fondés sur l entraide et la bienveillance.',
      color: 'from-blue-500 to-indigo-500',
      bgLight: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
    },
    {
      icon: Target,
      title: 'Leadership Éthique',
      description: 'Nous formons les responsables de demain en valorisant la prise d initiative, l intégrité, l éloquence et le sens du devoir.',
      color: 'from-amber-500 to-orange-500',
      bgLight: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
    },
    {
      icon: Sprout,
      title: 'Développement Durable',
      description: 'Chacun de nos projets vise un impact pérenne à travers le reboisement, la santé publique et l autonomisation des jeunes.',
      color: 'from-emerald-500 to-teal-500',
      bgLight: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            NOS PILES FONDAMENTAUX
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-poppins text-gray-900 dark:text-white">
            Ce qui nous <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">inspire</span> chaque jour
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Quatre valeurs fondamentales qui guident nos engagements et définissent l esprit du Rotaract Club Ngozi Kugasaka.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="group p-8 rounded-3xl bg-gray-50/60 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60 hover:border-rose-300 dark:hover:border-rose-800 hover:shadow-xl hover:shadow-rose-500/5 hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl ${v.bgLight} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-poppins text-gray-900 dark:text-white mb-3">
                  {v.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {v.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { TeamMember } from '../types';
import { Mail, Linkedin, Facebook } from 'lucide-react';

interface TeamSectionProps {
  team: TeamMember[];
}

export const TeamSection: React.FC<TeamSectionProps> = ({ team }) => {
  return (
    <section id="equipe" className="py-24 bg-gray-50/70 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            COMITÉ EXECUTIVE 2026
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-poppins text-gray-900 dark:text-white">
            Les visages du <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">leadership</span>
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Découvrez l équipe d administration qui coordonne nos activités, nos finances et le réseau des bénévoles à Ngozi.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((m) => (
            <div
              key={m.id}
              className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200/80 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-rose-500/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Social hover bar */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {m.email && (
                      <a
                        href={`mailto:${m.email}`}
                        className="w-9 h-9 rounded-full bg-white/90 text-gray-900 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-colors"
                        title="Envoyer un email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                    {m.linkedin && (
                      <a
                        href={m.linkedin}
                        className="w-9 h-9 rounded-full bg-white/90 text-gray-900 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold font-poppins text-gray-900 dark:text-white">
                    {m.name}
                  </h3>
                  <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-0.5 mb-3">
                    {m.role}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {m.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { Calculator, Trees, Droplet, BookOpen, HeartPulse, Sparkles, ArrowRight } from 'lucide-react';
import { ImpactContent } from '../data/siteContent';

interface ImpactCalculatorProps {
  impactContent?: ImpactContent;
  onOpenMembership: () => void;
}

export const ImpactCalculator: React.FC<ImpactCalculatorProps> = ({ impactContent, onOpenMembership }) => {
  const [mode, setMode] = useState<'donation' | 'volunteer'>('donation');
  const [amount, setAmount] = useState<number>(30); // $30 default
  const [hours, setHours] = useState<number>(10); // 10h default

  // Impact calculations
  const calculateImpact = () => {
    if (mode === 'donation') {
      const trees = Math.floor(amount * 0.8); // $1 = ~0.8 trees
      const bloodKits = Math.floor(amount * 0.25); // $4 = 1 kit
      const schoolKits = Math.floor(amount / 5); // $5 = 1 kit d'écolier
      const healthConsultations = Math.floor(amount / 3); // $3 = 1 consultation
      return { trees, bloodKits, schoolKits, healthConsultations };
    } else {
      const trees = hours * 5;
      const bloodKits = Math.floor(hours * 0.5);
      const schoolKits = Math.floor(hours * 1.5);
      const healthConsultations = hours * 2;
      return { trees, bloodKits, schoolKits, healthConsultations };
    }
  };

  const impact = calculateImpact();

  return (
    <section id="impact" className="py-24 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            {impactContent?.badge || 'CALCULATEUR D IMPACT INTERACTIF'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-poppins text-gray-900 dark:text-white">
            {impactContent?.sectionTitle || 'Calculateur & Tableau de Bord d Impact Communautaire'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300">
            {impactContent?.impactDescription || 'Découvrez l effet multiplicateur de vos contributions et de nos bénévoles sur le terrain à Ngozi.'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-rose-500/5 via-pink-500/5 to-purple-500/5 dark:from-rose-950/20 dark:via-gray-900 dark:to-purple-950/20 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-xl">
          {/* Mode Switcher */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-200/80 dark:bg-gray-800 p-1.5 rounded-2xl inline-flex gap-2">
              <button
                onClick={() => setMode('donation')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  mode === 'donation'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                💵 Don Financier ($ USD)
              </button>
              <button
                onClick={() => setMode('volunteer')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  mode === 'volunteer'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                ⏱️ Temps de Volontariat (Heures)
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Slider Control Column */}
            <div className="lg:col-span-5 space-y-6 bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-900 dark:text-white font-poppins flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-rose-600" />
                  {mode === 'donation' ? 'Montant de votre contribution :' : 'Heures de bénévolat données :'}
                </label>
                <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-poppins">
                  {mode === 'donation' ? `${amount} $` : `${hours} Heures`}
                </span>
              </div>

              {mode === 'donation' ? (
                <div>
                  <input
                    type="range"
                    min="5"
                    max="200"
                    step="5"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>5 $</span>
                    <span>50 $</span>
                    <span>100 $</span>
                    <span>200 $</span>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="range"
                    min="2"
                    max="50"
                    step="2"
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>2h</span>
                    <span>15h</span>
                    <span>30h</span>
                    <span>50h</span>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pt-2 border-t border-gray-100 dark:border-gray-800">
                100% de vos dons et de votre temps servent directement à financer les semences d arbres, les kits scolaires et l équipement sanitaire sur le terrain à Ngozi.
              </p>

              <button
                onClick={onOpenMembership}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-md shadow-rose-600/30 flex items-center justify-center gap-2"
              >
                Concrétiser mon engagement
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Results Grid Column */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-emerald-100 dark:border-emerald-950/50 shadow-xs flex items-center gap-4 hover:scale-[1.02] transition-transform">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Trees className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold font-poppins text-gray-900 dark:text-white">
                    {impact.trees}
                  </div>
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    Arbres plantés & entretenus
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-rose-100 dark:border-rose-950/50 shadow-xs flex items-center gap-4 hover:scale-[1.02] transition-transform">
                <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <Droplet className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold font-poppins text-gray-900 dark:text-white">
                    {impact.bloodKits}
                  </div>
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    Poches de sang sécurisées
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-950/50 shadow-xs flex items-center gap-4 hover:scale-[1.02] transition-transform">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <BookOpen className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold font-poppins text-gray-900 dark:text-white">
                    {impact.schoolKits}
                  </div>
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    Kits scolaires pour orphelins
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-amber-100 dark:border-amber-950/50 shadow-xs flex items-center gap-4 hover:scale-[1.02] transition-transform">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <HeartPulse className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold font-poppins text-gray-900 dark:text-white">
                    {impact.healthConsultations}
                  </div>
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    Consultations médicales offertes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

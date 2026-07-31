import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  Car,
  ExternalLink,
  Copy,
  Check,
  Building2,
  Compass,
  PhoneCall,
  Sparkles
} from 'lucide-react';

interface ContactMapSectionProps {
  address?: string;
  meetingPlace?: string;
  meetingTimes?: string;
  phone?: string;
  onShowToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const ContactMapSection: React.FC<ContactMapSectionProps> = ({
  address = 'Quartier Kugasaka, Ville de Ngozi, Burundi',
  meetingPlace = 'Salle de Conférence Hôtel Panorama / Centre d Action Ngozi',
  meetingTimes = 'Chaque Samedi de 16h00 à 18h00',
  phone = '+257 67 301 044',
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'carte' | 'horaires' | 'transport'>('carte');
  const [copiedCoords, setCopiedCoords] = useState(false);

  const lat = -2.9075;
  const lng = 29.8306;
  const coordsStr = `${lat}, ${lng}`;

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(coordsStr);
    setCopiedCoords(true);
    onShowToast?.('Coordonnées GPS copiées : -2.9075, 29.8306 ! 📍', 'success');
    setTimeout(() => setCopiedCoords(false), 3000);
  };

  const openGoogleMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
    onShowToast?.('Ouverture de Google Maps vers Ngozi, Burundi ! 🗺️', 'info');
  };

  const openOpenStreetMap = () => {
    window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`, '_blank');
    onShowToast?.('Ouverture de OpenStreetMap... 🗺️', 'info');
  };

  return (
    <section id="carte-localisation" className="py-20 bg-gray-100/60 dark:bg-gray-900/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" /> SIÈGE SOCIAL & LOCALISATION
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-poppins text-gray-900 dark:text-white">
            Où nous trouver à <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">Ngozi (Burundi)</span> ?
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Venez assister à nos réunions statutaires du samedi ou rencontrer notre bureau d'action au cœur de la Province de Ngozi.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm gap-1">
            <button
              onClick={() => setActiveTab('carte')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                activeTab === 'carte'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Carte Interactive
            </button>
            <button
              onClick={() => setActiveTab('horaires')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                activeTab === 'horaires'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              Horaires & Réunions
            </button>
            <button
              onClick={() => setActiveTab('transport')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                activeTab === 'transport'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Car className="w-4 h-4" />
              Accès & Transport
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Map Embed Column */}
          <div className="lg:col-span-8 bg-white dark:bg-gray-800/80 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl relative min-h-[420px] flex flex-col">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="font-poppins font-bold text-xs text-gray-900 dark:text-white">
                  Centre-Ville de Ngozi, Burundi
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-semibold">
                  GPS: -2.9075, 29.8306
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCoords}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-xs font-bold flex items-center gap-1 hover:bg-gray-100"
                  title="Copier les coordonnées GPS"
                >
                  {copiedCoords ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-rose-500" />}
                  Copier GPS
                </button>
                <button
                  onClick={openGoogleMaps}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Google Maps
                </button>
              </div>
            </div>

            {/* Embedded Interactive OpenStreetMap Iframe */}
            <div className="relative w-full h-[380px] sm:h-[420px] bg-gray-200 dark:bg-gray-900">
              <iframe
                title="Carte de localisation du Rotaract Ngozi"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src="https://www.openstreetmap.org/export/embed.html?bbox=29.8156%2C-2.9225%2C29.8456%2C-2.8925&amp;layer=mapnik&amp;marker=-2.9075%2C29.8306"
                className="w-full h-full filter dark:contrast-125 dark:brightness-90"
              />

              {/* Custom Overlay Pin Box */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl space-y-2">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
                  <MapPin className="w-4 h-4 fill-rose-600 text-white" />
                  <span>Siège Rotaract Ngozi Kugasaka</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                  {meetingPlace}
                </p>
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-500">
                  <span>Province de Ngozi</span>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      openOpenStreetMap();
                    }}
                    className="text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-0.5"
                  >
                    Agragrandir <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Info Column */}
          <div className="lg:col-span-4 space-y-4">
            {/* Address Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-gray-900 dark:text-white text-sm">
                    Adresse & Quartier
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Repères en centre-ville</p>
                </div>
              </div>

              <div className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <p className="font-semibold text-gray-900 dark:text-white">
                  📍 {address}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  • Près du Marché Central de Ngozi et de l'Avenue Principale Kugasaka.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  • À 5 minutes de la Cathédrale de Ngozi.
                </p>
              </div>
            </div>

            {/* Meeting Schedule Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-gray-900 dark:text-white text-sm">
                    Réunions Statutaires
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ouvertes aux visiteurs</p>
                </div>
              </div>

              <div className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 font-bold text-amber-800 dark:text-amber-300">
                  ⏰ {meetingTimes}
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Tous les jeunes professionnels et étudiants (18-30 ans) sont invités à assister aux séances d'échange et d'action.
                </p>
              </div>
            </div>

            {/* Direct Contact Button */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg space-y-3 text-center">
              <Sparkles className="w-6 h-6 text-amber-300 mx-auto" />
              <h4 className="font-bold font-poppins text-sm">Besoin d un itinéraire guidé ?</h4>
              <p className="text-xs text-rose-100">
                Contactez notre responsable logistique pour vous accueillir à votre arrivée à Ngozi.
              </p>
              <button
                onClick={() => {
                  window.open(`https://wa.me/25779000000?text=${encodeURIComponent('Bonjour Rotaract Ngozi, je souhaite vous rendre visite à Ngozi.')}`, '_blank');
                  onShowToast?.('Ouverture de WhatsApp pour contact logistique...', 'info');
                }}
                className="w-full py-2.5 rounded-xl bg-white text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Contacter sur WhatsApp ({phone})
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, CheckCircle, ShieldCheck } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallationBanner: React.FC<{
  onShowToast?: (message: string, type?: 'success' | 'info') => void;
}> = ({ onShowToast }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Check if app is running as standalone (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      if (onShowToast) {
        onShowToast('Félicitations ! Rotaract Ngozi est installé sur votre écran d accueil 📱✨', 'success');
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [onShowToast]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback message for browsers without beforeinstallprompt or desktop Safari/Chrome
      if (onShowToast) {
        onShowToast('Pour installer : Cliquez sur le menu de votre navigateur -> "Ajouter à l écran d accueil" 📱', 'info');
      }
      setIsVisible(false);
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        if (onShowToast) {
          onShowToast('Installation de l application en cours... 🚀', 'success');
        }
      }
      setDeferredPrompt(null);
      setIsVisible(false);
    } catch (err) {
      console.error('Erreur lors de l installation PWA:', err);
    }
  };

  if (isInstalled || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 z-40 max-w-md bg-gray-900/95 dark:bg-gray-950/95 text-white backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-rose-500/30 flex items-center justify-between gap-3 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-600 text-white shrink-0 shadow-md">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1 font-poppins">
            <ShieldCheck className="w-3.5 h-3.5" /> App Officielle Rotaract
          </div>
          <p className="text-xs font-medium text-gray-200 mt-0.5">
            Installer <strong className="text-white">Rotaract Ngozi</strong> sur votre écran d accueil mobile
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleInstallClick}
          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/40 flex items-center gap-1"
        >
          <Download className="w-3.5 h-3.5" />
          Installer
        </button>

        <button
          onClick={() => setIsVisible(false)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          title="Plus tard"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

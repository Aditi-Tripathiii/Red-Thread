import React, { useState } from "react";
import { Download, Smartphone, X, Sparkles } from "lucide-react";
import { usePWAInstall } from "../../hooks/usePWAInstall";

interface Props {
  onOpenGetOnPhoneModal: () => void;
}

export const PWAInstallBanner: React.FC<Props> = ({ onOpenGetOnPhoneModal }) => {
  const { isInstallable, isInstalled, install, isIOS, isAndroid } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-blue-950/80 via-[#121B2D] to-cyan-950/80 border-b border-cyan-500/20 px-4 py-2.5 text-xs">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-slate-100 block sm:inline mr-1.5 truncate">
              Get Red Thread on Your Phone
            </span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              Install as a native-feel PWA with offline protection.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isInstallable ? (
            <button
              onClick={install}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          ) : (
            <button
              onClick={onOpenGetOnPhoneModal}
              className="px-3 py-1.5 rounded-lg bg-[#1E2E4E] hover:bg-[#2A3A5E] text-cyan-300 border border-cyan-500/30 font-semibold text-xs flex items-center gap-1 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Install Guide</span>
            </button>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-500 hover:text-slate-300 rounded-lg"
            title="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

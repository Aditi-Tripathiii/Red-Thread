import React, { useState } from "react";
import {
  Smartphone,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Download,
  Share2,
  X,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Layers,
} from "lucide-react";
import { usePWAInstall } from "../../hooks/usePWAInstall";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GetOnPhoneModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { isInstallable, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [activePlatform, setActivePlatform] = useState<"ANDROID" | "IOS" | "TROUBLESHOOT">("ANDROID");

  // Determine current active URL
  const currentOrigin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "https://ais-dev-g3nnibswqwmlqy4luhn4dd-267385686446.asia-east1.run.app";

  const [customUrl, setCustomUrl] = useState(currentOrigin);

  if (!isOpen) return null;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    customUrl
  )}&bgcolor=0F172A&color=38BDF8&margin=10`;

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#03060C]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#0F172A] border border-[#1E2E4E] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#1E2E4E]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Install Red Thread on Your Phone
              </h3>
              <p className="text-xs text-cyan-400 font-medium">
                PWA Standalone App • Zero App Store Required
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Crucial Fix Notification: AI Studio Share Step */}
        <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Why did the link or QR say "404 Not Found" or ask to sign in?</span>
          </div>
          <p className="text-[11px] text-amber-200/90 leading-relaxed">
            In Google AI Studio, external devices (like your phone) cannot access private developer sandboxes directly unless you publish the share link first:
          </p>
          <div className="bg-[#070B14] p-3 rounded-xl border border-amber-500/20 text-xs text-slate-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
              <span>Look at the <strong>top right corner of the AI Studio screen</strong> (outside this preview).</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
              <span>Click the <strong>"Share"</strong> button and select <strong>"Publish"</strong> or <strong>"Copy Link"</strong>.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
              <span>Open that copied link on your phone, or paste it below to generate an instant QR code.</span>
            </div>
          </div>
        </div>

        {/* If already in mobile browser and installable */}
        {isInstallable && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 to-cyan-950/40 border border-cyan-500/30 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Browser Supports Direct 1-Click Install
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Tap below to install Red Thread straight onto this device.
              </p>
            </div>
            <button
              onClick={install}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install Now</span>
            </button>
          </div>
        )}

        {/* QR Code & URL Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* QR Code Display */}
          <div className="bg-[#121B2D] border border-[#1E2E4E] rounded-2xl p-4 text-center space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span>Scan with Phone Camera</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Point your Android camera or Google Lens at this code:
              </p>
            </div>

            <div className="w-36 h-36 mx-auto bg-[#070B14] p-2 rounded-2xl border border-[#1E2E4E] flex items-center justify-center shadow-inner">
              <img
                src={qrCodeUrl}
                alt="Scan to open Red Thread"
                className="w-full h-full rounded-xl object-contain"
              />
            </div>

            <span className="text-[10px] text-cyan-400 font-mono">
              Live QR code for active link
            </span>
          </div>

          {/* Copy Link & Custom Input */}
          <div className="bg-[#121B2D] border border-[#1E2E4E] rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Target App URL
              </span>
              <p className="text-[10px] text-slate-400">
                You can paste your published AI Studio share link here to update the QR code:
              </p>
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://ais-pre-..."
                className="w-full bg-[#070B14] border border-[#1E2E4E] rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleCopy(customUrl)}
                className="w-full py-2.5 rounded-xl bg-[#1E2E4E] hover:bg-[#2A3A5E] text-slate-100 text-xs font-semibold flex items-center justify-center gap-2 transition-colors active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Link Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-cyan-400" />
                    <span>Copy Link to Phone</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-500 text-center">
                Open in Chrome on Android or Safari on iOS
              </p>
            </div>
          </div>
        </div>

        {/* Platform Step-by-Step Tabs */}
        <div className="space-y-3">
          <div className="flex bg-[#070B14] p-1 rounded-xl border border-[#1E2E4E]">
            <button
              onClick={() => setActivePlatform("ANDROID")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activePlatform === "ANDROID"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Android (Chrome)
            </button>
            <button
              onClick={() => setActivePlatform("IOS")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activePlatform === "IOS"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              iPhone (Safari)
            </button>
            <button
              onClick={() => setActivePlatform("TROUBLESHOOT")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activePlatform === "TROUBLESHOOT"
                  ? "bg-purple-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Export APK / Offline
            </button>
          </div>

          {activePlatform === "ANDROID" && (
            <div className="bg-[#121B2D] border border-[#1E2E4E] rounded-2xl p-4 space-y-2 text-xs text-slate-200">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">1</div>
                <p>Open the link in <strong>Google Chrome</strong> on your Android phone.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">2</div>
                <p>Tap the <strong>three dots (⋮)</strong> menu in the upper right corner.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">3</div>
                <p>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">4</div>
                <p>It installs as a standalone Android app with full offline cache and no browser URL bar.</p>
              </div>
            </div>
          )}

          {activePlatform === "IOS" && (
            <div className="bg-[#121B2D] border border-[#1E2E4E] rounded-2xl p-4 space-y-2 text-xs text-slate-200">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">1</div>
                <p>Open the link in <strong>Safari</strong> on your iPhone.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">2</div>
                <p>Tap the <strong>Share</strong> button (box with an arrow pointing up) at the bottom.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">3</div>
                <p>Scroll down and tap <strong>"Add to Home Screen"</strong>, then tap <strong>Add</strong>.</p>
              </div>
            </div>
          )}

          {activePlatform === "TROUBLESHOOT" && (
            <div className="bg-[#121B2D] border border-[#1E2E4E] rounded-2xl p-4 space-y-2.5 text-xs text-slate-200">
              <h4 className="font-bold text-slate-100 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Need a native Android APK or offline source bundle?</span>
              </h4>
              <p className="text-[11px] text-slate-300">
                You can export this entire codebase anytime from Google AI Studio:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-300">
                <li>Click <strong>Settings</strong> (gear icon) in Google AI Studio to <strong>Export to ZIP</strong> or <strong>Push to GitHub</strong>.</li>
                <li>Turn this PWA into an Android APK using <strong>Bubblewrap (Google CLI)</strong> or <strong>PWABuilder.com</strong> in one command.</li>
                <li>Use the built-in <strong>Phone Frame toggle</strong> in the header bar above to test the full Android experience right here in your browser!</li>
              </ul>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="pt-2 border-t border-[#1E2E4E] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1E2E4E] hover:bg-[#2A3A5E] text-slate-200 text-xs font-semibold transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};


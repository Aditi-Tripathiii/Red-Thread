import React from 'react';
import {
  ShieldAlert,
  Wifi,
  BatteryCharging,
  Bell,
  Volume2,
  VolumeX,
  Smartphone,
  Maximize2,
  Fingerprint,
  Lock,
  Unlock,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  QrCode,
  Flame,
} from 'lucide-react';
import { soundAlert } from '../services/soundAlert';

interface AndroidHeaderProps {
  threatCount: number;
  isLocked: boolean;
  onOpenBiometric: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenNotifications: () => void;
  unreadAlerts: number;
  onOpenQrScanner: () => void;
}

export const AndroidHeader: React.FC<AndroidHeaderProps> = ({
  threatCount,
  isLocked,
  onOpenBiometric,
  isMobileFrame,
  onToggleMobileFrame,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  soundEnabled,
  onToggleSound,
  onOpenNotifications,
  unreadAlerts,
  onOpenQrScanner,
}) => {
  const [time, setTime] = React.useState('10:30');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full bg-slate-950/95 backdrop-blur-md border-b border-red-900/30 sticky top-0 z-40 text-slate-100">
      {/* Android System Status Bar with Indian Telecom indicator */}
      <div className="px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-900">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200 tracking-wider">{time}</span>
          <span className="text-[10px] bg-red-950/80 text-red-300 border border-red-500/30 px-1.5 py-0.5 rounded font-bold">
            Jio 5G / Airtel
          </span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">
            • 1930 Cyber Helpline Integrated
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <Wifi className="w-3.5 h-3.5 text-slate-300" />
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-300 font-mono">98%</span>
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Main App Toolbar */}
      <div className="px-2 sm:px-4 py-2 flex items-center justify-between gap-1 sm:gap-2 overflow-visible">
        {/* Brand: RED THREAD */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <div className="relative shrink-0">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-red-600 via-rose-700 to-red-950 flex items-center justify-center shadow-lg shadow-red-950/70 border border-red-500/50">
              <span className="text-white font-black text-xs sm:text-sm tracking-tighter">
                RT
              </span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </div>

          <div className="flex items-center shrink-0">
            <h1 className="text-xs sm:text-base font-black text-white tracking-wider uppercase whitespace-nowrap">
              RED THREAD
            </h1>
          </div>
        </div>

        {/* Action Controls & Zoom Toolbar */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Direct Scan QR Button */}
          <button
            id="btn-header-scan-qr"
            onClick={onOpenQrScanner}
            title="Open UPI QR Fraud Checker"
            className="px-1.5 sm:px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-red-950/50 transition-colors shrink-0"
          >
            <QrCode className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[11px] font-bold whitespace-nowrap hidden min-[390px]:inline">Verify QR</span>
          </button>

          {/* Laptop Zoom Access Controls - visible on tablet/desktop */}
          <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 shrink-0" title="Laptop Display Zoom Controls">
            <button
              id="btn-zoom-out"
              onClick={onZoomOut}
              title="Zoom Out Interface"
              disabled={zoomLevel <= 75}
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              id="btn-zoom-reset"
              onClick={onResetZoom}
              title={`Reset Zoom (Current: ${zoomLevel}%)`}
              className="px-1 text-[10px] font-mono font-bold text-slate-300 hover:text-white"
            >
              {zoomLevel}%
            </button>
            <button
              id="btn-zoom-in"
              onClick={onZoomIn}
              title="Zoom In Interface"
              disabled={zoomLevel >= 150}
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Device Frame View Toggle (Mobile vs Laptop Wide) */}
          <button
            id="btn-toggle-mobile-frame"
            onClick={onToggleMobileFrame}
            title={isMobileFrame ? 'Switch to Laptop/Desktop Expanded View' : 'Switch to Android Mobile Device View'}
            className={`hidden md:flex p-2 rounded-lg border text-xs font-medium items-center gap-1 transition-colors shrink-0 ${
              isMobileFrame
                ? 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            {isMobileFrame ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px]">Expanded</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px]">Mobile View</span>
              </>
            )}
          </button>

          {/* Sound Alert Toggle */}
          <button
            id="btn-sound-toggle"
            onClick={onToggleSound}
            title={soundEnabled ? 'Sound alert enabled. Click to mute' : 'Sound alert muted. Click to enable'}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors shrink-0"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          {/* Notifications Trigger */}
          <button
            id="btn-notifications-drawer"
            onClick={onOpenNotifications}
            title="Real-time security alerts"
            className="relative p-1.5 sm:p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors shrink-0"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadAlerts}
              </span>
            )}
          </button>

          {/* Biometric Security Lock Status - Always displays 'Unlocked' / 'Locked' label even in phone layout */}
          <button
            id="btn-biometric-lock"
            onClick={onOpenBiometric}
            title={isLocked ? 'Settings locked. Click to authenticate with Biometrics' : 'Authenticated. Click to lock'}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all shrink-0 z-10 ${
              isLocked
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5 shrink-0" />
            <span className="inline text-[11px] font-bold whitespace-nowrap">{isLocked ? 'Locked' : 'Unlocked'}</span>
            {isLocked ? <Lock className="w-3 h-3 text-amber-400 shrink-0" /> : <Unlock className="w-3 h-3 text-emerald-400 shrink-0" />}
          </button>
        </div>
      </div>
    </header>
  );
};

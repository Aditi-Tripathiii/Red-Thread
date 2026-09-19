import React from "react";
import { Shield, ShieldAlert, ShieldCheck, PauseCircle, Smartphone, Monitor, BellRing, QrCode } from "lucide-react";
import { useSecurity } from "../../context/SecurityContext";

interface HeaderProps {
  onOpenGetOnPhone?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenGetOnPhone }) => {
  const { consent, securityScore, deviceFrameMode, setDeviceFrameMode, triggerSimulatedAlert } = useSecurity();

  return (
    <header className="sticky top-0 z-30 bg-[#070B14]/90 backdrop-blur-md border-b border-[#1A2640] px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand & Status */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-[1.5px] shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-[#070B14] rounded-[10px] flex items-center justify-center">
                {consent.protectionPaused ? (
                  <ShieldAlert className="w-5 h-5 text-amber-400 animate-pulse" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                )}
              </div>
            </div>
            {/* Live indicator dot */}
            <span
              className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#070B14] ${
                consent.protectionPaused ? "bg-amber-400" : "bg-emerald-400 animate-pulse"
              }`}
            />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold tracking-tight text-slate-100">Red Thread</h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                v1.0 MVP
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              {consent.protectionPaused ? (
                <span className="text-amber-400 flex items-center gap-1">
                  <PauseCircle className="w-3 h-3 inline" /> Protection Paused
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active Protection
                </span>
              )}
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">Score: {securityScore}/100</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Get on Phone Button */}
          {onOpenGetOnPhone && (
            <button
              id="btn-get-on-phone"
              onClick={onOpenGetOnPhone}
              title="Get Red Thread on your Android or iPhone"
              className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-blue-600/30 to-cyan-500/30 hover:from-blue-600/50 hover:to-cyan-500/50 text-cyan-300 border border-cyan-500/40 px-2.5 py-1.5 rounded-lg transition-all active:scale-95 shadow-sm"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Get on Phone</span>
            </button>
          )}

          {/* Quick Simulate Alert */}
          <button
            id="btn-simulate-alert"
            onClick={() => triggerSimulatedAlert()}
            title="Simulate incoming suspicious message or notification"
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium bg-[#121B2D] hover:bg-[#1A2640] text-slate-300 border border-[#2A3A5E] px-2.5 py-1.5 rounded-lg transition-all active:scale-95"
          >
            <BellRing className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulate Alert</span>
          </button>

          {/* Toggle Device Frame View */}
          <button
            id="btn-toggle-device-frame"
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            title={deviceFrameMode ? "Switch to Responsive View" : "Switch to Android Frame Preview"}
            className="flex items-center gap-1.5 text-xs font-medium bg-[#121B2D] hover:bg-[#1A2640] text-slate-300 border border-[#2A3A5E] px-2.5 py-1.5 rounded-lg transition-all active:scale-95"
          >
            {deviceFrameMode ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden md:inline">Full View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden md:inline">Android Frame</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

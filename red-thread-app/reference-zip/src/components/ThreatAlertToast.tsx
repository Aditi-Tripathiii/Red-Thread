import React from 'react';
import { AlertTriangle, Flame, ShieldAlert, X, ArrowRight, Ban, Check } from 'lucide-react';
import type { ThreatEvent } from '../types/security';

interface ThreatAlertToastProps {
  event: ThreatEvent | null;
  onDismiss: () => void;
  onViewEvent: (event: ThreatEvent) => void;
  onQuickQuarantine: (event: ThreatEvent) => void;
}

export const ThreatAlertToast: React.FC<ThreatAlertToastProps> = ({
  event,
  onDismiss,
  onViewEvent,
  onQuickQuarantine,
}) => {
  if (!event) return null;

  const isCritical = event.severity === 'CRITICAL';
  const isHigh = event.severity === 'HIGH';

  return (
    <div className="fixed bottom-4 right-4 max-w-md w-[92vw] sm:w-[420px] z-50 animate-bounce-short">
      <div
        className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl ${
          isCritical
            ? 'bg-rose-950/90 border-rose-500/50 text-rose-100 shadow-rose-950/80'
            : isHigh
            ? 'bg-amber-950/90 border-amber-500/50 text-amber-100 shadow-amber-950/80'
            : 'bg-slate-900/95 border-emerald-500/40 text-slate-100 shadow-slate-950/80'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                isCritical
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : isHigh
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}
            >
              {isCritical ? (
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              ) : (
                <Flame className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-rose-300">
                  REAL-TIME ALERT: {event.severity}
                </span>
                {event.platform && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950/80 text-cyan-300 border border-slate-700">
                    {event.platform}
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-slate-100 mt-0.5">{event.title}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
                {event.description}
              </p>
            </div>
          </div>

          <button
            id="btn-dismiss-threat-toast"
            onClick={onDismiss}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Action Buttons */}
        <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex items-center justify-end gap-2 text-xs">
          <button
            id="btn-toast-quarantine"
            onClick={() => onQuickQuarantine(event)}
            className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 text-xs font-medium border border-rose-500/40 flex items-center gap-1.5 transition-colors"
          >
            <Ban className="w-3.5 h-3.5" />
            Quarantine Vector
          </button>
          <button
            id="btn-toast-view"
            onClick={() => onViewEvent(event)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors"
          >
            Inspect
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

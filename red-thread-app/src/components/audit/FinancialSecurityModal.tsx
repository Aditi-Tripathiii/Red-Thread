import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Lock,
  ExternalLink,
  Settings,
  PhoneCall,
  CheckCircle2,
  X,
  Smartphone,
  EyeOff,
} from "lucide-react";
import { InstalledApp } from "../../types";

interface Props {
  app: InstalledApp;
  onClose: () => void;
  onMarkSecured: (appId: string) => void;
}

export const FinancialSecurityModal: React.FC<Props> = ({ app, onClose, onMarkSecured }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isDone, setIsDone] = useState(false);

  const securitySteps = app.financialSecuritySteps?.steps || [
    "Open the official application directly on your phone.",
    "Navigate to Profile or Settings > Security.",
    "Select 'Linked Devices / Active Sessions' and terminate unrecognized devices.",
    "Change your MPIN / Passcode if you suspect fraud or keylogger exposure.",
    "Ensure biometric lock (Fingerprint / Face ID) is enabled for transaction approval.",
  ];

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleFinish = () => {
    onMarkSecured(app.id);
    setIsDone(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#03060C]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0F172A] border border-[#1E2E4E] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#1E2E4E]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {app.appName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">{app.appName}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Financial App
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{app.packageName}</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PRD Mandated Boundary Notice */}
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200 space-y-1">
            <strong>Security Boundary Notice:</strong>
            <p className="text-amber-300/90 leading-relaxed">
              Red Thread cannot directly force another application to log out in normal consumer mode. Follow the guided steps below to verify your account security safely.
            </p>
          </div>
        </div>

        {/* Permission & Overlay Status Inspection */}
        <div className="bg-[#121B2D] border border-[#1E2E4E] rounded-2xl p-4 space-y-2.5">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Device Environment Health
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#070B14] border border-[#1A2640]">
              <span className="text-slate-400">Install Source:</span>
              <span className="font-semibold text-emerald-400">Google Play</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#070B14] border border-[#1A2640]">
              <span className="text-slate-400">Overlay Shield:</span>
              <span className="font-semibold text-emerald-400">No active overlay</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#070B14] border border-[#1A2640]">
              <span className="text-slate-400">Accessibility:</span>
              <span className="font-semibold text-emerald-400">Uncompromised</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#070B14] border border-[#1A2640]">
              <span className="text-slate-400">Device Admin:</span>
              <span className="font-semibold text-emerald-400">Not Requested</span>
            </div>
          </div>
        </div>

        {/* Guided Security Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Guided Protection Checklist
            </h4>
            <span className="text-[11px] text-cyan-400 font-semibold">
              {completedSteps.length} of {securitySteps.length} completed
            </span>
          </div>

          <div className="space-y-2">
            {securitySteps.map((step, idx) => {
              const isChecked = completedSteps.includes(idx);
              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isChecked
                      ? "bg-emerald-950/20 border-emerald-500/40 text-slate-200"
                      : "bg-[#121B2D] border-[#1E2E4E] hover:border-[#2A3A5E] text-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleStep(idx)}
                    className="w-4 h-4 mt-0.5 rounded text-emerald-500 bg-slate-800 border-slate-700"
                  />
                  <span className="text-xs leading-relaxed">{step}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer Helpline Verification */}
        {app.financialSecuritySteps?.customerCare && (
          <div className="bg-[#121B2D] border border-[#1E2E4E] rounded-2xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <PhoneCall className="w-4 h-4 text-cyan-400" />
              <span>Official Helpline:</span>
              <strong className="text-slate-100 font-mono">
                {app.financialSecuritySteps.customerCare}
              </strong>
            </div>
            <a
              href={app.financialSecuritySteps.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline text-[11px] flex items-center gap-1"
            >
              <span>Official Site</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[#1E2E4E] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => alert(`Simulating opening ${app.appName} on Android handset.`)}
            className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl bg-[#141F36] hover:bg-[#1E2E4E] text-slate-200 border border-[#23355A]"
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
            <span>Launch App Directly</span>
          </button>

          <button
            id="btn-mark-app-secured"
            onClick={handleFinish}
            disabled={isDone}
            className="flex items-center gap-1.5 text-xs px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            {isDone ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Secured!</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Mark App as Secured</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

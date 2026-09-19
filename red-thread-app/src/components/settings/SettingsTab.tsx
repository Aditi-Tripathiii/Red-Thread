import React, { useState } from "react";
import {
  SlidersHorizontal,
  Bell,
  MessageSquare,
  Mail,
  Lock,
  EyeOff,
  Sparkles,
  Trash2,
  Download,
  ShieldAlert,
  PauseCircle,
  PlayCircle,
  HelpCircle,
  FileCheck,
  CheckCircle2,
  RefreshCw,
  Plus,
  X,
  Smartphone,
  PhoneCall,
} from "lucide-react";
import { useSecurity } from "../../context/SecurityContext";

interface SettingsProps {
  onOpenGetOnPhone?: () => void;
}

export const SettingsTab: React.FC<SettingsProps> = ({ onOpenGetOnPhone }) => {
  const {
    consent,
    updateConsent,
    togglePauseProtection,
    emailAccounts,
    connectEmailAccount,
    disconnectEmailAccount,
    deleteAllHistory,
    exportPrivacyReport,
    installedApps,
    toggleAppExclusion,
    setShowOnboarding,
  } = useSecurity();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pauseHours, setPauseHours] = useState(2);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto pb-24">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
          <span>Security & Privacy Controls</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Customize monitoring sources, privacy boundaries, AI models, and local retention rules.
        </p>
      </div>

      {/* Mobile Phone Installation Banner */}
      {onOpenGetOnPhone && (
        <div className="bg-gradient-to-r from-blue-950/40 via-[#121B2D] to-cyan-950/40 border border-cyan-500/30 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>Install on Your Android / iPhone</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.2 rounded-full font-semibold border border-cyan-500/30">
                  PWA Ready
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Scan QR code with your phone camera or copy direct link to install as a standalone app.
              </p>
            </div>
          </div>
          <button
            id="btn-settings-get-on-phone"
            onClick={onOpenGetOnPhone}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all self-start sm:self-auto shrink-0"
          >
            Get on Phone
          </button>
        </div>
      )}

      {/* 1. Pause Protection Widget */}
      <div
        className={`rounded-3xl p-5 border transition-all ${
          consent.protectionPaused
            ? "bg-amber-950/20 border-amber-500/40"
            : "bg-[#0E172A] border-[#1E2E4E]"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            {consent.protectionPaused ? (
              <PauseCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <PlayCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                {consent.protectionPaused ? "Real-Time Protection is Paused" : "Real-Time Protection is Active"}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {consent.protectionPaused
                  ? `Protection will automatically resume at ${
                      consent.pauseExpiresAt
                        ? new Date(consent.pauseExpiresAt).toLocaleTimeString()
                        : "manual unpause"
                    }.`
                  : "Scanning incoming notifications, SMS alerts, and app permissions continuously."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {!consent.protectionPaused && (
              <select
                value={pauseHours}
                onChange={(e) => setPauseHours(Number(e.target.value))}
                className="bg-[#141F36] border border-[#23355A] text-slate-200 text-xs rounded-xl px-2 py-1.5 outline-none"
              >
                <option value={1}>1 Hour</option>
                <option value={2}>2 Hours</option>
                <option value={8}>8 Hours</option>
                <option value={24}>24 Hours</option>
              </select>
            )}

            <button
              id="btn-toggle-pause"
              onClick={() => togglePauseProtection(pauseHours)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                consent.protectionPaused
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40"
              }`}
            >
              {consent.protectionPaused ? "Resume Protection" : "Pause Protection"}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Monitored Sources */}
      <div className="bg-[#0E172A] border border-[#1E2E4E] rounded-3xl p-5 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-400" />
          <span>Monitoring Permissions & Channels</span>
        </h3>

        <div className="space-y-3">
          {/* Notification Listener */}
          <div className="flex items-center justify-between p-3.5 bg-[#121B2D] border border-[#1E2E4E] rounded-2xl">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-xs font-semibold text-slate-200">Notification Listener</div>
                <div className="text-[11px] text-slate-400">
                  Inspects preview text in alerts from messaging and delivery apps.
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              id="toggle-notification-monitoring"
              checked={consent.notificationMonitoring}
              onChange={(e) => updateConsent("notificationMonitoring", e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 cursor-pointer"
            />
          </div>

          {/* SMS Filter */}
          <div className="flex items-center justify-between p-3.5 bg-[#121B2D] border border-[#1E2E4E] rounded-2xl">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-xs font-semibold text-slate-200">SMS Scam Filter</div>
                <div className="text-[11px] text-slate-400">
                  Flags fake bank KYC alerts, urgent power cutoff threats, and courier fees.
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              id="toggle-sms-monitoring"
              checked={consent.smsMonitoring}
              onChange={(e) => updateConsent("smsMonitoring", e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 cursor-pointer"
            />
          </div>

          {/* Call-Log Metadata */}
          <div className="flex items-center justify-between p-3.5 bg-[#121B2D] border border-[#1E2E4E] rounded-2xl">
            <div className="flex items-center gap-3">
              <PhoneCall className="w-5 h-5 text-indigo-400" />
              <div>
                <div className="text-xs font-semibold text-slate-200">Call-Log Context (Metadata Only)</div>
                <div className="text-[11px] text-slate-400">
                  Cross-references suspicious caller numbers. Never records voice calls.
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              id="toggle-call-log"
              checked={consent.callLogContext}
              onChange={(e) => updateConsent("callLogContext", e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 3. Read-Only Email OAuth Integrations (Gmail & Outlook) */}
      <div className="bg-[#0E172A] border border-[#1E2E4E] rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Mail className="w-4 h-4 text-cyan-400" />
            <span>Email Inboxes (Read-Only OAuth)</span>
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">Tokens Stored in Keystore</span>
        </div>

        <div className="space-y-2.5">
          {/* Gmail */}
          {emailAccounts.some((e) => e.provider === "GMAIL") ? (
            <div className="p-3.5 bg-[#121B2D] border border-[#1E2E4E] rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center font-bold text-rose-400 text-xs">
                  G
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    {emailAccounts.find((e) => e.provider === "GMAIL")?.accountDisplayName}
                  </div>
                  <div className="text-[10px] text-emerald-400">
                    Connected (gmail.readonly scope only)
                  </div>
                </div>
              </div>
              <button
                onClick={() =>
                  disconnectEmailAccount(
                    emailAccounts.find((e) => e.provider === "GMAIL")!.id
                  )
                }
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-3 py-1 bg-rose-500/10 rounded-lg"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="p-3.5 bg-[#121B2D] border border-[#1E2E4E] rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-bold">
                  G
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Google Gmail</div>
                  <div className="text-[10px] text-slate-400">Read-only phishing detection</div>
                </div>
              </div>
              <button
                onClick={() => connectEmailAccount("GMAIL")}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold px-3 py-1 bg-blue-500/10 rounded-lg border border-blue-500/30"
              >
                Connect Gmail
              </button>
            </div>
          )}

          {/* Outlook */}
          {emailAccounts.some((e) => e.provider === "OUTLOOK") ? (
            <div className="p-3.5 bg-[#121B2D] border border-[#1E2E4E] rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-xs">
                  O
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    {emailAccounts.find((e) => e.provider === "OUTLOOK")?.accountDisplayName}
                  </div>
                  <div className="text-[10px] text-emerald-400">
                    Connected (Mail.Read scope only)
                  </div>
                </div>
              </div>
              <button
                onClick={() =>
                  disconnectEmailAccount(
                    emailAccounts.find((e) => e.provider === "OUTLOOK")!.id
                  )
                }
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-3 py-1 bg-rose-500/10 rounded-lg"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="p-3.5 bg-[#121B2D] border border-[#1E2E4E] rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-bold">
                  O
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Microsoft Outlook</div>
                  <div className="text-[10px] text-slate-400">Read-only invoice fraud check</div>
                </div>
              </div>
              <button
                onClick={() => connectEmailAccount("OUTLOOK")}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold px-3 py-1 bg-blue-500/10 rounded-lg border border-blue-500/30"
              >
                Connect Outlook
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Privacy & Processing Engine */}
      <div className="bg-[#0E172A] border border-[#1E2E4E] rounded-3xl p-5 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Privacy & Analysis Engine</span>
        </h3>

        {/* Cloud LLM Switch */}
        <div className="p-3.5 bg-[#121B2D] border border-[#1E2E4E] rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-xs font-semibold text-slate-200">
                  Optional Cloud AI (Gemini 3.8 Flash)
                </div>
                <div className="text-[11px] text-slate-400">
                  Provides high-precision semantic threat reasoning. All OTPs & card numbers are redacted beforehand.
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              id="toggle-cloud-llm"
              checked={consent.cloudLlmAnalysis}
              onChange={(e) => updateConsent("cloudLlmAnalysis", e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 bg-slate-800 border-slate-700 cursor-pointer"
            />
          </div>
          <p className="text-[10px] text-slate-500">
            Per PRD NFR-004: Cloud LLM is disabled by default for strict local data sovereignty.
          </p>
        </div>

        {/* Retention Period Dropdown */}
        <div className="p-3.5 bg-[#121B2D] border border-[#1E2E4E] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-slate-200">Local History Retention</div>
            <div className="text-[11px] text-slate-400">
              Auto-wipe past scan records from device storage.
            </div>
          </div>
          <select
            id="select-retention-period"
            value={consent.dataRetention}
            onChange={(e) => updateConsent("dataRetention", e.target.value as any)}
            className="bg-[#070B14] border border-[#1E2E4E] text-slate-200 text-xs rounded-xl px-3 py-2 outline-none"
          >
            <option value="NONE">Do Not Save (Ephemeral)</option>
            <option value="7_DAYS">7 Days</option>
            <option value="30_DAYS">30 Days (Default)</option>
            <option value="90_DAYS">90 Days</option>
            <option value="MANUAL">Keep until manually deleted</option>
          </select>
        </div>

        {/* Data Actions: Delete & Export */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            id="btn-delete-all-history"
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete All History</span>
          </button>

          <button
            id="btn-export-privacy-report"
            onClick={exportPrivacyReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141F36] hover:bg-[#1E2E4E] text-slate-200 border border-[#23355A] text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Privacy Audit (JSON)</span>
          </button>

          <button
            onClick={() => setShowOnboarding(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141F36] hover:bg-[#1E2E4E] text-slate-300 border border-[#23355A] text-xs font-semibold transition-colors ml-auto"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            <span>Replay Onboarding</span>
          </button>
        </div>
      </div>

      {/* 5. App Exclusions Manager */}
      <div className="bg-[#0E172A] border border-[#1E2E4E] rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-amber-400" />
            <span>Excluded Applications ({installedApps.filter((a) => a.isExcludedFromMonitoring).length})</span>
          </h3>
        </div>

        <p className="text-xs text-slate-400">
          Messages and notifications from excluded applications are immediately ignored and never inspected.
        </p>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {installedApps.map((app) => (
            <div
              key={app.packageName}
              className="p-3 bg-[#121B2D] border border-[#1E2E4E] rounded-xl flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-slate-200">{app.appName}</div>
                <div className="text-[10px] text-slate-400 font-mono">{app.packageName}</div>
              </div>
              <button
                onClick={() => toggleAppExclusion(app.packageName)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  app.isExcludedFromMonitoring
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-[#1E2E4E] text-slate-300 hover:bg-[#2A3A5E]"
                }`}
              >
                {app.isExcludedFromMonitoring ? "Excluded" : "Monitored"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* App Information & Architecture */}
      <div className="bg-[#070B14] border border-[#1A2640] rounded-2xl p-4 text-center space-y-1">
        <p className="text-xs font-bold text-slate-300">Red Thread Security Engine • Version 1.0 MVP</p>
        <p className="text-[11px] text-slate-500">
          Architecture: Clean Architecture • On-Device Rule Engine • Optional Gemini 3.8 Flash • Android Keystore Protected
        </p>
      </div>

      {/* Delete All Modal Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-[#03060C]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0F172A] border border-[#1E2E4E] rounded-3xl p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Delete All Scan History?</h3>
              <p className="text-xs text-slate-400 mt-1">
                This action is irreversible and removes all locally stored analysis logs, alerts, and feedback records.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-[#141F36] text-slate-300 hover:bg-[#1E2E4E]"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-delete-all"
                onClick={() => {
                  deleteAllHistory();
                  setShowDeleteModal(false);
                }}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30"
              >
                Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from "react";
import {
  Shield,
  ShieldCheck,
  Lock,
  EyeOff,
  Bell,
  MessageSquare,
  Mail,
  Smartphone,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Sliders,
  Check,
  X,
} from "lucide-react";
import { useSecurity } from "../../context/SecurityContext";

export const OnboardingModal: React.FC = () => {
  const { showOnboarding, setShowOnboarding, consent, updateConsent, installedApps, toggleAppExclusion } =
    useSecurity();
  const [step, setStep] = useState<number>(1);

  if (!showOnboarding) return null;

  const handleFinish = () => {
    updateConsent("onboardingCompleted", true);
    setShowOnboarding(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#03060C]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0F172A] border border-[#1E2E4E] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Progress Indicators */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? "w-8 bg-gradient-to-r from-blue-500 to-cyan-400"
                    : s < step
                    ? "w-4 bg-blue-500/50"
                    : "w-4 bg-[#1E2E4E]"
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleFinish}
            className="text-xs text-slate-400 hover:text-slate-200 underline font-medium"
          >
            Skip to App
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto pr-1">
          {/* SCREEN 1: Welcome */}
          {step === 1 && (
            <div className="space-y-6 text-center py-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[2px] shadow-xl shadow-blue-500/20">
                <div className="w-full h-full bg-[#0B1120] rounded-[22px] flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-cyan-400" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">
                  Welcome to Red Thread
                </h2>
                <p className="text-sm font-semibold text-cyan-400 mt-1">
                  Privacy-first scam detection & personal security
                </p>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed max-w-sm mx-auto">
                  Red Thread helps you recognize scams, phishing links, and deceptive pressure tactics before you click, pay, or share sensitive information.
                </p>
              </div>

              {/* Guarantees */}
              <div className="bg-[#131D33] border border-[#1E2E4E] rounded-2xl p-4 text-left space-y-3">
                <div className="flex items-start gap-3">
                  <Lock className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div className="text-xs text-slate-300">
                    <strong className="text-slate-100">Zero Raw-Content Storage:</strong> Your private messages are analyzed locally or strictly redacted.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <EyeOff className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <div className="text-xs text-slate-300">
                    <strong className="text-slate-100">No Credential Access:</strong> Red Thread never asks for or stores passwords, PINs, OTPs, or CVVs.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: Permissions Explanation */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-100">Transparent Permissions</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Red Thread respects strict Android security boundaries. You decide which sources to protect.
                </p>
              </div>

              <div className="space-y-3">
                {/* Notification */}
                <div className="bg-[#131D33] border border-[#1E2E4E] rounded-2xl p-3.5 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Bell className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200">Notification Monitoring</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Detects scam previews in incoming alerts. Does NOT read existing chats.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={consent.notificationMonitoring}
                    onChange={(e) => updateConsent("notificationMonitoring", e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700"
                  />
                </div>

                {/* SMS */}
                <div className="bg-[#131D33] border border-[#1E2E4E] rounded-2xl p-3.5 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200">SMS Safety Filter</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Scans incoming bank alerts and delivery messages for phishing links and urgent fraud.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={consent.smsMonitoring}
                    onChange={(e) => updateConsent("smsMonitoring", e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700"
                  />
                </div>

                {/* App Audit */}
                <div className="bg-[#131D33] border border-[#1E2E4E] rounded-2xl p-3.5 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Smartphone className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200">Installed App Audit</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Inspects Android-visible permissions (Screen overlay, Accessibility) to protect banking apps.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Always On
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 3: Privacy Choices */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-100">Privacy & Processing</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Configure how your threat analyses are handled.
                </p>
              </div>

              {/* Cloud vs Local */}
              <div className="bg-[#131D33] border border-[#1E2E4E] rounded-2xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Allow Optional Cloud AI Analysis
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Uses Gemini 3.8 Flash for deep semantic threat categorization. All OTPs, PINs, and card numbers are stripped BEFORE sending. Disabled by default.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={consent.cloudLlmAnalysis}
                    onChange={(e) => updateConsent("cloudLlmAnalysis", e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700"
                  />
                </div>
                {!consent.cloudLlmAnalysis && (
                  <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Running 100% On-Device Rule Engine
                  </p>
                )}
              </div>

              {/* Data Retention */}
              <div className="bg-[#131D33] border border-[#1E2E4E] rounded-2xl p-4 space-y-2">
                <label className="text-xs font-bold text-slate-200 block">
                  Scan History Retention
                </label>
                <p className="text-[11px] text-slate-400">
                  Automatically wipes past scan logs from device storage after your chosen duration.
                </p>
                <select
                  value={consent.dataRetention}
                  onChange={(e) => updateConsent("dataRetention", e.target.value as any)}
                  className="w-full bg-[#0B1120] border border-[#1E2E4E] text-slate-200 text-xs rounded-xl p-2.5 outline-none focus:border-blue-500"
                >
                  <option value="NONE">Do Not Save Any History (Ephemeral)</option>
                  <option value="7_DAYS">Automatically Delete After 7 Days</option>
                  <option value="30_DAYS">Automatically Delete After 30 Days (Recommended)</option>
                  <option value="90_DAYS">Automatically Delete After 90 Days</option>
                  <option value="MANUAL">Keep Until Manually Cleared</option>
                </select>
              </div>
            </div>
          )}

          {/* SCREEN 4: App Exclusions */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-100">App Exclusions</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Excluded applications will never be intercepted, scanned, or analyzed by Red Thread.
                </p>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {installedApps.map((app) => (
                  <div
                    key={app.packageName}
                    className="bg-[#131D33] border border-[#1E2E4E] rounded-xl p-3 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{app.appName}</div>
                      <div className="text-[10px] text-slate-400">{app.category} • {app.packageName}</div>
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
          )}

          {/* SCREEN 5: Completion */}
          {step === 5 && (
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-100">You Are All Set!</h2>
                <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                  Red Thread is configured with your privacy preferences. You can reconfigure or pause protection at any time from Settings.
                </p>
              </div>

              <div className="bg-[#131D33] border border-[#1E2E4E] rounded-2xl p-4 text-left text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Notification Monitoring:</span>
                  <span className="font-semibold text-emerald-400">
                    {consent.notificationMonitoring ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>SMS Filter:</span>
                  <span className="font-semibold text-emerald-400">
                    {consent.smsMonitoring ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>AI Engine Mode:</span>
                  <span className="font-semibold text-cyan-400">
                    {consent.cloudLlmAnalysis ? "Cloud AI (Redacted)" : "On-Device Engine (Local)"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Retention:</span>
                  <span className="font-semibold text-slate-200">{consent.dataRetention}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="pt-4 border-t border-[#1E2E4E] flex items-center justify-between mt-2">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <span>Open Red Thread</span>
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

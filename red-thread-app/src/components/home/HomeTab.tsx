import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Link2,
  Smartphone,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Zap,
  Bell,
  MessageSquare,
  Mail,
  Shield,
  Clock,
  Play,
  CheckCircle2,
} from "lucide-react";
import { useSecurity } from "../../context/SecurityContext";
import { SAMPLE_SCENARIOS } from "../../data/sampleScams";

export const HomeTab: React.FC = () => {
  const {
    securityScore,
    consent,
    history,
    installedApps,
    setActiveTab,
    analyze,
    triggerSimulatedAlert,
  } = useSecurity();

  const [quickInput, setQuickInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  // Compute metrics
  const totalThreats = history.filter((h) => h.riskLevel === "HIGH").length;
  const totalSuspicious = history.filter((h) => h.riskLevel === "SUSPICIOUS").length;
  const suspiciousLinksCount = history.reduce(
    (acc, h) => acc + (h.urlFindings?.filter((u) => u.riskLevel !== "SAFE").length || 0),
    0
  );
  const highAttentionApps = installedApps.filter((a) => a.riskStatus === "HIGH_ATTENTION").length;

  const handleQuickAnalyze = async () => {
    if (!quickInput.trim()) return;
    setIsScanning(true);
    await analyze(quickInput, "MANUAL");
    setIsScanning(false);
    setQuickInput("");
    setActiveTab("scan");
  };

  const handleSampleSelect = async (content: string) => {
    setIsScanning(true);
    await analyze(content, "MANUAL");
    setIsScanning(false);
    setActiveTab("scan");
  };

  // Score color
  const scoreColor =
    securityScore >= 80
      ? "text-emerald-400 stroke-emerald-400"
      : securityScore >= 50
      ? "text-amber-400 stroke-amber-400"
      : "text-rose-400 stroke-rose-400";

  // Score gauge math
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (securityScore / 100) * circumference;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto pb-24">
      {/* Protection Status Banner */}
      <div
        className={`rounded-3xl p-5 border relative overflow-hidden transition-all duration-300 ${
          consent.protectionPaused
            ? "bg-amber-950/20 border-amber-500/30"
            : "bg-gradient-to-r from-[#101B30] to-[#0D1627] border-[#1E2E4E] shadow-xl"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                consent.protectionPaused
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
              }`}
            >
              {consent.protectionPaused ? (
                <ShieldAlert className="w-6 h-6" />
              ) : (
                <ShieldCheck className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">
                  {consent.protectionPaused ? "Protection Paused" : "Device Guard Active"}
                </h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    consent.protectionPaused
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {consent.protectionPaused ? "Paused" : "Real-time Monitoring"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {consent.protectionPaused
                  ? "Incoming notifications and SMS are not being inspected."
                  : "Notification listener, SMS filter, and app privacy engine running."}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("settings")}
            className="self-start sm:self-center text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-[#15233D] px-3 py-1.5 rounded-xl border border-[#23355A] hover:border-cyan-500/40 transition-colors"
          >
            <span>Configure</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Security Score & Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Security Score Card */}
        <div className="bg-[#0E172A] border border-[#1E2E4E] rounded-3xl p-5 flex items-center justify-between shadow-lg relative overflow-hidden">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
              Security Score
            </span>
            <div className="text-3xl font-extrabold text-slate-100 mt-1">
              {securityScore}
              <span className="text-sm font-normal text-slate-400">/100</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {securityScore >= 80 ? "Optimal Protection" : securityScore >= 50 ? "Caution Advised" : "High Exposure"}
            </p>
          </div>

          {/* SVG Progress Ring */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-[#1A2640]"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                className={`${scoreColor} transition-all duration-700 ease-out`}
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-slate-200">{securityScore}%</span>
            </div>
          </div>
        </div>

        {/* Threats & Links Card */}
        <div className="bg-[#0E172A] border border-[#1E2E4E] rounded-3xl p-5 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
              Threat Activity
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>

          <div className="grid grid-cols-2 gap-3 my-2">
            <div>
              <div className="text-2xl font-black text-rose-400">{totalThreats}</div>
              <div className="text-[11px] text-slate-400">High Risk Scams</div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-400">{suspiciousLinksCount}</div>
              <div className="text-[11px] text-slate-400">Suspicious Links</div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("alerts")}
            className="text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-between pt-2 border-t border-[#1A2640]"
          >
            <span>Review Alerts</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Installed App Audit Summary */}
        <div className="bg-[#0E172A] border border-[#1E2E4E] rounded-3xl p-5 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
              App Privacy Audit
            </span>
            <Smartphone className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-100">{installedApps.length}</span>
              <span className="text-xs text-slate-400">Apps Audited</span>
            </div>
            <div className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
              {highAttentionApps > 0 ? (
                <span className="text-rose-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                  {highAttentionApps} require attention
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All permissions verified
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab("audit")}
            className="text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-between pt-2 border-t border-[#1A2640]"
          >
            <span>Audit Permissions</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Quick Scan Input Widget */}
      <div className="bg-[#0E172A] border border-[#1E2E4E] rounded-3xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">Quick Scam & Link Scan</h3>
          </div>
          <span className="text-[11px] text-slate-400">Pasted text stays on device</span>
        </div>

        <div className="relative">
          <textarea
            id="input-quick-scan"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Paste suspicious SMS, WhatsApp message, payment collect request, or link..."
            rows={3}
            className="w-full bg-[#070B14] border border-[#1A2640] rounded-2xl p-3 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-500 transition-colors resize-none"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-500 font-medium">Try scenario:</span>
            {SAMPLE_SCENARIOS.slice(0, 3).map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => handleSampleSelect(scenario.content)}
                className="text-[11px] bg-[#141F36] hover:bg-[#1E2E4E] text-slate-300 hover:text-cyan-300 border border-[#23355A] px-2.5 py-1 rounded-lg transition-colors active:scale-95"
              >
                {scenario.categoryName}
              </button>
            ))}
          </div>

          <button
            id="btn-quick-analyze"
            onClick={handleQuickAnalyze}
            disabled={!quickInput.trim() || isScanning}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95 flex items-center gap-1.5 ml-auto"
          >
            {isScanning ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>Analyze Now</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Monitored Sources Status */}
      <div className="bg-[#0E172A] border border-[#1E2E4E] rounded-3xl p-5 shadow-lg space-y-3">
        <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
          Monitored Sources Status
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Notification */}
          <div className="bg-[#121B2D] border border-[#1E2E4E] rounded-2xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">Notifications</div>
              <div className="text-[10px] text-emerald-400 font-medium">
                {consent.notificationMonitoring ? "Active" : "Disabled"}
              </div>
            </div>
          </div>

          {/* SMS */}
          <div className="bg-[#121B2D] border border-[#1E2E4E] rounded-2xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">SMS Filter</div>
              <div className="text-[10px] text-emerald-400 font-medium">
                {consent.smsMonitoring ? "Active" : "Disabled"}
              </div>
            </div>
          </div>

          {/* Email OAuth */}
          <div className="bg-[#121B2D] border border-[#1E2E4E] rounded-2xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">Email OAuth</div>
              <div className="text-[10px] text-slate-400 font-medium">Read-Only</div>
            </div>
          </div>

          {/* Local / Cloud AI */}
          <div className="bg-[#121B2D] border border-[#1E2E4E] rounded-2xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">AI Engine</div>
              <div className="text-[10px] text-cyan-300 font-medium">
                {consent.cloudLlmAnalysis ? "Cloud (Redacted)" : "On-Device"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Alerts Feed Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-200">Recent Security Alerts</h3>
          </div>
          <button
            onClick={() => setActiveTab("alerts")}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View All ({history.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {history.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveTab("alerts")}
              className="bg-[#0E172A] hover:bg-[#121D35] border border-[#1E2E4E] rounded-2xl p-4 transition-all cursor-pointer flex items-start justify-between gap-3 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    item.riskLevel === "HIGH"
                      ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                      : item.riskLevel === "SUSPICIOUS"
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {item.riskLevel === "HIGH" ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : item.riskLevel === "SUSPICIOUS" ? (
                    <ShieldAlert className="w-4 h-4" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.riskLevel === "HIGH"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : item.riskLevel === "SUSPICIOUS"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {item.riskLevel}
                    </span>
                    <span className="text-xs font-semibold text-slate-200">
                      {item.category.replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      • {item.sourceType} ({item.sender || "Direct"})
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {item.originalContentSnippet}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-500 shrink-0 self-center" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

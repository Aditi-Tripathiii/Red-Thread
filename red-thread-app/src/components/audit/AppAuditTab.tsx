import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Smartphone,
  Layers,
  Lock,
  Eye,
  CheckCircle2,
  ExternalLink,
  ShieldOff,
  Search,
  Filter,
} from "lucide-react";
import { useSecurity } from "../../context/SecurityContext";
import { InstalledApp } from "../../types";
import { FinancialSecurityModal } from "./FinancialSecurityModal";

export const AppAuditTab: React.FC = () => {
  const {
    installedApps,
    toggleAppExclusion,
    selectedAppForSecurity,
    setSelectedAppForSecurity,
  } = useSecurity();

  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const totalAudited = installedApps.length;
  const highAttentionCount = installedApps.filter((a) => a.riskStatus === "HIGH_ATTENTION").length;
  const reviewRecommendedCount = installedApps.filter((a) => a.riskStatus === "REVIEW_RECOMMENDED").length;
  const financialCount = installedApps.filter((a) => a.category === "FINANCIAL").length;

  const filteredApps = installedApps.filter((app) => {
    if (categoryFilter !== "ALL" && app.category !== categoryFilter) return false;
    if (
      searchQuery &&
      !app.appName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !app.packageName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleMarkSecured = (appId: string) => {
    // Optional status update
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>Installed App & Privacy Audit</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Inspects Android-visible permissions (Screen Overlay, Accessibility, SMS) to safeguard UPI and mobile banking apps.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0E172A] border border-[#1E2E4E] rounded-2xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Audited Apps</div>
          <div className="text-2xl font-black text-slate-100 mt-1">{totalAudited}</div>
        </div>

        <div className="bg-[#0E172A] border border-[#1E2E4E] rounded-2xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">High Attention</div>
          <div className="text-2xl font-black text-rose-400 mt-1">{highAttentionCount}</div>
        </div>

        <div className="bg-[#0E172A] border border-[#1E2E4E] rounded-2xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Review Rec.</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{reviewRecommendedCount}</div>
        </div>

        <div className="bg-[#0E172A] border border-[#1E2E4E] rounded-2xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Financial Apps</div>
          <div className="text-2xl font-black text-cyan-400 mt-1">{financialCount}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#0E172A] border border-[#1E2E4E] rounded-3xl p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search installed applications by name or package ID..."
            className="w-full bg-[#070B14] border border-[#1A2640] rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {["ALL", "FINANCIAL", "UTILITY", "MESSAGING", "UNKNOWN"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-[11px] px-3 py-1 rounded-lg font-medium transition-all ${
                categoryFilter === cat
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-[#141F36] text-slate-400 hover:text-slate-200 border border-[#23355A]"
              }`}
            >
              {cat === "ALL" ? "All Apps" : cat.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Installed Apps Grid */}
      <div className="space-y-3">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            className={`bg-[#0E172A] border rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
              app.riskStatus === "HIGH_ATTENTION"
                ? "border-rose-500/40 shadow-rose-950/20"
                : app.riskStatus === "REVIEW_RECOMMENDED"
                ? "border-amber-500/40 shadow-amber-950/20"
                : "border-[#1E2E4E]"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 ${
                  app.riskStatus === "HIGH_ATTENTION"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    : app.category === "FINANCIAL"
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-[#141F36] text-slate-300 border border-[#23355A]"
                }`}
              >
                {app.appName.slice(0, 2).toUpperCase()}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-slate-100">{app.appName}</h3>
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      app.riskStatus === "HIGH_ATTENTION"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : app.riskStatus === "REVIEW_RECOMMENDED"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {app.riskStatus.replace(/_/g, " ")}
                  </span>

                  {app.installSource === "SIDELOADED_APK" && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-950/50 text-rose-300 border border-rose-800/40">
                      Sideloaded APK
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 font-mono">{app.packageName}</p>

                {/* Risky Permissions Badges */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1.5">
                  {app.riskyPermissions.overlayAccess && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 font-medium">
                      ⚠️ Screen Overlay (Risk of Keyjacking)
                    </span>
                  )}
                  {app.riskyPermissions.accessibilityAccess && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 font-medium">
                      🚨 Accessibility Service Granted
                    </span>
                  )}
                  {app.riskyPermissions.smsAccess && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium">
                      SMS Read Permission
                    </span>
                  )}
                  {!app.riskyPermissions.overlayAccess &&
                    !app.riskyPermissions.accessibilityAccess &&
                    !app.riskyPermissions.smsAccess && (
                      <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Safe Sandboxed Permissions
                      </span>
                    )}
                </div>
              </div>
            </div>

            {/* Actions for this App */}
            <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1A2640]">
              {app.category === "FINANCIAL" && (
                <button
                  id={`btn-secure-${app.id}`}
                  onClick={() => setSelectedAppForSecurity(app)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                >
                  Secure this App
                </button>
              )}

              <button
                onClick={() => toggleAppExclusion(app.packageName)}
                className={`text-[11px] px-3 py-1.5 rounded-xl border transition-colors flex items-center gap-1.5 ${
                  app.isExcludedFromMonitoring
                    ? "bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25"
                    : "bg-[#141F36] text-slate-400 hover:text-slate-200 border-[#23355A]"
                }`}
              >
                <ShieldOff className="w-3 h-3" />
                <span>{app.isExcludedFromMonitoring ? "Excluded" : "Exclude from Monitor"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Financial Security Modal */}
      {selectedAppForSecurity && (
        <FinancialSecurityModal
          app={selectedAppForSecurity}
          onClose={() => setSelectedAppForSecurity(null)}
          onMarkSecured={handleMarkSecured}
        />
      )}
    </div>
  );
};

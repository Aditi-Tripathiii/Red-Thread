import React, { useState } from "react";
import {
  BellRing,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Filter,
  Trash2,
  CheckCircle2,
  ExternalLink,
  ThumbsUp,
  Flag,
  Search,
  ChevronRight,
  Sparkles,
  Play,
  X,
  ShieldOff,
} from "lucide-react";
import { useSecurity } from "../../context/SecurityContext";
import { AnalysisRecord, RiskLevel, SourceType } from "../../types";
import { SAMPLE_SCENARIOS } from "../../data/sampleScams";

export const AlertsTab: React.FC = () => {
  const {
    history,
    deleteRecord,
    markAlertReviewed,
    reportFeedback,
    toggleAppExclusion,
    installedApps,
    triggerSimulatedAlert,
  } = useSecurity();

  const [riskFilter, setRiskFilter] = useState<RiskLevel | "ALL">("ALL");
  const [sourceFilter, setSourceFilter] = useState<SourceType | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlert, setSelectedAlert] = useState<AnalysisRecord | null>(null);
  const [showSimulatorDrawer, setShowSimulatorDrawer] = useState(false);

  // Filtered alerts
  const filteredAlerts = history.filter((item) => {
    if (riskFilter !== "ALL" && item.riskLevel !== riskFilter) return false;
    if (sourceFilter !== "ALL" && item.sourceType !== sourceFilter) return false;
    if (
      searchQuery &&
      !item.originalContentSnippet.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleSelectAlert = (alert: AnalysisRecord) => {
    setSelectedAlert(alert);
    if (!alert.reviewed) {
      markAlertReviewed(alert.id);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto pb-24">
      {/* Header & Simulator CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BellRing className="w-5 h-5 text-cyan-400" />
            <span>Live Security Alerts</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time feed of intercepted SMS, push notification previews, and manual scans.
          </p>
        </div>

        <button
          id="btn-open-simulator"
          onClick={() => setShowSimulatorDrawer(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600/30 to-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold hover:bg-cyan-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
          <span>Simulate Incoming Alert</span>
        </button>
      </div>

      {/* Simulator Drawer / Modal */}
      {showSimulatorDrawer && (
        <div className="bg-[#121B2D] border border-cyan-500/30 rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100">
                Simulate Intercepted Android Traffic
              </h3>
            </div>
            <button
              onClick={() => setShowSimulatorDrawer(false)}
              className="text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Pick a realistic scenario below to simulate how Red Thread intercepts and evaluates incoming content on Android without blocking phone functionality:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SAMPLE_SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  triggerSimulatedAlert(s.id);
                  setShowSimulatorDrawer(false);
                }}
                className="text-left bg-[#070B14] hover:bg-[#0E172A] border border-[#1E2E4E] hover:border-cyan-500/40 p-3 rounded-2xl transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">
                    {s.title}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      s.expectedRisk === "HIGH"
                        ? "bg-rose-500/20 text-rose-300"
                        : s.expectedRisk === "SUSPICIOUS"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {s.expectedRisk}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">{s.content}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-[#0E172A] border border-[#1E2E4E] rounded-3xl p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts by keyword, scam category, or sender..."
            className="w-full bg-[#070B14] border border-[#1A2640] rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Risk Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-500 font-semibold">Risk:</span>
            {(["ALL", "HIGH", "SUSPICIOUS", "SAFE"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                  riskFilter === r
                    ? "bg-blue-600 text-white font-bold"
                    : "bg-[#141F36] text-slate-400 hover:text-slate-200 border border-[#23355A]"
                }`}
              >
                {r === "ALL" ? "All Risks" : r}
              </button>
            ))}
          </div>

          {/* Source Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-500 font-semibold">Source:</span>
            {(["ALL", "SMS", "NOTIFICATION", "MANUAL", "EMAIL"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSourceFilter(s)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                  sourceFilter === s
                    ? "bg-cyan-600 text-white font-bold"
                    : "bg-[#141F36] text-slate-400 hover:text-slate-200 border border-[#23355A]"
                }`}
              >
                {s === "ALL" ? "All Sources" : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Feed List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-[#0E172A] border border-[#1E2E4E] rounded-3xl p-8 text-center space-y-2">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto opacity-70" />
            <h4 className="text-sm font-bold text-slate-200">No Alerts Found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No security alerts match your selected filters. Incoming monitored SMS and notifications will appear here in real time.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => handleSelectAlert(alert)}
              className={`bg-[#0E172A] hover:bg-[#121D35] border rounded-2xl p-4 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md ${
                !alert.reviewed
                  ? "border-rose-500/40 shadow-rose-950/20"
                  : "border-[#1E2E4E]"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    alert.riskLevel === "HIGH"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : alert.riskLevel === "SUSPICIOUS"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {alert.riskLevel === "HIGH" ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : alert.riskLevel === "SUSPICIOUS" ? (
                    <ShieldAlert className="w-5 h-5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        alert.riskLevel === "HIGH"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          : alert.riskLevel === "SUSPICIOUS"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      }`}
                    >
                      {alert.riskLevel}
                    </span>
                    <span className="text-xs font-bold text-slate-100">
                      {alert.category.replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      via {alert.sourceType} ({alert.sender || "Unknown"})
                    </span>
                    {!alert.reviewed && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                  </div>

                  <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                    {alert.originalContentSnippet}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                    <span>{new Date(alert.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    <span>• Urgency: <strong className="text-slate-200">{alert.urgency}</strong></span>
                    {alert.sentimentSignals.length > 0 && (
                      <span>• Signals: {alert.sentimentSignals.slice(0, 2).join(", ")}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteRecord(alert.id);
                  }}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Delete alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 bg-[#03060C]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0F172A] border border-[#1E2E4E] rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-[#1E2E4E]">
              <div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedAlert.riskLevel === "HIGH"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : selectedAlert.riskLevel === "SUSPICIOUS"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  {selectedAlert.riskLevel} RISK
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-1">
                  {selectedAlert.category.replace(/_/g, " ")}
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  Sender: {selectedAlert.sender} • Source: {selectedAlert.sourceType}
                </div>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content snippet */}
            <div className="bg-[#070B14] p-3 rounded-xl border border-[#1A2640] text-xs text-slate-200">
              <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">
                Captured Message
              </span>
              {selectedAlert.originalContentSnippet}
            </div>

            {/* Why flagged */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Why this was flagged:
              </h4>
              {selectedAlert.indicators.map((ind, i) => (
                <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{ind.description}</span>
                </div>
              ))}
            </div>

            {/* Recommended actions */}
            <div className="bg-[#121B2D] border border-[#1E2E4E] rounded-xl p-3.5 space-y-1.5">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                Recommended Action:
              </h4>
              {selectedAlert.recommendedActions.map((act, i) => (
                <p key={i} className="text-xs text-slate-200">
                  {i + 1}. {act}
                </p>
              ))}
            </div>

            {/* Exclusion action if package name available */}
            {selectedAlert.sourceAppPackage && (
              <div className="pt-2 border-t border-[#1E2E4E] flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Source: {selectedAlert.sourceAppName || selectedAlert.sourceAppPackage}
                </span>
                <button
                  onClick={() => {
                    if (selectedAlert.sourceAppPackage) {
                      toggleAppExclusion(selectedAlert.sourceAppPackage);
                    }
                  }}
                  className="text-xs px-2.5 py-1 rounded-lg bg-[#141F36] hover:bg-[#1E2E4E] text-amber-300 border border-amber-500/30 flex items-center gap-1"
                >
                  <ShieldOff className="w-3.5 h-3.5" />
                  <span>Exclude App From Future Scans</span>
                </button>
              </div>
            )}

            {/* Feedback footer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#1E2E4E]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => reportFeedback(selectedAlert.id, "NOT_A_SCAM")}
                  className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <Flag className="w-3 h-3" />
                  <span>Report False Positive</span>
                </button>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

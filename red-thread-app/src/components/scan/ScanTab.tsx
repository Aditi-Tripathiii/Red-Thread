import React, { useState } from "react";
import {
  ScanSearch,
  Link2,
  Image as ImageIcon,
  FileText,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Cpu,
  Trash2,
  ThumbsUp,
  Flag,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Copy,
  Check,
} from "lucide-react";
import { useSecurity } from "../../context/SecurityContext";
import { AnalysisRecord, SourceType } from "../../types";
import { redactSensitiveData } from "../../utils/redaction";
import { SAMPLE_SCENARIOS } from "../../data/sampleScams";

export const ScanTab: React.FC = () => {
  const { analyze, consent, deleteRecord, reportFeedback } = useSecurity();

  const [inputMode, setInputMode] = useState<"TEXT" | "URL" | "SCREENSHOT">("TEXT");
  const [content, setContent] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [sourceType, setSourceType] = useState<SourceType>("MANUAL");
  const [forceCloud, setForceCloud] = useState(consent.cloudLlmAnalysis);
  const [showRedactionPreview, setShowRedactionPreview] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisRecord | null>(null);
  const [copied, setCopied] = useState(false);

  // Redaction computation for preview
  const activeText = inputMode === "URL" ? urlInput : content;
  const redactionInfo = redactSensitiveData(activeText);

  const handleAnalyze = async () => {
    const textToAnalyze = inputMode === "URL" ? urlInput.trim() : content.trim();
    if (!textToAnalyze) return;

    setIsScanning(true);
    const result = await analyze(textToAnalyze, sourceType, "Manual Scan", forceCloud);
    setIsScanning(false);
    setCurrentResult(result);
  };

  const handleSelectSample = (sampleContent: string, type: SourceType = "MANUAL") => {
    setContent(sampleContent);
    setSourceType(type);
    setInputMode("TEXT");
  };

  const handleScreenshotSample = (title: string, sampleText: string) => {
    setContent(sampleText);
    setSourceType("SCREENSHOT");
    setInputMode("TEXT");
  };

  const handleCopyRedacted = () => {
    navigator.clipboard.writeText(redactionInfo.redactedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setContent("");
    setUrlInput("");
    setCurrentResult(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto pb-24">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <ScanSearch className="w-5 h-5 text-cyan-400" />
          <span>Threat Scanner</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Inspect suspicious messages, urgent payment requests, links, and screenshots before acting.
        </p>
      </div>

      {/* Input Mode Tabs */}
      <div className="flex bg-[#0E172A] p-1 rounded-2xl border border-[#1E2E4E]">
        <button
          onClick={() => setInputMode("TEXT")}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            inputMode === "TEXT"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Message Text</span>
        </button>

        <button
          onClick={() => setInputMode("URL")}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            inputMode === "URL"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>Direct URL</span>
        </button>

        <button
          onClick={() => setInputMode("SCREENSHOT")}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            inputMode === "SCREENSHOT"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Screenshot OCR</span>
        </button>
      </div>

      {/* Input Box Card */}
      <div className="bg-[#0E172A] border border-[#1E2E4E] rounded-3xl p-5 shadow-xl space-y-4">
        {inputMode === "TEXT" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">Message Content</label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">Source:</span>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value as any)}
                  className="bg-[#070B14] border border-[#1E2E4E] text-slate-300 text-[11px] rounded-lg px-2 py-0.5 outline-none"
                >
                  <option value="MANUAL">Manual Input</option>
                  <option value="SMS">SMS Message</option>
                  <option value="NOTIFICATION">Push Notification</option>
                  <option value="EMAIL">Email</option>
                </select>
              </div>
            </div>

            <textarea
              id="input-scan-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste the full suspicious message here (e.g., 'SBI Account suspended...')"
              rows={4}
              className="w-full bg-[#070B14] border border-[#1A2640] rounded-2xl p-3.5 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        )}

        {inputMode === "URL" && (
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300">Target Web Link or Domain</label>
            <input
              type="text"
              id="input-scan-url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g., http://sbi-kyc-update.xyz/login or bit.ly/delivery-fee"
              className="w-full bg-[#070B14] border border-[#1A2640] rounded-2xl px-3.5 py-3 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-500 transition-colors"
            />
            <p className="text-[11px] text-slate-400">
              Red Thread normalizes, detects URL shorteners, punycode, and deceptive bank homoglyphs without opening the link.
            </p>
          </div>
        )}

        {inputMode === "SCREENSHOT" && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-[#1E2E4E] rounded-2xl p-6 text-center hover:border-cyan-500/50 transition-colors cursor-pointer bg-[#070B14]">
              <ImageIcon className="w-8 h-8 text-cyan-400 mx-auto mb-2 opacity-80" />
              <div className="text-xs font-semibold text-slate-200">Import or Drop Screenshot</div>
              <p className="text-[11px] text-slate-400 mt-1">
                Supports PNG, JPG, or Android screen captures
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    // Simulates fast on-device OCR extraction
                    setContent(SAMPLE_SCENARIOS[0].content);
                    setSourceType("SCREENSHOT");
                    setInputMode("TEXT");
                  }
                }}
                className="mt-3 text-xs text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
              />
            </div>

            <div>
              <span className="text-[11px] text-slate-400 font-medium">Or test with sample screenshot capture:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() =>
                    handleScreenshotSample(
                      "Fake SBI KYC Alert",
                      SAMPLE_SCENARIOS[0].content
                    )
                  }
                  className="text-left bg-[#121B2D] border border-[#1E2E4E] hover:border-cyan-500/40 p-2.5 rounded-xl text-xs text-slate-200"
                >
                  <div className="font-semibold text-cyan-400">SBI KYC Suspension SMS</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    "Dear SBI User, your account will be BLOCKED..."
                  </div>
                </button>

                <button
                  onClick={() =>
                    handleScreenshotSample(
                      "Electricity Bill Scam",
                      SAMPLE_SCENARIOS[1].content
                    )
                  }
                  className="text-left bg-[#121B2D] border border-[#1E2E4E] hover:border-cyan-500/40 p-2.5 rounded-xl text-xs text-slate-200"
                >
                  <div className="font-semibold text-amber-400">Electricity Cutoff Alert</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    "Power will be DISCONNECTED tonight at 9:30 PM..."
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sensitive Data Redaction Accordion */}
        {activeText.trim() && (
          <div className="bg-[#121B2D] border border-[#1E2E4E] rounded-2xl p-3.5 space-y-2">
            <button
              onClick={() => setShowRedactionPreview(!showRedactionPreview)}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-300"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Privacy & Redaction Guard</span>
                {redactionInfo.redactedItems.length > 0 && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                    {redactionInfo.redactedItems.length} sensitive item(s) masked
                  </span>
                )}
              </div>
              {showRedactionPreview ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showRedactionPreview && (
              <div className="pt-2 border-t border-[#1E2E4E] space-y-2 text-[11px]">
                <p className="text-slate-400">
                  OTPs, PINs, bank accounts, and card numbers are filtered locally before reaching analysis pipelines.
                </p>
                <div className="bg-[#070B14] p-2.5 rounded-xl border border-[#1A2640] font-mono text-slate-300 break-all relative">
                  {redactionInfo.redactedText}
                  <button
                    onClick={handleCopyRedacted}
                    className="absolute top-2 right-2 p-1 bg-[#1E2E4E] hover:bg-[#2A3A5E] rounded text-slate-300"
                    title="Copy sanitized text"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Engine Toggle & Action Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Engine Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setForceCloud(!forceCloud)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all ${
                forceCloud
                  ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                  : "bg-[#141F36] text-slate-300 border-[#23355A]"
              }`}
            >
              {forceCloud ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Cloud AI (Gemini 3.8)</span>
                </>
              ) : (
                <>
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span>On-Device Engine (Local)</span>
                </>
              )}
            </button>
            <span className="text-[10px] text-slate-500">
              {forceCloud ? "Redacted cloud call" : "Zero network egress"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              Clear
            </button>

            <button
              id="btn-run-analysis"
              onClick={handleAnalyze}
              disabled={!activeText.trim() || isScanning}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing Threat...</span>
                </>
              ) : (
                <>
                  <ScanSearch className="w-4 h-4" />
                  <span>Scan Content</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* RISK DETAIL VIEW (PRD Section 8.6) */}
      {currentResult && (
        <div className="bg-[#0E172A] border border-[#1E2E4E] rounded-3xl p-6 shadow-2xl space-y-6 animate-in fade-in duration-300">
          {/* Top Risk Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2E4E]">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  currentResult.riskLevel === "HIGH"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    : currentResult.riskLevel === "SUSPICIOUS"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                }`}
              >
                {currentResult.riskLevel === "HIGH" ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : currentResult.riskLevel === "SUSPICIOUS" ? (
                  <ShieldAlert className="w-6 h-6" />
                ) : (
                  <ShieldCheck className="w-6 h-6" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-xs font-black tracking-wide px-2.5 py-0.5 rounded-full ${
                      currentResult.riskLevel === "HIGH"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : currentResult.riskLevel === "SUSPICIOUS"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    }`}
                  >
                    {currentResult.riskLevel.replace(/_/g, " ")} RISK
                  </span>
                  <span className="text-xs font-bold text-slate-200">
                    {currentResult.category.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] font-semibold text-rose-400 bg-rose-950/30 px-2 py-0.5 rounded border border-rose-800/30">
                    Urgency: {currentResult.urgency}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Confidence: {Math.round(currentResult.confidence * 100)}% • Analyzed via {currentResult.modelVersion}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => {
                  deleteRecord(currentResult.id);
                  setCurrentResult(null);
                }}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                title="Delete this analysis"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sentiment Signals */}
          {currentResult.sentimentSignals.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Detected Sentiment Triggers
              </span>
              <div className="flex flex-wrap gap-2">
                {currentResult.sentimentSignals.map((signal) => (
                  <span
                    key={signal}
                    className="text-xs px-2.5 py-1 rounded-lg bg-[#141F36] text-cyan-300 border border-[#23355A] font-medium"
                  >
                    ⚡ {signal}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Why this was flagged (Indicators) */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Why this was flagged:
            </h4>
            <div className="space-y-2">
              {currentResult.indicators.map((ind, i) => (
                <div
                  key={i}
                  className="bg-[#121B2D] border border-[#1E2E4E] rounded-xl p-3 flex items-start gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-slate-200">
                      {ind.type.replace(/_/g, " ")}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {ind.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suspicious URLs findings */}
          {currentResult.urlFindings && currentResult.urlFindings.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Embedded URL Safety Inspection:
              </h4>
              <div className="space-y-2">
                {currentResult.urlFindings.map((u, i) => (
                  <div
                    key={i}
                    className="bg-[#121B2D] border border-[#1E2E4E] rounded-xl p-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-cyan-400 truncate max-w-sm">
                        {u.normalizedUrl}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          u.riskLevel === "HIGH"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : u.riskLevel === "SUSPICIOUS"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {u.riskLevel}
                      </span>
                    </div>
                    {u.flags.map((flag, fi) => (
                      <p key={fi} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{flag}</span>
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Actions */}
          <div className="bg-[#121B2D] border border-blue-500/30 rounded-2xl p-4 space-y-2.5">
            <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Recommended Safe Actions:</span>
            </h4>
            <ol className="space-y-1.5 text-xs text-slate-200 list-decimal list-inside leading-relaxed">
              {currentResult.recommendedActions.map((act, i) => (
                <li key={i}>{act}</li>
              ))}
            </ol>
          </div>

          {/* False Positive & Feedback */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1E2E4E]">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Is this result accurate?</span>
              <button
                onClick={() => reportFeedback(currentResult.id, "HELPFUL")}
                className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-colors ${
                  currentResult.feedback === "HELPFUL"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-[#141F36] text-slate-300 border-[#23355A] hover:bg-[#1E2E4E]"
                }`}
              >
                <ThumbsUp className="w-3 h-3" />
                <span>Accurate</span>
              </button>
              <button
                onClick={() => reportFeedback(currentResult.id, "NOT_A_SCAM")}
                className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-colors ${
                  currentResult.feedback === "NOT_A_SCAM"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-[#141F36] text-slate-300 border-[#23355A] hover:bg-[#1E2E4E]"
                }`}
              >
                <Flag className="w-3 h-3" />
                <span>Not a Scam (False Positive)</span>
              </button>
            </div>

            <button
              onClick={() => setCurrentResult(null)}
              className="text-xs text-slate-400 hover:text-slate-200 underline"
            >
              Close Detail
            </button>
          </div>

          {/* Mandatory Responsible AI Disclaimer */}
          <div className="text-[11px] text-slate-500 italic bg-[#070B14] p-3 rounded-xl border border-[#1A2640] text-center">
            ⚠️ Automated analysis can be incorrect. Verify important requests independently through official bank helplines or in-person visits.
          </div>
        </div>
      )}
    </div>
  );
};

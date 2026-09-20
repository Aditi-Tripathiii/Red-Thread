import React, { useState } from 'react';
import {
  MessageSquare,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Send,
  Search,
  Filter,
  Sparkles,
  ExternalLink,
  Ban,
  CheckCircle,
  Copy,
  Clock,
  Zap,
} from 'lucide-react';
import type { ScannedMessage, PlatformType, UrgencyLevel } from '../types/security';
import { soundAlert } from '../services/soundAlert';

interface MessagesViewProps {
  messages: ScannedMessage[];
  onAddMessage: (msg: ScannedMessage) => void;
  onQuarantineMessage: (id: string) => void;
  onAllowMessage: (id: string) => void;
}

const presetTestMessages = [
  {
    title: 'Chase Bank Smishing Wire Alert',
    sender: '+1 (844) 932-1084',
    platform: 'SMS' as PlatformType,
    text: 'CHASE-ALERT: We noticed an unauthorized wire of $2,450.00 from your checking. If this was not you, verify identity IMMEDIATELY at https://chase-auth-security-lock.xyz/cancel or your debit card will be permanently frozen.',
  },
  {
    title: 'USPS Customs Redelivery Lure',
    sender: 'security@usps-tracking-dept.com',
    platform: 'Gmail' as PlatformType,
    text: 'Important: Your USPS parcel #US98421094 has a mismatched address. Delivery suspended until $1.85 redelivery customs fee is settled. Update billing address here: https://usps-redelivery-claim.top/track',
  },
  {
    title: 'SBI YONO KYC Suspension SMS',
    sender: 'VM-SBIINB',
    platform: 'SMS' as PlatformType,
    text: 'Dear SBI Customer, your YONO NetBanking account has been blocked today due to pending KYC documents update. Immediately submit your Aadhaar and PAN at https://sbi-yono-kyc-verify.club to reactivate within 24 hours.',
  },
  {
    title: 'Crypto Airdrop Drainer',
    sender: '@CryptoAlpha_Bot',
    platform: 'Telegram' as PlatformType,
    text: '🎉 CONGRATULATIONS! Your wallet was selected for the $5,000 USDT Community AirDrop! Connect your web3 wallet and sign the gasless claim contract within 30 minutes: https://uniswap-airdrop-reward.click/connect',
  },
  {
    title: 'Doctor Appointment Reminder (Safe)',
    sender: 'St. Jude Dental',
    platform: 'SMS' as PlatformType,
    text: 'Reminder: You have an upcoming dental consultation on Monday, Sept 22 at 10:30 AM. Reply 1 to confirm or call 555-0192 to reschedule.',
  },
];

export const MessagesView: React.FC<MessagesViewProps> = ({
  messages,
  onAddMessage,
  onQuarantineMessage,
  onAllowMessage,
}) => {
  const [platform, setPlatform] = useState<PlatformType>('SMS');
  const [sender, setSender] = useState('');
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ScannedMessage | null>(null);

  const handleApplyPreset = (preset: typeof presetTestMessages[0]) => {
    setPlatform(preset.platform);
    setSender(preset.sender);
    setContent(preset.text);
    setAnalysisResult(null);
  };

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/analyze-threat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: content,
          sender: sender.trim() || 'Unknown Sender',
          platform,
        }),
      });

      const data = await res.json();
      setAnalysisResult(data);

      if (data.isFraudulent) {
        soundAlert.playCriticalAlert();
      } else {
        soundAlert.playScanPing();
      }

      // Automatically add to scanned messages repository
      const newMessage: ScannedMessage = {
        id: `msg-${Date.now()}`,
        sender: sender.trim() || 'Incoming Message',
        platform,
        timestamp: new Date().toISOString(),
        content: content.trim(),
        sentiment: data.sentiment || 'Polite/Neutral',
        urgency: (data.urgency as UrgencyLevel) || 'LOW',
        threatType: data.threatType || (data.isFraudulent ? 'Smishing / Scam' : 'Safe / Legitimate'),
        isFraudulent: Boolean(data.isFraudulent),
        riskScore: data.riskScore ?? (data.isFraudulent ? 85 : 10),
        confidence: data.confidence ?? 0.9,
        suspiciousElements: data.suspiciousElements || [],
        extractedUrls: data.extractedUrls || [],
        analysis: data.analysis || 'Automated inspection complete.',
        recommendedAction: data.recommendedAction || (data.isFraudulent ? 'Block & Quarantine' : 'Allow & Mark Safe'),
        status: data.isFraudulent ? 'QUARANTINED' : 'ALLOWED',
      };

      onAddMessage(newMessage);
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesFilter =
      activeFilter === 'ALL' ||
      (activeFilter === 'FRAUD' && m.isFraudulent) ||
      (activeFilter === 'CRITICAL' && m.urgency === 'CRITICAL') ||
      (activeFilter === 'SAFE' && !m.isFraudulent);

    const matchesSearch =
      !searchQuery ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.threatType.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            AI Message & Email Threat Analyzer
          </h2>
          <p className="text-xs text-slate-400">
            Automated sentiment analysis, urgency prioritization, and zero-day smishing detection
          </p>
        </div>
      </div>

      {/* End-to-End Encryption Privacy Guarantee Banner */}
      <div className="px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="text-xs text-slate-300">
          <span className="font-semibold text-emerald-400">Privacy &amp; End-to-End Encryption Compliance: </span>
          WhatsApp and encrypted messenger chats remain strictly confidential with zero packet inspection. RED THREAD analyzes unencrypted SMS carrier traffic, inbound email vectors, and suspicious web payloads.
        </div>
      </div>

      {/* Interactive Live Message Inspector Form */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Live Sentiment & Urgency Threat Inspector
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Powered by Gemini AI & Aegis Heuristics
          </span>
        </div>

        {/* Presets Bar */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-medium text-slate-400">Try Pre-Loaded Threat Scenarios:</span>
          <div className="flex flex-wrap gap-1.5">
            {presetTestMessages.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                id={`btn-preset-msg-${idx}`}
                onClick={() => handleApplyPreset(preset)}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-800 transition-colors"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleRunAnalysis} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Platform Selector */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Channel / Platform</label>
              <select
                id="select-message-platform"
                value={platform}
                onChange={e => setPlatform(e.target.value as PlatformType)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="SMS">SMS Message (Carrier Network)</option>
                <option value="Telegram">Telegram</option>
                <option value="Gmail">Gmail</option>
                <option value="Outlook">Outlook</option>
                <option value="Messenger">Facebook Messenger</option>
              </select>
            </div>

            {/* Sender */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Sender Address / Phone Number</label>
              <input
                id="input-message-sender"
                type="text"
                value={sender}
                onChange={e => setSender(e.target.value)}
                placeholder="e.g. +1 (844) 932-1084 or security@chase.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Message Content */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Message Text or Email Body</label>
            <textarea
              id="input-message-content"
              rows={3}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Paste or type personal message content to test for manipulation, false urgency, or smishing payloads..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none font-sans"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">
              Evaluates emotional sentiment, urgency rank, and fraud patterns.
            </span>
            <button
              id="btn-analyze-message-submit"
              type="submit"
              disabled={isAnalyzing || !content.trim()}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-950/50"
            >
              {isAnalyzing ? (
                <>
                  <Zap className="w-3.5 h-3.5 animate-spin" />
                  Analyzing Sentiment & Threat...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Analyze Threat Now
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Analysis Output Card */}
        {analysisResult && (
          <div
            className={`mt-4 p-4 rounded-xl border transition-all ${
              analysisResult.isFraudulent
                ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {analysisResult.isFraudulent ? (
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                )}
                <div>
                  <span className="font-bold text-sm text-slate-100">
                    {analysisResult.threatType}
                  </span>
                  <span className="text-xs text-slate-400 ml-2">
                    (Engine: {analysisResult.engine || 'Aegis Sentinel'})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  Risk Score: {analysisResult.riskScore}/100
                </span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded uppercase ${
                    analysisResult.urgency === 'CRITICAL'
                      ? 'bg-rose-600 text-white'
                      : analysisResult.urgency === 'HIGH'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-700 text-slate-200'
                  }`}
                >
                  Urgency: {analysisResult.urgency}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="text-slate-400 font-medium">Sentiment Analysis:</div>
                <div className="text-slate-200 font-semibold">{analysisResult.sentiment}</div>
              </div>

              <div className="space-y-1">
                <div className="text-slate-400 font-medium">Recommended Defense:</div>
                <div className="text-emerald-400 font-semibold">{analysisResult.recommendedAction}</div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/80 text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-slate-200">Tactical Assessment: </span>
              {analysisResult.analysis}
            </div>

            {analysisResult.suspiciousElements && analysisResult.suspiciousElements.length > 0 && (
              <div className="mt-2 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Identified Risk Markers:</span>
                <ul className="list-disc list-inside text-xs text-rose-300/90 space-y-0.5">
                  {analysisResult.suspiciousElements.map((el: string, idx: number) => (
                    <li key={idx}>{el}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scanned Messages List */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Scanned Personal Messages & Emails ({filteredMessages.length})
            </h3>
            <p className="text-xs text-slate-400">
              Continuous monitoring across SMS carrier network, email gateways, and incoming messages
            </p>
          </div>

          {/* Filter & Search */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-search-messages"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              id="select-message-filter"
              value={activeFilter}
              onChange={e => setActiveFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Messages</option>
              <option value="FRAUD">Fraudulent Only</option>
              <option value="CRITICAL">Critical Urgency</option>
              <option value="SAFE">Verified Safe</option>
            </select>
          </div>
        </div>

        {/* Message Cards */}
        <div className="space-y-3">
          {filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No messages found matching query.
            </div>
          ) : (
            filteredMessages.map(msg => {
              const isCrit = msg.urgency === 'CRITICAL';
              const isHigh = msg.urgency === 'HIGH';

              return (
                <div
                  key={msg.id}
                  className={`p-4 rounded-xl border transition-all ${
                    msg.isFraudulent
                      ? 'bg-slate-950/70 border-rose-900/40 hover:border-rose-700/60'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-slate-200">{msg.sender}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                        {msg.platform}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          isCrit
                            ? 'bg-rose-900 text-rose-200 border border-rose-700'
                            : isHigh
                            ? 'bg-amber-900 text-amber-200 border border-amber-700'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        Urgency: {msg.urgency}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                        Sentiment: {msg.sentiment}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono">
                      {msg.isFraudulent ? (
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                          {msg.threatType}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                          Verified Safe
                        </span>
                      )}
                      <span className="text-slate-500 text-[11px]">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Message Content Body */}
                  <p className="text-xs text-slate-300 font-mono bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 leading-relaxed break-words">
                    {msg.content}
                  </p>

                  {/* Threat assessment and action controls */}
                  <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="text-slate-400 text-[11px]">
                      <span className="font-semibold text-slate-300">Action: </span>
                      {msg.recommendedAction}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {msg.status === 'QUARANTINED' ? (
                        <span className="text-[11px] font-mono text-rose-400 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20">
                          Quarantined in Shield
                        </span>
                      ) : (
                        <button
                          id={`btn-quarantine-${msg.id}`}
                          onClick={() => onQuarantineMessage(msg.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-[11px] font-medium flex items-center gap-1 transition-colors"
                        >
                          <Ban className="w-3 h-3" />
                          Block & Quarantine
                        </button>
                      )}

                      <button
                        id={`btn-allow-${msg.id}`}
                        onClick={() => onAllowMessage(msg.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1 transition-colors"
                      >
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        Mark Safe
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

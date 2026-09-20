import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  RefreshCw,
  Search,
  Filter,
  Activity,
  Zap,
  PhoneForwarded,
  EyeOff,
  QrCode,
  Ban,
  PhoneCall,
  Globe,
  Radio,
} from 'lucide-react';
import type {
  ScannedMessage,
  LinkThreat,
  CallLog,
  SocialMediaApp,
  ThreatEvent,
  UpiPaymentPayload,
} from '../types/security';

interface DashboardViewProps {
  messages: ScannedMessage[];
  links: LinkThreat[];
  calls: CallLog[];
  apps: SocialMediaApp[];
  events: ThreatEvent[];
  upiScans: UpiPaymentPayload[];
  onNavigate: (tab: any) => void;
  onSimulateThreatScan: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  messages,
  links,
  calls,
  apps,
  events,
  upiScans,
  onNavigate,
  onSimulateThreatScan,
}) => {
  const [eventFilter, setEventFilter] = React.useState<string>('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');

  const fraudulentMessagesCount = messages.filter(m => m.isFraudulent).length;
  const blockedLinksCount = links.filter(l => !l.isSafe).length;
  const scamCallsCount = calls.filter(c => c.riskScore > 60).length;
  const leakingAppsCount = apps.filter(a => a.unauthorizedAccessDetected).length;
  const upiScamsCount = upiScans.filter(u => u.isScam).length;

  const blockedCallsCount = calls.filter(c => c.flaggedStatus === 'Blacklisted').length;
  const blockedMsgCount = messages.filter(m => m.status === 'QUARANTINED').length;
  const blockedLnkCount = links.filter(l => l.status === 'BLOCKED').length;
  const totalBlockedCount = blockedCallsCount + blockedMsgCount + blockedLnkCount + upiScamsCount;

  const healthScore = Math.max(78, 100 - (fraudulentMessagesCount > 5 ? 8 : 3) - (upiScamsCount > 2 ? 6 : 2));

  const filteredEvents = events.filter(evt => {
    const matchesFilter =
      eventFilter === 'ALL' ||
      (eventFilter === 'CRITICAL' && evt.severity === 'CRITICAL') ||
      (eventFilter === 'HIGH' && evt.severity === 'HIGH') ||
      (eventFilter === 'WARNING' && (evt.severity === 'HIGH' || evt.severity === 'MEDIUM'));
    const matchesSearch =
      !searchQuery ||
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Threat & Health Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Security Health Score Card */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-gradient-to-br from-red-950/70 via-slate-900 to-slate-950 border border-red-500/40 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                BHARAT CYBER SHIELD ACTIVE
              </div>
              <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
                Cyber Defense Posture: {healthScore}%
              </h2>
              <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                Protecting against Indian Digital Arrest schemes, Electricity Bill cutoff SMS, YONO KYC phishing, and fraudulent UPI payment QRs.
              </p>
            </div>

            {/* Health Radial / Metric */}
            <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-xl border border-red-500/30">
              <div className="w-16 h-16 rounded-full border-4 border-red-500/40 border-t-red-400 flex items-center justify-center">
                <span className="text-xl font-mono font-bold text-red-400">{healthScore}</span>
              </div>
              <div className="text-left">
                <div className="text-[11px] text-slate-400 font-mono">1930 Ready</div>
                <div className="text-sm font-semibold text-red-300">Active Shield</div>
                <div className="text-[11px] text-emerald-400 font-mono">Zero Leaks</div>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Pills */}
          <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
            <button
              id="btn-quick-verify-qr"
              onClick={() => onNavigate('qr_checker')}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-950/50 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              Scan &amp; Check Payment QR
            </button>

            <button
              id="btn-quick-view-blocked"
              onClick={() => onNavigate('blocked_items')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Ban className="w-3.5 h-3.5 text-rose-400" />
              View Blocked Items ({totalBlockedCount})
            </button>

            <button
              id="btn-quick-scan-msg"
              onClick={() => onNavigate('messages')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Analyze SMS Messages
            </button>

            <button
              id="btn-quick-scan-link"
              onClick={() => onNavigate('links')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
              Phishing Link Guard
            </button>

            <button
              id="btn-quick-scan-threats"
              onClick={onSimulateThreatScan}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              Simulate Full Defense Scan
            </button>
          </div>
        </div>

        {/* Protection Module Status Overview */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              Active Cyber Shields
            </h3>
            <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              5/5 ENGAGED
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div
              onClick={() => onNavigate('qr_checker')}
              className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-red-500/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                <span className="text-slate-300">UPI Payment QR Fraud Checker</span>
              </div>
              <span className="text-red-400 font-mono text-[11px] font-bold">Active Shield</span>
            </div>

            <div
              onClick={() => onNavigate('messages')}
              className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-amber-500/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300">SMS Carrier Smishing Heuristics</span>
              </div>
              <span className="text-emerald-400 font-mono text-[11px]">Real-time Hook</span>
            </div>

            <div
              onClick={() => onNavigate('calls')}
              className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300">Scam Call &amp; Digital Arrest Blocker</span>
              </div>
              <span className="text-emerald-400 font-mono text-[11px]">Auto-Drop</span>
            </div>

            <div
              onClick={() => onNavigate('links')}
              className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-rose-500/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300">Bank Phishing Domain DNS Quarantine</span>
              </div>
              <span className="text-emerald-400 font-mono text-[11px]">Zero-Day DNS</span>
            </div>

            <div
              onClick={() => onNavigate('apps')}
              className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-indigo-500/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300">Social Apps (LinkedIn, Truecaller, IG)</span>
              </div>
              <span className="text-amber-400 font-mono text-[11px]">{leakingAppsCount} Flagged</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Threat Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* UPI QR Fraud */}
        <div
          id="card-metric-upi-qr"
          onClick={() => onNavigate('qr_checker')}
          className="p-3.5 rounded-xl bg-slate-900 border border-red-500/40 hover:border-red-500 cursor-pointer transition-all shadow-md shadow-red-950/20"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-semibold text-red-300">UPI QR Scams</span>
            <QrCode className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">{upiScamsCount}</div>
          <div className="text-[10px] text-red-400 mt-1">
            Reverse-charge trapped
          </div>
        </div>

        {/* Smishing */}
        <div
          id="card-metric-smishing"
          onClick={() => onNavigate('messages')}
          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Scam Messages</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">{fraudulentMessagesCount}</div>
          <div className="text-[10px] text-amber-400 mt-1">
            YONO &amp; Power alerts
          </div>
        </div>

        {/* Phishing Links */}
        <div
          id="card-metric-links"
          onClick={() => onNavigate('links')}
          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Phishing URLs</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">{blockedLinksCount}</div>
          <div className="text-[10px] text-rose-400 mt-1">
            Zero-day isolation
          </div>
        </div>

        {/* Scam Calls */}
        <div
          id="card-metric-calls"
          onClick={() => onNavigate('calls')}
          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Scam Calls</span>
            <PhoneForwarded className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">{scamCallsCount}</div>
          <div className="text-[10px] text-cyan-400 mt-1">
            Digital Arrest auto-drop
          </div>
        </div>

        {/* Blocked Items */}
        <div
          id="card-metric-blocked-items"
          onClick={() => onNavigate('blocked_items')}
          className="p-3.5 rounded-xl bg-slate-900 border border-rose-500/40 hover:border-rose-500 cursor-pointer transition-all shadow-md shadow-rose-950/20 col-span-2 md:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-bold text-rose-300">Blocked Items</span>
            <Ban className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 font-mono">{totalBlockedCount}</div>
          <div className="text-[10px] text-rose-300 mt-1">
            Click to manage blocklist
          </div>
        </div>
      </div>

      {/* Real-time Threat Intelligence Event Stream */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-400" />
              Live Cyber Event Telemetry
            </h3>
            <p className="text-xs text-slate-400">
              Correlated audit log of prevented scams, intercepted calls, and blocked domains
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-search-events"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <select
              id="select-event-filter"
              value={eventFilter}
              onChange={e => setEventFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-red-500"
            >
              <option value="ALL">All Events</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Severity</option>
              <option value="WARNING">Warnings</option>
            </select>
          </div>
        </div>

        {/* Events Table / Stream */}
        <div className="divide-y divide-slate-800/80 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">No threat events matching filter.</div>
          ) : (
            filteredEvents.map(evt => {
              const isCritical = evt.severity === 'CRITICAL';
              const isHigh = evt.severity === 'HIGH';

              return (
                <div key={evt.id} className="p-3.5 hover:bg-slate-900/60 transition-colors flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isCritical
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : isHigh
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      }`}
                    >
                      {isCritical ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : isHigh ? (
                        <Flame className="w-4 h-4" />
                      ) : (
                        <ShieldCheck className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-slate-200">{evt.title}</span>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                            isCritical
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : isHigh
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {evt.severity}
                        </span>
                        {evt.platform && (
                          <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                            {evt.platform}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{evt.description}</p>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-slate-500 shrink-0">
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

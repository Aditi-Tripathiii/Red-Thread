import React, { useState } from 'react';
import {
  Ban,
  ShieldCheck,
  PhoneOff,
  MessageSquareWarning,
  Globe,
  ShieldAlert,
  QrCode,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Unlock,
  AlertOctagon,
} from 'lucide-react';
import type {
  CallLog,
  ScannedMessage,
  LinkThreat,
  SocialMediaApp,
  UpiPaymentPayload,
} from '../types/security';
import { soundAlert } from '../services/soundAlert';

interface BlockedItemsViewProps {
  calls: CallLog[];
  messages: ScannedMessage[];
  links: LinkThreat[];
  apps: SocialMediaApp[];
  upiScans: UpiPaymentPayload[];
  onUnblockCall: (id: string) => void;
  onUnblockMessage: (id: string) => void;
  onUnblockLink: (id: string) => void;
  onUnblockApp: (appId: string) => void;
  onUnblockVpa: (vpa: string) => void;
}

export const BlockedItemsView: React.FC<BlockedItemsViewProps> = ({
  calls,
  messages,
  links,
  apps,
  upiScans,
  onUnblockCall,
  onUnblockMessage,
  onUnblockLink,
  onUnblockApp,
  onUnblockVpa,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Collect all blocked items
  const blockedCalls = calls.filter(c => c.flaggedStatus === 'Blacklisted');
  const blockedMessages = messages.filter(m => m.status === 'QUARANTINED');
  const blockedLinks = links.filter(l => l.status === 'BLOCKED');
  const sandboxedApps = apps.filter(a => a.isSandboxed);
  const blockedUpis = upiScans.filter(u => u.isBlocked);

  const totalBlocked =
    blockedCalls.length +
    blockedMessages.length +
    blockedLinks.length +
    sandboxedApps.length +
    blockedUpis.length;

  return (
    <div className="space-y-5 pb-12">
      {/* Header Info */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-900 border border-red-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <Ban className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Central Threat Quarantine &amp; Blocklist
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                  {totalBlocked} Active Interceptions
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-300">
              Active quarantine across Indian scam phone numbers, quarantined smishing SMS, malicious domains, sandboxed app sensors, and fraud UPI VPAs
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            Auto-Shield Enforcement: <span className="text-emerald-400 font-bold">100% ACTIVE</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'ALL', label: `All Interceptions (${totalBlocked})` },
            { id: 'CALLS', label: `Phone Scams (${blockedCalls.length})` },
            { id: 'MESSAGES', label: `SMS Messages (${blockedMessages.length})` },
            { id: 'LINKS', label: `Phishing URLs (${blockedLinks.length})` },
            { id: 'UPI', label: `UPI QR & VPAs (${blockedUpis.length})` },
            { id: 'APPS', label: `Sandboxed Apps (${sandboxedApps.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              id={`btn-filter-blocked-${tab.id.toLowerCase()}`}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filterType === tab.id
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          id="input-search-blocked-items"
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by phone number (+91), domain, sender header, or UPI VPA..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500"
        />
      </div>

      {/* Blocked Items Feed */}
      <div className="space-y-3">
        {/* Calls Section */}
        {(filterType === 'ALL' || filterType === 'CALLS') &&
          blockedCalls
            .filter(c => !searchQuery || c.phoneNumber.includes(searchQuery) || c.threatCategory.toLowerCase().includes(searchQuery.toLowerCase()) || (c.contactName && c.contactName.toLowerCase().includes(searchQuery.toLowerCase())))
            .map(call => (
              <div
                key={call.id}
                className="p-4 rounded-xl bg-slate-900 border border-red-500/30 hover:border-red-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md shadow-red-950/10"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                      <PhoneOff className="w-3 h-3 text-rose-400" />
                      BLOCKED PHONE SCAM
                    </span>
                    <span className="text-xs font-bold text-slate-200 font-mono">
                      {call.phoneNumber}
                    </span>
                    {call.contactName && (
                      <span className="text-xs text-slate-400">({call.contactName})</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong className="text-amber-300">{call.threatCategory}:</strong> {call.notes}
                  </p>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Intercepted on {new Date(call.timestamp).toLocaleString()} • Risk Score: {call.riskScore}/100
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id={`btn-unblock-call-${call.id}`}
                    onClick={() => {
                      soundAlert.playBiometricSuccess();
                      onUnblockCall(call.id);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    Unblock Number
                  </button>
                </div>
              </div>
            ))}

        {/* Messages Section */}
        {(filterType === 'ALL' || filterType === 'MESSAGES') &&
          blockedMessages
            .filter(m => !searchQuery || m.sender.toLowerCase().includes(searchQuery.toLowerCase()) || m.content.toLowerCase().includes(searchQuery.toLowerCase()) || m.threatType.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(msg => (
              <div
                key={msg.id}
                className="p-4 rounded-xl bg-slate-900 border border-red-500/30 hover:border-red-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md shadow-red-950/10"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <MessageSquareWarning className="w-3 h-3 text-amber-400" />
                      QUARANTINED {msg.platform}
                    </span>
                    <span className="text-xs font-bold text-slate-200">
                      {msg.sender}
                    </span>
                    {msg.senderContactName && (
                      <span className="text-xs text-slate-400">({msg.senderContactName})</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 italic line-clamp-2">
                    "{msg.content}"
                  </p>
                  <p className="text-[11px] text-red-300">
                    <strong>Threat:</strong> {msg.threatType} (Risk: {msg.riskScore}/100)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id={`btn-unblock-msg-${msg.id}`}
                    onClick={() => {
                      soundAlert.playBiometricSuccess();
                      onUnblockMessage(msg.id);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    Unblock / Allow
                  </button>
                </div>
              </div>
            ))}

        {/* Links Section */}
        {(filterType === 'ALL' || filterType === 'LINKS') &&
          blockedLinks
            .filter(l => !searchQuery || l.domain.toLowerCase().includes(searchQuery.toLowerCase()) || l.url.toLowerCase().includes(searchQuery.toLowerCase()) || l.threatClassification.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(link => (
              <div
                key={link.id}
                className="p-4 rounded-xl bg-slate-900 border border-red-500/30 hover:border-red-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md shadow-red-950/10"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-rose-400" />
                      BLOCKED PHISHING LINK
                    </span>
                    <span className="text-xs font-bold text-slate-200 font-mono">
                      {link.domain}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong className="text-amber-300">{link.threatClassification}:</strong> {link.sandboxedPreview}
                  </p>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Vectors: {link.threatVectors.join(', ')}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id={`btn-unblock-link-${link.id}`}
                    onClick={() => {
                      soundAlert.playBiometricSuccess();
                      onUnblockLink(link.id);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    Whitelist URL
                  </button>
                </div>
              </div>
            ))}

        {/* UPI QR Section */}
        {(filterType === 'ALL' || filterType === 'UPI') &&
          blockedUpis
            .filter(u => !searchQuery || u.payeeVpa.toLowerCase().includes(searchQuery.toLowerCase()) || u.payeeName.toLowerCase().includes(searchQuery.toLowerCase()) || u.scamType.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(upi => (
              <div
                key={upi.id}
                className="p-4 rounded-xl bg-slate-900 border border-red-500/30 hover:border-red-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md shadow-red-950/10"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
                      <QrCode className="w-3 h-3 text-red-400" />
                      BLOCKED UPI SCAM VPA
                    </span>
                    <span className="text-xs font-bold text-slate-200 font-mono">
                      {upi.payeeVpa}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong className="text-red-300">{upi.scamType}:</strong> {upi.payeeName} {upi.amount ? `(Attempted debit: ₹${upi.amount})` : ''}
                  </p>
                  <p className="text-[11px] text-amber-300/90">
                    {upi.recommendation}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id={`btn-unblock-vpa-${upi.id}`}
                    onClick={() => {
                      soundAlert.playBiometricSuccess();
                      onUnblockVpa(upi.payeeVpa);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    Unblock VPA
                  </button>
                </div>
              </div>
            ))}

        {/* Sandboxed Apps Section */}
        {(filterType === 'ALL' || filterType === 'APPS') &&
          sandboxedApps
            .filter(a => !searchQuery || a.appName.toLowerCase().includes(searchQuery.toLowerCase()) || a.category.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(app => (
              <div
                key={app.id}
                className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30 hover:border-indigo-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md shadow-indigo-950/10"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-indigo-400" />
                      SANDBOXED SENSORS
                    </span>
                    <span className="text-xs font-bold text-slate-200">
                      {app.appName}
                    </span>
                    <span className="text-[11px] text-slate-400">({app.packageName})</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Microphone, location, and clipboard restricted in hardware sandbox to prevent background eavesdropping.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id={`btn-unblock-app-${app.id}`}
                    onClick={() => {
                      soundAlert.playBiometricSuccess();
                      onUnblockApp(app.id);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    Restore Default
                  </button>
                </div>
              </div>
            ))}

        {/* Zero items state */}
        {totalBlocked === 0 && (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-100">Zero Active Blocked Items</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              All communications, numbers, URLs, and applications are currently evaluated as safe.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

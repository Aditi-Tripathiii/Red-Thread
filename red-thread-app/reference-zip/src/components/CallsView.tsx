import React, { useState } from 'react';
import {
  PhoneCall,
  PhoneOff,
  PhoneForwarded,
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  AlertTriangle,
  Flame,
  FileText,
  UserX,
  UserCheck,
  Clock,
  Radio,
  PlusCircle,
} from 'lucide-react';
import type { CallLog } from '../types/security';
import { soundAlert } from '../services/soundAlert';

interface CallsViewProps {
  calls: CallLog[];
  onToggleBlacklist: (id: string) => void;
  onSimulateVishingCall: (scenarioId?: string) => void;
}

export const CallsView: React.FC<CallsViewProps> = ({
  calls,
  onToggleBlacklist,
  onSimulateVishingCall,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);

  const filteredCalls = calls.filter(c => {
    const matchesCategory =
      filterCategory === 'ALL' ||
      (filterCategory === 'BLACKLISTED' && c.flaggedStatus === 'Blacklisted') ||
      (filterCategory === 'SURVEILLANCE' && c.flaggedStatus === 'Under Surveillance') ||
      (filterCategory === 'SAFE' && c.flaggedStatus === 'Cleared');

    const matchesSearch =
      !searchQuery ||
      c.phoneNumber.includes(searchQuery) ||
      (c.contactName && c.contactName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.threatCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.notes.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-emerald-400" />
            Phone Call Scam &amp; In-Call OTP Interceptor
          </h2>
          <p className="text-xs text-slate-400">
            Real-time acoustic speech analysis: alerts immediately during incoming calls if caller demands OTP, PIN, or banking passwords
          </p>
        </div>

        {/* Simulate Incoming Call Scam Trigger */}
        <button
          id="btn-simulate-vishing-call"
          onClick={() => {
            soundAlert.playCriticalAlert();
            onSimulateVishingCall();
          }}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-red-950/50 shrink-0"
        >
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          Simulate Inbound Call + Live OTP Alert
        </button>
      </div>

      {/* Live In-Call OTP Interceptor Feature Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/50 via-slate-900 to-slate-900 border border-red-500/40 shadow-lg space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 uppercase font-mono tracking-wide">
              ⚡ Real-Time In-Call OTP Fraud Interceptor
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            100% ON-DEVICE SPEECH ENGINE ACTIVE
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          If an incoming scammer calls and asks you to <strong>share an OTP, PIN, password, or security code</strong>, RED THREAD immediately triggers a flashing red hazard alert right on your call screen with an audible siren so you never fall victim to fraud.
        </p>

        {/* 3 Quick Interactive Test Scenarios */}
        <div className="pt-2 border-t border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 block mb-2">
            Try Live Interactive Voice Scenarios:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              id="btn-test-sbi-otp"
              onClick={() => onSimulateVishingCall('sbi-kyc-otp')}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-red-500/50 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-200 group-hover:text-red-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>SBI YONO OTP Call</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                Fake manager demands 6-digit OTP to prevent account freeze.
              </p>
            </button>

            <button
              id="btn-test-discom-otp"
              onClick={() => onSimulateVishingCall('electricity-bill-otp')}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-200 group-hover:text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Electricity Cutoff OTP</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                Fake DISCOM officer threatens 9:30 PM cutoff unless OTP given.
              </p>
            </button>

            <button
              id="btn-test-post-otp"
              onClick={() => onSimulateVishingCall('courier-dispatch-otp')}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-200 group-hover:text-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>India Post Parcel OTP</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                Fake parcel courier asks for OTP to confirm address re-delivery.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Synchronized Smishing-Call Scam Correlation Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-amber-300">
            Real-time Scam Call Interception Active
          </div>
          <p className="text-slate-400 leading-relaxed">
            When an unknown caller rings your device within 15 minutes of a quarantined SMS (e.g. Electricity bill or CBI Digital Arrest alert), RED THREAD cross-references the carrier routing signatures and immediately disconnects the scam call.
          </p>
        </div>
      </div>

      {/* Calls & Flagged Contacts Card */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <PhoneForwarded className="w-4 h-4 text-emerald-400" />
              Flagged Contact Call Log Records ({filteredCalls.length})
            </h3>
            <p className="text-xs text-slate-400">
              VoIP spoofing markers, audio analysis transcripts, and auto-blocked robocallers
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-search-calls"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search phone or threat..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              id="select-call-filter"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Call Logs</option>
              <option value="BLACKLISTED">Blacklisted Only</option>
              <option value="SURVEILLANCE">Under Surveillance</option>
              <option value="SAFE">Cleared Safe</option>
            </select>
          </div>
        </div>

        {/* Call Cards List */}
        <div className="space-y-3">
          {filteredCalls.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">No call logs matching filter.</div>
          ) : (
            filteredCalls.map(call => {
              const isBlacklisted = call.flaggedStatus === 'Blacklisted';
              const isSurveillance = call.flaggedStatus === 'Under Surveillance';

              return (
                <div
                  key={call.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isBlacklisted
                      ? 'bg-slate-950/70 border-rose-900/40 hover:border-rose-700/60'
                      : isSurveillance
                      ? 'bg-slate-950/60 border-amber-900/40 hover:border-amber-700/60'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          call.callType === 'BLOCKED'
                            ? 'bg-rose-500/15 text-rose-400'
                            : call.callType === 'MISSED'
                            ? 'bg-amber-500/15 text-amber-400'
                            : 'bg-emerald-500/15 text-emerald-400'
                        }`}
                      >
                        {call.callType === 'BLOCKED' ? (
                          <PhoneOff className="w-3.5 h-3.5" />
                        ) : (
                          <PhoneCall className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <span className="text-xs font-mono font-bold text-slate-200">
                        {call.phoneNumber}
                      </span>
                      {call.contactName && (
                        <span className="text-xs text-slate-400 font-medium">
                          ({call.contactName})
                        </span>
                      )}

                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          isBlacklisted
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : isSurveillance
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {call.flaggedStatus}
                      </span>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                        {call.threatCategory}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-slate-400 text-[11px]">
                        Risk Score: {call.riskScore}/100
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        {new Date(call.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Forensic details & transcript */}
                  <div className="mt-2 p-3 rounded-lg bg-slate-900/60 border border-slate-800/60 text-xs space-y-1.5">
                    {call.transcriptExcerpt && (
                      <div className="text-slate-300 leading-relaxed font-sans">
                        <span className="font-semibold text-slate-200">Scam Call Audio Transcript: </span>
                        <span className="italic text-slate-400">"{call.transcriptExcerpt}"</span>
                      </div>
                    )}
                    <div className="text-[11px] text-slate-400 leading-relaxed">
                      <span className="font-semibold text-slate-300">Forensic Assessment: </span>
                      {call.notes}
                    </div>

                    {call.correlatedSmishingCount > 0 && (
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        <Flame className="w-3 h-3 text-amber-400" />
                        Correlated with {call.correlatedSmishingCount} Quarantined Smishing SMS
                      </div>
                    )}
                  </div>

                  {/* Action row */}
                  <div className="mt-3 flex items-center justify-between text-xs pt-1">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Call Status: {call.callType} • Duration: {call.durationSeconds}s
                    </span>

                    <button
                      id={`btn-toggle-blacklist-${call.id}`}
                      onClick={() => onToggleBlacklist(call.id)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
                        isBlacklisted
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                          : 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {isBlacklisted ? (
                        <>
                          <UserCheck className="w-3 h-3 text-emerald-400" />
                          Unblock Contact
                        </>
                      ) : (
                        <>
                          <UserX className="w-3 h-3 text-rose-400" />
                          Blacklist & Auto-Reject
                        </>
                      )}
                    </button>
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

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Mic,
  Camera,
  MapPin,
  Clipboard,
  Users,
  MessageSquare,
  Lock,
  Unlock,
  RefreshCw,
  Search,
  Sliders,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { SocialMediaApp } from '../types/security';
import { soundAlert } from '../services/soundAlert';

interface AppPrivacyViewProps {
  apps: SocialMediaApp[];
  onTogglePermission: (appId: string, permName: string) => void;
  onToggleSandbox: (appId: string) => void;
  onRunPrivacyAudit: () => void;
  isAuditing: boolean;
}

export const AppPrivacyView: React.FC<AppPrivacyViewProps> = ({
  apps,
  onTogglePermission,
  onToggleSandbox,
  onRunPrivacyAudit,
  isAuditing,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const filteredApps = apps.filter(app => {
    const matchesFilter =
      filterType === 'ALL' ||
      (filterType === 'LEAKS' && app.unauthorizedAccessDetected) ||
      (filterType === 'SANDBOXED' && app.isSandboxed) ||
      (filterType === 'HIGH_RISK' && app.privacyRiskScore > 70);

    const matchesSearch =
      !searchQuery ||
      app.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getPermissionIcon = (type: string) => {
    switch (type) {
      case 'MICROPHONE':
        return <Mic className="w-3.5 h-3.5" />;
      case 'CAMERA':
        return <Camera className="w-3.5 h-3.5" />;
      case 'LOCATION_PRECISE':
      case 'LOCATION_BACKGROUND':
        return <MapPin className="w-3.5 h-3.5" />;
      case 'CLIPBOARD':
        return <Clipboard className="w-3.5 h-3.5" />;
      case 'CONTACTS':
        return <Users className="w-3.5 h-3.5" />;
      case 'SMS_READ':
        return <MessageSquare className="w-3.5 h-3.5" />;
      default:
        return <Lock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400" />
            Installed Social Media & App Privacy Audit
          </h2>
          <p className="text-xs text-slate-400">
            Detects unauthorized background sensor access, clipboard snooping, and telemetry leaks
          </p>
        </div>

        <button
          id="btn-run-app-audit"
          onClick={() => {
            soundAlert.playScanPing();
            onRunPrivacyAudit();
          }}
          disabled={isAuditing}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-950/40 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
          {isAuditing ? 'Auditing Android App Permissions...' : 'Run Full Privacy Audit'}
        </button>
      </div>

      {/* End-to-End Encryption Exemption Guarantee Banner */}
      <div className="px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="text-xs text-slate-300">
          <span className="font-semibold text-emerald-400">WhatsApp &amp; E2EE Privacy Protection: </span>
          WhatsApp is end-to-end encrypted. In accordance with strict cryptographic privacy standards, RED THREAD does not check, audit, or monitor WhatsApp.
        </div>
      </div>

      {/* Sensor Watchdog Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Mic Background Intercepts</div>
            <div className="text-lg font-bold text-slate-100 font-mono">3 Blocked</div>
            <div className="text-[10px] text-rose-400">Instagram minimized</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Clipboard className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Clipboard Snooping Attempts</div>
            <div className="text-lg font-bold text-slate-100 font-mono">14 Blocked</div>
            <div className="text-[10px] text-amber-400">TikTok 2FA buffer read</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Background Location Pings</div>
            <div className="text-lg font-bold text-slate-100 font-mono">22 Sandboxed</div>
            <div className="text-[10px] text-cyan-400">Coarse blur applied</div>
          </div>
        </div>
      </div>

      {/* Installed Apps Audit List */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              Audited Applications ({filteredApps.length})
            </h3>
            <p className="text-xs text-slate-400">
              Live permission sandbox enforcement on Android 14 App Ops level
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-search-apps"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search installed app..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <select
              id="select-app-filter"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Applications</option>
              <option value="LEAKS">Unauthorized Access Detected</option>
              <option value="HIGH_RISK">High Privacy Risk (&gt;70)</option>
              <option value="SANDBOXED">Aegis Sandboxed</option>
            </select>
          </div>
        </div>

        {/* App Cards */}
        <div className="space-y-4">
          {filteredApps.map(app => {
            const isHighRisk = app.privacyRiskScore > 70;
            const isModerate = app.privacyRiskScore > 40 && app.privacyRiskScore <= 70;

            return (
              <div
                key={app.id}
                className={`p-4 rounded-xl border transition-all ${
                  app.unauthorizedAccessDetected
                    ? 'bg-slate-950/70 border-rose-900/40'
                    : 'bg-slate-950/40 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-200 font-bold text-sm">
                      {app.appName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-100">{app.appName}</span>
                        {app.isSandboxed && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                            RED THREAD Sandboxed
                          </span>
                        )}
                        {app.unauthorizedAccessDetected && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                            Privacy Leak Detected
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-mono text-slate-400">
                        {app.packageName} • {app.category}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Privacy Risk Index</div>
                      <div
                        className={`text-sm font-mono font-bold ${
                          isHighRisk ? 'text-rose-400' : isModerate ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {app.privacyRiskScore}/100
                      </div>
                    </div>

                    {/* 1-click Sandbox toggle */}
                    <button
                      id={`btn-sandbox-${app.id}`}
                      onClick={() => onToggleSandbox(app.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                        app.isSandboxed
                          ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-600/30'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {app.isSandboxed ? (
                        <>
                          <Lock className="w-3 h-3 text-cyan-400" />
                          Sandboxed
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3 h-3 text-slate-400" />
                          Sandbox App
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Leaks detected callout */}
                {app.privacyLeaks.length > 0 && (
                  <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/30 mb-3 space-y-1">
                    <div className="text-[11px] font-semibold text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      Detected Privacy Violations & Sensor Snooping:
                    </div>
                    <ul className="list-disc list-inside text-xs text-rose-200/90 space-y-0.5">
                      {app.privacyLeaks.map((leak, idx) => (
                        <li key={idx}>{leak}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Permissions Breakdown & Toggles */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] font-medium text-slate-400 mb-2">
                    Managed Permissions ({app.trackersCount} Trackers / Ad SDKs Detected):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {app.permissions.map(perm => {
                      const isGranted = perm.status === 'GRANTED';
                      return (
                        <div
                          key={perm.name}
                          className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 text-xs">
                            <span className={perm.isHighRisk ? 'text-amber-400' : 'text-slate-400'}>
                              {getPermissionIcon(perm.type)}
                            </span>
                            <span className="text-slate-200 font-medium text-[11px]">{perm.name}</span>
                          </div>

                          <button
                            id={`btn-toggle-perm-${app.id}-${perm.type}`}
                            onClick={() => onTogglePermission(app.id, perm.name)}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                              isGranted
                                ? 'bg-amber-950/80 text-amber-300 border-amber-800 hover:bg-rose-950 hover:text-rose-300'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                            }`}
                          >
                            {isGranted ? 'Revoke' : 'Revoked'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

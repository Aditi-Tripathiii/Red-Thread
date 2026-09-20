import React, { useState } from 'react';
import {
  Globe,
  ShieldAlert,
  ShieldCheck,
  Search,
  ExternalLink,
  Lock,
  Unlock,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Ban,
  Radio,
  Eye,
  Zap,
} from 'lucide-react';
import type { LinkThreat, PlatformType } from '../types/security';
import { soundAlert } from '../services/soundAlert';

interface LinksScannerViewProps {
  links: LinkThreat[];
  onBlockLink: (id: string) => void;
  onWhitelistLink: (id: string) => void;
  onAddNewScannedLink: (link: LinkThreat) => void;
}

const sampleUrlsToTest = [
  'https://chase-auth-security-lock.xyz/cancel',
  'https://paypa1-secure-verification.com/login',
  'https://usps-redelivery-claim.top/track',
  'https://uniswap-airdrop-reward.click/connect',
  'https://github.com/settings/tokens',
];

export const LinksScannerView: React.FC<LinksScannerViewProps> = ({
  links,
  onBlockLink,
  onWhitelistLink,
  onAddNewScannedLink,
}) => {
  const [targetUrl, setTargetUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [previewLink, setPreviewLink] = useState<LinkThreat | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const handleScanUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;

    setIsScanning(true);
    setScanResult(null);

    try {
      const res = await fetch('/api/scan-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl: targetUrl.trim() }),
      });

      const data = await res.json();
      setScanResult(data);

      if (!data.isSafe) {
        soundAlert.playCriticalAlert();
      } else {
        soundAlert.playScanPing();
      }

      // Add to link list
      const newThreat: LinkThreat = {
        id: `lnk-${Date.now()}`,
        url: targetUrl.trim(),
        domain: data.domain || targetUrl.trim(),
        detectedOnPlatform: 'SMS',
        sourceMessageSnippet: 'Manual URL inspection request',
        timestamp: new Date().toISOString(),
        threatClassification: data.threatClassification || (!data.isSafe ? 'Malicious Phishing Portal' : 'Clean / Legitimate'),
        isSafe: Boolean(data.isSafe),
        riskScore: data.riskScore ?? (!data.isSafe ? 90 : 5),
        threatVectors: data.threatVectors || ['Domain reputation query'],
        tlsStatus: data.tlsStatus || (data.isSafe ? 'Valid TLS 1.3' : 'Suspicious Free Certificate'),
        reputation: data.reputation || (!data.isSafe ? 'Blacklisted by Cyber Threat Feeds' : 'Established & Verified'),
        sandboxedPreview: data.sandboxedPreview || 'URL isolated in secure sandbox buffer.',
        status: data.isSafe ? 'WHITELISTED' : 'BLOCKED',
      };

      onAddNewScannedLink(newThreat);
    } catch (err) {
      console.error('URL scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const filteredLinks = links.filter(l => {
    const matchesFilter =
      statusFilter === 'ALL' ||
      (statusFilter === 'BLOCKED' && l.status === 'BLOCKED') ||
      (statusFilter === 'WHITELISTED' && l.status === 'WHITELISTED');
    const matchesSearch =
      !searchQuery ||
      l.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.threatClassification.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            Cross-Platform Suspicious Link Guard
          </h2>
          <p className="text-xs text-slate-400">
            Real-time link quarantine for SMS carrier traffic, email gateways, and web browsing
          </p>
        </div>
      </div>

      {/* Interactive URL Scanner Form */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            Real-Time URL Reputation & Typosquatting Analyzer
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Sandboxed Isolation & DNS Check
          </span>
        </div>

        {/* Quick Sample Links */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-medium text-slate-400">Test Sample Suspicious Domains:</span>
          <div className="flex flex-wrap gap-1.5">
            {sampleUrlsToTest.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                id={`btn-sample-url-${idx}`}
                onClick={() => {
                  setTargetUrl(sample);
                  setScanResult(null);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 font-mono border border-slate-800 transition-colors"
              >
                {sample.replace('https://', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Scan Input */}
        <form onSubmit={handleScanUrl} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-url-to-scan"
              type="text"
              value={targetUrl}
              onChange={e => setTargetUrl(e.target.value)}
              placeholder="Enter suspicious link (e.g. https://chase-auth-security-lock.xyz/cancel)"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            id="btn-scan-url-submit"
            type="submit"
            disabled={isScanning || !targetUrl.trim()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md shadow-cyan-950/50 shrink-0"
          >
            {isScanning ? (
              <>
                <Zap className="w-3.5 h-3.5 animate-spin" />
                Scanning Domain...
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                Inspect URL Threat
              </>
            )}
          </button>
        </form>

        {/* Scan Result Output */}
        {scanResult && (
          <div
            className={`mt-3 p-4 rounded-xl border ${
              !scanResult.isSafe
                ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {!scanResult.isSafe ? (
                  <Flame className="w-5 h-5 text-rose-400" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                )}
                <div>
                  <span className="font-bold text-sm text-slate-100">{scanResult.threatClassification}</span>
                  <div className="text-xs font-mono text-slate-400">{scanResult.domain}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  Risk: {scanResult.riskScore}/100
                </span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    !scanResult.isSafe ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                  }`}
                >
                  {!scanResult.isSafe ? 'DANGEROUS / PHISHING' : 'VERIFIED SAFE'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium">TLS / SSL Certificate:</span>
                <div className="text-slate-200 font-mono mt-0.5">{scanResult.tlsStatus}</div>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Reputation Status:</span>
                <div className="text-slate-200 mt-0.5">{scanResult.reputation}</div>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs">
              <span className="font-semibold text-slate-300">Sandboxed Content Preview: </span>
              <span className="text-slate-400">{scanResult.sandboxedPreview}</span>
            </div>

            {scanResult.threatVectors && scanResult.threatVectors.length > 0 && (
              <div className="mt-2 text-xs">
                <span className="text-slate-400 font-medium">Identified Threat Vectors: </span>
                <span className="text-rose-300">{scanResult.threatVectors.join(' • ')}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Intercepted Links Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              Intercepted Cross-Platform Links ({filteredLinks.length})
            </h3>
            <p className="text-xs text-slate-400">
              Isolated URLs quarantined before reaching browser rendering engine
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-search-links"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search links..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              id="select-links-status-filter"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Links</option>
              <option value="BLOCKED">Blocked Only</option>
              <option value="WHITELISTED">Whitelisted</option>
            </select>
          </div>
        </div>

        {/* Links Cards */}
        <div className="space-y-3">
          {filteredLinks.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">No links matching search.</div>
          ) : (
            filteredLinks.map(link => {
              const isBlocked = link.status === 'BLOCKED';

              return (
                <div
                  key={link.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isBlocked
                      ? 'bg-slate-950/70 border-rose-900/40 hover:border-rose-700/60'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-slate-200 break-all">{link.domain}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                        {link.detectedOnPlatform}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          isBlocked
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {link.threatClassification}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-[11px] text-slate-400">
                        Risk Score: {link.riskScore}/100
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        {new Date(link.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Full URL & Source Snippet */}
                  <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/70 space-y-1">
                    <div className="text-xs font-mono text-cyan-300 break-all flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      {link.url}
                    </div>
                    <div className="text-[11px] text-slate-400 italic">
                      Source Context: "{link.sourceMessageSnippet}"
                    </div>
                  </div>

                  {/* Sandboxed Preview & Action */}
                  <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="text-slate-400 text-[11px]">
                      <span className="font-semibold text-slate-300">Sandbox Preview: </span>
                      {link.sandboxedPreview}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        id={`btn-toggle-sandbox-preview-${link.id}`}
                        onClick={() => setPreviewLink(previewLink?.id === link.id ? null : link)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3 text-cyan-400" />
                        {previewLink?.id === link.id ? 'Close Sandbox' : 'Sandbox View'}
                      </button>

                      {isBlocked ? (
                        <button
                          id={`btn-whitelist-${link.id}`}
                          onClick={() => onWhitelistLink(link.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Whitelist
                        </button>
                      ) : (
                        <button
                          id={`btn-block-${link.id}`}
                          onClick={() => onBlockLink(link.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <Ban className="w-3 h-3" />
                          Block & Quarantine
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Sandbox Isolation View */}
                  {previewLink?.id === link.id && (
                    <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono text-cyan-400 pb-2 border-b border-slate-800">
                        <span className="flex items-center gap-1.5 font-bold">
                          <Lock className="w-3.5 h-3.5" />
                          Aegis Isolated Sandboxed Virtual Container
                        </span>
                        <span>Zero Execution Risk</span>
                      </div>
                      <div className="text-xs text-slate-300 space-y-1 font-mono">
                        <div>Target: <span className="text-slate-100">{link.url}</span></div>
                        <div>TLS Handshake: <span className="text-amber-400">{link.tlsStatus}</span></div>
                        <div>Reputation Authority: <span className="text-slate-300">{link.reputation}</span></div>
                        <div>Threat Vectors: <span className="text-rose-400">{link.threatVectors.join(', ')}</span></div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 leading-relaxed font-sans">
                        <div className="font-semibold text-slate-200 mb-1">Simulated Landing Page Telemetry:</div>
                        {link.sandboxedPreview}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

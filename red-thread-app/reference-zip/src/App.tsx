import React, { useState, useEffect } from 'react';
import { AndroidHeader } from './components/AndroidHeader';
import { Navigation, type NavTab } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { MessagesView } from './components/MessagesView';
import { LinksScannerView } from './components/LinksScannerView';
import { CallsView } from './components/CallsView';
import { AppPrivacyView } from './components/AppPrivacyView';
import { QrCheckerTab } from './components/QrCheckerTab';
import { BlockedItemsView } from './components/BlockedItemsView';
import { BiometricModal } from './components/BiometricModal';
import { ThreatAlertToast } from './components/ThreatAlertToast';
import { LiveCallOtpAlert, CALL_SCENARIOS, type LiveCallScenario } from './components/LiveCallOtpAlert';
import { soundAlert } from './services/soundAlert';

import {
  initialMessages,
  initialLinks,
  initialCalls,
  initialSocialMediaApps,
  initialThreatEvents,
  initialUpiScans,
} from './data/mockSecurityData';
import type {
  ScannedMessage,
  LinkThreat,
  CallLog,
  SocialMediaApp,
  ThreatEvent,
  UpiPaymentPayload,
} from './types/security';
import { ShieldCheck, Phone, ChevronLeft, Circle, Square } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [messages, setMessages] = useState<ScannedMessage[]>(initialMessages);
  const [links, setLinks] = useState<LinkThreat[]>(initialLinks);
  const [calls, setCalls] = useState<CallLog[]>(initialCalls);
  const [apps, setApps] = useState<SocialMediaApp[]>(initialSocialMediaApps);
  const [upiScans, setUpiScans] = useState<UpiPaymentPayload[]>(initialUpiScans);
  const [events, setEvents] = useState<ThreatEvent[]>(initialThreatEvents);

  // Security & Authentication Modals
  const [isBiometricLocked, setIsBiometricLocked] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);

  // Real-Time Alert & Notifications
  const [activeAlertEvent, setActiveAlertEvent] = useState<ThreatEvent | null>(null);
  const [isAuditingApps, setIsAuditingApps] = useState(false);

  // Live In-Call OTP Protection Modal & Scenarios
  const [isLiveCallModalOpen, setIsLiveCallModalOpen] = useState(false);
  const [activeCallScenario, setActiveCallScenario] = useState<LiveCallScenario>(CALL_SCENARIOS[0]);

  // Zoom & View Mode state (as requested for laptop/desktop and Android usage)
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Trigger an initial alert toast to showcase the requested real-time notification
  useEffect(() => {
    const timer = setTimeout(() => {
      const topThreat = events.find(e => e.severity === 'CRITICAL');
      if (topThreat) {
        setActiveAlertEvent(topThreat);
        soundAlert.playCriticalAlert();
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Zoom Controls
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(150, prev + 10));
    soundAlert.playScanPing();
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(75, prev - 10));
    soundAlert.playScanPing();
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
    soundAlert.playScanPing();
  };

  // Handlers for Messages
  const handleAddMessage = (newMsg: ScannedMessage) => {
    setMessages(prev => [newMsg, ...prev]);

    if (newMsg.isFraudulent) {
      const newEvent: ThreatEvent = {
        id: `evt-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'SMISHING_BLOCKED',
        severity: newMsg.urgency === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
        category: 'SMISHING',
        title: `Indian Cyber Alert: Quarantined ${newMsg.platform} from ${newMsg.sender}`,
        description: newMsg.content.slice(0, 110),
        platform: newMsg.platform,
        status: 'OPEN',
      };
      setEvents(prev => [newEvent, ...prev]);
      setActiveAlertEvent(newEvent);
      soundAlert.playCriticalAlert();
    } else {
      soundAlert.playScanPing();
    }
  };

  const handleQuarantineMessage = (id: string) => {
    setMessages(prev =>
      prev.map(m => (m.id === id ? { ...m, status: 'QUARANTINED', isFraudulent: true } : m))
    );
    soundAlert.playCriticalAlert();
  };

  const handleAllowMessage = (id: string) => {
    setMessages(prev =>
      prev.map(m => (m.id === id ? { ...m, status: 'ALLOWED', isFraudulent: false } : m))
    );
    soundAlert.playBiometricSuccess();
  };

  // Handlers for Links
  const handleBlockLink = (id: string) => {
    setLinks(prev =>
      prev.map(l => (l.id === id ? { ...l, status: 'BLOCKED', isSafe: false } : l))
    );
    soundAlert.playCriticalAlert();
  };

  const handleWhitelistLink = (id: string) => {
    setLinks(prev =>
      prev.map(l => (l.id === id ? { ...l, status: 'WHITELISTED', isSafe: true } : l))
    );
    soundAlert.playBiometricSuccess();
  };

  const handleAddNewScannedLink = (newLink: LinkThreat) => {
    setLinks(prev => [newLink, ...prev]);

    if (!newLink.isSafe) {
      const newEvent: ThreatEvent = {
        id: `evt-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'SUSPICIOUS_LINK_ISOLATED',
        severity: 'CRITICAL',
        category: 'PHISHING_URL',
        title: `Phishing Domain Intercepted: ${newLink.domain}`,
        description: `Risk score: ${newLink.riskScore}/100. Mimicking Indian bank/utility service.`,
        platform: newLink.detectedOnPlatform,
        status: 'OPEN',
      };
      setEvents(prev => [newEvent, ...prev]);
      setActiveAlertEvent(newEvent);
      soundAlert.playCriticalAlert();
    } else {
      soundAlert.playBiometricSuccess();
    }
  };

  // Handlers for Calls (Call Scam / Phishing)
  const handleToggleCallBlacklist = (id: string) => {
    setCalls(prev =>
      prev.map(c => {
        if (c.id === id) {
          const newStatus = c.flaggedStatus === 'Blacklisted' ? 'Cleared' : 'Blacklisted';
          return {
            ...c,
            flaggedStatus: newStatus,
            callType: newStatus === 'Blacklisted' ? 'BLOCKED' : 'INCOMING',
          };
        }
        return c;
      })
    );
    soundAlert.playScanPing();
  };

  const handleSimulateCallScam = (scenarioId?: string) => {
    let chosen = CALL_SCENARIOS[0];
    if (scenarioId) {
      const found = CALL_SCENARIOS.find(s => s.id === scenarioId);
      if (found) chosen = found;
    } else {
      chosen = CALL_SCENARIOS[Math.floor(Math.random() * CALL_SCENARIOS.length)];
    }

    setActiveCallScenario(chosen);
    setIsLiveCallModalOpen(true);
    soundAlert.playCriticalAlert();
  };

  const handleHangUpAndBlacklistFromCall = (
    phoneNumber: string,
    callerName: string,
    reason: string
  ) => {
    const newCall: CallLog = {
      id: `call-${Date.now()}`,
      phoneNumber,
      contactName: callerName,
      timestamp: new Date().toISOString(),
      callType: 'BLOCKED',
      durationSeconds: 12,
      threatCategory: 'In-Call OTP Extraction Scam',
      riskScore: 99,
      flaggedStatus: 'Blacklisted',
      correlatedSmishingCount: 1,
      transcriptExcerpt: activeCallScenario.transcriptWords.join(' '),
      notes: reason,
    };

    setCalls(prev => [newCall, ...prev]);

    const newEvent: ThreatEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'CALL_SCAM_BLOCKED',
      severity: 'CRITICAL',
      category: 'CALL_SCAM',
      title: `🚨 In-Call OTP Interception: ${callerName}`,
      description: `Acoustic monitor trapped caller from ${phoneNumber} demanding OTP. Disconnected & number blacklisted.`,
      status: 'OPEN',
    };

    setEvents(prev => [newEvent, ...prev]);
    setActiveAlertEvent(newEvent);
  };

  // Handlers for App Privacy
  const handleToggleAppPermission = (appId: string, permName: string) => {
    setApps(prev =>
      prev.map(app => {
        if (app.id === appId) {
          const updatedPermissions = app.permissions.map(p => {
            if (p.name === permName) {
              const newStatus = p.status === 'GRANTED' ? 'REVOKED' : 'GRANTED';
              return { ...p, status: newStatus as any };
            }
            return p;
          });
          const stillHasLeaks = updatedPermissions.some(
            p => p.isHighRisk && p.status === 'GRANTED'
          );
          return {
            ...app,
            permissions: updatedPermissions,
            unauthorizedAccessDetected: stillHasLeaks,
            privacyRiskScore: stillHasLeaks ? app.privacyRiskScore : Math.max(10, app.privacyRiskScore - 25),
          };
        }
        return app;
      })
    );
    soundAlert.playScanPing();
  };

  const handleToggleAppSandbox = (appId: string) => {
    setApps(prev =>
      prev.map(app => {
        if (app.id === appId) {
          const nextSandboxed = !app.isSandboxed;
          return {
            ...app,
            isSandboxed: nextSandboxed,
            privacyRiskScore: nextSandboxed ? Math.max(15, app.privacyRiskScore - 30) : app.privacyRiskScore + 30,
          };
        }
        return app;
      })
    );
    soundAlert.playBiometricSuccess();
  };

  const handleRunPrivacyAudit = () => {
    setIsAuditingApps(true);
    setTimeout(() => {
      setIsAuditingApps(false);
      soundAlert.playBiometricSuccess();
    }, 800);
  };

  // Handlers for UPI QR Scanner
  const handleAddNewQrScan = (payload: UpiPaymentPayload) => {
    setUpiScans(prev => [payload, ...prev]);

    if (payload.isScam) {
      const newEvent: ThreatEvent = {
        id: `evt-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'UPI_QR_SCAM_BLOCKED',
        severity: 'CRITICAL',
        category: 'UPI_FRAUD',
        title: `Blocked UPI Payment Fraud: ${payload.scamType}`,
        description: `Target VPA: ${payload.payeeVpa}. Attempted unauthorized debit: ${payload.amount ? '₹' + payload.amount : 'money'}.`,
        status: 'OPEN',
      };
      setEvents(prev => [newEvent, ...prev]);
      setActiveAlertEvent(newEvent);
    }
  };

  const handleBlockVpa = (vpa: string, reason: string) => {
    setUpiScans(prev =>
      prev.map(u => (u.payeeVpa === vpa ? { ...u, isBlocked: true } : u))
    );
    const newEvent: ThreatEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'UPI_QR_SCAM_BLOCKED',
      severity: 'HIGH',
      category: 'UPI_FRAUD',
      title: `Blacklisted UPI VPA: ${vpa}`,
      description: `Reported for ${reason}. Added to global Indian defense blacklist.`,
      status: 'RESOLVED',
    };
    setEvents(prev => [newEvent, ...prev]);
    soundAlert.playCriticalAlert();
  };

  const handleUnblockVpa = (vpa: string) => {
    setUpiScans(prev =>
      prev.map(u => (u.payeeVpa === vpa ? { ...u, isBlocked: false } : u))
    );
    soundAlert.playBiometricSuccess();
  };

  const handleUnblockCall = (id: string) => {
    setCalls(prev =>
      prev.map(c => (c.id === id ? { ...c, flaggedStatus: 'Cleared', callType: 'INCOMING' } : c))
    );
  };

  const handleUnblockMessage = (id: string) => {
    setMessages(prev =>
      prev.map(m => (m.id === id ? { ...m, status: 'ALLOWED', isFraudulent: false } : m))
    );
  };

  const handleUnblockLink = (id: string) => {
    setLinks(prev =>
      prev.map(l => (l.id === id ? { ...l, status: 'WHITELISTED', isSafe: true } : l))
    );
  };

  const handleUnblockApp = (appId: string) => {
    setApps(prev =>
      prev.map(a => (a.id === appId ? { ...a, isSandboxed: false } : a))
    );
  };

  // Threat counts for badges
  const blockedCallsCount = calls.filter(c => c.flaggedStatus === 'Blacklisted').length;
  const blockedMsgCount = messages.filter(m => m.status === 'QUARANTINED').length;
  const blockedLnkCount = links.filter(l => l.status === 'BLOCKED').length;
  const sandboxedAppsCount = apps.filter(a => a.isSandboxed).length;
  const blockedUpisCount = upiScans.filter(u => u.isBlocked).length;

  const threatCounts = {
    messages: messages.filter(m => m.isFraudulent && m.status !== 'ALLOWED').length,
    links: links.filter(l => !l.isSafe && l.status === 'BLOCKED').length,
    calls: calls.filter(c => c.flaggedStatus === 'Blacklisted').length,
    apps: apps.filter(a => a.unauthorizedAccessDetected).length,
    qrScams: upiScans.filter(u => u.isScam).length,
    blocked: blockedCallsCount + blockedMsgCount + blockedLnkCount + sandboxedAppsCount + blockedUpisCount,
  };

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-red-500 selection:text-white"
      style={{
        zoom: `${zoomLevel}%`,
      }}
    >
      {/* Device Shell Wrapper: When user switches to "Mobile View" on laptop */}
      <div
        className={`w-full flex-1 flex flex-col ${
          isMobileFrame
            ? 'max-w-md mx-auto my-4 sm:my-8 bg-slate-950 rounded-[40px] border-[10px] border-slate-900 shadow-2xl shadow-red-950/40 overflow-hidden ring-1 ring-red-500/30'
            : 'max-w-full'
        }`}
      >
        {/* If Mobile Phone Frame on laptop, render the top notch/speaker */}
        {isMobileFrame && (
          <div className="w-full bg-slate-900 py-1.5 flex items-center justify-center gap-3">
            <div className="w-12 h-1.5 rounded-full bg-slate-800" />
            <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-800" />
          </div>
        )}

        {/* Top Android Status Bar & Guard Header */}
        <AndroidHeader
          threatCount={
            threatCounts.messages +
            threatCounts.links +
            threatCounts.calls +
            threatCounts.apps +
            threatCounts.qrScams
          }
          isLocked={isBiometricLocked}
          onOpenBiometric={() => {
            if (isBiometricLocked) {
              setShowBiometricModal(true);
            } else {
              setIsBiometricLocked(true);
              soundAlert.playScanPing();
            }
          }}
          isMobileFrame={isMobileFrame}
          onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
          zoomLevel={zoomLevel}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          onOpenNotifications={() => {
            const topThreat = events.find(e => e.severity === 'CRITICAL');
            if (topThreat) setActiveAlertEvent(topThreat);
          }}
          unreadAlerts={threatCounts.messages + threatCounts.links + threatCounts.calls + threatCounts.qrScams}
          onOpenQrScanner={() => setActiveTab('qr_checker')}
        />

        {/* Navigation Sub-header / Tabs */}
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          threatCounts={threatCounts}
        />

        {/* Main Content View Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5">
          {activeTab === 'dashboard' && (
            <DashboardView
              messages={messages}
              links={links}
              calls={calls}
              apps={apps}
              events={events}
              upiScans={upiScans}
              onNavigate={setActiveTab}
              onSimulateThreatScan={handleSimulateCallScam}
            />
          )}

          {activeTab === 'qr_checker' && (
            <QrCheckerTab
              scannedQrs={upiScans}
              onAddNewScan={handleAddNewQrScan}
              onBlockVpa={handleBlockVpa}
              onUnblockVpa={handleUnblockVpa}
            />
          )}

          {activeTab === 'messages' && (
            <MessagesView
              messages={messages}
              onAddMessage={handleAddMessage}
              onQuarantineMessage={handleQuarantineMessage}
              onAllowMessage={handleAllowMessage}
            />
          )}

          {activeTab === 'links' && (
            <LinksScannerView
              links={links}
              onBlockLink={handleBlockLink}
              onWhitelistLink={handleWhitelistLink}
              onAddNewScannedLink={handleAddNewScannedLink}
            />
          )}

          {activeTab === 'calls' && (
            <CallsView
              calls={calls}
              onToggleBlacklist={handleToggleCallBlacklist}
              onSimulateVishingCall={handleSimulateCallScam}
            />
          )}

          {activeTab === 'apps' && (
            <AppPrivacyView
              apps={apps}
              onTogglePermission={handleToggleAppPermission}
              onToggleSandbox={handleToggleAppSandbox}
              onRunPrivacyAudit={handleRunPrivacyAudit}
              isAuditing={isAuditingApps}
            />
          )}

          {activeTab === 'blocked_items' && (
            <BlockedItemsView
              calls={calls}
              messages={messages}
              links={links}
              apps={apps}
              upiScans={upiScans}
              onUnblockCall={handleUnblockCall}
              onUnblockMessage={handleUnblockMessage}
              onUnblockLink={handleUnblockLink}
              onUnblockApp={handleUnblockApp}
              onUnblockVpa={handleUnblockVpa}
            />
          )}
        </main>

        {/* Android Navigation Bar when in Mobile View */}
        {isMobileFrame && (
          <div className="w-full bg-slate-950 py-3 border-t border-slate-900 flex items-center justify-around text-slate-500">
            <button
              onClick={() => setActiveTab('dashboard')}
              title="Android Back"
              className="p-1 hover:text-slate-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              title="Android Home"
              className="p-1 hover:text-slate-200 transition-colors"
            >
              <Circle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('blocked_items')}
              title="Android Overview / Recents"
              className="p-1 hover:text-slate-200 transition-colors"
            >
              <Square className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Footer Branding & Status */}
        <footer className="w-full bg-slate-950 border-t border-red-950/40 px-4 py-3 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-semibold text-slate-300">
              RED THREAD • Bharat Mobile Cyber Defense &amp; Scam Shield
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            National Cyber Crime Reporting Portal: <span className="text-red-400 font-bold">1930</span> • CERT-In Heuristics
          </div>
        </footer>
      </div>

      {/* Biometric Authentication Modal */}
      <BiometricModal
        isOpen={showBiometricModal}
        onClose={() => setShowBiometricModal(false)}
        onSuccess={() => setIsBiometricLocked(false)}
        isCurrentlyLocked={isBiometricLocked}
      />

      {/* Live In-Call OTP Scam Interceptor Modal */}
      <LiveCallOtpAlert
        isOpen={isLiveCallModalOpen}
        onClose={() => setIsLiveCallModalOpen(false)}
        onHangUpAndBlacklist={handleHangUpAndBlacklistFromCall}
        scenario={activeCallScenario}
      />

      {/* Real-time Threat Push Notification Toast */}
      <ThreatAlertToast
        event={activeAlertEvent}
        onDismiss={() => setActiveAlertEvent(null)}
        onViewEvent={evt => {
          if (evt.category === 'SMISHING') setActiveTab('messages');
          else if (evt.category === 'PHISHING_URL') setActiveTab('links');
          else if (evt.category === 'CALL_SCAM') setActiveTab('calls');
          else if (evt.category === 'APP_PRIVACY_LEAK') setActiveTab('apps');
          else if (evt.category === 'UPI_FRAUD') setActiveTab('qr_checker');
          else setActiveTab('dashboard');
          setActiveAlertEvent(null);
        }}
        onQuickQuarantine={evt => {
          soundAlert.playCriticalAlert();
          setActiveAlertEvent(null);
        }}
      />
    </div>
  );
}

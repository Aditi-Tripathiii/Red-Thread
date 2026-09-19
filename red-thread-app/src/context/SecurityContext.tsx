import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AnalysisRecord,
  ConsentSettings,
  EmailConnection,
  InstalledApp,
  RetentionPeriod,
  SourceType,
} from "../types";
import { MOCK_INSTALLED_APPS } from "../data/mockApps";
import { analyzeContentLocallyClient } from "../utils/localAnalyzer";
import { extractUrls, inspectUrlClient } from "../utils/urlInspector";
import { redactSensitiveData } from "../utils/redaction";
import { SAMPLE_SCENARIOS } from "../data/sampleScams";

interface SecurityContextType {
  history: AnalysisRecord[];
  installedApps: InstalledApp[];
  consent: ConsentSettings;
  emailAccounts: EmailConnection[];
  activeTab: "home" | "scan" | "alerts" | "audit" | "settings";
  setActiveTab: (tab: "home" | "scan" | "alerts" | "audit" | "settings") => void;
  deviceFrameMode: boolean;
  setDeviceFrameMode: (enabled: boolean) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  selectedAppForSecurity: InstalledApp | null;
  setSelectedAppForSecurity: (app: InstalledApp | null) => void;

  // Actions
  analyze: (
    content: string,
    sourceType?: SourceType,
    sender?: string,
    useCloud?: boolean
  ) => Promise<AnalysisRecord>;
  deleteRecord: (id: string) => void;
  deleteAllHistory: () => void;
  markAlertReviewed: (id: string) => void;
  reportFeedback: (id: string, feedback: "HELPFUL" | "INCORRECT" | "NOT_A_SCAM") => void;
  toggleAppExclusion: (packageName: string) => void;
  updateConsent: <K extends keyof ConsentSettings>(key: K, value: ConsentSettings[K]) => void;
  togglePauseProtection: (hours?: number) => void;
  triggerSimulatedAlert: (scenarioId?: string) => void;
  connectEmailAccount: (provider: "GMAIL" | "OUTLOOK") => void;
  disconnectEmailAccount: (id: string) => void;
  exportPrivacyReport: () => void;
  securityScore: number;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

const STORAGE_KEYS = {
  HISTORY: "redthread_history_v1",
  CONSENT: "redthread_consent_v1",
  EXCLUSIONS: "redthread_exclusions_v1",
};

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<"home" | "scan" | "alerts" | "audit" | "settings">("home");
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(false);
  const [selectedAppForSecurity, setSelectedAppForSecurity] = useState<InstalledApp | null>(null);

  // Consent settings
  const [consent, setConsent] = useState<ConsentSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONSENT);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      notificationMonitoring: true,
      smsMonitoring: true,
      emailMonitoring: false,
      callLogContext: true,
      cloudLlmAnalysis: false, // Default false per PRD NFR-004
      dataRetention: "30_DAYS",
      protectionPaused: false,
      pauseExpiresAt: null,
      onboardingCompleted: true,
    };
  });

  const [showOnboarding, setShowOnboarding] = useState<boolean>(!consent.onboardingCompleted);

  // Installed apps
  const [installedApps, setInstalledApps] = useState<InstalledApp[]>(() => {
    try {
      const savedExclusions = localStorage.getItem(STORAGE_KEYS.EXCLUSIONS);
      if (savedExclusions) {
        const excludedList: string[] = JSON.parse(savedExclusions);
        return MOCK_INSTALLED_APPS.map((app) => ({
          ...app,
          isExcludedFromMonitoring: excludedList.includes(app.packageName),
        }));
      }
    } catch {}
    return MOCK_INSTALLED_APPS;
  });

  // History & Live Alerts
  const [history, setHistory] = useState<AnalysisRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Seed initial mock detection alerts to showcase HeroUI dashboard immediately
    const initialSeed = [
      analyzeContentLocallyClient(
        SAMPLE_SCENARIOS[0].content,
        "SMS",
        ["http://sbi-kyc-update.xyz/login"],
        SAMPLE_SCENARIOS[0].sender,
        "com.google.android.apps.messaging",
        "Messages"
      ),
      analyzeContentLocallyClient(
        SAMPLE_SCENARIOS[2].content,
        "NOTIFICATION",
        [],
        SAMPLE_SCENARIOS[2].sender,
        "com.whatsapp",
        "WhatsApp"
      ),
      analyzeContentLocallyClient(
        SAMPLE_SCENARIOS[5].content,
        "SMS",
        [],
        SAMPLE_SCENARIOS[5].sender,
        "com.google.android.apps.messaging",
        "Messages"
      ),
    ];
    return initialSeed;
  });

  // Email Accounts
  const [emailAccounts, setEmailAccounts] = useState<EmailConnection[]>([
    {
      id: "email-gmail-1",
      provider: "GMAIL",
      accountDisplayName: "user.security@gmail.com",
      scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
      connectedAt: "2026-09-10",
      lastSyncAt: "10 mins ago",
      status: "CONNECTED",
    },
  ]);

  // Persist consent
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONSENT, JSON.stringify(consent));
    } catch {}
  }, [consent]);

  // Persist history
  useEffect(() => {
    try {
      if (consent.dataRetention === "NONE") {
        localStorage.removeItem(STORAGE_KEYS.HISTORY);
      } else {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
      }
    } catch {}
  }, [history, consent.dataRetention]);

  // Compute Security Score (0 - 100)
  const securityScore = React.useMemo(() => {
    let score = 100;
    if (consent.protectionPaused) score -= 40;
    if (!consent.notificationMonitoring) score -= 15;
    if (!consent.smsMonitoring) score -= 15;

    // Deduct for unreviewed high-risk alerts
    const unreviewedThreats = history.filter((h) => h.riskLevel === "HIGH" && !h.reviewed);
    score -= Math.min(30, unreviewedThreats.length * 8);

    // Deduct for apps with high attention or warnings
    const dangerousApps = installedApps.filter((a) => a.riskStatus === "HIGH_ATTENTION");
    score -= Math.min(25, dangerousApps.length * 10);

    return Math.max(10, Math.min(100, score));
  }, [consent, history, installedApps]);

  // Core Analyze Function
  const analyze = async (
    content: string,
    sourceType: SourceType = "MANUAL",
    sender: string = "User Input",
    forceCloud?: boolean
  ): Promise<AnalysisRecord> => {
    const urls = extractUrls(content);
    const { redactedText } = redactSensitiveData(content);
    const shouldCallCloud = forceCloud ?? consent.cloudLlmAnalysis;

    let finalRecord: AnalysisRecord;

    if (shouldCallCloud) {
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: redactedText,
            sourceType,
            urlCandidates: urls,
            allowCloud: true,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          finalRecord = {
            id: "cloud-" + Math.random().toString(36).substring(2, 9),
            sourceType,
            sender,
            originalContentSnippet: content.slice(0, 180) + (content.length > 180 ? "..." : ""),
            redactedContent: redactedText,
            riskLevel: data.riskLevel || "SUSPICIOUS",
            category: data.category || "PHISHING",
            urgency: data.urgency || "HIGH",
            sentimentSignals: data.sentimentSignals || ["URGENCY"],
            indicators: data.indicators || [],
            recommendedActions: data.recommendedActions || [],
            confidence: data.confidence || 0.9,
            uncertaintyReason: data.uncertaintyReason,
            needsHumanReview: data.needsHumanReview ?? true,
            createdAt: new Date().toISOString(),
            urlFindings: data.urlFindings || urls.map(inspectUrlClient),
            modelVersion: data.modelVersion || "gemini-3.8-flash-redthread",
            reviewed: false,
          };
        } else {
          // Fallback to local
          finalRecord = analyzeContentLocallyClient(content, sourceType, urls, sender);
        }
      } catch {
        finalRecord = analyzeContentLocallyClient(content, sourceType, urls, sender);
      }
    } else {
      // Local-only mode
      finalRecord = analyzeContentLocallyClient(content, sourceType, urls, sender);
    }

    // Save record if retention allows
    if (consent.dataRetention !== "NONE") {
      setHistory((prev) => [finalRecord, ...prev]);
    }

    return finalRecord;
  };

  const deleteRecord = (id: string) => {
    setHistory((prev) => prev.filter((r) => r.id !== id));
  };

  const deleteAllHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch {}
  };

  const markAlertReviewed = (id: string) => {
    setHistory((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reviewed: true } : r))
    );
  };

  const reportFeedback = async (
    id: string,
    feedback: "HELPFUL" | "INCORRECT" | "NOT_A_SCAM"
  ) => {
    setHistory((prev) =>
      prev.map((r) => (r.id === id ? { ...r, feedback } : r))
    );

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId: id, feedback }),
      });
    } catch {}
  };

  const toggleAppExclusion = (packageName: string) => {
    setInstalledApps((prev) => {
      const updated = prev.map((app) =>
        app.packageName === packageName
          ? { ...app, isExcludedFromMonitoring: !app.isExcludedFromMonitoring }
          : app
      );
      const excludedPackages = updated
        .filter((a) => a.isExcludedFromMonitoring)
        .map((a) => a.packageName);
      localStorage.setItem(STORAGE_KEYS.EXCLUSIONS, JSON.stringify(excludedPackages));
      return updated;
    });
  };

  const updateConsent = <K extends keyof ConsentSettings>(
    key: K,
    value: ConsentSettings[K]
  ) => {
    setConsent((prev) => ({ ...prev, [key]: value }));
  };

  const togglePauseProtection = (hours: number = 2) => {
    setConsent((prev) => {
      const willBePaused = !prev.protectionPaused;
      const pauseExpiresAt = willBePaused
        ? new Date(Date.now() + hours * 3600 * 1000).toISOString()
        : null;
      return {
        ...prev,
        protectionPaused: willBePaused,
        pauseExpiresAt,
      };
    });
  };

  const triggerSimulatedAlert = (scenarioId?: string) => {
    const scenario =
      SAMPLE_SCENARIOS.find((s) => s.id === scenarioId) ||
      SAMPLE_SCENARIOS[Math.floor(Math.random() * SAMPLE_SCENARIOS.length)];

    const urls = extractUrls(scenario.content);
    const newRecord = analyzeContentLocallyClient(
      scenario.content,
      scenario.sourceType,
      urls,
      scenario.sender,
      scenario.sourceType === "SMS" ? "com.google.android.apps.messaging" : "com.whatsapp",
      scenario.sourceType === "SMS" ? "Messages" : "WhatsApp"
    );

    setHistory((prev) => [newRecord, ...prev]);
    setActiveTab("alerts");
  };

  const connectEmailAccount = (provider: "GMAIL" | "OUTLOOK") => {
    const newConn: EmailConnection = {
      id: "email-" + Date.now(),
      provider,
      accountDisplayName: provider === "GMAIL" ? "personal.account@gmail.com" : "work.user@outlook.com",
      scopes: [
        provider === "GMAIL"
          ? "https://www.googleapis.com/auth/gmail.readonly"
          : "Mail.Read",
      ],
      connectedAt: new Date().toISOString().split("T")[0],
      lastSyncAt: "Just now",
      status: "CONNECTED",
    };
    setEmailAccounts((prev) => [newConn, ...prev.filter((c) => c.provider !== provider)]);
  };

  const disconnectEmailAccount = (id: string) => {
    setEmailAccounts((prev) => prev.filter((c) => c.id !== id));
  };

  const exportPrivacyReport = () => {
    const report = {
      product: "Red Thread",
      version: "1.0 MVP",
      exportTimestamp: new Date().toISOString(),
      privacyModel: "On-Device First & Zero Raw-Content Storage",
      consentState: consent,
      totalScansConducted: history.length,
      threatBreakdown: {
        highRisk: history.filter((h) => h.riskLevel === "HIGH").length,
        suspicious: history.filter((h) => h.riskLevel === "SUSPICIOUS").length,
        safe: history.filter((h) => h.riskLevel === "SAFE").length,
      },
      redactedRecordsSample: history.map((h) => ({
        id: h.id,
        category: h.category,
        urgency: h.urgency,
        riskLevel: h.riskLevel,
        createdAt: h.createdAt,
        redactedSnippet: h.redactedContent.slice(0, 100),
      })),
      installedAppsAudited: installedApps.length,
      excludedAppsCount: installedApps.filter((a) => a.isExcludedFromMonitoring).length,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `red-thread-privacy-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <SecurityContext.Provider
      value={{
        history,
        installedApps,
        consent,
        emailAccounts,
        activeTab,
        setActiveTab,
        deviceFrameMode,
        setDeviceFrameMode,
        showOnboarding,
        setShowOnboarding,
        selectedAppForSecurity,
        setSelectedAppForSecurity,
        analyze,
        deleteRecord,
        deleteAllHistory,
        markAlertReviewed,
        reportFeedback,
        toggleAppExclusion,
        updateConsent,
        togglePauseProtection,
        triggerSimulatedAlert,
        connectEmailAccount,
        disconnectEmailAccount,
        exportPrivacyReport,
        securityScore,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error("useSecurity must be used within a SecurityProvider");
  }
  return context;
}

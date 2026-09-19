/**
 * Red Thread - Core Type Definitions
 * Based on Product Requirements Document: Red Thread (v1.0 MVP)
 */

export type RiskLevel = "SAFE" | "NEEDS_CAUTION" | "SUSPICIOUS" | "HIGH";

export type ScamCategory =
  | "PHISHING"
  | "FAKE_BANK_REPRESENTATIVE"
  | "ACCOUNT_SUSPENSION"
  | "OTP_THEFT"
  | "UPI_FRAUD"
  | "DELIVERY_SCAM"
  | "INVESTMENT_SCAM"
  | "ROMANCE_SCAM"
  | "JOB_SCAM"
  | "GOVERNMENT_IMPERSONATION"
  | "TECH_SUPPORT"
  | "LOTTERY_SCAM"
  | "QR_CODE_SCAM"
  | "MALICIOUS_LINK"
  | "INVOICE_FRAUD"
  | "SAFE_INFORMATIONAL";

export type UrgencyLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type SentimentSignal =
  | "FEAR"
  | "PANIC"
  | "URGENCY"
  | "THREAT"
  | "PRESSURE"
  | "EXCITEMENT"
  | "SECRECY"
  | "AUTHORITY"
  | "GUILT"
  | "SYMPATHY"
  | "REWARD";

export type SourceType = "MANUAL" | "NOTIFICATION" | "SMS" | "EMAIL" | "SCREENSHOT";

export type RetentionPeriod = "NONE" | "7_DAYS" | "30_DAYS" | "90_DAYS" | "MANUAL";

export interface RiskIndicator {
  type: string;
  description: string;
}

export interface UrlInspectionResult {
  rawUrl: string;
  normalizedUrl: string;
  hostname: string;
  protocol: string;
  isShortener: boolean;
  isIpAddress: boolean;
  isImpersonating: boolean;
  flags: string[];
  riskLevel: "SAFE" | "SUSPICIOUS" | "HIGH";
}

export interface AnalysisRecord {
  id: string;
  sourceType: SourceType;
  sourceAppPackage?: string;
  sourceAppName?: string;
  sender?: string;
  originalContentSnippet: string;
  redactedContent: string;
  riskLevel: RiskLevel;
  category: ScamCategory;
  urgency: UrgencyLevel;
  sentimentSignals: SentimentSignal[];
  indicators: RiskIndicator[];
  recommendedActions: string[];
  confidence: number;
  uncertaintyReason?: string | null;
  needsHumanReview: boolean;
  createdAt: string;
  feedback?: "HELPFUL" | "INCORRECT" | "NOT_A_SCAM" | null;
  urlFindings?: UrlInspectionResult[];
  reviewed?: boolean;
  modelVersion?: string;
}

export interface InstalledApp {
  id: string;
  packageName: string;
  appName: string;
  category: "FINANCIAL" | "MESSAGING" | "UTILITY" | "SYSTEM" | "UNKNOWN";
  iconType: string;
  riskStatus: "PROTECTED" | "REVIEW_RECOMMENDED" | "HIGH_ATTENTION";
  installSource: "GOOGLE_PLAY" | "SIDELOADED_APK" | "SYSTEM";
  declaredPermissions: string[];
  riskyPermissions: {
    overlayAccess: boolean; // SYSTEM_ALERT_WINDOW
    accessibilityAccess: boolean; // BIND_ACCESSIBILITY_SERVICE
    notificationAccess: boolean;
    smsAccess: boolean;
    deviceAdmin: boolean;
  };
  warningCount: number;
  lastAuditDate: string;
  isExcludedFromMonitoring: boolean;
  financialSecuritySteps?: {
    appName: string;
    steps: string[];
    officialUrl: string;
    customerCare: string;
  };
}

export interface ConsentSettings {
  notificationMonitoring: boolean;
  smsMonitoring: boolean;
  emailMonitoring: boolean;
  callLogContext: boolean;
  cloudLlmAnalysis: boolean; // default false per NFR-004
  dataRetention: RetentionPeriod;
  protectionPaused: boolean;
  pauseExpiresAt?: string | null;
  onboardingCompleted: boolean;
}

export interface EmailConnection {
  id: string;
  provider: "GMAIL" | "OUTLOOK";
  accountDisplayName: string;
  scopes: string[];
  connectedAt: string;
  lastSyncAt: string;
  status: "CONNECTED" | "DISCONNECTED" | "SYNCING";
}

export interface RedactionResult {
  originalText: string;
  redactedText: string;
  redactedItems: Array<{
    type: "OTP" | "CARD" | "PIN" | "PASSWORD" | "BANK_ACCOUNT" | "UPI_ID" | "PHONE";
    placeholder: string;
    count: number;
  }>;
}

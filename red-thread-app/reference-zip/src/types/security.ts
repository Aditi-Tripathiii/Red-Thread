export type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type SentimentType =
  | 'Urgent/Manipulative'
  | 'Deceptive/Aggressive'
  | 'Anxious/Fearful'
  | 'Polite/Neutral'
  | 'Friendly/Positive';

export type PlatformType = 'SMS' | 'Telegram' | 'Gmail' | 'Outlook' | 'Messenger';

export interface ScannedMessage {
  id: string;
  sender: string;
  senderContactName?: string;
  platform: PlatformType;
  timestamp: string;
  content: string;
  sentiment: SentimentType;
  urgency: UrgencyLevel;
  threatType: string;
  isFraudulent: boolean;
  riskScore: number; // 0 - 100
  confidence: number;
  suspiciousElements: string[];
  extractedUrls: string[];
  analysis: string;
  recommendedAction: string;
  status: 'QUARANTINED' | 'FLAGGED' | 'ALLOWED' | 'RESOLVED';
}

export interface LinkThreat {
  id: string;
  url: string;
  domain: string;
  detectedOnPlatform: PlatformType;
  sourceMessageSnippet: string;
  timestamp: string;
  threatClassification: string;
  isSafe: boolean;
  riskScore: number;
  threatVectors: string[];
  tlsStatus: string;
  reputation: string;
  sandboxedPreview: string;
  status: 'BLOCKED' | 'WARNED' | 'WHITELISTED';
}

export interface CallLog {
  id: string;
  phoneNumber: string;
  contactName?: string;
  timestamp: string;
  callType: 'INCOMING' | 'MISSED' | 'BLOCKED';
  durationSeconds: number;
  threatCategory:
    | 'Voice Phishing / Call Scam'
    | 'Digital Arrest / CBI Impersonation'
    | 'Bank KYC / Aadhaar Freeze Scam'
    | 'Electricity Bill Disconnection Scam'
    | 'In-Call OTP Extraction Scam'
    | 'One-Ring Scam (Wangiri)'
    | 'Telemarketing Robocall'
    | 'Verified Safe'
    | 'Phishing or Scam';
  riskScore: number;
  flaggedStatus: 'Blacklisted' | 'Under Surveillance' | 'Cleared';
  correlatedSmishingCount: number;
  transcriptExcerpt?: string;
  notes: string;
}

export interface AppPermission {
  name: string;
  type: 'MICROPHONE' | 'CAMERA' | 'LOCATION_PRECISE' | 'LOCATION_BACKGROUND' | 'CONTACTS' | 'SMS_READ' | 'CLIPBOARD' | 'STORAGE';
  status: 'GRANTED' | 'REVOKED' | 'SANDBOXED';
  isHighRisk: boolean;
  lastAccessTime?: string;
}

export interface SocialMediaApp {
  id: string;
  appName: string;
  packageName: string;
  category: string;
  iconName: string;
  privacyRiskScore: number; // 0 - 100
  permissions: AppPermission[];
  unauthorizedAccessDetected: boolean;
  privacyLeaks: string[];
  backgroundActivityCount: number;
  trackersCount: number;
  isSandboxed: boolean;
}

export interface UpiPaymentPayload {
  id: string;
  rawQr: string;
  payeeVpa: string;
  payeeName: string;
  amount?: number;
  currency: string;
  merchantCode?: string;
  transactionRef?: string;
  transactionNote?: string;
  targetUrl?: string;
  isScam: boolean;
  riskScore: number; // 0 - 100
  verdict: 'CRITICAL_SCAM' | 'HIGH_RISK' | 'SUSPICIOUS' | 'VERIFIED_SAFE';
  scamType: string;
  redFlags: string[];
  recommendation: string;
  isBlocked: boolean;
  scannedAt: string;
}

export interface BlockedItem {
  id: string;
  type: 'CALL' | 'MESSAGE' | 'LINK' | 'APP_PERMISSION' | 'UPI_QR';
  title: string;
  identifier: string; // Phone number, Domain, Sender, App name, VPA
  threatReason: string;
  riskScore: number;
  blockedAt: string;
  sourceItemRef: any;
}

export interface ThreatEvent {
  id: string;
  timestamp: string;
  type:
    | 'SMISHING_BLOCKED'
    | 'SUSPICIOUS_LINK_ISOLATED'
    | 'CALL_SCAM_BLOCKED'
    | 'VISHING_CALL_REJECTED'
    | 'APP_PERMISSION_LEAK'
    | 'UPI_QR_SCAM_BLOCKED'
    | 'VAULT_ACCESS'
    | 'CLOUD_SYNC';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  title: string;
  description: string;
  category?: string;
  status?: 'OPEN' | 'RESOLVED';
  platform?: PlatformType;
  metadata?: Record<string, any>;
}

export interface EncryptedVaultLog {
  id: string;
  timestamp: string;
  incidentType: string;
  title: string;
  ivHex: string;
  cipherTextBase64: string;
  decryptedContent?: string;
  sha256Checksum: string;
  tags: string[];
}

export interface WeeklyVulnerabilityReport {
  reportId: string;
  generatedDate: string;
  overallStatus: string;
  healthScore: number;
  executiveSummary: string;
  topThreatsNeutralized: string[];
  activeVulnerabilities: string[];
  remediationActionItems: string[];
  complianceAudit: string;
}

export interface ServiceHealthData {
  status: string;
  service: string;
  version: string;
  uptimeSeconds: number;
  memoryMb: number;
  hasGeminiEngine: boolean;
  activeShields: {
    messageAnalysis: string;
    linkInspection: string;
    vishingForensics: string;
    appPrivacyAudit: string;
    encryptedVault: string;
  };
  timestamp: string;
}

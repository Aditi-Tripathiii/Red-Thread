import {
  AnalysisRecord,
  RiskIndicator,
  RiskLevel,
  ScamCategory,
  SentimentSignal,
  SourceType,
  UrgencyLevel,
} from "../types";
import { inspectUrlClient } from "./urlInspector";
import { redactSensitiveData } from "./redaction";

/**
 * Red Thread On-Device Local Rule Engine
 * Analyzes message text, links, and metadata entirely locally without network calls.
 */
export function analyzeContentLocallyClient(
  content: string,
  sourceType: SourceType = "MANUAL",
  urlCandidates: string[] = [],
  sender?: string,
  sourceAppPackage?: string,
  sourceAppName?: string
): AnalysisRecord {
  const text = (content || "").toLowerCase();
  const sentimentSignals: SentimentSignal[] = [];
  const indicators: RiskIndicator[] = [];
  const recommendedActions: string[] = [];
  let riskScore = 0;

  // Redact sensitive values
  const { redactedText } = redactSensitiveData(content);

  // 1. Fear, Threats & Law Enforcement Impersonation
  if (
    /(suspended|blocked|terminated|closed permanently|action will be taken|police|arrest|jail|legal action|court notice|cbi|rbi notice|cyber cell|enforcement directorate)/i.test(
      text
    )
  ) {
    sentimentSignals.push("FEAR", "THREAT", "AUTHORITY");
    indicators.push({
      type: "ACCOUNT_THREAT",
      description: "Threatens punitive legal action, arrest, or immediate permanent account deactivation.",
    });
    riskScore += 35;
  }

  // 2. Urgent Time Pressure & Deadlines
  if (
    /(within 24 hours|within 2 hours|immediate|urgently|expire today|expires today|act now|last warning|final reminder|deadline)/i.test(
      text
    )
  ) {
    sentimentSignals.push("URGENCY", "PRESSURE");
    indicators.push({
      type: "URGENCY_PRESSURE",
      description: "Applies severe time pressure to force hasty action before independent verification.",
    });
    riskScore += 25;
  }

  // 3. Credential, PIN & OTP Requests (Critical Scam Flag)
  if (
    /(otp|one time password|pin|mpin|cvv|password|passcode|secret code|verification code|share your code|enter pin to receive)/i.test(
      text
    )
  ) {
    sentimentSignals.push("PRESSURE");
    indicators.push({
      type: "CREDENTIAL_SOLICITATION",
      description: "Directly or indirectly solicits confidential credentials (OTP, MPIN, CVV, or passwords).",
    });
    riskScore += 45;
  }

  // 4. Fake Banking / KYC / PAN Demands
  if (
    /(pan card blocked|kyc expired|update kyc|link aadhaar|submit documents|yono sbi|sbi reward|points expire|hdfc netbanking)/i.test(
      text
    )
  ) {
    sentimentSignals.push("AUTHORITY");
    indicators.push({
      type: "FAKE_KYC_HOOK",
      description: "Uses urgent KYC or PAN compliance alert to impersonate a banking institution.",
    });
    riskScore += 30;
  }

  // 5. UPI / Payment / Collect Request Traps
  if (
    /(enter pin to receive money|won cash prize|lottery|crorepati|congratulations you won|refund claim|electricity power cutoff|bill unpaid)/i.test(
      text
    )
  ) {
    sentimentSignals.push("REWARD", "EXCITEMENT");
    indicators.push({
      type: "PAYMENT_OR_REFUND_TRAP",
      description: "Offers unearned cash prizes, fake refunds, or falsely claims entering a UPI PIN receives money.",
    });
    riskScore += 35;
  }

  // 6. Remote Access Trojan or APK Download Requests
  if (
    /(\.apk|install anydesk|download teamviewer|quicksupport|rustdesk|screen share|custom app)/i.test(
      text
    )
  ) {
    sentimentSignals.push("SECRECY", "AUTHORITY");
    indicators.push({
      type: "MALICIOUS_APP_SOLICITATION",
      description: "Instructs installing unverified APK or screen-sharing tools granting complete remote phone control.",
    });
    riskScore += 45;
  }

  // 7. Job / Part-time / Telegram Tasks Fraud
  if (
    /(work from home|earn 5000 daily|part time job|like youtube videos|telegram task|crypto investment|double your money)/i.test(
      text
    )
  ) {
    sentimentSignals.push("REWARD", "EXCITEMENT");
    indicators.push({
      type: "EMPLOYMENT_INVESTMENT_FRAUD",
      description: "Promotes unrealistic daily earnings or Telegram tasks typical of task-based payment scams.",
    });
    riskScore += 30;
  }

  // URL Safety inspection
  const inspectedUrls = urlCandidates.map(inspectUrlClient);
  const highRiskUrls = inspectedUrls.filter((u) => u.riskLevel === "HIGH");
  const suspiciousUrls = inspectedUrls.filter((u) => u.riskLevel === "SUSPICIOUS");

  if (highRiskUrls.length > 0) {
    riskScore += 40;
    indicators.push({
      type: "MALICIOUS_URL",
      description: `Contains dangerous domain (${highRiskUrls.map((u) => u.hostname).join(", ")}) showing deceptive impersonation.`,
    });
  } else if (suspiciousUrls.length > 0) {
    riskScore += 20;
    indicators.push({
      type: "SUSPICIOUS_LINK",
      description: "Contains shortened or high-abuse top-level domains that obscure the final destination.",
    });
  }

  // Determine Category
  let category: ScamCategory = "SAFE_INFORMATIONAL";
  if (/(apk|anydesk|teamviewer|rustdesk)/i.test(text) && riskScore > 30) {
    category = "TECH_SUPPORT";
  } else if (/(pan|kyc|aadhaar|account suspended)/i.test(text) && riskScore > 30) {
    category = "ACCOUNT_SUSPENSION";
  } else if (/(otp|cvv|pin|mpin)/i.test(text) && riskScore > 30) {
    category = "OTP_THEFT";
  } else if (/(upi|collect|refund|electricity|bill)/i.test(text) && riskScore > 30) {
    category = "UPI_FRAUD";
  } else if (/(lottery|prize|won|crore|lucky)/i.test(text) && riskScore > 30) {
    category = "LOTTERY_SCAM";
  } else if (/(courier|delivery|fedex|dhl|parcel|post)/i.test(text) && riskScore > 30) {
    category = "DELIVERY_SCAM";
  } else if (/(job|daily earn|part time|telegram)/i.test(text) && riskScore > 30) {
    category = "JOB_SCAM";
  } else if (/(crypto|invest|trade|double)/i.test(text) && riskScore > 30) {
    category = "INVESTMENT_SCAM";
  } else if (/(police|cbi|rbi|customs|court)/i.test(text) && riskScore > 30) {
    category = "GOVERNMENT_IMPERSONATION";
  } else if (highRiskUrls.length > 0 || suspiciousUrls.length > 0) {
    category = "PHISHING";
  }

  // Urgency classification
  let urgency: UrgencyLevel = "LOW";
  if (riskScore >= 70) urgency = "CRITICAL";
  else if (riskScore >= 45) urgency = "HIGH";
  else if (riskScore >= 20) urgency = "MEDIUM";

  // Risk Level
  let riskLevel: RiskLevel = "SAFE";
  if (riskScore >= 55) riskLevel = "HIGH";
  else if (riskScore >= 25) riskLevel = "SUSPICIOUS";
  else if (riskScore > 0) riskLevel = "NEEDS_CAUTION";

  // Clean sentiment signals
  const uniqueSentiments = Array.from(new Set(sentimentSignals));
  if (uniqueSentiments.length === 0) {
    uniqueSentiments.push("REWARD");
  }

  // Recommended actions
  if (riskLevel === "HIGH") {
    recommendedActions.push("Do not tap any links or open downloaded attachments.");
    recommendedActions.push("Never disclose OTPs, UPI PINs, banking passwords, or card CVVs.");
    recommendedActions.push("Do not call phone numbers provided inside the suspicious message.");
    recommendedActions.push("Verify your account status by opening your official bank app directly.");
  } else if (riskLevel === "SUSPICIOUS") {
    recommendedActions.push("Exercise strong caution before replying or providing personal details.");
    recommendedActions.push("Inspect sender address and verify links before clicking.");
    recommendedActions.push("Reach out through official support channels if in doubt.");
  } else {
    recommendedActions.push("No immediate red flags detected, but remain cautious with unsolicited messages.");
    recommendedActions.push("Remember: Banks and government departments never ask for PINs or OTPs.");
  }

  return {
    id: "scan-" + Math.random().toString(36).substring(2, 9),
    sourceType,
    sourceAppPackage,
    sourceAppName,
    sender: sender || "Direct Input",
    originalContentSnippet: content.slice(0, 180) + (content.length > 180 ? "..." : ""),
    redactedContent: redactedText,
    riskLevel,
    category,
    urgency,
    sentimentSignals: uniqueSentiments,
    indicators,
    recommendedActions,
    confidence: Math.min(0.96, Math.max(0.68, 0.55 + riskScore / 130)),
    uncertaintyReason:
      riskScore > 20 && riskScore < 45
        ? "Some ambiguous signals present. Always independently confirm with the sender."
        : null,
    needsHumanReview: riskLevel !== "SAFE",
    createdAt: new Date().toISOString(),
    urlFindings: inspectedUrls,
    modelVersion: "on-device-rule-engine-v1",
    reviewed: false,
  };
}

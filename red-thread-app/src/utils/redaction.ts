import { RedactionResult } from "../types";

/**
 * Red Thread - Privacy-First Redaction Pipeline
 * Strictly strips sensitive personal data (OTPs, PINs, CVVs, Card Numbers,
 * Bank Accounts, Passwords) before content leaves the device or enters logs.
 */
export function redactSensitiveData(text: string): RedactionResult {
  if (!text) {
    return { originalText: "", redactedText: "", redactedItems: [] };
  }

  let redacted = text;
  const counts: Record<string, number> = {
    OTP: 0,
    CARD: 0,
    PIN: 0,
    PASSWORD: 0,
    BANK_ACCOUNT: 0,
    UPI_ID: 0,
    PHONE: 0,
  };

  // 1. Credit / Debit Card Numbers (13-19 digits, possibly hyphen or space separated)
  const cardRegex = /\b(?:\d{4}[ -]?){3}\d{4}\b|\b(?:\d{4}[ -]?){2}\d{4}[ -]?\d{3}\b/g;
  redacted = redacted.replace(cardRegex, () => {
    counts.CARD++;
    return "[REDACTED_CARD]";
  });

  // 2. Passwords / PINs in explicit key-value pairs
  const pinPairRegex = /(?:pin|mpin|cvv|cvc|password|passcode)\s*(?::|is|=|to)\s*([0-9a-zA-Z!@#$%^&*]{3,16})/gi;
  redacted = redacted.replace(pinPairRegex, (match, p1) => {
    counts.PIN++;
    return match.replace(p1, "[REDACTED_PIN]");
  });

  // 3. OTPs (4-8 digits near "otp", "code", "verification", "one-time password", "secret")
  const otpContextRegex = /(?:otp|code|verification code|one time password|secret code)\s*(?:is|:|-)?\s*([0-9]{4,8})\b/gi;
  redacted = redacted.replace(otpContextRegex, (match, p1) => {
    counts.OTP++;
    return match.replace(p1, "[REDACTED_OTP]");
  });

  // 4. Standalone OTP patterns like "Use 849201 to authenticate" or "Your code is 4920"
  const standaloneOtpRegex = /\b(?:use|enter|code\s+is)\s+([0-9]{4,8})\b/gi;
  redacted = redacted.replace(standaloneOtpRegex, (match, p1) => {
    counts.OTP++;
    return match.replace(p1, "[REDACTED_OTP]");
  });

  // 5. Bank Account Numbers (9 to 18 contiguous digits)
  const bankAccRegex = /(?:a\/c|account|acct|acc\.?)\s*(?:no\.?|number)?\s*[:\s-]*([0-9]{9,18})/gi;
  redacted = redacted.replace(bankAccRegex, (match, p1) => {
    counts.BANK_ACCOUNT++;
    return match.replace(p1, "[REDACTED_ACCOUNT]");
  });

  // 6. Generic UPI IDs (e.g., user@okhdfcbank, mobile@upi)
  const upiRegex = /[a-zA-Z0-9._-]{3,25}@(okaxis|okhdfcbank|oksbi|okicici|paytm|ybl|ibl|upi|apl|axl)/gi;
  redacted = redacted.replace(upiRegex, () => {
    counts.UPI_ID++;
    return "[REDACTED_UPI_ID]";
  });

  // Build report list
  const redactedItems = Object.entries(counts)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => ({
      type: type as any,
      placeholder: `[REDACTED_${type}]`,
      count,
    }));

  return {
    originalText: text,
    redactedText: redacted,
    redactedItems,
  };
}

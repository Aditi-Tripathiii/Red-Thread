import { UrlInspectionResult } from "../types";

/**
 * Extract all HTTP/HTTPS and bare domain URLs from a given text.
 */
export function extractUrls(text: string): string[] {
  if (!text) return [];

  // Match URLs starting with http://, https://, or www. or domain.tld patterns
  const urlRegex = /(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*|[a-zA-Z0-9-]+\.(?:com|in|org|net|xyz|top|site|club|vip|online|live|click|app|shop|co|cc|io)(?:\/[^\s]*)?/gi;
  const matches = text.match(urlRegex) || [];

  return Array.from(new Set(matches.map((u) => u.replace(/[.,;!?)]+$/, ""))));
}

/**
 * Normalizes and analyzes a candidate URL for risk markers.
 */
export function inspectUrlClient(rawUrl: string): UrlInspectionResult {
  try {
    let normalized = rawUrl.trim();
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = "https://" + normalized;
    }
    const parsed = new URL(normalized);
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();

    const shorteners = [
      "bit.ly",
      "tinyurl.com",
      "t.co",
      "is.gd",
      "cutt.ly",
      "rb.gy",
      "shorturl.at",
      "ow.ly",
      "v.gd",
    ];
    const isShortener = shorteners.some((s) => hostname === s || hostname.endsWith("." + s));

    const suspiciousTlds = [
      ".xyz",
      ".top",
      ".club",
      ".vip",
      ".work",
      ".click",
      ".link",
      ".buzz",
      ".cam",
      ".rest",
      ".online",
      ".site",
      ".cfd",
      ".icu",
    ];
    const hasSuspiciousTld = suspiciousTlds.some((tld) => hostname.endsWith(tld));

    const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);

    const highRiskKeywords = [
      "kyc",
      "sbi",
      "paytm",
      "bank",
      "login",
      "verify",
      "secure",
      "claim",
      "reward",
      "lottery",
      "apk",
      "refund",
      "upi",
      "yono",
      "aadhar",
      "pan",
      "blocked",
    ];
    const matchedKeywords = highRiskKeywords.filter(
      (kw) => hostname.includes(kw) || pathname.includes(kw)
    );

    const legitimateDomains = [
      "sbi.co.in",
      "onlinesbi.sbi",
      "paytm.com",
      "phonepe.com",
      "google.com",
      "hdfcbank.com",
      "icicibank.com",
      "amazon.in",
      "amazon.com",
      "flipkart.com",
      "rbi.org.in",
      "incometax.gov.in",
      "uidai.gov.in",
    ];
    const isImpersonating =
      matchedKeywords.length > 0 &&
      !legitimateDomains.some((legit) => hostname === legit || hostname.endsWith("." + legit));

    let riskLevel: "SAFE" | "SUSPICIOUS" | "HIGH" = "SAFE";
    const flags: string[] = [];

    if (isShortener) {
      riskLevel = "SUSPICIOUS";
      flags.push("Shortened URL masks true target destination");
    }
    if (hasSuspiciousTld) {
      riskLevel = "SUSPICIOUS";
      flags.push("Uses high-risk top-level domain frequently associated with fraud");
    }
    if (isIpAddress) {
      riskLevel = "HIGH";
      flags.push("Direct numerical IP host instead of verified registered domain");
    }
    if (isImpersonating) {
      riskLevel = "HIGH";
      flags.push(
        `Brand keywords (${matchedKeywords.slice(0, 3).join(", ")}) in domain, but not hosted on official bank domain`
      );
    }
    if (parsed.protocol === "http:") {
      flags.push("Unencrypted HTTP connection — risk of credential interception");
      if (riskLevel === "SAFE") riskLevel = "SUSPICIOUS";
    }

    // Check for APK extension
    if (pathname.endsWith(".apk")) {
      riskLevel = "HIGH";
      flags.push("Direct download link for an Android package (.apk) bypassing Google Play Store");
    }

    return {
      rawUrl,
      normalizedUrl: normalized,
      hostname,
      protocol: parsed.protocol,
      isShortener,
      isIpAddress,
      isImpersonating,
      flags,
      riskLevel,
    };
  } catch {
    return {
      rawUrl,
      normalizedUrl: rawUrl,
      hostname: "unknown",
      protocol: "unknown",
      isShortener: false,
      isIpAddress: false,
      isImpersonating: false,
      flags: ["Malformed or invalid URL syntax"],
      riskLevel: "SUSPICIOUS",
    };
  }
}

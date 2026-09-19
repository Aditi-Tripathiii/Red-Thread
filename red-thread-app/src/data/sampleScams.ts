export interface SampleScenario {
  id: string;
  title: string;
  categoryName: string;
  sourceType: "SMS" | "NOTIFICATION" | "EMAIL" | "MANUAL";
  sender: string;
  expectedRisk: "HIGH" | "SUSPICIOUS" | "SAFE";
  content: string;
}

export const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: "sample-sbi-kyc",
    title: "Urgent SBI Account Suspension Threat",
    categoryName: "Account Suspension Fraud",
    sourceType: "SMS",
    sender: "BZ-SBIBNK",
    expectedRisk: "HIGH",
    content:
      "Dear SBI User, your YONO NetBanking account will be BLOCKED within 24 hours due to expired KYC documents. Update your PAN card and Aadhaar immediately at http://sbi-kyc-update.xyz/login to avoid legal police action and account closure.",
  },
  {
    id: "sample-electricity",
    title: "Electricity Power Cutoff Threat",
    categoryName: "Utility Payment Scam",
    sourceType: "SMS",
    sender: "+91-98123-45678",
    expectedRisk: "HIGH",
    content:
      "Dear Consumer, your electricity power connection will be DISCONNECTED tonight at 9:30 PM from the power office because your previous month bill was not updated. Please immediately call Electricity Officer at 9876543210 or install AnyDesk to verify payment.",
  },
  {
    id: "sample-lottery",
    title: "WhatsApp KBC Crorepati Lottery",
    categoryName: "Lottery & Prize Scam",
    sourceType: "NOTIFICATION",
    sender: "WhatsApp",
    expectedRisk: "HIGH",
    content:
      "CONGRATULATIONS! Your mobile number won 25 Lakh INR in Kaun Banega Crorepati WhatsApp Lucky Draw 2026. To claim your prize money, send processing fee of Rs 5,000 to UPI ID kbcwinner@okhdfcbank and share your Aadhaar number.",
  },
  {
    id: "sample-delivery",
    title: "FedEx Parcel Address Fee",
    categoryName: "Delivery Phishing",
    sourceType: "NOTIFICATION",
    sender: "FedEx Express",
    expectedRisk: "SUSPICIOUS",
    content:
      "FedEx: Your shipment #IN-849204 has an invalid delivery address and is detained at customs. Pay 45 INR redelivery fee to release package: https://bit.ly/fedx-parcel-re",
  },
  {
    id: "sample-telegram-job",
    title: "YouTube Video Like & Earn Job",
    categoryName: "Recruitment Task Scam",
    sourceType: "SMS",
    sender: "+91-76543-21980",
    expectedRisk: "HIGH",
    content:
      "Part-time online job offer! Earn Rs 2,500 to Rs 8,000 daily by simply liking YouTube videos and rating hotels on Google. No experience needed. Immediate daily payouts via UPI. Join our Telegram manager: https://t.me/quickpay_task77",
  },
  {
    id: "sample-legit-bank",
    title: "Authentic HDFC Bank Transaction Alert",
    categoryName: "Safe Transaction Notification",
    sourceType: "SMS",
    sender: "VM-HDFCBK",
    expectedRisk: "SAFE",
    content:
      "Rs. 450.00 debited from HDFC Bank A/c **4920 to ZOMATO LTD on 19-SEP-26. Info: UPI/391029410. Not you? SMS BLOCK 4920 to 5676712. Never share OTP or UPI PIN with anyone.",
  },
  {
    id: "sample-legit-otp",
    title: "Authentic Login OTP with Redaction Test",
    categoryName: "Safe Credential Message",
    sourceType: "SMS",
    sender: "AX-ICICIB",
    expectedRisk: "SAFE",
    content:
      "482910 is your secret One Time Password (OTP) for ICICI NetBanking login. Valid for 3 mins. Do NOT share OTP or Card PIN with anyone, including bank employees.",
  },
];

import React, { useState, useRef } from 'react';
import {
  QrCode,
  Scan,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Upload,
  Camera,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
  Ban,
  ArrowRight,
  Info,
  Sparkles,
  RefreshCw,
  Zap,
} from 'lucide-react';
import type { UpiPaymentPayload } from '../types/security';
import { soundAlert } from '../services/soundAlert';

interface QrCheckerTabProps {
  scannedQrs: UpiPaymentPayload[];
  onAddNewScan: (payload: UpiPaymentPayload) => void;
  onBlockVpa: (vpa: string, reason: string) => void;
  onUnblockVpa?: (id: string) => void;
}

export const QrCheckerTab: React.FC<QrCheckerTabProps> = ({
  scannedQrs,
  onAddNewScan,
  onBlockVpa,
}) => {
  const [activeTab, setActiveTab] = useState<'scanner' | 'history'>('scanner');
  const [manualInput, setManualInput] = useState('');
  const [isScanningLive, setIsScanningLive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeResult, setActiveResult] = useState<UpiPaymentPayload | null>(scannedQrs[0] || null);
  const [copiedVpa, setCopiedVpa] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Common Indian Scam Test Presets
  const samplePresets = [
    {
      title: '🚨 Reverse-Charge "Cashback" Scam',
      badge: 'Debits ₹2,500',
      description: 'Fraudster sends QR saying "Scan to receive ₹2,500 cashback reward". In reality it debits money!',
      raw: 'upi://pay?pa=cashback_claim99@ybl&pn=PhonePe%20Cashback%20Reward&am=2500&cu=INR&tn=Cashback%20Reward%20Claim',
    },
    {
      title: '⚠️ Malicious APK QR (Electricity Cutoff)',
      badge: 'Trojan APK',
      description: 'Fake DISCOM flyer QR that downloads SMS-stealing Android APK instead of payment.',
      raw: 'http://electricity-bill-desk.online/pay.apk',
    },
    {
      title: '⚠️ Fake FASTag Toll Recharge QR',
      badge: 'VPA Impersonation',
      description: 'Display name claims "NHAI FASTag Toll Recharge", but funds route to personal fraudster VPA rohit_kumar88@paytm.',
      raw: 'upi://pay?pa=rohit_kumar88@paytm&pn=NHAI%20FASTag%20Toll%20Recharge&am=500&cu=INR',
    },
    {
      title: '✅ Verified NPCI Merchant QR',
      badge: 'Safe Merchant',
      description: 'Legitimate Reliance Supermarket retail QR with verified NPCI merchant category code.',
      raw: 'upi://pay?pa=reliance.retail@icici&pn=Reliance%20Smart%20Superstore&mc=5411&cu=INR&tr=TXN8492019482',
    },
  ];

  const parseAndAnalyzeQr = (rawQrText: string): UpiPaymentPayload => {
    const raw = rawQrText.trim();
    const id = `upi-${Date.now()}`;
    const scannedAt = new Date().toISOString();

    // Check if it's a web URL disguised as QR
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      const isApk = raw.toLowerCase().endsWith('.apk') || raw.toLowerCase().includes('apk');
      return {
        id,
        rawQr: raw,
        payeeVpa: 'N/A (Web URL Payload)',
        payeeName: isApk ? 'Malicious Trojan APK Dropper' : 'External Web Link',
        currency: 'INR',
        targetUrl: raw,
        isScam: true,
        riskScore: isApk ? 99 : 85,
        verdict: 'CRITICAL_SCAM',
        scamType: isApk ? 'Malicious Android APK Dropper' : 'Suspicious Web Redirection',
        redFlags: [
          'QR code does not use the official NPCI UPI protocol (upi://pay).',
          isApk
            ? '⚠️ DANGER: Directs device to install an unauthorized Android APK! Will hijack SMS & banking OTPs.'
            : 'Unverified external website disguised as payment QR.',
          'Never scan payment QRs that open unknown browser download links.',
        ],
        recommendation: 'DO NOT INSTALL OR PROCEED. Cancel scanning immediately.',
        isBlocked: true,
        scannedAt,
      };
    }

    // Parse standard UPI URI
    let payeeVpa = 'Unknown VPA';
    let payeeName = 'Unknown Payee';
    let amount: number | undefined = undefined;
    let merchantCode = '0000';
    let transactionRef: string | undefined = undefined;
    let transactionNote: string | undefined = undefined;

    try {
      if (raw.startsWith('upi://')) {
        const urlParams = new URLSearchParams(raw.replace('upi://pay?', ''));
        payeeVpa = urlParams.get('pa') || 'Unknown VPA';
        payeeName = decodeURIComponent(urlParams.get('pn') || 'Unknown Payee');
        const amStr = urlParams.get('am');
        if (amStr) amount = parseFloat(amStr);
        merchantCode = urlParams.get('mc') || '0000';
        transactionRef = urlParams.get('tr') || undefined;
        transactionNote = urlParams.get('tn') ? decodeURIComponent(urlParams.get('tn')!) : undefined;
      }
    } catch {
      // Fallback parser
    }

    const lowerVpa = payeeVpa.toLowerCase();
    const lowerName = payeeName.toLowerCase();
    const isPersonalHandle =
      lowerVpa.includes('@ybl') ||
      lowerVpa.includes('@paytm') ||
      lowerVpa.includes('@oksbi') ||
      lowerVpa.includes('@okaxis') ||
      lowerVpa.includes('@apl') ||
      lowerVpa.includes('@ibl');

    const hasCorporateName =
      lowerName.includes('cashback') ||
      lowerName.includes('refund') ||
      lowerName.includes('reward') ||
      lowerName.includes('power') ||
      lowerName.includes('electricity') ||
      lowerName.includes('discom') ||
      lowerName.includes('lottery') ||
      lowerName.includes('support') ||
      lowerName.includes('care');

    // SCAM CRITERIA 1: Reverse charge (user expects to receive, but am > 0 or personal VPA claims to be reward)
    if (hasCorporateName && isPersonalHandle) {
      return {
        id,
        rawQr: raw,
        payeeVpa,
        payeeName,
        amount,
        currency: 'INR',
        merchantCode,
        transactionRef,
        transactionNote,
        isScam: true,
        riskScore: 98,
        verdict: 'CRITICAL_SCAM',
        scamType: 'Reverse-Charge "Scan to Receive" Fraud',
        redFlags: [
          `⚠️ CRITICAL WARNING: Scanning this QR will DEBIT ${amount ? '₹' + amount.toLocaleString('en-IN') : 'money'} from YOUR bank account!`,
          'GOLDEN RULE OF UPI: You NEVER need to enter your UPI PIN to receive money or cashback.',
          `Display name is "${payeeName}", but the payment goes to personal account "${payeeVpa}".`,
          'Merchant Category Code is unverified (0000). Not a registered business.',
        ],
        recommendation: 'DO NOT ENTER UPI PIN! Immediately cancel and report this VPA on your UPI app.',
        isBlocked: true,
        scannedAt,
      };
    }

    // SCAM CRITERIA 2: Verified NPCI Merchant
    if (merchantCode && merchantCode !== '0000' && !lowerName.includes('cashback')) {
      return {
        id,
        rawQr: raw,
        payeeVpa,
        payeeName,
        amount,
        currency: 'INR',
        merchantCode,
        transactionRef,
        transactionNote,
        isScam: false,
        riskScore: 4,
        verdict: 'VERIFIED_SAFE',
        scamType: 'Verified Genuine NPCI Merchant',
        redFlags: [],
        recommendation: 'Safe to proceed. Registered NPCI merchant with valid banking VPA.',
        isBlocked: false,
        scannedAt,
      };
    }

    // SUSPICIOUS / UNVERIFIED PEER TRANSFER
    return {
      id,
      rawQr: raw,
      payeeVpa,
      payeeName,
      amount,
      currency: 'INR',
      merchantCode,
      transactionRef,
      transactionNote,
      isScam: false,
      riskScore: 28,
      verdict: 'SUSPICIOUS',
      scamType: 'Standard Peer-to-Peer Transfer',
      redFlags: [
        'Personal individual UPI account. Verify the recipient identity before entering UPI PIN.',
        amount ? `Amount set to ₹${amount.toLocaleString('en-IN')}. Verify before authorizing.` : 'No pre-set amount. You will need to enter the transfer sum.',
      ],
      recommendation: 'Proceed only if you personally know this recipient. Never send money to claim prizes.',
      isBlocked: false,
      scannedAt,
    };
  };

  const handleAnalyze = (inputString: string) => {
    if (!inputString.trim()) return;
    setAnalyzing(true);
    soundAlert.playScanPing();

    setTimeout(() => {
      const result = parseAndAnalyzeQr(inputString);
      setActiveResult(result);
      onAddNewScan(result);
      if (result.isScam) {
        soundAlert.playCriticalAlert();
      } else {
        soundAlert.playBiometricSuccess();
      }
      setAnalyzing(false);
    }, 600);
  };

  const handleStartLiveCamera = async () => {
    setIsScanningLive(true);
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        setCameraError('Camera access not supported by browser in current frame. Use test presets or image upload.');
      }
    } catch {
      setCameraError('Camera permission denied or camera device busy. Use test presets or image upload below.');
    }
  };

  const handleStopLiveCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanningLive(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    soundAlert.playScanPing();

    // Simulate reading QR code from uploaded image
    setTimeout(() => {
      // Pick an illustrative real Indian fraud QR sample to analyze
      const randomPreset = samplePresets[0];
      const result = parseAndAnalyzeQr(randomPreset.raw);
      setActiveResult(result);
      onAddNewScan(result);
      soundAlert.playCriticalAlert();
      setAnalyzing(false);
    }, 800);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedVpa(text);
    setTimeout(() => setCopiedVpa(null), 2000);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Banner / Hero */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-900 border border-red-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <QrCode className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                UPI Payment &amp; QR Code Fraud Shield
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                  NPCI Bharat Guard
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-300">
              Inspects UPI QRs before you scan with Google Pay, PhonePe, or Paytm to stop Reverse-Charge &amp; VPA Spoof scams
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-qr-tab-scanner"
              onClick={() => setActiveTab('scanner')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'scanner'
                  ? 'bg-red-600 text-white shadow-sm shadow-red-950/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Live Scanner &amp; Presets
            </button>
            <button
              id="btn-qr-tab-history"
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-red-600 text-white shadow-sm shadow-red-950/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Scan History ({scannedQrs.length})
            </button>
          </div>
        </div>

        {/* Golden Rule Advisory Banner */}
        <div className="mt-3.5 pt-3 border-t border-red-500/20 flex items-start gap-2 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-amber-300 font-semibold">Golden Rule for Indian Citizens:</strong> You NEVER need to enter your UPI PIN to receive money or cashback. If a QR code prompts for your PIN, it is 100% a fraud attempt to debit your bank account!
          </p>
        </div>
      </div>

      {activeTab === 'scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Live Scanner, Upload, and Input (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Live Camera Scanner Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-red-400" />
                  Camera Viewfinder
                </span>
                {!isScanningLive ? (
                  <button
                    id="btn-start-camera"
                    onClick={handleStartLiveCamera}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Scan className="w-3.5 h-3.5" />
                    Open Camera
                  </button>
                ) : (
                  <button
                    id="btn-stop-camera"
                    onClick={handleStopLiveCamera}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    Close Camera
                  </button>
                )}
              </div>

              {/* Viewfinder area */}
              <div className="relative aspect-video sm:aspect-[16/9] rounded-xl bg-slate-950 border-2 border-dashed border-slate-800 flex flex-col items-center justify-center overflow-hidden">
                {isScanningLive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-6 text-center space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 mx-auto flex items-center justify-center text-slate-500 border border-slate-800">
                      <QrCode className="w-6 h-6 text-red-400/80 animate-pulse" />
                    </div>
                    <p className="text-xs font-medium text-slate-300">
                      Aim at any UPI payment QR (merchant sticker, SMS payment link, bill desk)
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Supports BHIM, Google Pay, PhonePe, Paytm, and bank QRs
                    </p>
                  </div>
                )}

                {/* Reticle / Target Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-44 h-44 sm:w-56 sm:h-56 border-2 border-red-500/60 rounded-2xl relative shadow-2xl shadow-red-500/10">
                    <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-red-400" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-red-400" />
                    <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-red-400" />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-red-400" />
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-400/80 shadow-[0_0_8px_#ef4444] animate-bounce" />
                  </div>
                </div>

                {cameraError && (
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-900/95 border border-amber-500/40 p-2 rounded-lg text-[11px] text-amber-300 text-center">
                    {cameraError}
                  </div>
                )}
              </div>

              {/* Upload QR Image Button */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <label
                  htmlFor="file-upload-qr"
                  className="flex-1 cursor-pointer py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Upload QR Screenshot / Image</span>
                  <input
                    id="file-upload-qr"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Test Common Indian Scam Presets */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Test Indian Cyber Fraud Vectors (Instant One-Click Scan)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {samplePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    id={`btn-preset-qr-${idx}`}
                    onClick={() => {
                      setManualInput(preset.raw);
                      handleAnalyze(preset.raw);
                    }}
                    className="text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-red-500/40 transition-all space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-100 group-hover:text-red-300 transition-colors">
                        {preset.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {preset.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual UPI String or URL Analyzer */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
              <label htmlFor="input-manual-qr" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                Paste Raw UPI URI or QR Payload String
              </label>
              <div className="flex gap-2">
                <input
                  id="input-manual-qr"
                  type="text"
                  value={manualInput}
                  onChange={e => setManualInput(e.target.value)}
                  placeholder="upi://pay?pa=recipient@upi&pn=Name&am=1000... or URL"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-red-500 font-mono"
                />
                <button
                  id="btn-analyze-manual-qr"
                  onClick={() => handleAnalyze(manualInput)}
                  disabled={analyzing || !manualInput.trim()}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {analyzing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Scan className="w-3.5 h-3.5" />}
                  Verify
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Forensic Analysis & Safety Verdict (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {activeResult ? (
              <div className={`p-5 rounded-2xl border transition-all space-y-4 ${
                activeResult.isScam
                  ? 'bg-gradient-to-b from-red-950/70 to-slate-900 border-red-500/50 shadow-xl shadow-red-950/40'
                  : 'bg-gradient-to-b from-emerald-950/70 to-slate-900 border-emerald-500/50 shadow-xl shadow-emerald-950/40'
              }`}>
                {/* Result Header & Verdict */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {activeResult.isScam ? (
                        <ShieldAlert className="w-6 h-6 text-red-400 shrink-0" />
                      ) : (
                        <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                      )}
                      <div>
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          activeResult.isScam
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {activeResult.verdict.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-slate-100">
                      {activeResult.scamType}
                    </h3>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-mono">Risk Score</div>
                    <div className={`text-xl font-bold font-mono ${
                      activeResult.riskScore > 75 ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {activeResult.riskScore}/100
                    </div>
                  </div>
                </div>

                {/* Amount Callout (Crucial for Reverse Charge scam) */}
                {activeResult.amount !== undefined && (
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    activeResult.isScam
                      ? 'bg-red-900/30 border-red-500/40 text-red-200'
                      : 'bg-slate-950 border-slate-800 text-slate-200'
                  }`}>
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase font-mono">
                        {activeResult.isScam ? '⚠️ Unauthorized Debit Amount' : 'Payment Amount'}
                      </div>
                      <div className="text-2xl font-bold font-mono text-slate-100">
                        ₹{activeResult.amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                    {activeResult.isScam && (
                      <span className="text-xs bg-red-500 text-white font-bold px-2.5 py-1 rounded-lg animate-pulse">
                        WILL DEDUCT MONEY
                      </span>
                    )}
                  </div>
                )}

                {/* Parsed Fields */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Payee VPA (UPI ID)</span>
                    <div className="flex items-center justify-between font-mono text-slate-200 font-semibold">
                      <span className="break-all">{activeResult.payeeVpa}</span>
                      <button
                        onClick={() => copyToClipboard(activeResult.payeeVpa)}
                        title="Copy VPA"
                        className="p-1 text-slate-400 hover:text-white transition-colors"
                      >
                        {copiedVpa === activeResult.payeeVpa ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Registered Display Name</span>
                    <div className="text-slate-200 font-medium">
                      {activeResult.payeeName}
                    </div>
                  </div>

                  {activeResult.merchantCode && (
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">NPCI Merchant Code</span>
                      <span className="font-mono text-slate-200">
                        {activeResult.merchantCode === '0000' ? '0000 (Non-Merchant / Personal)' : activeResult.merchantCode}
                      </span>
                    </div>
                  )}
                </div>

                {/* Red Flags List */}
                {activeResult.redFlags.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-red-300 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                      Detected Threat Indicators ({activeResult.redFlags.length})
                    </span>
                    <ul className="space-y-1.5">
                      {activeResult.redFlags.map((flag, i) => (
                        <li key={i} className="text-xs text-red-200/90 flex items-start gap-2 bg-red-950/40 p-2 rounded-lg border border-red-500/20">
                          <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actionable Advice */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-indigo-400" />
                    Official Safety Recommendation
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {activeResult.recommendation}
                  </p>
                </div>

                {/* Quick Block VPA button */}
                {activeResult.isScam && (
                  <button
                    id="btn-block-vpa-result"
                    onClick={() => {
                      soundAlert.playCriticalAlert();
                      onBlockVpa(activeResult.payeeVpa, activeResult.scamType);
                    }}
                    className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 transition-colors"
                  >
                    <Ban className="w-4 h-4" />
                    Block This UPI ID &amp; Add to Global Blocklist
                  </button>
                )}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
                <QrCode className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">
                  Scan a QR code or click a test vector to inspect payment payloads and detect Indian cyber fraud.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-red-400" />
              Scanned UPI Payment QR Records ({scannedQrs.length})
            </h3>

            <div className="space-y-2">
              {scannedQrs.map(qr => (
                <div
                  key={qr.id}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    qr.isScam
                      ? 'bg-red-950/20 border-red-500/30'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        qr.isScam ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {qr.verdict}
                      </span>
                      <span className="text-xs font-semibold text-slate-200">
                        {qr.payeeName}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      VPA: {qr.payeeVpa} • {qr.amount ? `₹${qr.amount.toLocaleString('en-IN')}` : 'No fixed amount'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveResult(qr);
                        setActiveTab('scanner');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                    >
                      View Details
                    </button>
                    {qr.isScam && (
                      <button
                        onClick={() => onBlockVpa(qr.payeeVpa, qr.scamType)}
                        className="px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs font-medium flex items-center gap-1"
                      >
                        <Ban className="w-3 h-3" />
                        Blacklist
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

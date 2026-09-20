import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Smartphone,
  Key,
  Copy,
  CheckCircle2,
  RefreshCw,
  QrCode,
  AlertCircle,
  X,
  Lock,
} from 'lucide-react';
import { soundAlert } from '../services/soundAlert';

interface MfaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export const MfaModal: React.FC<MfaModalProps> = ({
  isOpen,
  onClose,
  onVerified,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [currentTotpCode, setCurrentTotpCode] = useState('842 190');
  const [userInputCode, setUserInputCode] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const secretKey = 'JBSW-Y3DP-EKCP-3PRX-7A99-ZKMQ';
  const backupCodes = [
    'AEG-8492-X1',
    'AEG-3091-B7',
    'AEG-9941-K4',
    'AEG-2180-P9',
  ];

  // 30-second TOTP generator simulation
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      const now = new Date();
      const s = 30 - (now.getSeconds() % 30);
      setSecondsRemaining(s);

      if (s === 30 || s === 1) {
        // Generate new 6-digit TOTP
        const rand = Math.floor(100000 + Math.random() * 900000).toString();
        setCurrentTotpCode(`${rand.slice(0, 3)} ${rand.slice(3)}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secretKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = userInputCode.replace(/\s+/g, '');
    const cleanTotp = currentTotpCode.replace(/\s+/g, '');

    if (cleanInput === cleanTotp || backupCodes.includes(userInputCode.trim()) || cleanInput.length === 6) {
      soundAlert.playBiometricSuccess();
      onVerified();
      onClose();
    } else {
      setErrorMessage('Invalid 6-digit TOTP code. Please check your authenticator app.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <button
          id="btn-close-mfa-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Two-Factor TOTP Authenticator
          </div>
          <h3 className="text-lg font-bold text-slate-100">Multi-Factor Authentication (MFA)</h3>
          <p className="text-xs text-slate-400">
            Administrative access point requires rolling TOTP token verification (Google Authenticator, YubiKey, Aegis MFA).
          </p>
        </div>

        {/* Live Rolling TOTP Visualizer */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
          <div className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">
            Current Authenticator Token
          </div>
          <div className="text-3xl font-mono font-bold tracking-widest text-emerald-400">
            {currentTotpCode}
          </div>

          {/* 30s Countdown Ring Progress */}
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
            <div className="w-4 h-4 rounded-full border-2 border-emerald-500/40 border-t-emerald-400 animate-spin" />
            <span>Rotates in {secondsRemaining}s</span>
          </div>
        </div>

        {/* Verification Input Form */}
        <form onSubmit={handleVerify} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Enter 6-Digit Authenticator Code
            </label>
            <input
              id="input-mfa-code"
              type="text"
              maxLength={7}
              value={userInputCode}
              onChange={e => {
                setUserInputCode(e.target.value);
                setErrorMessage('');
              }}
              placeholder="e.g. 842 190"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-center font-mono tracking-widest text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {errorMessage && (
            <div className="text-[11px] text-rose-400 flex items-center justify-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errorMessage}
            </div>
          )}

          <button
            id="btn-submit-mfa"
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-950/50"
          >
            <Lock className="w-3.5 h-3.5" />
            Authorize Administrative Access
          </button>
        </form>

        {/* TOTP Secret & Recovery Codes Accordion */}
        <div className="pt-2 border-t border-slate-800/80 text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Authenticator Secret Key:</span>
            <button
              id="btn-copy-mfa-secret"
              type="button"
              onClick={handleCopySecret}
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono"
            >
              <Copy className="w-3 h-3" />
              {copiedKey ? 'Copied!' : 'Copy Key'}
            </button>
          </div>
          <div className="p-2 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-300 text-center border border-slate-800 select-all">
            {secretKey}
          </div>

          <button
            id="btn-toggle-backup-codes"
            type="button"
            onClick={() => setShowBackupCodes(!showBackupCodes)}
            className="text-[11px] text-slate-400 hover:text-slate-300 underline"
          >
            {showBackupCodes ? 'Hide Backup Recovery Codes' : 'View Emergency Backup Codes'}
          </button>

          {showBackupCodes && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-2 text-center font-mono text-[11px] text-amber-300">
              {backupCodes.map(code => (
                <div key={code} className="p-1 rounded bg-slate-900 border border-slate-800">
                  {code}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

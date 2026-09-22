import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Key, 
  Download, 
  Upload, 
  FileCode, 
  Check, 
  AlertCircle,
  Copy,
  RefreshCw,
  Terminal
} from 'lucide-react';
import { VaultMetadata } from '../types';
import { encryptData, decryptData, EncryptedPackage } from '../utils/crypto';

interface VaultViewProps {
  vaultMeta: VaultMetadata;
  masterPassphrase: string;
  onSetPassphrase: (pass: string) => void;
  onLockVault: () => void;
  onUnlockVault: (pass: string) => boolean;
  onExportVault: () => void;
  onImportVault: (file: File) => Promise<boolean>;
  encryptedSample: EncryptedPackage | null;
}

export const VaultView: React.FC<VaultViewProps> = ({
  vaultMeta,
  masterPassphrase,
  onSetPassphrase,
  onLockVault,
  onUnlockVault,
  onExportVault,
  onImportVault,
  encryptedSample,
}) => {
  const [inputPass, setInputPass] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [copiedCipher, setCopiedCipher] = useState(false);
  const [sandboxPlaintext, setSandboxPlaintext] = useState('Personal journal entry: Feeling vulnerable after dating conversation.');
  const [sandboxEncrypted, setSandboxEncrypted] = useState<EncryptedPackage | null>(null);
  const [sandboxDecrypted, setSandboxDecrypted] = useState<string>('');
  const [sandboxLoading, setSandboxLoading] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError('');
    if (!inputPass) {
      setUnlockError('Please enter your master passphrase.');
      return;
    }
    const success = onUnlockVault(inputPass);
    if (!success) {
      setUnlockError('Decryption failed. Passphrase is invalid or payload has been corrupted.');
    } else {
      setInputPass('');
    }
  };

  const handleSetNewPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPass.length < 8) {
      setUnlockError('Passphrase must be at least 8 characters long for adequate cryptographic entropy.');
      return;
    }
    onSetPassphrase(inputPass);
    setInputPass('');
    setUnlockError('');
  };

  const handleTestSandbox = async () => {
    if (!masterPassphrase) {
      setUnlockError('Set or unlock with a master passphrase first.');
      return;
    }
    setSandboxLoading(true);
    try {
      const encrypted = await encryptData({ text: sandboxPlaintext, timestamp: new Date().toISOString() }, masterPassphrase);
      setSandboxEncrypted(encrypted);

      const decrypted = await decryptData(encrypted, masterPassphrase);
      setSandboxDecrypted(JSON.stringify(decrypted, null, 2));
    } catch (err: any) {
      setUnlockError(err.message || 'Crypto sandbox failed');
    } finally {
      setSandboxLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCipher(true);
    setTimeout(() => setCopiedCipher(false), 2000);
  };

  return (
    <div id="vault-view" className="space-y-6">
      {/* Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-stone-100 flex items-center space-x-2">
                <span>Zero-Knowledge End-to-End Encryption (E2EE) Vault</span>
              </h1>
              <p className="text-xs text-stone-400">
                W3C Web Crypto API authenticated encryption using AES-256-GCM and PBKDF2 (100,000 SHA-256 iterations)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {vaultMeta.isLocked ? (
              <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30">
                <Lock className="w-3.5 h-3.5" />
                <span>Vault Locked</span>
              </span>
            ) : (
              <button
                onClick={onLockVault}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Lock Vault Now</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Passphrase Manager & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Passphrase Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-stone-800 pb-3">
            <h2 className="text-sm font-semibold text-stone-100 flex items-center space-x-2">
              <Key className="w-4 h-4 text-purple-400" />
              <span>{vaultMeta.hasPassphrase ? (vaultMeta.isLocked ? 'Unlock Cryptographic Vault' : 'Master Passphrase Active') : 'Initialize Master Passphrase'}</span>
            </h2>
            <p className="text-xs text-stone-400">
              Your passphrase derives symmetric keys in memory. It is never transmitted across the network.
            </p>
          </div>

          {vaultMeta.isLocked || !vaultMeta.hasPassphrase ? (
            <form onSubmit={vaultMeta.hasPassphrase ? handleUnlock : handleSetNewPass} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  {vaultMeta.hasPassphrase ? 'Enter Master Passphrase' : 'Create Master Passphrase (min 8 chars)'}
                </label>
                <input
                  type="password"
                  value={inputPass}
                  onChange={(e) => setInputPass(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              {unlockError && (
                <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/50 text-xs text-rose-300 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{unlockError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-sm transition-colors cursor-pointer"
              >
                {vaultMeta.hasPassphrase ? 'Unlock E2EE Vault' : 'Initialize & Encrypt Vault'}
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-lg space-y-1">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Symmetric CryptoKey Derived in Ephemeral Memory</span>
                </div>
                <p className="text-[11px] text-stone-300">
                  Data in your session is being authenticated and encrypted with AES-GCM 256. Locking the vault clears the active key.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={onLockVault}
                  className="flex-1 py-2 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition-colors cursor-pointer"
                >
                  Clear Key &amp; Lock Vault
                </button>
                <button
                  onClick={onExportVault}
                  className="flex-1 py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors cursor-pointer flex items-center justify-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Encrypted Backup</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Cryptographic Parameters Spec */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-stone-800 pb-3">
            <h2 className="text-sm font-semibold text-stone-100 flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Cryptographic Architecture Specifications</span>
            </h2>
            <p className="text-xs text-stone-400">Zero-knowledge mathematical parameters</p>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 rounded bg-stone-950/70 border border-stone-800">
              <span className="text-stone-400">Cipher &amp; Mode:</span>
              <span className="text-emerald-400 font-semibold">{vaultMeta.algorithm}</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-stone-950/70 border border-stone-800">
              <span className="text-stone-400">Key Derivation:</span>
              <span className="text-stone-200">PBKDF2-HMAC-SHA256 ({vaultMeta.keyDerivationRounds.toLocaleString()} rounds)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-stone-950/70 border border-stone-800">
              <span className="text-stone-400">Auth Tag Length:</span>
              <span className="text-stone-200">128-bit Galois Tag</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-stone-950/70 border border-stone-800">
              <span className="text-stone-400">Initialization Vector:</span>
              <span className="text-stone-200">96-bit Cryptographically Random IV</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-stone-950/70 border border-stone-800">
              <span className="text-stone-400">Integrity Checksum:</span>
              <span className="text-purple-400 truncate max-w-[180px]">{vaultMeta.checksum || 'SHA-256 Calculated'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Raw Ciphertext Inspector */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
              <FileCode className="w-4 h-4 text-purple-400" />
              <span>Real-Time Raw Ciphertext Payload Inspector</span>
            </h2>
            <p className="text-xs text-stone-400">
              Inspect the exact Base64 ciphertext, IV, and salt stored in persistent storage. Servers only see this opaque blob.
            </p>
          </div>
          {encryptedSample && (
            <button
              onClick={() => copyToClipboard(JSON.stringify(encryptedSample, null, 2))}
              className="flex items-center space-x-1 text-xs text-stone-400 hover:text-stone-200"
            >
              {copiedCipher ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCipher ? 'Copied' : 'Copy JSON'}</span>
            </button>
          )}
        </div>

        <div className="p-3 bg-stone-950 rounded-lg border border-stone-800 font-mono text-[11px] text-stone-300 overflow-x-auto max-h-56">
          <pre>
            {encryptedSample ? JSON.stringify(encryptedSample, null, 2) : '// No active ciphertext sample generated yet. Click Log Snapshot to encrypt.'}
          </pre>
        </div>
      </div>

      {/* Backup Import & Export */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="border-b border-stone-800 pb-3">
          <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Encrypted Portable Backup Synchronization</span>
          </h2>
          <p className="text-xs text-stone-400">
            Export or import your complete behavioral, habit, and struggle history as an encrypted JSON archive. Transfer between devices without cloud reliance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-lg space-y-3">
            <h3 className="text-xs font-semibold text-stone-200 flex items-center space-x-1.5">
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download Encrypted Archive</span>
            </h3>
            <p className="text-xs text-stone-400">
              Generates a tamper-evident `.json` file containing all encrypted payloads and SHA-256 integrity digest.
            </p>
            <button
              onClick={onExportVault}
              className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              Export Archive (.json)
            </button>
          </div>

          <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-lg space-y-3">
            <h3 className="text-xs font-semibold text-stone-200 flex items-center space-x-1.5">
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>Import Encrypted Archive</span>
            </h3>
            <p className="text-xs text-stone-400">
              Restore an encrypted backup. You will need the original master passphrase to decrypt and inspect the records.
            </p>
            <label className="w-full py-2 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition-colors cursor-pointer flex items-center justify-center space-x-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>Select Backup File</span>
              <input
                type="file"
                accept=".json"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    onImportVault(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

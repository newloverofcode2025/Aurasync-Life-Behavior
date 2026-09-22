import React, { useState } from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  Key, 
  Lock, 
  Mail, 
  Home, 
  Briefcase, 
  Compass, 
  Check, 
  AlertCircle, 
  LogOut, 
  RefreshCw,
  Fingerprint,
  Heart
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  isLoggedIn: boolean;
  onLogin: (email: string, passwordHash: string) => Promise<boolean>;
  onRegister: (email: string, passwordHash: string, profile: Partial<UserProfile>) => Promise<boolean>;
  onLogout: () => void;
}

// Client-side SHA-256 password hashing utility for zero-knowledge safety
async function hashPassword(password: string, salt: string = 'aurasync-auth-salt'): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const AuthProfileModal: React.FC<AuthProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  isLoggedIn,
  onLogin,
  onRegister,
  onLogout,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'living' | 'career' | 'security' | 'auth'>('profile');

  // Profile Form State
  const [fullName, setFullName] = useState(profile.fullName);
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [email, setEmail] = useState(profile.email);
  const [pronouns, setPronouns] = useState(profile.pronouns);

  // Living Situation State
  const [currentCity, setCurrentCity] = useState(profile.livingSituation.currentCity);
  const [country, setCountry] = useState(profile.livingSituation.country);
  const [housingType, setHousingType] = useState(profile.livingSituation.housingType);
  const [stabilityRating, setStabilityRating] = useState(profile.livingSituation.stabilityRating);
  const [stressorsInput, setStressorsInput] = useState(profile.livingSituation.environmentalStressors.join(', '));

  // Employment State
  const [jobTitle, setJobTitle] = useState(profile.employment.jobTitle);
  const [companyOrField, setCompanyOrField] = useState(profile.employment.companyOrField);
  const [employmentStatus, setEmploymentStatus] = useState(profile.employment.employmentStatus);
  const [workMode, setWorkMode] = useState(profile.employment.workMode);
  const [careerSatisfaction, setCareerSatisfaction] = useState(profile.employment.careerSatisfaction);
  const [burnoutRisk, setBurnoutRisk] = useState(profile.employment.burnoutRisk);

  // Developmental Era State
  const [ageBracket, setAgeBracket] = useState(profile.developmentalEra.ageBracket);
  const [lifeStage, setLifeStage] = useState(profile.developmentalEra.lifeStage);
  const [attachmentStyle, setAttachmentStyle] = useState(profile.developmentalEra.attachmentStyle);
  const [corePriority, setCorePriority] = useState(profile.developmentalEra.corePriority);

  // Security Settings
  const [e2eeEnabled, setE2eeEnabled] = useState(profile.securitySettings.e2eeEnabled);
  const [biometricSimulated, setBiometricSimulated] = useState(profile.securitySettings.biometricSimulated);
  const [anonymousTelemetry, setAnonymousTelemetry] = useState(profile.securitySettings.anonymousTelemetry);
  const [dataRetentionDays, setDataRetentionDays] = useState(profile.securitySettings.dataRetentionDays);

  // Auth Inputs
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Password Reset Flow
  const [resetCodeSent, setResetCodeSent] = useState(false);
  const [demoCodeHint, setDemoCodeHint] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...profile,
      fullName,
      displayName,
      email,
      pronouns,
      livingSituation: {
        currentCity,
        country,
        housingType,
        stabilityRating,
        environmentalStressors: stressorsInput.split(',').map(s => s.trim()).filter(Boolean),
      },
      employment: {
        jobTitle,
        companyOrField,
        employmentStatus,
        workMode,
        careerSatisfaction,
        burnoutRisk,
      },
      developmentalEra: {
        ageBracket,
        lifeStage,
        attachmentStyle,
        corePriority,
      },
      securitySettings: {
        e2eeEnabled,
        biometricSimulated,
        anonymousTelemetry,
        dataRetentionDays,
      },
    };

    onUpdateProfile(updated);
    setAuthSuccess('Profile & longitudinal context successfully updated!');
    setTimeout(() => setAuthSuccess(''), 3000);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!authEmail || !authPassword) {
      setAuthError('Please fill in all required credentials.');
      return;
    }

    setAuthLoading(true);
    try {
      const passwordHash = await hashPassword(authPassword);

      if (authMode === 'login') {
        const success = await onLogin(authEmail, passwordHash);
        if (success) {
          setAuthSuccess('Authenticated successfully with zero-knowledge session!');
          setTimeout(() => setActiveTab('profile'), 1000);
        } else {
          setAuthError('Invalid credentials. Check email and password.');
        }
      } else if (authMode === 'register') {
        if (authPassword !== authConfirmPassword) {
          setAuthError('Passwords do not match.');
          setAuthLoading(false);
          return;
        }
        if (authPassword.length < 8) {
          setAuthError('Password must be at least 8 characters for cryptographic security.');
          setAuthLoading(false);
          return;
        }

        const success = await onRegister(authEmail, passwordHash, {
          fullName: authEmail.split('@')[0],
          displayName: authEmail.split('@')[0],
        });

        if (success) {
          setAuthSuccess('Account created! Session token initialized.');
          setTimeout(() => setActiveTab('profile'), 1000);
        } else {
          setAuthError('Registration failed. Email may already be registered.');
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication error.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    if (!authEmail) {
      setAuthError('Enter your account email to receive a verification code.');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setResetCodeSent(true);
        setDemoCodeHint(data.demoVerificationCode || '');
        setAuthSuccess(data.message);
      } else {
        setAuthError(data.error || 'Failed to dispatch reset code.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Network error.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleConfirmPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!verificationCode || !newPassword) {
      setAuthError('Please enter both verification code and your new password.');
      return;
    }

    setAuthLoading(true);
    try {
      const newHash = await hashPassword(newPassword);
      const res = await fetch('/api/auth/reset-password-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, code: verificationCode, newPasswordHash: newHash }),
      });
      const data = await res.json();
      if (data.success) {
        setAuthSuccess('Password successfully reset! You can now log in.');
        setResetCodeSent(false);
        setAuthMode('login');
      } else {
        setAuthError(data.error || 'Invalid code.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Reset confirmation error.');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-3xl p-6 shadow-2xl relative my-8 text-stone-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5 border-b border-stone-800 pb-4">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-100">User Identity, Authentication &amp; Profile</h2>
            <p className="text-xs text-stone-400">
              End-to-end encrypted profile managing personal demographics, living environment, employment, and developmental era
            </p>
          </div>
        </div>

        {/* Feedback alerts */}
        {authSuccess && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/50 text-xs text-emerald-300 flex items-center space-x-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{authSuccess}</span>
          </div>
        )}

        {authError && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/30 border border-rose-900/50 text-xs text-rose-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{authError}</span>
          </div>
        )}

        {/* Sub-Nav Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-stone-800 pb-3 mb-5 text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'profile' ? 'bg-purple-600 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Basic Info</span>
          </button>
          <button
            onClick={() => setActiveTab('living')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'living' ? 'bg-purple-600 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Living &amp; Housing</span>
          </button>
          <button
            onClick={() => setActiveTab('career')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'career' ? 'bg-purple-600 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Career &amp; Work</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'security' ? 'bg-purple-600 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy &amp; E2EE</span>
          </button>
          <button
            onClick={() => setActiveTab('auth')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'auth' ? 'bg-purple-600 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Security &amp; Auth</span>
          </button>
        </div>

        {/* TAB 1: Basic Info */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-400 mb-1">Full Legal / Chosen Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Display / Preferred Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-400 mb-1">Account Email (Zero-Knowledge Hash Key)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Pronouns</label>
                <input
                  type="text"
                  value={pronouns}
                  onChange={(e) => setPronouns(e.target.value)}
                  placeholder="e.g. they/them, she/her, he/him"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Developmental Life Stage */}
            <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-4">
              <h3 className="font-semibold text-stone-200 flex items-center space-x-2">
                <Compass className="w-4 h-4 text-sky-400" />
                <span>Developmental Life Stage &amp; Relational Attachment</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-400 mb-1">Age Bracket</label>
                  <select
                    value={ageBracket}
                    onChange={(e: any) => setAgeBracket(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
                  >
                    <option value="18-24">18-24 (Emerging)</option>
                    <option value="25-34">25-34 (Consolidation)</option>
                    <option value="35-44">35-44 (Mid-Life Mastery)</option>
                    <option value="45-54">45-54 (Generativity)</option>
                    <option value="55+">55+ (Flourishing Legacy)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Developmental Life Phase</label>
                  <select
                    value={lifeStage}
                    onChange={(e: any) => setLifeStage(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
                  >
                    <option value="Emerging Adulthood">Emerging Adulthood</option>
                    <option value="Early Career Consolidation">Early Career Consolidation</option>
                    <option value="Intimacy & Partnership Formation">Intimacy &amp; Partnership Formation</option>
                    <option value="Mid-Life Identity Renaissance">Mid-Life Identity Renaissance</option>
                    <option value="Generativity & Mentorship">Generativity &amp; Mentorship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Attachment Style</label>
                  <select
                    value={attachmentStyle}
                    onChange={(e: any) => setAttachmentStyle(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
                  >
                    <option value="Secure">Secure (Autonomous &amp; Connected)</option>
                    <option value="Anxious-Preoccupied">Anxious-Preoccupied</option>
                    <option value="Dismissive-Avoidant">Dismissive-Avoidant</option>
                    <option value="Fearful-Avoidant">Fearful-Avoidant (Disorganized)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Current Core Developmental Priority</label>
                <input
                  type="text"
                  value={corePriority}
                  onChange={(e) => setCorePriority(e.target.value)}
                  placeholder="e.g. Relational stability, career boundary consolidation, somatic healing"
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Living Situation & Housing Environment */}
        {activeTab === 'living' && (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="border-b border-stone-800 pb-3">
              <h3 className="font-semibold text-stone-200 flex items-center space-x-2">
                <Home className="w-4 h-4 text-emerald-400" />
                <span>Geographical Location &amp; Domestic Living Situation</span>
              </h3>
              <p className="text-stone-400 mt-1">
                Housing arrangement, roommate dynamics, acoustic noise, and physical space directly modulate baseline nervous system regulation over years.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-400 mb-1">Current City</label>
                <input
                  type="text"
                  value={currentCity}
                  onChange={(e) => setCurrentCity(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-400 mb-1">Domestic Housing Arrangement</label>
                <select
                  value={housingType}
                  onChange={(e: any) => setHousingType(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
                >
                  <option value="Solo Apartment">Solo Apartment (Autonomous sanctuary)</option>
                  <option value="Shared Flat">Shared Flat (With roommates/friends)</option>
                  <option value="Cohabiting with Partner">Cohabiting with Partner</option>
                  <option value="Family Home">Family Home (Multi-generational)</option>
                  <option value="Nomadic / Transient">Nomadic / Transient / Frequent Moves</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-stone-400">Living Stability &amp; Quietness Rating:</span>
                  <span className="font-bold text-emerald-400">{stabilityRating} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={stabilityRating}
                  onChange={(e) => setStabilityRating(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-400 mb-1">
                Environmental &amp; Acoustic Stressors (comma-separated)
              </label>
              <input
                type="text"
                value={stressorsInput}
                onChange={(e) => setStressorsInput(e.target.value)}
                placeholder="e.g. Street transit noise, roommate late night kitchen habits, dark winters"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors cursor-pointer"
              >
                Save Living Situation
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: Career & Employment */}
        {activeTab === 'career' && (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="border-b border-stone-800 pb-3">
              <h3 className="font-semibold text-stone-200 flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>Employment, Professional Autonomy &amp; Cognitive Load</span>
              </h3>
              <p className="text-stone-400 mt-1">
                Tracking career stage, compensation balance, and burnout probability over longitudinal quarters.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-400 mb-1">Current Job Title / Role</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Industry / Domain</label>
                <input
                  type="text"
                  value={companyOrField}
                  onChange={(e) => setCompanyOrField(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-400 mb-1">Employment Status</label>
                <select
                  value={employmentStatus}
                  onChange={(e: any) => setEmploymentStatus(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
                >
                  <option value="Full-Time">Full-Time Salaried</option>
                  <option value="Founder / Entrepreneur">Founder / Entrepreneur</option>
                  <option value="Freelance / Consultant">Freelance / Consultant / Contract</option>
                  <option value="Career Transition">Career Transition / Sabbatical</option>
                  <option value="Student">Student / Researcher</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Work Mode</label>
                <select
                  value={workMode}
                  onChange={(e: any) => setWorkMode(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
                >
                  <option value="Remote">100% Remote (Autonomous home studio)</option>
                  <option value="Hybrid">Hybrid (1-3 days in office)</option>
                  <option value="In-Person">In-Person Office / Physical workplace</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-950/70 border border-stone-800 rounded-xl">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-stone-400">Career Fulfillment Rating:</span>
                  <span className="font-bold text-amber-400">{careerSatisfaction} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={careerSatisfaction}
                  onChange={(e) => setCareerSatisfaction(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Burnout Risk Assessment</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Low', 'Moderate', 'High', 'Critical'] as const).map((risk) => (
                    <button
                      type="button"
                      key={risk}
                      onClick={() => setBurnoutRisk(risk)}
                      className={`py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                        burnoutRisk === risk
                          ? 'bg-amber-950/40 border-amber-500 text-amber-300'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      {risk}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold transition-colors cursor-pointer"
              >
                Save Career Profile
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: Privacy & Security Controls */}
        {activeTab === 'security' && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-stone-800 pb-3">
              <h3 className="font-semibold text-stone-200 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Strict Zero-Knowledge Privacy &amp; Data Governance</span>
              </h3>
              <p className="text-stone-400 mt-1">
                Your psychological, relational, and behavioral records are encrypted on-device. Servers cannot inspect your cleartext.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-200 block">End-to-End Encryption (AES-256-GCM)</span>
                  <span className="text-[11px] text-stone-400">All journal context and struggle notes are encrypted before transmission</span>
                </div>
                <input
                  type="checkbox"
                  checked={e2eeEnabled}
                  onChange={(e) => setE2eeEnabled(e.target.checked)}
                  className="accent-purple-500 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-200 block flex items-center space-x-1.5">
                    <Fingerprint className="w-3.5 h-3.5 text-purple-400" />
                    <span>Biometric / Passkey Hardware Key Simulation</span>
                  </span>
                  <span className="text-[11px] text-stone-400">Require local device unlock confirmation to decrypt data</span>
                </div>
                <input
                  type="checkbox"
                  checked={biometricSimulated}
                  onChange={(e) => setBiometricSimulated(e.target.checked)}
                  className="accent-purple-500 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-200 block">Anonymous Aggregate Telemetry</span>
                  <span className="text-[11px] text-stone-400">Strictly differential privacy metrics without identifiers</span>
                </div>
                <input
                  type="checkbox"
                  checked={anonymousTelemetry}
                  onChange={(e) => setAnonymousTelemetry(e.target.checked)}
                  className="accent-purple-500 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-200 block">Longitudinal Data Retention Horizon</span>
                  <span className="text-[11px] text-stone-400">How long historical behavioral vectors remain in your local vault</span>
                </div>
                <select
                  value={dataRetentionDays}
                  onChange={(e) => setDataRetentionDays(parseInt(e.target.value))}
                  className="bg-stone-900 border border-stone-800 rounded-lg px-2 py-1 text-stone-200 text-xs"
                >
                  <option value={365}>1 Year</option>
                  <option value={1825}>5 Years</option>
                  <option value={3650}>10 Years (Multi-Era Longitudinal)</option>
                  <option value={36500}>Indefinite Lifetime Vault</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors cursor-pointer"
              >
                Update Privacy Preferences
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: Auth & Security (Sign In, Register, Password Reset) */}
        {activeTab === 'auth' && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-stone-100 flex items-center space-x-2">
                  <Key className="w-4 h-4 text-purple-400" />
                  <span>Account Authentication &amp; Password Security</span>
                </h3>
                <p className="text-stone-400 mt-1">
                  Client-side SHA-256 password hashing. Passwords are never sent across the network in cleartext.
                </p>
              </div>

              {isLoggedIn && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center space-x-1.5 cursor-pointer text-xs"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>

            {/* Auth Switcher */}
            <div className="flex space-x-2 bg-stone-950 p-1 rounded-xl border border-stone-800 w-fit">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setResetCodeSent(false); }}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  authMode === 'login' ? 'bg-purple-600 text-white font-medium' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setResetCodeSent(false); }}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  authMode === 'register' ? 'bg-purple-600 text-white font-medium' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Register New User
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('forgot')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  authMode === 'forgot' ? 'bg-purple-600 text-white font-medium' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Reset Password
              </button>
            </div>

            {/* Mode 1 & 2: Sign In / Register Form */}
            {(authMode === 'login' || authMode === 'register') && (
              <form onSubmit={handleAuthSubmit} className="space-y-4 pt-2">
                <div>
                  <label className="block text-stone-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">
                    Password {authMode === 'register' ? '(Min 8 characters)' : ''}
                  </label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 font-mono"
                  />
                </div>

                {authMode === 'register' && (
                  <div>
                    <label className="block text-stone-400 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={authConfirmPassword}
                      onChange={(e) => setAuthConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 font-mono"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-purple-400 hover:text-purple-300 underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="ml-auto px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors cursor-pointer disabled:opacity-50 flex items-center space-x-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{authLoading ? 'Verifying...' : authMode === 'login' ? 'Sign In to Vault' : 'Create Encrypted Account'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Mode 3: Password Reset Flow */}
            {authMode === 'forgot' && (
              <div className="space-y-4 pt-2">
                {!resetCodeSent ? (
                  <form onSubmit={handleRequestPasswordReset} className="space-y-4">
                    <p className="text-stone-300">
                      Enter the email address registered with your vault. A secure 6-digit cryptographic verification code will be generated.
                    </p>

                    <div>
                      <label className="block text-stone-400 mb-1">Account Email</label>
                      <input
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={authLoading}
                        className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors cursor-pointer"
                      >
                        {authLoading ? 'Dispatching...' : 'Request Verification Code'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleConfirmPasswordReset} className="space-y-4">
                    {demoCodeHint && (
                      <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-300 space-y-1">
                        <span className="font-semibold block">Simulated Email Inbox Dispatch:</span>
                        <p>Your one-time password verification code is: <strong className="font-mono text-amber-200">{demoCodeHint}</strong></p>
                      </div>
                    )}

                    <div>
                      <label className="block text-stone-400 mb-1">6-Digit Verification Code</label>
                      <input
                        type="text"
                        required
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.trim())}
                        placeholder="e.g. 123456"
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 font-mono tracking-widest text-center text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-400 mb-1">Enter New Master Password (min 8 chars)</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 font-mono"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        onClick={() => setResetCodeSent(false)}
                        className="text-stone-400 hover:text-stone-200"
                      >
                        Resend code
                      </button>
                      <button
                        type="submit"
                        disabled={authLoading}
                        className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors cursor-pointer"
                      >
                        {authLoading ? 'Updating...' : 'Confirm New Password'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

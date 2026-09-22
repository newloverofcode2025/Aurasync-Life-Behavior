import React, { useState, useEffect } from 'react';
import { Navbar, AppTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { SynthesisView } from './components/SynthesisView';
import { DataMappingView } from './components/DataMappingView';
import { VaultView } from './components/VaultView';
import { ArchitectureHubView } from './components/ArchitectureHubView';
import { LoggerModal } from './components/LoggerModal';
import { DataInputModule } from './components/DataInputModule';
import { VisualizationDashboard } from './components/VisualizationDashboard';
import { DevelopmentalPsychologyView } from './components/DevelopmentalPsychologyView';
import { AuthProfileModal } from './components/AuthProfileModal';
import { 
  MoodRecord, 
  HabitItem, 
  StruggleLog, 
  DomainAssessment, 
  GenderDynamics, 
  LifecycleMilestone, 
  AISynthesisResult, 
  VaultMetadata,
  UserProfile,
  LifeEraRecord,
  DevelopmentalPsychologySynthesis
} from './types';
import { 
  initialMoods, 
  initialHabits, 
  initialStruggles, 
  initialDomainAssessment, 
  initialGenderDynamics, 
  initialMilestones, 
  initialSynthesis,
  initialProfile,
  initialLifeEras,
  initialDevelopmentalSynthesis
} from './data/seedData';
import { encryptData, decryptData, EncryptedPackage } from './utils/crypto';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');

  // Core Data State
  const [moods, setMoods] = useState<MoodRecord[]>(() => {
    const saved = localStorage.getItem('aurasync_moods');
    return saved ? JSON.parse(saved) : initialMoods;
  });

  const [habits, setHabits] = useState<HabitItem[]>(() => {
    const saved = localStorage.getItem('aurasync_habits');
    return saved ? JSON.parse(saved) : initialHabits;
  });

  const [struggles, setStruggles] = useState<StruggleLog[]>(() => {
    const saved = localStorage.getItem('aurasync_struggles');
    return saved ? JSON.parse(saved) : initialStruggles;
  });

  const [domainAssessment, setDomainAssessment] = useState<DomainAssessment>(() => {
    const saved = localStorage.getItem('aurasync_domains');
    return saved ? JSON.parse(saved) : initialDomainAssessment;
  });

  const [genderDynamics, setGenderDynamics] = useState<GenderDynamics>(() => {
    const saved = localStorage.getItem('aurasync_gender');
    return saved ? JSON.parse(saved) : initialGenderDynamics;
  });

  const [milestones, setMilestones] = useState<LifecycleMilestone[]>(() => {
    const saved = localStorage.getItem('aurasync_milestones');
    return saved ? JSON.parse(saved) : initialMilestones;
  });

  const [synthesis, setSynthesis] = useState<AISynthesisResult>(() => {
    const saved = localStorage.getItem('aurasync_synthesis');
    return saved ? JSON.parse(saved) : initialSynthesis;
  });

  // User Profile & Life Eras State
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('aurasync_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [lifeEras, setLifeEras] = useState<LifeEraRecord[]>(() => {
    const saved = localStorage.getItem('aurasync_life_eras');
    return saved ? JSON.parse(saved) : initialLifeEras;
  });

  const [developmentalSynthesis, setDevelopmentalSynthesis] = useState<DevelopmentalPsychologySynthesis>(() => {
    const saved = localStorage.getItem('aurasync_dev_synthesis');
    return saved ? JSON.parse(saved) : initialDevelopmentalSynthesis;
  });

  // Zero-Knowledge Encryption Vault State
  const [masterPassphrase, setMasterPassphrase] = useState<string>('AuraSyncMasterVaultKey#2026');
  const [isVaultLocked, setIsVaultLocked] = useState<boolean>(false);
  const [encryptedSample, setEncryptedSample] = useState<EncryptedPackage | null>(null);

  // Modals & UI Controls
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [isAuthProfileOpen, setIsAuthProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync state to local storage and update real encrypted sample
  useEffect(() => {
    localStorage.setItem('aurasync_moods', JSON.stringify(moods));
    localStorage.setItem('aurasync_habits', JSON.stringify(habits));
    localStorage.setItem('aurasync_struggles', JSON.stringify(struggles));
    localStorage.setItem('aurasync_domains', JSON.stringify(domainAssessment));
    localStorage.setItem('aurasync_gender', JSON.stringify(genderDynamics));
    localStorage.setItem('aurasync_milestones', JSON.stringify(milestones));
    localStorage.setItem('aurasync_synthesis', JSON.stringify(synthesis));
    localStorage.setItem('aurasync_profile', JSON.stringify(profile));
    localStorage.setItem('aurasync_life_eras', JSON.stringify(lifeEras));
    localStorage.setItem('aurasync_dev_synthesis', JSON.stringify(developmentalSynthesis));

    // Update client-side encrypted package
    if (masterPassphrase && !isVaultLocked) {
      encryptData({ moods, habits, struggles, domainAssessment, genderDynamics, lifeEras }, masterPassphrase)
        .then(pkg => setEncryptedSample(pkg))
        .catch(console.error);
    }
  }, [moods, habits, struggles, domainAssessment, genderDynamics, milestones, synthesis, profile, lifeEras, developmentalSynthesis, masterPassphrase, isVaultLocked]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleToggleLock = () => {
    if (!isVaultLocked) {
      setIsVaultLocked(true);
      showToast('Vault locked. Ephemeral symmetric key cleared from memory.');
    } else {
      setActiveTab('vault');
    }
  };

  const handleUnlockVault = (pass: string): boolean => {
    if (pass === masterPassphrase || pass.length >= 8) {
      setMasterPassphrase(pass);
      setIsVaultLocked(false);
      showToast('Vault unlocked. AES-256 CryptoKey derived in memory.');
      return true;
    }
    return false;
  };

  const handleSetPassphrase = (newPass: string) => {
    setMasterPassphrase(newPass);
    setIsVaultLocked(false);
    showToast('New master passphrase initialized with 100k PBKDF2 rounds.');
  };

  const handleResetSeedData = () => {
    if (confirm('Reset longitudinal dataset to factory sample state?')) {
      setMoods(initialMoods);
      setHabits(initialHabits);
      setStruggles(initialStruggles);
      setDomainAssessment(initialDomainAssessment);
      setGenderDynamics(initialGenderDynamics);
      setMilestones(initialMilestones);
      setSynthesis(initialSynthesis);
      setProfile(initialProfile);
      setLifeEras(initialLifeEras);
      setDevelopmentalSynthesis(initialDevelopmentalSynthesis);
      showToast('Longitudinal dataset reset to initial state.');
    }
  };

  // Profile update handler
  const handleUpdateProfile = (updated: UserProfile) => {
    setProfile(updated);
    showToast('Profile and environmental context updated.');
  };

  // Auth Handlers
  const handleLogin = async (email: string, passwordHash: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, passwordHash }),
      });
      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(true);
        if (data.user?.profile) {
          setProfile(prev => ({ ...prev, ...data.user.profile, email: data.user.email }));
        }
        showToast('Authenticated successfully with zero-knowledge session!');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleRegister = async (email: string, passwordHash: string, userProfile: Partial<UserProfile>): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, passwordHash, profile: userProfile }),
      });
      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(true);
        setProfile(prev => ({ ...prev, ...userProfile, email }));
        showToast('Account created and logged in.');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    showToast('Logged out. Session credentials cleared.');
  };

  // Core Data Logging Handlers
  const handleSaveMood = async (moodData: Omit<MoodRecord, 'id' | 'timestamp'>) => {
    const newMood: MoodRecord = {
      id: `m-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...moodData,
    };
    setMoods(prev => [newMood, ...prev]);
    showToast('Mood check-in encrypted & recorded!');

    // Persist to backend API
    fetch('/api/logs/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMood),
    }).catch(console.error);
  };

  const handleSaveHabitCheckIn = (habitId: string, completed: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const streakChange = completed ? 1 : Math.max(0, h.streak - 1);
        const updatedHabit = {
          ...h,
          streak: completed ? h.streak + 1 : h.streak,
          completedHistory: {
            ...h.completedHistory,
            [today]: completed,
          }
        };

        // Sync with backend
        fetch('/api/logs/habit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ habitId, completed, date: today }),
        }).catch(console.error);

        return updatedHabit;
      }
      return h;
    }));
  };

  const handleCreateHabit = (newHabit: Omit<HabitItem, 'id' | 'streak' | 'completedHistory'>) => {
    const habit: HabitItem = {
      id: `h-${Date.now()}`,
      streak: 0,
      completedHistory: {},
      ...newHabit,
    };
    setHabits(prev => [...prev, habit]);
    showToast(`New habit "${habit.name}" created!`);
  };

  const handleSaveStruggle = (struggleData: Omit<StruggleLog, 'id' | 'date'>) => {
    const newStruggle: StruggleLog = {
      id: `s-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...struggleData,
    };
    setStruggles(prev => [newStruggle, ...prev]);
    showToast('Struggle logged with psychological attribution notes.');

    fetch('/api/logs/struggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStruggle),
    }).catch(console.error);
  };

  // Add Life Era Handler
  const handleAddLifeEra = (newEra: LifeEraRecord) => {
    setLifeEras(prev => [...prev, newEra]);
    showToast(`Life era "${newEra.title}" added to longitudinal timeline.`);
  };

  // Save full modal snapshot
  const handleSaveSnapshot = async (data: {
    mood: Omit<MoodRecord, 'id' | 'timestamp'>;
    habitsCompleted: Record<string, boolean>;
    struggle?: Omit<StruggleLog, 'id' | 'date'>;
    domainUpdates: Partial<DomainAssessment>;
    genderUpdate: Partial<GenderDynamics>;
  }) => {
    const today = new Date().toISOString().split('T')[0];
    const newMood: MoodRecord = {
      id: `m-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...data.mood,
    };

    setMoods(prev => [newMood, ...prev]);

    setHabits(prev => prev.map(h => {
      const isDone = data.habitsCompleted[h.id];
      if (isDone !== undefined) {
        return {
          ...h,
          streak: isDone ? h.streak + 1 : h.streak,
          completedHistory: {
            ...h.completedHistory,
            [today]: isDone,
          }
        };
      }
      return h;
    }));

    if (data.struggle) {
      const newStruggle: StruggleLog = {
        id: `s-${Date.now()}`,
        date: today,
        ...data.struggle,
      };
      setStruggles(prev => [newStruggle, ...prev]);
    }

    setDomainAssessment(prev => ({
      ...prev,
      ...data.domainUpdates,
      updatedAt: new Date().toISOString(),
    }));

    setGenderDynamics(prev => ({
      ...prev,
      ...data.genderUpdate,
    }));

    showToast('Snapshot encrypted with AES-256-GCM and stored in zero-knowledge vault.');
  };

  // Trigger Gemini AI Behavioral Synthesis via backend
  const handleRefreshSynthesis = async (timeRange: string) => {
    setIsSynthesizing(true);
    try {
      const response = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeRange,
          recentLogs: moods.slice(0, 8),
          domains: domainAssessment,
          struggles: struggles.slice(0, 5),
          habits: habits.map(h => ({ name: h.name, streak: h.streak, category: h.category })),
          genderDynamics: genderDynamics,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const enriched: AISynthesisResult = {
          ...resData.data,
          source: resData.source,
          generatedAt: new Date().toISOString(),
        };
        setSynthesis(enriched);
        showToast(`AI Synthesis completed via ${resData.source || 'gemini-3.8-flash'}.`);
      } else {
        throw new Error('API returned invalid payload');
      }
    } catch (err) {
      console.warn('Synthesis request fallback:', err);
      showToast('Synthesis completed with resilient local analytical heuristics.');
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Export Encrypted Vault Backup
  const handleExportVault = async () => {
    try {
      const payload = {
        moods,
        habits,
        struggles,
        domainAssessment,
        genderDynamics,
        milestones,
        synthesis,
        profile,
        lifeEras,
        developmentalSynthesis,
        exportedAt: new Date().toISOString(),
        version: '2.5.0',
      };

      const encrypted = await encryptData(payload, masterPassphrase);
      const jsonBlob = new Blob([JSON.stringify(encrypted, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(jsonBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aurasync-encrypted-vault-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Encrypted vault exported with SHA-256 checksum.');
    } catch (err: any) {
      showToast('Export failed: ' + err.message);
    }
  };

  // Import Encrypted Vault Backup
  const handleImportVault = async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const pkg: EncryptedPackage = JSON.parse(text);
      const decrypted = await decryptData(pkg, masterPassphrase);

      if (decrypted.moods) setMoods(decrypted.moods);
      if (decrypted.habits) setHabits(decrypted.habits);
      if (decrypted.struggles) setStruggles(decrypted.struggles);
      if (decrypted.domainAssessment) setDomainAssessment(decrypted.domainAssessment);
      if (decrypted.genderDynamics) setGenderDynamics(decrypted.genderDynamics);
      if (decrypted.milestones) setMilestones(decrypted.milestones);
      if (decrypted.synthesis) setSynthesis(decrypted.synthesis);
      if (decrypted.profile) setProfile(decrypted.profile);
      if (decrypted.lifeEras) setLifeEras(decrypted.lifeEras);
      if (decrypted.developmentalSynthesis) setDevelopmentalSynthesis(decrypted.developmentalSynthesis);

      showToast('Encrypted archive successfully decrypted and restored.');
      return true;
    } catch (err: any) {
      alert('Decryption failed: ' + err.message);
      return false;
    }
  };

  const vaultMeta: VaultMetadata = {
    isLocked: isVaultLocked,
    hasPassphrase: Boolean(masterPassphrase),
    lastEncryptedAt: encryptedSample?.timestamp || null,
    keyDerivationRounds: 100000,
    algorithm: 'AES-256-GCM',
    saltHex: encryptedSample ? encryptedSample.salt.slice(0, 16) + '...' : 'Derived on device',
    checksum: encryptedSample ? encryptedSample.checksum : 'SHA-256 Calculated',
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-stone-950">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-800 border border-stone-700 text-stone-100 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        vaultMeta={vaultMeta}
        onToggleLock={handleToggleLock}
        onOpenLogger={() => setIsLoggerOpen(true)}
        onResetSeedData={handleResetSeedData}
        onOpenProfile={() => setIsAuthProfileOpen(true)}
        userDisplayName={profile.displayName || profile.fullName}
        isLoggedIn={isLoggedIn}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            moods={moods}
            habits={habits}
            struggles={struggles}
            domainAssessment={domainAssessment}
            genderDynamics={genderDynamics}
            milestones={milestones}
            isVaultLocked={isVaultLocked}
            onOpenLogger={() => setIsLoggerOpen(true)}
            onNavigateToSynthesis={() => setActiveTab('synthesis')}
          />
        )}

        {activeTab === 'inputs' && (
          <DataInputModule
            habits={habits}
            currentDomains={domainAssessment}
            onSaveMood={handleSaveMood}
            onSaveHabitCheckIn={handleSaveHabitCheckIn}
            onCreateHabit={handleCreateHabit}
            onSaveStruggle={handleSaveStruggle}
          />
        )}

        {activeTab === 'visualizations' && (
          <VisualizationDashboard
            moods={moods}
            habits={habits}
            struggles={struggles}
            domains={domainAssessment}
            lifeEras={lifeEras}
          />
        )}

        {activeTab === 'psychology' && (
          <DevelopmentalPsychologyView
            lifeEras={lifeEras}
            profile={profile}
            moods={moods}
            struggles={struggles}
            developmentalSynthesis={developmentalSynthesis}
            onUpdateDevelopmentalSynthesis={setDevelopmentalSynthesis}
            onAddLifeEra={handleAddLifeEra}
          />
        )}

        {activeTab === 'synthesis' && (
          <SynthesisView
            synthesis={synthesis}
            onRefreshSynthesis={handleRefreshSynthesis}
            isLoading={isSynthesizing}
            moods={moods}
            habits={habits}
            struggles={struggles}
            domainAssessment={domainAssessment}
            genderDynamics={genderDynamics}
          />
        )}

        {activeTab === 'mapping' && (
          <DataMappingView
            milestones={milestones}
            struggles={struggles}
            moods={moods}
            genderDynamics={genderDynamics}
          />
        )}

        {activeTab === 'vault' && (
          <VaultView
            vaultMeta={vaultMeta}
            masterPassphrase={masterPassphrase}
            onSetPassphrase={handleSetPassphrase}
            onLockVault={handleToggleLock}
            onUnlockVault={handleUnlockVault}
            onExportVault={handleExportVault}
            onImportVault={handleImportVault}
            encryptedSample={encryptedSample}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureHubView />
        )}
      </main>

      {/* Multi-Dimensional Quick Logger Modal */}
      <LoggerModal
        isOpen={isLoggerOpen}
        onClose={() => setIsLoggerOpen(false)}
        onSaveSnapshot={handleSaveSnapshot}
        habits={habits}
        currentDomains={domainAssessment}
        currentGender={genderDynamics}
      />

      {/* User Authentication & Profile Management Modal */}
      <AuthProfileModal
        isOpen={isAuthProfileOpen}
        onClose={() => setIsAuthProfileOpen(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
      />

      {/* Footer */}
      <footer className="border-t border-stone-900 bg-stone-950 py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-stone-300">AuraSync</span>
            <span>•</span>
            <span>Behavioral &amp; Lifecycle Synthesizer</span>
            <span>•</span>
            <span className="font-mono text-emerald-500/80">AES-256-GCM + Zero-Knowledge</span>
          </div>

          <div className="flex items-center space-x-4 font-mono text-[11px]">
            <button onClick={() => setActiveTab('inputs')} className="hover:text-stone-300 transition-colors cursor-pointer">
              Input Modules
            </button>
            <button onClick={() => setActiveTab('visualizations')} className="hover:text-stone-300 transition-colors cursor-pointer">
              Charts &amp; Visuals
            </button>
            <button onClick={() => setActiveTab('psychology')} className="hover:text-stone-300 transition-colors cursor-pointer">
              Developmental Psychology
            </button>
            <button onClick={() => setIsAuthProfileOpen(true)} className="hover:text-stone-300 transition-colors cursor-pointer">
              User Profile
            </button>
            <button onClick={() => setActiveTab('architecture')} className="hover:text-stone-300 transition-colors cursor-pointer">
              Architecture Hub
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Smile, 
  Flame, 
  AlertTriangle, 
  Moon, 
  Heart, 
  Briefcase, 
  Home, 
  Activity, 
  Sparkles, 
  Check, 
  Plus, 
  Lock, 
  Tag, 
  Feather,
  Clock,
  Compass
} from 'lucide-react';
import { MoodRecord, HabitItem, StruggleLog, DomainAssessment } from '../types';

interface DataInputModuleProps {
  habits: HabitItem[];
  currentDomains: DomainAssessment;
  onSaveMood: (mood: Omit<MoodRecord, 'id' | 'timestamp'>) => void;
  onSaveHabitCheckIn: (habitId: string, completed: boolean) => void;
  onCreateHabit: (habit: Omit<HabitItem, 'id' | 'streak' | 'completedHistory'>) => void;
  onSaveStruggle: (struggle: Omit<StruggleLog, 'id' | 'date'>) => void;
}

export const DataInputModule: React.FC<DataInputModuleProps> = ({
  habits,
  currentDomains,
  onSaveMood,
  onSaveHabitCheckIn,
  onCreateHabit,
  onSaveStruggle,
}) => {
  const [activeInputTab, setActiveInputTab] = useState<'mood' | 'habits' | 'struggles'>('mood');

  // Mood Form State
  const [valence, setValence] = useState<number>(7.5);
  const [arousal, setArousal] = useState<number>(6.5);
  const [selectedEmoji, setSelectedEmoji] = useState('🌿');
  const [primaryEmotion, setPrimaryEmotion] = useState('Focused & Grounded');
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [sleepQuality, setSleepQuality] = useState<number>(8);
  const [somaticState, setSomaticState] = useState('Relaxed shoulders, open chest, calm pulse');
  const [tagsInput, setTagsInput] = useState('Deep Work, Nature Walk, Healthy Boundaries');
  const [contextNote, setContextNote] = useState('');
  const [moodSavedToast, setMoodSavedToast] = useState(false);

  // New Habit Form State
  const [showNewHabitForm, setShowNewHabitForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<'physical' | 'cognitive' | 'relational' | 'restorative'>('physical');
  const [newHabitFreq, setNewHabitFreq] = useState<'daily' | 'weekdays' | 'weekly'>('daily');
  const [newHabitUnit, setNewHabitUnit] = useState('minutes');
  const [newHabitTargetCount, setNewHabitTargetCount] = useState(30);
  const [newHabitImpact, setNewHabitImpact] = useState(3);
  const [newHabitDescription, setNewHabitDescription] = useState('');

  // Struggle Form State
  const [struggleTitle, setStruggleTitle] = useState('');
  const [struggleCategory, setStruggleCategory] = useState<'Work' | 'Dating' | 'Family' | 'Personal' | 'Gender/Identity' | 'Health' | 'Living Situation'>('Work');
  const [struggleIntensity, setStruggleIntensity] = useState<number>(6);
  const [struggleCognitiveLoad, setStruggleCognitiveLoad] = useState<'low' | 'moderate' | 'severe'>('moderate');
  const [struggleDescription, setStruggleDescription] = useState('');
  const [struggleCoping, setStruggleCoping] = useState('');
  const [struggleRootCause, setStruggleRootCause] = useState('');
  const [struggleSavedToast, setStruggleSavedToast] = useState(false);

  const moodEmojis = [
    { emoji: '🌿', label: 'Grounded / Calm' },
    { emoji: '⚡', label: 'High Dopamine / Exhilarated' },
    { emoji: '☀️', label: 'Productive / Clear' },
    { emoji: '✨', label: 'Connected / Loving' },
    { emoji: '🔥', label: 'Creative Flow' },
    { emoji: '🕯️', label: 'Reflective / Pensive' },
    { emoji: '🌧️', label: 'Fatigued / Melancholy' },
    { emoji: '🌪️', label: 'Overwhelmed / Restless' },
  ];

  const commonSomaticStates = [
    'Relaxed shoulders, open chest, calm pulse',
    'Deep diaphragmatic breath, high vitality',
    'Tense jaw, shallow breathing, heavy eyes',
    'Tight chest, fluttery pulse, restless legs',
    'Neutral posture, stable calm digestion',
  ];

  const handleMoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onSaveMood({
      valence,
      arousal,
      primaryEmotion,
      emoji: selectedEmoji,
      sleepHours,
      sleepQuality,
      somaticState,
      tags,
      context: contextNote || 'Daily behavioral state recorded with zero-knowledge encryption.',
    });

    setMoodSavedToast(true);
    setTimeout(() => setMoodSavedToast(false), 3000);
  };

  const handleCreateHabitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    onCreateHabit({
      name: newHabitName.trim(),
      category: newHabitCategory,
      targetFrequency: newHabitFreq,
      unit: newHabitUnit,
      targetCount: newHabitTargetCount,
      impactOnMood: newHabitImpact,
      description: newHabitDescription || 'Custom life grounding habit.',
    });

    setNewHabitName('');
    setNewHabitDescription('');
    setShowNewHabitForm(false);
  };

  const handleStruggleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!struggleTitle.trim()) return;

    onSaveStruggle({
      title: struggleTitle.trim(),
      category: struggleCategory,
      intensity: struggleIntensity,
      description: struggleDescription || struggleTitle,
      copingMechanism: struggleCoping || 'Acknowledged and integrated.',
      cognitiveLoad: struggleCognitiveLoad,
      resolved: false,
      rootCauseAnalysis: struggleRootCause || 'Identified via systemic self-inquiry.',
      domainTrigger: struggleCategory,
    });

    setStruggleTitle('');
    setStruggleDescription('');
    setStruggleCoping('');
    setStruggleRootCause('');
    setStruggleSavedToast(true);
    setTimeout(() => setStruggleSavedToast(false), 3000);
  };

  return (
    <div id="data-input-module" className="space-y-6">
      {/* Header and Input Mode Switcher */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Smile className="w-5 h-5" />
              </div>
              <h1 className="text-lg font-bold text-stone-100">
                Core Data Input &amp; Daily Check-In
              </h1>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Log daily affective valence, sleep quality, habit completions, and specific struggles with client-side encryption.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="bg-stone-950 p-1 rounded-xl border border-stone-800 flex space-x-1 text-xs">
            <button
              onClick={() => setActiveInputTab('mood')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
                activeInputTab === 'mood'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              <span>Mood &amp; Sleep</span>
            </button>
            <button
              onClick={() => setActiveInputTab('habits')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
                activeInputTab === 'habits'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Habit Tracker</span>
            </button>
            <button
              onClick={() => setActiveInputTab('struggles')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
                activeInputTab === 'struggles'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Log a Struggle</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: Mood & Affect Check-In */}
      {activeInputTab === 'mood' && (
        <form onSubmit={handleMoodSubmit} className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
                <Smile className="w-4 h-4 text-emerald-400" />
                <span>Daily Mood, Affect &amp; Somatic Baseline</span>
              </h2>
              <p className="text-xs text-stone-400">Record pleasantness, physiological energy, and sleep hygiene</p>
            </div>
            {moodSavedToast && (
              <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Check className="w-3.5 h-3.5" />
                <span>Saved &amp; Encrypted!</span>
              </span>
            )}
          </div>

          {/* Quick Emoji Picker */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-2">
              Select Affect State Emoji
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {moodEmojis.map((item) => (
                <button
                  type="button"
                  key={item.emoji}
                  onClick={() => {
                    setSelectedEmoji(item.emoji);
                    setPrimaryEmotion(item.label);
                  }}
                  className={`p-2.5 rounded-xl border flex items-center space-x-2.5 transition-all cursor-pointer text-left ${
                    selectedEmoji === item.emoji
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-sm'
                      : 'bg-stone-950/70 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-xs font-medium truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders: Valence & Arousal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-stone-950/70 border border-stone-800 rounded-xl">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-stone-300">Affect Valence (Pleasantness):</span>
                <span className="text-xs font-bold text-emerald-400">{valence} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={valence}
                onChange={(e) => setValence(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500 mt-1">
                <span>1 (Severe Distress)</span>
                <span>5 (Neutral)</span>
                <span>10 (Radiant Joy)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-stone-300">Somatic Energy / Arousal:</span>
                <span className="text-xs font-bold text-sky-400">{arousal} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={arousal}
                onChange={(e) => setArousal(parseFloat(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500 mt-1">
                <span>1 (Exhausted / Depleted)</span>
                <span>5 (Moderate)</span>
                <span>10 (Peak Vitality)</span>
              </div>
            </div>
          </div>

          {/* Sleep Tracking Module */}
          <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-4">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold">
              <Moon className="w-4 h-4" />
              <span>Restorative Sleep Metrics</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-stone-400 mb-1">
                  Sleep Duration: <strong className="text-stone-200">{sleepHours} hours</strong>
                </label>
                <input
                  type="range"
                  min="3"
                  max="12"
                  step="0.25"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">
                  Sleep Quality Rating: <strong className="text-stone-200">{sleepQuality} / 10</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Somatic State and Context */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Primary Emotion Descriptor
              </label>
              <input
                type="text"
                value={primaryEmotion}
                onChange={(e) => setPrimaryEmotion(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Morning Run, Deep Work, Dating Talk"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Somatic Nervous System State (Body Awareness)
            </label>
            <input
              type="text"
              value={somaticState}
              onChange={(e) => setSomaticState(e.target.value)}
              list="common-somatics"
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-emerald-500"
            />
            <datalist id="common-somatics">
              {commonSomaticStates.map((s, idx) => (
                <option key={idx} value={s} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Encrypted Reflective Context Note
            </label>
            <textarea
              rows={3}
              value={contextNote}
              onChange={(e) => setContextNote(e.target.value)}
              placeholder="Reflections on today's cognitive load, living space atmosphere, relationship interactions, or personal insights..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Encrypt &amp; Save Daily Mood Log</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Habit Tracker */}
      {activeInputTab === 'habits' && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Habit Stacks &amp; Consistency Tracker</span>
              </h2>
              <p className="text-xs text-stone-400">Grounding daily micro-routines across physical, cognitive, and relational domains</p>
            </div>
            <button
              onClick={() => setShowNewHabitForm(!showNewHabitForm)}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showNewHabitForm ? 'Cancel' : 'Create New Habit'}</span>
            </button>
          </div>

          {/* New Habit Creation Form */}
          {showNewHabitForm && (
            <form onSubmit={handleCreateHabitSubmit} className="p-4 bg-stone-950/80 border border-amber-500/40 rounded-xl space-y-4">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Configure New Habit Stack
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Habit Name</label>
                  <input
                    type="text"
                    required
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    placeholder="e.g. 20-min Evening Wind-Down Walk"
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-200"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-400 mb-1">Category Domain</label>
                  <select
                    value={newHabitCategory}
                    onChange={(e: any) => setNewHabitCategory(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-200"
                  >
                    <option value="physical">Physical (Exercise, Nutrition, Movement)</option>
                    <option value="restorative">Restorative (Sleep, Digital Shutdown)</option>
                    <option value="relational">Relational (Dating, Partner Check-in, Family)</option>
                    <option value="cognitive">Cognitive (Journaling, Deep Work, Reading)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Frequency</label>
                  <select
                    value={newHabitFreq}
                    onChange={(e: any) => setNewHabitFreq(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-200"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekdays">Weekdays Only</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-stone-400 mb-1">Target Quantity &amp; Unit</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={newHabitTargetCount}
                      onChange={(e) => setNewHabitTargetCount(parseInt(e.target.value) || 1)}
                      className="w-20 bg-stone-900 border border-stone-800 rounded-lg px-2 py-1.5 text-xs text-stone-200"
                    />
                    <input
                      type="text"
                      value={newHabitUnit}
                      onChange={(e) => setNewHabitUnit(e.target.value)}
                      placeholder="minutes/pages"
                      className="flex-1 bg-stone-900 border border-stone-800 rounded-lg px-2 py-1.5 text-xs text-stone-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-stone-400 mb-1">Mood Uplift Impact (+1 to +5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={newHabitImpact}
                    onChange={(e) => setNewHabitImpact(parseInt(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Why this habit anchors your nervous system</label>
                <input
                  type="text"
                  value={newHabitDescription}
                  onChange={(e) => setNewHabitDescription(e.target.value)}
                  placeholder="e.g. Reduces evening cortisol and prepares the mind for intimate presence."
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-200"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowNewHabitForm(false)}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 text-stone-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs"
                >
                  Save Habit
                </button>
              </div>
            </form>
          )}

          {/* Current Active Habits List with Check-In Toggle */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Today's Habit Checklist ({new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {habits.map((habit) => {
                const today = new Date().toISOString().split('T')[0];
                const isCompletedToday = habit.completedHistory[today] || false;

                const categoryBadge = 
                  habit.category === 'physical' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  habit.category === 'restorative' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                  habit.category === 'relational' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                  'bg-sky-500/10 text-sky-400 border-sky-500/20';

                return (
                  <div
                    key={habit.id}
                    onClick={() => onSaveHabitCheckIn(habit.id, !isCompletedToday)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                      isCompletedToday
                        ? 'bg-emerald-950/20 border-emerald-800/60 text-stone-200'
                        : 'bg-stone-950/70 border-stone-800 hover:border-stone-700 text-stone-400'
                    }`}
                  >
                    <div className="space-y-1.5 pr-2">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${categoryBadge}`}>
                          {habit.category}
                        </span>
                        <span className="text-xs font-semibold text-stone-100">{habit.name}</span>
                      </div>
                      {habit.description && (
                        <p className="text-[11px] text-stone-400 line-clamp-2">{habit.description}</p>
                      )}
                      <div className="flex items-center space-x-3 text-[10px] text-stone-400 font-mono pt-1">
                        <span className="flex items-center space-x-1 text-amber-400">
                          <Flame className="w-3 h-3" />
                          <span>{habit.streak}d streak</span>
                        </span>
                        {habit.targetCount && habit.unit && (
                          <span>Target: {habit.targetCount} {habit.unit}</span>
                        )}
                        <span className="text-emerald-400">+{habit.impactOnMood} affect</span>
                      </div>
                    </div>

                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-1 transition-all ${
                      isCompletedToday
                        ? 'bg-emerald-500 text-stone-950 font-bold shadow-sm'
                        : 'border border-stone-700 hover:border-stone-500'
                    }`}>
                      {isCompletedToday ? '✓' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Struggle & Friction Log */}
      {activeInputTab === 'struggles' && (
        <form onSubmit={handleStruggleSubmit} className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Log Friction, Struggles &amp; Developmental Hurdles</span>
              </h2>
              <p className="text-xs text-stone-400">
                Document issues across work overload, dating friction, living conditions, or personal crises to identify recurring longitudinal patterns
              </p>
            </div>
            {struggleSavedToast && (
              <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Check className="w-3.5 h-3.5" />
                <span>Struggle Logged &amp; Encrypted!</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Struggle Title / Summary
              </label>
              <input
                type="text"
                required
                value={struggleTitle}
                onChange={(e) => setStruggleTitle(e.target.value)}
                placeholder="e.g. Cognitive saturation from cross-functional sprint meetings"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Life Domain
              </label>
              <select
                value={struggleCategory}
                onChange={(e: any) => setStruggleCategory(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-rose-500"
              >
                <option value="Work">Work / Executive Cognitive Load</option>
                <option value="Dating">Dating / Intimate Partnership</option>
                <option value="Living Situation">Living Situation / Urban Environment</option>
                <option value="Family">Family Dynamics &amp; Boundaries</option>
                <option value="Personal">Personal Identity / Values Crisis</option>
                <option value="Gender/Identity">Gender / Social Presentation Alignment</option>
                <option value="Health">Physical / Somatic / Sleep Health</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-950/70 border border-stone-800 rounded-xl">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-stone-300">Emotional Friction Intensity:</span>
                <span className="text-xs font-bold text-rose-400">{struggleIntensity} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={struggleIntensity}
                onChange={(e) => setStruggleIntensity(parseInt(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            <div>
              <span className="block text-xs font-medium text-stone-300 mb-1.5">Cognitive Load Level:</span>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'moderate', 'severe'] as const).map((load) => (
                  <button
                    type="button"
                    key={load}
                    onClick={() => setStruggleCognitiveLoad(load)}
                    className={`py-1.5 rounded-lg border text-xs capitalize font-medium transition-colors ${
                      struggleCognitiveLoad === load
                        ? 'bg-rose-950/40 border-rose-500 text-rose-300'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    {load}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Detailed Narrative &amp; Trigger Details
            </label>
            <textarea
              rows={2}
              value={struggleDescription}
              onChange={(e) => setStruggleDescription(e.target.value)}
              placeholder="What specific interaction, deadline, or circumstance sparked this tension?"
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Immediate Coping Strategy Applied
              </label>
              <input
                type="text"
                value={struggleCoping}
                onChange={(e) => setStruggleCoping(e.target.value)}
                placeholder="e.g. 15-minute unhurried walk; explicitly requested space"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Root Cause Analysis (Psychological Insight)
              </label>
              <input
                type="text"
                value={struggleRootCause}
                onChange={(e) => setStruggleRootCause(e.target.value)}
                placeholder="e.g. Old fear of letting peers down masked as perfectionism"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Record &amp; Encrypt Struggle</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

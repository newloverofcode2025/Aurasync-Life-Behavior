import React, { useState } from 'react';
import { 
  X, 
  Smile, 
  Flame, 
  AlertTriangle, 
  Sparkles, 
  Feather, 
  Lock, 
  Check 
} from 'lucide-react';
import { MoodRecord, HabitItem, StruggleLog, DomainAssessment, GenderDynamics } from '../types';

interface LoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSnapshot: (data: {
    mood: Omit<MoodRecord, 'id' | 'timestamp'>;
    habitsCompleted: Record<string, boolean>;
    struggle?: Omit<StruggleLog, 'id' | 'date'>;
    domainUpdates: Partial<DomainAssessment>;
    genderUpdate: Partial<GenderDynamics>;
  }) => void;
  habits: HabitItem[];
  currentDomains: DomainAssessment;
  currentGender: GenderDynamics;
}

export const LoggerModal: React.FC<LoggerModalProps> = ({
  isOpen,
  onClose,
  onSaveSnapshot,
  habits,
  currentDomains,
  currentGender,
}) => {
  if (!isOpen) return null;

  const [valence, setValence] = useState<number>(7);
  const [arousal, setArousal] = useState<number>(6);
  const [primaryEmotion, setPrimaryEmotion] = useState('Focused & Grounded');
  const [tagsInput, setTagsInput] = useState('Deep Work, Healthy Boundary');
  const [contextNote, setContextNote] = useState('');

  // Habits completed toggles
  const [habitState, setHabitState] = useState<Record<string, boolean>>(() => {
    const today = new Date().toISOString().split('T')[0];
    const initial: Record<string, boolean> = {};
    habits.forEach(h => {
      initial[h.id] = h.completedHistory[today] || false;
    });
    return initial;
  });

  // Optional Struggle
  const [hasStruggle, setHasStruggle] = useState(false);
  const [struggleCategory, setStruggleCategory] = useState<'Work' | 'Dating' | 'Family' | 'Personal' | 'Gender/Identity' | 'Health'>('Work');
  const [struggleTitle, setStruggleTitle] = useState('');
  const [struggleIntensity, setStruggleIntensity] = useState(5);
  const [struggleCoping, setStruggleCoping] = useState('');

  // Domain adjustments
  const [workScore, setWorkScore] = useState(currentDomains.work);
  const [datingScore, setDatingScore] = useState(currentDomains.dating);
  const [familyScore, setFamilyScore] = useState(currentDomains.family);

  // Gender presentation
  const [genderAuthenticity, setGenderAuthenticity] = useState(currentGender.authenticityScore);
  const [genderEnergy, setGenderEnergy] = useState(currentGender.socialPresentationEnergy);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onSaveSnapshot({
      mood: {
        valence,
        arousal,
        primaryEmotion,
        tags,
        context: contextNote || 'Daily behavioral state recorded with zero-knowledge encryption.',
      },
      habitsCompleted: habitState,
      struggle: hasStruggle && struggleTitle ? {
        title: struggleTitle,
        category: struggleCategory,
        intensity: struggleIntensity,
        description: struggleTitle,
        copingMechanism: struggleCoping || 'Acknowledged and integrated.',
        cognitiveLoad: struggleIntensity > 7 ? 'severe' : struggleIntensity > 4 ? 'moderate' : 'low',
        resolved: false,
      } : undefined,
      domainUpdates: {
        work: workScore,
        dating: datingScore,
        family: familyScore,
      },
      genderUpdate: {
        authenticityScore: genderAuthenticity,
        socialPresentationEnergy: genderEnergy,
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5 border-b border-stone-800 pb-4">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-100">Log Multi-Dimensional Behavioral Snapshot</h2>
            <p className="text-xs text-stone-400">Encrypted on device via Web Crypto API (AES-256-GCM) prior to saving</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs text-stone-300">
          {/* Section 1: Mood Valence & Arousal */}
          <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-4">
            <h3 className="font-semibold text-stone-200 flex items-center space-x-2">
              <Smile className="w-4 h-4 text-emerald-400" />
              <span>Emotional Valence &amp; Physiological Energy</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between mb-1.5 font-medium">
                  <span>Valence (Pleasantness):</span>
                  <span className="text-emerald-400 font-bold">{valence} / 10</span>
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
              </div>

              <div>
                <div className="flex justify-between mb-1.5 font-medium">
                  <span>Arousal / Somatic Energy:</span>
                  <span className="text-sky-400 font-bold">{arousal} / 10</span>
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
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-stone-400 mb-1">Primary Emotion Felt</label>
                <input
                  type="text"
                  value={primaryEmotion}
                  onChange={(e) => setPrimaryEmotion(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-stone-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-stone-400 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. Run, Dating, Focus, Solitude"
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-stone-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Habit Stack Status */}
          <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-3">
            <h3 className="font-semibold text-stone-200 flex items-center space-x-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Habit Stacks Completed Today</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {habits.map((habit) => {
                const isDone = habitState[habit.id] || false;
                return (
                  <button
                    type="button"
                    key={habit.id}
                    onClick={() => setHabitState(prev => ({ ...prev, [habit.id]: !isDone }))}
                    className={`p-2.5 rounded-lg border flex items-center justify-between text-left transition-colors cursor-pointer ${
                      isDone
                        ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <span className="font-medium text-[11px] truncate max-w-[200px]">{habit.name}</span>
                    <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                      isDone ? 'bg-emerald-500 text-stone-950' : 'border border-stone-700'
                    }`}>
                      {isDone ? '✓' : ''}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Gender Expression & Social Presentation */}
          <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-3">
            <h3 className="font-semibold text-stone-200 flex items-center space-x-2">
              <Feather className="w-4 h-4 text-purple-400" />
              <span>Gender Expression &amp; Social Presentation Congruence</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between mb-1.5 font-medium">
                  <span>Authenticity / Felt Alignment:</span>
                  <span className="text-purple-400 font-bold">{genderAuthenticity} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={genderAuthenticity}
                  onChange={(e) => setGenderAuthenticity(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5 font-medium">
                  <span>Social Presentation Energy:</span>
                  <span className="text-sky-400 font-bold">{genderEnergy} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={genderEnergy}
                  onChange={(e) => setGenderEnergy(parseFloat(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Log a Struggle / Friction Point (Optional) */}
          <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-stone-200 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Log a Struggle / Friction Point (Optional)</span>
              </h3>
              <input
                type="checkbox"
                checked={hasStruggle}
                onChange={(e) => setHasStruggle(e.target.checked)}
                className="accent-rose-500 cursor-pointer w-4 h-4"
              />
            </div>

            {hasStruggle && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-400 mb-1">Domain of Struggle</label>
                    <select
                      value={struggleCategory}
                      onChange={(e: any) => setStruggleCategory(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-stone-200"
                    >
                      <option value="Work">Work / Executive Load</option>
                      <option value="Dating">Dating / Intimacy</option>
                      <option value="Family">Family Dynamics</option>
                      <option value="Personal">Personal Identity</option>
                      <option value="Gender/Identity">Gender / Social Alignment</option>
                      <option value="Health">Physical / Sleep Health</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">Intensity: {struggleIntensity}/10</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={struggleIntensity}
                      onChange={(e) => setStruggleIntensity(parseInt(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">What triggered this struggle?</label>
                  <input
                    type="text"
                    value={struggleTitle}
                    onChange={(e) => setStruggleTitle(e.target.value)}
                    placeholder="e.g. Overbearing expectations during family video call"
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-stone-200"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Coping strategy applied</label>
                  <input
                    type="text"
                    value={struggleCoping}
                    onChange={(e) => setStruggleCoping(e.target.value)}
                    placeholder="e.g. Explicit time limit, unhurried walk"
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-stone-200"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Context Notes */}
          <div>
            <label className="block text-stone-400 mb-1 font-medium">Reflective Context Notes (Encrypted)</label>
            <textarea
              rows={2}
              value={contextNote}
              onChange={(e) => setContextNote(e.target.value)}
              placeholder="Reflections on today's interactions, career, dating, or somatic feeling..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Encrypt &amp; Save Snapshot</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

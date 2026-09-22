import React, { useState } from 'react';
import { 
  Compass, 
  Home, 
  Briefcase, 
  Heart, 
  Brain, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  MapPin, 
  Clock, 
  Calendar, 
  Plus, 
  TrendingUp, 
  ShieldCheck, 
  Layers,
  ArrowRight,
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { LifeEraRecord, DevelopmentalPsychologySynthesis, UserProfile, MoodRecord, StruggleLog } from '../types';

interface DevelopmentalPsychologyViewProps {
  lifeEras: LifeEraRecord[];
  profile: UserProfile;
  moods: MoodRecord[];
  struggles: StruggleLog[];
  developmentalSynthesis: DevelopmentalPsychologySynthesis;
  onUpdateDevelopmentalSynthesis: (synthesis: DevelopmentalPsychologySynthesis) => void;
  onAddLifeEra: (era: LifeEraRecord) => void;
}

export const DevelopmentalPsychologyView: React.FC<DevelopmentalPsychologyViewProps> = ({
  lifeEras,
  profile,
  moods,
  struggles,
  developmentalSynthesis,
  onUpdateDevelopmentalSynthesis,
  onAddLifeEra,
}) => {
  const [selectedEraId, setSelectedEraId] = useState<string>(lifeEras[lifeEras.length - 1]?.id || 'era-3');
  const [activeAnalysisSection, setActiveAnalysisSection] = useState<'synthesis' | 'eras' | 'patterns' | 'living' | 'career' | 'relationships'>('synthesis');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [showAddEraModal, setShowAddEraModal] = useState(false);

  // New Era Form State
  const [newEraTimeframe, setNewEraTimeframe] = useState('');
  const [newEraTitle, setNewEraTitle] = useState('');
  const [newEraLocation, setNewEraLocation] = useState('');
  const [newEraLiving, setNewEraLiving] = useState('');
  const [newEraEmployment, setNewEraEmployment] = useState('');
  const [newEraRelationship, setNewEraRelationship] = useState('');
  const [newEraPsychology, setNewEraPsychology] = useState('');
  const [newEraAffect, setNewEraAffect] = useState<number>(7.0);
  const [newEraConcerns, setNewEraConcerns] = useState('');
  const [newEraGrowth, setNewEraGrowth] = useState('');
  const [newEraMeaning, setNewEraMeaning] = useState('');

  const currentSelectedEra = lifeEras.find(e => e.id === selectedEraId) || lifeEras[0];

  const handleRunDevelopmentalSynthesis = async () => {
    setIsSynthesizing(true);
    try {
      const res = await fetch('/api/developmental-synthesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lifeEras,
          profile,
          recentMoods: moods.slice(0, 10),
          struggles,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        onUpdateDevelopmentalSynthesis(json.data);
      }
    } catch (err) {
      console.error('Failed to trigger developmental synthesis:', err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleCreateEraSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEraTitle || !newEraTimeframe) return;

    const newEra: LifeEraRecord = {
      id: `era-${Date.now()}`,
      timeframe: newEraTimeframe,
      title: newEraTitle,
      cityAndLocation: newEraLocation || profile.livingSituation.currentCity,
      livingSituation: newEraLiving || profile.livingSituation.housingType,
      employmentRole: newEraEmployment || profile.employment.jobTitle,
      relationshipPhase: newEraRelationship || 'Committed relational presence',
      psychologicalEra: newEraPsychology || 'Developmental Evolution',
      baselineAffect: newEraAffect,
      keyConcerns: newEraConcerns.split(',').map(s => s.trim()).filter(Boolean),
      keyGrowthLeaps: newEraGrowth.split(',').map(s => s.trim()).filter(Boolean),
      meaningAndSynthesis: newEraMeaning || 'Era recorded in longitudinal developmental arc.',
    };

    onAddLifeEra(newEra);
    setSelectedEraId(newEra.id);
    setShowAddEraModal(false);

    // Reset form
    setNewEraTimeframe('');
    setNewEraTitle('');
    setNewEraLocation('');
    setNewEraLiving('');
    setNewEraEmployment('');
    setNewEraRelationship('');
    setNewEraPsychology('');
    setNewEraConcerns('');
    setNewEraGrowth('');
    setNewEraMeaning('');
  };

  return (
    <div id="developmental-psychology-view" className="space-y-6">
      {/* Top Banner & Executive Overview */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Brain className="w-5 h-5" />
              </div>
              <h1 className="text-lg font-bold text-stone-100">
                Developmental Psychology &amp; Longitudinal Life Eras
              </h1>
            </div>
            <p className="text-xs text-stone-400 max-w-3xl">
              Deep clinical and psychological synthesis analyzing developmental personal changes, housing environments, career transitions, and intimate relational patterns across years.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setShowAddEraModal(true)}
              className="px-3 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Document Life Era</span>
            </button>
            <button
              onClick={handleRunDevelopmentalSynthesis}
              disabled={isSynthesizing}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
              <span>{isSynthesizing ? 'Synthesizing Psychology...' : 'Generate AI Psychological Synthesis'}</span>
            </button>
          </div>
        </div>

        {/* 4 Core Developmental Anchors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
          <div className="p-3.5 bg-stone-950/70 border border-stone-800 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-mono text-stone-500 block flex items-center space-x-1">
              <Clock className="w-3 h-3 text-indigo-400" />
              <span>Observation Horizon</span>
            </span>
            <span className="text-sm font-bold text-stone-200 block">6 Years (2020 – 2026)</span>
            <span className="text-[11px] text-stone-400 block">3 Documented Eras</span>
          </div>

          <div className="p-3.5 bg-stone-950/70 border border-stone-800 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-mono text-stone-500 block flex items-center space-x-1">
              <Compass className="w-3 h-3 text-sky-400" />
              <span>Developmental Stage</span>
            </span>
            <span className="text-sm font-bold text-stone-200 block">{profile.developmentalEra.lifeStage}</span>
            <span className="text-[11px] text-sky-400 block font-medium">Age {profile.developmentalEra.ageBracket}</span>
          </div>

          <div className="p-3.5 bg-stone-950/70 border border-stone-800 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-mono text-stone-500 block flex items-center space-x-1">
              <Heart className="w-3 h-3 text-rose-400" />
              <span>Attachment Trajectory</span>
            </span>
            <span className="text-sm font-bold text-stone-200 block">{profile.developmentalEra.attachmentStyle} Anchor</span>
            <span className="text-[11px] text-emerald-400 block">Migrated from Anxious</span>
          </div>

          <div className="p-3.5 bg-stone-950/70 border border-stone-800 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-mono text-stone-500 block flex items-center space-x-1">
              <Home className="w-3 h-3 text-emerald-400" />
              <span>Living Situation Lift</span>
            </span>
            <span className="text-sm font-bold text-emerald-400 block">+39% Affect Baseline</span>
            <span className="text-[11px] text-stone-400 block">5.8 (Shared) → 8.1 (Solo Loft)</span>
          </div>
        </div>

        {/* Section Sub-Navigation */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-stone-800 text-xs">
          <button
            onClick={() => setActiveAnalysisSection('synthesis')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeAnalysisSection === 'synthesis'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Psychological Synthesis</span>
          </button>
          <button
            onClick={() => setActiveAnalysisSection('eras')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeAnalysisSection === 'eras'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Multi-Year Eras Timeline</span>
          </button>
          <button
            onClick={() => setActiveAnalysisSection('living')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeAnalysisSection === 'living'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Living Situations &amp; Geography</span>
          </button>
          <button
            onClick={() => setActiveAnalysisSection('career')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeAnalysisSection === 'career'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Employment &amp; Burnout Arcs</span>
          </button>
          <button
            onClick={() => setActiveAnalysisSection('relationships')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeAnalysisSection === 'relationships'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Relationships &amp; Intimacy in Depth</span>
          </button>
          <button
            onClick={() => setActiveAnalysisSection('patterns')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeAnalysisSection === 'patterns'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Common Concerns &amp; Defenses</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: AI Psychological Synthesis Overview */}
      {activeAnalysisSection === 'synthesis' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-sm space-y-6">
            <div className="border-b border-stone-800 pb-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                CLINICAL DEVELOPMENTAL SYNTHESIS
              </span>
              <h2 className="text-xl font-bold text-stone-100 mt-2">
                {developmentalSynthesis.overallArcTitle}
              </h2>
            </div>

            {/* Core Identity Evolution */}
            <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-2">
              <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center space-x-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>Core Identity Evolution &amp; Self-Authorship</span>
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                {developmentalSynthesis.coreIdentityEvolution}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Living Environment Impact */}
              <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-2">
                <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center space-x-2">
                  <Home className="w-4 h-4 text-emerald-400" />
                  <span>Living Environment &amp; Spatial Neurobiology</span>
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {developmentalSynthesis.livingEnvironmentImpact}
                </p>
              </div>

              {/* Employment & Burnout */}
              <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-2">
                <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <span>Employment Trajectory &amp; Burnout Economics</span>
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {developmentalSynthesis.employmentAndBurnoutAnalysis}
                </p>
              </div>
            </div>

            {/* Relationships and Attachment Arc */}
            <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-2">
              <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center space-x-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Relationships, Dating Cycles &amp; Intimacy in Depth</span>
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                {developmentalSynthesis.relationshipAndAttachmentArc}
              </p>
            </div>

            {/* Longitudinal Meaning & Wisdom */}
            <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-2">
              <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Longitudinal Meaning &amp; Existential Coherence</span>
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                {developmentalSynthesis.longitudinalMeaningAndWisdom}
              </p>
            </div>

            {/* Next Developmental Horizons */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Next Developmental Horizon Milestones</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {developmentalSynthesis.developmentalMilestoneRoadmap.map((item, idx) => (
                  <div key={idx} className="p-3 bg-stone-950 border border-stone-800 rounded-xl text-xs space-y-1">
                    <span className="text-indigo-400 font-mono text-[10px]">HORIZON 0{idx + 1}</span>
                    <p className="text-stone-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Multi-Year Eras Timeline */}
      {activeAnalysisSection === 'eras' && (
        <div className="space-y-6">
          {/* Era Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lifeEras.map((era) => {
              const isSelected = era.id === selectedEraId;
              return (
                <div
                  key={era.id}
                  onClick={() => setSelectedEraId(era.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-indigo-950/30 border-indigo-500 shadow-md text-stone-100'
                      : 'bg-stone-900 border-stone-800 hover:border-stone-700 text-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-indigo-400 font-bold">{era.timeframe}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                      Affect: {era.baselineAffect}/10
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-stone-200">{era.title}</h3>
                  <div className="flex items-center space-x-1.5 text-xs text-stone-400">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{era.cityAndLocation}</span>
                  </div>
                  <p className="text-[11px] text-stone-400 line-clamp-2">{era.meaningAndSynthesis}</p>
                </div>
              );
            })}
          </div>

          {/* Selected Era Deep Dive Card */}
          {currentSelectedEra && (
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                      {currentSelectedEra.timeframe}
                    </span>
                    <span className="text-xs text-stone-400 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{currentSelectedEra.cityAndLocation}</span>
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-stone-100 mt-1">{currentSelectedEra.title}</h2>
                  <p className="text-xs text-indigo-300 font-medium">Psychological Theme: {currentSelectedEra.psychologicalEra}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-stone-400 block">Baseline Affect</span>
                  <span className="text-2xl font-bold text-emerald-400">{currentSelectedEra.baselineAffect} <span className="text-xs text-stone-500">/ 10</span></span>
                </div>
              </div>

              {/* Grid breakdown of the era's 3 life domains */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-2">
                  <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <Home className="w-4 h-4" />
                    <span>Living Situation</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {currentSelectedEra.livingSituation}
                  </p>
                </div>

                <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-2">
                  <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <Briefcase className="w-4 h-4" />
                    <span>Employment &amp; Career</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {currentSelectedEra.employmentRole}
                  </p>
                </div>

                <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-2">
                  <div className="flex items-center space-x-1.5 text-rose-400 text-xs font-bold uppercase tracking-wider">
                    <Heart className="w-4 h-4" />
                    <span>Relationships &amp; Dating</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {currentSelectedEra.relationshipPhase}
                  </p>
                </div>
              </div>

              {/* Concerns vs Growth Leaps in this era */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-rose-950/20 border border-rose-900/40 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center space-x-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>Dominant Psychological Concerns</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-300">
                    {currentSelectedEra.keyConcerns.map((c, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-rose-500 font-bold shrink-0">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Developmental Growth Leaps</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-300">
                    {currentSelectedEra.keyGrowthLeaps.map((g, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-emerald-500 font-bold shrink-0">•</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Era Meaning Synthesis */}
              <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">Longitudinal Meaning &amp; Lesson</span>
                <p className="text-xs text-stone-300 italic leading-relaxed">
                  "{currentSelectedEra.meaningAndSynthesis}"
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: Living Situations & Geography in Depth */}
      {activeAnalysisSection === 'living' && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-stone-800 pb-3">
            <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
              <Home className="w-4 h-4 text-emerald-400" />
              <span>Living Situations, Place of Residence &amp; Physical Space over Years</span>
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Analyzing how domestic arrangement, acoustic insulation, natural light, and geography altered psychological affect
            </p>
          </div>

          <div className="space-y-4">
            {lifeEras.map((era) => (
              <div key={era.id} className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-stone-100">{era.cityAndLocation}</span>
                    <span className="font-mono text-[11px] text-stone-400">({era.timeframe})</span>
                  </div>
                  <span className="text-emerald-400 font-mono">Baseline: {era.baselineAffect}/10</span>
                </div>
                <p className="text-stone-300">
                  <strong className="text-stone-400">Living Condition:</strong> {era.livingSituation}
                </p>
                <div className="text-[11px] text-stone-400 border-t border-stone-800/80 pt-2">
                  <span className="text-emerald-400 font-medium">Psychological Footprint: </span>
                  {era.timeframe.includes('2020') 
                    ? 'High acoustic friction from roommates interrupted morning parasympathetic tone, compounding workplace stress.'
                    : era.timeframe.includes('2023')
                    ? 'Transition to solo apartment restored baseline sleep, but intense startup pacing brought work back into the living room.'
                    : 'Acoustically isolated loft facing evergreen trees eliminated baseline sensory overstimulation, unlocking sustained creative flow.'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: Career & Employment Arcs */}
      {activeAnalysisSection === 'career' && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-stone-800 pb-3">
            <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Career Trajectories, Cognitive Load &amp; Burnout over Years</span>
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Tracking role progression from survival compliance to high-autonomy architectural leverage
            </p>
          </div>

          <div className="space-y-4">
            {lifeEras.map((era) => (
              <div key={era.id} className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-stone-100">{era.employmentRole}</span>
                    <span className="font-mono text-[11px] text-amber-400">({era.timeframe})</span>
                  </div>
                  <span className="text-stone-400">{era.title}</span>
                </div>
                <div className="text-[11px] text-stone-300 space-y-1">
                  <p>
                    <strong className="text-stone-400">Workplace Psychology: </strong>
                    {era.timeframe.includes('2020')
                      ? 'Operated from imposter defense; over-delivered on late pull requests to feel worthy of team respect.'
                      : era.timeframe.includes('2023')
                      ? 'High technical leverage masked chronic cognitive over-extension; experienced brief cynicism and executive fatigue.'
                      : 'Established immutable asynchronous boundaries; shifted focus from personal velocity to mentoring and high-leverage architectural stewardship.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: Relationships & Intimacy in Depth */}
      {activeAnalysisSection === 'relationships' && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-stone-800 pb-3">
            <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Relationships, Dating Cycles &amp; Family Differentiation over Years</span>
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Longitudinal analysis of intimate partnership, attachment style maturation, and family boundary development
            </p>
          </div>

          <div className="space-y-4">
            {lifeEras.map((era) => (
              <div key={era.id} className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-stone-100">{era.relationshipPhase}</span>
                    <span className="font-mono text-[11px] text-rose-400">({era.timeframe})</span>
                  </div>
                </div>
                <p className="text-stone-300">
                  <strong className="text-stone-400">Relational Insight: </strong>
                  {era.timeframe.includes('2020')
                    ? 'High fear of partner abandonment prompted over-accommodation and suppression of genuine emotional needs.'
                    : era.timeframe.includes('2023')
                    ? 'Crucial conflict crucible: moved away from passive-aggressive avoidance to direct, vulnerable boundary setting.'
                    : 'Secure, emotionally attuned co-creation: daily relational check-in habits buffer against outside work friction.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: Common Concerns & Clinical Defenses Tracker */}
      {activeAnalysisSection === 'patterns' && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-stone-800 pb-3">
            <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-purple-400" />
              <span>Common Concerns, Clinical Defenses &amp; Cognitive Patterns</span>
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Identifying root origin eras and current presentations of psychological defense mechanisms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {developmentalSynthesis.commonPsychologicalPatterns.map((pat, idx) => (
              <div key={idx} className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-3 text-xs">
                <div className="border-b border-stone-800 pb-2">
                  <span className="text-[10px] font-mono uppercase text-purple-400 block">{pat.originEra}</span>
                  <h3 className="font-bold text-stone-100 text-sm mt-0.5">{pat.concern}</h3>
                </div>

                <div>
                  <span className="text-stone-400 font-semibold block text-[11px]">Current Manifestation:</span>
                  <p className="text-stone-300 mt-0.5">{pat.currentManifestation}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-800/40 text-[11px] text-purple-200">
                  <span className="font-semibold block text-purple-300">Clinical Reframing:</span>
                  <p className="mt-0.5">{pat.clinicalFraming}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Document New Life Era */}
      {showAddEraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative my-8 text-stone-200 space-y-4">
            <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-stone-100">Document a New Longitudinal Era</h2>
                <p className="text-xs text-stone-400">Add an earlier life era or newly emerging developmental chapter</p>
              </div>
              <button
                onClick={() => setShowAddEraModal(false)}
                className="text-stone-400 hover:text-stone-200 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEraSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-400 mb-1">Timeframe (e.g. 2018 - 2020)</label>
                  <input
                    type="text"
                    required
                    value={newEraTimeframe}
                    onChange={(e) => setNewEraTimeframe(e.target.value)}
                    placeholder="e.g. 2018 - 2020"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Era Title</label>
                  <input
                    type="text"
                    required
                    value={newEraTitle}
                    onChange={(e) => setNewEraTitle(e.target.value)}
                    placeholder="e.g. Undergraduate Striving &amp; Identity Awakening"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-400 mb-1">City / Location</label>
                  <input
                    type="text"
                    value={newEraLocation}
                    onChange={(e) => setNewEraLocation(e.target.value)}
                    placeholder="e.g. Chicago, IL"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Baseline Affect (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.1"
                    value={newEraAffect}
                    onChange={(e) => setNewEraAffect(parseFloat(e.target.value) || 5.0)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Living Situation &amp; Housing</label>
                <input
                  type="text"
                  value={newEraLiving}
                  onChange={(e) => setNewEraLiving(e.target.value)}
                  placeholder="e.g. Shared campus apartment, high noise, limited kitchen space"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Employment / Occupation</label>
                <input
                  type="text"
                  value={newEraEmployment}
                  onChange={(e) => setNewEraEmployment(e.target.value)}
                  placeholder="e.g. Engineering intern &amp; research assistant"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Relationships &amp; Dating Dynamics</label>
                <input
                  type="text"
                  value={newEraRelationship}
                  onChange={(e) => setNewEraRelationship(e.target.value)}
                  placeholder="e.g. Solitary, exploring attachment, high social hesitation"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Dominant Psychological Concerns (comma-separated)</label>
                <input
                  type="text"
                  value={newEraConcerns}
                  onChange={(e) => setNewEraConcerns(e.target.value)}
                  placeholder="e.g. Social anxiety, career uncertainty, filial guilt"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Growth Leaps &amp; Developmental Milestones</label>
                <input
                  type="text"
                  value={newEraGrowth}
                  onChange={(e) => setNewEraGrowth(e.target.value)}
                  placeholder="e.g. Completed degree, initiated therapy, developed personal code of ethics"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Meaning &amp; Retrospective Synthesis</label>
                <textarea
                  rows={2}
                  value={newEraMeaning}
                  onChange={(e) => setNewEraMeaning(e.target.value)}
                  placeholder="What did this era teach you about yourself?"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEraModal(false)}
                  className="px-4 py-2 rounded-lg bg-stone-800 text-stone-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer"
                >
                  Save Era to Timeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

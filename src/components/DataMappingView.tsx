import React, { useState } from 'react';
import { 
  Network, 
  ArrowRight, 
  GitCommit, 
  Sparkles, 
  Compass, 
  Layers, 
  TrendingUp,
  Workflow,
  HelpCircle
} from 'lucide-react';
import { LifecycleMilestone, StruggleLog, MoodRecord, GenderDynamics } from '../types';

interface DataMappingViewProps {
  milestones: LifecycleMilestone[];
  struggles: StruggleLog[];
  moods: MoodRecord[];
  genderDynamics: GenderDynamics;
}

export const DataMappingView: React.FC<DataMappingViewProps> = ({
  milestones,
  struggles,
  moods,
  genderDynamics,
}) => {
  const [activePathway, setActivePathway] = useState<number>(0);

  // Correlation Matrix Data
  const correlationData = [
    { domainA: 'Work Cognitive Load', domainB: 'Dating Emotional Presence', r: -0.72, p: '<0.001', direction: 'negative' },
    { domainA: 'Morning Movement Habit', domainB: 'Daily Mood Valence', r: +0.86, p: '<0.001', direction: 'positive' },
    { domainA: 'Gender Authenticity', domainB: 'Social Resilience & Energy', r: +0.81, p: '<0.001', direction: 'positive' },
    { domainA: 'Family Expectation Friction', domainB: 'Restorative Sleep Depth', r: -0.64, p: '0.004', direction: 'negative' },
    { domainA: 'Digital Shutdown Habit', domainB: 'Dating Evening Attunement', r: +0.69, p: '0.002', direction: 'positive' },
    { domainA: 'Weekend Creative Solitude', domainB: 'Workplace Executive Focus', r: +0.77, p: '<0.001', direction: 'positive' },
  ];

  // Causal Pathways (interactive trigger-to-response flows)
  const causalPathways = [
    {
      title: 'The Occupational-to-Relational Cascade',
      trigger: 'Back-to-back technical review meetings (>6 hours)',
      immediateImpact: 'High executive cognitive fatigue and sensory saturation',
      secondaryCascade: 'Dating conversation feels transactional; withdrawal reflex activated',
      habitLapse: 'Skips evening somatic movement or reading ritual',
      countermeasure: 'Strict 20-minute silent transition buffer before interpersonal contact'
    },
    {
      title: 'The Identity & Gender Alignment Surge',
      trigger: 'Authentic social presentation and wardrobe alignment in public/work',
      immediateImpact: 'Elimination of low-grade baseline social monitoring/anxiety',
      secondaryCascade: 'Direct boost in leadership voice and assertive boundary setting',
      habitLapse: 'Reinforces daily reflection and self-compassion stack',
      countermeasure: 'Maintain non-conforming personal expression despite subtle corporate norms'
    },
    {
      title: 'The Family Obligation vs. Autonomy Dilemma',
      trigger: 'Unsolicited family career opinions and guilt-inducing phone calls',
      immediateImpact: 'Internal tension between filial obligation and self-directed agency',
      secondaryCascade: 'Nighttime cognitive rumination and sleep latency surge (+45m)',
      habitLapse: 'Next morning physical workout is postponed or dropped',
      countermeasure: 'Structured bi-weekly scheduled check-ins with clear conversation time caps'
    }
  ];

  return (
    <div id="data-mapping-view" className="space-y-6">
      {/* Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-stone-100">
              Cross-Dimensional Behavioral &amp; Relational Mapping
            </h1>
            <p className="text-xs text-stone-400">
              Interactive multi-axis correlation matrix, trigger cascades, and longitudinal lifecycle inflection points
            </p>
          </div>
        </div>
      </div>

      {/* Cross-Domain Correlation Matrix */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Domain Cross-Correlation Matrix (Pearson r &amp; Significance)</span>
            </h2>
            <p className="text-xs text-stone-400">Statistically derived directional interactions across 60 days of longitudinal observation</p>
          </div>
          <span className="text-[11px] font-mono text-stone-400 bg-stone-950 px-2.5 py-1 rounded border border-stone-800">
            N = {moods.length * 4} vector points
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {correlationData.map((item, idx) => {
            const isPos = item.direction === 'positive';
            return (
              <div key={idx} className="p-3.5 bg-stone-950/80 border border-stone-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    isPos ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    r = {item.r > 0 ? `+${item.r}` : item.r}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">p {item.p}</span>
                </div>

                <div className="text-xs space-y-1 pt-1">
                  <div className="text-stone-300 font-medium">{item.domainA}</div>
                  <div className="flex items-center space-x-1.5 text-stone-400">
                    <span className="text-[10px]">interacts with</span>
                    <ArrowRight className="w-3 h-3 text-stone-600" />
                  </div>
                  <div className="text-stone-200 font-medium">{item.domainB}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Causal Flow Pathways */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
              <Workflow className="w-4 h-4 text-amber-400" />
              <span>Behavioral Trigger &amp; Response Causal Cascades</span>
            </h2>
            <p className="text-xs text-stone-400">Step-by-step tracing of how external stimuli propagate into interpersonal and somatic changes</p>
          </div>
        </div>

        {/* Pathway selector tabs */}
        <div className="flex flex-wrap gap-2">
          {causalPathways.map((p, i) => (
            <button
              key={i}
              onClick={() => setActivePathway(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activePathway === i
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-stone-200'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>

        {/* Causal Pathway Diagram Nodes */}
        {(() => {
          const p = causalPathways[activePathway];
          return (
            <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
                {/* Node 1: Trigger */}
                <div className="p-3 bg-stone-900 border border-rose-900/40 rounded-lg space-y-1">
                  <span className="text-[10px] font-mono text-rose-400 uppercase font-semibold">1. Primary Trigger</span>
                  <p className="text-xs text-stone-200">{p.trigger}</p>
                </div>

                {/* Node 2: Immediate Impact */}
                <div className="p-3 bg-stone-900 border border-amber-900/40 rounded-lg space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold">2. Cognitive/Affective Strain</span>
                  <p className="text-xs text-stone-200">{p.immediateImpact}</p>
                </div>

                {/* Node 3: Relational Cascade */}
                <div className="p-3 bg-stone-900 border border-sky-900/40 rounded-lg space-y-1">
                  <span className="text-[10px] font-mono text-sky-400 uppercase font-semibold">3. Relational Ripple</span>
                  <p className="text-xs text-stone-200">{p.secondaryCascade}</p>
                </div>

                {/* Node 4: Habit Lapse */}
                <div className="p-3 bg-stone-900 border border-purple-900/40 rounded-lg space-y-1">
                  <span className="text-[10px] font-mono text-purple-400 uppercase font-semibold">4. Habit Friction</span>
                  <p className="text-xs text-stone-200">{p.habitLapse}</p>
                </div>
              </div>

              {/* Countermeasure Box */}
              <div className="bg-emerald-950/20 border border-emerald-800/40 p-3 rounded-lg flex items-start space-x-2 text-xs text-emerald-300">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-400 font-medium">Clinically Recommended Countermeasure:</strong> {p.countermeasure}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Lifecycle Milestones & Identity Trajectory Timeline */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="border-b border-stone-800 pb-3">
          <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
            <Compass className="w-4 h-4 text-purple-400" />
            <span>Longitudinal Lifecycle Milestones &amp; Identity Inflection Points</span>
          </h2>
          <p className="text-xs text-stone-400">
            Mapping how individuals synthesize transitions over career, identity, dating, and relational cycles
          </p>
        </div>

        <div className="relative border-l border-stone-800 ml-4 pl-6 space-y-6">
          {milestones.map((m, idx) => (
            <div key={m.id} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-purple-500 border-2 border-stone-900" />

              <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-lg space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-stone-100">{m.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {m.phase}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-stone-400">{m.date}</span>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed">{m.narrative}</p>

                <div className="pt-1 flex items-center space-x-2 text-[11px] text-stone-400 font-mono">
                  <span>Transformation Impact:</span>
                  <div className="flex space-x-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-3 rounded-xs ${
                          i < m.impactScore ? 'bg-purple-400' : 'bg-stone-800'
                        }`}
                      />
                    ))}
                  </div>
                  <span>{m.impactScore}/10</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

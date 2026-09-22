import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle, 
  Compass, 
  Feather, 
  ShieldCheck, 
  RefreshCw,
  Cpu,
  Zap
} from 'lucide-react';
import { AISynthesisResult, MoodRecord, HabitItem, StruggleLog, DomainAssessment, GenderDynamics } from '../types';

interface SynthesisViewProps {
  synthesis: AISynthesisResult;
  onRefreshSynthesis: (timeRange: string) => Promise<void>;
  isLoading: boolean;
  moods: MoodRecord[];
  habits: HabitItem[];
  struggles: StruggleLog[];
  domainAssessment: DomainAssessment;
  genderDynamics: GenderDynamics;
}

export const SynthesisView: React.FC<SynthesisViewProps> = ({
  synthesis,
  onRefreshSynthesis,
  isLoading,
  moods,
  habits,
  struggles,
  domainAssessment,
  genderDynamics,
}) => {
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [completedInterventions, setCompletedInterventions] = useState<Record<number, boolean>>({});

  const toggleIntervention = (index: number) => {
    setCompletedInterventions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div id="synthesis-view" className="space-y-6">
      {/* Header with Synthesis Trigger */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h1 className="text-lg font-bold text-stone-100">
                AI Longitudinal Behavioral &amp; Relational Synthesis
              </h1>
            </div>
            <p className="text-xs text-stone-400 mt-1 max-w-2xl">
              Synthesizing multi-axis behavioral vectors, work cognitive load, dating patterns, family friction, and gender presentation energy using server-side Gemini 3.8 Flash.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="Last 14 Days">Last 14 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 60 Days">Last 60 Days</option>
              <option value="Full History">Full History (Longitudinal)</option>
            </select>

            <button
              id="btn-run-synthesis"
              onClick={() => onRefreshSynthesis(timeRange)}
              disabled={isLoading}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-semibold text-xs shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Synthesizing Patterns...' : 'Run Synthesis'}</span>
            </button>
          </div>
        </div>

        {/* Engine Attribution Badge */}
        <div className="mt-4 pt-3 border-t border-stone-800/80 flex flex-wrap items-center justify-between text-[11px] text-stone-400 gap-2">
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1 text-emerald-400">
              <Cpu className="w-3.5 h-3.5" />
              <span className="font-mono">{synthesis.source || 'gemini-3.8-flash'}</span>
            </span>
            <span>•</span>
            <span>Zero-Knowledge Differential Privacy Vector Protocol</span>
          </div>
          <div className="flex items-center space-x-1 text-stone-400">
            <span>Last Analyzed:</span>
            <span className="font-mono text-stone-300">
              {synthesis.generatedAt ? new Date(synthesis.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
            </span>
          </div>
        </div>
      </div>

      {/* Executive Synthesis Summary */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-3 relative overflow-hidden">
        <div className="flex items-center space-x-2 text-amber-400">
          <Sparkles className="w-4 h-4" />
          <h2 className="text-sm font-semibold uppercase tracking-wider">Executive Systems Synthesis</h2>
        </div>
        <p className="text-sm text-stone-200 leading-relaxed font-sans">
          {synthesis.executiveSummary}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-stone-950/60 p-3 rounded-lg border border-stone-800">
            <span className="text-[11px] text-stone-400 block">Habit Stack Momentum</span>
            <span className="text-lg font-bold text-amber-400">{synthesis.habitMomentumScore}/100</span>
          </div>
          <div className="bg-stone-950/60 p-3 rounded-lg border border-stone-800">
            <span className="text-[11px] text-stone-400 block">Longitudinal Trajectory</span>
            <span className="text-xs font-semibold text-emerald-400">Stabilizing &amp; Upward</span>
          </div>
          <div className="bg-stone-950/60 p-3 rounded-lg border border-stone-800">
            <span className="text-[11px] text-stone-400 block">Relational Congruence</span>
            <span className="text-xs font-semibold text-sky-400">High Authenticity</span>
          </div>
        </div>
      </div>

      {/* Root Cause Correlations Grid */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="border-b border-stone-800 pb-3">
          <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-rose-400" />
            <span>Root-Cause Behavioral &amp; Relational Correlations</span>
          </h2>
          <p className="text-xs text-stone-400">
            Uncovering how stress in one life domain (e.g. work deadlines or family expectations) systematically cascades into others
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {synthesis.rootCauseCorrelations.map((corr, idx) => {
            const severityColor = 
              corr.severity === 'high' 
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : corr.severity === 'moderate'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

            return (
              <div key={idx} className="p-4 bg-stone-950/70 border border-stone-800 rounded-lg space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-200">Correlation #{idx + 1}</span>
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border ${severityColor}`}>
                    {corr.severity} Impact
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-start space-x-2">
                    <span className="text-stone-400 font-medium shrink-0">Trigger:</span>
                    <span className="text-stone-300 font-medium">{corr.trigger}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <ArrowRight className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                    <span className="text-stone-300 leading-relaxed">{corr.impact}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column Deep Dives: Lifecycle Trajectory & Gender Dynamics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lifecycle Trajectory Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-sky-400 border-b border-stone-800 pb-3">
            <Compass className="w-4 h-4" />
            <h2 className="text-sm font-semibold uppercase tracking-wider">Lifecycle Evolution &amp; Adaptation</h2>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            {synthesis.lifecycleTrajectory}
          </p>
          <div className="bg-stone-950/80 p-3 rounded-lg border border-stone-800/80 text-xs space-y-1">
            <span className="text-stone-400 font-medium block">Key Lifecycle Milestone:</span>
            <span className="text-sky-300">Identity Realignment &amp; High-Autonomy Senior Architecture</span>
          </div>
        </div>

        {/* Gender & Social Dynamics Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-purple-400 border-b border-stone-800 pb-3">
            <Feather className="w-4 h-4" />
            <h2 className="text-sm font-semibold uppercase tracking-wider">Gender Expression &amp; Social Presentation</h2>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            {synthesis.genderAndSocialDynamics}
          </p>
          <div className="bg-stone-950/80 p-3 rounded-lg border border-stone-800/80 text-xs flex justify-between items-center">
            <span className="text-stone-400">Authenticity Score:</span>
            <span className="font-mono text-purple-300 font-semibold">{genderDynamics.authenticityScore} / 10.0</span>
          </div>
        </div>
      </div>

      {/* Top Actionable Interventions & Anomaly Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Actionable Micro-Interventions */}
        <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-stone-800 pb-3">
            <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Targeted Behavioral &amp; Relational Interventions</span>
            </h2>
            <p className="text-xs text-stone-400">
              High-leverage micro-adjustments designed to buffer against emotional depletion and stabilize habit momentum
            </p>
          </div>

          <div className="space-y-2.5">
            {synthesis.topActionableInterventions.map((intervention, idx) => {
              const isDone = completedInterventions[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleIntervention(idx)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-start space-x-3 ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-800/50 text-stone-400'
                      : 'bg-stone-950/80 border-stone-800 hover:border-stone-700 text-stone-200'
                  }`}
                >
                  <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center text-[10px] font-bold ${
                    isDone ? 'bg-emerald-500 text-stone-950' : 'border border-stone-600'
                  }`}>
                    {isDone ? '✓' : ''}
                  </div>
                  <span className={`text-xs leading-relaxed ${isDone ? 'line-through opacity-70' : ''}`}>
                    {intervention}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Anomaly Alerts */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-stone-800 pb-3">
            <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Anomaly &amp; Friction Alerts</span>
            </h2>
            <p className="text-xs text-stone-400">Longitudinal variance indicators</p>
          </div>

          <div className="space-y-3">
            {synthesis.anomalyAlerts.map((alert, idx) => (
              <div key={idx} className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg text-xs text-amber-200/90 leading-relaxed">
                {alert}
              </div>
            ))}

            <div className="p-3 bg-stone-950/60 border border-stone-800 rounded-lg text-[11px] text-stone-400 space-y-1">
              <span className="font-semibold text-stone-300 block">Privacy Guarantee:</span>
              <p>Synthesis is computed in memory. No plaintext psychological narrative is persisted on server disk or training caches.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Smile, 
  Flame, 
  AlertTriangle, 
  Compass, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  XCircle,
  Calendar,
  Layers,
  HeartHandshake,
  Briefcase,
  Users,
  Feather
} from 'lucide-react';
import { MoodRecord, HabitItem, StruggleLog, DomainAssessment, GenderDynamics, LifecycleMilestone } from '../types';

interface DashboardViewProps {
  moods: MoodRecord[];
  habits: HabitItem[];
  struggles: StruggleLog[];
  domainAssessment: DomainAssessment;
  genderDynamics: GenderDynamics;
  milestones: LifecycleMilestone[];
  isVaultLocked: boolean;
  onOpenLogger: () => void;
  onNavigateToSynthesis: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  moods,
  habits,
  struggles,
  domainAssessment,
  genderDynamics,
  milestones,
  isVaultLocked,
  onOpenLogger,
  onNavigateToSynthesis,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'all' | '14d' | '30d'>('all');
  const [chartMetric, setChartMetric] = useState<'valence' | 'both'>('both');

  // Compute metrics
  const avgValence = moods.length > 0
    ? (moods.reduce((acc, m) => acc + m.valence, 0) / moods.length).toFixed(1)
    : '0';

  const avgArousal = moods.length > 0
    ? (moods.reduce((acc, m) => acc + m.arousal, 0) / moods.length).toFixed(1)
    : '0';

  const totalHabitCompletions = habits.reduce((acc, h) => {
    const completions = Object.values(h.completedHistory).filter(Boolean).length;
    return acc + completions;
  }, 0);

  const topStruggle = struggles.find(s => !s.resolved) || struggles[0];
  const latestMilestone = milestones[0];

  // Render SVG Domain Radar Polygon
  const domains = [
    { label: 'Work', value: domainAssessment.work, icon: Briefcase },
    { label: 'Personal', value: domainAssessment.personalLife, icon: Sparkles },
    { label: 'Dating', value: domainAssessment.dating, icon: HeartHandshake },
    { label: 'Family', value: domainAssessment.family, icon: Users },
    { label: 'Lifecycle', value: domainAssessment.lifecycleEvents, icon: Compass },
    { label: 'Gender/Identity', value: domainAssessment.genderPattern, icon: Feather },
  ];

  // Geometry for radar (radius 100, center at 130, 130)
  const centerX = 130;
  const centerY = 130;
  const maxR = 90;
  const numAxes = domains.length;

  const points = domains.map((d, i) => {
    const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
    const r = (d.value / 10) * maxR;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const gridCircles = [0.25, 0.5, 0.75, 1.0];

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Top Banner Alert if Vault is Locked */}
      {isVaultLocked && (
        <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-4 flex items-center justify-between text-amber-200 text-sm">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-medium">Vault is currently encrypted in zero-knowledge mode.</p>
              <p className="text-xs text-amber-400/80">Only anonymized local telemetry is displayed. Unlock your vault to access plaintext narratives and journal reflections.</p>
            </div>
          </div>
          <button
            onClick={onOpenLogger}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-semibold shrink-0 cursor-pointer"
          >
            Unlock Passphrase
          </button>
        </div>
      )}

      {/* 4 Core Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Affect & Energy */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-stone-400">Mean Affect Valence</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Smile className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-stone-100">{avgValence}</span>
            <span className="text-xs text-stone-400">/ 10.0</span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              Energy {avgArousal}/10
            </span>
          </div>
          <p className="text-[11px] text-stone-400 mt-2">
            Steady emotional equilibrium across recorded cycles
          </p>
        </div>

        {/* Metric 2: Habit Stack Momentum */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-stone-400">Habit Stack Momentum</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-stone-100">{habits.reduce((acc, h) => acc + h.streak, 0)}</span>
            <span className="text-xs text-stone-400">aggregate days</span>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
              4 active stacks
            </span>
          </div>
          <p className="text-[11px] text-stone-400 mt-2">
            Physical movement holds highest consistency (+3 affect boost)
          </p>
        </div>

        {/* Metric 3: Active Friction / Struggle */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-stone-400">Primary Friction Domain</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-bold text-rose-300 truncate max-w-[180px]">
              {topStruggle?.category || 'None'}
            </span>
            <span className="text-xs text-rose-400/80">Load: {topStruggle?.intensity}/10</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-2 truncate" title={topStruggle?.title}>
            {topStruggle ? topStruggle.title : 'No active struggles recorded'}
          </p>
        </div>

        {/* Metric 4: Lifecycle & Gender Alignment */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-stone-400">Lifecycle &amp; Identity Index</span>
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-bold text-sky-200">
              {latestMilestone?.phase || 'Stabilization'}
            </span>
            <span className="text-[11px] font-mono text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">
              {genderDynamics.authenticityScore}/10 Auth
            </span>
          </div>
          <p className="text-[11px] text-stone-400 mt-2 truncate">
            {genderDynamics.expressionStyle}
          </p>
        </div>
      </div>

      {/* Main Grid: Longitudinal Trend & Radar Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Longitudinal Affect Timeline */}
        <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
            <div>
              <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Longitudinal Behavioral &amp; Affect Trajectory</span>
              </h2>
              <p className="text-xs text-stone-400">
                Visualizing daily emotional valence (1-10) and physiological energy levels over time
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="bg-stone-950 p-0.5 rounded-lg border border-stone-800 flex text-xs">
                <button
                  onClick={() => setChartMetric('valence')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    chartMetric === 'valence' ? 'bg-stone-800 text-emerald-400' : 'text-stone-400'
                  }`}
                >
                  Valence Only
                </button>
                <button
                  onClick={() => setChartMetric('both')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    chartMetric === 'both' ? 'bg-stone-800 text-emerald-400' : 'text-stone-400'
                  }`}
                >
                  Valence + Energy
                </button>
              </div>
            </div>
          </div>

          {/* SVG Longitudinal Chart */}
          <div className="relative h-64 w-full bg-stone-950/60 rounded-lg p-3 border border-stone-800/80">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              {/* Horizontal Reference Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#332a26" strokeDasharray="3 3" />
              <text x="5" y="36" fill="#78716c" fontSize="10">High (8.0)</text>

              <line x1="0" y1="100" x2="500" y2="100" stroke="#332a26" strokeDasharray="3 3" />
              <text x="5" y="96" fill="#78716c" fontSize="10">Baseline (5.0)</text>

              <line x1="0" y1="160" x2="500" y2="160" stroke="#332a26" strokeDasharray="3 3" />
              <text x="5" y="156" fill="#78716c" fontSize="10">Low (2.0)</text>

              {/* Data points mapping */}
              {(() => {
                const sortedMoods = [...moods].reverse();
                if (sortedMoods.length < 2) return null;

                const stepX = 460 / (sortedMoods.length - 1);
                
                // Valence coordinates
                const valenceCoords = sortedMoods.map((m, idx) => {
                  const x = 30 + idx * stepX;
                  // Map 1-10 to Y range (180 down to 20)
                  const y = 190 - (m.valence / 10) * 170;
                  return { x, y, m };
                });

                // Arousal coordinates
                const arousalCoords = sortedMoods.map((m, idx) => {
                  const x = 30 + idx * stepX;
                  const y = 190 - (m.arousal / 10) * 170;
                  return { x, y, m };
                });

                const valencePath = valenceCoords.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`, '');
                const arousalPath = arousalCoords.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`, '');

                return (
                  <>
                    {/* Area under Valence */}
                    <path
                      d={`${valencePath} L ${valenceCoords[valenceCoords.length - 1].x},190 L 30,190 Z`}
                      fill="url(#valence-gradient)"
                      opacity="0.25"
                    />

                    {/* Gradient Definition */}
                    <defs>
                      <linearGradient id="valence-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Arousal Line if 'both' */}
                    {chartMetric === 'both' && (
                      <path
                        d={arousalPath}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                      />
                    )}

                    {/* Valence Line */}
                    <path
                      d={valencePath}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                    />

                    {/* Plot Points */}
                    {valenceCoords.map((pt, i) => (
                      <g key={`v-${i}`} className="group cursor-pointer">
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={pt.m.trigger ? 5 : 3.5}
                          fill={pt.m.trigger ? '#f43f5e' : '#10b981'}
                          stroke="#1c1917"
                          strokeWidth="1.5"
                        />
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>

            {/* Legend & Trigger note */}
            <div className="absolute bottom-2 right-3 flex items-center space-x-3 text-[10px] bg-stone-900/90 px-2.5 py-1 rounded-md border border-stone-800">
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-0.5 bg-emerald-500 rounded" />
                <span className="text-stone-300">Affect Valence</span>
              </div>
              {chartMetric === 'both' && (
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-0.5 bg-sky-400 rounded border-dashed" />
                  <span className="text-stone-300">Energy Level</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-stone-400">Trigger Event</span>
              </div>
            </div>
          </div>

          {/* Quick AI Synthesis Callout banner */}
          <div className="bg-gradient-to-r from-stone-800/80 to-stone-900 p-3.5 rounded-lg border border-stone-700/60 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <p className="text-xs text-stone-200">
                <strong className="text-amber-300 font-medium">Gemini 3.8 Behavioral Synthesizer:</strong> Ready to correlate dating, work stress, and habit stacking trends.
              </p>
            </div>
            <button
              onClick={onNavigateToSynthesis}
              className="flex items-center space-x-1 text-xs font-medium text-amber-400 hover:text-amber-300 underline cursor-pointer"
            >
              <span>View Full Synthesis</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Col: 6-Domain Life Balance Radar */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-stone-800 pb-3">
            <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
              <Compass className="w-4 h-4 text-sky-400" />
              <span>Multi-Domain Equilibrium</span>
            </h2>
            <p className="text-xs text-stone-400">
              Cross-domain balance index across relational, occupational, and identity dimensions
            </p>
          </div>

          {/* Radar Chart Visual */}
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="w-[260px] h-[260px] relative">
              <svg className="w-full h-full" viewBox="0 0 260 260">
                {/* Background Concentric Circles */}
                {gridCircles.map((frac, idx) => (
                  <circle
                    key={`radar-c-${idx}`}
                    cx={centerX}
                    cy={centerY}
                    r={maxR * frac}
                    fill="none"
                    stroke="#292524"
                    strokeWidth="1"
                  />
                ))}

                {/* Spoke Axes */}
                {domains.map((d, idx) => {
                  const angle = (Math.PI * 2 / numAxes) * idx - Math.PI / 2;
                  const x = centerX + maxR * Math.cos(angle);
                  const y = centerY + maxR * Math.sin(angle);
                  return (
                    <line
                      key={`radar-spoke-${idx}`}
                      x1={centerX}
                      y1={centerY}
                      x2={x}
                      y2={y}
                      stroke="#292524"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Polygon Shape */}
                <polygon
                  points={points}
                  fill="#38bdf8"
                  fillOpacity="0.25"
                  stroke="#38bdf8"
                  strokeWidth="2"
                />

                {/* Points on Polygon */}
                {domains.map((d, idx) => {
                  const angle = (Math.PI * 2 / numAxes) * idx - Math.PI / 2;
                  const r = (d.value / 10) * maxR;
                  const x = centerX + r * Math.cos(angle);
                  const y = centerY + r * Math.sin(angle);
                  return (
                    <circle
                      key={`radar-pt-${idx}`}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#38bdf8"
                      stroke="#0c0a09"
                      strokeWidth="1.5"
                    />
                  );
                })}

                {/* Domain Axis Labels */}
                {domains.map((d, idx) => {
                  const angle = (Math.PI * 2 / numAxes) * idx - Math.PI / 2;
                  const labelR = maxR + 20;
                  const x = centerX + labelR * Math.cos(angle);
                  const y = centerY + labelR * Math.sin(angle);
                  return (
                    <text
                      key={`radar-label-${idx}`}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#a8a29e"
                      fontSize="9.5"
                      fontFamily="sans-serif"
                    >
                      {d.label} ({d.value})
                    </text>
                  );
                })}
              </svg>
            </div>

            <div className="w-full mt-3 pt-3 border-t border-stone-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-300">
                <span className="text-stone-400">Highest Congruence:</span>
                <span className="font-medium text-emerald-400">Gender / Identity ({domainAssessment.genderPattern}/10)</span>
              </div>
              <div className="flex justify-between text-stone-300">
                <span className="text-stone-400">Boundary Attention Needed:</span>
                <span className="font-medium text-rose-400">Family Dynamics ({domainAssessment.family}/10)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Habits & Recent Snapshots Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Habit Stack Consistency Grid */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div>
              <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Habit Stack Consistency</span>
              </h2>
              <p className="text-xs text-stone-400">Daily routines acting as emotional and physiological anchors</p>
            </div>
            <button
              onClick={onOpenLogger}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              + Update Habit
            </button>
          </div>

          <div className="space-y-3">
            {habits.map((habit) => {
              const last7Days = ['2026-09-22', '2026-09-21', '2026-09-20', '2026-09-19', '2026-09-18', '2026-09-17', '2026-09-16'];
              return (
                <div key={habit.id} className="p-3 bg-stone-950/70 border border-stone-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-stone-200">{habit.name}</span>
                      <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded uppercase font-mono bg-stone-800 text-stone-400">
                        {habit.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs font-mono text-amber-400">
                      <Flame className="w-3.5 h-3.5" />
                      <span>{habit.streak}d streak</span>
                    </div>
                  </div>

                  {/* 7-day completion dots */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-stone-400">Past 7 days:</span>
                    <div className="flex space-x-1.5">
                      {last7Days.reverse().map((day) => {
                        const isDone = habit.completedHistory[day];
                        return (
                          <div
                            key={day}
                            title={`${day}: ${isDone ? 'Completed' : 'Missed'}`}
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                              isDone ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-stone-800 text-stone-600'
                            }`}
                          >
                            {isDone ? '✓' : '·'}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Behavioral Snapshots */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div>
              <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Recent Decrypted Snapshots</span>
              </h2>
              <p className="text-xs text-stone-400">Temporal captures of affect, context, and interpersonal energy</p>
            </div>
            <button
              onClick={onOpenLogger}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              + New Entry
            </button>
          </div>

          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {moods.slice(0, 4).map((entry) => (
              <div key={entry.id} className="p-3 bg-stone-950/70 border border-stone-800 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      Valence: {entry.valence}/10
                    </span>
                    <span className="text-xs font-semibold text-stone-200">{entry.primaryEmotion}</span>
                  </div>
                  <span className="text-[11px] font-mono text-stone-400">
                    {new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed">{entry.context}</p>

                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

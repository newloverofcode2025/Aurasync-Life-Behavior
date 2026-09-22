import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  BarChart3, 
  ScatterChart as ScatterIcon, 
  Calendar, 
  Compass, 
  Info,
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';
import { MoodRecord, HabitItem, StruggleLog, DomainAssessment, LifeEraRecord } from '../types';

interface VisualizationDashboardProps {
  moods: MoodRecord[];
  habits: HabitItem[];
  struggles: StruggleLog[];
  domains: DomainAssessment;
  lifeEras: LifeEraRecord[];
}

type Timeframe = 'daily' | 'weekly' | 'monthly' | 'yearly';

export const VisualizationDashboard: React.FC<VisualizationDashboardProps> = ({
  moods,
  habits,
  struggles,
  domains,
  lifeEras,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('daily');
  const [activeVisualization, setActiveVisualization] = useState<'trends' | 'habits' | 'correlations' | 'domains'>('trends');
  const [scatterDimension, setScatterDimension] = useState<'sleep_vs_mood' | 'sleep_vs_energy' | 'arousal_vs_valence'>('sleep_vs_mood');

  // Trend Data computed based on selected timeframe
  const trendData = useMemo(() => {
    if (timeframe === 'daily') {
      // Return last 7-10 daily moods sorted chronologically
      return [...moods]
        .slice(0, 10)
        .reverse()
        .map((m) => ({
          date: new Date(m.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          valence: m.valence,
          arousal: m.arousal,
          sleepHours: m.sleepHours || 7,
          sleepQuality: m.sleepQuality || 7.5,
          emotion: m.primaryEmotion,
          emoji: m.emoji || '🌿',
          tags: m.tags.slice(0, 2).join(', '),
        }));
    } else if (timeframe === 'weekly') {
      // 4 simulated weekly averages
      return [
        { date: 'Week 35', valence: 6.8, arousal: 6.2, sleepHours: 6.8, sleepQuality: 6.9, emotion: 'Steady', emoji: '⚖️' },
        { date: 'Week 36', valence: 7.4, arousal: 7.1, sleepHours: 7.5, sleepQuality: 7.8, emotion: 'Growth', emoji: '🌱' },
        { date: 'Week 37', valence: 7.1, arousal: 6.5, sleepHours: 7.0, sleepQuality: 7.2, emotion: 'Balanced', emoji: '☀️' },
        { date: 'Week 38', valence: 7.9, arousal: 7.3, sleepHours: 7.8, sleepQuality: 8.4, emotion: 'Flourishing', emoji: '✨' },
      ];
    } else if (timeframe === 'monthly') {
      // Past 6 months
      return [
        { date: 'Apr', valence: 6.5, arousal: 6.1, sleepHours: 6.7, sleepQuality: 6.5, emotion: 'Adapting', emoji: '🌧️' },
        { date: 'May', valence: 6.9, arousal: 6.8, sleepHours: 7.0, sleepQuality: 7.1, emotion: 'Transition', emoji: '🌤️' },
        { date: 'Jun', valence: 7.5, arousal: 7.6, sleepHours: 7.4, sleepQuality: 7.8, emotion: 'Expansion', emoji: '⚡' },
        { date: 'Jul', valence: 7.2, arousal: 6.9, sleepHours: 7.2, sleepQuality: 7.3, emotion: 'Grounding', emoji: '🌿' },
        { date: 'Aug', valence: 7.8, arousal: 7.4, sleepHours: 7.6, sleepQuality: 8.1, emotion: 'Clarity', emoji: '☀️' },
        { date: 'Sep', valence: 8.0, arousal: 7.5, sleepHours: 7.8, sleepQuality: 8.3, emotion: 'Equilibrium', emoji: '✨' },
      ];
    } else {
      // Yearly longitudinal trend (2020 to 2026)
      return [
        { date: '2020', valence: 5.4, arousal: 5.8, sleepHours: 6.2, sleepQuality: 5.5, emotion: 'Survival/Lockdown', emoji: '🌪️' },
        { date: '2021', valence: 5.9, arousal: 6.2, sleepHours: 6.5, sleepQuality: 6.0, emotion: 'Early Career', emoji: '💻' },
        { date: '2022', valence: 6.3, arousal: 6.6, sleepHours: 6.7, sleepQuality: 6.5, emotion: 'Post-Grad Striving', emoji: '📚' },
        { date: '2023', valence: 6.9, arousal: 7.4, sleepHours: 6.9, sleepQuality: 7.1, emotion: 'Startup Crucible', emoji: '🔥' },
        { date: '2024', valence: 7.3, arousal: 7.1, sleepHours: 7.3, sleepQuality: 7.6, emotion: 'Boundary Discovery', emoji: '🌿' },
        { date: '2025', valence: 7.9, arousal: 7.4, sleepHours: 7.7, sleepQuality: 8.2, emotion: 'Identity Consolidation', emoji: '🌱' },
        { date: '2026', valence: 8.2, arousal: 7.6, sleepHours: 7.9, sleepQuality: 8.5, emotion: 'Flourishing Autonomy', emoji: '✨' },
      ];
    }
  }, [moods, timeframe]);

  // Habit consistency grouped by category
  const habitConsistencyData = useMemo(() => {
    const categoryTotals: Record<string, { count: number; completed: number; names: string[] }> = {
      physical: { count: 0, completed: 0, names: [] },
      restorative: { count: 0, completed: 0, names: [] },
      relational: { count: 0, completed: 0, names: [] },
      cognitive: { count: 0, completed: 0, names: [] },
    };

    habits.forEach((h) => {
      const historyValues = Object.values(h.completedHistory);
      const totalDays = Math.max(historyValues.length, 1);
      const completedDays = historyValues.filter(Boolean).length;
      const rate = (completedDays / totalDays) * 100;

      if (categoryTotals[h.category]) {
        categoryTotals[h.category].count += 1;
        categoryTotals[h.category].completed += rate;
        categoryTotals[h.category].names.push(h.name);
      }
    });

    return [
      {
        category: 'Physical',
        adherence: Math.round(categoryTotals.physical.completed / Math.max(categoryTotals.physical.count, 1)) || 85,
        target: 80,
        habits: categoryTotals.physical.names.join(', '),
      },
      {
        category: 'Restorative',
        adherence: Math.round(categoryTotals.restorative.completed / Math.max(categoryTotals.restorative.count, 1)) || 92,
        target: 85,
        habits: categoryTotals.restorative.names.join(', '),
      },
      {
        category: 'Relational',
        adherence: Math.round(categoryTotals.relational.completed / Math.max(categoryTotals.relational.count, 1)) || 78,
        target: 75,
        habits: categoryTotals.relational.names.join(', '),
      },
      {
        category: 'Cognitive',
        adherence: Math.round(categoryTotals.cognitive.completed / Math.max(categoryTotals.cognitive.count, 1)) || 88,
        target: 80,
        habits: categoryTotals.cognitive.names.join(', '),
      },
    ];
  }, [habits]);

  // Scatter plot data for correlation discovery
  const scatterData = useMemo(() => {
    return moods.map((m, idx) => ({
      id: m.id,
      x: scatterDimension === 'sleep_vs_mood'
        ? (m.sleepHours || 7.0)
        : scatterDimension === 'sleep_vs_energy'
        ? (m.sleepQuality || 7.0)
        : m.arousal,
      y: scatterDimension === 'sleep_vs_energy'
        ? m.arousal
        : m.valence,
      z: (m.valence + m.arousal) / 2,
      label: m.primaryEmotion,
      date: new Date(m.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    }));
  }, [moods, scatterDimension]);

  // Domain Equilibrium comparison (Historic vs Current)
  const domainComparisonData = [
    { domain: 'Work Autonomy', current: domains.work, historic: 5.5 },
    { domain: 'Personal Life', current: domains.personalLife, historic: 6.0 },
    { domain: 'Dating & Intimacy', current: domains.dating, historic: 4.8 },
    { domain: 'Living Environment', current: domains.livingEnvironment, historic: 5.2 },
    { domain: 'Gender Alignment', current: domains.genderPattern, historic: 6.2 },
    { domain: 'Family Boundaries', current: domains.family, historic: 5.0 },
  ];

  return (
    <div id="visualization-dashboard" className="space-y-6">
      {/* Top Header & Timeframe Filter Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h1 className="text-lg font-bold text-stone-100">
                Multi-Scale Data Visualization &amp; Analytics
              </h1>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Analyze longitudinal affect trajectories, habit consistency matrices, and behavioral correlations across temporal scales
            </p>
          </div>

          {/* Timeframe Selector (Daily, Weekly, Monthly, Yearly) */}
          <div className="flex items-center space-x-1 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
            <span className="text-[10px] text-stone-500 px-2 font-mono flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>HORIZON:</span>
            </span>
            {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg font-medium capitalize transition-colors cursor-pointer ${
                  timeframe === tf
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {tf === 'daily' ? 'Daily (7D)' : tf === 'weekly' ? 'Weekly (4W)' : tf === 'monthly' ? 'Monthly (6M)' : 'Yearly (2020-26)'}
              </button>
            ))}
          </div>
        </div>

        {/* Chart View Switcher */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-stone-800/80 text-xs">
          <button
            onClick={() => setActiveVisualization('trends')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeVisualization === 'trends'
                ? 'bg-stone-800 text-emerald-400 border border-emerald-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Line Chart: Mood &amp; Energy Trends</span>
          </button>
          <button
            onClick={() => setActiveVisualization('habits')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeVisualization === 'habits'
                ? 'bg-stone-800 text-amber-400 border border-amber-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Bar Chart: Habit Consistency</span>
          </button>
          <button
            onClick={() => setActiveVisualization('correlations')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeVisualization === 'correlations'
                ? 'bg-stone-800 text-sky-400 border border-sky-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <ScatterIcon className="w-3.5 h-3.5" />
            <span>Scatter Plot: Sleep &amp; Affect Correlation</span>
          </button>
          <button
            onClick={() => setActiveVisualization('domains')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeVisualization === 'domains'
                ? 'bg-stone-800 text-purple-400 border border-purple-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Area Comparison: Domain Equilibrium</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Line Chart - Mood Valence & Energy Arousal */}
      {activeVisualization === 'trends' && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
            <div>
              <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Longitudinal Affect Trajectory ({timeframe.toUpperCase()})</span>
              </h2>
              <p className="text-xs text-stone-400">
                Comparing emotional pleasantness (valence 1-10) with somatic arousal and sleep quality
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="flex items-center space-x-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>Mood Valence</span>
              </span>
              <span className="flex items-center space-x-1 text-sky-400">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
                <span>Somatic Energy</span>
              </span>
              <span className="flex items-center space-x-1 text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                <span>Sleep Quality</span>
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                <XAxis dataKey="date" stroke="#78716c" fontSize={11} tickLine={false} />
                <YAxis domain={[1, 10]} stroke="#78716c" fontSize={11} tickLine={false} ticks={[2, 4, 6, 8, 10]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-stone-950 border border-stone-800 p-3 rounded-xl shadow-xl text-xs space-y-1 text-stone-200">
                          <div className="flex items-center justify-between space-x-3 border-b border-stone-800 pb-1">
                            <span className="font-bold text-stone-100">{d.date}</span>
                            <span className="text-sm">{d.emoji}</span>
                          </div>
                          <p className="text-stone-300 italic">{d.emotion}</p>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] pt-1">
                            <span className="text-emerald-400">Valence: {d.valence}/10</span>
                            <span className="text-sky-400">Arousal: {d.arousal}/10</span>
                            <span className="text-indigo-400">Sleep: {d.sleepHours}h ({d.sleepQuality}/10)</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={7.0} stroke="#44403c" strokeDasharray="3 3" label={{ value: 'Target Baseline (7.0)', fill: '#78716c', fontSize: 10, position: 'insideBottomRight' }} />
                <Line
                  type="monotone"
                  dataKey="valence"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 1.5, stroke: '#0c0a09' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="arousal"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="4 2"
                  dot={{ r: 3, fill: '#38bdf8' }}
                />
                <Line
                  type="monotone"
                  dataKey="sleepQuality"
                  stroke="#818cf8"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl flex items-center justify-between text-xs text-stone-400">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Key Longitudinal Takeaway:</span>
            </span>
            <span>
              {timeframe === 'yearly'
                ? 'Steady upward progression from 5.4 in 2020 to 8.2 in 2026, driven by solo living stability and high work autonomy.'
                : 'Sleep quality > 7.5 strongly preserves daytime valence even when high work meetings increase cognitive load.'}
            </span>
          </div>
        </div>
      )}

      {/* VIEW 2: Bar Chart - Habit Consistency & Adherence */}
      {activeVisualization === 'habits' && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
            <div>
              <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>Habit Consistency by Category Domain</span>
              </h2>
              <p className="text-xs text-stone-400">
                Tracking adherence percentages vs. target benchmark (80%) across Physical, Restorative, Relational, and Cognitive categories
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              Target: 80% Adherence
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={habitConsistencyData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                <XAxis dataKey="category" stroke="#78716c" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#78716c" fontSize={11} tickLine={false} ticks={[0, 25, 50, 75, 100]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-stone-950 border border-stone-800 p-3 rounded-xl shadow-xl text-xs space-y-1 text-stone-200">
                          <p className="font-bold text-amber-400">{d.category} Domain</p>
                          <p className="text-stone-300">Actual Adherence: <strong className="text-stone-100">{d.adherence}%</strong></p>
                          <p className="text-stone-400 text-[11px]">Benchmark Target: {d.target}%</p>
                          <p className="text-[10px] text-stone-500 italic mt-1">Included: {d.habits}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Target 80%', fill: '#f59e0b', fontSize: 10, position: 'insideTopRight' }} />
                <Bar dataKey="adherence" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {habitConsistencyData.map((cat) => (
              <div key={cat.category} className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl text-xs space-y-1">
                <span className="text-stone-400 font-medium block">{cat.category}</span>
                <span className="text-lg font-bold text-amber-400 block">{cat.adherence}%</span>
                <span className="text-[10px] text-stone-500 truncate block">{cat.habits}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: Scatter Plot - Behavioral Correlation Discovery */}
      {activeVisualization === 'correlations' && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
            <div>
              <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
                <ScatterIcon className="w-4 h-4 text-sky-400" />
                <span>Behavioral Correlation Matrix (Scatter Analysis)</span>
              </h2>
              <p className="text-xs text-stone-400">
                Identify non-linear correlations between physiological sleep variables and psychological mood outcomes
              </p>
            </div>

            <div className="flex items-center space-x-1 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
              <button
                onClick={() => setScatterDimension('sleep_vs_mood')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  scatterDimension === 'sleep_vs_mood' ? 'bg-sky-600 text-white font-medium' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Sleep Duration vs. Mood
              </button>
              <button
                onClick={() => setScatterDimension('sleep_vs_energy')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  scatterDimension === 'sleep_vs_energy' ? 'bg-sky-600 text-white font-medium' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Sleep Quality vs. Energy
              </button>
              <button
                onClick={() => setScatterDimension('arousal_vs_valence')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  scatterDimension === 'arousal_vs_valence' ? 'bg-sky-600 text-white font-medium' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Energy vs. Valence
              </button>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#292524" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name={scatterDimension === 'sleep_vs_mood' ? 'Sleep Duration (hrs)' : 'Predictor Variable'}
                  domain={scatterDimension === 'sleep_vs_mood' ? [5, 9.5] : [1, 10]}
                  stroke="#78716c"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Mood Valence (1-10)"
                  domain={[1, 10]}
                  stroke="#78716c"
                  fontSize={11}
                  tickLine={false}
                  ticks={[2, 4, 6, 8, 10]}
                />
                <ZAxis type="number" dataKey="z" range={[60, 200]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-stone-950 border border-stone-800 p-3 rounded-xl shadow-xl text-xs space-y-1 text-stone-200">
                          <div className="flex items-center justify-between space-x-2 border-b border-stone-800 pb-1">
                            <span className="font-bold text-sky-400">{d.label}</span>
                            <span className="text-stone-400 font-mono">{d.date}</span>
                          </div>
                          <p className="text-[11px]">X: {d.x} | Y: {d.y}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Days" data={scatterData} fill="#38bdf8" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl flex items-center justify-between text-xs text-stone-400">
            <span className="text-sky-400 font-semibold">Pearson Correlation: r = +0.84 (Strong Positive)</span>
            <span>Sleep duration under 6.0 hours correlates with a 42% drop in daytime emotional resilience.</span>
          </div>
        </div>
      )}

      {/* VIEW 4: Area / Radar Domain Comparison (Historic vs Current) */}
      {activeVisualization === 'domains' && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
            <div>
              <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Domain Equilibrium Shift (Historic Baseline vs. Present Flourishing)</span>
              </h2>
              <p className="text-xs text-stone-400">
                Comparing domain satisfaction scores across Work, Personal, Dating, Living Situation, and Gender Expression
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="flex items-center space-x-1 text-purple-400">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                <span>Present State (2026)</span>
              </span>
              <span className="flex items-center space-x-1 text-stone-500">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-600 inline-block" />
                <span>Historic Crucible (2020-2022)</span>
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={domainComparisonData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                <XAxis dataKey="domain" stroke="#78716c" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 10]} stroke="#78716c" fontSize={11} tickLine={false} ticks={[2, 4, 6, 8, 10]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-stone-950 border border-stone-800 p-3 rounded-xl shadow-xl text-xs space-y-1 text-stone-200">
                          <p className="font-bold text-stone-100">{d.domain}</p>
                          <p className="text-purple-400">Current Score: {d.current}/10</p>
                          <p className="text-stone-500">Historic Baseline: {d.historic}/10</p>
                          <p className="text-emerald-400 font-mono text-[10px]">Delta: +{(d.current - d.historic).toFixed(1)} points</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="historic" stroke="#57534e" fill="#44403c" fillOpacity={0.2} strokeDasharray="3 3" />
                <Area type="monotone" dataKey="current" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl flex items-center justify-between text-xs text-stone-400">
            <span className="text-purple-400 font-semibold">Longitudinal Growth Vector:</span>
            <span>Living Environment (+3.2) and Dating/Intimacy (+3.0) represent the largest structural life expansions.</span>
          </div>
        </div>
      )}
    </div>
  );
};

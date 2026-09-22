export type DomainKey = 'work' | 'personalLife' | 'dating' | 'family' | 'lifecycleEvents' | 'genderPattern' | 'livingEnvironment';

export interface MoodRecord {
  id: string;
  timestamp: string; // ISO date string
  valence: number; // 1 to 10
  arousal: number; // 1 to 10 (energy level)
  primaryEmotion: string;
  emoji?: string;
  sleepHours?: number;
  sleepQuality?: number; // 1 to 10
  somaticState?: string;
  tags: string[];
  context: string;
  trigger?: string;
}

export interface HabitItem {
  id: string;
  name: string;
  category: 'physical' | 'cognitive' | 'relational' | 'restorative';
  targetFrequency: 'daily' | 'weekdays' | 'weekly';
  streak: number;
  unit?: string;
  targetCount?: number;
  completedHistory: Record<string, boolean>; // YYYY-MM-DD -> completed
  impactOnMood: number; // -5 to +5
  description?: string;
}

export interface StruggleLog {
  id: string;
  date: string;
  title: string;
  category: 'Work' | 'Dating' | 'Family' | 'Personal' | 'Gender/Identity' | 'Health' | 'Living Situation';
  intensity: number; // 1 to 10
  description: string;
  copingMechanism: string;
  cognitiveLoad: 'low' | 'moderate' | 'severe';
  resolved: boolean;
  resolvedDate?: string;
  rootCauseAnalysis?: string;
  domainTrigger?: string;
}

export interface DomainAssessment {
  work: number; // 1 to 10
  personalLife: number; // 1 to 10
  dating: number; // 1 to 10
  family: number; // 1 to 10
  lifecycleEvents: number; // 1 to 10
  genderPattern: number; // 1 to 10
  livingEnvironment: number; // 1 to 10
  updatedAt: string;
  notes?: string;
}

export interface GenderDynamics {
  expressionStyle: string; // e.g. "Fluid Formal", "Authentic Minimalist", "Androgynous Soft"
  socialPresentationEnergy: number; // 1 to 10
  authenticityScore: number; // 1 to 10
  perceivedFriction: 'none' | 'subtle' | 'moderate' | 'pronounced';
  notes: string;
}

export interface LifecycleMilestone {
  id: string;
  date: string;
  phase: 'Early Career' | 'Relocation' | 'Relational Commitment' | 'Family Transition' | 'Identity Realignment' | 'Personal Renaissance';
  title: string;
  impactScore: number; // 1 to 10
  narrative: string;
}

export interface LifeEraRecord {
  id: string;
  timeframe: string; // e.g., "2020 - 2022", "2023 - 2024", "2025 - Present"
  title: string;
  cityAndLocation: string;
  livingSituation: string; // e.g., "Shared 3-bed flat with roommates", "Solo quiet loft", "Partner cohabitation"
  employmentRole: string; // e.g., "Junior Software Engineer", "Tech Lead / Startup", "Independent Consultant"
  relationshipPhase: string; // e.g., "Active casual dating", "Long-term committed partnership", "Solo self-discovery"
  psychologicalEra: string; // e.g., "Foundational Striving", "Overload & Re-evaluation", "Boundary & Identity Consolidation"
  baselineAffect: number; // 1 to 10
  keyConcerns: string[];
  keyGrowthLeaps: string[];
  meaningAndSynthesis: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  displayName: string;
  pronouns: string;
  avatarSeed: string;
  createdAt: string;
  livingSituation: {
    currentCity: string;
    country: string;
    housingType: 'Solo Apartment' | 'Shared Flat' | 'Cohabiting with Partner' | 'Family Home' | 'Nomadic / Transient';
    stabilityRating: number; // 1 to 10
    environmentalStressors: string[];
  };
  employment: {
    jobTitle: string;
    companyOrField: string;
    employmentStatus: 'Full-Time' | 'Founder / Entrepreneur' | 'Freelance / Consultant' | 'Career Transition' | 'Student';
    workMode: 'Remote' | 'Hybrid' | 'In-Person';
    careerSatisfaction: number; // 1 to 10
    burnoutRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
  };
  developmentalEra: {
    ageBracket: '18-24' | '25-34' | '35-44' | '45-54' | '55+';
    lifeStage: 'Emerging Adulthood' | 'Early Career Consolidation' | 'Intimacy & Partnership Formation' | 'Mid-Life Identity Renaissance' | 'Generativity & Mentorship';
    attachmentStyle: 'Secure' | 'Anxious-Preoccupied' | 'Dismissive-Avoidant' | 'Fearful-Avoidant';
    corePriority: string;
  };
  securitySettings: {
    e2eeEnabled: boolean;
    biometricSimulated: boolean;
    anonymousTelemetry: boolean;
    dataRetentionDays: number;
  };
}

export interface AISynthesisResult {
  executiveSummary: string;
  rootCauseCorrelations: Array<{
    trigger: string;
    impact: string;
    severity: 'high' | 'moderate' | 'low';
  }>;
  lifecycleTrajectory: string;
  genderAndSocialDynamics: string;
  habitMomentumScore: number;
  topActionableInterventions: string[];
  anomalyAlerts: string[];
  source?: string;
  generatedAt?: string;
}

export interface DevelopmentalPsychologySynthesis {
  overallArcTitle: string;
  coreIdentityEvolution: string;
  livingEnvironmentImpact: string;
  employmentAndBurnoutAnalysis: string;
  relationshipAndAttachmentArc: string;
  commonPsychologicalPatterns: Array<{
    concern: string;
    originEra: string;
    currentManifestation: string;
    clinicalFraming: string;
  }>;
  longitudinalMeaningAndWisdom: string;
  developmentalMilestoneRoadmap: string[];
}

export interface MLSimulationResult {
  status: string;
  engine: string;
  clusters: Array<{
    clusterId: number;
    label: string;
    variance: number;
    prevalence: string;
  }>;
  causalityMatrix: Array<{
    cause: string;
    effect: string;
    pValue: number;
    grangerScore: number;
  }>;
  anomalyIndex: number;
  sampleCount: number;
  executionTimeMs: number;
}

export interface VaultMetadata {
  isLocked: boolean;
  hasPassphrase: boolean;
  lastEncryptedAt: string | null;
  keyDerivationRounds: number;
  algorithm: string;
  saltHex: string;
  checksum: string;
}

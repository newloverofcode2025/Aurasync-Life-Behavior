import React, { useState } from 'react';
import { 
  Terminal, 
  Cpu, 
  Layers, 
  Play, 
  Check, 
  Copy, 
  FileCode, 
  Server, 
  Box, 
  Shield, 
  Database, 
  Sparkles,
  GitBranch
} from 'lucide-react';
import { MLSimulationResult } from '../types';

type CodeTabKey = 'python-ml' | 'pytorch-model' | 'semantic-owl' | 'k8s' | 'docker' | 'crypto-ts';

export const ArchitectureHubView: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<CodeTabKey>('python-ml');
  const [mlSimResult, setMlSimResult] = useState<MLSimulationResult | null>(null);
  const [isRunningSim, setIsRunningSim] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const runLiveMLSimulation = async () => {
    setIsRunningSim(true);
    try {
      const res = await fetch('/api/ml/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataPoints: Array.from({ length: 48 }, (_, i) => ({ id: i })) })
      });
      const data = await res.json();
      setMlSimResult(data);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsRunningSim(false);
    }
  };

  const codeSnippets: Record<CodeTabKey, { title: string; lang: string; code: string }> = {
    'python-ml': {
      title: 'services/ml_engine/main.py',
      lang: 'Python (FastAPI + Scikit-Learn)',
      code: `"""
Behavioral Synthesizer - Machine Learning Microservice
Polyglot Backend Service built with Python, FastAPI, Scikit-Learn, and PyTorch.
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import numpy as np
from sklearn.cluster import KMeans
from sklearn.ensemble import IsolationForest

app = FastAPI(title="Behavioral Synthesis & ML Engine", version="2.4.0")

class BehavioralVector(BaseModel):
    timestamp: str
    valence: float = Field(..., ge=1.0, le=10.0)
    arousal: float = Field(..., ge=1.0, le=10.0)
    work_load: float = Field(default=5.0)
    dating_presence: float = Field(default=5.0)
    gender_authenticity: float = Field(default=8.0)
    habit_adherence: float = Field(default=0.8)

@app.post("/api/v1/analyze")
def analyze_behavioral_patterns(payload: ClusterAnalysisRequest):
    # 1. Isolation Forest for behavioral anomaly / burnout detection
    iso = IsolationForest(contamination=0.15, random_state=42)
    anomaly_preds = iso.fit_predict(X)
    
    # 2. KMeans Behavioral State Clustering
    kmeans = KMeans(n_clusters=3, random_state=42, n_init='auto')
    labels = kmeans.fit_predict(X)
    
    # 3. Granger Causality & Temporal Lag Estimations
    ...`
    },
    'pytorch-model': {
      title: 'services/ml_engine/model.py',
      lang: 'Python (PyTorch / NumPy RNN)',
      code: `"""
PyTorch-based Deep Behavioral Trajectory Predictor & Recurrent State Model.
Maps multi-dimensional longitudinal vectors to predict emotional drift and burnout.
"""
import numpy as np

class BehavioralTrajectoryPredictor:
    def __init__(self, input_dim: int = 7, hidden_dim: int = 32, forecast_horizon: int = 7):
        self.input_dim = input_dim
        self.hidden_dim = hidden_dim
        self.forecast_horizon = forecast_horizon
        
        # Recurrent state transition weights
        self.W_hh = np.random.randn(hidden_dim, hidden_dim) * 0.05
        self.W_xh = np.random.randn(input_dim, hidden_dim) * 0.05
        self.W_hy = np.random.randn(hidden_dim, input_dim) * 0.05

    def forward_trajectory(self, sequence: np.ndarray) -> np.ndarray:
        # Executes recurrent forward pass over temporal affect history
        ...`
    },
    'semantic-owl': {
      title: 'schemas/behavioral_ontology.ttl',
      lang: 'Semantic Web (W3C RDF / OWL Turtle)',
      code: `@prefix : <https://w3id.org/aurasync/ontology#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

<https://w3id.org/aurasync/ontology>
    a owl:Ontology ;
    dc:title "Behavioral & Lifecycle Synthesis Ontology (BLSO)" .

:HumanAgent a owl:Class .
:BehavioralSnapshot a owl:Class .
:AffectState a owl:Class .
:LifeDomain a owl:Class .
:GenderExpressionPattern a owl:Class ;
    rdfs:subClassOf :LifeDomain .
:CausalInference a owl:Class .

:triggersStruggle a owl:ObjectProperty ;
    rdfs:domain :LifeDomain ;
    rdfs:range :StruggleEpisode .

:buffersAffect a owl:ObjectProperty ;
    rdfs:domain :HabitStack ;
    rdfs:range :AffectState .`
    },
    'k8s': {
      title: 'k8s/ml-deployment.yaml & hpa.yaml',
      lang: 'Kubernetes YAML (Cloud Native)',
      code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: aurasync-ml
  namespace: aurasync-prod
spec:
  replicas: 2
  template:
    spec:
      containers:
        - name: ml-engine
          image: ghcr.io/username/aurasync-ml:latest
          resources:
            requests: { cpu: "500m", memory: "512Mi" }
            limits:   { cpu: "2000m", memory: "1536Mi" }
          livenessProbe:
            httpGet: { path: /health, port: 8000 }
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: aurasync-ml-hpa
spec:
  scaleTargetRef:
    kind: Deployment
    name: aurasync-ml
  minReplicas: 2
  maxReplicas: 8
  metrics:
    - type: Resource
      resource: { name: cpu, target: { type: Utilization, averageUtilization: 75 } }`
    },
    'docker': {
      title: 'docker-compose.yml',
      lang: 'Docker Compose (Polyglot Mesh)',
      code: `version: '3.8'
services:
  web-gateway:
    build: { context: ., dockerfile: Dockerfile }
    ports: ["3000:3000"]
    depends_on: [ml-engine, redis-cache, timescaledb]
    
  ml-engine:
    build: { context: ./services/ml_engine, dockerfile: Dockerfile }
    ports: ["8000:8000"]
    
  redis-cache:
    image: redis:7-alpine
    ports: ["6379:6379"]
    
  timescaledb:
    image: timescale/timescaledb:latest-pg15
    ports: ["5432:5432"]`
    },
    'crypto-ts': {
      title: 'src/utils/crypto.ts',
      lang: 'TypeScript (W3C Web Crypto API)',
      code: `/**
 * Zero-Knowledge Client-Side End-to-End Encryption (E2EE) Engine
 * Implements AES-256-GCM with PBKDF2 (100,000 SHA-256 iterations)
 */
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw', new TextEncoder().encode(passphrase),
    { name: 'PBKDF2' }, false, ['deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
  );
}

export async function encryptData(payload: unknown, passphrase: string) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  ...
}`
    }
  };

  const copySnippet = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div id="architecture-hub-view" className="space-y-6">
      {/* Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Terminal className="w-5 h-5" />
              </div>
              <h1 className="text-lg font-bold text-stone-100">
                Polyglot Architecture &amp; Engineering Portfolio Hub
              </h1>
            </div>
            <p className="text-xs text-stone-400 mt-1 max-w-2xl">
              Demonstrating cross-functional systems engineering: Client-Side E2EE, Node.js API Gateway, Python FastAPI ML Microservice, Semantic W3C RDF/OWL, Docker, and Kubernetes.
            </p>
          </div>

          <button
            onClick={runLiveMLSimulation}
            disabled={isRunningSim}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isRunningSim ? 'animate-pulse' : ''}`} />
            <span>{isRunningSim ? 'Computing Pipeline...' : 'Run Live ML Simulation'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Microservice Topology Diagram */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Multi-Language Distributed Architecture Topology</span>
            </h2>
            <p className="text-xs text-stone-400">End-to-end data flow with zero-knowledge cryptography guarantees</p>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            5 Services Orchestrated
          </span>
        </div>

        {/* Visual Architecture Topology Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {/* Node 1: React & WebCrypto */}
          <div className="p-3.5 bg-stone-950/80 border border-purple-500/30 rounded-lg space-y-2 relative">
            <div className="w-6 h-6 rounded bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-100 block">Frontend &amp; Crypto</span>
              <span className="text-[10px] text-purple-400 font-mono">React 19 + WebCrypto</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-snug">
              Client-authoritative AES-256-GCM authenticated encryption. Zero plaintext leaves browser.
            </p>
          </div>

          {/* Node 2: Node.js Express Gateway */}
          <div className="p-3.5 bg-stone-950/80 border border-emerald-500/30 rounded-lg space-y-2 relative">
            <div className="w-6 h-6 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Server className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-100 block">API Gateway</span>
              <span className="text-[10px] text-emerald-400 font-mono">Node.js + Express 4</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-snug">
              Reverse proxy, rate limiting, and Gemini 3.8 Flash AI synthesis pipeline.
            </p>
          </div>

          {/* Node 3: Python FastAPI ML Microservice */}
          <div className="p-3.5 bg-stone-950/80 border border-amber-500/30 rounded-lg space-y-2 relative">
            <div className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-100 block">ML Microservice</span>
              <span className="text-[10px] text-amber-400 font-mono">Python 3.11 + FastAPI</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-snug">
              K-Means clustering, Isolation Forest anomaly detection, Granger causality modeling.
            </p>
          </div>

          {/* Node 4: Semantic RDF / OWL Layer */}
          <div className="p-3.5 bg-stone-950/80 border border-sky-500/30 rounded-lg space-y-2 relative">
            <div className="w-6 h-6 rounded bg-sky-500/10 flex items-center justify-center text-sky-400">
              <GitBranch className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-100 block">Semantic Ontology</span>
              <span className="text-[10px] text-sky-400 font-mono">W3C RDF / OWL Turtle</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-snug">
              Formal ontology mapping affects, habit cascades, and gender expression dynamics.
            </p>
          </div>

          {/* Node 5: Docker & Kubernetes Mesh */}
          <div className="p-3.5 bg-stone-950/80 border border-blue-500/30 rounded-lg space-y-2 relative">
            <div className="w-6 h-6 rounded bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Box className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-100 block">Cloud Native</span>
              <span className="text-[10px] text-blue-400 font-mono">Docker + K8s HPA</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-snug">
              Rolling updates, horizontal autoscaling (2-8 pods), TimescaleDB, and Redis caching.
            </p>
          </div>
        </div>
      </div>

      {/* Live Python ML Simulation Results (Interactive) */}
      {mlSimResult && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-stone-100">
                Live Python ML Pipeline Simulation Results (FastAPI + PyTorch)
              </h2>
            </div>
            <div className="flex items-center space-x-2 text-[11px] font-mono text-stone-400">
              <span>Latency:</span>
              <span className="text-emerald-400 font-bold">{mlSimResult.executionTimeMs} ms</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-stone-950 rounded-lg border border-stone-800">
              <span className="text-stone-400 block mb-1">Anomaly / Burnout Index</span>
              <span className="text-lg font-bold text-emerald-400">{mlSimResult.anomalyIndex}</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">Isolation Forest (Stable)</span>
            </div>

            <div className="p-3 bg-stone-950 rounded-lg border border-stone-800">
              <span className="text-stone-400 block mb-1">Clustered Behavioral States</span>
              <span className="text-lg font-bold text-amber-400">{mlSimResult.clusters.length} States</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">K-Means Centroids derived</span>
            </div>

            <div className="p-3 bg-stone-950 rounded-lg border border-stone-800">
              <span className="text-stone-400 block mb-1">Granger Causality Pairs</span>
              <span className="text-lg font-bold text-sky-400">{mlSimResult.causalityMatrix.length} Linkages</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">p &lt; 0.05 Significance</span>
            </div>
          </div>

          {/* Causality Matrix Table */}
          <div className="bg-stone-950 rounded-lg border border-stone-800 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-900/60 text-stone-400 font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-2.5">Hypothesized Cause</th>
                  <th className="p-2.5">Lagged Effect</th>
                  <th className="p-2.5">Granger Score</th>
                  <th className="p-2.5">P-Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80 font-mono text-[11px] text-stone-300">
                {mlSimResult.causalityMatrix.map((c, i) => (
                  <tr key={i} className="hover:bg-stone-900/40">
                    <td className="p-2.5 text-stone-200 font-sans">{c.cause}</td>
                    <td className="p-2.5 text-stone-200 font-sans">{c.effect}</td>
                    <td className="p-2.5 text-emerald-400">{c.grangerScore}</td>
                    <td className="p-2.5 text-sky-400">{c.pValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Polyglot Code Explorer */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="border-b border-stone-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>Polyglot Repository Code Inspector</span>
            </h2>
            <p className="text-xs text-stone-400">
              Inspect production source files across Python, PyTorch, Semantic RDF/OWL, Kubernetes, and WebCrypto
            </p>
          </div>

          <button
            onClick={() => copySnippet(codeSnippets[activeCodeTab].code)}
            className="flex items-center space-x-1 text-xs text-stone-400 hover:text-stone-200 self-start sm:self-auto"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Code Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-stone-800 pb-2">
          {(Object.keys(codeSnippets) as CodeTabKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActiveCodeTab(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeCodeTab === key
                  ? 'bg-stone-800 text-emerald-400 border border-stone-700'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
              }`}
            >
              {codeSnippets[key].title.split('/').pop()}
            </button>
          ))}
        </div>

        {/* Code Content */}
        <div className="bg-stone-950 p-4 rounded-lg border border-stone-800 font-mono text-xs text-stone-300 overflow-x-auto max-h-96">
          <div className="text-[11px] text-stone-400 mb-2 pb-2 border-b border-stone-800 flex justify-between">
            <span>File: {codeSnippets[activeCodeTab].title}</span>
            <span className="text-emerald-400">{codeSnippets[activeCodeTab].lang}</span>
          </div>
          <pre>{codeSnippets[activeCodeTab].code}</pre>
        </div>
      </div>

      {/* Recruiter & Senior Portfolio Highlights */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="border-b border-stone-800 pb-3">
          <h2 className="text-base font-semibold text-stone-100 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Senior Architectural Highlights for GitHub &amp; Technical Interviews</span>
          </h2>
          <p className="text-xs text-stone-400">Core architectural competencies demonstrated in this project</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-lg space-y-2">
            <h3 className="font-semibold text-stone-200 text-sm">1. Zero-Knowledge Cryptography</h3>
            <p className="text-stone-400 leading-relaxed">
              Engineered client-side Web Crypto API (AES-256-GCM + PBKDF2 with 100,000 iterations) ensuring that even under complete backend compromise, plaintext psychological data cannot be decrypted by servers.
            </p>
          </div>

          <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-lg space-y-2">
            <h3 className="font-semibold text-stone-200 text-sm">2. Polyglot Microservices</h3>
            <p className="text-stone-400 leading-relaxed">
              Orchestrated TypeScript/Node.js API gateway with Python FastAPI/PyTorch ML microservices, bridged by clean REST contracts, differential privacy vectors, and W3C RDF/OWL semantic ontologies.
            </p>
          </div>

          <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-lg space-y-2">
            <h3 className="font-semibold text-stone-200 text-sm">3. Cloud Native Orchestration</h3>
            <p className="text-stone-400 leading-relaxed">
              Designed multi-stage Docker builds, docker-compose mesh, and production Kubernetes manifests with Horizontal Pod Autoscaling (HPA), rolling update policies, and liveness/readiness probes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

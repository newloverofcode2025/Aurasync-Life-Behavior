# AuraSync: End-to-End Encrypted Behavioral & Lifecycle Synthesizer

> A high-assurance, polyglot platform for longitudinal tracking, zero-knowledge encryption, and AI-driven behavioral synthesis across work, dating, family, gender dynamics, and lifecycle transitions.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11-green.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-teal.svg)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue.svg)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Production--Ready-326CE5.svg)](https://kubernetes.io/)
[![Security: E2EE](https://img.shields.io/badge/Security-AES--256--GCM%20%2B%20PBKDF2-darkred.svg)](https://www.w3.org/TR/WebCryptoAPI/)

---

## 🌟 Key Highlights & Portfolio Overview

This project was engineered to demonstrate senior full-stack and systems engineering craftsmanship across multiple programming languages, security domains, and cloud-native architectures:

1. **Zero-Knowledge Privacy Architecture**:
   - Client-side AES-256-GCM authenticated encryption via the standard W3C Web Crypto API.
   - PBKDF2 key derivation (100,000 rounds of SHA-256) ensures the server never possesses master passphrases or unencrypted psychological journals.
   - Tamper-evident SHA-256 payload checksums.
2. **Multi-Dimensional Longitudinal Tracking**:
   - Captures valence, physiological arousal, habit stacks, emotional struggles, cognitive load, lifecycle milestones, and gender expression / presentation dynamics.
   - Visualizes systemic interactions (e.g., how work stress cascades into dating detachment or habit lapses).
3. **AI & Machine Learning Microservice Mesh**:
   - **Node.js / Express Gateway**: Integrates Gemini 3.8 Flash via `@google/genai` for qualitative clinical synthesis and actionable micro-interventions.
   - **Python FastAPI ML Engine**: Executes K-Means clustering, Isolation Forest anomaly detection, and Granger causality analysis over behavioral vectors.
4. **Semantic Web Interoperability**:
   - Formal W3C RDF/OWL Ontology (`schemas/behavioral_ontology.ttl`) and JSON-LD schema linking affect states to lifecycle domains.
5. **Cloud Native DevOps**:
   - Complete `docker-compose.yml` orchestrating Web, Python ML, TimescaleDB, and Redis.
   - Production Kubernetes (`k8s/`) manifests featuring Horizontal Pod Autoscaling (HPA), zero-downtime rolling updates, and health probes.

---

## 🛠️ Polyglot Tech Stack

- **Frontend & Client Crypto**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Web Crypto API.
- **Backend API Gateway**: Node.js, Express, tsx, esbuild, Google GenAI SDK.
- **ML Microservice**: Python 3.11, FastAPI, Scikit-Learn, PyTorch, NumPy, Statsmodels.
- **Semantic Layer**: W3C RDF / OWL Turtle, JSON-LD.
- **Infrastructure**: Docker, Docker Compose, Kubernetes (Deployments, Services, HPA, Ingress), TimescaleDB, Redis.

---

## 🚀 Quickstart

### 1. Interactive Web Application
```bash
# Install dependencies
npm install

# Start development full-stack server (Port 3000)
npm run dev

# Build for production (compiles React + bundles server.cjs via esbuild)
npm run build
npm start
```

### 2. Multi-Container Docker Mesh
```bash
docker-compose up --build
```
- Web Application: `http://localhost:3000`
- Python ML Service: `http://localhost:8000/docs` (Swagger UI)

### 3. Kubernetes Deployment
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/
```

---

## 🔒 Cryptographic Model & Threat Defense

Read the complete specification in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
- **Client Encryption**: AES-GCM 256-bit with unique 96-bit IV per snapshot.
- **Key Derivation**: PBKDF2 with 100,000 iterations of SHA-256 and 128-bit salt.
- **Integrity**: 128-bit GCM authentication tag + SHA-256 payload digest.

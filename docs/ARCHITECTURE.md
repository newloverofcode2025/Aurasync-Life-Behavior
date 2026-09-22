# AuraSync: Enterprise Behavioral & Lifecycle Synthesis Architecture

## 1. Executive System Overview

AuraSync is an end-to-end encrypted (E2EE), polyglot behavioral analytics and lifecycle synthesis platform. It solves a fundamental dilemma in personal informatics: individuals require deep, multi-dimensional behavioral synthesis across work, dating, family, lifecycle transitions, and gender expression, but cannot entrust unencrypted longitudinal psychological datasets to centralized cloud providers.

AuraSync solves this via a **Zero-Knowledge Client Architecture**:
- All raw psychological, relational, habit, and gender expression entries are encrypted directly in the client browser using the standard **W3C Web Crypto API (AES-256-GCM + PBKDF2)** before any storage or network transmission.
- Decryption keys are derived exclusively in ephemeral browser memory and never leave the device.
- Longitudinal synthesis and machine learning utilize client-authorized tokenization, differential privacy vectors, and server-side Gemini 3.8 Flash models without persisting unencrypted user journals.

---

## 2. Polyglot Architecture & Microservices Topology

```
+-----------------------------------------------------------------------------------+
|                            CLIENT BROWSER RUNTIME                                 |
|                                                                                   |
|  [ React 19 + TypeScript ] <---> [ Web Crypto API: AES-256-GCM / PBKDF2 100k ]    |
|  - Longitudinal Dashboards      - Master Passphrase Vault Manager                 |
|  - Multi-Axis Data Mapping      - Tamper-Evident SHA-256 Integrity Verification   |
|  - Interactive Ontology View    - Zero-Knowledge Encrypted Backup Export/Import   |
+------------------------------------------+----------------------------------------+
                                           | HTTPS / JSON (Encrypted Payloads & Vectors)
                                           v
+-----------------------------------------------------------------------------------+
|                        API GATEWAY / INGRESS LAYER                                |
|                                                                                   |
|  [ Node.js + Express 4.x + TypeScript ]                                           |
|  - Port 3000 | Ingress Reverse Proxy & TLS Termination                            |
|  - Gemini 3.8 Flash AI Synthesis Pipeline (@google/genai SDK)                     |
|  - JWT / Rate Limiting / CORS Policies                                            |
|  - Health Probes & Service Mesh Dispatcher                                        |
+------------------------------------------+----------------------------------------+
                                           | Internal RPC / Async Task Bus
                                           v
+-----------------------------------------------------------------------------------+
|                  MACHINE LEARNING & TIME-SERIES SERVICES                          |
|                                                                                   |
|  [ Python 3.11 + FastAPI + PyTorch + Scikit-Learn ]                               |
|  - Port 8000 | Clustering (K-Means), Anomaly Detection (Isolation Forest)          |
|  - Granger Causality & Cross-Lag Temporal Correlation (Statsmodels)              |
|  - Neural Trajectory Forecasting (PyTorch RNN State Model)                        |
|                                                                                   |
|  [ Semantic Layer ]                                                               |
|  - W3C RDF/OWL Behavioral Ontology (`behavioral_ontology.ttl`)                    |
|  - JSON-LD Context Mapping (`ontology.jsonld`)                                    |
+------------------------------------------+----------------------------------------+
                                           |
                    +----------------------+----------------------+
                    v                                             v
+--------------------------------------+   +----------------------------------------+
|      DATA PERSISTENCE TIER           |   |           CACHE & EVENT TIER           |
|  [ PostgreSQL 15 + TimescaleDB ]     |   |  [ Redis 7.0 In-Memory Engine ]        |
|  - Hypertable time-series partitions |   |  - Ephemeral session keys & telemetry  |
|  - Zero-knowledge encrypted blobs    |   |  - Cluster autoscaling event bus       |
+--------------------------------------+   +----------------------------------------+
```

---

## 3. Cryptographic Specification (Zero-Knowledge E2EE)

AuraSync enforces strict client-authoritative zero-knowledge privacy:

1. **Key Derivation (PBKDF2)**:
   - Salt: 16 cryptographically secure pseudo-random bytes (`window.crypto.getRandomValues`).
   - Iterations: 100,000 rounds of HMAC-SHA-256.
   - Output: 256-bit symmetric key (`CryptoKey`).
2. **Authenticated Encryption (AES-GCM)**:
   - Cipher: Advanced Encryption Standard in Galois/Counter Mode (AES-GCM).
   - Initialization Vector (IV): 12 distinct cryptographically random bytes per transaction.
   - Authentication Tag: 128-bit authentication tag ensuring ciphertext integrity.
3. **Payload Checksum**:
   - Computes SHA-256 hash of plaintext JSON before encryption.
   - On decryption, verifies the hash matches precisely, guaranteeing tamper detection.

---

## 4. Multi-Language Portfolio Matrix

| Technology | Role in System | Key Files | Competency Demonstrated |
| :--- | :--- | :--- | :--- |
| **TypeScript / React 19** | Interactive User Interface, Visualizations, Crypto Vault | `/src/App.tsx`, `/src/utils/crypto.ts`, `/src/types.ts` | Modern state management, responsive UI, W3C WebCrypto API |
| **Node.js / Express** | API Gateway, Gemini GenAI Orchestration, Vite Middleware | `/server.ts` | Scalable full-stack backend, API proxying, robust fallback engineering |
| **Python / FastAPI** | Machine Learning, Temporal Causality, Clustering | `/services/ml_engine/main.py`, `model.py` | Scientific computing (NumPy, Scikit-learn), PyTorch RNN models, REST API design |
| **Semantic Web (OWL / RDF)** | Knowledge Graph, Behavioral Domain Ontologies | `/schemas/behavioral_ontology.ttl`, `ontology.jsonld` | Formal semantic modeling, W3C Turtle syntax, linked data principles |
| **Docker & Docker Compose** | Multi-container environment orchestration | `/docker-compose.yml`, `/Dockerfile`, `services/ml_engine/Dockerfile` | Production container builds, multi-stage optimization, isolated networking |
| **Kubernetes (K8s)** | Cloud Native production deployment & autoscaling | `/k8s/` (Deployments, Services, HPA, Ingress) | Enterprise infrastructure-as-code, high availability, rolling updates |

---

## 5. Deployment & Kubernetes Scaling

The platform includes production-ready Kubernetes manifests in `/k8s`:
- **Rolling Updates**: Zero-downtime rolling updates with `maxSurge: 1` and `maxUnavailable: 0`.
- **Horizontal Pod Autoscaler (HPA)**: Dynamically scales the Python ML service between 2 and 8 replicas based on CPU (>75%) and memory (>80%) utilization.
- **Health Probes**: Liveness and readiness HTTP endpoints ensuring traffic is only routed to healthy pods.

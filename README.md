# VibeCoder - Omni-Agent IDE

> **Architect your dreams with a swarm of autonomous AI agents.**

**VibeCoder** is a next-generation, browser-based integrated development environment (IDE) powered by a coordinated multi-agent swarm architecture. Unlike traditional coding assistants, VibeCoder leverages a simulated **"Context 7" Model Context Protocol (MCP)** to ensure all generated code is grounded in the absolute latest documentation, library versions, and integration patterns.

![VibeCoder Interface](https://via.placeholder.com/800x400?text=VibeCoder+Omni-Agent+IDE)

## 🚀 Core Capabilities

### 🧠 Autonomous Multi-Agent Swarm
VibeCoder does not just "predict tokens"; it orchestrates a specialized team of AI agents to handle complex engineering tasks:

1.  **Atlas (Manager)**
    *   **Role**: Strategic Planning & Analysis
    *   **Responsibility**: Analyzes user intent, breaks down high-level "vibes" into actionable technical requirements, and orchestrates the swarm's workflow.

2.  **The Architect**
    *   **Role**: System Design
    *   **Responsibility**: Designs scalable file structures, selects appropriate technology stacks, and defines component hierarchies before code generation begins. Uses `gemini-3-pro-preview` for high-level reasoning.

3.  **The Connector (Context 7 Specialist)**
    *   **Role**: Integration & Verification
    *   **Responsibility**: Interfaces with the Context 7 MCP server to validate library versions, check for deprecated patterns, and retrieve "ground truth" documentation for cutting-edge frameworks (e.g., Next.js 14+, Tailwind v3.4+).

4.  **VibeCoder (The Builder)**
    *   **Role**: Implementation
    *   **Responsibility**: Writes clean, performant, modern TypeScript/React code based on the validated architecture and verified integration patterns.

### 🌐 Context 7 MCP Integration
VibeCoder simulates a connection to a **Model Context Protocol (MCP)** server known as "Context 7". This architectural layer prevents hallucinations by:
*   **Verifying Dependencies**: Ensuring requested libraries work together.
*   **Pattern Validation**: Checking code patterns against the latest official documentation.
*   **Documentation Retrieval**: Simulating RAG (Retrieval-Augmented Generation) for real-time library knowledge.

### ⚡ Hyper-Performant Vibe IDE
The platform features a custom-built, browser-native IDE designed for flow state:
*   **Zero-Latency Interface**: Optimized React rendering with a neon-cyberpunk aesthetic.
*   **Virtual File System**: Complete in-memory project structure manipulation.
*   **Intelligent Visualizer**: Real-time visualization of the agent swarm's thinking process.
*   **Simulated Preview**: Instant feedback loop for generated applications.

---

## 🛠 Architecture & Workflow

The system follows a strict **Chain-of-Thought (CoT)** execution pipeline for maximum reliability:

1.  **Ingestion**: User provides a prompt (e.g., "Build a SaaS dashboard").
2.  **Analysis**: The Manager agent deconstructs the request.
3.  **Blueprinting**: The Architect generates a JSON-based file tree structure.
4.  **Grounding**: The Integrator queries Context 7 to verify the stack's viability.
5.  **Scaffolding**: The Coder agent generates file contents based on the grounded blueprint.
6.  **Handoff**: The project state is transferred to the interactive IDE for user refinement.

## 💻 Technical Stack

*   **Frontend**: React 19, TypeScript, Tailwind CSS
*   **AI Engine**: Google GenAI SDK (`@google/genai`)
*   **Models**: 
    *   `gemini-3-pro-preview` (Architecture & Complex Reasoning)
    *   `gemini-2.5-flash` (Fast Code Generation & Integration)
*   **Icons**: Lucide React
*   **Typography**: JetBrains Mono (Code), Inter (UI)

## 🔮 The "Vibe" Philosophy

We believe coding tools should look as advanced as the code they generate. VibeCoder replaces sterile gray interfaces with a deep-space, glowing aesthetic designed to keep developers in the zone.

> *Code at the speed of thought. Vibe at the speed of light.*

---

## 📦 Installation & Usage

1.  **Clone the Repository**
2.  **Install Dependencies** (Standard React/Vite stack)
3.  **Configure API Key**: Ensure your `GoogleGenAI` API key is set in the environment.
4.  **Run**: Start the development server.

```bash
npm install
npm run dev
```

*Powered by Google Gemini & Context 7 Protocol*
# SCEditor-web: A Graphical Modeling Tool for Smart Contract Design and AI-Based Code Generation

![Version](https://img.shields.io/badge/version-0.3--alpha-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

**SCEditor-web** is an experimental, browser-based graphical editor for modeling smart contracts. Developed under Model-Driven Engineering (MDE) principles, it enables users to visually construct contract components, export platform-agnostic JSON models, and generate executable Solidity code using Large Language Models (LLMs).

This tool was developed in support of the research paper:

> _"SCEditor-Web: Bridging Model-Driven Engineering and Generative AI for Smart Contract Development"_  

---

## 🎯 Research Context

Smart contract development remains technically challenging due to platform-specific syntaxes, safety constraints, and decentralized execution logic. SCEditor-web bridges this gap by providing:

- A platform-independent modeling interface
- JSON representation aligned with a generic smart contract metamodel
- Zero-shot code generation via prompt-based interaction with LLMs (e.g., Claude 3.7, DeepSeek-V3, Gemini 2.5 Pro, GPT-4o)

This repository contains only the **editor source code**, not evaluation scripts or LLM outputs.

---

## ✨ Features

- 🧱 **Structural + Behavioral modeling** in a layered visual interface
- 🔁 JSON export respecting a blockchain-agnostic metamodel
- 🤖 Integration-ready with LLMs for Solidity code generation
- 🔍 Component-level drilldown via function layers
- 🧩 Modular Vue 3 + Konva.js + Pinia architecture
- 🧠 Aligned with MDE and software language engineering practices

---

## 🛠️ Installation & Setup

> Recommended Node version: 18+

```bash
git clone https://github.com/YassineDev91/sceditor-web.git
cd sceditor-web
npm install
npm run dev
```

To build for production:

```bash
npm run build
```
---

## 🔧 API Configuration

To enable code generation using your preferred LLM (e.g., Claude, OpenAI, etc.):

1. Rename the `.env.example` file to `.env`.
2. Open `.env` and replace the placeholder with your actual API key and endpoint.

Example `.env`:

```env
AI_API_URL=https://api.example.com/v1/generate?key=your_api_key_here
```

---

## 📄 Example Contract File

A ready-to-use example model is provided: `remote_purchase.json` (located in the project root).

### 🧪 What it contains

This file defines a **complete smart contract structure** including:
- Contract metadata
- Variables, Structs, and Constructor
- Functions and Statements
- Descriptions and design intent for each element

### 🧭 How to use it

1. Launch the editor.
2. Click the **Import** button.
3. Select the `remote_purchase.json` file from your system.
4. The contract will be loaded into the editor.

> 💡 This example mirrors the canonical "Remote Purchase" smart contract used throughout the paper for validation and testing.

---

## 🧩 Project Structure

| Path | Description |
|------|-------------|
| `components/` | Vue components for smart contract constructs (structural/behavioral) |
| `stores/`     | Pinia store for central JSON state & contract definition |
| `views/`      | Editor canvas and layout |
| `router/`     | Vue router for workspace and landing page |
| `public/`     | Static files and UI assets |
| `SmartContractGenerator.vue` | Interface for LLM communication (prompt-to-code) |

<!-- ---

## 📷 Screenshots

| MainLayer (structural) | FunctionLayer (behavioral logic) |
|------------------------|----------------------------------|
| ![](figures/mainlayer_example.png) | ![](figures/functionlayer_example.png) | -->

---

## 🏗️ Versioning and Status

- **Version:** v0.3-alpha
- **Status:** Academic prototype (research only)
- **Last updated:** September 2025
<!-- - **Live demo:** (optional GitHub Pages or localhost) -->

---

## 📚 Citation

```bibtex
@Article{info16100870,
  AUTHOR = {Ait Hsain, Yassine and Laaz, Naziha and Mbarki, Samir},
  TITLE = {SCEditor-Web: Bridging Model-Driven Engineering and Generative AI for Smart Contract Development},
  JOURNAL = {Information},
  VOLUME = {16},
  YEAR = {2025},
  NUMBER = {10},
  ARTICLE-NUMBER = {870},
  URL = {https://www.mdpi.com/2078-2489/16/10/870},
  ISSN = {2078-2489},
  DOI = {10.3390/info16100870}
}
```

---

## 🚫 Limitations

- No unit testing
- Does not include AI pipeline (evaluation hosted separately)
- Functional view support is partially implemented

---

## 🧪 Reproducibility

This repo reflects only the **editor front-end** described in the paper.  
Evaluation data, LLM prompts, and code generation metrics are available in the following repository :
👉 [smart-contract-eval](https://github.com/YassineDev91/smart-contract-eval)

---

## 🤝 Contributing

We welcome academic contributions, suggestions, and forks.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md)

---

## 📜 License

MIT License — For academic and research use only.

---

## 📬 Contact

For questions, collaborations, or clarification:
- 📧 yassine.aithsain@uit.ac.ma
- 🔗 [https://github.com/YassineDev91/sceditor-web](https://github.com/YassineDev91/SCEditor-web)

# SCEditor-web: A Graphical Modeling Tool for Smart Contract Design and AI-Based Code Generation

![Version](https://img.shields.io/badge/version-0.3--alpha-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

**SCEditor-web** is an experimental, browser-based graphical editor for modeling smart contracts. Developed under Model-Driven Engineering (MDE) principles, it enables users to visually construct contract components, export platform-agnostic JSON models, and generate executable Solidity code using Large Language Models (LLMs).

This tool was developed in support of the research paper:

> _"A Web-Based Graphical Editor for Smart Contract Modeling and AI-Powered Code Generation"_  

---

## 🎯 Research Context

Smart contract development remains technically challenging due to platform-specific syntaxes, safety constraints, and decentralized execution logic. SCEditor-web bridges this gap by providing:

- A platform-independent modeling interface
- JSON representation aligned with a generic smart contract metamodel
- Zero-shot code generation via prompt-based interaction with LLMs (e.g., Claude 3.7 DeepSeek-V3, Gemini 2.5 Pro, GPT-4o)

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

## 🧩 Project Structure

| Path | Description |
|------|-------------|
| `components/` | Vue components for smart contract constructs (structural/behavioral) |
| `stores/`     | Pinia store for central JSON state & contract definition |
| `views/`      | Editor canvas and layout |
| `router/`     | Vue router for workspace and landing page |
| `public/`     | Static files and UI assets |
| `SmartContractGenerator.vue` | Interface for LLM communication (prompt-to-code) |

---

## 📷 Screenshots

| MainLayer (structural) | FunctionLayer (behavioral logic) |
|------------------------|----------------------------------|
| ![](figures/mainlayer_example.png) | ![](figures/functionlayer_example.png) |

---

## 🏗️ Versioning and Status

- **Version:** v0.3-alpha
- **Status:** Academic prototype (research only)
- **Last updated:** May 2025
- **Live demo:** (optional GitHub Pages or localhost)

---

## 📚 Citation

If you use this tool in academic work, please cite:

```bibtex
@article{Your2025Paper,
  title={SCEditor-web: A Web-Based Graphical Editor for Smart Contract Modeling and AI-Powered Code Generation},
  author={Y Ait Hsain, N Laaz, S Mbarki},
  journal={Journal},
  year={2025},
  note={Under Review}
}
```

---

## 🚫 Limitations

- No runtime validation or unit testing
- Does not include AI pipeline (evaluation hosted separately)
- Functional view support is partially implemented

---

## 🧪 Reproducibility

This repo reflects only the **editor front-end** described in the paper.  
Evaluation data, LLM prompts, and code generation metrics are available upon request or in a companion repository.

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

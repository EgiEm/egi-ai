# Brigada — Developer Internship Portfolio

> **Endri "Egi" Emini** · Brigada Developer Internship (2026)  
> Full-stack web development, AI/ML engineering, and systems thinking — built from scratch.

---

## About

This repository is the complete portfolio from my Brigada developer internship. It contains every project, experiment, and capstone deliverable built across eight weeks of intensive work — from vanilla JavaScript web apps to fine-tuned AI intent routers that beat a 14-billion-parameter production model.

Every project here is built to be **read, run, and understood** — not just working code, but documented engineering with honest evaluations, real measurements, and named limitations.

---

## Capstone: Build Your Own AI Router

> **The flagship project.** Fine-tuned a small, fast intent router that beats OXODIN's production Qwen3-14B-AWQ model at 82.9x the speed while matching its accuracy.

**Final Verdict:** `CONTRACT: PASS — 82.9x faster, accuracy within margin`

| Model | Latency (p50) | Speedup | Golden Accuracy | Verdict |
| :--- | :---: | :---: | :---: | :---: |
| Qwen3-14B-AWQ (baseline) | 3,400 ms | 1.0x | 85.0% | BASELINE |
| SetFit | 265 ms | 12.8x | 83.3% | PASS |
| Distilled Student | 26 ms | 129.9x | 91.7% | PASS |
| **QLoRA Fine-tune** | **41 ms** | **82.9x** | **91.7%** | **PASS** |

The capstone includes a structured eval report, machine-readable scorecard, live interactive demo, and a six-beat presentation — the full shipped bundle.

**[View the full capstone →](Capstone%20Train%2C%20Beat%20the%2014B%20%26%20Ship/)**

---

## Projects

### AI & Machine Learning

| Project | Description |
| :--- | :--- |
| **[Capstone: Train, Beat the 14B & Ship](Capstone%20Train%2C%20Beat%20the%2014B%20%26%20Ship/)** | Week 8 capstone — SetFit, distillation, QLoRA fine-tuning, and the full shipped eval bundle |
| **[AI Router](ai-router/)** | Production-grade PHP intent router with shadow mode logging, structured outputs, and test suite |
| **[NLP Intent Classifier](nlp-intent-classifier-from-scratch/)** | Intent classifier built from scratch — TF-IDF, embeddings, and ML baselines |
| **[Semantic Search KNN Router](semantic-search-knn-gated-router/)** | KNN-gated semantic search router using dense embeddings and confidence thresholds |
| **[LLM Structured Outputs Validator](llm-structured-outputs-validator/)** | Validation harness for LLM structured output compliance |
| **[v6 Evaluation Harness](v6-The-Evaluation-Harness-main/)** | Evaluation framework for benchmarking model accuracy, latency, and contract gates |
| **[v4+v5 Slots & Small Models](v4%2Bv5%20Slots%20%26%20Small%20Models/)** | Slot filling, entity extraction, and small model experiments |

### Web Applications

| Project | Description |
| :--- | :--- |
| **[EgiAI — Second Brain](egi-ai/)** | Autonomous AI chatbot with three brain modes, glassmorphism UI, and local knowledge base. [Live Demo](https://egiem.github.io/egi-ai/) |
| **[SmileDent](SmileDent/)** | Dental clinic web application |
| **[Salloni Bukurise ARTA](Salloni-Bukurise-ARTA/)** | Beauty salon website |
| **[DrawApp](DrawApp/)** | Canvas drawing application |

### Games & Fun Projects

| Project | Description |
| :--- | :--- |
| **[Retro Tic-Tac-Toe](Retro%20TIC-TAC-TOE/)** | Retro-styled tic-tac-toe game |
| **[Coin Flip](coin-flip/)** | Coin flip simulator |
| **[Games Collection](Games/)** | Various browser games |
| **[Albanian Rhyme Words](Albanian%20Rhyme%20Words/)** | Albanian rhyme word finder |

### Tools & Utilities

| Project | Description |
| :--- | :--- |
| **[Vocals Aligner Pro](vocals-aligner-pro/)** | Audio/vocals alignment tool |
| **[Repo Organizer](Repo%20Organizer/)** | GitHub repository organization utility |

---

## Tech Stack

- **Languages:** Python, JavaScript (ES6+), PHP, HTML5, CSS3
- **AI/ML:** SetFit, SentenceTransformers, QLoRA, LoRA adapters, bitsandbytes, Scikit-Learn
- **LLMs:** Qwen3-14B-AWQ, Qwen3-4B, vLLM, knowledge distillation, confidence filtering
- **Web:** Vanilla JS, glassmorphism UI, responsive design, Google Fonts
- **Tools:** Git, GitHub, Google Colab, OBS Studio, VS Code

---

## What I Learned

Across eight weeks, the biggest takeaways were:

1. **Data beats architecture.** The single largest accuracy lift (+8.4 points) came from expanding the training set through distillation — not from switching to a fancier model. More and cleaner data wins.

2. **Measurement is engineering.** Every claim in the capstone is re-derivable from frozen golden numbers. Hand-waving gets caught; honest numbers with named limitations build trust.

3. **Communication is a real skill.** A model that wins on your laptop but can't be read, run, and trusted by a stranger isn't shipped. The bundle around the model — the report, the demo, the caveats — is the actual deliverable.

4. **Naming your weaknesses is a strength.** A failure analysis that says "the 14B still beats me on French and multi-intent utterances" is the most credible sentence in the whole report. It proves you measured honestly.

---

## Author

**Endri "Egi" Emini**  
Developer Intern @ Brigada  
Gjilan, Kosovo

[GitHub](https://github.com/EgiEm) · [EgiAI Live Demo](https://egiem.github.io/egi-ai/)

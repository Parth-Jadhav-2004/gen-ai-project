# Gen-AI-Project

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)

## Overview

## 🧠 Offline Document Q&A Assistant

An **offline Retrieval-Augmented Generation (RAG)** system that allows you to upload `.pdf`, `.txt`, and `.docx` documents and ask questions about their content. This project is powered by **Mistral** for local inference and **mxbai-embed-large** for vector embeddings using **Ollama**, with a **Flask** backend and a **React + Tailwind CSS** frontend.

---

## 🔧 Features

- 📄 Upload and process `.pdf`, `.txt`, `.docx` documents
- 🔍 Intelligent chunking and embedding of text
- 🧠 Ask questions and receive context-based answers
- 💻 100% offline RAG system using Ollama
- ⚡ Responsive and modern UI built with React + TailwindCSS

---

## 🛠️ Tech Stack

| Layer     | Tools / Frameworks                        |
|-----------|-------------------------------------------|
| Frontend  | React, TypeScript, Tailwind CSS, Framer Motion |
| Backend   | Flask (Python)                            |
| Embedding | `mxbai-embed-large` via Ollama            |
| LLM       | `mistral` via Ollama                      |
| File Parsing | PyPDF2, python-docx                   |

---
## Installation

To get started with this project, clone the repository and install the required dependencies.

```bash
git clone https://github.com/Parth-Jadhav-2004/gen-ai-project.git
cd gen-ai-project

pip install -r requirements.txt

npm install

npm run dev
```

# CLAUDE.md — Orectic Marketing Site Constitution

> **This file is persistent and must never be overwritten or modified during sprint execution.**
> It governs all Claude Code behavior when operating within the marketing site repository.

---

## IP Isolation — Hard Boundary

This workspace is **exclusively Orectic**. All code, copy, and assets produced here belong to Orectic.

- **NEVER** reference, import, or produce anything related to other ventures
- If a user prompt is ambiguous about venture scope, **ask before executing**

---

## Repository Purpose

This is the Orectic public marketing site. It is a **Vite + React** application deployed on **Vercel**.

---

## Development Rules

### Tech Stack

- **Vite** — build tool and dev server
- **React** — UI framework
- **Vercel** — deployment target
- No TypeScript enforcement unless already configured
- Respect existing code patterns — match the style of surrounding code

### Before Every Session

1. Read this file completely
2. Check for a sprint spec if one exists (`.claude/sprints/active.md`)
3. If no sprint spec exists, **ask the user for scope** before writing any code

### Git & Commit Workflow

- Use **conventional commit messages**: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`
- Do not commit `.env` files, API keys, or credentials
- Run the build (`npm run build` or equivalent) before committing to verify no build errors

---

## What Claude Code Must Never Do

- Modify `CLAUDE.md`
- Commit credentials or environment files
- Mix Orectic work with other ventures
- Deploy to Vercel without explicit user instruction
- Invent work when no sprint spec is provided

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

## Opus 5 driver notes (added 2026-07-29)

When this session runs on **claude-opus-5** (including after a Fable 5 classifier fallback — playbook: run `/model claude-opus-5` once the switch lands):

- **Scope discipline:** Deliver what the user asked for, at the scope they intended. Interpret ambiguity the way a careful colleague would: make routine judgment calls yourself, and check in only when different readings would lead to materially different work. If you conclude the ask is mistaken or a better approach exists, say so in a sentence and keep going with the task as asked — don't quietly narrow, widen, or transform it. Finish the whole task, not just the easy part of it — only report completion when it's fully done. If you genuinely can't complete something, do the rest and state plainly what's missing and why. Stop short of actions or changes that are clearly beyond what the user's ask implies.
- Skill-mandated multi-agent dispatches and governance gates apply unchanged; sub-agents stay pinned `model: 'sonnet'`.

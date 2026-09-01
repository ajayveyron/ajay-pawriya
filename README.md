# Ajay Personal AI

A local-first, versioned source of personal context for AI tools and agents. It is deliberately useful without an API key, a vector database, or a hosted service.

Install it with `npm install @ajaypawriya/ajay-pawriya`.

## What is here

- `identity.md` — stable context about Ajay.
- `now.md` — current professional focus, dated so it can go stale safely.
- `preferences.md` — working and collaboration preferences.
- `writing-style.md` — communication guidance.
- `memories/` — dated, sourced records with confidence and privacy metadata.
- `projects/` — public project cards for current work and selected experiments.
- `skills/ajay-personal-context/` — a portable Codex skill that loads this context selectively.

## Use it locally

```bash
npm run validate
node bin/ajay-ai.mjs list
node bin/ajay-ai.mjs search "geo repair"
```

To use the skill in Codex, copy or symlink `skills/ajay-personal-context` into the local skills directory.

## Public-release boundary

This repository and npm package are public. Only add context that is safe to share publicly. `privacy` frontmatter records an intended handling level for downstream tools; it does not make a published file private. Keep sensitive context in an unpublished local repository.

## Adding a memory

Create a Markdown file under `memories/` with this frontmatter:

```yaml
---
type: preference
title: Short, descriptive title
updated: 2026-09-01
confidence: high
privacy: private
sources:
  - direct user instruction, 2026-09-01
---
```

Write only observations that are supported by the listed source. Use `confidence: medium` or `low` when the record contains an inference or an older snapshot. `privacy: restricted` is for context that must never be sent to an external destination without explicit permission.

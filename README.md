# Ajay Personal AI

A local-first, versioned source of personal context for AI tools and agents. It is deliberately useful without an API key, a vector database, or a hosted service.

## What is here

- `identity.md` — stable context about Ajay.
- `preferences.md` — working and collaboration preferences.
- `writing-style.md` — communication guidance.
- `memories/` — dated, sourced records with confidence and privacy metadata.
- `skills/ajay-personal-context/` — a portable Codex skill that loads this context selectively.

## Use it locally

```bash
npm run validate
node bin/ajay-ai.mjs list
node bin/ajay-ai.mjs search "creator workflow"
```

To use the skill in Codex, copy or symlink `skills/ajay-personal-context` into the local skills directory. Keep this repository private unless every included memory is safe to share.

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


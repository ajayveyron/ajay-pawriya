---
name: ajay-personal-context
description: Load Ajay Pawriya's maintained personal context, work preferences, and relevant memories when a request benefits from personalized continuity. Do not use it to replace current verification or to make unsupported personal claims.
metadata:
  short-description: Use Ajay's personal context
---

# Ajay Personal Context

Use this skill when a request benefits from Ajay's established preferences, active workflows, project conventions, or prior context.

## Load context selectively

1. Read `identity.md` for stable baseline context.
2. Read `preferences.md` and `writing-style.md` when the task involves collaboration or communication.
3. Search `memories/` with `node bin/ajay-ai.mjs search "<topic>"`, then read only the relevant records.

Treat `confidence` and `sources` as part of the content. A record can inform an answer but does not prove that a time-sensitive fact remains current; verify current state when it matters.

## Boundaries

- Do not invent a view, memory, or preference that is not recorded.
- Do not copy `private` or `restricted` context into an external service, public artifact, or message without Ajay's explicit permission.
- Do not store credentials, secrets, medical details, or raw private conversations in this repository.
- Update a memory only when Ajay explicitly asks. Record the source, date, confidence, and privacy classification.

Prefer a small, relevant context set over loading the entire repository.


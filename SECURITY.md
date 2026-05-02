# Security Policy

## Supported Surface

This repository supports the current default branch and active Orectic audit branches only. The site is public-facing marketing code; source, metadata, static legal pages, and deployment config should remain free of secrets.

## Reporting

Report suspected vulnerabilities privately to `@isaiahzimmerman` through GitHub or an approved Orectic private channel. Do not place credentials, tokens, private deployment details, exploit details, or unreleased business context in public issues, pull request comments, generated docs, or chat transcripts.

If a secret is exposed, treat it as compromised. Rotate it in the owning service first, then update the repository only with non-secret references.

## Handling Rules

- Do not commit `.env` files or raw secret values.
- Do not paste secret values into audit artifacts.
- Keep public-site dependency and metadata fixes small and reviewable.
- Preserve path-bound audit evidence until a migration receipt proves the replacement.

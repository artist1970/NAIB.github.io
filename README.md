# NAIB Private Studio

Private/local-first working studio for NAIB.

## Canonical architecture

- Public NAIB front: `artist1970/NAIB.github.io`
- Private governing CORE: `artist1970/CORE/NAIBCore`
- Internal governance/runtime: `artist1970/noema-ai.github.io`

## Important security distinction

A **private GitHub repository is not automatically a secure application backend**.

If this Studio is opened as browser-delivered HTML, users with access can inspect its source. Therefore this package intentionally contains:

- no credentials
- no API tokens
- no MFA secrets
- no private keys
- no signing secrets
- no raw private CORE content

The Studio stores voluntary working notes locally in the browser and can export them as JSON.

## Purpose

The Studio is for:

- continuity and migration checks
- public/private contract review
- specialist relationship visibility
- local working context
- audit notes
- future protected-service integration

It is not NAIB's public identity and it does not replace the Noema internal runtime.

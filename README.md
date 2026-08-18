# NAIB Public Front — Compatibility Bridge

This repository is the canonical **public front door** for NAIB.

## Current migration state

`NAIB.github.io` presents the public entry point while the existing working NAIB runtime remains hosted inside `artist1970/noema-ai.github.io`.

This avoids copying or breaking Noema/NAIB dependencies during migration.

## Canonical relationships

- Public front: `artist1970/NAIB.github.io`
- Private identity/governance CORE: `artist1970/CORE/NAIBCore`
- Current runtime bridge: `artist1970/noema-ai.github.io`

## Private CORE rule

The public site records the canonical CORE reference but **must never fetch the private CORE directly from browser JavaScript**.

The CORE governs identity and policy through protected architecture. It is not a public data API.

## Migration rule

Do not delete or relocate the existing Noema-side NAIB runtime until:
1. every dependency is mapped;
2. the replacement public runtime is verified;
3. specialist routing is verified;
4. local memory/enrollment behavior is preserved or deliberately migrated;
5. Noema governance equivalence is confirmed.

**The human remains the final authority.**

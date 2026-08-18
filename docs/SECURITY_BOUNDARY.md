# NAIB Studio Security Boundary

1. The Studio never fetches `artist1970/CORE/NAIBCore` directly from browser JavaScript.
2. CORE content reaches runtime behavior only through separately authorized protected architecture.
3. Credentials and authentication secrets never belong in this repository.
4. Browser localStorage is convenience storage, not a secret vault.
5. High-impact administration remains separately authorized.
6. The Studio cannot elevate its own permissions.
7. NAIB remains the public identity; the internal administrative identity is not presented publicly.
8. Specialist identities remain distinct.
9. The human remains the final authority.

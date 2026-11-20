---
name: Taste Match scope
description: User's intended scope and recommendation principles for Taste Match.
---

Taste Match is a single-page prototype with no login, no styling beyond basic readability, and no persistence beyond the session. The results log is intentionally hidden from normal navigation.

**Why:** The user explicitly requested this scope and asked subsequent behavior changes to leave everything else the same.

**How to apply:** Preserve the existing appearance and session-only nature when changing recommendation or feedback behavior; do not add accounts, durable storage, or additional product surfaces without a request.

Recommendations should prioritize thematic and tonal resonance, deliberately considering films outside obvious genre matches. All three favorites must influence the choice and explanation; the strongest driver must not replace the other two inputs. Unrecognized favorites must not be assigned invented facts.

**Why:** These are the user's explicit matching and input-honesty requirements; the user corrected a regression where recommendations only explained the first book and ignored the second and third favorites.

**How to apply:** Preserve these constraints when revising the recommendation prompt or choosing a different model.

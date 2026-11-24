# Taste Match

Movie recommendations based on your favorite books and songs, built for young "media snobs" who are tired of genre-based suggestions.

- **Working prototype (Replit):** https://taste-match-finder.replit.app
- **Demo video:** see [Demo Video](#demo-video) below

## Demo Video

https://drive.google.com/file/d/1FQ9eqorpBACg0B2VBsRXknz1iLrBdJtS/view?usp=sharing

Shared with the instructors for viewing. The same file is uploaded to Canvas.

## The problem and the bet

Streaming apps recommend from watch history and genre tags, so they ignore the taste signal people care about most. The assumption I am testing: taste in books and music carries over to movies, even across genres. The user is someone around 22-27 who cares a lot about books and music.

## What I changed since the First Working Slice

| Change | Why (peer feedback or test result) |
| --- | --- |
| Previous result is cleared when inputs change or validation fails, and empty fields get an inline message instead of the browser's default bubble | Reviewers 1 and 2 (stale result stayed on screen). See [PEER_FEEDBACK_RESPONSE.md](PEER_FEEDBACK_RESPONSE.md) and Test 4 in [EVALUATION.md](EVALUATION.md) |
| "No, not for me" and "Already seen it" now generate a different film from the same three favorites | Reviewer 2 asked for "Try another," and I found the same dead end in my own testing. See the before/after in [EVALUATION.md](EVALUATION.md) |
| Each result shows a "Strong match" or "Loose match" label, the reason uses all three inputs, and the app says when it doesn't recognize an input | Reviewer 1 (no signal of AI confidence) and my own tests. See [RISK_RESPONSE.md](RISK_RESPONSE.md) |

## Implemented, simulated, and planned

| Piece | Status | Notes |
| --- | --- | --- |
| Three freeform inputs and "Find my movie" flow | Implemented | |
| AI recommendation and reason | Implemented (live) | OpenAI model `gpt-5.6-luna` through Replit's managed AI integration. Not hardcoded or simulated |
| "Strong / Loose match" label and notes for unrecognized inputs | Implemented | The label is the model's own judgment, not a measured score |
| "No" and "Already seen it" generate a new film | Implemented | |
| Check that the recommended film exists in a movie database | Planned (not built) | The app relies on the model alone |
| Reaction log that I can see across users | Planned (not built) | Reactions are stored only in each user's own browser |
| Accounts, saved taste profiles, watchlists, where-to-watch, social features | Planned / out of scope | Deliberately excluded from the prototype |

## How the AI behavior is produced

- **Task:** given three favorites, pick one film and explain the match
- **Input:** three short text strings (books, songs, or artists)
- **Output:** film title, year, genre, a reason that uses all three inputs, a Strong/Loose confidence label, and notes about unfamiliar inputs
- **How:** Live call. The app sends the three favorites to OpenAI through Replit's managed AI integration, using the model `gpt-5.6-luna` as written in the code. The prompt is `MOVIE_PROMPT` in `artifacts/api-server/src/lib/movie-recommendation.ts`, and it is passed to the OpenAI chat completion in `artifacts/api-server/src/routes/taste.ts`. Nothing is hardcoded or simulated in the recommendation itself.
- **Blockers and workarounds:** No blockers. One bug I caught: after my first prompt change, the reasoning used only the first input. I fixed it by requiring the reason to use all three. I also removed a "this looks like a film" warning because many works are both books and films.
- **Reaction buttons:** stored only in the user's browser, so I cannot see other people's answers.

## How to run it

Open the Replit link above and enter three favorites. The app calls OpenAI through Replit's managed integration, so no API key is stored in this repository.
## Repo map

- `README.md` - this file
- `EVALUATION.md` - five test cases, before/after, repeat runs, and what the evidence says
- `PEER_FEEDBACK_RESPONSE.md` - feedback received, what I acted on, adapted, or deferred
- `RISK_RESPONSE.md` - the risk I chose, the design response, and a risk test
- `AI_USE_DISCLOSURE.md` - draft disclosure of how AI tools contributed
- `artifacts/` - prototype code exported from Replit
- `evidence/` - screenshots of the test runs

## Remaining limitations

- The confidence label is the model's own judgment. In the challenge test it said "Strong" even though one link (NCT 127) was a stretch.
- The note about an unrecognized input is small gray text that a user could miss.
- I ran five cases plus repeat runs, which is not enough to say how often the reasons hold up or whether users enjoy the films.
- Reactions are only stored in each browser, so I cannot yet test whether people reject films because of genre or because of taste.
- The app does not check that a film exists in a movie database, so it relies on the model.

## Next priorities

Ranked by their effect on the central task:

1. Store reactions (and the reason for "No") in one place so I can test my genre-versus-taste assumption with real users.
2. Verify each recommended film against a movie database before showing it.
3. Make low-confidence notes more visible and check whether the Strong/Loose label tracks real fit.

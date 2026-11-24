# Taste Match

Movie recommendations based on your favorite books and songs, built for young "media snobs" who are tired of genre-based suggestions.

- **Working prototype (Replit):** https://taste-match-finder.replit.app
- **Demo video (Google Drive):** see [Demo Video](#demo-video) below

## Demo Video

https://drive.google.com/file/d/1FQ9eqorpBACg0B2VBsRXknz1iLrBdJtS/view?usp=sharing

Shared with the instructors for viewing. The same file is uploaded to Canvas.

## The problem and the bet

Streaming apps recommend from watch history and genre tags, so they ignore the taste signal people care about most. The assumption I am testing: taste in books and music carries over to movies, even across genres. The user is someone around 22-27 who cares a lot about books and music.

## Guide to every component

| Component | Where to find it |
| --- | --- |
| Running prototype | https://taste-match-finder.replit.app |
| Current prototype code and assets | [artifacts/](artifacts/) (exported from Replit) |
| Demo video | [Demo Video](#demo-video) |
| Priority improvements | [Priority improvements](#priority-improvements) |
| Response to peer feedback | [PEER_FEEDBACK_RESPONSE.md](PEER_FEEDBACK_RESPONSE.md) |
| Five test cases | [EVALUATION.md, five test cases](EVALUATION.md#five-test-cases) |
| One before-and-after comparison | [EVALUATION.md, before and after](EVALUATION.md#before-and-after-for-one-issue) |
| Repeat runs of the live model | [EVALUATION.md, repeat runs](EVALUATION.md#repeat-runs-live-model) |
| Interpretation of results | [EVALUATION.md, what does the evidence tell me](EVALUATION.md#what-does-the-evidence-tell-me) |
| Risk response | [RISK_RESPONSE.md](RISK_RESPONSE.md) |
| Remaining limitations | [Remaining limitations](#remaining-limitations) |
| Next priorities | [Next priorities](#next-priorities) |
| Draft AI-use disclosure | [AI_USE_DISCLOSURE.md](AI_USE_DISCLOSURE.md) |

## Priority improvements

Changes since the First Working Slice, chosen from peer feedback and my own testing:

| Change | Why (peer feedback or test result) |
| --- | --- |
| Previous result is cleared when inputs change or validation fails, and empty fields get an inline message instead of the browser's default bubble | Reviewers 1 and 2 (stale result stayed on screen). See [PEER_FEEDBACK_RESPONSE.md](PEER_FEEDBACK_RESPONSE.md) and Test 4 in [EVALUATION.md](EVALUATION.md#five-test-cases) |
| "No, not for me" asks why, and "No" and "Already seen it" lead to a "Try another" that generates a different film from the same three favorites | Reviewer 2 asked for "Try another," and I found the same dead end in my own testing. See the [before and after](EVALUATION.md#before-and-after-for-one-issue) |
| Each result shows a "Strong match" or "Loose match" label, the reason uses all three inputs, and the app says when it doesn't recognize an input | Reviewer 1 (no signal of AI confidence) and my own tests. See [RISK_RESPONSE.md](RISK_RESPONSE.md) |

## Implemented, simulated, and planned

| Piece | Status | Notes |
| --- | --- | --- |
| Three freeform inputs and "Find my movie" flow | Implemented | |
| AI recommendation and reason | Implemented (live) | OpenAI model `gpt-5.6-luna` through Replit's managed AI integration. Not hardcoded or simulated |
| "Strong / Loose match" label and notes for unrecognized inputs | Implemented | The label is the model's own judgment, not a measured score |
| "No" asks why; "No" and "Already seen it" lead to a new film | Implemented | |
| Check that the recommended film exists in a movie database | Planned (not built) | The app relies on the model alone |
| Reaction log that I can see across users | Planned (not built) | Reactions are stored only in each user's own browser |
| Accounts, saved taste profiles, watchlists, where-to-watch, social features | Planned / out of scope | Deliberately excluded from the prototype |

Simulated: nothing. Manual (Wizard-of-Oz): nothing. Every recommendation in the tests and the demo is a live model call.

## How the AI behavior is produced

- **Task:** given three favorites, pick one film and explain the match
- **Input:** three short text strings (books, songs, or artists)
- **Output:** film title, year, genre, a reason that uses all three inputs, a Strong/Loose confidence label, and notes about unfamiliar inputs
- **Value for the user:** connecting books and songs to a film means reasoning about theme and mood across different media. That is hard to do with genre filters or watch history, and it gives the user a reason they can judge instead of a bare title.
- **How:** Live call. The app sends the three favorites to OpenAI through Replit's managed AI integration, using the model `gpt-5.6-luna` as written in the code. The prompt is `MOVIE_PROMPT` in `artifacts/api-server/src/lib/movie-recommendation.ts`, and it is passed to the OpenAI chat completion in `artifacts/api-server/src/routes/taste.ts`. Nothing is hardcoded or simulated in the recommendation itself.
- **Blockers and workarounds:** No blockers. One bug I caught: after my first prompt change, the reasoning used only the first input. I fixed it by requiring the reason to use all three. I also removed a "this looks like a film" warning because many works are both books and films.
- **Reaction buttons:** stored only in the user's browser, so I cannot see other people's answers.

## How to run it

Open the Replit link above and enter three favorites. The app calls OpenAI through Replit's managed integration, so no API key is stored in this repository.

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

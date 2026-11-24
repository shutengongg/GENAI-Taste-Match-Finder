# Revision Documentation

## Priority improvements

| Change | Why (peer feedback or test result) |
| --- | --- |
| Previous result is cleared when inputs change or validation fails, and empty fields get an inline message instead of the browser's default bubble | Reviewers 1 and 2: the stale result stayed on screen after a blank submit |
| "No, not for me" asks why, and "No" and "Already seen it" lead to a "Try another" that generates a different film from the same three favorites | Reviewer 2 asked for "Try another," and I found the same dead end in my own testing |
| Each result shows a "Strong match" or "Loose match" label, the reason uses all three inputs, and the app says when it doesn't recognize an input | Reviewer 1: nothing signaled when the AI was less confident |

## Response to peer feedback

Three classmates tried the central flow. They found it easy to use and liked the explanation tied to their inputs. Two pointed out the stale result left on screen after a blank submit, one asked for "Try another" after "No" (a dead end I had also found), one noticed a film accepted in a book-or-song field, and one suggested a saved taste profile, which I deferred. I weighed each item by my user's needs (a 22-27 year old who cares about books and music and distrusts generic picks), whether it sits on the central task, and the time I had. No classmate names are included.

| Feedback or observed issue | Decision | What changed, or why it was deferred |
| --- | --- | --- |
| Reviewers 1 and 2: after a blank submit the previous recommendation stays on screen and could look like the result for the blank input | Acted on | My user is comparing results and needs to trust that what is on screen matches what they typed. It is a small fix on the central task. Empty fields now show an inline "Please enter a favorite." message instead of the browser bubble (Test 4), and the previous result is cleared on a failed submit or when inputs change. |
| Reviewer 2: add "Try another" tied to "No, not for me" and "Already seen it," keeping the favorites and excluding the previous movie. (I found the same dead end: "No" only said "Noted. Thanks.") | Acted on | A user who rejects a film should be able to keep going, and the reason they give (genre or taste) is the evidence for my core assumption. "No" now asks why, and "No" and "Already seen it" lead to a "Try another" that gives a different film from the same three favorites. It was a contained change on the central task. |
| Reviewer 1: nothing signals when the AI is less confident in a match | Acted on | My user distrusts picks that sound too sure, so confidence matters. Each result now shows "Strong match" or "Loose match," and the app says when it doesn't recognize an input (see the risk response). It needed no new infrastructure. |
| Reviewer 2: the app accepted a movie (Good Will Hunting) in a field asking for a book or song without saying anything | Adapted | I tried a "looks like a film" warning, but it misfired because many works are both books and films, and my user's favorites can be both. I replaced it with a note only when an input is unfamiliar or truly ambiguous. It never blocks the submit. |
| Reviewer 2: getting the same movie twice doesn't show how personalized the recommendations are | Adapted | Rather than change the app, I ran the same input three times and compared the picks (see repeat runs). I do not claim the tests show how deeply personalized the model is. |
| Reviewer 3: use the reactions to remember preferences across searches and build a "vibe" profile per user | Deferred | It is a good long-term idea, but my user wants a one-session answer and my scope excludes accounts and stored history. It also raises privacy questions and would blur my test of whether one set of favorites carries across genres. There was not time to do it well. |
| Reviewer 1: reactions only log in the browser, so I never see peers' answers | Deferred | Central logging was not built in the time available. It is the first item in my next priorities, since I need it to test my core assumption. |

## How the AI behavior is produced

| Piece | Status |
| --- | --- |
| AI recommendation and reason | Implemented (live). OpenAI model `gpt-5.6-luna` through Replit's managed AI integration |
| "Strong / Loose match" label and notes for unrecognized inputs | Implemented. The label is the model's own judgment, not a measured score |
| "No" asks why; "No" and "Already seen it" lead to a new film | Implemented |
| Check that the recommended film exists in a movie database | Planned (not built) |
| Reaction log that I can see across users | Planned (not built). Reactions are stored only in each user's browser |

Simulated: nothing. Manual (Wizard-of-Oz): nothing. Every recommendation in the tests and the demo is a live model call.

- **Task:** given three favorites, pick one film and explain the match
- **Input:** three short text strings (books, songs, or artists)
- **Output:** film title, year, genre, a reason that uses all three inputs, a Strong/Loose confidence label, and notes about unfamiliar inputs
- **Value for the user:** connecting books and songs to a film means reasoning about theme and mood across different media, which genre filters or watch history can't do. The user gets a reason they can judge instead of a bare title.
- **How:** the app sends the three favorites to OpenAI through Replit's managed AI integration, using the model `gpt-5.6-luna` as written in the code. The prompt is `MOVIE_PROMPT` in `artifacts/api-server/src/lib/movie-recommendation.ts`, passed to the chat completion in `artifacts/api-server/src/routes/taste.ts`.
- **Blockers:** none. One bug I caught: after my first prompt change, the reasoning used only the first input, so I had it use all three. I also removed a "this looks like a film" warning because many works are both books and films.

These tests show how the prototype behaved on these runs. They do not establish model accuracy or reliability.

## Five test cases

All inputs are sample favorites. Success criteria were written before running each test.

| Case | Input or action | Expected result / success criterion | Actual result | Pass / partial / fail | Implication or next step |
| --- | --- | --- | --- | --- | --- |
| Typical 1 | "The Secret History", "Phoebe Bridgers", "Haruki Murakami" | A real film, a reason that uses all three inputs, and a confidence label | *Picnic at Hanging Rock* (1975), "Strong match." The reason uses all three: cloistered intellectual world and suppressed menace (The Secret History), mournful unease (Phoebe Bridgers), dreamlike ambiguity (Murakami). | Pass | Plausible and specific. Whether a user would actually watch it is untested. |
| Typical 2 | "Normal People", "Frank Ocean", "Ottessa Moshfegh" | Same as Typical 1, and a different film | *Aftersun* (2022), "Strong match." The reason uses all three: intimacy and class-conscious ache, submerged melancholy, private alienation. | Pass | Different film from Typical 1, so it responds to the inputs. |
| Challenge | "Frankenstein" (a title that is both a book and a film), "All Too Well", "NCT 127" | Accepts the title with no wrong-type warning, uses all three inputs, only notes true ambiguity | *Blade Runner 2049* (2017), "Strong match." No warning on Frankenstein. All three inputs are used. The NCT 127 link ("futuristic, genre-blending urban intensity" and neon-noir) is a stretch but still labeled Strong. | Pass | The type warning problem is fixed. The "Strong" label may be overconfident when one link is thin, so the label is a cue, not a measure. |
| Invalid or empty | "Frankenstein" in the first field, other two fields empty, submit | Inline messages, no recommendation, no old result left on screen | Red outlines and "Please enter a favorite." under each empty field. With a result on screen, clearing a field made the old result disappear (checked by hand). | Pass | Replaces the browser's default bubble from the earlier version. |
| Risk | "The Glass Orchard of Mervane" (made up), "Bruno Mars", "Taylor Swift" | Says it doesn't recognize the made-up title, invents no details, shows "Loose match" | *The Truman Show* (1998), "Loose match." Note: "I cannot confidently identify The Glass Orchard of Mervane as a specific book." No invented details. The reason uses only Bruno Mars and Taylor Swift. | Pass | Works as intended. The note is small gray text under the result, so it could be missed. The reasoning for the two real inputs is fairly generic. |

## Before and after for one issue

Issue: clicking "No, not for me" was a dead end.

| | Before the revision | After the revision |
| --- | --- | --- |
| Same input or action | Typical 1 ("The Secret History", "Phoebe Bridgers", "Haruki Murakami"), then click "No, not for me" | Same |
| What happened | The app returned *The Virgin Suicides* (1999). Clicking "No" showed only "Noted. Thanks for telling us." No reason asked, no new film. | Clicking "No, not for me" asks "Why not?" with three options (I don't watch this kind of movie / It doesn't match my taste / Something else). After I picked "It doesn't match my taste," the app showed "Noted. Thanks for telling us." and a "Try another" button. "Try another" returned a different film, *The Talented Mr. Ripley* (1999), "Strong match," with a reason that uses all three inputs. "Already seen it" also regenerates a film (checked by hand). |
| Did the revision help? | | Yes. "No" now asks why and leads to a new film, so the user can keep going instead of dead-ending, and the reason (genre vs taste) is captured for my assumption test. Limitation: the reason is only stored in the browser, so I can't yet see other people's answers. |

## Repeat runs (live model)

Same input three times: Typical 1 ("The Secret History", "Phoebe Bridgers", "Haruki Murakami")

| Run | Film | Confidence | Used all three inputs? |
| --- | --- | --- | --- |
| 1 | *Picnic at Hanging Rock* (1975) | Strong | Yes |
| 2 | *Burning* (2018) | Strong | Yes |
| 3 | *The Virgin Suicides* (1999) | Strong | Yes |

Does the variation matter? Three runs of the same input gave three different films, all labeled "Strong match" and all using all three inputs. The picks share the same dark, dreamlike mood, so the variation seems acceptable for a "one good pick" product. But a user who reruns would see different answers, and a "Strong" label does not mean there is one right film. It also supports Reviewer 2's point: one result does not show how personalized the recommendations are.

## What does the evidence tell me?

The flow works on all five cases and three repeat runs: each gave a real film, a reason using all three inputs, and an honest note about the made-up book. Repeats of one input gave three different films that fit the same mood. What remains unreliable: the "Strong match" label is the model's own judgment and said "Strong" when one link (NCT 127) was a stretch, and I only tested a handful of inputs. I have not yet tested my core assumption, whether people accept a cross-genre film, because reactions only log in each browser. The results support a modest claim: for these inputs the prototype gives readable, plausible recommendations, not that users would enjoy them. Next I would collect reactions in one place and check whether "No" answers are about genre or taste.

## Risk response

**Risk chosen:** over-reliance on a confident-sounding AI answer. The model may not know an input and still write a smooth, confident reason.

Users who treat the recommendation as a reflection of their taste could be affected. If the model doesn't know an input and still sounds sure, they may waste an evening or decide the product doesn't understand them. I changed the result to show a "Strong" or "Loose" match label, say when an input isn't recognized, and let the user reject a film and get another. What remains: the label is the model's own judgment (it said "Strong" when one link was a stretch), and the app doesn't check that the film is real, so a wrong match is still possible. This connects to over-reliance on AI: the reasons stay visible so users can check them against their own inputs.

**Risk test:** the Risk test case above (made-up book). Result: Pass. The safeguards are implemented in the live app, none are simulated.

## Remaining limitations

- The confidence label is the model's own judgment. In the challenge test it said "Strong" even though one link (NCT 127) was a stretch.
- The note about an unrecognized input is small gray text that a user could miss.
- I ran five cases plus repeat runs, which is not enough to say how often the reasons hold up or whether users enjoy the films.
- Reactions are only stored in each browser, so I cannot yet test whether people reject films because of genre or because of taste.
- The app does not check that a film exists in a movie database, so it relies on the model.

## Next priorities

1. Store reactions (and the reason for "No") in one place so I can test my genre-versus-taste assumption with real users.
2. Verify each recommended film against a movie database before showing it.
3. Make low-confidence notes more visible and check whether the Strong/Loose label tracks real fit.

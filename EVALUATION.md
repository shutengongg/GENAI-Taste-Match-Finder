# Evaluation

All inputs below are sample or made-up favorites. No personal information.

## How the AI behavior is produced

The recommendation is a live model call, not a simulation. The app sends the user's three favorites to OpenAI through Replit's managed AI integration, using the model `gpt-5.6-luna` as written in the code. The prompt (`MOVIE_PROMPT`) lives in `artifacts/api-server/src/lib/movie-recommendation.ts` and is passed to the chat completion in `artifacts/api-server/src/routes/taste.ts`. The model returns the film, reason, and confidence label, and the interface displays them. I hit no implementation blockers. Two bugs came up during the revision (the reason using only the first input, and a wrong book-versus-film warning), and both were fixed.

These tests show how the prototype behaved on these runs. They do not establish model accuracy or reliability.

## Five test cases

Success criteria were written before running each test.

| Case | Input or action | Expected result / success criterion | Actual result | Pass / partial / fail | Implication or next step |
| --- | --- | --- | --- | --- | --- |
| Typical 1 | "The Secret History", "Phoebe Bridgers", "Haruki Murakami" | A real film, a reason that uses all three inputs, and a confidence label | *Picnic at Hanging Rock* (1975), "Strong match." The reason uses all three: cloistered intellectual world and suppressed menace (The Secret History), mournful unease (Phoebe Bridgers), dreamlike ambiguity (Murakami). | Pass | Plausible and specific. Whether a user would actually watch it is untested. |
| Typical 2 | "Normal People", "Frank Ocean", "Ottessa Moshfegh" | Same as Typical 1, and a different film | *Aftersun* (2022), "Strong match." The reason uses all three: intimacy and class-conscious ache, submerged melancholy, private alienation. | Pass | Different film from Typical 1, so it responds to the inputs. |
| Challenge | "Frankenstein" (a title that is both a book and a film), "All Too Well", "NCT 127" | Accepts the title with no wrong-type warning, uses all three inputs, only notes true ambiguity | *Blade Runner 2049* (2017), "Strong match." No warning on Frankenstein. All three inputs are used. The NCT 127 link ("futuristic, genre-blending urban intensity" and neon-noir) is a stretch but still labeled Strong. | Pass | The type warning problem is fixed. The "Strong" label may be overconfident when one link is thin, so the label is a cue, not a measure. |
| Invalid or empty | "Frankenstein" in the first field, other two fields empty, submit | Inline messages, no recommendation, no old result left on screen | Red outlines and "Please enter a favorite." under each empty field. With a result on screen, clearing a field made the old result disappear (checked by hand). | Pass | Replaces the browser's default bubble from the earlier version. |
| Risk | "The Glass Orchard of Mervane" (made up), "Bruno Mars", "Taylor Swift" | Says it doesn't recognize the made-up title, invents no details about it, shows "Loose match" | *The Truman Show* (1998), "Loose match." Note: "I cannot confidently identify The Glass Orchard of Mervane as a specific book." No invented details. The reason uses only Bruno Mars and Taylor Swift. | Pass | Works as intended. The note is small gray text under the result, so it could be missed. The reasoning for the two real inputs is fairly generic. |

## Before and after for one issue

Issue: clicking "No, not for me" was a dead end.

| | Before the revision | After the revision |
| --- | --- | --- |
| Same input or action | Typical 1 ("The Secret History", "Phoebe Bridgers", "Haruki Murakami"), then click "No, not for me" | Same |
| What happened | The app returned *The Virgin Suicides* (1999). Clicking "No" showed only "Noted. Thanks for telling us." No reason asked, no new film. | Clicking "No, not for me" asks "Why not?" with three options (I don't watch this kind of movie / It doesn't match my taste / Something else). After I picked "It doesn't match my taste," the app showed "Noted. Thanks for telling us." and a "Try another" button. "Try another" returned a different film, *The Talented Mr. Ripley* (1999), "Strong match," with a reason that uses all three inputs. "Already seen it" also regenerates a film (checked by hand). |
| Did the revision help? | | Yes. "No" now asks why and leads to a new film, so the user can keep going instead of dead-ending, and the reason (genre vs taste) is captured for my assumption test. Limitation: the reason is only stored in the browser, so I can't yet see other people's answers. |

Also fixed: after the first revision the reasoning used only my first input. It now uses all three in every test above. I do not have a saved "before" run for that.

## Repeat runs (live model)

Same input three times: Typical 1 ("The Secret History", "Phoebe Bridgers", "Haruki Murakami")

| Run | Film | Confidence | Used all three inputs? |
| --- | --- | --- | --- |
| 1 | *Picnic at Hanging Rock* (1975) (from the Typical 1 test) | Strong | Yes |
| 2 | *Burning* (2018) | Strong | Yes |
| 3 | *The Virgin Suicides* (1999) | Strong | Yes |

Does the variation matter? Three runs of the same input gave three different films (*Picnic at Hanging Rock*, *Burning*, *The Virgin Suicides*), all labeled "Strong match" and all using all three inputs. The picks share the same dark, dreamlike mood, so the variation seems acceptable for a "one good pick" product. But a user who reruns would see different answers, and a "Strong" label does not mean there is one right film. It also supports Reviewer 2's point: one result does not show how personalized the recommendations are. (The original app also returned *The Virgin Suicides* for this input.)

## What does the evidence tell me?

The central flow works on all five cases and on three repeat runs: the app returns a real film each time, the reason uses all three inputs, and it flags the unrecognized book instead of making up details. Three repeat runs of one input gave three different films that all fit the same mood. The reason tied to each input is specific enough for a user to judge, and "Try another" now makes feedback useful. What remains unreliable or untested: the "Strong match" label is the model's own judgment and gave "Strong" even when one link (NCT 127) was a stretch; the explanation for the two real inputs in the made-up-title case was fairly generic; and I have only run a handful of inputs, so I can't say how often the reasons would hold up. I also have not yet collected evidence on my core assumption, whether people accept a cross-genre film when the reasoning is good, because reactions only log in each browser and I haven't seen reasons for "No." The results support a modest claim: for these inputs the prototype gives readable, plausible recommendations. They do not show that users would enjoy the films. Next I would give the app to a few target users, collect their reactions centrally, and check whether "No" answers are mostly about genre or about taste.

Five tests are early evidence, not proof the product is ready for real-world use.

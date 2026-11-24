# Peer Feedback Response

No classmate names in this file (public repo). Reviewers are "Reviewer 1," "Reviewer 2," and "Reviewer 3." All three tested the version before my revision.

## Summary

Three classmates tried the central flow. They found it easy to use and liked that the explanation connects to their inputs. Two of them pointed out the stale result left on screen after a blank submit, and one asked for "Try another" after "No," which matched a dead end I had already seen in my own testing. Reviewer 2 also noticed the app accepted a film in a book-or-song field without saying anything. Reviewer 3 suggested saving past searches into a taste profile, which I deferred because it is outside the first version's scope. I acted on the items that sit on the central task and fit in the time I had.

Note: Reviewer 1's last recommendation was cut off in the copy I received.

## What each reviewer tried

- **Reviewer 1:** "grapes of wrath", "ariana grande", "one last time by ariana grande" gave *Minari*. Also tested a blank submit.
- **Reviewer 2:** The Alchemist + Jack Johnson + Good Will Hunting, then swapped the film for "End of Beginning" by Djo. Both gave *The Secret Life of Walter Mitty (2013)* with different explanations. Also tried the feedback buttons and a blank submit.
- **Reviewer 3:** Several inputs, including Frankenstein + Don Toliver + A Tale of Two Cities, and was happy with the result.

## Feedback and what I did

| Feedback or observed issue | Decision | What changed, or why deferred |
| --- | --- | --- |
| Reviewers 1 and 2: after a blank submit the previous recommendation stays on screen and could look like the result for the blank input | Acted on | Empty fields now show an inline "Please enter a favorite." message instead of the browser bubble (Test 4), and the previous result is cleared on a failed submit or when inputs change. |
| Reviewer 2: add "Try another" tied to "No, not for me" and "Already seen it," keeping the favorites and excluding the previous movie. (I found the same dead end: "No" only said "Noted. Thanks.") | Acted on | "No, not for me" and "Already seen it" now generate a different film from the same three favorites. |
| Reviewer 1: nothing signals when the AI is less confident in a match | Acted on | Each result now shows "Strong match" or "Loose match," and the app says when it doesn't recognize an input (risk test in RISK_RESPONSE.md). |
| Reviewer 2: the app accepted a movie (Good Will Hunting) in a field asking for a book or song without saying anything | Adapted | I tried a "looks like a film" warning, but it misfired because many works are both books and films. I replaced it with a note only when an input is unfamiliar or truly ambiguous. It never blocks the submit. |
| Reviewer 2: getting the same movie twice doesn't show how personalized the recommendations are | Acted on (as evidence, not a code change) | I ran the same input three times and compared the picks (EVALUATION.md). I do not claim the tests show how deeply personalized the model is. |
| Reviewer 3: use the reactions to remember preferences across searches and build a "vibe" profile per user | Deferred | It needs accounts or stored history, which I excluded from the first version. It also raises privacy questions and would blur my test of whether one set of favorites carries across genres. Kept as a long-term idea. |
| Reviewers 1-3: easy to use, the reason tied to the inputs is the most useful part, mood-based matching gave less obvious picks, and the README makes clear what is live and what only logs in the browser | Kept (strengths) | The reason now uses all three inputs. I did not add a stronger cross-genre push, since reviewers were already getting unexpected picks. |
| Reviewer 1: reactions only log in the browser, so I never see peers' answers | Deferred | Central logging was not built in the time available. It is the first item in my next priorities, since I need it to test my core assumption. |

Original feedback is saved in the `evidence/` folder.

## Patterns

- Every reviewer found the flow easy and the explanation useful, so the core idea is working.
- The problems cluster around what happens after the first result: a stale result left on screen, a dead end after "No" or "Already seen it," and no signal about confidence.
- Mixed happiness with results (Reviewer 3: "more happy with certain results than others") is a reminder that I have no measure of match quality yet, only opinions.
- The tension in the feedback is Reviewer 3's profile idea versus my scope: personalization over time conflicts with the single-session, one-user test I am running.

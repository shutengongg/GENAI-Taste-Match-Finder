# Peer Feedback Response

No classmate names in this file (public repo). Reviewers are "Reviewer 1," "Reviewer 2," and "Reviewer 3." All three tested the version before my revision.

## Summary

Three classmates tried the central flow. They found it easy to use and liked that the explanation connects to their inputs. Two of them pointed out the stale result left on screen after a blank submit, and one asked for "Try another" after "No," which matched a dead end I had already seen in my own testing. Reviewer 2 also noticed the app accepted a film in a book-or-song field without saying anything. Reviewer 3 suggested saving past searches into a taste profile.

I decided by asking three things: does it help my user (a 22-27 year old who cares about books and music and distrusts generic picks), does it sit on the central task, and does it fit the scope and time I had. I acted on the items that met all three and deferred the one that needed accounts and stored history.

Note: Reviewer 1's last recommendation was cut off in the copy I received.

## What each reviewer tried

- **Reviewer 1:** "grapes of wrath", "ariana grande", "one last time by ariana grande" gave *Minari*. Also tested a blank submit.
- **Reviewer 2:** The Alchemist + Jack Johnson + Good Will Hunting, then swapped the film for "End of Beginning" by Djo. Both gave *The Secret Life of Walter Mitty (2013)* with different explanations. Also tried the feedback buttons and a blank submit.
- **Reviewer 3:** Several inputs, including Frankenstein + Don Toliver + A Tale of Two Cities, and was happy with the result.

## Feedback and what I did

| Feedback or observed issue | Decision | What changed, or why it was deferred |
| --- | --- | --- |
| Reviewers 1 and 2: after a blank submit the previous recommendation stays on screen and could look like the result for the blank input | Acted on | My user is comparing results and needs to trust that what is on screen matches what they typed. It is a small fix on the central task. Empty fields now show an inline "Please enter a favorite." message instead of the browser bubble (Test 4), and the previous result is cleared on a failed submit or when inputs change. |
| Reviewer 2: add "Try another" tied to "No, not for me" and "Already seen it," keeping the favorites and excluding the previous movie. (I found the same dead end: "No" only said "Noted. Thanks.") | Acted on | A user who rejects a film should be able to keep going, and the reason they give (genre or taste) is the evidence for my core assumption. "No" now asks why, and "No" and "Already seen it" lead to a "Try another" that gives a different film from the same three favorites. It was a contained change on the central task. |
| Reviewer 1: nothing signals when the AI is less confident in a match | Acted on | My user distrusts picks that sound too sure, so confidence matters. Each result now shows "Strong match" or "Loose match," and the app says when it doesn't recognize an input (risk test in RISK_RESPONSE.md). It needed no new infrastructure. |
| Reviewer 2: the app accepted a movie (Good Will Hunting) in a field asking for a book or song without saying anything | Adapted | I tried a "looks like a film" warning, but it misfired because many works are both books and films, and my user's favorites can be both. I replaced it with a note only when an input is unfamiliar or truly ambiguous. It never blocks the submit. |
| Reviewer 2: getting the same movie twice doesn't show how personalized the recommendations are | Adapted | Rather than change the app, I ran the same input three times and compared the picks (EVALUATION.md). I do not claim the tests show how deeply personalized the model is. |
| Reviewer 3: use the reactions to remember preferences across searches and build a "vibe" profile per user | Deferred | It is a good long-term idea, but my user wants a one-session answer and my scope excludes accounts and stored history. It also raises privacy questions and would blur my test of whether one set of favorites carries across genres. There was not time to do it well. |
| Reviewer 1: reactions only log in the browser, so I never see peers' answers | Deferred | Central logging was not built in the time available. It is the first item in my next priorities, since I need it to test my core assumption. |

## What reviewers said worked (no change needed)

- Reviewers 1 and 2: the explanation tied to the inputs is the most useful part, and it responded to changes in the inputs.
- Reviewer 1: matching on mood gave a less obvious pick than expected, so I did not add a stronger cross-genre push.
- Reviewers 1, 2, and 3: the flow was easy to use, and it was clear what is live AI and what only logs in the browser.

## Patterns

- Every reviewer found the flow easy and the explanation useful, so the core idea is working.
- The problems cluster around what happens after the first result: a stale result left on screen, a dead end after "No" or "Already seen it," and no signal about confidence.
- Mixed happiness with results (Reviewer 3: "more happy with certain results than others") is a reminder that I have no measure of match quality yet, only opinions.
- The tension in the feedback is Reviewer 3's profile idea versus my scope: personalization over time conflicts with the single-session, one-user test I am running.

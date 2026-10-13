# Taste Match

Taste Match recommends one movie based on the books and music you love, choosing for mood and theme rather than genre.

## What the First Working Slice Does

A user enters three things they love (a book, a song or artist, and one more book or song) and clicks **Find my movie**. The app sends these to an AI model, which picks one movie that matches the *feeling* of those favorites, often outside the obvious genre. The user sees the movie title, year, and a one-sentence explanation of why it was chosen. They can then react with **Yes, I'd watch this**, **No, not for me**, or **Already seen it**.

## How to Open the Prototype

**Live prototype:** [PASTE YOUR REPLIT LINK HERE]

Open the link, fill in all three boxes, and click **Find my movie**.

## AI Behavior: Working or Simulated?

- **Working:** The movie recommendation and explanation are generated live by an AI language model based on the user's three inputs.
- **Simulated / limited:** User feedback (Yes / No / Already seen) is only logged temporarily in the browser. It is not stored or used to improve future recommendations yet.
- **Future AI goal:** Learn from each user's feedback over time to make more personal recommendations across books, music, and film.

No API keys or passwords are stored in this repository.

## Test Results

| Test | Input or action | What happened | Pass, partial, or fail |
| --- | --- | --- | --- |
| Typical case | *The Night Circus*, Lana Del Rey, *Pride and Prejudice* | Recommended *The Shape of Water* (2017) with an explanation connecting all three inputs through romance, enchantment, and forbidden desire. | Pass |
| Challenge case | *Dune*, Taylor Swift, *Goodnight Moon* (a mismatched mix) | Recommended *Spirited Away* (2001) and explained how it connects Dune's world-building, Taylor Swift's storytelling, and Goodnight Moon's cozy dreaminess. | Pass |
| Invalid or empty case | Clicked **Find my movie** with all boxes empty | The browser showed "Please fill out this field" and did not submit. However, the previous recommendation stayed on screen. | Pass |

## Known Limitations

1. **Feedback isn't saved or used.** The Yes / No / Already seen buttons only log to the browser session, so nothing is kept after the page closes and the AI doesn't learn from it yet.
2. **Old results stay visible.** When a user submits an empty form, the previous recommendation is still shown, which could be confusing. Next step: clear the result when the form changes or fails validation.
3. **Only one recommendation, no retry.** If the user doesn't like the pick, there's no "try another" option yet, so they have to change their inputs to get something new.

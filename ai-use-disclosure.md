# Draft AI-Use Disclosure

I used Claude to help me write the prompts I gave Replit, but I tested the results myself and made some of my own changes.

## Tools used

- **Claude:** helped me plan the prototype, write the prompts I gave Replit, and draft the documents in this repo, which I then edited.
- **Replit:** built and revised the app from my prompts.
- **OpenAI model `gpt-5.6-luna` through Replit's managed AI integration:** the AI inside the product.

## Development assistance

- **Planning and writing:** Claude helped narrow my idea to one user, one action, and three features, and helped draft the documents.
- **Code:** Replit wrote and revised the app, including the inline messages, "Try another," and the confidence label.
- **Testing:** I ran the tests on the live app and told Replit about the bugs I found.

## Representative prompts

1. **To Claude:** "i am testing this venture idea: movie reccomendation app based on your fav books & songs ... define a prototype that can test this assumption in 20 minutes."
   - **Produced:** a one-user, one-action, three-feature prototype plan.
   - **What I changed:** I kept the three-feature scope and the exclusion of accounts and genre filters, and narrowed the assumption to "taste carries across genres."
2. **To Replit (revision):** a three-part prompt asking for cleared stale results with inline messages, "Try another" after "No" and "Already seen it," and a confidence label with notes on unfamiliar inputs.
   - **Produced:** all three changes.
   - **What I changed:** after testing, I sent two corrections (prompt 3 and the book-versus-film fix below).
3. **To Replit (correction):** "it doesnt incorporate the 2nd and 3rd choices at all now. the reasoning is only based on the 1st input fix that."
   - **Produced:** a fix so the reason uses all three inputs.
   - **What I changed:** I also told it to remove the warning that treated films as the wrong input type.

## Human judgment

- The AI suggested having the prompt name "the single input that drove the match." After I added it, the reasoning used only my first input, so I had Replit require all three inputs in the reason.
- The AI suggested warning when an input "looks like a film, not a book or song." Many works are both books and films, so I removed it.
- I chose which feedback to act on and which to defer, such as Reviewer 3's taste-profile idea, which didn't fit my scope.

## Verification

I verified the work myself by running five test cases and three repeat runs on the live app and comparing each result with my inputs. That is how I caught the first-input-only bug and the book-versus-film warning. Still needs checking: how the recommendations hold up beyond my small set of inputs, whether the "Strong/Loose" label tracks real fit, and the code Replit wrote.

## AI inside the product

- **Task:** given three favorites, recommend one film and explain the match
- **Inputs:** three short text strings (books, songs, or artists)
- **Outputs:** film title, year, genre, a reason that uses all three inputs, a Strong/Loose confidence label, and notes on unfamiliar inputs
- **Status:** live model call. OpenAI through Replit's managed AI integration, model `gpt-5.6-luna` as written in the code. The prompt is `MOVIE_PROMPT` in `artifacts/api-server/src/lib/movie-recommendation.ts`, used in `artifacts/api-server/src/routes/taste.ts`. Nothing is simulated.

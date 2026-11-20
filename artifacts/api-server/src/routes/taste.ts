import { Router, type IRouter } from "express";
import OpenAI from "openai";
import { RecommendMovieBody } from "@workspace/api-zod";
import { MOVIE_MODEL, MOVIE_PROMPT, validateMovie } from "../lib/movie-recommendation";

const router: IRouter = Router();

router.post("/taste/recommend", async (req, res) => {
  const parsed = RecommendMovieBody.safeParse(req.body);
  if (!parsed.success || !parsed.data.book.trim() || !parsed.data.music.trim() || !parsed.data.third.trim()) {
    res.status(400).json({ error: "Please enter all three favorites (up to 300 characters each)." });
    return;
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    });
    const { book, music, third, excluded_titles = [], excluded_genres = [] } = parsed.data;
    const response = await client.chat.completions.create({
      model: MOVIE_MODEL,
      max_completion_tokens: 8192,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: MOVIE_PROMPT,
        },
        {
          role: "user",
          content: JSON.stringify({ favorites: { book, music, third }, excluded_titles, excluded_genres }),
        },
      ],
    });
    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("Empty recommendation");
    const recommendation = validateMovie(JSON.parse(content), { book, music, third }, excluded_titles, excluded_genres);
    res.json(recommendation);
  } catch (error) {
    req.log.error({ err: error }, "Movie recommendation failed");
    res.status(502).json({ error: "Couldn't find a movie right now. Please try again." });
  }
});

export default router;
import { useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRecommendMovie } from '@workspace/api-client-react';
import { ErrorBoundary } from '@/components/error-boundary';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const STORAGE_KEY = 'taste-match-session-results';

type Feedback = "Yes, I'd watch this" | 'No, not for me' | 'Already seen it';
type Recommendation = {
  title: string;
  year: number;
  one_sentence_rationale: string;
};
type SessionEntry = {
  id: string;
  book: string;
  music: string;
  third: string;
  recommendation: Recommendation;
  feedback: Feedback | null;
};

const feedbackOptions: Feedback[] = [
  "Yes, I'd watch this",
  'No, not for me',
  'Already seen it',
];

function readLog(): SessionEntry[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed as SessionEntry[] : [];
  } catch {
    return [];
  }
}

function saveLog(entries: SessionEntry[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Recommendation and feedback still work if browser storage is unavailable.
  }
}

function Home() {
  const recommendMovie = useRecommendMovie();
  const [book, setBook] = useState('');
  const [music, setMusic] = useState('');
  const [third, setThird] = useState('');
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (recommendMovie.isPending) return;

    const data = { book: book.trim(), music: music.trim(), third: third.trim() };
    if (!data.book || !data.music || !data.third) {
      setError('Please fill in all three favorites before finding your movie.');
      return;
    }

    setError('');
    setRecommendation(null);
    setActiveId(null);
    setFeedback(null);

    try {
      const movie = await recommendMovie.mutateAsync({ data });
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const entry: SessionEntry = {
        id,
        ...data,
        recommendation: movie,
        feedback: null,
      };
      saveLog([...readLog(), entry]);
      setActiveId(id);
      setRecommendation(movie);
    } catch (cause) {
      setError(cause instanceof Error && cause.message
        ? `We couldn't find your movie. ${cause.message}`
        : "We couldn't find your movie right now. Please try again.");
    }
  }

  function handleFeedback(value: Feedback) {
    if (!activeId) return;
    setFeedback(value);
    saveLog(readLog().map(entry => entry.id === activeId ? { ...entry, feedback: value } : entry));
  }

  return (
    <main className="page-shell min-h-[100dvh]">
      <header className="masthead">
        <span className="brand">Taste Match</span>
        <span className="edition">A little film finder</span>
      </header>

      <section className="intro" aria-labelledby="page-title">
        <span className="eyebrow">For your next movie night</span>
        <h1 id="page-title">Good taste travels <em>between stories.</em></h1>
        <p>Tell us three things that stayed with you. We’ll find one film that might do the same.</p>
      </section>

      <section className="form-panel" aria-labelledby="form-title">
        <div className="section-heading">
          <h2 id="form-title">Three things you love</h2>
          <span>No genres required.</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="fields">
            <div className="field">
              <label htmlFor="book">A book you loved</label>
              <input id="book" data-testid="input-book" type="text" required maxLength={300} value={book} onChange={event => setBook(event.target.value)} placeholder="A title that stayed with you" />
            </div>
            <div className="field">
              <label htmlFor="music">A song/artist you love</label>
              <input id="music" data-testid="input-music" type="text" required maxLength={300} value={music} onChange={event => setMusic(event.target.value)} placeholder="A song or an artist" />
            </div>
            <div className="field">
              <label htmlFor="third">Another book or song you love</label>
              <input id="third" data-testid="input-third" type="text" required maxLength={300} value={third} onChange={event => setThird(event.target.value)} placeholder="One more favorite" />
            </div>
          </div>
          <div className="submit-row">
            <button className="primary-button" data-testid="button-find-movie" type="submit" disabled={recommendMovie.isPending}>
              {recommendMovie.isPending ? 'Finding your movie…' : 'Find my movie'}
            </button>
            <span className="helper">One recommendation, chosen for you.</span>
          </div>
        </form>
        {error && <p className="error-message" role="alert" data-testid="status-error">{error}</p>}
      </section>

      {recommendMovie.isPending && (
        <section className="loading-card" role="status" aria-label="Finding your movie" data-testid="status-loading">
          <p>Looking for the connection…</p>
          <div className="skeleton short" />
          <div className="skeleton" />
          <div className="skeleton medium" />
        </section>
      )}

      {recommendation && !recommendMovie.isPending && (
        <section className="recommendation" aria-labelledby="recommendation-title" data-testid="section-recommendation">
          <p className="eyebrow">Your film</p>
          <h2 className="movie-title" id="recommendation-title" data-testid="text-movie-title">
            {recommendation.title} <span className="movie-year" data-testid="text-movie-year">({recommendation.year})</span>
          </h2>
          <p className="rationale" data-testid="text-movie-rationale">{recommendation.one_sentence_rationale}</p>
          <p className="feedback-label">Does it feel right?</p>
          <div className="feedback-options" role="group" aria-label="Your response to this recommendation">
            {feedbackOptions.map(option => (
              <button
                key={option}
                type="button"
                className={`feedback-button${feedback === option ? ' selected' : ''}`}
                aria-pressed={feedback === option}
                data-testid={`button-feedback-${option === "Yes, I'd watch this" ? 'yes' : option === 'No, not for me' ? 'no' : 'seen'}`}
                onClick={() => handleFeedback(option)}
              >
                {option}
              </button>
            ))}
          </div>
          {feedback && <p className="feedback-note" role="status" data-testid="status-feedback">Noted. Thanks for telling us.</p>}
        </section>
      )}
      <footer className="footer">A film for the way you feel.</footer>
    </main>
  );
}

function Results() {
  const entries = readLog();
  return (
    <main className="results-shell min-h-[100dvh]">
      <header className="masthead">
        <span className="brand">Taste Match</span>
        <span className="edition">Session record</span>
      </header>
      <h1>Results</h1>
      <p className="description">Recommendations from this browser tab only. This record clears when the session ends.</p>
      {entries.length === 0 ? (
        <div className="empty-state" data-testid="status-empty-results">
          <h2>Nothing on the record yet.</h2>
          <p>Successful recommendations will appear here.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="results-table" data-testid="table-results">
            <thead>
              <tr>
                <th scope="col">A book you loved</th>
                <th scope="col">A song/artist you love</th>
                <th scope="col">Another book or song you love</th>
                <th scope="col">Recommendation</th>
                <th scope="col">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => (
                <tr key={entry.id} data-testid={`row-result-${entry.id}`}>
                  <td>{entry.book}</td>
                  <td>{entry.music}</td>
                  <td>{entry.third}</td>
                  <td><strong>{entry.recommendation.title} ({entry.recommendation.year})</strong><br />{entry.recommendation.one_sentence_rationale}</td>
                  <td>{entry.feedback ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/results" component={Results} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
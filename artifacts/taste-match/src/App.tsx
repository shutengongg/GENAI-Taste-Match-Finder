import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { recommendMovie, type MovieRecommendation } from '@workspace/api-client-react';
import { ErrorBoundary } from '@/components/error-boundary';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
import { readLog, saveLog, sessionExclusions, rejectionReasons, type Favorites, type Feedback, type RejectionReason } from '@/lib/taste-session';

const feedbackOptions: Feedback[] = [
  "Yes, I'd watch this",
  'No, not for me',
  'Already seen it',
];

function Home() {
  const [favorites, setFavorites] = useState<Favorites>({ book: '', music: '', third: '' });
  const { book, music, third } = favorites;
  const [recommendation, setRecommendation] = useState<MovieRecommendation | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [reason, setReason] = useState<RejectionReason | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Favorites>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const requestVersion = useRef(0);
  const requestController = useRef<AbortController | null>(null);

  useEffect(() => () => {
    requestVersion.current += 1;
    requestController.current?.abort();
  }, []);

  function clearResult() {
    requestVersion.current += 1;
    requestController.current?.abort();
    setIsLoading(false);
    setError('');
    setRecommendation(null);
    setActiveId(null);
    setFeedback(null);
    setReason(null);
  }

  function updateInput(input: keyof Favorites, value: string) {
    clearResult();
    setFavorites(current => ({ ...current, [input]: value }));
    setFieldErrors(current => ({ ...current, [input]: current[input] && !value.trim() ? current[input] : undefined }));
  }

  async function findMovie() {
    clearResult();
    const data = { book: book.trim(), music: music.trim(), third: third.trim() };
    const errors: Partial<Favorites> = {};
    for (const input of ['book', 'music', 'third'] as const) {
      if (!data[input]) errors[input] = 'Please enter a favorite.';
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;
    const version = requestVersion.current;
    const controller = new AbortController();
    requestController.current = controller;
    setIsLoading(true);
    try {
      const movie = await recommendMovie({ ...data, ...sessionExclusions() }, { signal: controller.signal });
      if (version !== requestVersion.current || controller.signal.aborted) return;
      const id = crypto.randomUUID();
      saveLog([...readLog(), { id, ...data, recommendation: movie, feedback: null, rejection_reason: null }]);
      setActiveId(id);
      setRecommendation(movie);
    } catch (cause) {
      if (version !== requestVersion.current || controller.signal.aborted) return;
      setError(cause instanceof Error && cause.message
        ? `We couldn't find your movie. ${cause.message}`
        : "We couldn't find your movie right now. Please try again.");
    } finally {
      if (version === requestVersion.current) setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void findMovie();
  }

  function handleFeedback(value: Feedback) {
    if (!activeId) return;
    setFeedback(value);
    setReason(null);
    saveLog(readLog().map(entry => entry.id === activeId ? { ...entry, feedback: value, rejection_reason: null } : entry));
  }

  function handleReason(value: RejectionReason) {
    if (!activeId) return;
    setReason(value);
    saveLog(readLog().map(entry => entry.id === activeId ? { ...entry, rejection_reason: value } : entry));
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
        <form onSubmit={handleSubmit} noValidate>
          <div className="fields">
            <div className="field">
              <label htmlFor="book">A book you loved</label>
              <input id="book" data-testid="input-book" type="text" required maxLength={300} value={book} onChange={event => updateInput('book', event.target.value)} placeholder="A title that stayed with you" aria-invalid={!!fieldErrors.book} aria-describedby={fieldErrors.book ? 'book-error' : undefined} />
              {fieldErrors.book && <p id="book-error" className="field-error" role="alert">{fieldErrors.book}</p>}
            </div>
            <div className="field">
              <label htmlFor="music">A song/artist you love</label>
              <input id="music" data-testid="input-music" type="text" required maxLength={300} value={music} onChange={event => updateInput('music', event.target.value)} placeholder="A song or an artist" aria-invalid={!!fieldErrors.music} aria-describedby={fieldErrors.music ? 'music-error' : undefined} />
              {fieldErrors.music && <p id="music-error" className="field-error" role="alert">{fieldErrors.music}</p>}
            </div>
            <div className="field">
              <label htmlFor="third">Another book or song you love</label>
              <input id="third" data-testid="input-third" type="text" required maxLength={300} value={third} onChange={event => updateInput('third', event.target.value)} placeholder="One more favorite" aria-invalid={!!fieldErrors.third} aria-describedby={fieldErrors.third ? 'third-error' : undefined} />
              {fieldErrors.third && <p id="third-error" className="field-error" role="alert">{fieldErrors.third}</p>}
            </div>
          </div>
          <div className="submit-row">
            <button className="primary-button" data-testid="button-find-movie" type="submit" disabled={isLoading}>
              {isLoading ? 'Finding your movie…' : 'Find my movie'}
            </button>
            <span className="helper">One recommendation, chosen for you.</span>
          </div>
        </form>
        {error && <p className="error-message" role="alert" data-testid="status-error">{error}</p>}
      </section>

      {isLoading && (
        <section className="loading-card" role="status" aria-label="Finding your movie" data-testid="status-loading">
          <p>Looking for the connection…</p>
          <div className="skeleton short" />
          <div className="skeleton" />
          <div className="skeleton medium" />
        </section>
      )}

      {recommendation && !isLoading && (
        <section className="recommendation" aria-labelledby="recommendation-title" data-testid="section-recommendation">
          <p className="eyebrow">Your film</p>
          <h2 className="movie-title" id="recommendation-title" data-testid="text-movie-title">
            {recommendation.title} <span className="movie-year" data-testid="text-movie-year">({recommendation.year})</span>
            <span className="match-confidence" data-testid="text-confidence">{recommendation.confidence === 'strong' ? 'Strong match' : 'Loose match'}</span>
          </h2>
          <p className="rationale" data-testid="text-movie-rationale">{recommendation.one_sentence_rationale}</p>
          {recommendation.input_notes.map((note, index) => (
            <p className="input-note" key={`${note.input}-${index}`} data-testid={`note-${note.input}`}>
              <strong>{favorites[note.input]}:</strong> {note.note}
            </p>
          ))}
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
          {feedback === 'No, not for me' && (
            <fieldset className="reason-options">
              <legend className="feedback-label">Why not?</legend>
              {rejectionReasons.map(option => (
                <label key={option}>
                  <input type="radio" name="rejection-reason" checked={reason === option} onChange={() => handleReason(option)} />
                  {option}
                </label>
              ))}
            </fieldset>
          )}
          {(feedback === "Yes, I'd watch this" || feedback === 'Already seen it' || reason) && (
            <p className="feedback-note" role="status" data-testid="status-feedback">Noted. Thanks for telling us.</p>
          )}
          {(feedback === 'Already seen it' || (feedback === 'No, not for me' && reason)) && (
            <button type="button" className="feedback-button try-another" data-testid="button-try-another" onClick={() => void findMovie()}>Try another</button>
          )}
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
                  <td>
                    <strong>{entry.recommendation.title} ({entry.recommendation.year})</strong><br />
                    {entry.recommendation.one_sentence_rationale}
                    {entry.recommendation.genre && <p>{entry.recommendation.genre} · {entry.recommendation.confidence === 'strong' ? 'Strong match' : 'Loose match'}</p>}
                    {entry.recommendation.driver_input && <p>Driven by: {entry[entry.recommendation.driver_input]}</p>}
                    {entry.recommendation.input_notes?.map((note, index) => <p key={index}>{entry[note.input]}: {note.note}</p>)}
                  </td>
                  <td>{entry.feedback ?? '—'}{entry.rejection_reason && <p>Reason: {entry.rejection_reason}</p>}</td>
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
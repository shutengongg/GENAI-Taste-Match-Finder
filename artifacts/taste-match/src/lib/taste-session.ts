import type { MovieRecommendation } from '@workspace/api-client-react';

export const STORAGE_KEY = 'taste-match-session-results';
export const rejectionReasons = [
  "I don't watch this kind of movie",
  "It doesn't match my taste",
  'Something else',
] as const;
export type RejectionReason = typeof rejectionReasons[number];
export type Feedback = "Yes, I'd watch this" | 'No, not for me' | 'Already seen it';
export type Favorites = { book: string; music: string; third: string };
// Keep earlier session entries readable without pretending they have new AI metadata.
export type SessionEntry = Favorites & {
  id: string;
  recommendation: Pick<MovieRecommendation, 'title' | 'year' | 'one_sentence_rationale'> & Partial<MovieRecommendation>;
  feedback: Feedback | null;
  rejection_reason?: RejectionReason | null;
};

let memoryLog: SessionEntry[] = [];
let storageAvailable = true;

export function readLog(): SessionEntry[] {
  if (!storageAvailable) return memoryLog;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) throw new Error('Invalid session log');
      memoryLog = parsed.filter(entry => entry && typeof entry.id === 'string'
        && typeof entry.book === 'string' && typeof entry.music === 'string'
        && typeof entry.third === 'string' && typeof entry.recommendation?.title === 'string');
    } else {
      memoryLog = [];
    }
  } catch {
    // An in-memory session is still usable when browser storage is unavailable.
    storageAvailable = false;
  }
  return memoryLog;
}

export function saveLog(entries: SessionEntry[]) {
  memoryLog = entries;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Retain the in-memory log for this page session.
    storageAvailable = false;
  }
}

export function sessionExclusions() {
  const entries = readLog();
  return {
    excluded_titles: [...new Set(entries.map(entry => entry.recommendation.title))],
    excluded_genres: [...new Set(entries
      .filter(entry => entry.feedback === 'No, not for me' && entry.rejection_reason === rejectionReasons[0])
      .flatMap(entry => entry.recommendation.genre ? [entry.recommendation.genre] : []))],
  };
}

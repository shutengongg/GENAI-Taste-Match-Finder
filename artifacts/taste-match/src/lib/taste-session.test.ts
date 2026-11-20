import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readLog, saveLog, sessionExclusions, rejectionReasons, type SessionEntry } from './taste-session';

const storage = new Map<string, string>();
Object.defineProperty(globalThis, 'sessionStorage', {
  configurable: true,
  value: { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) },
});
const entry: SessionEntry = {
  id: 'test', book: 'Book', music: 'Song', third: 'Third', feedback: 'No, not for me',
  recommendation: { title: 'Example', year: 2000, one_sentence_rationale: 'A connection.', genre: 'Horror' },
  rejection_reason: rejectionReasons[0],
};

test('saves and reloads reaction and rejection reason', () => {
  saveLog([entry]);
  assert.deepEqual(readLog(), [entry]);
});
test('excludes all session films and only explicitly rejected genres', () => {
  saveLog([entry, {
    ...entry, id: 'seen', feedback: 'Already seen it', rejection_reason: null,
    recommendation: { ...entry.recommendation, title: 'Another', genre: 'Comedy' },
  }]);
  assert.deepEqual(sessionExclusions(), { excluded_titles: ['Example', 'Another'], excluded_genres: ['Horror'] });
});
test('taste mismatch and something else do not exclude a genre', () => {
  for (const reason of rejectionReasons.slice(1)) {
    saveLog([{ ...entry, rejection_reason: reason }]);
    assert.deepEqual(sessionExclusions().excluded_genres, []);
  }
});
test('earlier session entries without new metadata remain readable', () => {
  const old: SessionEntry = { ...entry, recommendation: { title: 'Old', year: 1999, one_sentence_rationale: 'Old rationale.' } };
  delete old.rejection_reason;
  saveLog([old]);
  assert.equal(readLog()[0]?.recommendation.title, 'Old');
  assert.deepEqual(sessionExclusions().excluded_genres, []);
});
test('a full storage quota does not lose the in-memory session or its exclusions', () => {
  Object.defineProperty(globalThis, 'sessionStorage', {
    configurable: true,
    value: { getItem: (key: string) => storage.get(key) ?? null, setItem: () => { throw new Error('Quota exceeded'); } },
  });
  saveLog([entry]);
  assert.equal(readLog()[0]?.id, entry.id);
  assert.deepEqual(sessionExclusions().excluded_genres, ['Horror']);
});

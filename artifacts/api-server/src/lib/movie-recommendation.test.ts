import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateMovie } from './movie-recommendation';

const favorites = { book: 'The Secret History', music: 'Sufjan Stevens', third: 'Never Let Me Go' };
const movie = {
  title: 'Atonement', year: 2007,
  one_sentence_rationale: 'It combines The Secret History’s guilt and irreversible choices with Sufjan Stevens’s tender melancholy and Never Let Me Go’s ache of loss.',
  genre: 'Drama', genres: ['Drama', 'Romance'], driver_input: 'book', confidence: 'strong', input_notes: [],
};

test('accepts a combined rationale naming all three favorites and a driver', () => {
  assert.equal(validateMovie(movie, favorites, [], []).confidence, 'strong');
});
test('rejects repeated titles regardless of punctuation, case, or accents', () => {
  assert.throws(() => validateMovie({ ...movie, title: 'ÁTONE-MENT!' }, favorites, ['Atonement'], []), /repeated/);
});
test('rejects excluded genres', () => {
  assert.throws(() => validateMovie(movie, favorites, [], ['Drama']), /excluded genre/);
});
test('rejects excluded secondary genres, not just the primary label', () => {
  assert.throws(() => validateMovie(movie, favorites, [], ['Romance']), /excluded genre/);
});
test('requires an honest list including the primary genre', () => {
  assert.throws(() => validateMovie({ ...movie, genres: [] }, favorites, [], []), /all applicable genres/);
});
test('requires the rationale to name the actual driving favorite', () => {
  assert.throws(() => validateMovie({ ...movie, one_sentence_rationale: 'You will enjoy the mood.' }, favorites, [], []), /driving input/);
});
test('rejects a book-only rationale even when book is the strongest driver', () => {
  assert.throws(() => validateMovie({
    ...movie, one_sentence_rationale: 'The Secret History shares its guilt and irreversible choices.',
  }, favorites, [], []), /music input/);
});
test('rejects a rationale that ignores the third favorite', () => {
  assert.throws(() => validateMovie({
    ...movie, one_sentence_rationale: 'It combines The Secret History’s guilt with Sufjan Stevens’s melancholy.',
  }, favorites, [], []), /third input/);
});
test('music or third can drive the combined match without omitting the other inputs', () => {
  for (const driver_input of ['music', 'third']) {
    assert.equal(validateMovie({ ...movie, driver_input }, favorites, [], []).driver_input, driver_input);
  }
});
test('unfamiliar inputs cannot drive a match', () => {
  assert.throws(() => validateMovie({
    ...movie, input_notes: [{ input: 'book', issue: 'unfamiliar', note: 'I do not recognize this book.' }],
  }, favorites, [], []), /unrecognized/);
});
test('unknown non-driver inputs lower confidence without blocking', () => {
  assert.equal(validateMovie({
    ...movie,
    one_sentence_rationale: 'It joins The Secret History’s guilt with Sufjan Stevens’s tender melancholy.',
    input_notes: [{ input: 'third', issue: 'unfamiliar', note: 'I do not recognize this title.' }],
  }, favorites, [], []).confidence, 'loose');
});
test('all-unknown fallback may have no driver but is always loose', () => {
  assert.equal(validateMovie({
    ...movie,
    driver_input: null,
    one_sentence_rationale: 'This is a tentative suggestion because I cannot confidently identify these favorites.',
    input_notes: ['book', 'music', 'third'].map(input => ({ input, issue: 'unfamiliar', note: 'I do not recognize this favorite.' })),
  }, favorites, [], []).confidence, 'loose');
});

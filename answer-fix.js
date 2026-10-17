'use strict';

/* ENGLISH QUEST — ANSWER FIX v1.0 */
(() => {
  normalizeAnswer = function(s) {
    return String(s ?? '')
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/[‐‑‒–—−]/g, '-')
      .replace(/[~～〜]/g, ' ')
      .replace(/[.!?]+$/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  isTypedCorrect = function(input, word) {
    const got = normalizeAnswer(input);
    return [word.en, ...(word.answers || [])]
      .some(answer => normalizeAnswer(answer) === got);
  };
})();

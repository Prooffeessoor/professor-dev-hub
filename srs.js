/* Professor Dev Hub - Spaced Repetition Algorithm (SM-2 inspired)

   Quality ratings:
   0 = Again   (complete blackout)
   1 = Hard    (incorrect but remembered something)
   2 = Good    (correct with some effort)
   3 = Easy    (perfect recall)

   The algorithm schedules the next review based on performance.
*/

const SRS = {
  /**
   * Process a review and return the updated SRS state.
   * @param {Object} card - current SRS state { easeFactor, interval, repetitions, ... }
   * @param {number} quality - 0..3
   * @returns {Object} updated SRS state
   */
  review(card, quality) {
    let { easeFactor = 2.5, interval = 0, repetitions = 0 } = card;

    // Clamp quality
    quality = Math.max(0, Math.min(3, quality));

    if (quality < 2) {
      // Again or Hard → reset progress
      repetitions = 0;
      interval = quality === 0 ? 0 : 1; // Again = due again soon, Hard = 1 day
    } else {
      // Good or Easy
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 3;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
    }

    // Update ease factor (SM-2 style)
    // Higher quality → higher ease, lower quality → lower ease
    const q = quality + 1; // map 0-3 → 1-4 for classic formula feel
    easeFactor = easeFactor + (0.1 - (4 - q) * (0.08 + (4 - q) * 0.02));
    easeFactor = Math.max(1.3, easeFactor); // never go below 1.3

    // Easy bonus
    if (quality === 3) {
      interval = Math.round(interval * 1.3);
    }

    const now = Date.now();
    const nextReview = now + (interval * 24 * 60 * 60 * 1000);

    return {
      ...card,
      easeFactor: Math.round(easeFactor * 100) / 100,
      interval,
      repetitions,
      nextReview,
      lastReviewed: now
    };
  },

  /** Return true if the card is due for review */
  isDue(card) {
    return !card.nextReview || card.nextReview <= Date.now();
  },

  /** Human-readable next review text */
  formatInterval(days) {
    if (days === 0) return 'soon';
    if (days === 1) return '1 day';
    if (days < 30) return `${days} days`;
    if (days < 365) return `${Math.round(days / 30)} months`;
    return `${Math.round(days / 365)} years`;
  }
};

window.SRS = SRS;

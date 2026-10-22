// Top-up rule, adapted from the AI-led prototype ("Top up where the intent is").
// Spending on Candy happens in sessions, not evenly through the week: on one test account, three
// 100-token packs in 16 minutes; on another, 114 tokens in 4 minutes (21 Oct). So the pack is sized on
// the member's usual session, not on a daily average.
// Pure functions, no DOM. Loaded by index.html (global `TopUp`) and by the tests (Node).

(function (root) {
  // Packs as seen in the Candy.ai token store, 20-21 Oct 2026 (same numbers in GBP and USD).
  // The slider packs (above 3,750) are left out of recommendations on purpose.
  const PACKS = [
    { tokens: 100, price: 9.99, bonus: 0 },
    { tokens: 350, price: 34.99, bonus: 0 },
    { tokens: 550, price: 49.99, bonus: 0.10 },
    { tokens: 1150, price: 99.99, bonus: 0.15 },
    { tokens: 2400, price: 199.99, bonus: 0.20 },
    { tokens: 3750, price: 299.99, bonus: 0.25 },
  ];

  function delivered(pack) {
    return Math.round(pack.tokens * (1 + pack.bonus));
  }

  function pricePerToken(pack) {
    return pack.price / delivered(pack);
  }

  // cost: tokens the item needs. balance: tokens held.
  // sessionSpend: median tokens the member spent in a session, last 5 sessions (0 = no history).
  // Rule: the smallest pack that covers the item plus the rest of a usual session; the cheapest pack
  // that covers the item alone is always shown. 350 becomes 550 only when two usual sessions would use it.
  function recommend({ cost, balance, sessionSpend = 0, packs = PACKS }) {
    const shortfall = Math.max(0, cost - balance);
    if (shortfall === 0) return null;

    const sorted = [...packs].sort((a, b) => a.tokens - b.tokens);
    const covering = sorted.filter((p) => delivered(p) >= shortfall);
    const largest = sorted[sorted.length - 1];
    const cheapestCovering = covering[0] || largest;

    const session = Math.max(0, sessionSpend);
    const restOfSession = Math.max(0, session - cost);   // what a usual session spends beyond this item
    const target = shortfall + restOfSession;
    let pick = sorted.find((p) => delivered(p) >= target) || largest;
    if (pick.tokens < cheapestCovering.tokens) pick = cheapestCovering;

    let reason;
    const p550 = sorted.find((p) => p.tokens === 550);
    if (pick.tokens === 350 && p550 && shortfall + 2 * session >= delivered(p550)) {
      pick = p550;
      reason = `A usual session for you is about ${session} tokens. 550 gets a 10% bonus and covers this and your next session.`;
    } else if (session <= 0) {
      reason = 'The smallest pack that covers this.';
    } else if (restOfSession === 0) {
      reason = 'This costs more than you usually spend in a session, so the pack covers this only, nothing extra.';
    } else if (pick === cheapestCovering) {
      reason = `Covers this and the rest of a usual session for you (about ${session} tokens).`;
    } else {
      reason = `A usual session for you is about ${session} tokens. This covers this and the rest of the evening.`;
    }

    const i = sorted.indexOf(pick);
    const shown = sorted.slice(Math.max(0, i - 1), i + 2);
    if (!shown.includes(cheapestCovering)) shown.unshift(cheapestCovering);

    return { shortfall, target, pick, cheapestCovering, shown, reason, leftAfter: balance + delivered(pick) - cost };
  }

  const api = { PACKS, delivered, pricePerToken, recommend };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TopUp = api;
})(typeof window !== 'undefined' ? window : globalThis);

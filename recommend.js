// Top-up recommendation rule, reused unchanged from the AI-led prototype ("Top up where the intent is").
// Here it sizes the top-up when she picks an outfit the member can't afford yet.
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

  const HORIZON_DAYS = 3;   // cover the item plus the user's next 3 days
  const USE_WITHIN_DAYS = 7; // only upgrade 350 -> 550 if the user would spend 550 within a week

  function delivered(pack) {
    return Math.round(pack.tokens * (1 + pack.bonus));
  }

  function pricePerToken(pack) {
    return pack.price / delivered(pack);
  }

  // cost: tokens the item needs. balance: tokens held. dailyPace: tokens spent per day over the last 7 days.
  function recommend({ cost, balance, dailyPace = 0, packs = PACKS }) {
    const shortfall = Math.max(0, cost - balance);
    if (shortfall === 0) return null;

    const sorted = [...packs].sort((a, b) => a.tokens - b.tokens);
    const covering = sorted.filter((p) => delivered(p) >= shortfall);
    const largest = sorted[sorted.length - 1];
    const cheapestCovering = covering[0] || largest;

    const target = shortfall + HORIZON_DAYS * Math.max(0, dailyPace);
    let pick = sorted.find((p) => delivered(p) >= target) || largest;
    if (pick.tokens < cheapestCovering.tokens) pick = cheapestCovering;

    let reason;
    const p550 = sorted.find((p) => p.tokens === 550);
    if (pick.tokens === 350 && p550 && dailyPace * USE_WITHIN_DAYS >= p550.tokens) {
      pick = p550;
      reason = `You use about ${Math.round(dailyPace)} tokens a day. 550 gets a 10% bonus and lasts about a week.`;
    } else if (dailyPace <= 0) {
      reason = 'The smallest pack that covers this.';
    } else if (pick === cheapestCovering) {
      reason = `Covers this and fits how much you use (about ${Math.round(dailyPace)} a day).`;
    } else {
      const days = Math.floor((delivered(pick) - shortfall) / dailyPace);
      reason = `You use about ${Math.round(dailyPace)} tokens a day. This covers it and about ${days} more days.`;
    }

    const i = sorted.indexOf(pick);
    const shown = sorted.slice(Math.max(0, i - 1), i + 2);
    if (!shown.includes(cheapestCovering)) shown.unshift(cheapestCovering);

    return { shortfall, target, pick, cheapestCovering, shown, reason, leftAfter: balance + delivered(pick) - cost };
  }

  const api = { PACKS, HORIZON_DAYS, USE_WITHIN_DAYS, delivered, pricePerToken, recommend };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TopUp = api;
})(typeof window !== 'undefined' ? window : globalThis);

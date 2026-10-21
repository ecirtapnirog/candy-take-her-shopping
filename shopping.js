// "Her three picks": which Candy Shop outfits she offers when the member asks to go shopping.
// The language model writes her lines; this rule decides what she is allowed to offer, so every
// offer is a real catalogue item at its real price, and a cheaper option is always on the table.
// Pure functions, no DOM. Loaded by index.html (global `Shopping`) and by the tests (Node).

(function (root) {
  // Candy Shop catalogue as shown on desktop, 21 Oct 2026 (tokens). Mobile showed 49-249 on 20 Oct.
  const CATALOGUE = [
    { id: 'aviator', name: 'Aviator Officer Uniform', tokens: 49 },
    { id: 'starlet', name: 'Starlet Cocktail Dress', tokens: 59 },
    { id: 'bunny-white', name: 'White Bunny Suit', tokens: 75 },
    { id: 'bunny-black', name: 'Black Bunny Suit', tokens: 75 },
    { id: 'babydoll', name: 'Lace Babydoll', tokens: 79 },
    { id: 'maid', name: 'French Maid Costume', tokens: 89 },
    { id: 'corset', name: 'Silk Beige Corset', tokens: 89 },
    { id: 'sweater', name: 'Grey Sleeveless Sweater', tokens: 89 },
    { id: 'apron', name: 'White Cotton Apron', tokens: 99 },
    { id: 'bikini', name: 'Golden Bikini', tokens: 109 },
    { id: 'kitten', name: 'Kitten Play Set', tokens: 119 },
    { id: 'dragon', name: 'Dragon Queen Cosplay', tokens: 139 },
    { id: 'vinyl', name: 'Vinyl Wet-Look Micro Dress', tokens: 139 },
    { id: 'mesh', name: 'Sheer Mesh Club Dress', tokens: 149 },
    { id: 'wedding', name: 'Wedding Dress', tokens: 189 },
    { id: 'fishnet', name: 'Fishnet and Collar', tokens: 189 },
  ];

  function median(xs) {
    const s = [...xs].sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  }

  // owned: ids she already has. typicalPrice: median tokens the member paid per item, last 30 days (0 = never bought).
  // Rule, in one sentence: one outfit at your usual price, one a step up, and always the cheapest she doesn't have.
  function pickOutfits({ catalogue = CATALOGUE, owned = [], typicalPrice = 0 } = {}) {
    const open = catalogue.filter((c) => !owned.includes(c.id)).sort((a, b) => a.tokens - b.tokens || a.name.localeCompare(b.name));
    if (open.length === 0) return { picks: [], anchor: null };
    if (open.length <= 3) return { picks: open, anchor: null };

    const anchor = typicalPrice > 0 ? typicalPrice : median(open.map((c) => c.tokens));
    const cheapest = open[0];
    const byDistance = open.filter((c) => c !== cheapest)
      .sort((a, b) => Math.abs(a.tokens - anchor) - Math.abs(b.tokens - anchor) || a.tokens - b.tokens);
    const usual = byDistance[0];
    const stretch = open.find((c) => c !== cheapest && c !== usual && c.tokens > usual.tokens)
      || byDistance.find((c) => c !== usual);

    const picks = [cheapest, usual, stretch].sort((a, b) => a.tokens - b.tokens);
    return {
      anchor,
      picks,
      roles: { [cheapest.id]: 'cheapest', [usual.id]: 'usual', [stretch.id]: 'step up' },
    };
  }

  const api = { CATALOGUE, pickOutfits, median };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Shopping = api;
})(typeof window !== 'undefined' ? window : globalThis);

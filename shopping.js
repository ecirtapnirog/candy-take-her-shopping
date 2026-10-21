// "Her three picks": which gifts and Candy Shop outfits she offers when the member asks to go shopping.
// The language model writes her lines; this rule decides what she is allowed to offer, so every
// offer is a real item at its real price, and a cheaper option is always on the table.
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

  // In-chat gift shelf, read in the chat on 21 Oct 2026 (tokens). Four tabs: Best, Romantic, Luxury, Spicy.
  // Gifts can be given again and again; outfits once per character. "Large gifts come with free videos."
  const GIFTS = [
    ['rose', 'Red Rose', 5], ['chocolate', 'Chocolate Box', 10], ['bouquet', 'Bouquet of Roses', 25],
    ['perfume', 'Perfume', 30], ['stockings', 'Fishnet Stockings', 30], ['teddy', 'Giant Teddy Bear', 50],
    ['pearls', 'Pearl Necklace', 50], ['heels', 'High Heels', 50], ['red-lingerie', 'Red Lingerie', 75],
    ['phone', 'Phone', 75], ['vibrator', 'Vibrator', 99], ['horse', 'Horse Riding Day', 110],
    ['ring', 'Diamond Ring', 125], ['lace-lingerie', 'Lace Lingerie', 140], ['kitten-pet', 'Kitten', 200],
    ['bag', 'Designer Bag', 200], ['massage', 'Massage for Two', 200], ['plug', 'Butt Plug', 250],
    ['puppy', 'Puppy', 300], ['cuffs', 'Blindfold & Cuffs', 300], ['vip', 'VIP Nightclub Night', 320],
    ['festival', 'Music Festival', 400], ['helicopter', 'Private Helicopter Tour', 450],
    ['paris', 'Vacation in Paris', 500], ['libertine', 'Libertine Club Night', 500],
    ['car', 'Sports Car', 670], ['yacht', 'Yacht', 999],
  ].map(([id, name, tokens]) => ({ id, name, tokens, kind: 'gift' }));
  CATALOGUE.forEach((c) => { c.kind = 'outfit'; });
  const ITEMS = [...CATALOGUE, ...GIFTS];

  function median(xs) {
    const s = [...xs].sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  }

  // owned: outfit ids she already has (gifts can repeat). typicalPrice: median tokens the member paid per
  // gift or outfit, last 30 days (0 = never bought).
  // Rule, in one sentence: one item at your usual price, one a step up, one cheaper, and at least one
  // outfit she can wear while any are left.
  function pickOffers({ owned = [], typicalPrice = 0 } = {}) {
    const pool = ITEMS.filter((c) => c.kind === 'gift' || !owned.includes(c.id))
      .sort((a, b) => a.tokens - b.tokens || a.name.localeCompare(b.name));
    const outfitsLeft = pool.filter((c) => c.kind === 'outfit');
    const anchor = typicalPrice > 0 ? typicalPrice : median(pool.map((c) => c.tokens));
    const near = (list, x) => [...list].sort((a, b) => Math.abs(a.tokens - x) - Math.abs(b.tokens - x) || a.tokens - b.tokens)[0];

    // usual: closest to the anchor; an outfit if one sits within 25% of it, so she has something to wear.
    const outfitNear = outfitsLeft.length ? near(outfitsLeft, anchor) : null;
    let usual = outfitNear && Math.abs(outfitNear.tokens - anchor) <= 0.25 * anchor ? outfitNear : near(pool, anchor);
    const rest = () => pool.filter((c) => ![usual, cheaper, stepUp].includes(c));
    let cheaper = null, stepUp = null;
    // at the top of the range there is nothing to step up to: the dearest item becomes the step up.
    if (!pool.some((c) => c.tokens > usual.tokens)) { stepUp = usual; usual = near(pool.filter((c) => c !== stepUp && c.tokens <= stepUp.tokens / 1.3), anchor); }
    // at the bottom there is nothing cheaper: the cheapest item becomes the cheaper pick.
    if (!stepUp && !pool.some((c) => c.tokens < usual.tokens)) { cheaper = usual; usual = near(pool.filter((c) => c.tokens >= cheaper.tokens / 0.6), anchor); }
    // cheaper: the dearest item at or under 60% of the usual price, of the other kind if possible.
    const under = rest().filter((c) => c.tokens <= 0.6 * usual.tokens);
    cheaper = cheaper || under.filter((c) => c.kind !== usual.kind).pop() || under.pop() || rest()[0];
    // step up: the cheapest item at least 30% above the usual price.
    stepUp = stepUp || rest().find((c) => c.tokens >= 1.3 * usual.tokens) || rest().filter((c) => c.tokens > usual.tokens)[0] || rest().pop();
    // at least one outfit while any are left
    if (outfitsLeft.length && ![usual, cheaper, stepUp].some((c) => c.kind === 'outfit')) {
      const o = near(outfitsLeft, anchor);
      if (o.tokens < usual.tokens) cheaper = o; else stepUp = o;
    }
    const picks = [cheaper, usual, stepUp].sort((a, b) => a.tokens - b.tokens);
    return { anchor, picks, roles: { [cheaper.id]: 'cheaper', [usual.id]: 'usual', [stepUp.id]: 'step up' } };
  }

  // The evening out: what the opening act leads to. Today these exist only as emoji on the gift shelf
  // (Yacht 999; Horse Riding Day 110 came back as a 15-second video and a photo, 21 Oct). Here she proposes
  // the evening herself, after the shopping, wearing what you bought her. Prices stay on today's shelf scale:
  // the yacht at the shelf's 999, the wine evening at 320 like the VIP Nightclub Night. Staying in is free.
  const EXPERIENCES = [
    { id: 'evening-wine', name: 'A rare bottle, just us', tokens: 320, kind: 'experience',
      gives: ['her video toast, 15s', 'three photos on the terrace', 'a voice note'], scene: 'wine' },
    { id: 'evening-yacht', name: 'Sunset on the yacht', tokens: 999, kind: 'experience',
      gives: ['her video on deck, 30s', 'five photos at sunset', 'a voice note', 'the evening saved to her profile'], scene: 'yacht' },
  ];
  const STAY_IN = { id: 'stay', name: 'Stay in tonight', tokens: 0, kind: 'free', gives: ['a photo, no charge'], scene: 'stay' };

  // Rule, in one sentence: she leads with the evening closest to what this member spends in a usual
  // session, always shows the other one, and always offers to stay in for free.
  function pickEvening({ sessionSpend = 0 } = {}) {
    const byFit = [...EXPERIENCES].sort((a, b) => Math.abs(a.tokens - sessionSpend) - Math.abs(b.tokens - sessionSpend) || a.tokens - b.tokens);
    const lead = byFit[0];
    const other = byFit[1];
    return { lead, offers: [lead, other, STAY_IN] };
  }

  const api = { CATALOGUE, GIFTS, ITEMS, EXPERIENCES, STAY_IN, pickOffers, pickEvening, median };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Shopping = api;
})(typeof window !== 'undefined' ? window : globalThis);

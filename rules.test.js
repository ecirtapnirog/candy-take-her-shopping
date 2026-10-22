// Run: node rules.test.js
const assert = require('assert');
const { recommend, delivered } = require('./recommend.js');
const { pickOffers, pickEvening, CATALOGUE, ITEMS, EXPERIENCES, GIFTS } = require('./shopping.js');

let n = 0;
function t(name, fn) { fn(); n++; console.log('ok', n, name); }

// Her three picks: gifts and outfits
const by = (r, role) => r.picks.find((p) => r.roles[p.id] === role);
t('three distinct picks, cheaper < usual < step up, at every usual price', () => {
  for (let typical = 0; typical <= 999; typical++) {
    const r = pickOffers({ typicalPrice: typical });
    assert.strictEqual(new Set(r.picks.map((p) => p.id)).size, 3);
    assert.ok(by(r, 'cheaper').tokens < by(r, 'usual').tokens && by(r, 'usual').tokens < by(r, 'step up').tokens);
  }
});
t('at least one outfit she can wear while any are left', () => {
  for (const typical of [0, 5, 30, 100, 300, 999]) assert.ok(pickOffers({ typicalPrice: typical }).picks.some((p) => p.kind === 'outfit'));
});
t('usual pick follows what the member pays', () => {
  const r = pickOffers({ typicalPrice: 140 });
  assert.ok(Math.abs(by(r, 'usual').tokens - 140) <= 15);
});
t('never offers an outfit she already owns', () => {
  const owned = CATALOGUE.slice(0, 8).map((c) => c.id);
  for (const typical of [0, 50, 90, 140]) assert.ok(!pickOffers({ owned, typicalPrice: typical }).picks.some((p) => owned.includes(p.id)));
});
t('gifts repeat: with every outfit given she still offers three', () => {
  const r = pickOffers({ owned: CATALOGUE.map((c) => c.id), typicalPrice: 100 });
  assert.strictEqual(r.picks.length, 3);
  assert.ok(r.picks.every((p) => p.kind === 'gift'));
});
t('every offer is a real item at its real price', () => {
  const r = pickOffers({ typicalPrice: 75 });
  for (const p of r.picks) assert.ok(ITEMS.some((c) => c.id === p.id && c.tokens === p.tokens));
});

// The evening out
t('she always offers to stay in for free', () => {
  for (const s of [0, 50, 120, 320, 600, 999, 3000]) assert.ok(pickEvening({ sessionSpend: s }).offers.some((o) => o.tokens === 0));
});
t('she leads with the evening closest to a usual session', () => {
  assert.strictEqual(pickEvening({ sessionSpend: 120 }).lead.id, 'evening-wine');
  assert.strictEqual(pickEvening({ sessionSpend: 900 }).lead.id, 'evening-yacht');
});
t('both evenings priced on the shelf scale: yacht at the shelf yacht price', () => {
  const yacht = EXPERIENCES.find((e) => e.id === 'evening-yacht');
  assert.strictEqual(yacht.tokens, GIFTS.find((g) => g.id === 'yacht').tokens);
  for (const e of EXPERIENCES) assert.ok(e.tokens >= 5 && e.tokens <= 999);
});

// Top-up inside the scene, sized on the session
t('enough tokens: no sheet', () => {
  assert.strictEqual(recommend({ cost: 89, balance: 120, sessionSpend: 150 }), null);
});
t('short on an 89-token outfit, no history: smallest pack that covers', () => {
  const r = recommend({ cost: 89, balance: 20, sessionSpend: 0 });
  assert.strictEqual(r.pick.tokens, 100);
});
t('short on a 189-token outfit, usual session 300: covers the rest of the session, 350 becomes 550', () => {
  const r = recommend({ cost: 189, balance: 20, sessionSpend: 300 });
  assert.strictEqual(r.pick.tokens, 550);
  assert.ok(delivered(r.cheapestCovering) >= 169);
});
t('an evening dearer than a usual session gets the cheapest pack that covers it, nothing extra', () => {
  const r = recommend({ cost: 999, balance: 96, sessionSpend: 120 });
  assert.strictEqual(r.pick, r.cheapestCovering);
});
t('cheapest covering pack is always shown', () => {
  for (const s of [0, 100, 300, 1000]) { const r = recommend({ cost: 320, balance: 0, sessionSpend: s }); assert.ok(r.shown.includes(r.cheapestCovering)); }
});

console.log(`\n${n} tests passed`);

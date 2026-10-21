// Run: node rules.test.js
const assert = require('assert');
const { recommend, delivered } = require('./recommend.js');
const { pickOffers, CATALOGUE, ITEMS } = require('./shopping.js');

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

// Top-up inside the scene (rule reused from the AI-led prototype)
t('enough tokens: no sheet', () => {
  assert.strictEqual(recommend({ cost: 89, balance: 120, dailyPace: 40 }), null);
});
t('short on an 89-token outfit, light user: smallest pack that covers', () => {
  const r = recommend({ cost: 89, balance: 20, dailyPace: 0 });
  assert.strictEqual(r.pick.tokens, 100);
});
t('short on a 189-token outfit, moderate user: 350 becomes 550 with bonus', () => {
  const r = recommend({ cost: 189, balance: 20, dailyPace: 85 });
  assert.strictEqual(r.pick.tokens, 550);
  assert.ok(delivered(r.cheapestCovering) >= 169);
});
t('cheapest covering pack is always shown', () => {
  const r = recommend({ cost: 189, balance: 0, dailyPace: 200 });
  assert.ok(r.shown.includes(r.cheapestCovering));
});

console.log(`\n${n} tests passed`);

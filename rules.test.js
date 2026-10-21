// Run: node rules.test.js
const assert = require('assert');
const { recommend, delivered } = require('./recommend.js');
const { pickOutfits, CATALOGUE } = require('./shopping.js');

let n = 0;
function t(name, fn) { fn(); n++; console.log('ok', n, name); }

// Her three picks
t('new buyer: cheapest, median, a step up', () => {
  const r = pickOutfits({});
  assert.strictEqual(r.picks.length, 3);
  assert.strictEqual(r.picks[0].tokens, 49);
  assert.ok(r.picks[2].tokens > r.picks[1].tokens);
});
t('a cheaper option is always on the table', () => {
  for (const typical of [0, 60, 90, 140, 189]) {
    const r = pickOutfits({ typicalPrice: typical });
    const min = Math.min(...CATALOGUE.map((c) => c.tokens));
    assert.strictEqual(r.picks[0].tokens, min);
  }
});
t('usual pick follows what the member pays', () => {
  const r = pickOutfits({ typicalPrice: 140 });
  assert.ok(r.picks.some((p) => r.roles[p.id] === 'usual' && Math.abs(p.tokens - 140) <= 10));
});
t('never offers what she already owns', () => {
  const r = pickOutfits({ owned: ['aviator', 'starlet'] });
  assert.ok(!r.picks.some((p) => p.id === 'aviator' || p.id === 'starlet'));
  assert.strictEqual(r.picks[0].tokens, 75);
});
t('top of the range still offers three distinct outfits', () => {
  const r = pickOutfits({ typicalPrice: 189 });
  assert.strictEqual(new Set(r.picks.map((p) => p.id)).size, 3);
});
t('almost everything owned: offers what is left', () => {
  const owned = CATALOGUE.slice(0, CATALOGUE.length - 2).map((c) => c.id);
  assert.strictEqual(pickOutfits({ owned }).picks.length, 2);
});

// Top-up inside the scene (rule reused from the AI-led prototype)
t('enough tokens: no sheet', () => {
  assert.strictEqual(recommend({ cost: 89, balance: 120, dailyPace: 40 }), null);
});
t('short on a 89-token outfit, light user: smallest pack that covers', () => {
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

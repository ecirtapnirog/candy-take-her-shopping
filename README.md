# Take her shopping: prototype

Part 2 of the EverAI Senior PM case (Candy.ai): the smallest testable slice of the lead initiative from Part 1.

The smallest testable slice of the lead initiative in the EverAI case: does a shopping scene inside the chat sell more Candy Shop outfits than the Shop on its own?

- **A (today, as seen on 21 Oct 2026):** asked to go shopping, the character improvises a picture with nothing to buy. The member opens the Shop, picks an outfit, buys it, gifts it, goes back to the chat and asks her to wear it. 6 taps; 10 if short of tokens, with a detour through the token store.
- **B (the test):** she offers three real outfits at their real prices in the chat. The member picks one and pays in place; if short, the top-up sheet opens sized to the outfit and the scene carries on after payment. She wears it, and the relationship level moves. 3 taps; 4 if short.

Characters, pictures and payments are placeholders. The catalogue and prices are the Candy Shop's (desktop, 21 Oct). No money moves.

## Run it

- Live demo: https://ecirtapnirog.github.io/candy-take-her-shopping/
- Locally: open `index.html` in a browser (works offline; the web font falls back).
- Tests: `node rules.test.js` (10 cases, no dependencies).

## Files

- `shopping.js`: her three picks. One outfit at the member's usual price, one a step up, and always the cheapest she doesn't own. The model writes her lines; this rule decides what she may offer.
- `recommend.js`: the top-up rule, reused unchanged from the AI-led prototype. The smallest pack covering the outfit plus 3 days at the member's pace; 350 (no bonus) becomes 550 (+10%) for members who spend 550 within a week; the cheapest covering pack is always shown.
- `rules.test.js`: 6 cases for the picks, 4 for the top-up inside the scene.
- `index.html`: the phone (both variants), the two rules live, the event log, and a simulated readout at the planned sample.

## What the test records

`shop_intent`, `reply_improvised` (A), `outfits_offered` (B), `outfit_selected`, `shop_opened`, `item_viewed`, `insufficient_shown`, `sheet_viewed`, `pack_selected`, `purchase_completed`, `item_bought`, `item_gifted`, `item_worn`, `level_up`, with the variant on every event.

Main measure: tokens spent on outfits per member over 14 days, the brief's metric. Outfits per member is watched beside it: her picks always include the cheapest, so outfits can rise faster than tokens. Guardrails: pack revenue per member over 30 days, refunds and disputes, generation cost per session. Go if tokens on outfits rise 20% or more with the interval above zero and no guardrail breached.

The readout is calibrated to Part 1: A's inputs give the Shop today at ~$3.0M a year across ~116,000 subscribers, and the value at full rollout is the measured lift × that figure ($0.6M at +20%, $1.2M at +40%).

## Walkthrough video (under 3 minutes)

1. **0:00–0:25 — The evidence.** 15% of members bought from a Shop that is weeks old, 7% three items. But on 21 Oct, three characters asked to go shopping: one refused, one stalled, one sent a picture she made up. None offered anything to buy. The intent is there; the product doesn't meet it.
2. **0:25–1:00 — Variant A.** Ask to go shopping: an improvised picture. Open the Shop, pick the French Maid costume, buy, gift, back to chat, ask her to wear it. Six taps, and she was never part of the choice.
3. **1:00–1:45 — Variant B.** Same member. She offers three outfits from the catalogue: the cheapest, one at the usual price, one a step up. Pick one: she wears it, the level moves. Three taps. Lower the balance and pick the dearest one: the top-up sheet opens in place, sized to the outfit and the member's pace ("550 gets 10% and lasts a week"), and the scene carries on.
4. **1:45–2:20 — The two rules.** Her picks keep every offer real and always include a cheaper one, so the scene can't push. The top-up rule is the AI-led stream's, reused.
5. **2:20–2:50 — The readout.** Tokens on outfits per member over 14 days, 9,850 per side on Premium Plus; the Shop today (~$3.0M a year) and what the lift is worth at full rollout; the go/hold rule and the guardrails. The numbers are synthetic; this is how the decision would be read.

## How AI was used to build it

The AI-led stream built a working prototype for a different idea (a top-up sheet on spicy video) with Claude as a coding agent: the rule and its tests first, then the page, then a headless-browser run of both variants. When the site check on 21 Oct showed Candy already selling exact-amount top-ups in Shorts, I moved the prototype to my lead initiative. Claude reused the phone, the sheet, the payment step, the event log and the readout, kept the top-up rule unchanged as the payment step inside the scene, and added the picks rule with its tests. Catalogue prices were read from my screenshots of 21 Oct. A headless browser ran both variants to confirm the tap counts and check for errors. About an hour, start to finish.

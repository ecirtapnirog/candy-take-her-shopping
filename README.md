# Take her shopping: prototype

The smallest testable slice of the lead initiative in the EverAI case: gifting rebuilt as a scene in the chat. If she offers gifts and outfits inside the story, do members spend more on them, and is it new money?

- **A (today, as seen on 21 Oct 2026):** asked to go shopping, the character improvises a picture with nothing to buy. The member then has two routes:
  - **The gift shelf in the chat:** 27 gifts at 5–999 tokens. 3 taps, or 5 if short, and the top-up preselects 350 tokens whatever the gift.
  - **The Candy Shop:** buy an outfit, gift it, come back and ask her to wear it. 6 taps.
- **B (the test):** she offers three real gifts or outfits at their real prices, picked around what this member usually spends. The member picks one and pays in place; if short, the top-up sheet opens in the scene. She wears it or shows it, and the relationship level moves. 3 taps, or 4 if short.

Characters, pictures and payments are placeholders. Gifts, outfits and prices are Candy's (chat and Shop, desktop, 21 Oct). No money moves.

## Run it

Open `index.html` in a browser. It works offline; the web font falls back. Tests: `node rules.test.js` (10 cases).

## How the console reads

It follows the discovery structure, top to bottom:

1. **Outcome: grow token spending.** The baseline lines it rests on: payers (B4), token value (B9) and token packs (B8). Two lines are computed here:
   - outfits today (G1), about $3.0M a year;
   - gifts today (G2), about $4.4M a year.
   
   So gifts and outfits today (G) come to about $7.4M. A result turns into money as lift × G, counted as bought tokens.
2. **Opportunity.** "I want to give her something that matters in our story." 32% have sent a gift, chosen from a shelf. 15% bought an outfit, outside the chat. Asked to go shopping, characters offer nothing.
3. **Solution.** A against B on the phone, with taps counted from asking to receiving. Then the two rules, each with the slider that drives it and a computed "so what".
4. **Assumptions, and what the test reads.** One row per assumption:
   - **Desirable:** share of members who buy.
   - **Viable:** tokens on gifts and outfits per member. This is the main measure; the bar is +20%.
   - **Viable, new money:** tokens on everything else, and pack revenue over 30 days.
   - **Usable:** taps.
   - **Feasible:** generation cost.
   - **Ethical:** disputes, and the share choosing the cheaper pick.
   
   Rows marked "simulated" come from stated assumptions. The rest can only be read in the real test.
5. **Decision, and what it is worth** on the baseline.

## Files

- `shopping.js`: the gift shelf, the Shop catalogue, and her three picks. The picks rule offers one item at the member's usual price, one a step up, one cheaper, and at least one outfit she can wear while any are left. Gifts can be given again, so the scene doesn't run out once all 16 outfits have been given. The model writes her lines; this rule decides what she may offer.
- `recommend.js`: the top-up rule, reused unchanged from the AI-led prototype. It recommends the smallest pack covering the item plus 3 days at the member's pace, and always shows the cheapest covering pack.
- `rules.test.js`: 6 cases for the picks (checked at every usual price from 0 to 999) and 4 for the top-up.
- `index.html`: the phone (both variants), the console and the event log.

## What the test records

`shop_intent`, `reply_improvised` (A), `offers_shown` (B), `item_selected`, `gift_shelf_opened`, `gift_sent`, `shop_opened`, `item_viewed`, `insufficient_shown`, `sheet_viewed`, `pack_selected`, `purchase_completed`, `item_bought`, `item_gifted`, `item_received`, `level_up`, with the variant on every event.

## Walkthrough video (under 3 minutes)

1. **0:00–0:25 — Outcome and opportunity (sections 1–2).** The goal is token spending, and gifts and outfits are about $7.4M a year on the baseline. 32% of members have given a gift and 15% bought an outfit. But giving happens on a shelf or in a store, and when asked to go shopping, the characters offer nothing.
2. **0:25–1:00 — A.** Ask to go shopping: an improvised picture. Give from the shelf: 27 gifts, chosen alone. Or go to the Shop for an outfit: buy, gift, come back, ask her to wear it. Six taps.
3. **1:00–1:40 — B.** Same member. She offers three: a gift, an outfit and a cheaper option, around what this member spends. Pick one: she wears it or shows it, and the level moves. Lower the balance: the top-up opens in the scene. In A, the same moment preselects 350 tokens whatever the gift.
4. **1:40–2:30 — What the test reads (section 4).** Row by row:
   - more members buy;
   - tokens on gifts and outfits rise about 40%, with the interval clear of zero, and the sample can detect 15%;
   - the new-money row, read only in the real test, is what proves the outcome.
   
   Lower B's share to 17% to show the decision turn to Hold.
5. **2:30–2:55 — Decision (section 5), and the path.** Go if the new-money row holds: about $3M a year on the baseline. The numbers are simulated; this shows how the decision would be read. Close: "The test is small on purpose; if it reads, this is the path": the trip together, gifts that open scenes, her wardrobe everywhere.

## How AI was used to build it

The AI-led stream built a working prototype for a different idea, a top-up sheet on spicy video, with Claude as a coding agent: the rule and its tests first, then the page, then a headless-browser run of both variants. The site check on 21 Oct showed Candy already sells exact-amount top-ups in Shorts, so I moved the prototype to my lead initiative.

Claude reused the phone, the sheet, the payment step, the event log and the readout. It kept the top-up rule unchanged as the payment step inside the scene, and added the picks rule with its tests. The gift shelf and Shop prices were read on the site in the browser on 21 Oct, without spending tokens. A headless browser ran every route (B, B short, A from the shelf, A short, A through the Shop) to confirm the tap counts and check for errors.

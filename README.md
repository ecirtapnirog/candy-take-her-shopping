# Take her out: prototype

The smallest testable slice of the lead initiative in the EverAI case: gifting and the Candy Shop rebuilt as a date inside the chat. Shopping is the opening act; the evening is the payoff. If she proposes both, at real prices, do members spend more in a session, and do they come back for another evening?

- **A (today, as seen on 21 Oct 2026 on a character the member created):** asked to go shopping and then out on a yacht with a good bottle of wine, she answers "you really know how to sweep a girl away" and offers nothing. A picture costs 2 tokens and is not on a yacht. The member gives from the gift shelf (27 emoji gifts, 5–999 tokens; a Horse Riding Day at 110 came back as a 15-second video and a photo) or leaves for the Candy Shop. Asked "what should we do next?", she proposes nothing.
- **B (the test):** shopping first: she offers three real gifts or outfits, priced around what this member usually spends; the member pays in place and she wears it. Then she proposes the evening: "A rare bottle, just us" (320) or "Sunset on the yacht" (999, the shelf's yacht price), leading with the one that fits this member's usual session, and always offering to stay in for free. The evening comes with her video, photos and a voice note, is saved to her profile, and ends with her suggesting the next one.

Characters, pictures and payments are placeholders; the yacht and wine illustrations are original drawings standing in for generated media. Gifts, outfits and prices are Candy's (chat and Shop, desktop, 21 Oct). No money moves.

## Run it

Open `index.html` in a browser. It works offline; the web font falls back. Tests: `node rules.test.js` (14 cases).

## How the console reads

It follows the discovery structure, top to bottom:

1. **Outcome: grow token spending.** The baseline lines from the main document (payers, spend per payer, heavy payers, token packs, value of a token). There is no public figure for what members spend on gifts today, so the initiative is sized on what it would take: an evening averages about 500 tokens ($50), and $1M a year is about 1,670 evenings a month, one heavy payer in five going out once a month.
2. **Opportunity.** "I want to take her somewhere, not send her an emoji." The 21 Oct session: the story works, the experience gift already turns into a video, and nothing comes next.
3. **Solution.** A against B on the phone, with taps and tokens counted for the whole session. Then the three rules: her three picks, the evening, and the top-up sized on the session.
4. **What the test reads.** One row per thing that must be true, with its measure and its bar:
   - **Desirable:** share of opening-act buyers who go on to an evening (up).
   - **Viable:** tokens per member on gifts, outfits and evenings over 14 days (the main measure; the bar is +10 tokens a member a fortnight, about $0.5M a year on Premium Plus).
   - **Viable, repeat:** share of evening-goers who go out again within 14 days (bar 15%).
   - **Viable, new money:** tokens on everything else, and pack revenue over 30 days.
   - **Usable:** tokens and taps in one session.
   - **Feasible:** generation cost per evening.
   - **Ethical:** disputes, sessions with three or more top-ups, and the share who choose to stay in.

   Under it, "Rehearse the readout with assumed numbers" shows how a result would be read, with made-up inputs you can change.
5. **Decision.** The go and hold rule in plain words, and what it is worth: about $0.5M at the bar, $1M at the target.

## Files

- `shopping.js`: the gift shelf, the Shop catalogue, the two evenings, and two rules. Her three picks: one item at the member's usual price, one a step up, one cheaper, and at least one outfit while any are left. The evening: she leads with the one closest to the member's usual session, always shows the other, and always offers to stay in for free. The model writes her lines; these rules decide what she may offer.
- `recommend.js`: the top-up rule, adapted from the AI-led prototype. It recommends the smallest pack covering the item plus the rest of a usual session (median of the last five), and always shows the cheapest pack that covers the item alone. A dear evening is not padded.
- `rules.test.js`: 6 cases for the picks, 3 for the evening, 5 for the top-up.
- `index.html`: the phone (both variants), the console and the event log.

## What the test records

`date_intent`, `reply_improvised` (A), `photo_received` (A), `offers_shown` (B), `item_selected`, `item_bought`, `evenings_shown` (B), `evening_selected`, `evening_bought`, `next_evening_suggested`, `next_evening_accepted`, `gift_shelf_opened`, `gift_sent`, `shop_opened`, `item_viewed`, `item_gifted`, `insufficient_shown`, `sheet_viewed`, `pack_selected`, `purchase_completed`, `tokens_spent`, `level_up`, `session_done`, with the variant on every event.

## Walkthrough video (about 2:40)

1. **0:00–0:20 — Outcome and opportunity (sections 1–2).** The goal is token spending. On my account this afternoon I asked my character to go shopping, then out on a yacht with a good bottle of wine. She loved it and offered nothing. A 110-token gift came back as a video of her riding by the water and a photo at sunset, so the media is there. Asked what next, she proposed nothing.
2. **0:20–0:50 — A.** The same moment, today: her reply, a 2-token picture, then the gift shelf, 27 emoji, the yacht at 999. "What should we do next?": nothing. Note the session: about 110 tokens and a dead end.
3. **0:50–1:35 — B.** Same member. Shopping first: three picks around what this member spends; buy one in place, she wears it. Then the evening: her pick, the wine or the yacht, and staying in free. Take the yacht: the video, the photos, her voice, saved to her profile, and "Paris next time?". Lower the balance: the top-up covers the evening and nothing more, because it is dearer than a usual session.
4. **1:35–2:15 — What the test reads (section 4).** Two main measures: tokens per member, bar +10 a fortnight, and the share who go out again, bar 15%, because one evening is a novelty and two is a habit. Open the rehearsal: with assumed numbers, +19 tokens and one in five going out again reads as go; drop the repeat share to 10% and it turns to Hold. New money and the guardrails can only be read in the real test.
5. **2:15–2:40 — Decision and the path (section 5).** At the bar, about $0.5M a year; the target is about $1M, one heavy payer in five going out once a month. The test is small on purpose. If it reads, more evenings, ordinary payers, and then brand partners inside the evening, as games and virtual worlds already do.

## How AI was used to build it

The AI-led stream built a working prototype for a different idea, a top-up sheet on spicy video, with Claude as a coding agent: the rule and its tests first, then the page, then a headless-browser run of both variants. I moved the prototype to my lead initiative and widened it twice: from outfits to gifts, then to the evening after testing it on my own account.

Claude reused the phone, the sheet, the payment step, the event log and the readout, kept the top-up rule as the payment step and changed it from tokens a day to tokens a session, and added the picks and evening rules with their tests. The account session on 21 Oct was run in the browser with Claude on the character I created, 114 tokens, recorded. A headless browser ran every route (B to the wine, B to the yacht short of tokens, B staying in, A from the shelf, A through the Shop) to check for errors.

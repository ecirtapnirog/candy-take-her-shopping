# Our night out: prototype

The smallest testable slice of the lead initiative in the EverAI case: gifting and the Candy Shop rebuilt as a night out inside the chat. Shopping is the opening act; the evening is the payoff. If she proposes both, at real prices, do members spend more in a session, and do they come back for another evening?

- **A (today, as seen on 21 Oct 2026 on a character the member created):** asked to go shopping and then out on a yacht with a good bottle of wine, she answers "you really know how to sweep a girl away" and offers nothing. A picture costs 2 tokens and is not on a yacht. The member gives from the gift shelf (27 emoji gifts, 5–999 tokens; a Horse Riding Day at 110 came back as a 15-second video and a photo) or leaves for the Candy Shop. Asked "what should we do next?", she proposes nothing. Today a gift already comes back as a photo or video of her with it or wearing it; the night out builds on that.
- **B (the test):** shopping first: she offers three real gifts or outfits, priced around what this member usually spends; the member pays in place and she wears it. Then she proposes the evening: "A rare bottle, just us" (320) or "Sunset on the yacht" (999, the shelf's yacht price), leading with the one that fits this member's usual session, and always offering to stay in for free. The evening comes with her video, photos and a voice note, is saved to her profile, and ends with her suggesting the next one.

Characters, pictures and payments are placeholders; the yacht and wine illustrations are original drawings standing in for generated media. Gifts, outfits and prices are Candy's (chat and Shop, desktop, 21 Oct). No money moves.

## Run it

Open `index.html` in a browser. It works offline; the web font falls back. Tests: `node rules.test.js` (14 cases).

## How the console reads

It follows the discovery structure, top to bottom:

1. **Outcome: grow token spending.** The baseline lines from the main document (paying users, ARPPU, heavy paying users, token packs, value of a token). There is no public figure for what members spend on gifts today, so the initiative is sized on what it would take: an evening averages about 500 tokens ($50), and $1M a year is about 1,670 evenings a month, one heavy paying user in five going out once a month.
2. **Opportunity.** "I want to take her somewhere, not send her an emoji." The 21 Oct session: the story works, the experience gift already turns into a video, and nothing comes next.
3. **Solution.** A against B on the phone, with taps and tokens counted for the whole session. Then the three rules: her three picks, the evening, and the top-up sized on the session.
4. **What the test reads.** Three questions, and what would stop it:
   - **1 · Do they go?** Share of members who buy an evening within 14 days; bar about 2% (≈190 of 9,850), the pace of 830 evenings a month across Premium Plus.
   - **2 · Do they come back?** Share of evening-goers who go out again within 14 days; bar 15%. One evening is a novelty, two is a habit.
   - **3 · Is it new money?** No drop in pack revenue per member over 30 days, or in spending on everything else.
   - **Stop if** card disputes rise, sessions with three or more top-ups rise, or an evening costs more than a third of its price to generate.

   Under it, "Rehearse the readout with assumed numbers" takes three made-up inputs for B and shows each question as Pass or Fail (question 3 is read in the real test) and an overall status: Go, or Not yet. For readers who know Teresa Torres' assumption types: question 1 is desirability, 2 and 3 are viability, and the stop line covers feasibility and the ethical risks; usability is the taps and tokens counted on the phone in section 3.
   - **Overall:** Go (extend to Premium, if question 3 and the stop line hold in the real test) or Not yet, with what to change for the question that fails. The money is counted in evenings, on the people who come back; the evenings a month behind $0.5M and $1M are in section 1.

## Files

- `shopping.js`: the gift shelf, the Shop catalogue, the two evenings, and two rules. Her three picks: one item at the member's usual price, one a step up, one cheaper, and at least one outfit while any are left. The evening: she leads with the one closest to the member's usual session, always shows the other, and always offers to stay in for free. The model writes her lines; these rules decide what she may offer.
- `recommend.js`: the top-up rule, adapted from the AI-led prototype. It recommends the smallest pack covering the item plus the rest of a usual session (median of the last five), and always shows the cheapest pack that covers the item alone. When an evening costs more than the member usually spends in a session, the pack covers that evening only, nothing extra.
- `rules.test.js`: 6 cases for the picks, 3 for the evening, 5 for the top-up.
- `index.html`: the phone (both variants), the console and the event log.

## What the test records

`date_intent`, `reply_improvised` (A), `photo_received` (A), `offers_shown` (B), `item_selected`, `item_bought`, `evenings_shown` (B), `evening_selected`, `evening_bought`, `next_evening_suggested`, `next_evening_accepted`, `gift_shelf_opened`, `gift_sent`, `shop_opened`, `item_viewed`, `item_gifted`, `insufficient_shown`, `sheet_viewed`, `pack_selected`, `purchase_completed`, `tokens_spent`, `level_up`, `session_done`, with the variant on every event.

## Walkthrough video (about 2:40)

1. **0:00–0:20 — Outcome and opportunity (sections 1–2).** The goal is token spending. On my account this afternoon I asked my character to go shopping, then out on a yacht with a good bottle of wine. She loved it and offered nothing. A 110-token gift came back as a video of her riding by the water and a photo at sunset, so the media is there. Asked what next, she proposed nothing.
2. **0:20–0:50 — A.** The same moment, today: her reply, a 2-token picture, then the gift shelf, 27 emoji, the yacht at 999. "What should we do next?": nothing. Note the session: about 110 tokens and a dead end.
3. **0:50–1:35 — B.** Same member. Shopping first: three picks around what this member spends; buy one in place, she wears it. Then the evening: her pick, the wine or the yacht, and staying in free. Take the yacht: the video, the photos, her voice, saved to her profile, and "Paris next time?". Lower the balance: the top-up covers the evening and nothing more, because the evening costs more than this member usually spends in a session.
4. **1:35–2:40 — What the test reads, and where it goes (section 4).** Three questions: do about 2% go out with her, do 15% of them come back (one evening is a novelty, two is a habit), and is it new money. Open the rehearsal: with made-up numbers, 3.6% go out and 20% come back, both pass: overall Go, extend to Premium. Drop the repeat share to 0.10 and question 2 fails: Not yet, make the next evening easier to say yes to, and test again. Close: the bar is about $0.5M a year, about 830 evenings a month, roughly 420 regulars going out twice; the target is $1M, one heavy paying user in five going out once a month. The test is small on purpose. If it works: more evenings, every paying user, then brand partners inside the evening.

## How AI was used to build it

The AI-led stream built a working prototype for a different idea, a top-up sheet on spicy video, with Claude as a coding agent: the rule and its tests first, then the page, then a headless-browser run of both variants. I moved the prototype to my lead initiative and widened it twice: from outfits to gifts, then to the evening after testing it on my own account.

Claude reused the phone, the sheet, the payment step, the event log and the readout, kept the top-up rule as the payment step and changed it from tokens a day to tokens a session, and added the picks and evening rules with their tests. The account session on 21 Oct was run in the browser with Claude on the character I created, 114 tokens, recorded. A headless browser ran every route (B to the wine, B to the yacht short of tokens, B staying in, A from the shelf, A through the Shop) to check for errors.

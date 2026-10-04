# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Portfolio visitors (recruiters, prospective clients, other developers) opening the demo to judge the author's front-end craft. They play a few rolls, try the slider and the auto-bet, and leave with an impression of quality.

## Product Purpose

Dice is a portfolio demo of a crypto-style dice game ("roll under / roll over"). It exists to show front-end and product craft: a fully client-side, provably-fair game with a configurable house edge, manual and automatic betting, and live statistics. Success means a visitor understands the game in seconds, enjoys a few rolls, and remembers the polish.

## Positioning

A complete, honest dice game that runs entirely in the browser: every roll is HMAC-SHA256(server seed, client seed:nonce:cursor) and can be verified, nothing is hidden behind a server.

## Operating Context

- Opened from a portfolio link, on desktop or phone, for a short session.
- Play money only: the balance starts at 1,000 USDC (fictitious); Deposit only adds tokens, Withdraw only removes them. No real transaction, no account, no backend.

## Capabilities and Constraints

- Static HTML/CSS/vanilla JS (index.html, styles.css, script.js). No build step, no framework.
- Game: Roll Under / Roll Over toggle, draggable threshold slider, synced Multiplier / Roll threshold / Win chance fields, house edge (default 0.10 %), bet amount and profit-on-win.
- Provably fair: server seed, client seed, nonce, Generate and Hash buttons; rolls 0–100 with 2 decimals.
- Auto-bet: base bet, number of bets (0 = infinite), on-win / on-loss reset or increase by %, stop on profit / loss, speed from 1 s to 0.001 s, start/stop, live log console.
- Stats: last roll, wins/losses, total bets, total P/L, highest / lowest balance, longest win and loss streaks. Reset clears stats and regenerates seeds, keeps the balance.
- Interface language: English only.

## Brand Commitments

- Name: "Dice". No other brand asset exists.
- Binding visual brief from the owner: the interface must look like a premium casino.
- Must not imitate any real casino or operator (name, branding, domain).

## Evidence on Hand

None: no users, testimonials, metrics, partners or licences. Never fabricate any. The demo must not imply real money, a gambling licence or real payouts.

## Product Principles

1. Honest by construction: it is play money and a demo, and the interface says so without hedging.
2. The game first: the roll, its result and the balance are always the clearest things on screen.
3. Verifiable fairness is the differentiator; make seeds and the hash easy to find, not buried.
4. Craft is the message: every state (idle, rolling, win, loss, auto-bet running, insufficient balance) is designed.

## Accessibility & Inclusion

WCAG 2.1 AA (owner's standing rule): contrast, full keyboard use including the slider, visible focus, win/loss never conveyed by colour alone, prefers-reduced-motion respected. Keep the existing responsible-play note.

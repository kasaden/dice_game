---
name: Dice
description: A dice table as a Belle Epoque private gaming room, tooled oxblood leather on dark lacquer, brass for everything you touch.
colors:
  lacquer: "#140b0a"
  lacquer-2: "#1d1210"
  lacquer-3: "#281917"
  oxblood: "#4a1a1e"
  oxblood-deep: "#351216"
  oxblood-well: "#2a0e11"
  brass: "#c29545"
  brass-hi: "#d6ab5d"
  brass-lo: "#a37a33"
  tooling: "rgba(194, 149, 69, 0.42)"
  tooling-soft: "rgba(194, 149, 69, 0.22)"
  bone: "#f1e7d2"
  bone-2: "#d2c2a8"
  bone-3: "#ad9c82"
  felt: "#2f6e4f"
  felt-text: "#8fd3a8"
  loss: "#8d2f27"
  loss-text: "#f0907f"
  lamplight: "#24150f"
  shadow-deep: "rgba(0, 0, 0, 0.85)"
typography:
  wordmark:
    fontFamily: "Bodoni Moda, Didot, Bodoni 72, Georgia, serif"
    fontSize: "34px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.22em"
    fontVariation: "'opsz' 96"
  result-number:
    fontFamily: "Bodoni Moda, Didot, Bodoni 72, Georgia, serif"
    fontSize: "clamp(72px, 10vw, 120px)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontVariation: "'opsz' 72"
  wordmark-mobile:
    fontFamily: "Bodoni Moda, Didot, Bodoni 72, Georgia, serif"
    fontSize: "26px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.22em"
  numeral:
    fontFamily: "Bodoni Moda, Didot, Bodoni 72, Georgia, serif"
    fontSize: "28px"
    fontWeight: 500
    lineHeight: 1.1
  numeral-mobile:
    fontFamily: "Bodoni Moda, Didot, Bodoni 72, Georgia, serif"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.1
  stat-value:
    fontFamily: "Bodoni Moda, Didot, Bodoni 72, Georgia, serif"
    fontSize: "24px"
    fontWeight: 500
    lineHeight: 1.2
  body:
    fontFamily: "Jost, Futura, Century Gothic, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tabular-nums"
  verdict:
    fontFamily: "Jost, Futura, Century Gothic, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    letterSpacing: "0.24em"
  label:
    fontFamily: "Jost, Futura, Century Gothic, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    letterSpacing: "0.12em"
  micro-label:
    fontFamily: "Jost, Futura, Century Gothic, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.12em"
  button:
    fontFamily: "Jost, Futura, Century Gothic, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.14em"
  help:
    fontFamily: "Jost, Futura, Century Gothic, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, Cascadia Mono, Consolas, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  frame: "9px"
  lg: "14px"
  pill: "999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "24px"
  "6": "32px"
  "7": "48px"
components:
  button-primary:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.lacquer}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "0 24px"
    height: "46px"
  button-primary-hover:
    backgroundColor: "{colors.brass-hi}"
  button-primary-disabled:
    backgroundColor: "{colors.lacquer-3}"
    textColor: "{colors.bone-3}"
  button-roll:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.lacquer}"
    rounded: "{rounded.sm}"
    height: "60px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.brass-hi}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "0 24px"
    height: "46px"
  input:
    backgroundColor: "{colors.oxblood-well}"
    textColor: "{colors.bone}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "46px"
  table-surface:
    backgroundColor: "{colors.oxblood}"
    rounded: "{rounded.lg}"
    padding: "32px"
  panel:
    backgroundColor: "{colors.lacquer-2}"
    rounded: "{rounded.lg}"
  plaque:
    backgroundColor: "{colors.lacquer-2}"
    textColor: "{colors.bone}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  direction-selected:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.lacquer}"
    rounded: "{rounded.sm}"
    height: "40px"
  dolly-tag:
    backgroundColor: "{colors.lacquer}"
    textColor: "{colors.bone}"
    rounded: "4px"
    padding: "1px 6px"
---

# Design System: Dice

## Overview

**Creative North Star: "The Croupier's Rail"**

A private gaming room at night: a tooled oxblood-leather table set on dark lacquer, lit from above by a single lamp. The table owns the screen; everything the visitor can touch is brass, everything they read is bone. The system is calm, ruled in single-pixel hairlines, and set in fixed-cell tabular figures so numbers never jitter. It is play money and says so; the room is a stage for craft, not a casino imitation.

The one signature device is the dolly, a brass marker that travels along the rail to where each roll landed and rests there with its value. The result is always one complete state: the huge Bodoni number, the word WIN or LOSS, and the profit.

**Key Characteristics:**
- Committed palette: lacquer ground, oxblood table, brass for action, bone for text.
- Brass hairlines as gold tooling inset on leather (1px and 2px, never glow).
- Bodoni Moda for numerals and the wordmark, Jost for all UI, JetBrains Mono only for hashes, seeds and formulas.
- Flat by default; depth comes from tonal layering, one inset bevel and soft ground shadows.
- Win and loss are always stated in words (WIN / LOSS, signed profit), colour is a second channel.

## Colors

A dark, warm, low-chroma room with one metal accent and two outcome hues kept inside the rail and its readouts.

### Primary
- **Antique Brass** (`brass`): every actionable surface (Roll, selected Under/Over, active tab underline, thumb, Stop while auto-bet runs), plus the rolled number once a result exists.
- **Polished Brass** (`brass-hi`): hover fills, focus rings, selected-tab text, secondary-button text, the dolly.
- **Worn Brass** (`brass-lo`): thumb edge and scrollbar thumb only.

### Secondary
- **Oxblood Leather** (`oxblood`): the table surface. **Oxblood Deep** (`oxblood-deep`) is the gap ring around the rail groove; **Oxblood Well** (`oxblood-well`) is the recessed fill for inputs and the Under/Over control.
- **Felt Green** (`felt`) and **Vermilion** (`loss`): the win and loss zones of the rail only. Their `-text` siblings (`felt-text`, `loss-text`) carry outcome text, signed profit and status messages on dark grounds.

### Neutral
- **Lacquer** (`lacquer`, `lacquer-2`, `lacquer-3`): page ground, panels and plaque, disabled fills.
- **Bone** (`bone`, `bone-2`, `bone-3`): primary text, secondary text and labels, tertiary and idle text.
- **Brass Tooling** (`tooling`, `tooling-soft`): the 1px rules, borders and inset frames, always brass at partial alpha.

### Named Rules
**The Gold-Means-Touch Rule.** Brass fills and brass text mark things you can act on, plus the rolled number and the dolly. Decorative surfaces use tooling alpha, never a solid brass fill.

**The Words-First Rule.** An outcome is never colour alone: WIN or LOSS is written, profit carries a sign, and the dolly tag repeats the value.

## Typography

**Display Font:** Bodoni Moda (Didot, Bodoni 72, Georgia, serif), variable optical size
**Body Font:** Jost (Futura, Century Gothic, system-ui, sans-serif)
**Label/Mono Font:** JetBrains Mono (ui-monospace fallback), hashes, seeds and formulas only

**Character:** High-contrast Didone numerals against a geometric sans: the salon's engraved figures beside a quiet, wide-tracked UI voice. Tabular figures are on globally.

### Hierarchy
- **Result number** (500, clamp(72px, 10vw, 120px), 1, opsz 72): the last roll, centre of the table. Under 640px it switches to opsz 36 and weight 600 so the hairlines survive small screens. Idle state is bone-3, active state is brass.
- **Wordmark** (600, 34px / 26px mobile, 1, 0.22em tracking, uppercase, opsz 96): DICE only.
- **Numeral** (500, 28px / 22px mobile, 1.1): balance on the plaque.
- **Stat value** (500, 24px, 1.2): stats panel.
- **Verdict** (Jost 600, 15px, 0.24em, uppercase): WIN / LOSS / idle word under the number.
- **Body** (Jost 400, 16px, 1.5): inputs use 500.
- **Label** (Jost 500, 11-13px, 0.10-0.16em, uppercase): field labels, tabs, panel titles, table heads.
- **Help** (Jost 400, 13px, 1.5, bone-3): notes; footer copy is capped at 72ch.
- **Mono** (JetBrains Mono 400, 12-13px): hash block, seed inputs, formula.

### Named Rules
**The Numerals-Are-Bodoni Rule.** Figures that are the point of the screen (result, balance, stat values) are Bodoni; figures inside controls and tables are Jost tabular.

**The Mono-Is-Evidence Rule.** JetBrains Mono appears only where the text is a verifiable string.

## Layout

A two-column grid on desktop (table 1.55fr, side column 1fr with a 340px minimum), a 24px gap, centred in a 1360px maximum width. At 1024px and below it stacks to one column, table first; at 640px and below gutters tighten from 24px to 16px, the three-field row becomes two columns with the first spanning, and the Roll button becomes sticky at the bottom of the viewport (12px inset) with a heavier ground shadow. At 340px and below two-column field rows collapse to one.

Spacing is a 4px-based scale (4, 8, 12, 16, 24, 32, 48) used through custom properties; rhythm inside the table is 24px between controls and 32px before the rail and the Roll button. Controls share one height (46px input and button, 40px segment, 60px Roll). Touch targets are at least 40px, mostly 46px.

## Elevation & Depth

Hybrid, mostly tonal: lacquer, lacquer-2 and oxblood layers separate surfaces; hairlines (tooling) do the ruling. There is no glow. Shadows are soft ground shadows only.

### Shadow Vocabulary
- **Table seat** (`box-shadow: 0 1px 0 rgba(241,231,210,0.06) inset, 0 18px 40px -18px rgba(0,0,0,0.8)`): the leather table lifts off the lacquer.
- **Plaque frame** (`inset 0 0 0 3px lacquer-2, inset 0 0 0 4px tooling-soft`): a double-ruled inset on the balance plaque.
- **Rail groove** (`0 0 0 1px tooling, 0 0 0 4px oxblood-deep, 0 0 0 5px tooling-soft`): concentric rings around the win/loss bar.
- **Brass button** (`0 6px 14px -8px rgba(0,0,0,0.8)`; mobile Roll `0 10px 24px -6px rgba(0,0,0,0.85)`): soft ground shadow under the primary action.
- **Thumb and dolly** (`0 3px 8px rgba(0,0,0,0.55)`, drop-shadow `0 2px 2px rgba(0,0,0,0.6)`): small lift for the two movable brass parts.
- **Input focus** (`0 0 0 1px brass-hi` plus a brass-hi border): focus reads as a doubled edge.

### Named Rules
**The Tooling-Not-Glow Rule.** Edges are ruled with brass hairlines at tooling alpha; light never radiates from anything.

## Shapes

Gently softened, never pill-shaped, except the rail groove. Radii: 6px on controls (buttons, inputs, tabs, segments), 8px on the plaque and the Under/Over frame, 14px on the table and panels, 4px on the dolly tag, 999px on the rail groove and 50% on the thumb. The table carries two inset tooled frames (2px at 9px inset, 1px at 14px inset) in brass tooling. Read-only inputs and the hash block use dashed borders to signal not-editable.

## Components

### Buttons
- **Shape:** 6px radius, 46px tall, 24px side padding, Jost 600 14px uppercase with 0.14em tracking.
- **Primary (Roll):** solid brass on lacquer text; Roll is full width, 60px tall, 16px with 0.24em tracking. Hover shifts to brass-hi; disabled is lacquer-3 with bone-3 text and no shadow; press nudges 1px down.
- **Secondary:** transparent, 1px tooling border, brass-hi text; hover brightens the border to brass and tints the fill at 8% brass.
- **Focus:** global 2px brass-hi outline with 3px offset.
- **Auto-bet state:** while auto-bet runs, Stop becomes solid brass and the table's fields, segment and slider drop to 45% opacity and stop taking pointer input, so the one live control burns brightest.

### Inputs / Fields
- **Style:** oxblood-well fill, 1px tooling border, 6px radius, 46px tall, 12px inner padding; labels above in 12px uppercase bone-2; units trail inside in bone-3.
- **Hover / Focus:** hover raises border alpha to 0.65; focus moves to brass-hi with a 1px ring.
- **Read-only:** transparent fill, dashed border.

### Direction control (Under / Over)
Two-option segment in an oxblood-well tray with a 3px inset; the selected option is a brass fill with lacquer text and weight 600; unselected text is bone-2, brightening on hover.

### Tabs
Uppercase 13px Jost labels in bone-3 on a hairline baseline; selected is brass-hi with a 2px brass underline; 50px tall, horizontally scrollable without a visible scrollbar. Panels share the lacquer-2 surface and the soft tooling border.

### Rail and Dolly (signature)
A 48px-tall rail: a 12px pill groove split into felt and vermilion zones (order flips for Over), a 30px brass round thumb with a lacquer centre dot, and a numeric scale beneath. The dolly is a small brass marker with a lacquer-outlined pin and a bone value tag above the rail; it slides to the roll position over 650ms with ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`) and its tag text turns felt-text or loss-text. It rests at the last roll and is hidden before the first.

### Result readout
One state block, minimum 190px tall (150px mobile): the Bodoni number, the verdict word, the detail line. On a fresh roll the number settles in over 420ms (opacity .35 to 1, 6px rise).

### Balance plaque
Lacquer-2 plate with tooling border and a double-ruled inset; label above, Bodoni amount with a Jost unit.

### History table
14px, right-aligned tabular columns, sticky 11px uppercase heads, 1px brass hairlines at 10% alpha between rows; the outcome column prints the word WIN or LOSS beside a signed profit coloured felt-text or loss-text; the scroll area is capped at 300px with a brass-lo scrollbar thumb.

### Motion
Transitions are 120-160ms with the shared ease-out; the dolly (650ms) and the result settle (420ms) are the only longer ones. With prefers-reduced-motion: reduce every animation and transition collapses to 0.01ms.

## Do's and Don'ts

### Do:
- **Do** keep brass for actions, the rolled number and the dolly, and ink everything else in bone or tooling.
- **Do** state outcomes in words (WIN / LOSS, signed profit) next to any green or vermilion.
- **Do** draw edges with 1px (2px for the table frame) brass tooling and keep depth tonal.
- **Do** keep numerals in Bodoni on the table and tabular Jost inside controls and tables.
- **Do** switch the result number to opsz 36, weight 600 under 640px.
- **Do** take every colour, radius and space from the custom properties on `:root`.

### Don't:
- **Don't** use slate panels, neon green, glowing gradients, or glow of any kind; the crypto-casino default and the earlier black-and-gold glow are rejected.
- **Don't** use gradient text.
- **Don't** put felt or vermilion fills outside the rail zones; outcome text uses the `-text` values.
- **Don't** set JetBrains Mono on anything that is not a hash, seed or formula.
- **Don't** imitate a real casino's name, branding or domain.

## Open decisions and carried defects (not rules)

- Web fonts are self-hosted in `fonts/` (variable woff2, latin subset, SIL OFL 1.1 licences beside them) and declared with `@font-face` at the top of styles.css; Bodoni Moda and Jost are preloaded. The page makes no third-party request. A new character outside the latin subset needs the matching subset added.
- Tiny uppercase tracked labels (11-13px, e.g. history heads, plaque label) are small-size labelling carried by the build; treat 11px as a floor, not a size to extend to new text.

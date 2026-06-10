# Astrocabula

A static multi-page site of traditional astrology cheatsheets, built with Astro.js.
Currently has one page (Essential Dignities); more reference pages are planned.

## Stack

- Astro (minimal template, TypeScript strict), no UI framework added yet.
- Plain CSS in component `<style>` blocks / `Layout.astro` global styles — no
  Tailwind or CSS framework.
- Dev: `npm run dev` (port 4321, Astro will bump to next free port if busy).

## Structure

- `src/layouts/Layout.astro` — shared page shell: header with site nav (add new
  pages' links here), footer with data attribution, global CSS (`:root`
  variables for colors, the `Astronomicon` and `Reforma1918` `@font-face`
  declarations).
- `src/components/DignitiesTable.astro` — renders the essential dignities table
  from `src/data/dignities.ts`. Rows alternate neutral shades (zebra striping);
  cells/list-items are tinted by `PLANET_COLORS` per the planet they represent
  (see "Color coding" and "Degree rulers" below). A `tfoot` "score row"
  (`.score-row`) shows the point value for each dignity column (see "Scoring
  row" below).
- `src/data/dignities.ts` — typed data for all 12 signs: throne (domicile),
  exaltation, triplicity (day/night/participant rulers), terms (Egyptian),
  faces (decanates), exile (detriment), fall, almuten by degree range.
- `src/pages/index.astro` (and `src/pages/pt/index.astro`) — homepage, uses
  `Layout` + `DignitiesTable`. No intro paragraph or separate scoring legend —
  the score row in the table covers that.

## Data sources

Transcribed from material the user provided in-conversation (not stored in the
repo):
- *Tabela de Dignidades Essenciais* © 2019 Helena Avelar & Luís Ribeiro,
  Academia de Estudos Astrológicos (PDF table — layout/column structure for the
  dignities table).
- A companion text reference (`essential_dignities_reference.txt`, not in repo)
  with per-sign breakdowns, scoring rules, planetary/sign attributes, fixed
  stars, and orb tables — only the essential-dignities portion has been used so
  far. The rest (planetary attributes, sign attributes, fixed stars, orbs) is
  unused but available for future cheatsheet pages.
- Attribution is rendered in the site footer (`Layout.astro`).

Known judgment calls baked into `dignities.ts`:

- Node exaltations/falls follow the standard opposite-sign tradition: North
  Node is exalted in Gemini and falls in Sagittarius; South Node is exalted in
  Sagittarius and falls in Gemini (all at 3°).
- Almuten entries are split into degree-range segments; co-almutens (ties) are
  represented as multiple planets in one `AlmutenEntry`.

## Astronomicon font

`public/fonts/Astronomicon.ttf` provides all glyphs (zodiac signs + planets),
loaded via `@font-face` in `Layout.astro` and applied to `.glyph` spans in
`DignitiesTable.astro`. Glyph-letter mapping (confirmed with the user):

- Signs (Aries → Pisces): `A B C D E F G H I J K L`
- Planets, Chaldaic order Moon → Saturn: `R S T Q U V W`
  (Moon=R, Mercury=S, Venus=T, Sun=Q, Mars=U, Jupiter=V, Saturn=W)
- Nodes: North Node = `g`, South Node = `i`

`PLANET_SYMBOLS` and each sign's `symbol` field in `dignities.ts` already use
these letters — don't revert to Unicode astrological symbols (they render as
colored emoji in some browsers, which was the original problem this solved).

## Reforma1918 font

`public/fonts/Reforma1918/*.woff2` (Blanca/Gris/Negra weights, each with an
italic) is the site-wide body font, declared via `@font-face` in
`Layout.astro` and listed first in `body { font-family: ... }` (falls back to
Iowan Old Style → Georgia → serif). Weight mapping: Blanca = 300, Gris =
normal, Negra = bold.

## Scoring row

`DignitiesTable.astro` renders a `tfoot` row (`tr.score-row`) below the sign
rows, showing the point value for each dignity type instead of the old
separate legend section (removed from `index.astro`/`pt/index.astro`):

- Throne +5, Exalt +4, Triplicities (single `colspan="3"` cell) +3, Terms +2,
  Faces +1, Exile −5, Fall −4.
- Almuten has no score — its cell shows the `t.table.almuten` label instead of
  a value.
- Both sticky sign columns (`col-sign`, `col-sign-end`) show the
  `t.table.score` label ("Score" / "Pontos").
- `.score-row` is `text-transform: uppercase` as a whole (covers the labels;
  has no effect on the numeric/symbol cells).
- `table.dignities tfoot td` needs the `table.dignities` prefix to win
  specificity over the base `table.dignities td { padding: 0 }` rule —
  without it, padding on the score row is silently overridden.

## UI conventions

- No text labels on sign/planet glyphs in the table — names are shown via the
  `title` attribute (hover tooltip) instead. Keep this pattern for new glyphs.
- Table cells (`td`) have `padding: 0` and `min-width: 60px` by default —
  individual columns add their own width/padding as needed (e.g.
  `td.col-terms { width: 20rem }`). Headers (`th`) keep normal padding.
- Sign rows alternate background via `tbody tr:nth-child(even)` (a neutral
  `#f2ede4`) — no element-based (Fire/Earth/Air/Water) row tinting anymore.
- `--accent` (`Layout.astro` `:root`) is a neutral warm grey (`#5c5347`), not a
  bright/purple accent — keep header/nav colors restrained. The header brand
  (home) link uses `--fg` (plain text color), not `--accent`. The lang
  switcher (`.lang-switcher`) is a single pill (`border-radius: 999px`,
  `overflow: hidden`) with the active language as a filled `--accent`
  segment — don't go back to per-link borders.

### Color coding (`PLANET_COLORS`)

`PLANET_COLORS` in `DignitiesTable.astro` maps each `Planet` to a pastel
background color. Apply it via inline `style` to whatever represents that
planet — a `td` (single-planet cells: Throne, Triplicities, Detriment,
Exaltation/Fall when present), an `<li>` (Faces/Almuten list rows), or a
ruler `.segment` (Terms/Faces rulers) — not to the `.glyph` span itself.
For Almuten ties (multiple co-rulers in one entry), use `planetsStyle()`,
which builds a hard-stop `linear-gradient` split evenly between each
planet's color.

Current palette choices (intentional, don't revert without asking):

- Venus: green (`#dcead2`) — moved here from Jupiter.
- Jupiter: royal blue (`#d3ddf6`).
- Saturn: grey (`#dadada`).
- Mercury: pastel yellow (`#f5edc2`, softened from the original term-segment
  yellow to fit the pastel palette), Mars: pink — unchanged from original
  term-segment colors.
- Sun: pale gold, Moon: pale silver-blue.
- Nodes (North/South): no associated color — `PLANET_COLORS` deliberately
  excludes them, so `planetStyle()`/`planetsStyle()` return no background for
  node cells (e.g. Gemini/Sagittarius exaltation and Sagittarius fall).

### Degree rulers (Terms & Faces)

Both the Terms and Faces columns render a 0–29° horizontal ruler via the
shared `.ruler` CSS classes (`.ruler`, `.segments`, `.segment`, `.ticks`,
`.ruler-glyph`), built from `DEGREE_TICKS` (`Array.from({length: 30}, (_, i) => i)`).
To replicate this pattern for a new degree-based column:

- The cell (`td.col-X`) must be `position: relative` with an explicit
  `width`; the `.ruler` div is `position: absolute; inset: 0` so it fills
  the cell's actual rendered height (percentage heights don't work on
  `auto`-height table cells, but `inset: 0` absolute positioning does).
- `.segments` is `position: absolute; inset: 0; overflow: hidden`. Each
  `.segment` is **absolutely positioned** (`left`/`width` as
  `(value / 30) * 100%`, `box-sizing: border-box`) — not flexbox. Ticks use
  the same `(i / 30) * 100%` formula for `left`. Using the same formula +
  positioning mechanism for both keeps segment edges and ticks pixel-aligned
  at any width (flexbox + absolute ticks drift due to differing sub-pixel
  rounding).
- Tick heights: `.tick.minor` = `0.25rem` (every degree), `.tick.medium` =
  `0.5rem` (every 5°), `.tick.major` = `100%` (segment-opening ticks). All
  ticks share one color (`rgba(43, 38, 34, 0.3)`) — majors aren't darker.
  The 0° tick is always skipped (`DEGREE_TICKS.filter((i) => i > 0)`).
- Terms: 5 unevenly-sized segments, ticks at every term's `from` degree are
  `major` and get a `.tick-labels` overlay (degree number, no background,
  positioned just right of the tick via `translateX(2px)`); `from === 0`
  isn't labeled.
- Faces: 3 fixed 10°-wide segments, no labels, and **no minor/medium
  ticks** — only `major` ticks at 10° and 20° (the decan boundaries).

## Verifying changes

No `chromium-cli` / system Playwright available. To screenshot during dev:
```bash
cd /tmp && npm install playwright --no-save   # first time only
npx playwright install chromium               # first time only
```
then a small script with `chromium.launch()` → `page.goto('http://localhost:PORT/')`
→ `page.screenshot(...)`. Remember to stop the Astro dev server when done
(`pkill -f "astro dev"`).

## Next steps (not started)

- Additional cheatsheet pages (planetary attributes, sign attributes, fixed
  stars, orbs) using the unused reference data described above.
- Shared nav in `Layout.astro` currently only links to "/" — extend as new
  pages are added.

# Astrocabula

A static multi-page site of traditional astrology cheatsheets, built with Astro.js.
Currently has one page (Essential Dignities); more reference pages are planned.

## Stack

- Astro (minimal template, TypeScript strict), no UI framework added yet.
- Plain CSS in component `<style>` blocks / `Layout.astro` global styles — no
  Tailwind or CSS framework.
- Dev: `npm run dev` (port 4321, Astro will bump to next free port if busy).
- `astro.config.mjs`: `output: "static"` (also built/served via the
  `Dockerfile`, nginx) and `trailingSlash: "always"` — internal links should
  include the trailing slash (e.g. `/pt/`, not `/pt`).

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
  row" below). Also renders `<DignitiesAccordion>` right after `.table-wrap`,
  so pages get the responsive pair from this one component (see "Mobile
  accordion" below).
- `src/components/DignitiesAccordion.astro` — mobile counterpart of the table
  (shown below 768px; see "Mobile accordion" below).
- `src/components/DegreeRuler.astro` — shared 0–30° degree-ruler used by both
  the table's body cells (Terms/Faces/Almuten) and the accordion (see "Degree
  rulers" below).
- `src/components/dignities-shared.ts` — helpers shared by the components
  above: `PLANET_COLORS`, `DEGREE_TICKS`, `symbol()`, `planetStyle()`,
  `planetsStyle()`, `tickClass()`, plus `makeLabels(lang)` — a factory
  returning the lang-bound label helpers `{ name, signName, dignityLabel,
triplicityLabel }` (avoids threading `lang` through every call).
- `src/data/dignities.ts` — typed data for all 12 signs: throne (domicile),
  exaltation, triplicity (day/night/participant rulers), terms (Egyptian),
  faces (decanates), exile (detriment), fall, almuten by degree range.
- `src/pages/index.astro` (and `src/pages/pt/index.astro`) — homepage, uses
  `Layout` + `DignitiesTable`. No intro paragraph or separate scoring legend —
  the score row in the table covers that.

## Data sources

Transcribed from material the user provided in-conversation (not stored in the
repo):

- _Tabela de Dignidades Essenciais_ © 2019 Helena Avelar & Luís Ribeiro,
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

## Joy badge

`JOY_SIGNS` (`dignities-shared.ts`) is the set of signs that are also that
sign's ruling planet's "sign of joy" (Venus/Taurus, Moon/Cancer, Sun/Leo,
Mercury/Virgo, Mars/Scorpio, Jupiter/Sagittarius, Saturn/Aquarius — the seven
single-domicile planets). For these signs, the throne/ruler cell gets a small
"J" badge — `<span class="tri-label">J</span>`, reusing the same corner-badge
class and styling as the triplicities' D/N/P labels — and its tooltip becomes
`joyLabel(planet)` ("Planet (Joy)" / "Planeta (Gáudio)") instead of the plain
planet name. Implemented in both `DignitiesTable.astro` (`td.col-throne`,
added to the `position: relative` cell list) and `DignitiesAccordion.astro`
(`.cell`, now `position: relative`, with its own `.tri-label` using fixed
`0.25rem` offsets instead of the table's `--tick-spacing`, and `font-family:
Georgia, Times, serif` so the "J" doesn't pick up Reforma1918). The English
"Throne" header/label was renamed to "Ruler" (`t.table.throne`); Portuguese
stays "Trono".

## Mobile accordion

`DignitiesAccordion.astro` replaces the table below 768px — the toggle is
CSS-only (`@media (max-width: 767px)`: `.table-wrap` hides in
`DignitiesTable.astro`, `.dignities-accordion` shows in the accordion's own
styles; both stay in the DOM — static site). It renders inside
`DignitiesTable.astro` after `.table-wrap`, so pages only ever use
`<DignitiesTable>`.

- One `<details name="dignities">` per sign — the shared `name` gives native
  exclusive-open (one sign at a time) with no JS; older browsers degrade to
  multi-open. The `<summary>` shows the sign glyph + localized name, styled
  like the table's `thead` (`#f0ebe2`, uppercase 600); `summary .glyph` resets
  `font-weight: normal` so Astronomicon isn't faux-bolded.
- Body order: Throne + Exaltation (two-up row), Triplicities (three-up),
  Terms ruler, Faces ruler, Exile + Fall (two-up row), Almuten ruler.
  Section labels reuse `t.table.*` with the score appended ("+5"… "−4";
  Almuten bare) — there's no score row on mobile. Exaltation is spelled in
  full (`t.table.exaltFull`), unlike the table's abbreviated header.
- If a sign has no exaltation (or no fall), that cell is omitted and Throne
  (or Exile) spans the full row (`.cell:only-child { grid-column: 1 / -1 }`) —
  no "—" placeholder on mobile.
- Cells follow the table conventions: `planetStyle()` tint on the cell,
  localized `title` tooltip on the cell, glyphs with no visible text label
  (the per-cell uppercase label names the dignity, not the planet).
- The scroll-shadow script in `DignitiesTable.astro` also listens to window
  `resize` — at mobile width the hidden `.table-wrap` has zero dimensions, so
  the load-time `update()` is a no-op until a resize back to desktop.
- `details[open] summary` and `summary:focus-visible` both get a lighter
  neutral background (`#f7f4ee`, vs. the default `#f0ebe2`) — a subtle hint
  for which sign is open/focused, alongside the chevron rotation.
- `.dignities-accordion *` has `outline: none` and
  `-webkit-tap-highlight-color: transparent` — no browser focus/tap outline
  anywhere in the accordion (summary, cells, ruler segments, etc.); the
  lighter background above is the only focus/open indicator.

## UI conventions

- No text labels on sign/planet glyphs in the table — names are shown via the
  `title` attribute (hover tooltip) instead. Keep this pattern for new glyphs.
- The `title` attribute is set on the whole `td` (not the inner `.glyph`
  span), so hovering anywhere in the cell shows the tooltip — this matches
  the ruler `.segment`s, which already cover the full cell via `inset: 0` and
  carry their own `title`. `table.dignities [title] { cursor: pointer }`
  gives a visual hint regardless of which element holds the attribute.
  Triplicity cells use `triplicityLabel()` to append the day/night/participant
  role to the planet name (e.g. "Mars (Night)").
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
- `table.dignities` overrides `--border` to `#a89c8c` — darker and more muted
  than the page-wide `--border` (`#c9bdac` in `Layout.astro`), scoped to the
  table only.
- The sticky sign columns' "scrolled" shadow is rendered by two
  `.sticky-shadow` divs (`.table-wrap` is `display: grid`, table and shadows
  share `grid-area: 1 / 1`), not `box-shadow` on the sticky cells — gradient
  overlays positioned at the sticky column edges, faded in via
  `.table-wrap.scrolled` / `.scrolled-end` (toggled by the existing scroll
  listener script). `.sticky-shadow-start`'s `left` and `.sticky-shadow-end`'s
  `right` are both `calc(var(--cell-min-width) - 1px)`, to align with the
  inset box-shadow borders below (not `var(--cell-min-width)` — that would
  leave a 1px gap).
- `border-collapse` doesn't carry a cell's collapsed border along when it
  becomes sticky and scrolls — the border stays with the (non-sticky)
  neighboring cell and scrolls out of view. So `th/td.col-sign` and
  `th/td.col-sign-end` get an extra `inset box-shadow` border on their inner
  edge (`-1px`/`1px` respectively) to "carry" that border, but **only**
  while `.table-wrap.scrolled` / `.scrolled-end` is set — otherwise it'd
  double up with the collapsed border from `col-throne`/`col-almuten`, which
  is still visible (and aligned) when not scrolled.

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

- Venus: green (`#DBF0DD`) — moved here from Jupiter.
- Jupiter: royal blue (`#DAD9EC`).
- Saturn: grey (`#E6E4E0`).
- Mercury: pastel yellow (`#FEF9D8`, softened from the original term-segment
  yellow to fit the pastel palette), Mars: pink (`#F5D8D8`) — unchanged from
  original term-segment colors.
- Sun: pale gold (`#FDEFD8`), Moon: pale silver-blue (`#E2E8EE`).
- Nodes (North/South): no associated color — `PLANET_COLORS` deliberately
  excludes them, so `planetStyle()`/`planetsStyle()` return no background for
  node cells (e.g. Gemini/Sagittarius exaltation and Sagittarius fall).

### Degree rulers (`DegreeRuler.astro`)

The Terms, Faces, and Almuten body rulers are one shared component,
`DegreeRuler.astro` (`entries` prop takes term/face/almuten entries —
single-`planet` entries are normalized to a `planets` array; almuten ties
get the `.split` diagonal via `planetsStyle()`). Boolean props: `fullTicks`
(minor/medium/major ticks at every degree) and `labels` (degree labels at
each segment's `from`, skipping 0°). The **header** rulers (degree scales in
`thead`) are a different shape and stay table-local (`.header-ruler` rules
in `DignitiesTable.astro`).

- Host contract: the component root is `.ruler { position: absolute;
inset: 0 }`, so the **host must be a positioned box with real rendered
  size** — the table's `td.col-terms`/`col-faces`/`col-almuten` are
  `position: relative` with explicit column widths (percentage heights don't
  work on `auto`-height table cells, but `inset: 0` does); the accordion
  hosts it in `.ruler-host { position: relative; height: 3.25rem }`.
- `.segments` is `position: absolute; inset: 0; overflow: hidden`. Each
  `.segment` is **absolutely positioned** (`left`/`width` as
  `(value / 30) * 100%`, `box-sizing: border-box`) — not flexbox. Ticks use
  the same `(i / 30) * 100%` formula for `left`. Using the same formula +
  positioning mechanism for both keeps segment edges and ticks pixel-aligned
  at any width (flexbox + absolute ticks drift due to differing sub-pixel
  rounding).
- Tick heights: `.tick.minor` = `0.25rem` (every degree), `.tick.medium` =
  `0.5rem` (every 5°), `.tick.major` = `100%` (segment-opening ticks, via
  `tickClass()`). All ticks share one color (`rgba(43, 38, 34, 0.3)`) —
  majors aren't darker. The 0° tick is always skipped
  (`DEGREE_TICKS.filter((i) => i > 0)`).
- Table usage: Terms and Almuten get `fullTicks labels`; Faces gets neither —
  only major ticks at 10°/20° (the decan boundaries; the 10°/20° labels live
  in the table's header ruler).
- Accordion usage: Terms, Almuten, **and Faces** all get `fullTicks labels`
  (there's no header ruler on mobile, so Faces shows its own 10°/20° labels).

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

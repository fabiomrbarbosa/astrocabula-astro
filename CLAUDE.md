# Astrocabula

A static multi-page site of traditional astrology cheatsheets, built with Astro.js.
Pages: Essential Dignities (`/`), Planetary Attributes (`/planets/`), Sign
Attributes (`/signs/`) — each with a Portuguese variant under `/pt/`.

## Stack

- Astro (minimal template, TypeScript strict), no UI framework added yet.
- Plain CSS in component `<style>` blocks / `Layout.astro` global styles — no
  Tailwind or CSS framework.
- Dev: `npm run dev` (port 4321, Astro will bump to next free port if busy).
- `astro.config.mjs`: `output: "static"` (also built/served via the
  `Dockerfile`, nginx) and `trailingSlash: "always"` — internal links should
  include the trailing slash (e.g. `/pt/`, not `/pt`).
- `npm run build` = `astro build` + `node scripts/generate-sw.mjs` (see "PWA /
  offline" below).
- `.dockerignore` keeps `node_modules`, `dist`, `.git`, and macOS junk
  (`.DS_Store` etc.) out of the Docker build context; `.gitignore` covers the
  same macOS patterns. The SW generator also excludes `.DS_Store` — three
  layers, because Finder recreates these files in `public/` and Astro copies
  `public/` verbatim into `dist/`.

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
- `src/components/MobileAccordion.astro` + `AccordionItem.astro` — shared
  shell for all three mobile accordions; `DignityCell.astro` and
  `PropsTable.astro` are the shared body building blocks (see "Mobile
  accordion" below).
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
- `src/i18n/index.ts` — all UI strings (`ui.en` / `ui.pt`): nav/page titles,
  per-table label maps (`table`, `planetsTable`, `signsTable`), weekdays,
  footer.
- `src/components/PlanetsTable.astro` + `PlanetsAccordion.astro`,
  `planets-shared.ts`, `src/data/planets.ts` — Planetary Attributes page
  (`src/pages/planets/`, `pt/planets/`): one column per planet, attribute
  rows grouped under full-width `th.section-header` rows (Nature, Affinity,
  Cycles, Planetary Years, Rulerships). See "Attribute tables" below. The
  Nature section's `moiety` field (half of `halfOrb`) is precomputed in
  `planets.ts` as a fraction string (e.g. `"4 1/2"`, not `"4.5"`) — the `°`
  is appended at render time, same as `halfOrb`. The "Moiety" label is used
  as-is in both `en` and `pt` (no Portuguese translation).
- `src/components/SignsTable.astro` + `SignsAccordion.astro`,
  `signs-shared.ts`, `src/data/signs.ts` — Sign Attributes page
  (`src/pages/signs/`, `pt/signs/`): one column per sign; ruler/exaltation/
  triplicities/terms/faces rows pull from `dignities.ts` via `dignitiesOf()`,
  the PDF-only attributes from `signs.ts`. `ELEMENT_COLORS`/`elementStyle()`
  (fire pink, earth green, air yellow, water periwinkle) live in
  `signs-shared.ts`.
- `src/components/accordion-animation.ts` — shared open/close animation used
  by all three accordions.

## Data sources

Transcribed from material the user provided in-conversation (not stored in the
repo):

- _Tabela de Dignidades Essenciais_ © 2019 Helena Avelar & Luís Ribeiro,
  Academia de Estudos Astrológicos (PDF table — layout/column structure for the
  dignities table).
- A companion text reference (`essential_dignities_reference.txt`, not in repo)
  with per-sign breakdowns, scoring rules, planetary/sign attributes, fixed
  stars, and orb tables — the essential-dignities, planetary-attributes and
  sign-attributes portions have been used. The rest (fixed stars, orbs) is
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
planet name. Implemented in `DignitiesTable.astro` (`td.col-throne`, added to
the `position: relative` cell list) and `DignityCell.astro` (`joy` prop —
used by both the Dignities and Signs accordions' ruler cells; its
`.tri-label` uses fixed `0.25rem` offsets instead of the table's
`--tick-spacing`, and `font-family: Georgia, Times, serif` so the "J"
doesn't pick up Reforma1918). The English "Throne" header/label was renamed
to "Ruler" (`t.table.throne`); Portuguese stays "Trono".

## Mobile accordion

Each page's accordion replaces its table below 768px — the toggle is
CSS-only (`@media (max-width: 767px)`: `.table-wrap` hides in the table
component, `.mobile-accordion` shows in `MobileAccordion.astro`; both stay
in the DOM — static site). Each accordion renders inside its table component
after `.table-wrap`, so pages only ever use the table component.

Shared components (all three accordions are thin compositions of these):

- `MobileAccordion.astro` — the `.mobile-accordion` wrapper: <768px swap,
  `--border: var(--border-strong)` override, the no-outline rule (see
  below), and the single `setupAccordionAnimation(".mobile-accordion")`
  call.
- `AccordionItem.astro` — one `<details name={group}>` with the
  glyph + name + chevron `<summary>` and a `.body` slot. The shared `name`
  gives native exclusive-open with no JS; older browsers degrade to
  multi-open. The summary is styled like the table `thead`s
  (`--surface-head`, uppercase 600); `summary .glyph` is a fixed
  `1.75rem` centered box at `font-weight: normal` (no Astronomicon
  faux-bold) that doubles as the tint chip on the Planets
  (`planetStyle()`) and Signs (`elementStyle()`) pages via the
  `glyphStyle` prop.
- `DignityCell.astro` — one planet-tinted cell: uppercase dignity label on
  top, bare glyph below, optional `degree` (`<sup>`), `role`
  (day/night/participant — tooltip only) and `joy` (J badge) props; the
  localized `title` lives on the cell. Used by the Dignities accordion
  (throne/exalt/triplicities/exile/fall) and the Signs accordion
  (ruler/exalt/triplicities).
- `PropsTable.astro` — label-left/value-right property table for the text
  attribute sections (Planets: all five sections; Signs:
  Nature/Attributes). Slotted children are alternating
  `.prop-label`/`.prop-value` spans (the grid items); labels sit on
  `--surface-head` (600 weight, **not** uppercase), values can hold markup
  (chips on the Planets page) and `.multiline` preserves line breaks. No
  tints on values (the Signs element row is plain text). `columns={n}`
  flips to n columns — labels on top, values beneath, same child order
  (column-major grid flow transposes) — used for Cycles and Planetary
  Years. Styled
  via `.props > :global(…)` so the slotted spans pick up the component's
  CSS.

Per-page notes:

- Dignities body order: Throne + Exaltation (two-up `.pair-row`),
  Triplicities (three-up `.tri-row`), Terms ruler, Faces ruler,
  Exile + Fall (two-up), Almuten ruler. Section labels reuse `t.table.*`
  with the score appended ("+5"… "−4"; Almuten bare) — there's no score row
  on mobile. Exaltation is spelled in full (`t.table.exaltFull`).
- Signs body order: Nature props table, Ruler + Exaltation (`.pair-row`,
  Dignities-style cells, no scores in the labels), Triplicities
  (`.tri-row`), Terms ruler, Faces ruler, Attributes props table.
- If a sign has no exaltation (or no fall), that cell is omitted and the
  remaining cell spans the full row (`.pair-row > :global(.cell:only-child)
  { grid-column: 1 / -1 }`) — no "—" placeholder on mobile.
- Cells follow the table conventions: `planetStyle()` tint on the cell,
  localized `title` tooltip on the cell, glyphs with no visible text label
  (the per-cell uppercase label names the dignity, not the planet).
- The scroll-shadow script in `DignitiesTable.astro` also listens to window
  `resize` — at mobile width the hidden `.table-wrap` has zero dimensions, so
  the load-time `update()` is a no-op until a resize back to desktop.
- `details[open] summary` and `summary:focus-visible` both get a lighter
  neutral background (`--surface-active`, vs. the default `--surface-head`) —
  a subtle hint for which item is open/focused, alongside the chevron
  rotation.
- `.mobile-accordion :global(*)` has `outline: none` and
  `-webkit-tap-highlight-color: transparent` — no browser focus/tap outline
  anywhere in the accordions (summary, cells, ruler segments, etc.); the
  lighter background above is the only focus/open indicator.

## Attribute tables (Planets & Signs)

`PlanetsTable.astro` and `SignsTable.astro` share one layout recipe (distinct
from the dignities table): a non-sticky `th.col-label` row-label column, one
column per planet/sign, full-width `th.section-header` group rows, and a
mobile accordion rendered after `.table-wrap` (same <768px CSS-only swap as
the dignities pair).

- **Emulated sticky header.** The `thead` must stick to the viewport while
  the wrap scrolls horizontally — impossible with real `position: sticky`,
  because an `overflow-x: auto` ancestor blocks page-relative vertical
  sticky at any width. Instead, a window scroll/resize listener (in each
  table's `<script>`) sets `--stick-y` (clamped so the header parks at the
  table's bottom edge) and `--thead-h` (measured) on `.table-wrap`, and
  `thead th { transform: translateY(var(--stick-y)) }` does the pinning.
  Only the header row sticks — the label column scrolls horizontally with
  the table (intentional; don't make it sticky).
- **Header shadow.** One full-width gradient strip per table — a single
  `.table-wrap::before` (not per-cell `::after`s): zero net height (8px tall,
  −8px margin), `transform: translateY(calc(var(--stick-y) + var(--thead-h)))`
  to sit just under the header, and `position: sticky; left: 0` so it pins
  to the visible left edge during horizontal scrolling (as an in-flow block
  its width is the wrap's visible width, not the table's). Faded in via
  `.stuck` (toggled by the same listener when `--stick-y > 0`).
- `.table-wrap` is `overflow-x: auto; overflow-y: hidden` — the vertical
  clip stops the shadow strip's last 8px from growing a vertical scrollbar
  at the table's bottom edge. (Per the no-max-height rule, the page does all
  vertical scrolling.)
- **Separate borders.** `border-collapse: separate; border-spacing: 0`, each
  border owned by exactly one cell (label column keeps its right border, the
  next cell drops its left; last column closes the right edge; header row
  closes the top) — collapsed borders don't travel with sticky/transformed
  cells.
- **Column stripes, not row zebra.** `tbody td:nth-child(even)` gets a
  neutral `--surface-stripe` against the `--bg` page background. Body cells
  carry no planet/element tint — color coding lives only in the `thead`
  (planet pastels on the planets table, `ELEMENT_COLORS` on the signs
  table).
- **Chips.** Planets inside body cells render as small `planetStyle()`-tinted
  `.chip` squares with glyph + `title` tooltip; **sign** chips (the planets
  table's Domicile/Exaltation rows) are tinted by their element
  (`elementStyle()`), desktop and mobile. Signs-table chips add a
  hairline border (node chips have no planet color and need a visible box).
  `.chip.with-label` (auto width) is used on the signs table for Terms
  (start degree after the glyph, e.g. "♀ 0°") and Faces (localized ordinal
  before the glyph — `signsTable.faceOrdinals`: "1st/2nd/3rd",
  "1.º/2.º/3.º") — desktop table only. On mobile, the Signs accordion has
  no chips (its dignities render as `DignityCell`s); the Planets accordion
  keeps plain chips inside `PropsTable` value cells.

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
- Sign rows alternate background via `tbody tr:nth-child(even)`
  (`--surface-stripe`) — no element-based (Fire/Earth/Air/Water) row tinting
  anymore.
- **Neutrals.** All neutral colors live in `Layout.astro` `:root` as a
  non-semantic light→dark ramp (`--neutral-0` `#faf8f4` … `--neutral-9`
  `#2b2622`, plus `--ink-rgb: 43, 38, 34` for `rgba()` alpha tints — ruler
  ticks, scroll-shadow gradients, chip hairlines). Components only ever use
  the semantic aliases assigned from the ramp: `--bg`, `--fg`, `--muted`,
  `--border`, `--border-strong`, `--accent`, `--surface-active`,
  `--surface-stripe`, `--surface-head`, `--surface-section`. New shades go
  into the ramp first, then get an alias — no raw hexes in components.
- `--accent` is a neutral warm grey (`--neutral-8`), not a bright/purple
  accent — keep header/nav colors restrained. The header brand (home) link
  uses `--fg` (plain text color), not `--accent`. The lang switcher
  (`.lang-switcher`) is a single pill (`border-radius: 999px`,
  `overflow: hidden`) with the active language as a filled `--accent`
  segment — don't go back to per-link borders.
- All three tables (and `MobileAccordion`) override `--border` to
  `var(--border-strong)` — darker and more muted than the page-wide
  `--border`, scoped to the tables/accordions only.
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

## PWA / offline

The whole site precaches on first visit (it's ~1.5 MB) and works fully
offline / installs to the home screen. Hand-rolled, no Workbox —
`@vite-pwa/astro` doesn't support Astro 6 (peer dep caps at 5); don't
force-install it.

- `scripts/generate-sw.mjs` runs after `astro build` (wired into the npm
  `build` script, which the `Dockerfile` uses too): walks `dist/`,
  content-hashes every file into the cache name (`astrocabula-<hash>`), and
  writes `dist/sw.js` with the precache list. HTML is cached under pretty
  URLs (`/pt/planets/`, not `pt/planets/index.html`) so navigations match
  cache keys. Excluded: unused `fonts/Reforma1969|2018`, `.DS_Store`, and
  `sw.js` itself.
- The SW is cache-first for same-origin GETs — safe because any deploy
  changes the hash → byte-different `sw.js` → browser reinstalls and the
  `activate` handler swaps the whole cache atomically. Offline navigations
  to uncached URLs fall back to `/`. With stock nginx headers, browsers
  re-check `sw.js` within 24h, so deployed updates can take up to a day to
  reach installed clients.
- Registration lives in `Layout.astro`'s head, gated on
  `import.meta.env.PROD` (`sw.js` doesn't exist under `astro dev`). The head
  also links `manifest.webmanifest`, `apple-touch-icon`, and a `theme-color`
  meta (`#faf8f4`).
- Icons: `public/icons/icon.svg` is the master — an astrological Sun glyph
  (pure SVG shapes, no font dependency) on the paper tone, kept inside the
  central 80% so the same art serves `purpose: maskable`. PNGs (192/512 +
  `apple-touch-icon.png` 180) are rendered from it via
  `qlmanage -t -s 1024 -o /tmp icon.svg` then `sips -z <size> <size>` (no
  rsvg/imagemagick on this machine). `favicon.svg` is the same glyph,
  transparent, with a `prefers-color-scheme: dark` color swap.
  `favicon.ico` is still the stock Astro one (no `.ico`-writing tool
  available; modern browsers use the SVG).

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

- Additional cheatsheet pages (fixed stars, orbs) using the unused reference
  data described above; add their links to the shared nav in `Layout.astro`.

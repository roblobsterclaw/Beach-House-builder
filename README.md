# Beach House Builder — LBI Cost Tracker & Estimator

A cost-tracking and estimating application for custom home builders on Long Beach Island, NJ.
Covers the full builder lifecycle: **knockdown of the existing house → new construction → handing keys at closing** (land and bank financing intentionally excluded).

## Run it

No installation, no server, no account. Open `app/index.html` in any browser (double-click it).
Everything runs locally; your pricing never leaves your machine.

## What it does

- **76 line items across 8 phases** (mapped to NAHB-style cost divisions): Pre-Construction & Permits, Demolition, Pilings & Foundation, Framing & Shell, Mechanical Systems, Interior Finishes, Site Work & Extras, Overhead & Closing.
- **One-click selections** where the market offers choices — siding (vinyl / Cedar Impressions / Hardie / natural cedar / mixed), roofing, decking, railings, flooring, cabinet tier, appliance tier, driveway, pool type.
- **Include/exclude toggles** on every line — extras like the elevator, pool, cabana, outdoor kitchen, generator, smart home, sauna, and rooftop deck are pre-loaded and off by default; flip them on to price a spec sheet in seconds.
- **Three prices per line:** researched *Market Low* / *Market High* for the LBI area (medium-to-high finish level), and **My Cost** — your own sub/supplier number, which overrides the market figure when entered. This is how you find out where your pricing beats (or trails) the market.
- **Actual column** for job costing a build in progress — enter invoiced amounts and compare budget vs actual, the discipline NAHB data says separates <3% variance builders from 8–15% variance builders.
- **Markup slider** showing sale price, gross profit, and the markup↔margin conversion (25% markup = 20% margin) so you never confuse the two.
- **Scales with square footage** — change heated SF and per-SF items plus scalable lump sums re-price automatically (defaults to 3,800 SF; lump sums calibrated at a 3,500 SF base).
- **Save/Load project files** (one JSON file per job), **CSV export** for Excel, and auto-save in the browser.

## Repo layout

```
app/index.html   — the application shell and styles
app/app.js       — estimating engine (pricing, toggles, save/load, CSV export)
app/catalog.js   — the LBI cost catalog: every line item, unit, and market range
docs/RESEARCH.md — the market research behind every number, with sources
```

## Updating prices

All pricing lives in `app/catalog.js` in plain, commented JavaScript — edit a `low`/`high`
number, refresh the browser, done. Your per-job overrides ("My Cost") are stored with each
saved project file, so catalog updates never overwrite your sub pricing.

# Market Research — LBI Custom Home Cost Tracking & Estimating

Research compiled July 2026 from four parallel investigations: (1) how the industry structures
cost tracking, (2) the LBI/coastal-NJ market specifically, (3) 2024–2026 installed pricing for
every major line item, and (4) builder markup/margin benchmarks. Sources are linked throughout.
This document is the basis for every default number in `app/catalog.js`.

---

## 1. How the industry tracks costs (and what this app borrows)

**NAHB cost codes.** The residential standard is the NAHB six-division cost-code structure,
sequenced in build order: 1000 Preparation/Preliminaries → 2000 Excavation & Foundation →
3000 Rough Structure → 4000 Full Enclosure → 5000 Finishing Trades → 6000 Completion &
Inspection. It ships as the default in Buildertrend, Buildern, and Procore's homebuilder
product. Our 8 phases map onto it, with LBI-specific splits (pilings get their own phase,
demolition gets its own phase, and outdoor-living extras get their own phase because that's
where the LBI market sells options).
Sources: [MCBIA NAHB cost codes](https://mcbia.org/nahb-standard-homebuilder-cost-codes/),
[Buildertrend NAHB codes](https://buildertrend.com/wp-content/uploads/2022/01/NAHB-Cost-Codes.xlsx),
[JLC on the NAHB chart of accounts](https://www.jlconline.com/business/using-the-nahb-chart-of-accounts-to-organize-your-business-finances_o)

**What commercial software does** (Buildertrend/CoConstruct, Buildxact, Procore, BuildBook,
UDA ConstructionOnline, Adaptive): a reusable **cost catalog**, selections/allowances that flow
into the budget, change orders, purchase-order **committed-cost** tracking, and
budget-vs-actual by cost code. The disciplines that matter most per the research:

- Track **Budget → Committed (signed PO/sub contract) → Actual (invoiced) → Projected final**
  per cost code. Committed-cost tracking surfaces overruns 2–4 weeks before the books do.
- Best-in-class residential builders hold job-cost variance **under 3%** of estimate; typical
  $500K–$3M builders run **8–15%**, mostly allowance drift and unbilled scope.
- Set allowances at realistic spec-level pricing and force big selections before contract —
  lowballed allowances are the classic margin killer (est. 20–35% of unexplained margin erosion).
- Contingency norms: **5% minimum / 10% realistic** once contracted; **10–20% for high-risk
  sites** — which describes coastal flood-zone lots; construction lenders want 10–15%.
- Draw schedules: 4–6 milestone draws of ~15–25% (foundation, framing, dry-in, MEP rough,
  finishes, final/CO) with 5–10% retainage.

The app implements the catalog, the selections, include/exclude options, budget (Market/My Cost)
vs Actual, and contingency as a line item. Committed-cost (PO) tracking is the logical v2.

**NAHB 2024 "Cost of Constructing a Home" survey** (avg 2,647 SF home, $428,215 construction
cost ≈ $162/SF national): stage shares of construction cost — interior finishes **24.1%**,
major systems rough-ins **19.2%**, framing **16.6%**, exterior finishes **13.4%**, foundations
**10.5%**, site work **7.6%**, final steps **6.5%**, other **2.1%**. Useful as a sanity check
on any estimate's shape (LBI shifts foundations up because of pilings and site work up because
of demo/flood compliance).
Sources: [NAHB 2024 survey](https://www.nahb.org/news-and-economics/housing-economics-plus/special-studies/special-studies-pages/cost-of-constructing-a-home-in-2024),
[ResiClub breakdown](https://www.resiclubanalytics.com/p/the-cost-breakdown-for-constructing-a-single-family-home-in-2024)

---

## 2. The LBI market

**Cost per SF.** Local baseline (BuyLBI) of $350–$400/SF now reads as a floor; 2025–26 NJ
custom/luxury guides put high-quality coastal work at **$400–$550/SF**, true high-end custom
(oceanfront, elevator, pool, roof deck) **$550–$800/SF**. Ziman Development says client builds
"typically start at $2M" before land. Coastal premium over inland NJ: +25–40%.

**Teardown.** LBI demo norm **$8–15k** (to ~$25k+ with tight access/large house), plus the
NJ-mandatory asbestos pre-demolition survey ($500–$1,500; abatement $2–10k if found), PSE&G
disconnect letter (free, **6–8 week lead time** — order early), gas cut/cap and water/sewer
witness fees, and a ~$100–$151 demo permit (Long Beach Twp). All-in: **$15k–$35k**.

**Flood-zone structure.** All new habitable LBI construction is on driven timber piles:
**$800–$2,500/pile installed**, typically **30–50 piles** for a ~3,500 SF home (engineer sets
count from borings). AE zones (most of the island): vented enclosures, flood vents at 1 sq in
per sq ft of enclosure (engineered vents ~$400–$550 installed). VE zones: open pile foundation,
breakaway walls, lowest horizontal member at/above BFE — meaningfully more expensive.

**⚠ NJ REAL rules (the big near-term variable).** NJDEP's Resilient Environments and
Landscapes rules (adopted 1/20/2026) add **+4 ft to the flood elevation standard** for coastal
new construction once the "legacy period" ends. Originally legacy eligibility ended
**July 20, 2026**, but on **June 1, 2026** the Sherrill administration proposed extending the
legacy period one year to **July 20, 2027** (virtual hearing held 7/7/2026; written comments
close 7/31/2026; adoption anticipated late summer 2026). Critically, DEP has said it will
**continue applying legacy provisions to eligible applications received on or after 7/20/2026
while the amendment is pending** — so pre-REAL standards remain usable in the interim, and the
practical deadline is expected to become July 20, 2027. Until adoption this remains a proposal;
DEP has also floated substantive changes to the rules themselves, so re-check status before
relying on it for a late-2026/2027 filing. The app carries the +4 ft impact as an optional
"REAL-rule elevation premium" line ($15k–$40k placeholder).
Sources: [NJDEP announcement 26/P026](https://dep.nj.gov/newsrel/26_0026/),
[DEP rule proposal 6/1/2026](https://dep.nj.gov/wp-content/uploads/rules/proposals/proposal-20260601a.pdf),
[CSG Law alert](https://www.csglaw.com/newsroom/csg-law-alert-dep-proposes-delaying-real-rule-implementation-until-july-2027/),
[Connell Foley](https://www.connellfoley.com/blog/njdep-publishes-one-year-extension-of-real-rules),
[NJ Monitor](https://newjerseymonitor.com/2026/05/29/nj-delays-new-flood-rules-for-further-changes/),
[LBT press release](https://www.longbeachtownship.com/lbts-press-release-regarding-the-nj-real-rules/)

**Permits.** NJ UCC fees are volume-based (LBT: $0.034/cu ft + subcode fees + DCA surcharge)
— a full custom-home permit package commonly lands **$3k–$8k+**, not the 1–2% of job cost seen
in other states. CAFRA: interior-island teardown lots are frequently exempt or qualify for
GP-6/permit-by-rule; oceanfront/dune lots can need consultants ($5k–$25k) and 3–6+ months.
Water connection (LBT) $3,000–$4,000; each borough sets its own fees.

**Timeline.** Design + permitting 3–6 months; construction **9–12 months** post-demo;
contract-to-keys **12–18 months**. LBI towns restrict summer construction activity, so the
standard rhythm is piles/framing in fall–winter, CO before the following summer.

**What LBI competitors advertise** (Ziman, Mancini, Shore Builders Group, Stonehenge,
Michael Pagnotta, Gold Leaf, Thomas J. Keller, JS Pro, JMS): reversed living, **3-stop
elevators**, **rooftop decks** (fiberglass/ipe, some with wet bars), **heated saltwater gunite
pools (~10x20)**, cabanas with bars/bunks/TVs, outdoor showers, outdoor kitchens, ipe and Azek
decking, cable rail, standing-seam metal accents, bunk rooms, smart-home packages. This list
is exactly the extras menu in the app — it's what buyers in this market are being shown.

---

## 3. The 3,500 SF baseline estimate (no land, no financing)

App defaults, "Market Mid" basis, standard selections (Cedar Impressions siding, architectural
asphalt roof, composite decks, cable rail, engineered hardwood, semi-custom cabinets, GE
Café-tier appliances, paver driveway, no pool/elevator/extras):

| Phase | Mid-basis estimate |
|---|---|
| 01 Pre-construction, design & permits | $87,500 |
| 02 Demolition & site prep | $45,500 |
| 03 Pilings & foundation | $125,500 |
| 04 Framing & shell | $440,550 |
| 05 Mechanical systems | $211,000 |
| 06 Interior finishes | $326,700 |
| 07 Site work & outdoor living (base) | $64,000 |
| 08 Overhead, contingency & closing | $150,750 |
| **Total** | **$1,451,500 ≈ $415/SF** |

With the popular option set (3-stop elevator + gunite saltwater pool + smart home) it runs
**$1,657,500 (~$474/SF)** — consistent with the researched $400–$550/SF band and the
"$2M starting point" positioning of the top local luxury firms, whose quotes include their
markup. At a 25% markup the base house sells around **$1.81M**; the optioned house around
**$2.07M**.

Use the app's Low/High buttons for the bracket, then overwrite line by line with your sub
pricing ("My Cost") — the delta between your number and the market column is your structural
cost advantage, line by line.

---

## 4. Markup & margin: what the competition does

**The math first: markup ≠ margin.** 25% markup on cost = 20% gross margin on price;
33% markup = 25% margin. Mispricing "30% margin" as 30% markup silently costs ~3 points.

| Benchmark | Figure |
|---|---|
| NAHB avg builder gross / net margin (FY2023, best since 2006) | **20.7% / 8.7%** |
| Builder profit share of new-home sales price (NAHB 2024) | **11.0%** |
| Cost-plus custom builder fee, typical | **10–20%** (avg ~15%) |
| Cost-plus fee, quality/luxury custom | **20–25%**; complex builds 30%+ |
| Fixed-price custom gross margin | **18–25%** (coaching orgs target 25%+) |
| Toll Brothers (public luxury comp) gross margin | **25.6–26.6%** (adj. ~27–28%) |
| Well-run spec builds, strong coastal markets | **20–32% gross** (needs ~25% if builder carries loan + commissions) |
| Custom contract vs spec | contract ≈ 5–10 points lower gross, zero inventory risk |
| Small custom builder overhead (2–6 homes/yr) | **8–13% of revenue** incl. owner comp |
| Fixed-price vs cost-plus (APB survey of 1,800+ builders) | fixed-price earns **~5 points more** gross margin |

**What this means for an LBI builder with strong repeat-sub pricing:**

- On **custom contract** work, 20–25% markup (17–20% margin) is squarely market for luxury
  coastal; below 18% markup you're underpriced for this segment.
- On **spec**, target **25–33% markup (20–25% margin)** — the luxury comps (Toll at ~26%+
  gross, Hamptons/coastal spec at 22–28%) support it, and you're carrying the market risk.
- The app's default is 25% markup = 20% margin; the slider shows both so the markup/margin
  trap is impossible.

**Profit levers ranked by evidence:**

1. **Price options at retail, not cost-plus.** Production builders run **30–50% margins on
   options/upgrades** and 50–100% markup on pool/landscape packages; buyers routinely add
   10–30% of base price in options. Your extras menu (elevator, pool, cabana, outdoor kitchen,
   roof deck, smart home) should carry a higher markup than the base house — that's the
   industry's single most reliable margin source. The app makes the options menu explicit;
   quote them as priced options, not allowances.
2. **Allowance discipline.** Realistic allowances, selections forced before contract, overages
   billed as change orders with markup + a fixed admin fee ($250–$500). Untracked allowances
   are the top cited margin leak.
3. **Cycle time.** Cutting 15 months to 12 saves carry, absorbs overhead faster, and adds a
   house per year with the same team. Your sub relationships are the asset here — schedule
   certainty is worth more than another point of sub discount.
4. **Fixed-price over cost-plus** where you can sell it — worth ~5 points of gross margin,
   and your 20 years of cost history (fed by this tool's actuals) is what makes fixed-price
   safe to offer.
5. **Spec/custom mix.** Contract work as guaranteed base load, 1–2 specs a year in A+
   locations to capture the extra 5–10 points plus land appreciation — the standard
   Hamptons/coastal model.
6. **Pre-negotiated annual sub pricing** (you already have this — worth ~3% of hard cost) and
   value engineering (simplified rooflines, optimized framing) worth 3–5% without visible
   quality loss.
7. **Charge for pre-construction/design** agreements instead of free estimating; tiered
   good/better/best finish packages lift project value 10–20%.

Full source lists live in the four underlying research reports; headline sources:
[NAHB Cost of Doing Business 2025](https://www.nahb.org/news-and-economics/press-releases/2025/04/nahbs-new-study-provides-statistics-and-data-on-builder-financial-performance),
[Eye On Housing](https://eyeonhousing.org/2025/03/builders-profit-margins-improved-in-2023/),
[APB on markup vs margin](https://blog.associationofprofessionalbuilders.com/how-much-is-a-builders-margin),
[Pro Builder margin vs markup](https://www.probuilder.com/home/article/55229316/margin-vs-markup-the-true-impact-of-pricing-decisions-on-home-builder-profits),
[Builder Magazine on option pricing](https://www.builderonline.com/products/building-construction-materials/the-value-of-options-design-center-and-options-process_o),
[Toll Brothers FY2025](https://investors.tollbrothers.com/news-and-events/press-releases/2025/12-08-2025-213057278)

---

## 5. Caveats

- Market ranges are planning-grade, assembled from 2024–2026 national cost guides adjusted to
  the coastal-NJ premium, plus LBI-specific sources where available. Bids vary with lot access,
  flood zone, and finish level. Confirm municipal fees with each borough's construction office.
- NAHB financial data is self-reported with a lag (FY2023 published April 2025). No audited
  margin data exists for private coastal luxury builders; Toll Brothers is the best public comp.
- The single biggest near-term budget variable is the **REAL-rule legacy deadline** — expected
  to move to July 20, 2027 via the pending DEP amendment (adoption anticipated late summer
  2026), with legacy standards applied in the interim; confirm status before each filing.

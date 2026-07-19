/* LBI cost catalog — installed-cost ranges (material + labor + sub markup)
   for a medium-to-high finish teardown/new build on Long Beach Island, NJ.
   Baseline home: 3,500 heated SF, reversed-living, piling foundation, V/AE zone.
   Ranges are market pricing; the builder's own sub pricing goes in "My Cost".

   Item fields:
     unit      display unit
     qty       default quantity (editable in app)
     sfFactor  if set, qty = heated SF x factor (overrides qty)
     low/high  unit-cost range (installed)
     scale     lump-sum grows with SF relative to 3,500 base
     included  default toggle state (false = offered extra, off by default)
*/
const CATALOG = {
  baseSqft: 3500,
  defaultMarkupPct: 25,
  phases: [

  { id: "soft", code: "01", name: "Pre-Construction, Design & Permits", items: [
    { id: "arch",    name: "Architecture & design", note: "Full plans, coastal custom; some builders use stock plans modified", unit: "LS", qty: 1, low: 18000, high: 45000, scale: true },
    { id: "eng",     name: "Structural / piling engineering", note: "Pile layout, hurricane uplift, sealed drawings", unit: "LS", qty: 1, low: 5000, high: 12000 },
    { id: "survey",  name: "Survey package", note: "Boundary + topo + flood elevation certificates (pre & post)", unit: "LS", qty: 1, low: 3000, high: 6500 },
    { id: "soil",    name: "Soil borings / geotech", note: "Sets pile depth & count", unit: "LS", qty: 1, low: 1500, high: 5000 },
    { id: "cafra",   name: "CAFRA permit / NJ DEP", note: "Interior lots often exempt or GP-6; oceanfront/dune lots need consultants & time", unit: "LS", qty: 1, low: 2000, high: 18000 },
    { id: "zoning",  name: "Zoning / engineering review, misc approvals", note: "Variance costs extra if nonconforming lot", unit: "LS", qty: 1, low: 1500, high: 6000 },
    { id: "permits", name: "Building permits (NJ UCC)", note: "Volume-based (LBT $0.034/cu ft) + all subcodes + DCA surcharge", unit: "LS", qty: 1, low: 4000, high: 9000, scale: true },
    { id: "util-fees", name: "Water / sewer / gas connection fees", note: "LBT water $3-4k; sewer/gas per borough", unit: "LS", qty: 1, low: 2000, high: 6000 },
    { id: "brisk",   name: "Builder's risk + liability insurance", note: "Course of construction policy, 12-18 month build", unit: "LS", qty: 1, low: 8000, high: 16000, scale: true },
    { id: "warranty", name: "NJ 10-yr new home warranty registration", note: "Required for CO on new construction", unit: "LS", qty: 1, low: 2000, high: 4500 },
  ]},

  { id: "demo", code: "02", name: "Demolition & Site Prep", items: [
    { id: "asb",     name: "Asbestos / hazmat survey & abatement", note: "NJ-mandatory pre-demo survey $500-1,500; abatement if found in siding/flooring", unit: "LS", qty: 1, low: 800, high: 8000 },
    { id: "discon",  name: "Utility disconnects & caps", note: "PSE&G letter free (6-8 wk lead); gas cut/cap, water/sewer witness fees", unit: "LS", qty: 1, low: 500, high: 2000 },
    { id: "demoh",   name: "Demolition of existing home + hauling", note: "Typical 1,200-2,000 SF cottage incl. demo permit & tipping; LBI norm $8-15k, more w/ tight access", unit: "LS", qty: 1, low: 10000, high: 25000 },
    { id: "clear",   name: "Site clearing / tree removal", unit: "LS", qty: 1, low: 2000, high: 7000 },
    { id: "erosion", name: "Erosion control / silt fence / construction fence", unit: "LS", qty: 1, low: 1200, high: 3000 },
    { id: "temput",  name: "Temp power, water & job toilet (full build)", unit: "LS", qty: 1, low: 3000, high: 5500 },
    { id: "dumps",   name: "Dumpsters during construction", note: "10-15 pulls over the job", unit: "LS", qty: 1, low: 8000, high: 15000, scale: true },
  ]},

  { id: "found", code: "03", name: "Pilings & Foundation", items: [
    { id: "piles",   name: "Timber pilings, driven", note: "CCA marine piles, 16-35 ft; typical 30-50 for 3,500 SF; count per engineer", unit: "EA", qty: 42, low: 800, high: 2000 },
    { id: "pilecap", name: "Pile caps / girders / connections", note: "Carrying beams, uplift hardware, cut-offs", unit: "LS", qty: 1, low: 12000, high: 25000, scale: true },
    { id: "bwalls",  name: "Breakaway walls / enclosure below BFE", note: "V-zone breakaway or AE-zone CMU with flood vents", unit: "LS", qty: 1, low: 15000, high: 32000, scale: true },
    { id: "vents",   name: "Engineered flood vents", note: "1 sq in per sq ft enclosed, min 2 per enclosure", unit: "EA", qty: 10, low: 350, high: 550 },
    { id: "slab",    name: "Ground-level slabs (garage / storage / patio)", unit: "SF", qty: 1200, low: 8, high: 14 },
    { id: "fill",    name: "Fill, backfill & rough grading", unit: "LS", qty: 1, low: 4000, high: 10000 },
    { id: "realrule", name: "NJ REAL-rule elevation premium", note: "+4 ft above BFE for post-legacy filings. Legacy period expected to extend to 7/20/2027 (DEP proposal 6/1/26, adoption late summer '26; legacy standards applied in interim)", unit: "LS", qty: 1, low: 15000, high: 40000, included: false },
  ]},

  { id: "shell", code: "04", name: "Framing & Shell",
    groups: [
      { id: "roofing", label: "Roofing selection", default: "asphalt", options: [
        { id: "asphalt", name: "Architectural asphalt (GAF/CertainTeed)", note: "130-mph rated shingle, synthetic underlayment, ice & water", unit: "SQ", qty: 42, low: 450, high: 700 },
        { id: "metal",   name: "Standing seam metal (aluminum)", note: "Aluminum for salt air; premium coastal look", unit: "SQ", qty: 42, low: 1100, high: 1800 },
        { id: "mixmetal", name: "Asphalt + metal accents", note: "Shingle field with metal porch/feature roofs", unit: "SQ", qty: 42, low: 650, high: 1000 },
        { id: "cedarroof", name: "Cedar shake roof", note: "Rare now; maintenance-heavy at the shore", unit: "SQ", qty: 42, low: 900, high: 1600 },
      ]},
      { id: "siding", label: "Siding selection", default: "cedarimp", options: [
        { id: "vinyl",    name: "Premium vinyl (D4/D5)", note: "Entry option; least common on new high-end LBI builds", unit: "SF", qty: 4200, low: 6, high: 9 },
        { id: "cedarimp", name: "Vinyl shake (CertainTeed Cedar Impressions)", note: "The LBI workhorse — shake look, no maintenance", unit: "SF", qty: 4200, low: 10, high: 15 },
        { id: "hardie",   name: "Fiber cement (Hardie lap/shingle)", note: "ColorPlus, HZ5 spec; shingle profile at the high end", unit: "SF", qty: 4200, low: 11, high: 17 },
        { id: "cedar",    name: "Natural white cedar shakes", note: "Classic shore look; weathers gray; premium labor", unit: "SF", qty: 4200, low: 12, high: 19 },
        { id: "mixed",    name: "Mixed: shake + board & batten accents", note: "Popular current look — gables/entries in B&B", unit: "SF", qty: 4200, low: 11, high: 16 },
      ]},
      { id: "decking", label: "Deck surface selection", default: "composite", options: [
        { id: "pt",        name: "Pressure-treated decking", unit: "SF", qty: 700, low: 25, high: 35 },
        { id: "composite", name: "Composite (Trex/TimberTech)", note: "Includes framing, fascia", unit: "SF", qty: 700, low: 40, high: 60 },
        { id: "ipe",       name: "Ipe hardwood", note: "Top-tier look, needs oiling", unit: "SF", qty: 700, low: 55, high: 80 },
        { id: "fbg",       name: "Fiberglass deck surfaces", note: "For rooftop/over-living-space decks", unit: "SF", qty: 700, low: 45, high: 65 },
      ]},
      { id: "railing", label: "Exterior railing selection", default: "cable", options: [
        { id: "vinylrail", name: "Vinyl railing", unit: "LF", qty: 160, low: 60, high: 90 },
        { id: "cable",     name: "Cable rail (alum/SS posts)", note: "The current LBI standard for views", unit: "LF", qty: 160, low: 130, high: 200 },
        { id: "glassrail", name: "Glass panel railing", unit: "LF", qty: 160, low: 200, high: 320 },
        { id: "comprail",  name: "Composite railing (Trex)", unit: "LF", qty: 160, low: 90, high: 140 },
      ]},
    ],
    items: [
    { id: "lumber",  name: "Lumber / structural package", note: "Framing lumber, LVLs, trusses/rafters, Zip sheathing, hurricane hardware", unit: "LS", qty: 1, low: 60000, high: 100000, scale: true },
    { id: "framelab", name: "Framing labor", note: "Incl. setting girders on piles, strapping, sheathing", unit: "SF", sfFactor: 1, low: 18, high: 28 },
    { id: "windows", name: "Window package (coastal-rated)", note: "Andersen 400/A-Series or Marvin, impact glass where required; ~30-38 openings", unit: "LS", qty: 1, low: 55000, high: 95000, scale: true },
    { id: "extdoors", name: "Exterior doors & sliders", note: "Entry, sliders/multi-slides to decks", unit: "LS", qty: 1, low: 15000, high: 40000, scale: true },
    { id: "azek",    name: "Exterior trim package (Azek/PVC)", note: "Fascia, rakes, window/door trim, columns, brackets", unit: "LS", qty: 1, low: 18000, high: 35000, scale: true },
    { id: "gutters", name: "Gutters & leaders (aluminum)", unit: "LS", qty: 1, low: 3000, high: 6000, scale: true },
    { id: "garage",  name: "Garage doors (2) + openers", note: "Coastal-rated, carriage style", unit: "LS", qty: 1, low: 5000, high: 12000 },
  ]},

  { id: "mech", code: "05", name: "Mechanical Systems", items: [
    { id: "plumb",   name: "Plumbing — rough & finish labor", note: "3.5-4.5 baths, kitchen, outdoor shower, gas lines", unit: "LS", qty: 1, low: 32000, high: 55000, scale: true },
    { id: "pfix",    name: "Plumbing fixtures allowance", note: "Kohler/Delta mid-high to Brizo/high-end", unit: "LS", qty: 1, low: 12000, high: 30000, scale: true },
    { id: "hvac",    name: "HVAC — 2-3 zone systems", note: "Gas furnace + AC or heat-pump; ducted, with dehumidification", unit: "LS", qty: 1, low: 32000, high: 58000, scale: true },
    { id: "elec",    name: "Electrical — 200-400A service, wiring, devices", note: "Incl. decora devices, exterior, deck lighting rough", unit: "LS", qty: 1, low: 32000, high: 58000, scale: true },
    { id: "lightfix", name: "Lighting fixture allowance", note: "Recessed + decorative", unit: "LS", qty: 1, low: 8000, high: 25000, scale: true },
    { id: "insul",   name: "Insulation — spray foam hybrid", note: "Closed cell at roof/floor over open piling, batts elsewhere", unit: "LS", qty: 1, low: 14000, high: 28000, scale: true },
    { id: "tankless", name: "Tankless water heater(s)", unit: "EA", qty: 1, low: 4500, high: 7500 },
    { id: "gasfp",   name: "Gas fireplace w/ surround", note: "Linear unit with tile/shiplap surround", unit: "EA", qty: 1, low: 8000, high: 18000 },
  ]},

  { id: "int", code: "06", name: "Interior Finishes",
    groups: [
      { id: "flooring", label: "Main flooring selection (~2,900 SF)", default: "engwood", options: [
        { id: "lvp",     name: "Luxury vinyl plank", note: "Waterproof; entry option for rentals", unit: "SF", qty: 2900, low: 8, high: 12 },
        { id: "engwood", name: "Engineered hardwood (wide plank oak)", note: "The high-end LBI default", unit: "SF", qty: 2900, low: 14, high: 22 },
        { id: "solid",   name: "Solid oak, site finished", unit: "SF", qty: 2900, low: 16, high: 25 },
      ]},
      { id: "cabinets", label: "Kitchen cabinetry tier", default: "semicustom", options: [
        { id: "semicustom", name: "Semi-custom (painted shaker, island)", unit: "LS", qty: 1, low: 30000, high: 50000 },
        { id: "custom",     name: "Full custom w/ pantry & bar builtins", note: "Inset doors, paint-grade custom shop", unit: "LS", qty: 1, low: 60000, high: 100000 },
      ]},
      { id: "appl", label: "Appliance package tier", default: "midhigh", options: [
        { id: "midhigh", name: "GE Café / KitchenAid / Bosch", note: "36\" range, panel-ready DW, French-door fridge", unit: "LS", qty: 1, low: 15000, high: 25000 },
        { id: "lux",     name: "Thermador / Sub-Zero & Wolf", note: "48\" range, column fridge/freezer, wine col.", unit: "LS", qty: 1, low: 35000, high: 65000 },
      ]},
    ],
    items: [
    { id: "drywall", name: "Drywall — hang, tape, finish", note: "Level 4, moisture board in baths", unit: "SF", sfFactor: 1, low: 7, high: 10 },
    { id: "trim",    name: "Interior trim, doors & millwork", note: "Solid-core doors, 5-1/4 base, casings, closets shelving", unit: "LS", qty: 1, low: 28000, high: 50000, scale: true },
    { id: "millfeat", name: "Feature millwork allowance", note: "Shiplap accents, coffered/tray ceilings, mudroom builtins, fireplace wall", unit: "LS", qty: 1, low: 8000, high: 25000, scale: true },
    { id: "stairs",  name: "Interior stairs & railings", note: "2-3 flights (reversed living), oak treads, cable or craftsman rail", unit: "LS", qty: 1, low: 12000, high: 30000 },
    { id: "paint",   name: "Painting — full interior + exterior trim", unit: "LS", qty: 1, low: 14000, high: 26000, scale: true },
    { id: "tile",    name: "Tile — baths & backsplashes, labor + material", note: "3.5-4.5 baths, curbless master option", unit: "LS", qty: 1, low: 22000, high: 45000, scale: true },
    { id: "counters", name: "Countertops — quartz kitchen + baths", unit: "LS", qty: 1, low: 10000, high: 22000, scale: true },
    { id: "vanities", name: "Vanities & bath cabinetry", unit: "LS", qty: 1, low: 8000, high: 20000, scale: true },
    { id: "shower",  name: "Frameless shower doors & mirrors", unit: "LS", qty: 1, low: 6000, high: 12000 },
    { id: "hardware", name: "Door hardware, bath accessories", unit: "LS", qty: 1, low: 3500, high: 8000 },
    { id: "laundry", name: "Laundry room build-out", note: "Cabinets, sink, W/D allowance", unit: "LS", qty: 1, low: 6000, high: 14000 },
  ]},

  { id: "site", code: "07", name: "Site Work, Outdoor Living & Extras",
    groups: [
      { id: "driveway", label: "Driveway selection", default: "pavers", options: [
        { id: "stone",   name: "Stone / gravel with borders", unit: "LS", qty: 1, low: 6000, high: 12000 },
        { id: "concrete", name: "Concrete", unit: "LS", qty: 1, low: 10000, high: 18000 },
        { id: "pavers",  name: "Paver driveway + walks", note: "The LBI high-end standard", unit: "LS", qty: 1, low: 18000, high: 35000 },
      ]},
      { id: "pool", label: "Pool (optional)", optional: true, default: null, options: [
        { id: "fbgpool", name: "Fiberglass pool pkg (small lot ~10x20)", note: "Shell, equipment, heater, basic patio; tight-access lots add", unit: "LS", qty: 1, low: 60000, high: 100000 },
        { id: "gunite",  name: "Gunite saltwater pool pkg (~10x20)", note: "Custom shape, heated, spa-ready, premium finish — the LBI spec-sheet standard", unit: "LS", qty: 1, low: 85000, high: 150000 },
      ]},
    ],
    items: [
    { id: "outshower", name: "Outdoor shower (enclosed, H&C)", note: "An LBI must-have", unit: "EA", qty: 1, low: 4000, high: 9000 },
    { id: "landscape", name: "Landscaping, sod & irrigation", note: "Coastal-tolerant package, stone beds", unit: "LS", qty: 1, low: 12000, high: 30000 },
    { id: "fence",   name: "Vinyl fencing", note: "Code-compliant pool fencing if pool selected", unit: "LS", qty: 1, low: 6000, high: 14000 },
    { id: "paverpatio", name: "Additional paver patio (pool/ground level)", unit: "SF", qty: 600, low: 22, high: 35, included: false },
    { id: "spa",     name: "Spa / hot tub", unit: "EA", qty: 1, low: 12000, high: 28000, included: false },
    { id: "cabana",  name: "Cabana / pool house", note: "Half bath + storage + counter", unit: "LS", qty: 1, low: 45000, high: 90000, included: false },
    { id: "outkitchen", name: "Outdoor kitchen", note: "Built-in grill, fridge, counter", unit: "LS", qty: 1, low: 15000, high: 40000, included: false },
    { id: "elevator", name: "Residential elevator (3-stop)", note: "Increasingly standard on high-end reversed-living builds", unit: "EA", qty: 1, low: 45000, high: 75000, included: false },
    { id: "roofdeck", name: "Rooftop deck w/ access", note: "Waterproof membrane + fiberglass/pedestal pavers, stair access", unit: "LS", qty: 1, low: 25000, high: 55000, included: false },
    { id: "generator", name: "Whole-house standby generator (22-26 kW)", unit: "EA", qty: 1, low: 12000, high: 20000, included: false },
    { id: "smart",   name: "Smart home / AV package", note: "Lighting scenes, cams, distributed audio, shades", unit: "LS", qty: 1, low: 12000, high: 45000, included: false },
    { id: "evchg",   name: "EV charger", unit: "EA", qty: 1, low: 1500, high: 3000, included: false },
    { id: "cvac",    name: "Central vacuum", unit: "LS", qty: 1, low: 2500, high: 5000, included: false },
    { id: "wetbar",  name: "Wet bar (family level)", note: "Cabinets, sink, beverage fridge, counter", unit: "LS", qty: 1, low: 9000, high: 20000, included: false },
    { id: "wine",    name: "Wine storage / cooled closet", unit: "LS", qty: 1, low: 8000, high: 22000, included: false },
    { id: "sauna",   name: "Sauna / cold plunge", unit: "LS", qty: 1, low: 12000, high: 30000, included: false },
    { id: "dumbw",   name: "Dumbwaiter", note: "Popular in reversed-living layouts", unit: "EA", qty: 1, low: 8000, high: 16000, included: false },
    { id: "shutters", name: "Storm shutters / screens (west-facing)", unit: "LS", qty: 1, low: 6000, high: 15000, included: false },
  ]},

  { id: "close", code: "08", name: "Overhead, Contingency & Closing", items: [
    { id: "super",   name: "Site supervision / project management", note: "12-14 month build; part of overhead if self-performed", unit: "LS", qty: 1, low: 40000, high: 70000, scale: true },
    { id: "genconds", name: "General conditions", note: "Small tools, equipment rental, weekly cleanup, punch labor", unit: "LS", qty: 1, low: 10000, high: 20000, scale: true },
    { id: "conting", name: "Contingency (~5% of hard cost)", note: "Price movement, unknowns, weather; adjust to taste", unit: "LS", qty: 1, low: 55000, high: 85000, scale: true },
    { id: "finalclean", name: "Final clean + window clean", unit: "LS", qty: 1, low: 2500, high: 4500 },
    { id: "cocosts", name: "CO inspections, misc fees, punch-out", unit: "LS", qty: 1, low: 2000, high: 5000 },
    { id: "legal",   name: "Attorney / title at closing (seller side)", unit: "LS", qty: 1, low: 2500, high: 5000 },
    { id: "rtf",     name: "NJ Realty Transfer Fee (seller pays)", note: "≈1% of sale price; enter your number for the deal", unit: "LS", qty: 1, low: 20000, high: 30000, included: false },
    { id: "commission", name: "Sales commission (spec builds)", note: "4-5% if listed; off for custom contract builds", unit: "LS", qty: 1, low: 90000, high: 140000, included: false },
    { id: "staging", name: "Staging & marketing (spec builds)", unit: "LS", qty: 1, low: 8000, high: 20000, included: false },
  ]},

]};

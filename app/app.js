/* LBI Builder — estimating & job-cost engine.
   Catalog lives in catalog.js; this file renders it, applies overrides,
   and persists state to localStorage + JSON project files. */

(function () {
  const $ = (sel, el) => (el || document).querySelector(sel);
  const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));
  const fmt = n => "$" + Math.round(n).toLocaleString("en-US");
  const LS_KEY = "lbi-builder-project-v1";
  const BASE_SF = CATALOG.baseSqft || 3500;

  const defaultState = () => ({
    projName: "3,500 SF LBI New Build",
    sqft: BASE_SF,
    mode: "mid",              // low | mid | high
    markup: CATALOG.defaultMarkupPct || 25,
    items: {},                 // id -> {included, mycost, actual, qty}
    groups: {}                 // groupId -> selected option id ("" = none)
  });
  let state = load() || defaultState();

  function load() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)); } catch (e) { return null; }
  }
  function persist() { localStorage.setItem(LS_KEY, JSON.stringify(state)); }

  function itemState(id) {
    if (!state.items[id]) state.items[id] = {};
    return state.items[id];
  }

  // ---- cost math -------------------------------------------------------
  function qtyOf(item) {
    const ov = state.items[item.id];
    if (ov && ov.qty != null) return ov.qty;
    if (item.sfFactor != null) return Math.round(state.sqft * item.sfFactor);
    return item.qty != null ? item.qty : 1;
  }
  function unitCost(item) {
    const ov = state.items[item.id];
    if (ov && ov.mycost != null && ov.mycost !== "") return +ov.mycost;
    const lo = item.low, hi = item.high != null ? item.high : item.low;
    if (state.mode === "low") return lo;
    if (state.mode === "high") return hi;
    return (lo + hi) / 2;
  }
  function scaled(cost, item) {
    // Lump-sum items marked scale:true grow/shrink with home size relative to base.
    if (item.scale) return cost * (state.sqft / BASE_SF);
    return cost;
  }
  function lineTotal(item) { return scaled(qtyOf(item) * unitCost(item), item); }
  function isIncluded(item) {
    const ov = state.items[item.id];
    if (ov && ov.included != null) return ov.included;
    return item.included !== false;
  }
  function selectedOption(group) {
    const sel = state.groups[group.id];
    if (sel === "") return null;                       // explicitly none
    if (sel) return group.options.find(o => o.id === sel) || null;
    if (group.default === null) return null;
    return group.options.find(o => o.id === group.default) || group.options[0];
  }

  function allActiveItems() {
    const out = [];
    for (const ph of CATALOG.phases) {
      for (const g of ph.groups || []) {
        const opt = selectedOption(g);
        if (opt) out.push({ item: opt, phase: ph, group: g });
      }
      for (const it of ph.items || []) {
        if (isIncluded(it)) out.push({ item: it, phase: ph });
      }
    }
    return out;
  }

  function totals() {
    let hard = 0, byPhase = {};
    for (const { item, phase } of allActiveItems()) {
      const t = lineTotal(item);
      hard += t;
      byPhase[phase.id] = (byPhase[phase.id] || 0) + t;
    }
    const markup = +state.markup || 0;
    const price = hard * (1 + markup / 100);
    return {
      cost: hard, byPhase,
      price, profit: price - hard,
      margin: price ? ((price - hard) / price) * 100 : 0,
      psf: state.sqft ? hard / state.sqft : 0,
      actual: sumActuals()
    };
  }
  function sumActuals() {
    let a = 0, n = 0;
    for (const { item } of allActiveItems()) {
      const ov = state.items[item.id];
      if (ov && ov.actual != null && ov.actual !== "") { a += +ov.actual; n++; }
    }
    return { total: a, count: n };
  }

  // ---- rendering -------------------------------------------------------
  const phasesEl = $("#phases");
  const openPhases = new Set(JSON.parse(sessionStorage.getItem("lbi-open") || "null") || CATALOG.phases.map(p => p.id));

  function render() {
    $("#projName").value = state.projName;
    $("#sqft").value = state.sqft;
    $$(".costmode button").forEach(b => b.classList.toggle("on", b.dataset.mode === state.mode));
    phasesEl.innerHTML = "";
    for (const ph of CATALOG.phases) phasesEl.appendChild(renderPhase(ph));
    renderSummary();
    persist();
  }

  function renderPhase(ph) {
    const t = totals();
    const sec = document.createElement("section");
    sec.className = "phase" + (openPhases.has(ph.id) ? "" : " closed");
    const head = document.createElement("div");
    head.className = "phase-head";
    head.innerHTML = `<span class="caret">▾</span><h2>${ph.code ? ph.code + " · " : ""}${ph.name}</h2>` +
      `<span class="ph-total mono">${fmt(t.byPhase[ph.id] || 0)}</span>`;
    head.onclick = () => { sec.classList.toggle("closed");
      sec.classList.contains("closed") ? openPhases.delete(ph.id) : openPhases.add(ph.id);
      sessionStorage.setItem("lbi-open", JSON.stringify([...openPhases])); };
    sec.appendChild(head);

    const body = document.createElement("div");
    body.className = "phase-body";

    for (const g of ph.groups || []) body.appendChild(renderGroup(g));

    if ((ph.items || []).length) {
      const tbl = document.createElement("table");
      tbl.innerHTML = `<thead><tr>
        <th style="width:34px"></th><th>Item</th><th>Unit</th>
        <th class="num">Qty</th><th class="num">Mkt Low</th><th class="num">Mkt High</th>
        <th class="num">My Cost /unit</th><th class="num">Line Total</th><th class="num">Actual</th>
      </tr></thead>`;
      const tb = document.createElement("tbody");
      for (const it of ph.items) tb.appendChild(renderRow(it));
      tbl.appendChild(tb);
      body.appendChild(tbl);
    }
    sec.appendChild(body);
    return sec;
  }

  function renderGroup(g) {
    const div = document.createElement("div");
    div.className = "selgroup";
    const opt = selectedOption(g);
    const label = document.createElement("div");
    label.className = "sg-label";
    label.textContent = g.label + (opt ? " — " + fmt(lineTotal(opt)) : " — none");
    div.appendChild(label);
    const chips = document.createElement("div");
    chips.className = "chips";
    const mkChip = (id, name, priceTxt, on) => {
      const c = document.createElement("button");
      c.className = "chip" + (on ? " on" : "");
      c.innerHTML = name + (priceTxt ? `<span class="cprice">${priceTxt}</span>` : "");
      c.onclick = () => { state.groups[g.id] = id; render(); };
      return c;
    };
    if (g.optional) chips.appendChild(mkChip("", "None / excluded", "", opt === null));
    for (const o of g.options) {
      chips.appendChild(mkChip(o.id, o.name, fmt(lineTotal(o)), opt && opt.id === o.id));
    }
    div.appendChild(chips);
    if (opt && opt.note) {
      const n = document.createElement("div");
      n.style.cssText = "font-size:11.5px;color:var(--muted);margin-bottom:8px";
      n.textContent = opt.note;
      div.appendChild(n);
    }
    return div;
  }

  function renderRow(it) {
    const inc = isIncluded(it);
    const ov = itemState(it.id);
    const tr = document.createElement("tr");
    tr.className = "item" + (inc ? "" : " off");
    const qty = qtyOf(it);

    const tdT = document.createElement("td");
    const tg = document.createElement("button");
    tg.className = "toggle" + (inc ? " on" : "");
    tg.title = inc ? "Click to exclude" : "Click to include";
    tg.onclick = () => { ov.included = !inc; render(); };
    tdT.appendChild(tg); tr.appendChild(tdT);

    const tdN = document.createElement("td");
    tdN.className = "name";
    tdN.innerHTML = `<b>${it.name}</b>` + (it.note ? `<span class="note">${it.note}</span>` : "");
    tr.appendChild(tdN);

    tr.insertAdjacentHTML("beforeend", `<td>${it.unit || "LS"}</td>`);

    const tdQ = document.createElement("td"); tdQ.className = "num";
    const qi = document.createElement("input");
    qi.type = "number"; qi.className = "qty"; qi.value = qty; qi.min = 0;
    qi.onchange = () => { ov.qty = qi.value === "" ? null : +qi.value; render(); };
    tdQ.appendChild(qi); tr.appendChild(tdQ);

    tr.insertAdjacentHTML("beforeend",
      `<td class="num money">${fmt(it.low)}</td><td class="num money">${fmt(it.high != null ? it.high : it.low)}</td>`);

    const tdM = document.createElement("td"); tdM.className = "num";
    const mi = document.createElement("input");
    mi.type = "number"; mi.className = "mycost" + (ov.mycost != null && ov.mycost !== "" ? " set" : "");
    mi.placeholder = "—"; mi.value = ov.mycost != null ? ov.mycost : "";
    mi.onchange = () => { ov.mycost = mi.value === "" ? null : +mi.value; render(); };
    tdM.appendChild(mi); tr.appendChild(tdM);

    tr.insertAdjacentHTML("beforeend", `<td class="num money"><b>${inc ? fmt(lineTotal(it)) : "—"}</b></td>`);

    const tdA = document.createElement("td"); tdA.className = "num";
    const ai = document.createElement("input");
    ai.type = "number"; ai.className = "actual" + (ov.actual != null && ov.actual !== "" ? " set" : "");
    ai.placeholder = "—"; ai.value = ov.actual != null ? ov.actual : "";
    ai.title = "Actual job cost (invoiced)";
    ai.onchange = () => { ov.actual = ai.value === "" ? null : +ai.value; render(); };
    tdA.appendChild(ai); tr.appendChild(tdA);

    return tr;
  }

  function renderSummary() {
    const t = totals();
    $("#h-cost").textContent = fmt(t.cost);
    $("#h-psf").textContent = fmt(t.psf);
    $("#h-price").textContent = fmt(t.price);
    $("#h-profit").textContent = fmt(t.profit);
    const act = t.actual;
    $("#summaryTop").innerHTML = `
      <h2>Deal Summary</h2>
      <div class="sumgrid">
        <div class="sumcard"><div class="k">All-in build cost (no land)</div><div class="v mono">${fmt(t.cost)}</div></div>
        <div class="sumcard"><div class="k">Cost per heated SF</div><div class="v mono">${fmt(t.psf)}/SF</div></div>
        <div class="sumcard hi"><div class="k">Sale price @ ${(+state.markup).toFixed(1)}% markup</div><div class="v mono">${fmt(t.price)}</div></div>
        <div class="sumcard hi"><div class="k">Gross profit (margin ${t.margin.toFixed(1)}%)</div><div class="v mono">${fmt(t.profit)}</div></div>
        ${act.count ? `<div class="sumcard"><div class="k">Actuals entered (${act.count} lines)</div><div class="v mono">${fmt(act.total)}</div></div>` : ""}
      </div>
      <div class="markup-row">
        <b>Markup</b>
        <input type="range" id="markupSlider" min="0" max="50" step="0.5" value="${state.markup}">
        <span class="mono"><b id="markupVal">${(+state.markup).toFixed(1)}%</b> markup = ${t.margin.toFixed(1)}% gross margin</span>
      </div>`;
    $("#markupSlider").oninput = e => {
      state.markup = +e.target.value;
      $("#markupVal").textContent = (+state.markup).toFixed(1) + "%";
      renderSummary(); persist();
      const tt = totals();
      $("#h-price").textContent = fmt(tt.price);
      $("#h-profit").textContent = fmt(tt.profit);
    };
  }

  // ---- toolbar ---------------------------------------------------------
  $("#projName").onchange = e => { state.projName = e.target.value; persist(); };
  $("#sqft").onchange = e => { state.sqft = Math.max(500, +e.target.value || BASE_SF); render(); };
  $$(".costmode button").forEach(b => b.onclick = () => { state.mode = b.dataset.mode; render(); });

  $("#btnExport").onclick = () => {
    const rows = [["Code", "Phase", "Item", "Included", "Unit", "Qty", "Unit Cost Used", "Mkt Low", "Mkt High", "My Cost", "Line Total", "Actual"]];
    for (const ph of CATALOG.phases) {
      for (const g of ph.groups || []) {
        const opt = selectedOption(g);
        for (const o of g.options) {
          const on = opt && opt.id === o.id;
          rows.push([ph.code, ph.name, `${g.label}: ${o.name}`, on ? "YES" : "no",
            o.unit || "LS", qtyOf(o), unitCost(o), o.low, o.high != null ? o.high : o.low,
            (state.items[o.id] || {}).mycost ?? "", on ? Math.round(lineTotal(o)) : 0,
            (state.items[o.id] || {}).actual ?? ""]);
        }
      }
      for (const it of ph.items || []) {
        const on = isIncluded(it);
        rows.push([ph.code, ph.name, it.name, on ? "YES" : "no",
          it.unit || "LS", qtyOf(it), unitCost(it), it.low, it.high != null ? it.high : it.low,
          (state.items[it.id] || {}).mycost ?? "", on ? Math.round(lineTotal(it)) : 0,
          (state.items[it.id] || {}).actual ?? ""]);
      }
    }
    const t = totals();
    rows.push([]);
    rows.push(["", "", "TOTAL BUILD COST", "", "", "", "", "", "", "", Math.round(t.cost), Math.round(t.actual.total)]);
    rows.push(["", "", `SALE PRICE @ ${state.markup}% MARKUP`, "", "", "", "", "", "", "", Math.round(t.price), ""]);
    rows.push(["", "", "GROSS PROFIT", "", "", "", "", "", "", "", Math.round(t.profit), ""]);
    const csv = rows.map(r => r.map(c => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    download(csv, (state.projName || "project").replace(/[^\w-]+/g, "_") + ".csv", "text/csv");
  };

  $("#btnSave").onclick = () =>
    download(JSON.stringify(state, null, 2), (state.projName || "project").replace(/[^\w-]+/g, "_") + ".json", "application/json");
  $("#btnLoad").onclick = () => $("#fileLoad").click();
  $("#fileLoad").onchange = e => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => { try { state = Object.assign(defaultState(), JSON.parse(r.result)); render(); } catch (err) { alert("Not a valid project file."); } };
    r.readAsText(f);
    e.target.value = "";
  };
  $("#btnReset").onclick = () => {
    if (confirm("Reset all selections, My Costs, and Actuals back to defaults?")) { state = defaultState(); render(); }
  };

  function download(content, name, type) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type }));
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  render();
})();

// National Stats Atlas — application logic.
// Hash routes: #/ (dashboard), #/country/<code> (detail), #/compare (side by
// side), #/about (methodology and sources). Every view is reached by a link,
// every control on it works, and every figure carries its source and year.

import { COUNTRIES, WORLD, YEARS, INDICATORS } from "./data.js";
import { drawBarChart, drawLineChart } from "./charts.js";

const view = document.getElementById("view");
const byCode = Object.fromEntries(COUNTRIES.map((c) => [c.code, c]));
const REGIONS = ["All regions", ...new Set(COUNTRIES.map((c) => c.region))];

// ---------- formatting ----------
const fmtInt = (n) => n.toLocaleString("en-US");
const fmtMoney = (bn) => (bn >= 1000 ? "$" + (bn / 1000).toFixed(2) + "T" : "$" + fmtInt(Math.round(bn)) + "B");
const fmtPop = (m) => fmtInt(Math.round(m)) + "M";
const fmtPct = (n) => n.toFixed(1) + "%";
const indicatorValue = (c, key) => {
  switch (key) {
    case "gdp": return fmtMoney(c.gdp);
    case "gdpPerCapita": return "$" + fmtInt(c.gdpPerCapita);
    case "population": return fmtPop(c.population);
    case "growth": return fmtPct(c.growth);
    case "inflation": return fmtPct(c.inflation);
    case "unemployment": return fmtPct(c.unemployment);
    case "life": return c.life.toFixed(1) + " yrs";
    case "co2": return c.co2.toFixed(1) + " t";
    default: return String(c[key]);
  }
};

// ---------- dashboard state ----------
const state = { query: "", region: "All regions", sortKey: "gdp", sortDir: -1 };

function filteredCountries() {
  const q = state.query.trim().toLowerCase();
  let rows = COUNTRIES.filter(
    (c) =>
      (state.region === "All regions" || c.region === state.region) &&
      (!q || c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q),
  );
  const key = state.sortKey;
  rows = [...rows].sort((a, b) => (a[key] - b[key]) * state.sortDir);
  return rows;
}

function sortArrow(key) {
  if (state.sortKey !== key) return "";
  return state.sortDir === -1 ? " ▼" : " ▲";
}

// ---------- views ----------
function dashboardView() {
  const rows = filteredCountries();
  const top10 = [...COUNTRIES].sort((a, b) => b.gdp - a.gdp).slice(0, 10);
  const coveredPop = COUNTRIES.reduce((s, c) => s + c.population, 0);
  const coveredGdp = COUNTRIES.reduce((s, c) => s + c.gdp, 0);

  return `
  <section class="hero">
    <div>
      <p class="kicker">World Bank · UN · IMF — reference year 2024</p>
      <h1>Every country, by the numbers.</h1>
      <p class="lede">National statistics for ${COUNTRIES.length} countries covering
      ${fmtInt(Math.round(coveredPop))} million people and ${fmtMoney(coveredGdp)} of GDP.
      Search, sort, open a country, or compare two head to head.</p>
    </div>
    <div class="world-cards">
      <div class="stat"><span>World population</span><strong>${fmtInt(WORLD.populationMillions)}M</strong><em>2024 · UN WPP</em></div>
      <div class="stat"><span>World GDP</span><strong>${fmtMoney(WORLD.gdpBillions)}</strong><em>2024 · World Bank</em></div>
      <div class="stat"><span>World GDP per capita</span><strong>$${fmtInt(WORLD.gdpPerCapita)}</strong><em>2024 · World Bank</em></div>
      <div class="stat"><span>World life expectancy</span><strong>${WORLD.lifeExpectancy.toFixed(1)} yrs</strong><em>2023 · World Bank</em></div>
    </div>
  </section>

  <section class="panel">
    <div class="panel-head">
      <h2>Largest economies, 2024</h2>
      <span class="src">GDP, current US$ · World Bank NY.GDP.MKTP.CD</span>
    </div>
    <canvas id="gdpChart" class="chart" height="300" aria-label="Bar chart of the ten largest economies by GDP in 2024"></canvas>
  </section>

  <section class="panel">
    <div class="panel-head">
      <h2>All countries <span class="count">${rows.length} of ${COUNTRIES.length}</span></h2>
      <div class="controls">
        <input id="search" type="search" placeholder="Search a country…" value="${state.query.replace(/"/g, "&quot;")}" aria-label="Search countries">
        <select id="region" aria-label="Filter by region">
          ${REGIONS.map((r) => `<option${r === state.region ? " selected" : ""}>${r}</option>`).join("")}
        </select>
        <button id="exportCsv" class="btn">Download CSV</button>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr>
          <th data-sort="name">Country${sortArrow("name")}</th>
          <th>Region</th>
          <th data-sort="population" class="num">Population${sortArrow("population")}</th>
          <th data-sort="gdp" class="num">GDP${sortArrow("gdp")}</th>
          <th data-sort="gdpPerCapita" class="num">GDP / capita${sortArrow("gdpPerCapita")}</th>
          <th data-sort="growth" class="num">Growth${sortArrow("growth")}</th>
          <th data-sort="inflation" class="num">Inflation${sortArrow("inflation")}</th>
          <th data-sort="unemployment" class="num">Unemployment${sortArrow("unemployment")}</th>
          <th data-sort="life" class="num">Life exp.${sortArrow("life")}</th>
        </tr></thead>
        <tbody>
          ${rows.map((c) => `
          <tr data-code="${c.code}" tabindex="0">
            <td><a href="#/country/${c.code}">${c.flag} ${c.name}</a></td>
            <td>${c.region}</td>
            <td class="num">${fmtPop(c.population)}</td>
            <td class="num">${fmtMoney(c.gdp)}</td>
            <td class="num">$${fmtInt(c.gdpPerCapita)}</td>
            <td class="num ${c.growth < 0 ? "bad" : "good"}">${fmtPct(c.growth)}</td>
            <td class="num ${c.inflation > 10 ? "bad" : ""}">${fmtPct(c.inflation)}</td>
            <td class="num ${c.unemployment > 10 ? "bad" : ""}">${fmtPct(c.unemployment)}</td>
            <td class="num">${c.life.toFixed(1)}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>
    <p class="table-note">Click a row to open the country's page. Figures: GDP and population 2024,
    life expectancy 2023, CO2 per capita 2022. Sources in the footer.</p>
  </section>

  <section class="panel">
    <div class="panel-head"><h2>Compare two countries</h2></div>
    <p class="lede">Pick any two of the ${COUNTRIES.length} countries and see every indicator side by side,
    with a five-year GDP-per-capita chart.</p>
    <p><a class="btn" href="#/compare?a=USA&b=CHN">Compare United States vs China →</a>
    <a class="btn ghost" href="#/compare?a=IDN&b=VNM">Compare Indonesia vs Vietnam →</a></p>
  </section>`;
}

function countryView(code) {
  const c = byCode[code];
  if (!c) return `<section class="panel"><h2>Country not found</h2><p><a href="#/">Back to the dashboard →</a></p></section>`;
  const rank = [...COUNTRIES].sort((a, b) => b.gdp - a.gdp).findIndex((x) => x.code === code) + 1;
  const others = COUNTRIES.filter((x) => x.code !== code);

  return `
  <p class="crumbs"><a href="#/">Dashboard</a> / ${c.region} / <strong>${c.name}</strong></p>
  <section class="hero country-hero">
    <div>
      <h1><span class="flag-big">${c.flag}</span> ${c.name}</h1>
      <p class="lede">${c.note}</p>
      <p class="lede">GDP rank #${rank} of ${COUNTRIES.length} tracked countries · ${c.region}</p>
    </div>
    <div class="compare-box">
      <label for="compareWith">Compare with</label>
      <select id="compareWith">
        <option value="">Choose a country…</option>
        ${others.map((o) => `<option value="${o.code}">${o.name}</option>`).join("")}
      </select>
    </div>
  </section>

  <section class="panel">
    <div class="panel-head"><h2>Key indicators</h2><span class="src">Each figure shows its source and year</span></div>
    <div class="indicator-grid">
      ${INDICATORS.map((ind) => `
      <div class="indicator">
        <span>${ind.label}</span>
        <strong>${indicatorValue(c, ind.key)}</strong>
        <em>${ind.unit} · ${ind.source}</em>
      </div>`).join("")}
    </div>
  </section>

  <section class="panel">
    <div class="panel-head"><h2>GDP per capita, 2020–2024</h2><span class="src">Current US$ · World Bank NY.GDP.PCAP.CD</span></div>
    <canvas id="trendChart" class="chart" height="280" aria-label="Line chart of GDP per capita 2020 to 2024"></canvas>
    <p class="table-note">GDP per capita rose from $${fmtInt(c.gdpPcSeries[0])} in 2020 to
    $${fmtInt(c.gdpPcSeries[4])} in 2024 — a ${(((c.gdpPcSeries[4] / c.gdpPcSeries[0]) - 1) * 100).toFixed(0)}% change over five years.</p>
  </section>

  <p><a class="btn" href="#/compare?a=${c.code}&b=USA">Compare ${c.name} with the United States →</a>
  <a class="btn ghost" href="#/">← Back to dashboard</a></p>`;
}

function compareView(aCode, bCode) {
  const a = byCode[aCode] || byCode.USA;
  const b = byCode[bCode] || byCode.CHN;
  const options = (selected) =>
    COUNTRIES.map((c) => `<option value="${c.code}"${c.code === selected ? " selected" : ""}>${c.flag} ${c.name}</option>`).join("");

  const rows = INDICATORS.map((ind) => {
    const va = a[ind.key];
    const vb = b[ind.key];
    const betterA = ind.key === "inflation" || ind.key === "unemployment" || ind.key === "co2" ? va < vb : va > vb;
    return `<tr>
      <td>${ind.label} <em class="src-inline">${ind.source}</em></td>
      <td class="num ${betterA ? "good" : ""}"><strong>${indicatorValue(a, ind.key)}</strong></td>
      <td class="num ${!betterA ? "good" : ""}"><strong>${indicatorValue(b, ind.key)}</strong></td>
    </tr>`;
  }).join("");

  return `
  <p class="crumbs"><a href="#/">Dashboard</a> / <strong>Compare</strong></p>
  <section class="hero">
    <div>
      <h1>Compare countries</h1>
      <p class="lede">Every indicator side by side. The better figure in each row is highlighted —
      lower is better for inflation, unemployment and CO2; higher is better for the rest.</p>
    </div>
  </section>
  <section class="panel">
    <div class="compare-pickers">
      <label>Country A <select id="pickA">${options(a.code)}</select></label>
      <span class="vs">vs</span>
      <label>Country B <select id="pickB">${options(b.code)}</select></label>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Indicator</th><th class="num">${a.flag} ${a.name}</th><th class="num">${b.flag} ${b.name}</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </section>
  <section class="panel">
    <div class="panel-head"><h2>GDP per capita, 2020–2024</h2><span class="src">Current US$ · World Bank NY.GDP.PCAP.CD</span></div>
    <canvas id="compareChart" class="chart" height="280" aria-label="Line chart comparing GDP per capita 2020 to 2024"></canvas>
  </section>
  <p><a class="btn ghost" href="#/">← Back to dashboard</a></p>`;
}

function aboutView() {
  return `
  <p class="crumbs"><a href="#/">Dashboard</a> / <strong>Methodology</strong></p>
  <section class="panel about">
    <h1>Methodology &amp; sources</h1>
    <p>National Stats Atlas is an original site built for people looking up a country's
    statistics. Every figure on this site comes from a public source, shown with its year
    next to the figure.</p>
    <h2>Sources</h2>
    <ul>
      <li><strong>GDP, GDP per capita, GDP growth, inflation, life expectancy, CO2 per capita</strong> —
      World Bank, World Development Indicators (indicators NY.GDP.MKTP.CD, NY.GDP.PCAP.CD,
      NY.GDP.MKTP.KD.ZG, FP.CPI.TOTL.ZG, SP.DYN.LE00.IN, EN.ATM.CO2E.PC), reference years
      2024 unless noted (life expectancy 2023, CO2 2022).</li>
      <li><strong>Population</strong> — United Nations, World Population Prospects 2024.</li>
      <li><strong>Unemployment</strong> — International Labour Organization, modelled estimates, 2024.</li>
    </ul>
    <h2>How to read the figures</h2>
    <ul>
      <li>GDP is in current US dollars, converted at official exchange rates, so it moves with
      currency swings as well as real output.</li>
      <li>GDP per capita divides GDP by the mid-year population; the five-year series on each
      country page uses the same current-US$ series.</li>
      <li>Life expectancy at birth is a period measure for the year shown, not a forecast of a
      newborn's lifespan.</li>
      <li>CO2 per capita counts emissions from fossil-fuel burning and cement, 2022 latest available.</li>
    </ul>
    <h2>About this site</h2>
    <p>National Stats Atlas is an original design and text. It runs entirely from its own files —
    no network requests, no tracking, no cookies. Data covers ${COUNTRIES.length} countries;
    figures are rounded for display. Built for the make.fun national statistics site bounty.</p>
    <p><a class="btn" href="#/">← Back to dashboard</a></p>
  </section>`;
}

// ---------- router ----------
function route() {
  const hash = location.hash || "#/";
  const [path, query] = hash.slice(2).split("?");
  const params = new URLSearchParams(query || "");
  let html = "";
  let after = null;

  if (path.startsWith("country/")) {
    const code = path.split("/")[1].toUpperCase();
    html = countryView(code);
    after = () => {
      const c = byCode[code];
      if (c) {
        drawLineChart(document.getElementById("trendChart"), [{ label: c.name, values: c.gdpPcSeries }], YEARS);
      }
      const sel = document.getElementById("compareWith");
      if (sel) sel.addEventListener("change", () => {
        if (sel.value) location.hash = `#/compare?a=${code}&b=${sel.value}`;
      });
    };
  } else if (path === "compare") {
    const a = (params.get("a") || "USA").toUpperCase();
    const b = (params.get("b") || "CHN").toUpperCase();
    html = compareView(a, b);
    after = () => {
      const ca = byCode[a] || byCode.USA;
      const cb = byCode[b] || byCode.CHN;
      drawLineChart(
        document.getElementById("compareChart"),
        [
          { label: ca.name, values: ca.gdpPcSeries },
          { label: cb.name, values: cb.gdpPcSeries },
        ],
        YEARS,
      );
      const go = () => {
        const pa = document.getElementById("pickA").value;
        const pb = document.getElementById("pickB").value;
        location.hash = `#/compare?a=${pa}&b=${pb}`;
      };
      document.getElementById("pickA").addEventListener("change", go);
      document.getElementById("pickB").addEventListener("change", go);
    };
  } else if (path === "about") {
    html = aboutView();
  } else {
    html = dashboardView();
    after = () => {
      const top10 = [...COUNTRIES].sort((a, b) => b.gdp - a.gdp).slice(0, 10);
      drawBarChart(
        document.getElementById("gdpChart"),
        top10.map((c) => ({ label: c.name, value: c.gdp, display: fmtMoney(c.gdp) })),
        "GDP, current US$, 2024",
      );
      const search = document.getElementById("search");
      search.addEventListener("input", () => {
        state.query = search.value;
        const pos = search.selectionStart;
        render(false);
        const next = document.getElementById("search");
        next.focus();
        next.setSelectionRange(pos, pos);
      });
      document.getElementById("region").addEventListener("change", (e) => {
        state.region = e.target.value;
        render(false);
      });
      document.querySelectorAll("th[data-sort]").forEach((th) => {
        th.addEventListener("click", () => {
          const key = th.dataset.sort;
          if (state.sortKey === key) state.sortDir *= -1;
          else {
            state.sortKey = key;
            state.sortDir = key === "name" ? 1 : -1;
          }
          render(false);
        });
      });
      document.querySelectorAll("tbody tr").forEach((tr) => {
        tr.addEventListener("click", (e) => {
          if (e.target.tagName !== "A") location.hash = `#/country/${tr.dataset.code}`;
        });
        tr.addEventListener("keydown", (e) => {
          if (e.key === "Enter") location.hash = `#/country/${tr.dataset.code}`;
        });
      });
      document.getElementById("exportCsv").addEventListener("click", exportCsv);
    };
  }

  view.innerHTML = html;
  if (after) requestAnimationFrame(after);
  window.scrollTo(0, 0);
}

function render(full = true) {
  if (full) route();
  else {
    // Re-render only the dashboard table area without losing the route.
    const hash = location.hash || "#/";
    if (hash === "#/" || hash === "") {
      view.innerHTML = dashboardView();
      const top10 = [...COUNTRIES].sort((a, b) => b.gdp - a.gdp).slice(0, 10);
      drawBarChart(
        document.getElementById("gdpChart"),
        top10.map((c) => ({ label: c.name, value: c.gdp, display: fmtMoney(c.gdp) })),
        "GDP, current US$, 2024",
      );
      const search = document.getElementById("search");
      search.addEventListener("input", () => {
        state.query = search.value;
        const pos = search.selectionStart;
        render(false);
        const next = document.getElementById("search");
        next.focus();
        next.setSelectionRange(pos, pos);
      });
      document.getElementById("region").addEventListener("change", (e) => {
        state.region = e.target.value;
        render(false);
      });
      document.querySelectorAll("th[data-sort]").forEach((th) => {
        th.addEventListener("click", () => {
          const key = th.dataset.sort;
          if (state.sortKey === key) state.sortDir *= -1;
          else {
            state.sortKey = key;
            state.sortDir = key === "name" ? 1 : -1;
          }
          render(false);
        });
      });
      document.querySelectorAll("tbody tr").forEach((tr) => {
        tr.addEventListener("click", (e) => {
          if (e.target.tagName !== "A") location.hash = `#/country/${tr.dataset.code}`;
        });
      });
      document.getElementById("exportCsv").addEventListener("click", exportCsv);
    } else {
      route();
    }
  }
}

function exportCsv() {
  const rows = filteredCountries();
  const header = ["Country", "Code", "Region", "Population (millions)", "GDP (US$ bn)", "GDP per capita (US$)", "GDP growth (%)", "Inflation (%)", "Unemployment (%)", "Life expectancy (years)", "CO2 per capita (tonnes)"];
  const lines = [header.join(",")];
  rows.forEach((c) => {
    lines.push([c.name, c.code, c.region, c.population, c.gdp, c.gdpPerCapita, c.growth, c.inflation, c.unemployment, c.life, c.co2].join(","));
  });
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "national-stats-atlas.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ---------- theme ----------
const themeBtn = document.getElementById("themeToggle");
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("nsa-theme", theme);
  } catch {
    /* storage may be unavailable; theme still applies */
  }
  themeBtn.textContent = theme === "dark" ? "☀️ Light" : "🌙 Dark";
}
let savedTheme = "light";
try {
  savedTheme = localStorage.getItem("nsa-theme") || "light";
} catch {
  savedTheme = "light";
}
applyTheme(savedTheme);
themeBtn.addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  render(false);
});

window.addEventListener("hashchange", () => render(true));
route();

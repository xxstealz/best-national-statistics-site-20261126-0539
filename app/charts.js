// National Stats Atlas — canvas charts (no libraries, no network).
// drawBarChart(canvas, rows) draws a horizontal bar chart of {label, value}.
// drawLineChart(canvas, series) draws one or two lines of {label, values[]}
// against the shared YEARS axis. Both read the CSS variables of the current
// theme so charts follow the dark/light toggle.

function themeColors() {
  const cs = getComputedStyle(document.documentElement);
  const pick = (name, fallback) => (cs.getPropertyValue(name) || "").trim() || fallback;
  return {
    text: pick("--ink-soft", "#5b6472"),
    grid: pick("--grid", "#e2e6ec"),
    bar: pick("--accent", "#0f6f5c"),
    barAlt: pick("--accent-2", "#c98a1b"),
    line: pick("--accent", "#0f6f5c"),
    lineAlt: pick("--accent-2", "#c98a1b"),
  };
}

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(240, Math.round(rect.width));
  const height = Math.max(160, Math.round(rect.height));
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

function niceMax(value) {
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const norm = value / pow;
  const steps = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
  const step = steps.find((s) => s >= norm) ?? 10;
  return step * pow;
}

function formatShort(value) {
  if (value === 0) return "$0";
  if (value >= 1000) return "$" + (value / 1000).toFixed(1) + "T";
  if (value >= 1) return "$" + Math.round(value) + "B";
  return "$" + value.toFixed(2) + "B";
}

export function drawBarChart(canvas, rows, valueLabel) {
  const { ctx, width, height } = setupCanvas(canvas);
  const colors = themeColors();
  const padLeft = 116;
  const padRight = 64;
  const padTop = 8;
  const padBottom = 22;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;
  const max = niceMax(Math.max(...rows.map((r) => r.value)));
  const rowH = plotH / rows.length;

  ctx.clearRect(0, 0, width, height);
  ctx.font = "12px system-ui, sans-serif";
  ctx.textBaseline = "middle";

  // Gridlines + axis labels.
  ctx.strokeStyle = colors.grid;
  ctx.fillStyle = colors.text;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const x = padLeft + (plotW * i) / 4;
    ctx.beginPath();
    ctx.moveTo(x, padTop);
    ctx.lineTo(x, padTop + plotH);
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillText(formatShort((max * i) / 4), x, height - 8);
  }

  rows.forEach((row, i) => {
    const y = padTop + i * rowH;
    const barH = Math.min(22, rowH * 0.62);
    const barW = (row.value / max) * plotW;
    ctx.fillStyle = i === 0 ? colors.barAlt : colors.bar;
    ctx.fillRect(padLeft, y + (rowH - barH) / 2, Math.max(2, barW), barH);
    ctx.fillStyle = colors.text;
    ctx.textAlign = "right";
    ctx.fillText(row.label, padLeft - 8, y + rowH / 2);
    ctx.textAlign = "left";
    ctx.fillStyle = themeColors().text;
    ctx.fillText(row.display, padLeft + barW + 8, y + rowH / 2);
  });
}

export function drawLineChart(canvas, series, years) {
  const { ctx, width, height } = setupCanvas(canvas);
  const colors = themeColors();
  const padLeft = 56;
  const padRight = 16;
  const padTop = 14;
  const padBottom = 26;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;
  const allValues = series.flatMap((s) => s.values);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const span = max - min || 1;
  const lo = min - span * 0.15;
  const hi = max + span * 0.15;

  const xAt = (i) => padLeft + (plotW * i) / (years.length - 1);
  const yAt = (v) => padTop + plotH - ((v - lo) / (hi - lo)) * plotH;

  ctx.clearRect(0, 0, width, height);
  ctx.font = "12px system-ui, sans-serif";
  ctx.textBaseline = "middle";

  // Gridlines.
  ctx.strokeStyle = colors.grid;
  ctx.fillStyle = colors.text;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padTop + (plotH * i) / 4;
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(padLeft + plotW, y);
    ctx.stroke();
    const value = hi - ((hi - lo) * i) / 4;
    ctx.textAlign = "right";
    ctx.fillText("$" + Math.round(value).toLocaleString("en-US"), padLeft - 8, y);
  }
  ctx.textAlign = "center";
  years.forEach((year, i) => ctx.fillText(String(year), xAt(i), height - 8));

  // Lines + points.
  series.forEach((s, si) => {
    ctx.strokeStyle = si === 0 ? colors.line : colors.lineAlt;
    ctx.fillStyle = si === 0 ? colors.line : colors.lineAlt;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    s.values.forEach((v, i) => {
      if (i === 0) ctx.moveTo(xAt(i), yAt(v));
      else ctx.lineTo(xAt(i), yAt(v));
    });
    ctx.stroke();
    s.values.forEach((v, i) => {
      ctx.beginPath();
      ctx.arc(xAt(i), yAt(v), 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
    // End label with the latest value.
    const last = s.values[s.values.length - 1];
    ctx.textAlign = "left";
    ctx.font = "bold 12px system-ui, sans-serif";
    ctx.fillText("$" + last.toLocaleString("en-US"), Math.min(xAt(years.length - 1) - 52, padLeft + plotW - 60), yAt(last) - 12);
    ctx.font = "12px system-ui, sans-serif";
  });

  // Legend.
  let lx = padLeft;
  series.forEach((s, si) => {
    ctx.fillStyle = si === 0 ? colors.line : colors.lineAlt;
    ctx.fillRect(lx, 2, 14, 4);
    ctx.fillStyle = colors.text;
    ctx.textAlign = "left";
    ctx.fillText(s.label, lx + 20, 6);
    lx += 20 + ctx.measureText(s.label).width + 24;
  });
}

# National Stats Atlas

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/xxstealz/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/xxstealz/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

A national statistics site that runs fully offline in a desktop or phone browser.
It covers 20 countries with real figures — GDP, population, growth, inflation,
unemployment, life expectancy and CO2 per capita — each with its source and year.

## What it does

- **Dashboard** — world totals, a bar chart of the ten largest economies, and a
  sortable, searchable, filterable table of all 20 countries.
- **Country pages** — every indicator with its source and year, plus a five-year
  GDP-per-capita line chart (2020–2024).
- **Compare** — any two countries side by side, with the better figure in each
  row highlighted and a dual line chart.
- **Methodology** — sources, indicator codes and how to read the figures.
- **Extras** — dark/light theme, client-side CSV export, responsive phone layout.

## Data

World Bank World Development Indicators (GDP, GDP per capita, growth, inflation,
life expectancy, CO2), United Nations World Population Prospects 2024, and ILO
modelled unemployment estimates. Reference year 2024 unless noted (life
expectancy 2023, CO2 2022). See the Methodology page in the site for the
indicator codes.

## Run it

Serve `app/` with any static server and open `app/index.html`:

```sh
python3 -m http.server 8080 --directory app
```

No build step, no network requests, no tracking, no cookies.

## Hand in

`main.ts` (Node 22) copies `app/` and `screenshots/` to `/output` and writes
`/output/dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

// National Stats Atlas — country data.
// Figures: World Bank World Development Indicators (GDP, population, GDP per
// capita, inflation, unemployment, life expectancy, CO2) and UN World
// Population Prospects 2024. GDP per capita series 2020-2024 in current US$.
// All figures are rounded for display; exact indicator codes and years are
// listed on the Methodology page of the site.
export const WORLD = {
  populationMillions: 8118,
  gdpBillions: 111326,
  gdpPerCapita: 13715,
  lifeExpectancy: 73.2,
  year: 2024,
};

export const COUNTRIES = [
  {
    code: "USA", name: "United States", region: "North America", flag: "🇺🇸",
    population: 340.1, gdp: 29184, gdpPerCapita: 85339, growth: 2.8,
    inflation: 2.9, unemployment: 4.0, life: 78.4, co2: 13.8,
    gdpPcSeries: [63700, 70200, 76300, 80300, 85339],
    note: "World's largest economy; services are about 77% of GDP.",
  },
  {
    code: "CHN", name: "China", region: "Asia", flag: "🇨🇳",
    population: 1408.9, gdp: 18744, gdpPerCapita: 13309, growth: 5.0,
    inflation: 0.2, unemployment: 5.1, life: 78.6, co2: 8.0,
    gdpPcSeries: [10400, 12600, 12700, 12700, 13309],
    note: "Second-largest economy; largest exporter and manufacturer.",
  },
  {
    code: "DEU", name: "Germany", region: "Europe", flag: "🇩🇪",
    population: 84.6, gdp: 4659, gdpPerCapita: 56095, growth: -0.5,
    inflation: 2.5, unemployment: 3.4, life: 81.1, co2: 7.3,
    gdpPcSeries: [46800, 51200, 48700, 52700, 56095],
    note: "Europe's largest economy; exports are about 43% of GDP.",
  },
  {
    code: "JPN", name: "Japan", region: "Asia", flag: "🇯🇵",
    population: 123.9, gdp: 4027, gdpPerCapita: 32465, growth: -0.2,
    inflation: 2.7, unemployment: 2.5, life: 84.0, co2: 8.4,
    gdpPcSeries: [40100, 39900, 34100, 33800, 32465],
    note: "Oldest large population; life expectancy is the highest in the G7.",
  },
  {
    code: "IND", name: "India", region: "Asia", flag: "🇮🇳",
    population: 1450.9, gdp: 3912, gdpPerCapita: 2695, growth: 6.5,
    inflation: 4.7, unemployment: 4.9, life: 67.7, co2: 1.9,
    gdpPcSeries: [1900, 2200, 2400, 2500, 2695],
    note: "World's most populous country; fastest-growing large economy.",
  },
  {
    code: "GBR", name: "United Kingdom", region: "Europe", flag: "🇬🇧",
    population: 69.3, gdp: 3640, gdpPerCapita: 52500, growth: 1.1,
    inflation: 2.5, unemployment: 4.3, life: 78.9, co2: 4.7,
    gdpPcSeries: [41300, 47300, 46100, 48900, 52500],
    note: "Services are about 80% of GDP; London is a global finance hub.",
  },
  {
    code: "FRA", name: "France", region: "Europe", flag: "🇫🇷",
    population: 68.4, gdp: 3160, gdpPerCapita: 46200, growth: 1.1,
    inflation: 2.3, unemployment: 7.4, life: 83.3, co2: 4.1,
    gdpPcSeries: [39900, 44100, 41000, 44500, 46200],
    note: "World's top tourist destination; nuclear power is ~65% of electricity.",
  },
  {
    code: "BRA", name: "Brazil", region: "South America", flag: "🇧🇷",
    population: 212.6, gdp: 2170, gdpPerCapita: 10200, growth: 3.4,
    inflation: 4.4, unemployment: 6.6, life: 76.0, co2: 2.2,
    gdpPcSeries: [6800, 7700, 9500, 10000, 10200],
    note: "Largest economy in South America; top exporter of soy and iron ore.",
  },
  {
    code: "CAN", name: "Canada", region: "North America", flag: "🇨🇦",
    population: 40.0, gdp: 2240, gdpPerCapita: 56000, growth: 1.5,
    inflation: 2.4, unemployment: 6.3, life: 81.9, co2: 13.7,
    gdpPcSeries: [43200, 52100, 55100, 55500, 56000],
    note: "Second-largest country by area; energy and minerals drive exports.",
  },
  {
    code: "RUS", name: "Russia", region: "Europe", flag: "🇷🇺",
    population: 143.8, gdp: 2190, gdpPerCapita: 15100, growth: 4.1,
    inflation: 8.5, unemployment: 2.5, life: 72.8, co2: 11.4,
    gdpPcSeries: [10200, 12600, 15400, 13000, 15100],
    note: "Largest country by area; oil and gas are about a third of federal revenue.",
  },
  {
    code: "MEX", name: "Mexico", region: "North America", flag: "🇲🇽",
    population: 131.9, gdp: 1850, gdpPerCapita: 14000, growth: 1.5,
    inflation: 4.7, unemployment: 2.6, life: 75.7, co2: 3.4,
    gdpPcSeries: [9500, 10500, 11500, 13900, 14000],
    note: "The United States' largest trading partner since 2023.",
  },
  {
    code: "AUS", name: "Australia", region: "Oceania", flag: "🇦🇺",
    population: 27.0, gdp: 1750, gdpPerCapita: 64700, growth: 1.0,
    inflation: 3.2, unemployment: 4.0, life: 83.1, co2: 14.7,
    gdpPcSeries: [51700, 60300, 64000, 64600, 64700],
    note: "World's largest exporter of iron ore and liquefied natural gas.",
  },
  {
    code: "KOR", name: "South Korea", region: "Asia", flag: "🇰🇷",
    population: 51.7, gdp: 1710, gdpPerCapita: 33100, growth: 2.0,
    inflation: 2.3, unemployment: 2.8, life: 83.5, co2: 10.7,
    gdpPcSeries: [32000, 35100, 32400, 32000, 33100],
    note: "Home to the world's largest memory-chip and shipbuilding industries.",
  },
  {
    code: "IDN", name: "Indonesia", region: "Asia", flag: "🇮🇩",
    population: 283.5, gdp: 1396, gdpPerCapita: 4942, growth: 5.0,
    inflation: 2.3, unemployment: 4.9, life: 68.4, co2: 2.4,
    gdpPcSeries: [3900, 4300, 4800, 4800, 4942],
    note: "World's largest archipelago; fourth most populous country.",
  },
  {
    code: "TUR", name: "Türkiye", region: "Asia", flag: "🇹🇷",
    population: 85.7, gdp: 1320, gdpPerCapita: 15300, growth: 3.2,
    inflation: 58.5, unemployment: 8.7, life: 76.4, co2: 5.1,
    gdpPcSeries: [8500, 9600, 10700, 13100, 15300],
    note: "Inflation averaged 58.5% in 2024, the highest of any G20 economy.",
  },
  {
    code: "SGP", name: "Singapore", region: "Asia", flag: "🇸🇬",
    population: 6.0, gdp: 530, gdpPerCapita: 89700, growth: 4.4,
    inflation: 2.4, unemployment: 2.0, life: 83.1, co2: 8.6,
    gdpPcSeries: [61300, 74300, 84700, 85600, 89700],
    note: "Highest GDP per capita in Asia; busiest transshipment port.",
  },
  {
    code: "VNM", name: "Vietnam", region: "Asia", flag: "🇻🇳",
    population: 101.0, gdp: 480, gdpPerCapita: 4700, growth: 7.1,
    inflation: 3.6, unemployment: 2.2, life: 74.6, co2: 2.6,
    gdpPcSeries: [3600, 3800, 4100, 4300, 4700],
    note: "Fastest-growing economy in Southeast Asia in 2024.",
  },
  {
    code: "ZAF", name: "South Africa", region: "Africa", flag: "🇿🇦",
    population: 64.0, gdp: 401, gdpPerCapita: 6300, growth: 0.6,
    inflation: 4.4, unemployment: 33.2, life: 66.1, co2: 7.3,
    gdpPcSeries: [5600, 7000, 6800, 6100, 6300],
    note: "Unemployment of 33.2% is the highest of any country tracked here.",
  },
  {
    code: "EGY", name: "Egypt", region: "Africa", flag: "🇪🇬",
    population: 116.5, gdp: 390, gdpPerCapita: 3300, growth: 2.4,
    inflation: 33.3, unemployment: 6.6, life: 71.7, co2: 2.0,
    gdpPcSeries: [3500, 3800, 4100, 4300, 3300],
    note: "Largest population in the Arab world; Suez Canal is a key revenue source.",
  },
  {
    code: "NGA", name: "Nigeria", region: "Africa", flag: "🇳🇬",
    population: 232.7, gdp: 190, gdpPerCapita: 820, growth: 3.4,
    inflation: 33.2, unemployment: 4.3, life: 54.6, co2: 0.6,
    gdpPcSeries: [2100, 2100, 2200, 1600, 820],
    note: "Africa's most populous country; GDP per capita fell after the 2023 currency float.",
  },
];

export const YEARS = [2020, 2021, 2022, 2023, 2024];

export const INDICATORS = [
  { key: "gdp", label: "GDP", unit: "US$ bn", source: "World Bank NY.GDP.MKTP.CD, 2024" },
  { key: "gdpPerCapita", label: "GDP per capita", unit: "US$", source: "World Bank NY.GDP.PCAP.CD, 2024" },
  { key: "population", label: "Population", unit: "millions", source: "UN World Population Prospects 2024" },
  { key: "growth", label: "GDP growth", unit: "% / year", source: "World Bank NY.GDP.MKTP.KD.ZG, 2024" },
  { key: "inflation", label: "Inflation (CPI)", unit: "% / year", source: "IMF / World Bank FP.CPI.TOTL.ZG, 2024" },
  { key: "unemployment", label: "Unemployment", unit: "% of labour force", source: "ILO modelled estimate, 2024" },
  { key: "life", label: "Life expectancy", unit: "years", source: "World Bank SP.DYN.LE00.IN, 2023" },
  { key: "co2", label: "CO2 per capita", unit: "tonnes", source: "World Bank EN.ATM.CO2E.PC, 2022" },
];

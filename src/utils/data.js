// src/data.js
export const data = [
  {
    month: "Jan",
    illegalConnections: 3,
    illegalRefinery: 1,
    oilLeaks: 0,
    gasLeaks: 0,
    arrests: 3,
    aversions: 3,
  },
  {
    month: "Feb",
    illegalConnections: 14,
    illegalRefinery: 0,
    oilLeaks: 0,
    gasLeaks: 2,
    arrests: 2,
    aversions: 2,
  },
  {
    month: "Mar",
    illegalConnections: 3,
    illegalRefinery: 8,
    oilLeaks: 0,
    gasLeaks: 1,
    arrests: 4,
    aversions: 2,
  },
  {
    month: "Apr",
    illegalConnections: 3,
    illegalRefinery: 0,
    oilLeaks: 0,
    gasLeaks: 0,
    arrests: 12,
    aversions: 8,
  },
  {
    month: "May",
    illegalConnections: 0,
    illegalRefinery: 4,
    oilLeaks: 2,
    gasLeaks: 4,
    arrests: 4,
    aversions: 4,
  },
  {
    month: "Jun",
    illegalConnections: 1,
    illegalRefinery: 5,
    oilLeaks: 2,
    gasLeaks: 0,
    arrests: 8,
    aversions: 4,
  },
  {
    month: "Jul",
    illegalConnections: 3,
    illegalRefinery: 0,
    oilLeaks: 1,
    gasLeaks: 0,
    arrests: 0,
    aversions: 0,
  },
  {
    month: "Aug",
    illegalConnections: 0,
    illegalRefinery: 5,
    oilLeaks: 2,
    gasLeaks: 0,
    arrests: 4,
    aversions: 0,
  },
  {
    month: "Sep",
    illegalConnections: 2,
    illegalRefinery: 2,
    oilLeaks: 6,
    gasLeaks: 1,
    arrests: 2,
    aversions: 2,
  },
  {
    month: "Oct",
    illegalConnections: 0,
    illegalRefinery: 6,
    oilLeaks: 6,
    gasLeaks: 0,
    arrests: 5,
    aversions: 1,
  },
  {
    month: "Nov",
    illegalConnections: 2,
    illegalRefinery: 4,
    oilLeaks: 0,
    gasLeaks: 0,
    arrests: 6,
    aversions: 2,
  },
  {
    month: "Dec",
    illegalConnections: 0,
    illegalRefinery: 3,
    oilLeaks: 5,
    gasLeaks: 0,
    arrests: 10,
    aversions: 0,
  },
];

// Derived YTD totals for Pie/Donut
/*export const incidentTotals = [
  { name: "Illegal Connections", value: 29 },
  { name: "Illegal Refinery", value: 25 },
  { name: "Oil Leaks", value: 13 },
  { name: "Gas Leaks", value: 8 },
];*/

// Incident totals for classification chart (YTD sum)
export const incidentTotals = [
  {
    name: "Illegal Connections",
    value: data.reduce((sum, d) => sum + d.illegalConnections, 0),
  },
  {
    name: "Illegal Refineries",
    value: data.reduce((sum, d) => sum + d.illegalRefinery, 0),
  },
  { name: "Oil Leaks", value: data.reduce((sum, d) => sum + d.oilLeaks, 0) },
  { name: "Gas Leaks", value: data.reduce((sum, d) => sum + d.gasLeaks, 0) },
];

// Crude Oil Intercepted dataset
export const crudeOilData = [
  { month: "Jan", crudeOil: 30000 },
  { month: "Feb", crudeOil: 0 },
  { month: "Mar", crudeOil: 0 },
  { month: "Apr", crudeOil: 0 },
  { month: "May", crudeOil: 20000 },
  { month: "Jun", crudeOil: 65000 },
  { month: "Jul", crudeOil: 75 },
  { month: "Aug", crudeOil: 1200 },
  { month: "Sep", crudeOil: 0 },
  { month: "Oct", crudeOil: 2340 },
  { month: "Nov", crudeOil: 6500 },
  { month: "Dec", crudeOil: 2995 },
];

// Arrests vs Aversions (2025 YTD)
export const arrestsVsAversionsData = [
  { month: "Jan", Arrests: 3, Aversions: 3 },
  { month: "Feb", Arrests: 2, Aversions: 2 },
  { month: "Mar", Arrests: 4, Aversions: 2 },
  { month: "Apr", Arrests: 12, Aversions: 8 },
  { month: "May", Arrests: 5, Aversions: 4 },
  { month: "Jun", Arrests: 8, Aversions: 4 },
  { month: "Jul", Arrests: 0, Aversions: 0 },
  { month: "Aug", Arrests: 4, Aversions: 0 },
  { month: "Sep", Arrests: 2, Aversions: 2 },
  { month: "Oct", Arrests: 5, Aversions: 1 },
  { month: "Nov", Arrests: 6, Aversions: 2 },
  { month: "Nov", Arrests: 10, Aversions: 0 },
];

// Trend of Arrests Only (2025 YTD)
export const arrestsOnlyData = [
  { month: "Jan", Arrests: 3 },
  { month: "Feb", Arrests: 2 },
  { month: "Mar", Arrests: 4 },
  { month: "Apr", Arrests: 12 },
  { month: "May", Arrests: 5 },
  { month: "Jun", Arrests: 8 },
  { month: "Jul", Arrests: 0 },
  { month: "Aug", Arrests: 4 },
  { month: "Sep", Arrests: 2 },
  { month: "Oct", Arrests: 5 },
  { month: "Nov", Arrests: 6 },
  { month: "Dec", Arrests: 10 },
];

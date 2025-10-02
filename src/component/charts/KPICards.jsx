"use client";

import { data, incidentTotals, crudeOilData } from "@/utils/data";

export default function KPICards() {
  const totalIncidents = incidentTotals.reduce((sum, i) => sum + i.value, 0);
  const totalArrests = data.reduce((sum, d) => sum + d.arrests, 0);
  const totalAversions = data.reduce((sum, d) => sum + d.aversions, 0);
  const totalCrudeOil = crudeOilData.reduce((sum, d) => sum + d.crudeOil, 0);

  const monthTotals = data.map((d) => ({
    month: d.month,
    total: d.illegalConnections + d.illegalRefinery + d.oilLeaks + d.gasLeaks,
  }));
  const peak = monthTotals.reduce((max, d) => (d.total > max.total ? d : max), {
    total: -1,
  });

  const cards = [
    {
      title: "Total Incidents",
      value: totalIncidents,
      color: "bg-red-100 text-red-700",
    },
    {
      title: "Total Arrests",
      value: totalArrests,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Total Aversions",
      value: totalAversions,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Total Crude Oil Intercepted",
      value: `${totalCrudeOil.toLocaleString()} Ltrs`,
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Peak Month",
      value: `${peak.month} (${peak.total})`,
      color: "bg-yellow-100 text-yellow-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-2xl shadow flex flex-col items-center justify-center ${card.color}`}
        >
          <h3 className="text-sm font-medium">{card.title}</h3>
          <p className="text-xl lg:text-2xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

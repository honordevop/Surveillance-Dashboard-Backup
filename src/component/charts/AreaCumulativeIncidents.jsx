// src/components/AreaCumulativeIncidents.js
"use client"; // important if you’re in Next.js 13+ App Router

import React from "react"; // ensure this is present
import { data } from "@/utils/data";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function AreaCumulativeIncidents() {
  let cumulative = 0;
  const cumulativeData = data.map((d) => {
    const monthlyTotal =
      d.illegalConnections + d.illegalRefinery + d.oilLeaks + d.gasLeaks;
    cumulative += monthlyTotal;
    return { month: d.month, cumulativeIncidents: cumulative };
  });

  return (
    <div className="w-full h-80 bg-whitee shadow rounded-2xl p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">Cumulative Incidents (YTD)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={cumulativeData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="cumulativeIncidents"
            stroke="#3b82f6"
            fill="#93c5fd"
            name="Cumulative Incidents"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

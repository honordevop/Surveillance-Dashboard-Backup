// src/components/ComposedIncidentsVsArrests.js
"use client"; // important if you’re in Next.js 13+ App Router

import React from "react"; // ensure this is present
import { data } from "@/utils/data";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function ComposedIncidentsVsArrests() {
  const formatted = data.map((d) => ({
    ...d,
    totalIncidents:
      d.illegalConnections + d.illegalRefinery + d.oilLeaks + d.gasLeaks,
  }));

  return (
    <div className="w-full h-80 bg-whitee shadow rounded-2xl p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">Total Incidents vs Arrests</h2>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={formatted}>
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="totalIncidents"
            fill="#6366f1"
            name="Total Incidents"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="arrests"
            stroke="#ef4444"
            name="Arrests"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// src/components/StackedBarIncidents.js
"use client"; // important if you’re in Next.js 13+ App Router

import React from "react"; // ensure this is present
import { data } from "@/utils/data";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function StackedBarIncidents() {
  return (
    <div className="w-full h-80 bg-whitee shadow rounded-2xl p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">
        Monthly Incident Breakdown (Stacked)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="illegalConnections"
            stackId="a"
            fill="#ef4444"
            name="Illegal Connections"
          />
          <Bar
            dataKey="illegalRefinery"
            stackId="a"
            fill="#f59e0b"
            name="Illegal Refinery"
          />
          <Bar dataKey="oilLeaks" stackId="a" fill="#3b82f6" name="Oil Leaks" />
          <Bar dataKey="gasLeaks" stackId="a" fill="#10b981" name="Gas Leaks" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

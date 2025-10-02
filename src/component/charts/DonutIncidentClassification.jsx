// src/components/DonutIncidentClassification.js
"use client"; // important if you’re in Next.js 13+ App Router

import React from "react"; // ensure this is present
import { incidentTotals } from "@/utils/data";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"];

export default function DonutIncidentClassification() {
  return (
    <div className="w-full h-80 bg-whitee shadow rounded-2xl p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">
        Incident Classification (YTD %)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={incidentTotals}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            label
          >
            {incidentTotals.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

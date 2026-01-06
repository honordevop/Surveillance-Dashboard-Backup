// src/components/MultiLineIncidents.js
"use client"; // important if you’re in Next.js 13+ App Router

import React from "react"; // ensure this is present
import { data } from "@/utils/data";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function MultiLineIncidents() {
  return (
    <div className="w-full h-80 bg-whitee shadow rounded-2xl p-4 mb-4 mt-4">
      <h2 className="text-lg font-semibold mb-2">
        Incident Trends by Type (Line)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="illegalConnections"
            stroke="#ef4444"
            name="Illegal Connections"
          />
          <Line
            type="monotone"
            dataKey="illegalRefinery"
            stroke="#f59e0b"
            name="Illegal Refinery"
          />
          <Line
            type="monotone"
            dataKey="oilLeaks"
            stroke="#3b82f6"
            name="Crude Oil Leaks"
          />
          <Line
            type="monotone"
            dataKey="gasLeaks"
            stroke="#10b981"
            name="Gas Leaks"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

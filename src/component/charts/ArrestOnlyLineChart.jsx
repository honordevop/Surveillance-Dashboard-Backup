"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { arrestsOnlyData } from "@/utils/data";

export default function ArrestOnlyLineChart() {
  return (
    <div className="w-full h-80 p-4 bg-whitee rounded-2xl shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">
        Trend of Arrests (2025 YTD)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={arrestsOnlyData}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="Arrests"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

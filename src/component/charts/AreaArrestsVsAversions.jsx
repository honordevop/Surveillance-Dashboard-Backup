"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { arrestsVsAversionsData } from "@/utils/data";

export default function AreaArrestsVsAversions() {
  return (
    <div className="w-full h-80 p-4 bg-whitee rounded-2xl shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">
        Trend of Arrests vs Aversions (2025 YTD)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={arrestsVsAversionsData}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="Arrests"
            stroke="#2563eb"
            fill="#93c5fd"
            strokeWidth={2}
            name="Arrests"
          />
          <Area
            type="monotone"
            dataKey="Aversions"
            stroke="#16a34a"
            fill="#86efac"
            strokeWidth={2}
            name="Aversions"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

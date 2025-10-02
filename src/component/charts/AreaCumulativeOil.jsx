"use client";

import { data, incidentTotals, crudeOilData } from "@/utils/data";
import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function AreaCumulativeOil() {
  const cumulative = crudeOilData.map((d, i) => {
    const prev = i === 0 ? 0 : crudeOilData[i - 1].cumulative || 0;
    return { ...d, cumulative: prev + d.crudeOil };
  });

  return (
    <div className="p-4 bg-whitee rounded-2xl shadow mb-4">
      <h2 className="text-lg font-semibold mb-2">
        Cumulative Crude Oil Intercepted (YTD)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={cumulative}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => value.toLocaleString()} />
          <Legend />
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke="#9b59b6"
            fill="#9b59b6"
            name="Cumulative Oil (Ltrs)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

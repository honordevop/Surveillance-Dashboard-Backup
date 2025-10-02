"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { data, incidentTotals, crudeOilData } from "@/utils/data";

export default function BarCrudeOilVolume() {
  return (
    <div className="p-4 bg-whitee rounded-2xl shadow mb-4">
      <h2 className="text-lg font-semibold mb-2">
        Crude Oil Intercepted (Monthly, Litres)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={crudeOilData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => value.toLocaleString()} />
          <Legend />
          <Bar dataKey="crudeOil" fill="#9b59b6" name="Crude Oil (Ltrs)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

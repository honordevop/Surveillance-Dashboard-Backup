// app/page.js
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase-client";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

export default function HomePage() {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f", "#7fd3ff"];

  useEffect(() => {
    async function load() {
      // compute start and end for selected month
      const [year, mon] = month.split("-");
      const start = `${year}-${mon}-01`;
      const endDate = new Date(year, Number(mon), 1);
      endDate.setMonth(endDate.getMonth() + 1);
      const end = endDate.toISOString().slice(0, 10);

      const { data, error } = await supabase.rpc("incident_counts_monthly", {
        start_date: start,
        end_date: end,
      });

      if (error) {
        console.log("rpc error", error);
        return;
      }
      const chartData = data.map((r) => ({
        name: r.incident_type,
        value: r.cnt,
      }));
      setData(chartData);
    }
    load();
  }, [month]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Monthly Incident Overview</h1>

      <label>
        Month:
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          style={{ marginLeft: 8 }}
        />
      </label>

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <p>
        Data is read-only via Supabase anon key and the incident_counts_monthly
        RPC.
      </p>
    </div>
  );
}

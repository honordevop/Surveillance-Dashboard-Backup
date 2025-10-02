"use client";

import { useGlobalContext } from "@/context/context";

export default function TrendDashboardHeader() {
  const { mode } = useGlobalContext();
  return (
    <div className="w-full rounded-2xl shadow-mdd p-6 mb-6 flex flex-col items-center justify-center">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
        Western Corridor Pipeline Security & Surveillance Dashboard
      </h1>
      <p
        className="text-sm md:text-base max-w-4xl text-center"
        style={mode === "dark" ? { color: "#dbeafe" } : { color: "black" }}
      >
        This dashboard presents the 2025 Year-to-Date (YTD) trends in pipeline
        surveillance and security operations across the Western Corridor. It
        highlights incidents such as illegal connections, illegal refineries,
        structural failures, arrests, aversions, and crude oil interceptions.
        Data is updated monthly to track operational outcomes, security
        effectiveness, and emerging risks.
      </p>
    </div>
  );
}

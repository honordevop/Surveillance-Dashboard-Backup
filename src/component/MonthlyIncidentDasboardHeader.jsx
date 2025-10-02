import React from "react";

const MonthlyIncidentDasboardHeader = () => {
  return (
    <div className="w-full rounded-2xl shadow-md p-6 mb-6 flex flex-col items-center gap-3 md:gap-6 justify-center">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
        Western Corridor Monthly Pipeline Surveillance & Incident Dashboard
      </h1>
      <p className="text-sm md:text-base text-greenn-100 max-w-3xl text-center">
        This dashboard shows monthly surveillance and incident data for the
        Western Corridor, including illegal connections, refineries, leaks,
        arrests, aversions, and crude oil interceptions.
      </p>
    </div>
  );
};

export default MonthlyIncidentDasboardHeader;

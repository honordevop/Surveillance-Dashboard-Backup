"use client"; // important if you’re in Next.js 13+ App Router

import React, { useEffect } from "react"; // ensure this is present
import AreaCumulativeIncidents from "@/component/charts/AreaCumulativeIncidents";
import ComposedIncidentsVsArrests from "@/component/charts/ComposedIncidentsVsArrests";
import DonutIncidentClassification from "@/component/charts/DonutIncidentClassification";
import KPICards from "@/component/charts/KPICards";
import MultiLineIncidents from "@/component/charts/MultiLineIncidents";
import StackedBarIncidents from "@/component/charts/StackedBarIncidents";
import BarCrudeOilVolume from "@/component/charts/BarCrudeOilVolume";
import AreaCumulativeOil from "@/component/charts/AreaCumulativeOil";
import AreaArrestsVsAversions from "@/component/charts/AreaArrestsVsAversions";
import ArrestOnlyLineChart from "@/component/charts/ArrestOnlyLineChart";
import ArrestOnlyAreaChart from "@/component/charts/ArrestOnlyAreaChart";
import TrendDashboardHeader from "@/component/charts/TrendDashboardHeader";
import Footer from "@/component/Footer";
import { usePathname } from "next/navigation";
import { useGlobalContext } from "@/context/context";
import { BounceLoader } from "react-spinners";
import { RotatingSquare } from "react-loader-spinner";

const ChartPage = () => {
  const { currentPage, pageLoading, mode, offPageLoading } = useGlobalContext();

  // console.log(currentPage);
  useEffect(() => {
    const timer = setTimeout(() => {
      offPageLoading(); // Call your function here after 5 seconds
    }, 8000); // 5000ms = 5s

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  if (pageLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div>
          {/* <BounceLoader className="" size={80} color="#b52624" /> */}
          <RotatingSquare
            visible={true}
            height="150"
            width="150"
            color={mode === "dark" ? "#ffff" : "#010e23"}
            ariaLabel="rotating-square-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-[92vh] md:h-[86vh] mt-[8vh] md:mt-[14vh] overflow-y-scroll">
      <TrendDashboardHeader />
      {/* KPI Cards Row */}
      <KPICards />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StackedBarIncidents />
        <MultiLineIncidents />
        <DonutIncidentClassification />
        {/* <AreaCumulativeIncidents /> */}
        <ComposedIncidentsVsArrests />
        <AreaCumulativeIncidents />
        <BarCrudeOilVolume />
        <AreaCumulativeOil />
        <AreaArrestsVsAversions /> {/* New Chart */}
        {/* <ArrestOnlyLineChart />
        <ArrestOnlyAreaChart /> */}
      </div>
      <Footer />
    </div>
  );
};

export default ChartPage;

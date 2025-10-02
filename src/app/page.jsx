// app/page.js
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase-client";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import Forms from "@/component/LoginFormComponent";
import Image from "next/image";
import LoginForm from "@/component/LoginForm";
import Footer from "@/component/Footer";
import { useGlobalContext } from "@/context/context";
import { RotatingSquare } from "react-loader-spinner";

export default function HomePage() {
  const { pageLoading, offPageLoading, mode } = useGlobalContext();
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f", "#7fd3ff"];

  useEffect(() => {
    const timer = setTimeout(() => {
      offPageLoading(); // Call your function here after 5 seconds
    }, 5000); // 5000ms = 5s

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
    <div className="w-full flex flex-col items-center justify-center h-[92vh] md:h-[86vh] mt-[8vh] md:mt-[14vh]">
      <div className="w-full flex h-full">
        <div className="hidden flex-1 w-full h-full md:flex flex-col items-center justify-center">
          <div className="relative w-full h-full bg-yellowd-50">
            <Image
              src="/newguard_sign_up_image.webp"
              fill
              priority
              className="object-cover"
              alt="sign up image"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-scroll scrollWidth0 w-full ">
          <LoginForm />
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

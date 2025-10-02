"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import Link from "next/link";
import { useGlobalContext } from "@/context/context";
import { RotatingSquare, Watch } from "react-loader-spinner";

export default function HomePanel() {
  const { data: session, status } = useSession();
  const { pageLoading, offPageLoading, mode } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      offPageLoading();
    }
  }, [session?.user]);

  useEffect(() => {
    if (status === "unauthenticated" || session?.user?.role !== "admin") {
      router.push("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session]);

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

  const btnStyle = {
    borderColor: "#010e23",
    transition: "border 1s ease-in-out",
  };

  return (
    <div className="flex items-center justify-center h-full bg-graye-100 px-4 mt-5">
      <div className="w-full max-w-md p-6 rounded-2xl shadow-2xl h-full">
        <div className="mb-4">
          <h2 className="text-2xl font-bold  text-center">
            Western Corridor Pipeline Incident Management System
          </h2>
          <p className="my-4">Welcome {session?.user?.name}</p>
        </div>

        <div className=" flex flex-col gap-5">
          <Link
            href="/admin/incident"
            className="px-2 py-2 primaryBgColor text-base font-bold border rounded-xl cursor-pointer border-gray-100 hidden md:block"
            style={mode === "dark" ? { borderColor: "#f3f4f6" } : btnStyle}
          >
            Monthly Incident Entry 📄✏️
          </Link>
          <Link
            href="/aiadmin"
            className="px-2 py-2 primaryBgColor text-base font-bold border rounded-xl cursor-pointer border-gray-100 hidden md:block"
            style={mode === "dark" ? { borderColor: "#f3f4f6" } : btnStyle}
          >
            AI Incident Injest 📄✏️
          </Link>
          <Link
            href="/incident"
            className="px-2 py-2 primaryBgColor text-base font-bold border rounded-xl cursor-pointer border-gray-100 hidden md:block"
            style={mode === "dark" ? { borderColor: "#f3f4f6" } : btnStyle}
          >
            Monthly Incident Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

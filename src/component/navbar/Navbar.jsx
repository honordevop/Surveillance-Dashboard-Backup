"use client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
// import styles from "./navbar.module.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import NavMenu from "./NavMenu";
// import { links } from "@/utils/db";
import { useGlobalContext } from "@/context/context";
import { links } from "@/utils/db";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const session = useSession();
  const { mode, onPageLoading, currentPage } = useGlobalContext();
  const pathname = usePathname();

  // const currentPage = pathname ? pathname.split("/").pop() : "";
  const [toggle, setToggle] = useState(false);

  const closeMenu = () => {
    setToggle(false);
  };

  const bgStyle = {
    backgroundColor: "#010e23",
    transition: "background 1s ease-in-out",
    borderBottom: "2px solid #ffff",
  };

  const btnStyle = {
    borderColor: "#010e23",
    transition: "border 1s ease-in-out",
  };
  return (
    <div
      className={`fixed top-0 z-[80] w-full md:h-[14vh] flex justify-center pt-2 md:pt-0`}
      style={mode === "dark" ? bgStyle : { backgroundColor: "#f3f4f6" }}
    >
      <div className="w-full flex items-center justify-between py-2 px-3 md:py-2 lg:px-16">
        <Link
          href="/"
          onClick={pathname.split("/").pop() === "" ? null : onPageLoading}
        >
          <div className="relative w-[60px] h-[60px] md:w-16 md:h-16">
            <Image
              src={
                mode == "dark"
                  ? "/newguard_logo_white.png"
                  : "/newguard_logo.png"
              }
              alt="newgurad logo"
              fill={true}
              priority
            />
          </div>
        </Link>
        <div className="hidden lg:block">
          {/* <p className="flex gap-10 text-xl md:text-2xl font-bold tab text-center">
            Western Corridor Pipeline Surveillance Incident Management
          </p> */}
        </div>
        <div className="flex items-center gap-5">
          <DarkModeToggle />
          <Link
            href="/incident"
            onClick={
              pathname.split("/").pop() === "incident" ? null : onPageLoading
            }
            className="px-2 py-2 primaryBgColor text-base font-bold border rounded-xl cursor-pointer border-gray-100 hidden"
            style={mode === "dark" ? { borderColor: "#f3f4f6" } : btnStyle}
          >
            Incident Dashbord
          </Link>
          {session.status === "authenticated" ? (
            <div className="hidden md:flex gap-2 ">
              <div
                onClick={signOut}
                className="primaryBgColor py-1 px-3  font-semibold w-max rounded-md  cursor-pointer border"
                style={mode === "dark" ? { borderColor: "#f3f4f6" } : btnStyle}
              >
                Sign Out
              </div>
            </div>
          ) : (
            <div className="hidden"></div>
          )}
          <GiHamburgerMenu
            className="primaryColor text-[40px] cursor-pointer lg:hiddenn"
            onClick={() => setToggle(true)}
          />
        </div>
        {toggle && <NavMenu toggleMenu={closeMenu} />}
      </div>
    </div>
  );
};

export default Navbar;

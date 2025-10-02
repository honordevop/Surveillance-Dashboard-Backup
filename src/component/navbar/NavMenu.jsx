"use client";
import React from "react";
import Link from "next/link";
import { AiOutlineClose } from "react-icons/ai";
import { links } from "@/utils/db";
import { useGlobalContext } from "@/context/context";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const NavMenu = ({ toggleMenu }) => {
  const session = useSession();
  const pathname = usePathname();

  const { mode, onPageLoading, currentPage } = useGlobalContext();

  const bgStyle = {
    backgroundColor: "#010e23",
    transition: "background 1s ease-in-out",
    // borderBottom: "2px solid #ffff",
  };

  return (
    <div
      className="text-white bg-[#010e23] absolute z-30 top-0 right-0 w-full md:w-9/12 h-[100vh] flex flex-col justify-between p-5 font-space_grotesk"
      // style={mode === "dark" ? bgStyle : { backgroundColor: "#f3f4f6" }}
    >
      <div
        className="flex md:text-[25px] gap-2 items-center justify-end cursor-pointer md:p-10"
        onClick={toggleMenu}
      >
        <p>Close Menu </p> <AiOutlineClose className="md:text-[30px]" />
      </div>
      <div className={`h-4/5 overflow-auto  scrollbar-w-2`}>
        <div
          className="flex flex-col items-center gap-8 md:gap-10 px-2 md:px-5
        md:py-6 "
        >
          {links.map((link, i) => (
            <div
              key={i}
              className="border-b-[0.5px] border-gray-200 w-4/5"
              onClick={() => {
                toggleMenu();
                // if (link.url.includes(currentPage)) {
                //   onPageLoading();
                // }
              }}
            >
              <Link
                href={link.url}
                className="text-[20px] md:text-[3rem] w-full"
                onClick={link.url.includes(currentPage) ? null : onPageLoading}
              >
                {link.linkName}
              </Link>
            </div>
          ))}
          <div className="w-4/5">
            {session.status === "unauthenticated" ? (
              <div
                className="border-b-[0.5px] border-gray-200 "
                onClick={toggleMenu}
              >
                <Link
                  href="/"
                  className="text-[20px] md:text-[3rem]"
                  onClick={
                    pathname.split("/").pop() === "" ? null : onPageLoading
                  }
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <div
                className="border-b-[0.5px] border-gray-200 "
                onClick={toggleMenu}
              >
                <div
                  onClick={() => {
                    signOut();
                    onPageLoading();
                  }}
                  className="text-[20px] md:text-[3rem] cursor-pointer"
                >
                  Sign Out
                </div>
              </div>
            )}
          </div>
          <div className="w-4/5 py-20">{/* <Socials /> */}</div>
        </div>
      </div>
    </div>
  );
};

export default NavMenu;

// app/page.js
"use client";
import { useEffect, useState } from "react";
import Forms from "@/component/LoginFormComponent";
import Image from "next/image";
import SignUpForm from "@/component/SignUpForm";

export default function Register() {
  return (
    <div className="w-full flex flex-col items-center justify-center h-[86vh] mds:h-[100vh] mt-[14vh]">
      <div className="w-full flex h-full">
        <div className="hidden flex-1 w-full h-full md:flex flex-col items-center justify-center">
          <div className="relative w-full h-full bg-yellow-50">
            <Image
              src="/newguard_sign_up_image.webp"
              fill
              priority
              className="object-cover"
              alt="sign up image"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-scroll scrollWidth0 w-full flex  flex-col items-center justify-center">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}

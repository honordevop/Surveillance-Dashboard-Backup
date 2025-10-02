"use client";
import React from "react";
import styles from "./darkmoduletoggle.module.css";
import { useGlobalContext } from "../../context/context";
import Image from "next/image";

const DarkModeToggle = () => {
  const { toggle, mode } = useGlobalContext();

  return (
    <div className={styles.container} onClick={toggle}>
      <div className=" relative w-4 h-4">
        <Image
          src="/bluemach_dark_mode_toggle.svg"
          alt="bluemach logo"
          fill={true}
          priority
        />
      </div>
      <div className=" relative w-4 h-4">
        <Image
          src="/bluemach_dark_mode_toggle.svg"
          alt="bluemach dark mode toggle"
          fill={true}
          priority
        />
      </div>
      {/* <div
        className={`${styles.ball}`}
        style={mode === "light" ? { left: "2px", ta } : { right: "2px" }}
      /> */}
      <div
        className={`${styles.ball} ${mode === "dark" ? styles.ballMoved : ""}`}
      />
    </div>
  );
};

export default DarkModeToggle;

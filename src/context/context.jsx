"use client";

import { usePathname } from "next/navigation";
import React, { useContext, useState } from "react";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const pathname = usePathname();

  const currentPage = pathname ? pathname.split("/").pop() : "";

  const [mode, setMode] = useState("dark");

  const [pageLoading, setPageLoading] = useState(true);

  const onPageLoading = () => {
    setPageLoading(true);
  };
  const offPageLoading = () => {
    setPageLoading(false);
  };

  const toggle = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const hello = "hello";

  return (
    <AppContext.Provider
      value={{
        toggle,
        mode,
        hello,
        onPageLoading,
        pageLoading,
        offPageLoading,
        currentPage,
      }}
    >
      <div className={`theme ${mode}`}>{children}</div>
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };

export const useGlobalContext = () => {
  return useContext(AppContext);
};

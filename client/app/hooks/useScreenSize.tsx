"use client";
import { useState, useEffect } from "react";

export const useScreenSize = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const getLimit = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024 ? 8 : 4;
    }
    return 8;
  };

  return {
    isDesktop,
    getLimit,
  };
};

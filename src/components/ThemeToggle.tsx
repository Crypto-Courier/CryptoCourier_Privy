"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "lucide-react";
import useMediaQuery from "../hooks/useMediaQuery "; // Custom hook to detect screen size

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 640px)"); // Mobile screen detection (sm breakpoint)

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div
      className={`cursor-pointer flex items-center justify-center  ${
        isMobile ? "w-8 h-8 p-1  rounded-full" : "w-16 sm:w-16 h-9 p-1"
      }`}
      onClick={toggleTheme}
      role="button"
      aria-label="Toggle dark mode"
    >
      {/* Mobile Screen: Only Icon Changes */}
      {isMobile ? (
        theme === "dark" ? (
          <MoonIcon
            size={25}
            className="text-black bg-white rounded-full p-1"
          />
        ) : (
          <SunIcon
            size={25}
            className="text-yellow-500 bg-black rounded-full p-1"
          />
        )
      ) : (
        /* Desktop: Full Toggle with Sliding Effect */
        <div
          className={`flex items-center justify-between w-full h-full rounded-full ${
            theme === "dark" ? "bg-white" : "bg-black"
          }`}
        >
          <div
            className={`flex items-center justify-center w-6 h-6 rounded-full transition-transform duration-300 ease-in-out transform ${
              theme === "dark"
                ? "translate-x-6 sm:translate-x-8 bg-blue-600"
                : "translate-x-0 bg-[#FFD600]"
            }`}
          >
            {theme === "dark" ? (
              <MoonIcon size={14} className="text-white" />
            ) : (
              <SunIcon size={14} className="text-black" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

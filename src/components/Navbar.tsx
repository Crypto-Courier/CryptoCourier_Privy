"use client";
import React from "react";
import "react-toggle/style.css";
import { ThemeToggle } from "../components/ThemeToggle";
import { useTheme } from "next-themes";
import dLogo from "../assets/Dark.gif";
import lLogo from "../assets/Animation.gif";
import Image from "next/image";
import "../styles/Responsive.css";
import { Connect } from "./Connect";

const Navbar = () => {
  const { theme } = useTheme();

  return (
    <div className="w-[90%] mx-auto relative navbar">
      <div className="flex items-center justify-between gap-y-4 my-[20px]">
        {/* Logo Section */}

        <div className="w-[9rem] sm:w-40 md:w-48 lg:w-56 logo">
          {theme === "light" ? (
            <Image
              src={dLogo}
              alt="CRYPTO-COURIER Dark Logo"
              width={400}
              height={400}
              className="w-full h-auto"
            />
          ) : (
            <Image
              src={lLogo}
              alt="CRYPTO-COURIER Light Logo"
              width={400}
              height={400}
              className="w-full h-auto"
            />
          )}
        </div>

        {/* Right Section: Theme Toggle and Connect Button */}
        <div className="flex items-center space-x-4 flex-row-reverse lg:flex-row md:flex-row sm:flex-row gap-[10px]">
          <ThemeToggle />
          <div className="connect">
            <Connect />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

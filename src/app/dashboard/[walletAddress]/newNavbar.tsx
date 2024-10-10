"use client";
import React from "react";
import "react-toggle/style.css";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { useTheme } from "next-themes";
import dLogo from "../../../assets/dLogo.png";
import lLogo from "../../../assets/lLogo.png";
import Image from "next/image";
import "../../../styles/Responsive.css";

const NewNavbar = () => {
  const { theme } = useTheme();

  return (
    <div className=" w-[90%] mx-auto relative navbar h-[10vh]">
      <div className="flex items-center justify-between flex-wrap gap-y-4 h-[10vh]">
        {/* Logo Section */}
        <a href="/" aria-label="CRYPTO-COURIER" title="CRYPTO-COURIER">
          <div className="w-[11rem] sm:w-40 md:w-48 lg:w-56 logo">
            {theme === "light" ? (
              <Image
                src={dLogo}
                alt="CRYPTO-COURIER Dark Logo"
                width={400}
                height={400}
                className="w-full h-auto "
              />
            ) : (
              <Image
                src={lLogo}
                alt="CRYPTO-COURIER Light Logo"
                width={400}
                height={400}
                className="w-full h-auto "
              />
            )}
          </div>
        </a>

        {/* Right Section: Theme Toggle and Connect Button */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />

        </div>
      </div>
    </div>
  );
};

export default NewNavbar;

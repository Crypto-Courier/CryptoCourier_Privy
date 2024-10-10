"use client";
import React, { useState, useEffect } from "react";
import "react-toggle/style.css";
import { ThemeToggle } from "../components/ThemeToggle";
import { useTheme } from "next-themes";
import dLogo from "../assets/dLogo.png";
import lLogo from "../assets/lLogo.png";
import Image from "next/image";
import "../styles/Responsive.css";
import { Connect } from "./Connect";
import Joyride from "react-joyride";

const Navbar = () => {
  const { theme } = useTheme();
  const [runTour, setRunTour] = useState(false); // Initially set to false

  const steps = [
    {
      target: ".connect",
      disableBeacon: true,
      content: "Click here to connect your wallet.",
    },
    {
      target: ".showhelp",
      disableBeacon: true,
      content: "Need help? Click here for assistance.",
    },
  ];

  // Check if the tour has been completed previously
  useEffect(() => {
    const tourCompleted = localStorage.getItem("tourCompleted1");
    if (!tourCompleted) {
      setRunTour(true); // Run the tour if it hasn't been completed
    }
  }, []);

  // Handle the completion of the tour
  const handleTourCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses = ["finished", "skipped"];
    if (finishedStatuses.includes(status)) {
      localStorage.setItem("tourCompleted1", "true"); // Set tour as completed
      setRunTour(false); // Stop running the tour
    }
  };

  return (
    <div className="w-[90%] mx-auto relative navbar">
      <div className="flex items-center justify-between gap-y-4 my-[20px]">
        {/* Logo Section */}
        <a href="/" aria-label="CRYPTO-COURIER" title="CRYPTO-COURIER">
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
        </a>

        {/* Right Section: Theme Toggle and Connect Button */}
        <div className="flex items-center space-x-4 flex-row-reverse lg:flex-row md:flex-row sm:flex-row gap-[10px]">
          <ThemeToggle />
          <div className="connect">
            <Connect />
          </div>
        </div>
      </div>

      {/* Joyride for the tour */}
      <Joyride
        steps={steps}
        run={runTour} // Only run if tour is not completed
        continuous
        showSkipButton
        showProgress
        styles={{
          options: {
            zIndex: 1000,
            primaryColor: "#FF3333", // Customize button color to match your theme
          },
          buttonNext: {
            backgroundColor: "#FF3333",
            color: "#fff",
          },
        }}
        locale={{
          next: "Next", // Customize 'Next' button text
          last: "Finish",
        }}
        callback={handleTourCallback} // Handle tour completion
      />
    </div>
  );
};

export default Navbar;

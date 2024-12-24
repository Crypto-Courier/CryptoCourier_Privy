import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import Exwallet from "../assets/Exwallet.png";
import install from "../assets/install.png";
import { useTheme } from "next-themes";

type Step = {
  title: string;
  render: () => JSX.Element; // Custom JSX for each step
};

type WalletPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

const WalletPopup: React.FC<WalletPopupProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [flowType, setFlowType] = useState<"copy" | "phrase" | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        resetFlow();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const initialSteps: Step[] = [
    {
      title: "Slide 1",
      render: () => (
        <>
          <div
            className={` text-lg text-center  ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Click on {""}
            <span className={`font-bold text-[#FFE500]`}>Copy Phrase</span> or
            <span className={`font-bold text-[#FFE500]`}> Copy Key</span> from
            export wallet.
          </div>
          <div className="flex justify-center mt-5">
            <Image src={Exwallet} alt="" width={300} />
          </div>
        </>
      ),
    },
    {
      title: "Slide 2",
      render: () => (
        <>
          <div
            className={` text-lg text-center mb-3 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Download & Install the Extension or App{" "}
          </div>
          <div className="flex gap-5 items-start">
            <div className="flex justify-center mt-3">
              <Image src={install} alt="" width={250} />
            </div>
            <div className="w-[60%] mt-3">
              <div
                className={` text-lg  ${
                  theme === "dark" ? "text-[#FFE500]" : "text-black"
                }`}
              >
                1. Visit the Official Website :
              </div>
              <div>
                Go to the official website:{" "}
                <a
                  className="text-blue-600"
                  href="https://metamask.io/"
                  target="_blank"
                >
                  https://metamask.io/
                </a>
                .
              </div>

              <div
                className={` text-lg mt-5 ${
                  theme === "dark" ? "text-[#FFE500]" : "text-black"
                }`}
              >
                2. For desktop :
              </div>
              <div>
                - Click "Download" and choose the browser extension for Chrome,
                Firefox, Brave, or Edge.
              </div>
              <div>
                - Install the extension from the browser's official store.
              </div>
              <div
                className={` text-lg mt-5  ${
                  theme === "dark" ? "text-[#FFE500]" : "text-black"
                }`}
              >
                3. For Mobile :
              </div>
              <div>
                - Download the MetaMask app from the App Store (iOS) or Google
                Play Store (Android).
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Slide 3",
      render: () => (
        <>
          <div
            className={` text-lg text-center mb-3 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Import and export wallet instruction
          </div>
          <div>
            <ul
              className={` text-lg mt-5  ${
                theme === "dark" ? "text-[#FFE500]" : "text-black"
              }`}
            >
              1. Export wallet :
            </ul>
            <li>
              Exporting your wallet means saving the private keys or recovery
              phrase associated with your wallet.
            </li>
            <li>This allows you to access your wallet from any device. </li>
            <li>
              It's important to keep your private keys safe, as anyone with
              access to them can control your wallet and the assets within it.
              It’s like a password for a wallet but you can't change or forget
              it.
            </li>
          </div>
          <div>
            <ul
              className={` text-lg mt-5  ${
                theme === "dark" ? "text-[#FFE500]" : "text-black"
              }`}
            >
              1. Import Wallet :
            </ul>
            <li>
              Importing your wallet means restoring access to your existing
              wallet on a new device by using your private key or recovery
              Phrase.
            </li>
            <li>
              This process is essential when switching devices or recovering
              access to your wallet.
            </li>
            <li>
              Importing a wallet ensures you can continue managing your tokens
              and assets securely.
            </li>
          </div>
        </>
      ),
    },
    {
      title: "Slide 4",
      render: () => (
        <>
          <div
            className={` text-lg text-center mb-3 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            There are 2 methods for export wallet
          </div>
          <div>
            <ul
              className={` text-lg mt-5 mb-3 ${
                theme === "dark" ? "text-[#FFE500]" : "text-black"
              }`}
            >
              1. Copy Phrase :
            </ul>
            <li>
              This method will export your entire wallet with an account. You
              will need to import the entire wallet in your preferred wallet
              provider.
            </li>
          </div>
          <div>
            <ul
              className={` text-lg mt-5 mb-3 ${
                theme === "dark" ? "text-[#FFE500]" : "text-black"
              }`}
            >
              1. Copy Key :
            </ul>
            <li>
              This method will export only one account which you can import in
              your existing wallet using a private key.
            </li>
          </div>
        </>
      ),
    },
    {
      title: "Slide 5",
      render: () => (
        <div>
          <p>Content for Slide 4</p>
        </div>
      ),
    },
  ];
  // Define Steps for Copy Flow (10 slides)
  const copySteps: Step[] = Array.from({ length: 10 }, (_, i) => ({
    title: `Copy Step ${i + 1}`,
    render: () => <div>Content for Copy Step {i + 1}</div>,
  }));

  // Define Steps for Phrase Flow (10 slides)
  const phraseSteps: Step[] = Array.from({ length: 10 }, (_, i) => ({
    title: `Phrase Step ${i + 1}`,
    render: () => <div>Content for Phrase Step {i + 1}</div>,
  }));

  const getCurrentSteps = () => {
    if (flowType === "copy") return copySteps;
    if (flowType === "phrase") return phraseSteps;
    return initialSteps;
  };

  const handleNext = () => {
    const steps = getCurrentSteps();

    // If we are on the last step of the main flow (Step 4), go to Copy/Phrase buttons selection
    if (currentStep === 4 && !flowType) {
      setFlowType(null); // Reset the flow to null to show method selection (Copy/Phrase)
      setCurrentStep(5); // Move to the step that shows Copy/Phrase buttons
      return; // Exit the function early to avoid further changes
    }

    // Normal flow: Proceed to next step
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  const handleBack = () => {
    if (flowType) {
      // If we are in "copy" or "phrase" flow, return to Step 3 (main flow)
      setFlowType(null); // Reset the flow
      setCurrentStep(4); // Go to Step 3 in the main flow
    } else {
      // Normal navigation
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    }
  };
  const handleMethodSelect = (method: "copy" | "phrase") => {
    setFlowType(method);
    setCurrentStep(0); // Reset to first step of the selected flow
  };

  const returnToMethodSelection = () => {
    setFlowType(null);
    setCurrentStep(3); // Go back to Step 4 where the method selection happens
  };

  const resetFlow = () => {
    setCurrentStep(0);
    setFlowType(null);
    onClose();
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] ">
        <div
          ref={popupRef}
          className="bg-white rounded-lg w-[45%]  relative  m-auto"
        >
          {/* Close button at the top right */}
          <div className="absolute top-0 right-0 z-10">
            <button
              onClick={resetFlow}
              className=" text-black p-2 rounded-full  transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div
            className={`  flex flex-col justify-between rounded-md ${
              theme === "dark" ? "bg-[#1E1E1E] " : "bg-[#F4F3F3]"
            }`}
          >
            <div
              className={`p-6  ${
                theme === "dark" ? "bg-[#080808] " : "bg-[#F4F3F3] "
              }`}
            >
              <div className="flex justify-start mb-1">
                {/* <h2 className="text-xl font-semibold">
                    {getCurrentSteps()[currentStep].title}
                  </h2> */}
                <span className="text-gray-500">
                  Step {currentStep + 1} of {getCurrentSteps().length}
                </span>
              </div>

              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-full  rounded-full transition-all duration-300 ${
                    theme === "dark" ? "bg-[#FFE500]" : "bg-[#E265FF]"
                  }`}
                  style={{
                    width: `${
                      ((currentStep + 1) / getCurrentSteps().length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
            {(currentStep === 4 || flowType) && (
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => handleMethodSelect("copy")}
                  className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
                    flowType === "copy"
                      ? "border-blue-600 text-blue-600 bg-blue-100" // Active state
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Copy
                </button>
                <button
                  onClick={() => handleMethodSelect("phrase")}
                  className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
                    flowType === "phrase"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Phrase
                </button>
              </div>
            )}
            <div
              className={` p-6  ${
                theme === "dark" ? "bg-[#1E1E1E] " : "bg-[#F4F3F3] "
              }`}
            >
              {getCurrentSteps()[currentStep].render()}
            </div>

            <div className="flex justify-between px-6 pb-6">
              <button
                onClick={handleBack}
                className={`px-6 py-2 rounded-full ${
                  currentStep === 0
                    ? "bg-transaparnt cursor-not-allowed border border-[#FFE500]"
                    : "bg-transaparnt text-white  border border-[#FFE500]"
                }`}
                disabled={currentStep === 0}
              >
                Back
              </button>

              <button
                onClick={handleNext}
                className={`px-6 py-2 bg-[#FFE500] text-black rounded-full  ${
                  currentStep === getCurrentSteps().length - 1 && !flowType
                    ? "invisible"
                    : ""
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPopup;

import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";

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
      render: () => <div>Content for Slide 1</div>,
    },
    {
      title: "Slide 2",
      render: () => <div>Content for Slide 2</div>,
    },
    {
      title: "Slide 3",
      render: () => <div>Content for Slide 3</div>,
    },
    {
      title: "Slide 4",
      render: () => (
        <div>
          <p>Content for Slide 4</p>
          <div className="flex justify-around mt-4">
            <button
              onClick={() => handleMethodSelect("copy")}
              className="px-4 py-2 bg-blue-600 text-white rounded-l-lg"
            >
              Copy
            </button>
            <button
              onClick={() => handleMethodSelect("phrase")}
              className="px-4 py-2 bg-green-600 text-white rounded-r-lg"
            >
              Phrase
            </button>
          </div>
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
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (flowType) {
      // If we are in "copy" or "phrase" flow, return to Step 3 (main flow)
      setFlowType(null); // Reset the flow
      setCurrentStep(3); // Go to Step 3 in the main flow
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
        <div
          ref={popupRef}
          className="bg-white rounded-lg w-[680px] h-[680px] relative"
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

          {(currentStep === 3 || flowType) && (
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

          <div className="p-6 pt-3 flex flex-col justify-between h-[680px]">
            <div className="mb-8">
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
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentStep + 1) / getCurrentSteps().length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="mb-8">
              {getCurrentSteps()[currentStep].render()}
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className={`px-4 py-2 rounded-lg ${
                  currentStep === 0
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-600 text-white hover:bg-gray-700"
                }`}
                disabled={currentStep === 0}
              >
                Back
              </button>

              <button
                onClick={handleNext}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
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

import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import Exwallet from "../assets/Exwallet.png";
import install from "../assets/install.png";
import { useTheme } from "next-themes";
import started from "../assets/started.png";
import seed from "../assets/seed.png";
import pass from "../assets/password.png";
import account from "../assets/addAccount.png";
import imp from "../assets/import.png";
import key from "../assets/pKey.png";
import imp2 from "../assets/Imported.png";
import { URL } from "node:url";

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
  const [flowType, setFlowType] = useState<"copy" | "phrase">("phrase");
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

  // Reset states when popup opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setFlowType("phrase");
    }
  }, [isOpen]);

  const handleFinish = () => {
    resetFlow();
  };
  const walletSteps = {
    metamask: {
      copy: [
        {
          title: "Slide 1",
          render: () => (
            <>
              <div
                className={` lg:text-lg md:text-l sm:text-sm text-sm text-center  ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Click on {""}
                <span className={`font-bold text-[#FFE500]`}>
                  Copy Phrase
                </span>{" "}
                or
                <span className={`font-bold text-[#FFE500]`}>
                  {" "}
                  Copy Key
                </span>{" "}
                from export wallet.
              </div>
              <div className="flex justify-center mt-5">
                <Image
                  src={Exwallet}
                  alt=""
                  className="lg:w-[300px] md:w-[300px] sm:w-[200px] w-[200px] m-auto"
                />
              </div>
            </>
          ),
        },
        {
          title: "Slide 2",
          render: () => (
            <>
              <div
                className={` lg:text-lg md:text-l sm:text-sm text-sm text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Download & Install the Extension or App{" "}
              </div>
              <div className="flex gap-5 items-start justify-center lg:flex-row md:flex-row sm:flex-col flex-col ">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={install} alt="" width={250} />
                </div>
                <div className="lg:w-[60%] md:w-[60%] sm:w-[100%] w-[100%] mt-3">
                  <ul
                    className={` lg:text-lg md:text-l sm:text-sm text-sm  mb-3 ${
                      theme === "dark" ? "text-[#FFE500]" : "text-black"
                    }`}
                  >
                    1. Visit the Official Website :
                  </ul>
                  <li>
                    Go to the official website:{" "}
                    <a
                      className="text-blue-600"
                      href="https://metamask.io/"
                      target="_blank"
                    >
                      https://metamask.io/
                    </a>
                    .
                  </li>

                  <ul
                    className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-[#FFE500]" : "text-black"
                    }`}
                  >
                    2. For desktop :
                  </ul>
                  <li
                    className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click "Download" and choose the browser extension for
                    Chrome, Firefox, Brave, or Edge.
                  </li>
                  <li
                    className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Install the extension from the browser's official store.
                  </li>
                  <ul
                    className={`lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-[#FFE500]" : "text-black"
                    }`}
                  >
                    3. For Mobile :
                  </ul>
                  <li
                    className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Download the MetaMask app from the App Store (iOS) or Google
                    Play Store (Android).
                  </li>
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
                className={` lg:text-lg md:text-l sm:text-sm text-sm text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Import and export wallet instruction
              </div>
              <div>
                <ul
                  className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-[#FFE500]" : "text-black"
                  }`}
                >
                  1. Export wallet :
                </ul>
                <li
                  className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Exporting your wallet means saving the private keys or
                  recovery phrase associated with your wallet.
                </li>
                <li
                  className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  This allows you to access your wallet from any device.{" "}
                </li>
                <li
                  className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  It's important to keep your private keys safe, as anyone with
                  access to them can control your wallet and the assets within
                  it. It’s like a password for a wallet but you can't change or
                  forget it.
                </li>
              </div>
              <div>
                <ul
                  className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-[#FFE500]" : "text-black"
                  }`}
                >
                  1. Import Wallet :
                </ul>
                <li
                  className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Importing your wallet means restoring access to your existing
                  wallet on a new device by using your private key or recovery
                  Phrase.
                </li>
                <li
                  className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  This process is essential when switching devices or recovering
                  access to your wallet.
                </li>
                <li
                  className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Importing a wallet ensures you can continue managing your
                  tokens and assets securely.
                </li>
              </div>
            </>
          ),
        },
      ],
    },
  };
  // Define Steps for Copy Flow (10 slides)
  const copySteps: Step[] = [
    {
      title: "Slide 1",
      render: () => (
        <>
          <div
            className={` lg:text-lg md:text-l sm:text-sm text-sm text-center  ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Click on {""}
            <span className={`font-bold text-[#FFE500]`}>Copy Phrase</span> or
            <span className={`font-bold text-[#FFE500]`}> Copy Key</span> from
            export wallet.
          </div>
          <div className="flex justify-center mt-5">
            <Image
              src={Exwallet}
              alt=""
              className="lg:w-[300px] md:w-[300px] sm:w-[200px] w-[200px] m-auto"
            />
          </div>
        </>
      ),
    },
    {
      title: "Slide 2",
      render: () => (
        <>
          <div
            className={` lg:text-lg md:text-l sm:text-sm text-sm text-center mb-3 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Download & Install the Extension or App{" "}
          </div>
          <div className="flex gap-5 items-start justify-center lg:flex-row md:flex-row sm:flex-col flex-col ">
            <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
              <Image src={install} alt="" width={250} />
            </div>
            <div className="lg:w-[60%] md:w-[60%] sm:w-[100%] w-[100%] mt-3">
              <ul
                className={` lg:text-lg md:text-l sm:text-sm text-sm  mb-3 ${
                  theme === "dark" ? "text-[#FFE500]" : "text-black"
                }`}
              >
                1. Visit the Official Website :
              </ul>
              <li>
                Go to the official website:{" "}
                <a
                  className="text-blue-600"
                  href="https://metamask.io/"
                  target="_blank"
                >
                  https://metamask.io/
                </a>
                .
              </li>

              <ul
                className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                  theme === "dark" ? "text-[#FFE500]" : "text-black"
                }`}
              >
                2. For desktop :
              </ul>
              <li
                className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Click "Download" and choose the browser extension for Chrome,
                Firefox, Brave, or Edge.
              </li>
              <li
                className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Install the extension from the browser's official store.
              </li>
              <ul
                className={`lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                  theme === "dark" ? "text-[#FFE500]" : "text-black"
                }`}
              >
                3. For Mobile :
              </ul>
              <li
                className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Download the MetaMask app from the App Store (iOS) or Google
                Play Store (Android).
              </li>
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
            className={` lg:text-lg md:text-l sm:text-sm text-sm text-center mb-3 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Import and export wallet instruction
          </div>
          <div>
            <ul
              className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                theme === "dark" ? "text-[#FFE500]" : "text-black"
              }`}
            >
              1. Export wallet :
            </ul>
            <li
              className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Exporting your wallet means saving the private keys or recovery
              phrase associated with your wallet.
            </li>
            <li
              className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              This allows you to access your wallet from any device.{" "}
            </li>
            <li
              className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              It's important to keep your private keys safe, as anyone with
              access to them can control your wallet and the assets within it.
              It’s like a password for a wallet but you can't change or forget
              it.
            </li>
          </div>
          <div>
            <ul
              className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                theme === "dark" ? "text-[#FFE500]" : "text-black"
              }`}
            >
              1. Import Wallet :
            </ul>
            <li
              className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Importing your wallet means restoring access to your existing
              wallet on a new device by using your private key or recovery
              Phrase.
            </li>
            <li
              className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              This process is essential when switching devices or recovering
              access to your wallet.
            </li>
            <li
              className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
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
            className={`lg:text-lg md:text-l sm:text-sm text-sm text-center mb-3 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            There are 2 methods for export wallet
          </div>
          <div>
            <ul
              className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                theme === "dark" ? "text-[#FFE500]" : "text-black"
              }`}
            >
              1. Copy Phrase :
            </ul>
            <li
              className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              This method will export your entire wallet with an account. You
              will need to import the entire wallet in your preferred wallet
              provider.
            </li>
          </div>
          <div>
            <ul
              className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                theme === "dark" ? "text-[#FFE500]" : "text-black"
              }`}
            >
              1. Copy Key :
            </ul>
            <li
              className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
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
        <>
          <div
            className={` lg:text-lg md:text-l sm:text-sm text-sm text-center mb-3 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Add account in your wallet using
            <span className={`font-bold text-[#FFE500]`}> Copy Key</span>
          </div>
          <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
            <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
              <Image
                src={account}
                alt=""
                className="lg:w-[200px] md:w-[200px] sm:w-[180px] w-[180px] m-auto"
              />
            </div>
            <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
              <ul
                className={`  lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                  theme === "dark" ? "text-[#FFE500]" : "text-black"
                }`}
              >
                1. For Chrome Extension:
              </ul>
              <li
                className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Click the account selector at the top of your wallet.
              </li>
              <li
                className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Select 'Add account or hardware wallet' at the bottom of the
                list.
              </li>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Slide 6",
      render: () => (
        <>
          <div
            className={` lg:text-lg md:text-l sm:text-sm text-sm text-center mb-3 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Add account in your wallet using
            <span className={`font-bold text-[#FFE500]`}> “Copy Key</span>
          </div>
          <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
            <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
              <Image
                src={imp}
                alt=""
                className="lg:w-[200px] md:w-[200px] sm:w-[180px] w-[180px] m-auto"
              />
            </div>
            <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
              <li
                className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                On the next menu, select{" "}
                <span className={`font-bold text-[#FFE500]`}>
                  'Import account'
                </span>
              </li>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Slide 7",
      render: () => (
        <>
          <div
            className={` lg:text-lg md:text-l sm:text-sm text-sm text-center mb-3 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Add account in your wallet using
            <span className={`font-bold text-[#FFE500]`}> Copy Key</span>
          </div>
          <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
            <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
              <Image
                src={key}
                alt=""
                className="lg:w-[200px] md:w-[200px] sm:w-[180px] w-[180px] m-auto"
              />
            </div>
            <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
              <li
                className={`  lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                You will be redirected to the Import page. Paste your private
                key and click 'Import'.
                <span className={`font-bold text-[#FFE500]`}>'Import'</span>
              </li>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Slide 8",
      render: () => (
        <>
          <div
            className={`  lg:text-lg md:text-l sm:text-sm text-sm text-center mb-3 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Add account in your wallet using
            <span className={`font-bold text-[#FFE500]`}> Copy Key</span>
          </div>
          <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
            <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
              <Image
                src={imp2}
                alt=""
                className="lg:w-[200px] md:w-[200px] sm:w-[180px] w-[180px] m-auto"
              />
            </div>
            <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
              <li
                className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                You should be able to see the newly imported account in the
                account selector dropdown with an{" "}
                <span className={`font-bold text-[#FFE500]`}>'Imported'</span>{" "}
                tag next to it.
              </li>
            </div>
          </div>
        </>
      ),
    },
  ];

  // Define Steps for Phrase Flow (10 slides)
  const phraseSteps: Step[] = [
    {
      title: "Slide 1",
      render: () => (
        <>
          <div
            className={` lg:text-lg md:text-l sm:text-sm text-sm text-center  ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Click on {""}
            <span className={`font-bold text-[#FFE500]`}>Copy Phrase</span> or
            <span className={`font-bold text-[#FFE500]`}> Copy Key</span> from
            export wallet.
          </div>
          <div className="flex justify-center mt-5">
            <Image
              src={Exwallet}
              alt=""
              className="lg:w-[300px] md:w-[300px] sm:w-[200px] w-[200px] m-auto"
            />
          </div>
        </>
      ),
    },
    {
      title: "Slide 2",
      render: () => (
        <>
          <div
            className={` lg:text-lg md:text-l sm:text-sm text-sm text-center mb-3 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Download & Install the Extension or App{" "}
          </div>
          <div className="flex gap-5 items-start justify-center lg:flex-row md:flex-row sm:flex-col flex-col ">
            <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
              <Image src={install} alt="" width={250} />
            </div>
            <div className="lg:w-[60%] md:w-[60%] sm:w-[100%] w-[100%] mt-3">
              <ul
                className={` lg:text-lg md:text-l sm:text-sm text-sm  mb-3 ${
                  theme === "dark" ? "text-[#FFE500]" : "text-black"
                }`}
              >
                1. Visit the Official Website :
              </ul>
              <li>
                Go to the official website:{" "}
                <a
                  className="text-blue-600"
                  href="https://metamask.io/"
                  target="_blank"
                >
                  https://metamask.io/
                </a>
                .
              </li>

              <ul
                className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                  theme === "dark" ? "text-[#FFE500]" : "text-black"
                }`}
              >
                2. For desktop :
              </ul>
              <li
                className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Click "Download" and choose the browser extension for Chrome,
                Firefox, Brave, or Edge.
              </li>
              <li
                className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Install the extension from the browser's official store.
              </li>
              <ul
                className={`lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                  theme === "dark" ? "text-[#FFE500]" : "text-black"
                }`}
              >
                3. For Mobile :
              </ul>
              <li
                className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Download the MetaMask app from the App Store (iOS) or Google
                Play Store (Android).
              </li>
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
            className={` lg:text-lg md:text-l sm:text-sm text-sm text-center mb-3 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Import and export wallet instruction
          </div>
          <div>
            <ul
              className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                theme === "dark" ? "text-[#FFE500]" : "text-black"
              }`}
            >
              1. Export wallet :
            </ul>
            <li
              className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Exporting your wallet means saving the private keys or recovery
              phrase associated with your wallet.
            </li>
            <li
              className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              This allows you to access your wallet from any device.{" "}
            </li>
            <li
              className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              It's important to keep your private keys safe, as anyone with
              access to them can control your wallet and the assets within it.
              It’s like a password for a wallet but you can't change or forget
              it.
            </li>
          </div>
          <div>
            <ul
              className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                theme === "dark" ? "text-[#FFE500]" : "text-black"
              }`}
            >
              1. Import Wallet :
            </ul>
            <li
              className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Importing your wallet means restoring access to your existing
              wallet on a new device by using your private key or recovery
              Phrase.
            </li>
            <li
              className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              This process is essential when switching devices or recovering
              access to your wallet.
            </li>
            <li
              className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
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
            className={`lg:text-lg md:text-l sm:text-sm text-sm text-center mb-3 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            There are 2 methods for export wallet
          </div>
          <div>
            <ul
              className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                theme === "dark" ? "text-[#FFE500]" : "text-black"
              }`}
            >
              1. Copy Phrase :
            </ul>
            <li
              className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              This method will export your entire wallet with an account. You
              will need to import the entire wallet in your preferred wallet
              provider.
            </li>
          </div>
          <div>
            <ul
              className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                theme === "dark" ? "text-[#FFE500]" : "text-black"
              }`}
            >
              1. Copy Key :
            </ul>
            <li
              className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
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
        <>
          <div
            className={`  lg:text-lg md:text-l sm:text-sm text-sm text-center mb-3 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Importing a Wallet to
            <span className={`font-bold text-[#FFE500]`}> MetaMask</span> Using
            <span className={`font-bold text-[#FFE500]`}> Copy Phrase</span>
          </div>
          <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
            <div className="flex justify-center mt-3 lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%]">
              <Image
                src={started}
                alt=""
                className="lg:w-[280px] md:w-[280px] sm:w-[200px] w-[200px] m-auto"
              />
            </div>
            <div className="lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%] mt-3">
              <ul
                className={`  lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                  theme === "dark" ? "text-[#FFE500]" : "text-black"
                }`}
              >
                1. Open MetaMask :
              </ul>
              <li>Click on the MetaMask extension or open the app.</li>

              <ul
                className={`  lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                  theme === "dark" ? "text-[#FFE500]" : "text-black"
                }`}
              >
                1. Select Import Wallet :
              </ul>
              <li>Click "Import Wallet" on the startup screen.</li>
            </div>
          </div>
        </>
      ),
    },

    {
      title: "Slide 6",
      render: () => (
        <>
          <div
            className={`  lg:text-lg md:text-l sm:text-sm text-sm text-center mb-3 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Importing a Wallet to MetaMask Using
            <span className={`font-bold text-[#FFE500]`}> Copy Phrase</span>
          </div>
          <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
            <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
              <Image
                src={seed}
                alt=""
                className="lg:w-[200px] md:w-[200px] sm:w-[180px] w-[180px] m-auto"
              />
            </div>
            <div className="lg:w-[60%] md:w-[60%] sm:w-[100%] w-[100%] mt-3">
              <ul
                className={`  lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                  theme === "dark" ? "text-[#FFE500]" : "text-black"
                }`}
              >
                1. Enter Seed Phrase :
              </ul>
              <li>Input the 12-word seed phrase of your existing wallet.</li>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Slide 7",
      render: () => (
        <>
          <div
            className={`  lg:text-lg md:text-l sm:text-sm text-sm text-center mb-3 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Importing a Wallet to MetaMask Using
            <span className={`font-bold text-[#FFE500]`}> Copy Phrase</span>
          </div>
          <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
            <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
              <Image
                src={pass}
                alt=""
                className="lg:w-[200px] md:w-[200px] sm:w-[180px] w-[180px] m-auto"
              />
            </div>
            <div className="lg:w-[60%] md:w-[60%] sm:w-[100%] w-[100%] mt-3">
              <ul
                className={` lg:text-lg md:text-l sm:text-sm text-sm mt-5 mb-3 ${
                  theme === "dark" ? "text-[#FFE500]" : "text-black"
                }`}
              >
                1. Set a Password :
              </ul>
              <li>Create a new password for this MetaMask account.</li>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Slide 8",
      render: () => (
        <>
          <div
            className={`  lg:text-lg md:text-l sm:text-sm text-sm text-center mb-3 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Add account in your wallet using
            <span className={`font-bold text-[#FFE500]`}> Copy Key</span>
          </div>
          <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
            <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
              <Image
                src={imp2}
                alt=""
                className="lg:w-[200px] md:w-[200px] sm:w-[180px] w-[180px] m-auto"
              />
            </div>
            <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
              <li>
                You should be able to see the newly imported account in the
                account selector dropdown with an{" "}
                <span className={`font-bold text-[#FFE500]`}>'Imported'</span>{" "}
                tag next to it.
              </li>
            </div>
          </div>
        </>
      ),
    },
  ];

  const getCurrentSteps = () => {
    if (flowType === "copy") return copySteps;
    if (flowType === "phrase") return phraseSteps;
    return phraseSteps;
  };

  const handleNext = () => {
    const steps = getCurrentSteps();

    if (currentStep === 3 && !flowType) {
      // Automatically activate "phrase" on Step 4
      setFlowType("phrase");
      setCurrentStep(0); // Move to the first step of the "phrase" flow
      return; // Exit early to prevent advancing further
    }

    // Proceed to the next step normally
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  const handleBack = () => {
    if (flowType && currentStep === 0) {
      // When on first step of copy or phrase flow, go back to initial step 1
      setFlowType("phrase");
      setCurrentStep(0);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleMethodSelect = (method: "copy" | "phrase") => {
    setFlowType(method);
    setCurrentStep(0); // Reset to first step of the selected flow
  };

  // const returnToMethodSelection = () => {
  //   setFlowType(null);
  //   setCurrentStep(3); // Go back to Step 4 where the method selection happens
  // };

  const resetFlow = () => {
    setCurrentStep(0);
    setFlowType("phrase");
    onClose();
  };
  const isLastStep = currentStep === getCurrentSteps().length - 1;

  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] ">
        <div
          ref={popupRef}
          className="bg-white rounded-lg w-[80%]  relative  m-auto sm:w-[80%] lg:w-[45%] md:w-[50%]"
        >
          {/* Close button at the top right */}
          <div className="absolute top-0 right-0 z-10">
            {/* <button
              onClick={resetFlow}
              className={` p-2 rounded-full  transition-colors ${
                theme === "dark" ? "text-[#F4F3F3]" : "text-[#1E1E1E]"
              }`}
            >
              <X size={20} />
            </button> */}
          </div>

          <div
            className={`  flex flex-col justify-between rounded-md ${
              theme === "dark" ? "bg-[#1E1E1E] " : "bg-[#F4F3F3]"
            }`}
          >
            <div
              className={` pb-6   ${
                theme === "dark" ? "bg-[#080808] " : "bg-[#F4F3F3] "
              }`}
            >
              <div className="flex justify-between  border-b-2 border-[#1E1E1E]">
                <button className="p-3">Metamask Wallet</button>
                <button className="p-3">Phantom Wallet</button>
                <button className="p-3">Uniswap Wallet</button>
                <button className="p-3">Coinbase Wallet</button>
                <button className="p-3">Rabby Wallet</button>
              </div>

              <div className="flex justify-start mb-1 pt-3 ">
                {/* <h2 className="text-xl font-semibold">
                    {getCurrentSteps()[currentStep].title}
                  </h2> */}
                <span className="text-gray-500">
                  Step {currentStep + 1} of {getCurrentSteps().length}
                </span>
              </div>

              <div className="h-2 bg-transaparent rounded-full border border-[#ffe600ac]">
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
            <div className="flex border-b border-[#FFE500]">
              <button
                onClick={() => handleMethodSelect("copy")}
                className={`flex-1 px-4 py-3 lg:text-lg md:text-l sm:text-sm text-sm font-bold border-b-2 ${
                  flowType === "copy"
                    ? "border-[#FFE500] text-black bg-[#FFE500]"
                    : "border-transparent text-[#FFE500]"
                }`}
              >
                Copy key
              </button>
              <button
                onClick={() => handleMethodSelect("phrase")}
                className={`flex-1 px-4 py-3 lg:text-lg md:text-l sm:text-sm text-sm border-b-2 font-bold ${
                  flowType === "phrase"
                    ? "border-[#FFE500] text-black bg-[#FFE500]"
                    : "border-transparent text-[#FFE500]"
                }`}
              >
                Copy phrase
              </button>
            </div>

            {/* Content */}
            <div
              className={`p-6 ${
                theme === "dark" ? "bg-[#1E1E1E]" : "bg-[#F4F3F3]"
              }`}
            >
              {getCurrentSteps()[currentStep].render()}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between px-6 pb-6">
              <button
                onClick={handleBack}
                className={`px-6 py-2 rounded-full ${
                  currentStep === 0
                    ? "bg-transparent cursor-not-allowed border border-[#FFE500]"
                    : "bg-transparent text-white border border-[#FFE500]"
                }`}
                disabled={currentStep === 0}
              >
                Back
              </button>
              {isLastStep ? (
                <button
                  onClick={handleFinish}
                  className="px-6 py-2 bg-[#FFE500] text-black rounded-full font-semibold"
                >
                  Finish
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-[#FFE500] text-black rounded-full"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPopup;

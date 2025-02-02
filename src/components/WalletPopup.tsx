import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import Exwallet1 from "../assets/Transferwallet 1.svg";
import Exwallet2 from "../assets/Transferwallet 2.svg";
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
import { Tooltip } from "antd";
import metamask from "../assets/Metamask.svg";
import coinbase from "../assets/coinbase.svg";
import phantom from "../assets/phantom.svg";
import uniswap from "../assets/Uniswap.svg";
import rubby from "../assets/rubby.svg";
import Pdown from "../assets/pDownload.svg";
import Pwallet from "../assets/P-wallet.svg";
import Pkey from "../assets/P-key.svg";
import pNetwork from "../assets/P-network.svg";
import device from "../assets/p-device.svg";
import pSeed from "../assets/p-seed.svg";
import pImportSeed from "../assets/p-importseed.svg";
import recovery from "../assets/Crecovery.svg";
import Cwallet from "../assets/Cwallet.svg";
import Useed from "../assets/u-seed.svg";
import Pdone from "../assets/p-done.svg";
import Cdone from "../assets/c-done.svg";
import Uwallet from "../assets/U-wallet.svg";
import UImport from "../assets/u-importwallet.svg";
import Udevice from "../assets/u-device.svg";
import Udone from "../assets/u-done.svg";
import Cmanually from "../assets/C-manually.svg";
import CPharse from "../assets/C-phrase.svg";
import Rwallet from "../assets/R-wallet.svg";
import Rseed from "../assets/R-seed.svg";
import Rpassword from "../assets/R-password.svg";
import done1 from "../assets/R-done.svg";
import done2 from "../assets/R-done2.svg";
import Rkey from "../assets/R-key.svg";

type Step = {
  title: string;
  render: () => JSX.Element; // Custom JSX for each step
};

type WalletPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};
type WalletType = "metamask" | "phantom" | "coinbase" | "uniswap" | "rubby";

const WalletPopup: React.FC<WalletPopupProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [flowType, setFlowType] = useState<"copy" | "phrase">("phrase");
  const popupRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [selectedWallet, setSelectedWallet] = useState<WalletType>("phantom");

  useEffect(() => {
    if (isOpen) {
      // Disable scrolling
      document.body.style.overflow = "hidden";
    } else {
      // Enable scrolling
      document.body.style.overflow = "";
    }

    return () => {
      // Clean up to avoid side effects
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

  const walletSteps: Record<
    WalletType,
    {
      copy: { title: string; render: () => JSX.Element }[];
      phrase: { title: string; render: () => JSX.Element }[];
    }
  > = {
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
                  src={Exwallet1}
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
                <div className=" w-[100%] mt-3">
                  <ul
                    className={` lg:text-lg md:text-md sm:text-sm text-sm  mb-3 ${
                      theme === "dark" ? "text-[#FFE500]" : "text-black"
                    }`}
                  >
                    1. Visit the Official Website :
                  </ul>
                  <li
                    className={` lg:text-lg md:text-md  sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Go to the official website:{" "}
                    <a
                      className="text-blue-600"
                      href="https://metamask.io/"
                      target="_blank"
                    >
                      https://metamask.io/
                    </a>
                  </li>

                  <ul
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-[#FFE500]" : "text-black"
                    }`}
                  >
                    2. For desktop :
                  </ul>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click Download and choose the browser extension for Chrome,
                    Firefox, Brave, or Edge.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Install the extension from the browser's official store.
                  </li>
                  <ul
                    className={`lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-[#FFE500]" : "text-black"
                    }`}
                  >
                    3. For Mobile :
                  </ul>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
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
                className={` lg:text-lg md:text-md sm:text-sm text-sm text-center mb-3 ${
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
                  className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Exporting your wallet means saving the private keys or
                  recovery phrase associated with your wallet.
                </li>
                <li
                  className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  This allows you to access your wallet from any device.{" "}
                </li>
                <li
                  className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
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
                  className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-[#FFE500]" : "text-black"
                  }`}
                >
                  1. Import Wallet :
                </ul>
                <li
                  className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Importing your wallet means restoring access to your existing
                  wallet on a new device by using your private key or recovery
                  Phrase.
                </li>
                <li
                  className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  This process is essential when switching devices or recovering
                  access to your wallet.
                </li>
                <li
                  className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
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
        {
          title: "Slide 4",
          render: () => (
            <>
              <div
                className={`lg:text-lg md:text-md sm:text-sm text-sm text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                There are 2 methods for export wallet
              </div>
              <div>
                <ul
                  className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-[#FFE500]" : "text-black"
                  }`}
                >
                  1. Copy Phrase :
                </ul>
                <li
                  className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  This method will export your entire wallet with an account.
                  You will need to import the entire wallet in your preferred
                  wallet provider.
                </li>
              </div>
              <div>
                <ul
                  className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-[#FFE500]" : "text-black"
                  }`}
                >
                  1. Copy Key :
                </ul>
                <li
                  className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  This method will export only one account which you can import
                  in your existing wallet using a private key.
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Key </span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%]">
                  <Image src={account} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <ul
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-[#FFE500]" : "text-black"
                    }`}
                  >
                    1. For Chrome Extension:
                  </ul>
                  <li
                    className={` lg:text-lg md:text-lg sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click the account selector at the top of your wallet.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Select Add account or hardware wallet' at the bottom of the
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Key</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%]">
                  <Image src={imp} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    On the next menu, select{" "}
                    <span className={`font-bold text-[#FFE500]`}>
                      Import account.
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Key</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%]">
                  <Image src={key} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    You will be directed to the Import page. Paste your private
                    key and click on{" "}
                    <span className={`font-bold text-[#FFE500]`}>Import.</span>
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Key</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%]">
                  <Image src={imp2} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    You should be able to see the newly imported account in the
                    account selector dropdown with an{" "}
                    <span className={`font-bold text-[#FFE500]`}>Imported</span>{" "}
                    tag next to it.
                  </li>
                </div>
              </div>
            </>
          ),
        },
        {
          title: "Slide 9",
          render: () => (
            <>
              <div
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Best Practices for{" "}
                <span className={`font-bold text-[#FFE500]`}>
                  'Wallet Security'
                </span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className=" mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Always download wallets from official websites or app
                    stores.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Store your seed phrase/private key offline in a secure
                    location.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Do not share your seed phrase/private key with anyone, even
                    if they claim to be support personnel.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Use strong, unique passwords for your wallets.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Enable additional security features like biometric
                    authentication where available.
                  </li>
                </div>
              </div>
            </>
          ),
        },
      ],
      phrase: [
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
                  src={Exwallet1}
                  alt=""
                  // className="lg:w-[300px] md:w-[300px] sm:w-[200px] w-[200px] m-auto"
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
                <div className=" w-[100%] mt-3">
                  <ul
                    className={` lg:text-lg md:text-md sm:text-sm text-sm  mb-3 ${
                      theme === "dark" ? "text-[#FFE500]" : "text-black"
                    }`}
                  >
                    1. Visit the Official Website :
                  </ul>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Go to the official website:{" "}
                    <a
                      className="text-blue-600"
                      href="https://metamask.io/"
                      target="_blank"
                    >
                      https://metamask.io/
                    </a>
                  </li>

                  <ul
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-[#FFE500]" : "text-black"
                    }`}
                  >
                    2. For desktop :
                  </ul>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click Download and choose the browser extension for Chrome,
                    Firefox, Brave, or Edge.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Install the extension from the browser's official store.
                  </li>
                  <ul
                    className={`lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-[#FFE500]" : "text-black"
                    }`}
                  >
                    3. For Mobile :
                  </ul>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
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
                className={` lg:text-lg md:text-md sm:text-sm text-sm text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Import and export wallet instruction
              </div>
              <div>
                <ul
                  className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-[#FFE500]" : "text-black"
                  }`}
                >
                  1. Export wallet :
                </ul>
                <li
                  className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Exporting your wallet means saving the private keys or
                  recovery phrase associated with your wallet.
                </li>
                <li
                  className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  This allows you to access your wallet from any device.{" "}
                </li>
                <li
                  className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
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
                  className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-[#FFE500]" : "text-black"
                  }`}
                >
                  1. Import Wallet :
                </ul>
                <li
                  className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Importing your wallet means restoring access to your existing
                  wallet on a new device by using your private key or recovery
                  Phrase.
                </li>
                <li
                  className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  This process is essential when switching devices or recovering
                  access to your wallet.
                </li>
                <li
                  className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
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
        {
          title: "Slide 4",
          render: () => (
            <>
              <div
                className={`lg:text-lg md:text-md sm:text-sm text-sm text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                There are 2 methods for export wallet
              </div>
              <div>
                <ul
                  className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-[#FFE500]" : "text-black"
                  }`}
                >
                  1. Copy Phrase :
                </ul>
                <li
                  className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  This method will export your entire wallet with an account.
                  You will need to import the entire wallet in your preferred
                  wallet provider.
                </li>
              </div>
              <div>
                <ul
                  className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-[#FFE500]" : "text-black"
                  }`}
                >
                  1. Copy Key :
                </ul>
                <li
                  className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  This method will export only one account which you can import
                  in your existing wallet using a private key.
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
                className={`  lg:text-lg md:text-md sm:text-sm text-sm text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Importing a Wallet to
                <span className={`font-bold text-[#FFE500]`}>
                  {" "}
                  MetaMask
                </span>{" "}
                Using
                <span className={`font-bold text-[#FFE500]`}> Copy Phrase</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%]">
                  <Image
                    src={started}
                    alt=""
                    // className="lg:w-[280px] md:w-[280px] sm:w-[200px] w-[200px] m-auto"
                  />
                </div>
                <div className="lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%] mt-3">
                  <ul
                    className={`  lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-[#FFE500]" : "text-black"
                    }`}
                  >
                    1. Open MetaMask :
                  </ul>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on the MetaMask extension or open the app.
                  </li>

                  <ul
                    className={`  lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-[#FFE500]" : "text-black"
                    }`}
                  >
                    1. Select Import Wallet :
                  </ul>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click Import Wallet on the startup screen.
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
                className={`  lg:text-lg md:text-md sm:text-sm text-sm text-center mb-3 ${
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
                    // className="lg:w-[200px] md:w-[200px] sm:w-[180px] w-[180px] m-auto"
                  />
                </div>
                <div className="lg:w-[60%] md:w-[60%] sm:w-[100%] w-[100%] mt-3">
                  <ul
                    className={`  lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-[#FFE500]" : "text-black"
                    }`}
                  >
                    1. Enter Seed Phrase :
                  </ul>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Input the 12-word seed phrase of your existing wallet.
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
                className={`  lg:text-lg md:text-md sm:text-sm text-sm text-center mb-3 ${
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
                    // className="lg:w-[200px] md:w-[200px] sm:w-[180px] w-[180px] m-auto"
                  />
                </div>
                <div className="lg:w-[60%] md:w-[60%] sm:w-[100%] w-[100%] mt-3">
                  <ul
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-[#FFE500]" : "text-black"
                    }`}
                  >
                    1. Set a Password :
                  </ul>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    {" "}
                    Create a new password for this MetaMask account.
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
                className={`  lg:text-lg md:text-md sm:text-sm text-sm text-center mb-3 ${
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
                    // className="lg:w-[200px] md:w-[200px] sm:w-[180px] w-[180px] m-auto"
                  />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    You should be able to see the newly imported account in the
                    account selector dropdown with an{" "}
                    <span className={`font-bold text-[#FFE500]`}>Imported</span>{" "}
                    tag next to it.
                  </li>
                </div>
              </div>
            </>
          ),
        },
        {
          title: "Slide 9",
          render: () => (
            <>
              <div
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Best Practices for{" "}
                <span className={`font-bold text-[#FFE500]`}>
                  'Wallet Security'
                </span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className=" mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Always download wallets from official websites or app
                    stores.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Store your seed phrase/private key offline in a secure
                    location.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Do not share your seed phrase/private key with anyone, even
                    if they claim to be support personnel.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Use strong, unique passwords for your wallets.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Enable additional security features like biometric
                    authentication where available.
                  </li>
                </div>
              </div>
            </>
          ),
        },
      ],
    },
    phantom: {
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
                  src={Exwallet1}
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
                <div className=" w-[100%] mt-3">
                  <ul
                    className={` lg:text-lg md:text-md sm:text-sm text-sm  mb-3 ${
                      theme === "dark" ? "text-[#FFE500]" : "text-black"
                    }`}
                  >
                    1. Visit the Official Website :
                  </ul>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Go to the official website:{" "}
                    <a
                      className="text-blue-600"
                      href="  https://phantom.com/download"
                      target="_blank"
                    >
                      https://phantom.com/download
                    </a>
                  </li>

                  <ul
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
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
                    Click Download and choose the browser extension for Chrome,
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
                    Download the Phantom app from the App Store (iOS) or Google
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
                  This method will export your entire wallet with an account.
                  You will need to import the entire wallet in your preferred
                  wallet provider.
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
                  This method will export only one account which you can import
                  in your existing wallet using a private key.
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Key</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={Pwallet} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <ul
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-[#FFE500]" : "text-black"
                    }`}
                  >
                    1. General step:
                  </ul>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on{" "}
                    <span className={`font-bold text-[#FFE500]`}>
                      I already have a wallet
                    </span>
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on{" "}
                    <span className={`font-bold text-[#FFE500]`}>
                      {" "}
                      Other import options
                    </span>
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> “Copy Key</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <Image src={Pkey} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on
                    <span className={`font-bold text-[#FFE500]`}>
                      'Import Private Key'
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Key</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%]">
                  <Image src={pNetwork} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on{" "}
                    <span className={`font-bold text-[#FFE500]`}>
                      'Network'
                    </span>{" "}
                    and select Ethereum. Enter Name for your account and private
                    key which you copied from the platform.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on{" "}
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Key</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%]">
                  <Image src={device} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Enable Device Authentication ( if applicable or secure
                    wallet ) and click on
                    <span className={`font-bold text-[#FFE500]`}>'Next'</span>
                  </li>
                </div>
              </div>
            </>
          ),
        },
        {
          title: "Slide 9",
          render: () => (
            <>
              <div
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Key</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={Pdone} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on 'Continue' and your account is ready to use.
                  </li>
                </div>
              </div>
            </>
          ),
        },
        {
          title: "Slide 10",
          render: () => (
            <>
              <div
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Best Practices for{" "}
                <span className={`font-bold text-[#FFE500]`}>
                  'Wallet Security'
                </span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className=" mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Always download wallets from official websites or app
                    stores.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Store your seed phrase/private key offline in a secure
                    location.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Do not share your seed phrase/private key with anyone, even
                    if they claim to be support personnel.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Use strong, unique passwords for your wallets.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Enable additional security features like biometric
                    authentication where available.
                  </li>
                </div>
              </div>
            </>
          ),
        },
      ],
      phrase: [
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
                  src={Exwallet1}
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
                <div className=" w-[100%] mt-3">
                  <ul
                    className={` lg:text-lg md:text-l sm:text-sm text-sm  mb-3 ${
                      theme === "dark" ? "text-[#FFE500]" : "text-black"
                    }`}
                  >
                    1. Visit the Official Website :
                  </ul>
                  <li>
                    <a
                      className="text-blue-600"
                      href="  https://phantom.com/download"
                      target="_blank"
                    >
                      https://phantom.com/download
                    </a>
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
                    Click Download and choose the browser extension for Chrome,
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
                    Download the Phantom app from the App Store (iOS) or Google
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
                  This method will export your entire wallet with an account.
                  You will need to import the entire wallet in your preferred
                  wallet provider.
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
                  This method will export only one account which you can import
                  in your existing wallet using a private key.
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Phrase</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={Pwallet} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <ul
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-[#FFE500]" : "text-black"
                    }`}
                  >
                    1. General step:
                  </ul>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on{" "}
                    <span className={`font-bold text-[#FFE500]`}>
                      I already have a wallet.
                    </span>
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on{" "}
                    <span className={`font-bold text-[#FFE500]`}>
                      Other import options.
                    </span>
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> “Copy Key</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={pSeed} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on
                    <span className={`font-bold text-[#FFE500]`}>
                      Import Seed Phrase
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Key</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={pImportSeed} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Enter the Phrase that you copied from the platform. It will
                    fetch your wallet and accounts. key which you copied from
                    the platform.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on{" "}
                    <span className={`font-bold text-[#FFE500]`}>
                      Continue.
                    </span>
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Key</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={device} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Enable Device Authentication ( if applicable or secure
                    wallet ) and click on
                    <span className={`font-bold text-[#FFE500]`}> Next. </span>
                  </li>
                </div>
              </div>
            </>
          ),
        },
        {
          title: "Slide 9",
          render: () => (
            <>
              <div
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Key</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={Pdone} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on Continue and your account is ready to use.
                  </li>
                </div>
              </div>
            </>
          ),
        },
        {
          title: "Slide 10",
          render: () => (
            <>
              <div
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Best Practices
                <span className={`font-bold text-[#FFE500]`}>
                  'Wallet Security'
                </span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className=" mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Always download wallets from official websites or app
                    stores.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Store your seed phrase/private key offline in a secure
                    location.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Do not share your seed phrase/private key with anyone, even
                    if they claim to be support personnel.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Use strong, unique passwords for your wallets.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Enable additional security features like biometric
                    authentication where available.
                  </li>
                </div>
              </div>
            </>
          ),
        },
      ],
    },
    coinbase: {
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
                Coinbase not support to import wallet using
                <span className={`font-bold text-[#FFE500]`}>Copy Key</span>
              </div>
              <div className="flex justify-center mt-5">
                <Image
                  src={Exwallet2}
                  alt=""
                  className="lg:w-[300px] md:w-[300px] sm:w-[200px] w-[200px] m-auto"
                />
              </div>
            </>
          ),
        },
      ],
      phrase: [
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
                from export wallet.
              </div>
              <div className="flex justify-center mt-5">
                <Image
                  src={Exwallet2}
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
                <div className="w-[100%] mt-3">
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
                      href="https://www.coinbase.com/wallet/downloads"
                      target="_blank"
                    >
                      https://www.coinbase.com/wallet/downloads{" "}
                    </a>
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
                    Click Download and choose the browser extension for Chrome,
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
                    Download the Coinbase app from the App Store (iOS) or Google
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
                  This method will export your entire wallet with an account.
                  You will need to import the entire wallet in your preferred
                  wallet provider.
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
                  This method will export only one account which you can import
                  in your existing wallet using a private key.
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Phrase</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={Cwallet} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <ul
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-[#FFE500]" : "text-black"
                    }`}
                  >
                    1. General step:
                  </ul>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on{" "}
                    <span className={`font-bold text-[#FFE500]`}>
                      {" "}
                      I already have a wallet.
                    </span>
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> “Copy Key</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={CPharse} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on
                    <span className={`font-bold text-[#FFE500]`}>
                      Recovery Phrase.
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Key</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={Cmanually} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on
                    <span className={`font-bold text-[#FFE500]`}>
                      Enter Manually.
                    </span>
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Key</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={Cdone} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on{" "}
                    <span className={`font-bold text-[#FFE500]`}>
                      {" "}
                      Continue{" "}
                    </span>{" "}
                    and Add Device authentication for Security Purpose.
                  </li>
                </div>
              </div>
            </>
          ),
        },

        {
          title: "Slide 9",
          render: () => (
            <>
              <div
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Best Practices
                <span className={`font-bold text-[#FFE500]`}>
                  'Wallet Security'
                </span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className=" mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Always download wallets from official websites or app
                    stores.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Store your seed phrase/private key offline in a secure
                    location.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Do not share your seed phrase/private key with anyone, even
                    if they claim to be support personnel.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Use strong, unique passwords for your wallets.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Enable additional security features like biometric
                    authentication where available.
                  </li>
                </div>
              </div>
            </>
          ),
        },
      ],
    },
    uniswap: {
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
                Uniswap not support to import wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Key </span>
              </div>
              <div className="flex justify-center mt-5">
                <Image
                  src={Exwallet2}
                  alt=""
                  className="lg:w-[300px] md:w-[300px] sm:w-[200px] w-[200px] m-auto"
                />
              </div>
            </>
          ),
        },
      ],
      phrase: [
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
                from export wallet.
              </div>
              <div className="flex justify-center mt-5">
                <Image
                  src={Exwallet2}
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
                <div className=" w-[100%] mt-3">
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
                      href="https://wallet.uniswap.org/"
                      target="_blank"
                    >
                      https://wallet.uniswap.org/{" "}
                    </a>
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
                    Click Download and choose the browser extension for Chrome,
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
                    Download the Uniswap app from the App Store (iOS) or Google
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
                  This method will export your entire wallet with an account.
                  You will need to import the entire wallet in your preferred
                  wallet provider.
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
                  This method will export only one account which you can import
                  in your existing wallet using a private key.
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Phrase</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={Uwallet} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <ul
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-[#FFE500]" : "text-black"
                    }`}
                  >
                    1. General step:
                  </ul>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on{" "}
                    <span className={`font-bold text-[#FFE500]`}>
                      {" "}
                      Add an existing wallet.
                    </span>
                    .
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Key</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={UImport} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on
                    <span className={`font-bold text-[#FFE500]`}>
                      Import a wallet.
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Key</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={Useed} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Copy Phrase from the platform and paste it.
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Key</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={Udevice} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Enable notification and Restore wallet phrase if applicable.
                    Enable Biometrics will secure your wallet. So, we recommend
                    turning it on.
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Key</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={Udone} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on{" "}
                    <span className={`font-bold text-[#FFE500]`}>
                      {" "}
                      Continue
                    </span>
                    . It will fetch a wallet.
                  </li>
                </div>
              </div>
            </>
          ),
        },
        {
          title: "Slide 10",
          render: () => (
            <>
              <div
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Best Practices
                <span className={`font-bold text-[#FFE500]`}>
                  'Wallet Security'
                </span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className=" mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Always download wallets from official websites or app
                    stores.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Store your seed phrase/private key offline in a secure
                    location.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Do not share your seed phrase/private key with anyone, even
                    if they claim to be support personnel.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Use strong, unique passwords for your wallets.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Enable additional security features like biometric
                    authentication where available.
                  </li>
                </div>
              </div>
            </>
          ),
        },
      ],
    },
    rubby: {
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
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <Image
                  src={Exwallet1}
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
                <div className=" w-[100%] mt-3">
                  <ul
                    className={` lg:text-lg md:text-l sm:text-sm text-sm  mb-3 ${
                      theme === "dark" ? "text-[#FFE500]" : "text-black"
                    }`}
                  >
                    1. Visit the Official Website :
                  </ul>
                  <li>
                    <a
                      className="text-blue-600"
                      href="https://rabby.io/"
                      target="_blank"
                    >
                      https://rabby.io/
                    </a>
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
                    Click Download and choose the browser extension for Chrome,
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
                    Download the Rubby app from the App Store (iOS) or Google
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
                  This method will export your entire wallet with an account.
                  You will need to import the entire wallet in your preferred
                  wallet provider.
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
                  This method will export only one account which you can import
                  in your existing wallet using a private key.
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Key</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={Rwallet} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <ul
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-[#FFE500]" : "text-black"
                    }`}
                  >
                    1. General step:
                  </ul>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on{" "}
                    <span className={`font-bold text-[#FFE500]`}>
                      {" "}
                      I already have an address.
                    </span>
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Key</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={Rkey} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on {""}
                    <span className={`font-bold text-[#FFE500]`}>
                      Import Private Key.
                    </span>
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Enter the key that you copied from the platform.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on
                    <span className={`font-bold text-[#FFE500]`}>
                      {" "}
                      Confirm.
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Key</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={Rpassword} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Set password and agree terms and condition of rabby wallet.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on{" "}
                    <span className={`font-bold text-[#FFE500]`}>
                      {" "}
                      Continue.
                    </span>
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Key</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={done2} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    It will fetch wallet and click on
                    <span className={`font-bold text-[#FFE500]`}> Done.</span>
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Your wallet is ready to use.
                  </li>
                </div>
              </div>
            </>
          ),
        },
        {
          title: "Slide 9",
          render: () => (
            <>
              <div
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Best Practices for{" "}
                <span className={`font-bold text-[#FFE500]`}>
                  'Wallet Security'
                </span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className=" mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Always download wallets from official websites or app
                    stores.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Store your seed phrase/private key offline in a secure
                    location.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Do not share your seed phrase/private key with anyone, even
                    if they claim to be support personnel.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Use strong, unique passwords for your wallets.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Enable additional security features like biometric
                    authentication where available.
                  </li>
                </div>
              </div>
            </>
          ),
        },
      ],
      phrase: [
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
                from export wallet.
              </div>
              <div className="flex justify-center mt-5">
                <Image
                  src={Exwallet1}
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
                <div className=" w-[100%] mt-3">
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
                      href="https://rabby.io/"
                      target="_blank"
                    >
                      https://rabby.io/
                    </a>
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
                    Download the Rubby app from the App Store (iOS) or Google
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
                  This method will export your entire wallet with an account.
                  You will need to import the entire wallet in your preferred
                  wallet provider.
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
                  This method will export only one account which you can import
                  in your existing wallet using a private key.
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Phrase</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={Rwallet} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <ul
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-[#FFE500]" : "text-black"
                    }`}
                  >
                    1. General step:
                  </ul>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on{" "}
                    <span className={`font-bold text-[#FFE500]`}>
                      I already have an address.
                    </span>
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}>
                  {" "}
                  Copy Phrase.
                </span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={Rseed} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on {""}
                    <span className={`font-bold text-[#FFE500]`}>
                      Import Seed Phrase.
                    </span>
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Enter the{" "}
                    <span className={`font-bold text-[#FFE500]`}>Phrase</span>{" "}
                    that you copied from the platform.
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Phrase</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={Rpassword} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Set password and agree terms and condition of rabby wallet.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Click on{" "}
                    <span className={`font-bold text-[#FFE500]`}>
                      {" "}
                      Continue.
                    </span>
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
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Add account in your wallet using
                <span className={`font-bold text-[#FFE500]`}> Copy Phrase</span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex justify-center mt-3 lg:w-[50%] md:w-[50%] sm:w-[100%] w-[100%]">
                  <Image src={done1} alt="" />
                </div>
                <div className="lg:w-[70%] md:w-[70%] sm:w-[100%] w-[100%] mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    It will fetch wallet and click on
                    <span className={`font-bold text-[#FFE500]`}> Done </span>
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Your wallet is ready to use.
                  </li>
                </div>
              </div>
            </>
          ),
        },
        {
          title: "Slide 9",
          render: () => (
            <>
              <div
                className={` text-lg text-center mb-3 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Best Practices for{" "}
                <span className={`font-bold text-[#FFE500]`}>
                  'Wallet Security'
                </span>
              </div>
              <div className="flex gap-5 items-start lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className=" mt-3">
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Always download wallets from official websites or app
                    stores.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Store your seed phrase/private key offline in a secure
                    location.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Do not share your seed phrase/private key with anyone, even
                    if they claim to be support personnel.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Use strong, unique passwords for your wallets.
                  </li>
                  <li
                    className={` lg:text-lg md:text-md sm:text-sm text-sm mt-5 mb-3 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Enable additional security features like biometric
                    authentication where available.
                  </li>
                </div>
              </div>
            </>
          ),
        },
      ],
    },
  };

  const getCurrentSteps = () => {
    const wallet = walletSteps[selectedWallet];
    if (flowType === "copy") return wallet.copy;
    if (flowType === "phrase") return wallet.phrase;
    return wallet.copy; // Default to "copy" flow
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

  const resetFlow = () => {
    setCurrentStep(0);
    setFlowType("phrase");
    onClose();
  };
  const handleWalletSelect = (
    wallet: "metamask" | "phantom" | "coinbase" | "uniswap" | "rubby"
  ) => {
    setSelectedWallet(wallet);
    setFlowType("phrase"); // Default flow type
    setCurrentStep(0); // Reset to the first step
  };
  const isLastStep = currentStep === getCurrentSteps().length - 1;

  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] overflow-y-scroll py-6 scroll ">
        <div
          ref={popupRef}
          className="bg-white rounded-lg w-[80%]  relative  m-auto sm:w-[80%] lg:w-[45%] md:w-[50%]"
        >
          <div
            className={`  flex flex-col justify-between rounded-md ${
              theme === "dark" ? "bg-[#1E1E1E] " : "bg-[#F4F3F3]"
            }`}
          >
            <div
              className={` pb-6 pt-3  ${
                theme === "dark" ? "bg-[#080808] " : "bg-[#F4F3F3] "
              }`}
            >
              <div className="flex justify-around">
                {["metamask", "phantom", "coinbase", "uniswap", "rubby"].map(
                  (wallet) => (
                    <Tooltip
                      title={wallet.charAt(0).toUpperCase() + wallet.slice(1)}
                      key={wallet}
                    >
                      <button
                        onClick={() => handleWalletSelect(wallet as WalletType)}
                        className={`p-1 relative ${
                          selectedWallet === wallet ? "" : ""
                        }`}
                      >
                        <Image
                          src={
                            wallet === "metamask"
                              ? metamask
                              : wallet === "phantom"
                              ? phantom
                              : wallet === "coinbase"
                              ? coinbase
                              : wallet === "uniswap"
                              ? uniswap
                              : rubby
                          }
                          alt={wallet}
                          className={`${
                            selectedWallet === wallet
                              ? "opacity-100"
                              : "opacity-70"
                          }`}
                          width={30}
                        />
                        {selectedWallet === wallet && (
                          <div className="absolute top-0 left-0 w-full h-full  border border-[#FFE500]  rounded-full"></div>
                        )}
                      </button>
                    </Tooltip>
                  )
                )}
              </div>

              <div className="flex justify-start mb-1 pt-3 ">
                {/* <h2 className="text-xl font-semibold">
                    {getCurrentSteps()[currentStep].title}
                  </h2> */}
                <span className="text-gray-500 pl-2">
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
              {selectedWallet &&
                !["uniswap", "coinbase"].includes(selectedWallet) && (
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
                )}
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
                  className="px-6 py-2 text-[#363535] bg-[#FFE500] hover:bg-gradient-to-b from-white to-[#FFE500] rounded-full font-semibold"
                >
                  Finish
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 text-[#363535] bg-[#FFE500] hover:bg-gradient-to-b from-white to-[#FFE500] rounded-full"
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

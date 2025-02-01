import ClaimToken from "@/components/claimToken/page";
import Image from "next/image";
import img from "../assets/darkbg.png";
import { Metadata } from "next";

export default function sendTo() {
  return (
    <div>
      <div className="">
        <ClaimToken />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL("http://gryfto.com/claim-token"),
  title: "Claim-Token",
  description: "Claim your gifted token",
  openGraph: {
    images: [
      {
        url: "opengraph-image.jpg",
        width: 800,
        height: 600,
      },
      {
        url: "opengraph-image.jpg",
        width: 1800,
        height: 1600,
        alt: "Homepage",
      },
    ],
  },
};

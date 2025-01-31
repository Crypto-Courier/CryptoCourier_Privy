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
  metadataBase: new URL("http://gryfto.com"),
  title: "Claim-Token",
  description: "Claim your gifted token",
};

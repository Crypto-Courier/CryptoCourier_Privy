import History from "@/components/history/page";
import Image from "next/image";
import img from "../assets/darkbg.png";
import { Metadata } from "next";

export default function sendTo() {
  return (
    <div>
      <div className="">
        <History />
      </div>
    </div>
  );
}
export const metadata: Metadata = {
  metadataBase: new URL("http://gryfto.com"),
  title: "History",
  description: "provide history of all the transactions",
};

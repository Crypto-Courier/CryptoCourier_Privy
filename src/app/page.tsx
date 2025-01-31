import Footer from "../components/Footer";
import Homepage from "../components/Homepage";
import Image from "next/image";
import img from "../assets/darkbg.png";
import type { Metadata } from "next";

export default function Home() {
  return (
    <div>
      <div className="">
        <Homepage />
      </div>
    </div>
  );
}
export const metadata: Metadata = {
  metadataBase: new URL("https://gryfto.com"),
  title: "Gryfto",
  description: "Gift token as easy as sending email",
};

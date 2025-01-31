import Leaderboard from "../../components/leaderboard/page";
import Image from "next/image";
import img from "../assets/darkbg.png";
import { Metadata } from "next";

export default function sendTo() {
  return (
    <div>
      <div className="">
        <Leaderboard />
      </div>
    </div>
  );
}
export const metadata: Metadata = {
  metadataBase: new URL("http://gryfto.com"),
  title: "Leaderboard",
  description: "Provide top 10 users based on number of claimers",
};

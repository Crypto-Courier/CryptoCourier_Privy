import SentToken from "../../components/sendToken/page";
import Image from "next/image";
import img from "../assets/darkbg.png";
import { Metadata } from "next";

export default function SendToken() {
  return (
    <div>
      <div className="">
        <SentToken />
      </div>
    </div>
  );
}
export const metadata: Metadata = {
  metadataBase: new URL("http://gryfto.com"),
  title: "Send-Token",
  description: "gift token as easy as sending email",
};

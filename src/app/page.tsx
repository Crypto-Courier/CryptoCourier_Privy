import Footer from "../components/Footer";
import Homepage from "../components/Homepage";
import Image from "next/image";
import img from "../assets/darkbg.png";

export default function Home() {
  return (
    <div>
      <div className="">
        <Homepage />
      </div>
    </div>
  );
}
export const metadata = {
  title: "Gryfto",
  description: "Gift token as easy as sending email",
  openGraph: {
    title: "Gryfto",
    description: "Gift token as easy as sending email",
    url: "https://gryfto.com/",
    siteName: "Gryfto",
    images: [
      {
        url: "https://gryfto.com/og-send.png",
        width: 800,
        height: 600,
      },
      {
        url: "https://gryfto.com/og-send.png",
        width: 1800,
        height: 1600,
        alt: "send token",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

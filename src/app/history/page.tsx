import History from "@/components/history/page";
import Image from "next/image";
import img from "../assets/darkbg.png";

export default function sendTo() {
  return (
    <div>
      <div className="">
        <History />
      </div>
    </div>
  );
}
export const metadata = {
  title: "Trancation-History",
  description: "Gift token as easy as sending email",
  openGraph: {
    title: "Trancation-History",
    description: "Gift token as easy as sending email",
    url: "https://courierbycryptocoutrier.vercel.app/",
    siteName: "CryptoCourier",
    images: [
      {
        url: "https://ipfs.io/ipfs/QmdWkLMj6KjPPs5dRc3Y8eC4phLnWeVufQMacoTJ1Bg5kZ",
        width: 800,
        height: 600,
      },
      {
        url: "https://ipfs.io/ipfs/QmdWkLMj6KjPPs5dRc3Y8eC4phLnWeVufQMacoTJ1Bg5kZ",
        width: 1800,
        height: 1600,
        alt: "My custom alt",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

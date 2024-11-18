import Leaderboard from "../../components/leaderboard/page";
import Image from "next/image";
import img from "../assets/darkbg.png";

export default function sendTo() {
  return (
    <div>
      <div className="">
        <Leaderboard />
      </div>
    </div>
  );
}
export const metadata = {
  title: "Leaderboard",
  description: "Gift token as easy as sending email",
  openGraph: {
    title: "Leaderboard",
    description: "Gift token as easy as sending email",
    url: "https://courierbycryptocoutrier.vercel.app/",
    siteName: "CryptoCourier",
    images: [
      {
        url: "https://ipfs.io/ipfs/QmZYc893UxBw99X1cyVcc7u8byuuVrLzFupYnkMASEKRTN", // Must be an absolute URL
        width: 800,
        height: 600,
      },
      {
        url: "https://ipfs.io/ipfs/QmZYc893UxBw99X1cyVcc7u8byuuVrLzFupYnkMASEKRTN", // Must be an absolute URL
        width: 1800,
        height: 1600,
        alt: "My custom alt",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

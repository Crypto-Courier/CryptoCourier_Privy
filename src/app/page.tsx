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
  title: "CryptoCourier",
  description: "Gift token as easy as sending email",
  openGraph: {
    title: "CryptoCourier",
    description: "Gift token as easy as sending email",
    url: "https://hello-crypto.vercel.app/",
    siteName: "CryptoCourier",
    images: [
      {
        url: "https://app.optimism.io/og-image.png", // Must be an absolute URL
        width: 800,
        height: 600,
      },
      {
        url: "https://app.optimism.io/og-image.png", // Must be an absolute URL
        width: 1800,
        height: 1600,
        alt: "My custom alt",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

import SentToken from "../../components/sendToken/page";
import Image from "next/image";
import img from "../assets/darkbg.png";

export default function SendToken() {
  return (
    <div>
      <div className="">
        <SentToken />
      </div>
    </div>
  );
}
export const metadata = {
  title: "Send-Token",
  description: "Gift token as easy as sending email",
  openGraph: {
    title: "Send-Token",
    description: "Gift token as easy as sending email",
    url: "https://courierbycryptocoutrier.vercel.app/",
    siteName: "Gryfto",
    images: [
      {
        url: "https://ipfs.io/ipfs/Qmdq376VFRDXyAMRti7ZrrfNQiRHKeTmPBy1S11tiPkoi2", // Must be an absolute URL
        width: 800,
        height: 600,
      },
      {
        url: "https://ipfs.io/ipfs/Qmdq376VFRDXyAMRti7ZrrfNQiRHKeTmPBy1S11tiPkoi2", // Must be an absolute URL
        width: 1800,
        height: 1600,
        alt: "My custom alt",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

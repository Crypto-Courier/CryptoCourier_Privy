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
// export const metadata = {
//   title: "Send-Token",
//   description: "Gift token as easy as sending email",
//   openGraph: {
//     title: "Send-Token",
//     description: "Gift token as easy as sending email",
//     url: "https://gryfto.com/send-token",
//     siteName: "Gryfto",
//     images: [
//       {
//         url: "https://gryfto.com/og-send.png",
//         width: 800,
//         height: 600,
//       },
//       {
//         url: "https://gryfto.com/og-send.png",
//         width: 1800,
//         height: 1600,
//         alt: "send token",
//       },
//     ],
//     locale: "en_US",
//     type: "website",
//   },
// };

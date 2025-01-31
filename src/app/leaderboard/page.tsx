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
// export const metadata = {
//   title: "Leaderboard",
//   description: "Gift token as easy as sending email",
//   openGraph: {
//     title: "Leaderboard",
//     description: "Gift token as easy as sending email",
//     url: "https://gryfto.com/leaderboard",
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

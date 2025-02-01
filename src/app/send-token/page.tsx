import SentToken from "../../components/sendToken/page";
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
  metadataBase: new URL("http://gryfto.com/send-token"),
  title: "Send-Token",
  description: "Gift token as easy as sending email",
  openGraph: {
    images: [
      {
        url: "opengraph-image.jpg",
        width: 800,
        height: 600,
      },
      {
        url: "opengraph-image.jpg",
        width: 1800,
        height: 1600,
        alt: "Homepage",
      },
    ],
  },
};

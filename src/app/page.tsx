import Homepage from "../components/Homepage";
import type { Metadata } from "next";

export default function Home() {
  return (
    <div>
      <div className="">
        <Homepage />
      </div>
    </div>
  );
}
export const metadata: Metadata = {
  metadataBase: new URL("https://gryfto.com/"),
  title: "Gryfto",
  description: "Gift token as easy as sending email",
  openGraph: {
    title: "Gryfto",
    description: "Gift token as easy as sending email",
    url: "https://gryfto.com/",
    siteName: "Gryfto",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

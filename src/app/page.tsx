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
  metadataBase: new URL("http://gryfto.com"),
  title: "Gryfto",
  description: "Gift token as easy as sending email",
};

// export const metadata = {
//   openGraph: {
//     title: "Next.js",
//     description: "The React Framework for the Web",
//     url: "http://localhost:3000",
//     siteName: "Next.js",
//     images: [
//       {
//         url: "opengraph-image.jpg",
//         width: 800,
//         height: 600,
//       },
//       {
//         url: "opengraph-image.jpg",
//         width: 1800,
//         height: 1600,
//         alt: "My custom alt",
//       },
//     ],

//     locale: "en_US",
//     type: "website",
//   },
// };

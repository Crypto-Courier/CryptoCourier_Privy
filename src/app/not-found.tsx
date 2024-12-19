import Link from "next/link";
import { AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import notfound from "../assets/notfound.svg";
import Footer from "@/components/Footer";
import { useTheme } from "next-themes";

const NotFound: React.FC = () => {
  // const { theme } = useTheme();

  return (
    <div className="main">
      <Navbar />
      <div className="txbg">
        <div className="flex flex-col items-center justify-center   px-4 py-8">
          <div className="max-w-md w-full   rounded-xl p-8 text-center">
            <Image src={notfound} alt="" className="animate" />
            <h1 className="text-gray-200 mb-6">
              The page you are looking for doesn't exist.
            </h1>
            <div className="flex justify-center space-x-4">
              <Link
                href="/"
                className="bg-[#FFE500] text-[#363535] hover:scale-110 duration-500 transition 0.3 font-semibold py-2 px-4 rounded-lg ease-in-out"
              >
                Opps ! Please take me back
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;

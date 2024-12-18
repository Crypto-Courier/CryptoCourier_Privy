import Link from "next/link";
import { AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useTheme } from "next-themes";

export default function NotFound() {
  const { theme } = useTheme();
  return (
    <div className="main">
      <Navbar />
      <div className="txbg">
        <div className="max-w-6xl w-[90%] mx-auto my-[3rem] ">
          <div
            className={`flex justify-end sm:justify-end md:justify-between  lg:justify-between border-black border-b-0 px-[30px] py-[20px]  
              
          rounded-tl-[40px] rounded-tr-[40px] items-center }`}
          >
            <AlertCircle
              className="mx-auto mb-6 text-red-500"
              size={80}
              strokeWidth={1.5}
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Page Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              Oops! The page you are looking for doesn't exist or has been
              moved.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/" className="bg-blue-500   ease-in-out">
                Go to Home
              </Link>
              <Link
                href="/contact"
                className="bg-gray-200  text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

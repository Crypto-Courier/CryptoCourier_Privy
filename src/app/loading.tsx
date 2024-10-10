import Image from "next/image"
import React from "react"
import gif from "../assets/loading.gif"

export default function Loading() {
    return (
        <div className="flex justify-center items-center h-screen">
        <Image src={gif} alt="Loading..." width={100}/>
      </div>
    );
  }
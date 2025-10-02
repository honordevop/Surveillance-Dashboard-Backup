import Link from "next/link";
import React from "react";
import { FaTwitter, FaEnvelope, FaFacebook, FaLinkedin } from "react-icons/fa";

const Socials = () => {
  return (
    <div className="flex flex-col gap-3 text-[30px] font-space_grotesk">
      <p className="font-bold text-[25px]">Keep in touch</p>
      <ul className="flex gap-4 ">
        <Link href="mailto:info@hilltopglobaloilandgas.com" target="_blank">
          <FaEnvelope />
        </Link>
        <Link
          href="https://www.linkedin.com/company/hilltop-global-oil-and-gas-solution/"
          target="_blank"
        >
          <FaLinkedin />
        </Link>
        <Link href="https://www.facebook.com" target="_blank">
          <FaFacebook />
        </Link>
        <Link href="https://www.twitter.com" target="_blank">
          <FaTwitter />
        </Link>
      </ul>
    </div>
  );
};

export default Socials;

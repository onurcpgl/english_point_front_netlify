"use client";
import EnglishPointLogo from "../../assets/logo/logo.png";
import Link from "next/link";
import Image from "next/image";

export default function FindSessionHeader() {
  return (
    <header className="absolute  w-full z-50 ">
      <nav
        aria-label="Global"
        className="container mx-auto flex items-center justify-between py-8 max-lg:px-4"
      >
        <div className="flex pr-10">
          <Link href="/" className=" p-1.5">
            <span className="sr-only">English Point</span>
            <Image
              width={300}
              height={100}
              alt="Logo"
              src={EnglishPointLogo}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>
      </nav>
    </header>
  );
}

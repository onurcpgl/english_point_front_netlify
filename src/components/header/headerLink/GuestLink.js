"use client";
import React from "react";
import { PopoverGroup } from "@headlessui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
function GuestLink() {
  const pathname = usePathname();
  return (
    <PopoverGroup className="hidden lg:flex lg:gap-x-12">
      <Link
        href="/become-instructors"
        className={`text-lg  text-gray-900 ${
          pathname === "/become-instructors" ? "font-semibold" : ""
        }`}
      >
        Be An Instructor
      </Link>
      <Link
        href="/course-sessions"
        className={`text-lg  text-gray-900 ${
          pathname === "/course-sessions" ? "font-semibold" : ""
        }`}
      >
        {" En yakın kafeyi/noktayı bul!  "}
      </Link>
    </PopoverGroup>
  );
}

export default GuestLink;

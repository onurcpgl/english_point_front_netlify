"use client";
import React from "react";
import { PopoverGroup } from "@headlessui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
function AuthLinks() {
  const pathname = usePathname();
  return (
    <PopoverGroup className="hidden lg:flex lg:gap-x-12">
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

export default AuthLinks;

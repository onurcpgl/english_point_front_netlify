"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PiCaretDownBold } from "react-icons/pi";
import { useQuery } from "@tanstack/react-query";
import generalService from "../../../utils/axios/generalService";
// User için özel componentler:
import UserPersonalInfo from "./userSettingsComp/UserPersonalInfo";
import UserContactInfo from "./userSettingsComp/UserContactInfo";
import UserSecurityInfo from "./userSettingsComp/UserSecurityInfo";
import UserPreferences from "./userSettingsComp/UserPreferences";

function UserSettings() {
  const [openIndex, setOpenIndex] = useState(0);
  const { data, error, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: generalService.getUserInfo,
  });
  const sections = [
    "Kişisel Bilgiler",
    //"İletişim Bilgileri",
    "Güvenlik Ayarları",
    "Tercihler",
  ];

  const toggleMenu = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col w-full max-w-full overflow-hidden bg-[#F5F5F5] p-10 max-lg:p-2 h-auto rounded-3xl relative">
      <div className="w-full bg-white rounded-full p-3 mb-4">
        <p className="text-black font-semibold text-xl ml-2">User Profile</p>
      </div>

      <div className="w-full rounded-3xl bg-[#FAFAFA] py-5 px-3 flex flex-col gap-5">
        {sections.map((section, index) => (
          <div key={index} className="px-3 w-full rounded-2xl">
            <div
              onClick={() => toggleMenu(index)}
              className={`flex justify-between items-center cursor-pointer ${
                openIndex !== index ? "bg-[#D9D9D9]" : "bg-[#FFD207]"
              } px-2 py-4 rounded-4xl transition-colors duration-300`}
            >
              <p className="text-black font-semibold px-3">{section}</p>

              {/* Açıldığında dönen ikon */}
              <PiCaretDownBold
                className={`text-black text-2xl transform transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="rounded-xl shadow-md py-4 px-3 space-y-6">
                    {section === "Kişisel Bilgiler" && (
                      <UserPersonalInfo
                        data={data}
                        error={error}
                        isLoading={isLoading}
                      />
                    )}
                    {section === "İletişim Bilgileri" && (
                      <UserContactInfo
                        data={data}
                        error={error}
                        isLoading={isLoading}
                      />
                    )}
                    {section === "Güvenlik Ayarları" && (
                      <UserSecurityInfo
                        data={data}
                        error={error}
                        isLoading={isLoading}
                      />
                    )}
                    {section === "Tercihler" && (
                      <UserPreferences
                        data={data}
                        error={error}
                        isLoading={isLoading}
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserSettings;

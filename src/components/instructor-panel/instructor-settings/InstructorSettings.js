"use client";
import React, { useState } from "react";
import { PiShareBold } from "react-icons/pi";
import PersonalInfo from "./settingsComp/PersonalInfo";
import ContactInfo from "./settingsComp/ContactInfo";
import EducationInfo from "./settingsComp/EducationInfo";
import CertificateInfo from "./settingsComp/CertificateInfo";
import { motion, AnimatePresence } from "framer-motion";
function InstructorSettings() {
  const [openIndex, setOpenIndex] = useState(0);

  const sections = [
    "Personal Information",
    "Contact Information",
    "Education Information",
    "Certificates",
  ];

  const toggleMenu = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full h-auto bg-[#F5F5F5] rounded-3xl p-3">
      <div className="w-full bg-white rounded-full p-3 mb-4">
        <p className="text-black font-semibold text-xl ml-2">Profile</p>
      </div>

      <div className="w-full rounded-3xl bg-[#FAFAFA] py-5 px-3 flex flex-col gap-5">
        {sections.map((section, index) => (
          <div key={index} className="px-3 w-full rounded-2xl">
            <div
              onClick={() => toggleMenu(index)}
              className={`flex justify-between items-center cursor-pointer ${
                openIndex !== index ? "bg-[#D9D9D9]" : "bg-[#FFD207]"
              }  px-2 py-4 rounded-4xl`}
            >
              <p className="text-black font-semibold px-3">{section}</p>

              <PiShareBold className="text-black text-2xl cursor-pointer" />
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
                  <div className="rounded-xl shadow-md  py-4 px-3 space-y-6">
                    {section === "Personal Information" && <PersonalInfo />}

                    {section === "Contact Information" && <ContactInfo />}

                    {section === "Education Information" && <EducationInfo />}

                    {section === "Certificates" && <CertificateInfo />}
                    {/* {section === "Languages" && <Languages />} */}
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

export default InstructorSettings;

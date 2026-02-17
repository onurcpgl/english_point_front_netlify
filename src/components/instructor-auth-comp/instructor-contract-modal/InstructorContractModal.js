"use client";
import React, { useState, useRef } from "react";
import { X, ShieldCheck, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InstructorContractModal({
  isOpen,
  onClose,
  onConfirm,
}) {
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    const node = scrollRef.current;
    if (node) {
      // Kullanıcı en alt kısma 30px yaklaştıysa okundu kabul et
      const isBottom =
        node.scrollHeight - node.scrollTop <= node.clientHeight + 30;
      if (isBottom) setHasReadToBottom(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b flex justify-between items-center bg-gray-50 text-black">
              <div className="flex items-center gap-2 text-blue-700">
                <ShieldCheck size={24} />
                <h2 className="text-xl font-bold uppercase tracking-tight">
                  Mentor Agreement
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="p-8 overflow-y-auto text-sm text-gray-700 leading-relaxed bg-white custom-scrollbar select-none"
            >
              <h1 className="text-center font-extrabold text-2xl mb-8 text-black">
                MENTOR AGREEMENT AND DATA PROTECTION NOTICE (KVKK)
              </h1>

              <div className="space-y-8">
                <section>
                  <h3 className="font-bold text-black text-lg border-b pb-2 mb-3">
                    1. Parties and Introduction
                  </h3>
                  <p>
                    This agreement is made between English Point Eğitim ve
                    Teknoloji LTD. ŞTİ. (“EnglishPoint” or “the Company”) and
                    the teacher participating in the platform as a mentor (“the
                    Mentor”). By registering on the platform, the Mentor
                    declares that they have read, understood, and accepted this
                    Agreement.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-black text-lg border-b pb-2 mb-3">
                    2. Purpose of the Agreement
                  </h3>
                  <p>
                    This Agreement sets forth the rights and obligations of
                    mentors who conduct individual or group English conversation
                    sessions through the EnglishPoint platform.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-black text-lg border-b pb-2 mb-3">
                    3. Mentor’s Rights and Obligations
                  </h3>
                  <p className="mb-3">
                    The Mentor is responsible for managing their sessions,
                    adhering to scheduled times, and ensuring user satisfaction.
                    Making reservations or accepting payments outside the
                    platform is strictly prohibited.
                  </p>
                  <ul className="list-disc ml-5 space-y-2">
                    <li>
                      The Mentor may cancel a scheduled session up to 12 hours
                      before the session start time.
                    </li>
                    <li>
                      Repeated or unjustified cancellations may result in
                      sanctions or restrictions within the platform.
                    </li>
                  </ul>

                  <div className="mt-6 p-5 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-2 text-red-700">
                      <AlertCircle size={20} />
                      <h4 className="font-bold text-base">
                        3.a. Prohibition of Off-Platform Activities and
                        Sanctions
                      </h4>
                    </div>
                    <p className="text-red-900 font-medium mb-3">
                      The Mentor shall not engage with, contact, or provide
                      lessons to any student introduced through the platform
                      outside of EnglishPoint, whether online or in person, nor
                      accept any payment outside the platform.
                    </p>
                    <p className="text-red-800 text-xs italic">
                      If such conduct is detected, the Mentor’s contract shall
                      be immediately terminated, and EnglishPoint reserves the
                      right to impose monetary penalties and seek legal
                      compensation.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="font-bold text-black text-lg border-b pb-2 mb-3">
                    4. Payment
                  </h3>
                  <p>
                    The Mentor’s earnings are calculated dynamically based on
                    the number of students participating in the session.
                    Payments are transferred to the Mentor’s account by the
                    platform after the completion of the session.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-black text-lg border-b pb-2 mb-3">
                    5. Intellectual Property
                  </h3>
                  <p>
                    Any content or materials uploaded by the Mentor may be used
                    by EnglishPoint for educational purposes. The Mentor
                    declares that they own the copyrights or have obtained
                    necessary permissions for all uploaded materials.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-black text-lg border-b pb-2 mb-3">
                    6. Termination of Agreement
                  </h3>
                  <p>
                    The Company may unilaterally terminate this Agreement if the
                    Mentor violates any platform rules. The Mentor may terminate
                    this Agreement by providing written notice; however,
                    scheduled sessions must be preserved.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-black text-lg border-b pb-2 mb-3">
                    8. Governing Law and Jurisdiction
                  </h3>
                  <p>
                    This Agreement is governed by the laws of the Republic of
                    Turkey. The Istanbul Central (Çağlayan) Courts and Execution
                    Offices shall have exclusive jurisdiction.
                  </p>
                </section>

                <div className="pt-10 border-t border-gray-100 flex flex-col items-center">
                  <p className="font-bold text-black text-base uppercase">
                    English Point Eğitim ve Teknoloji LTD. ŞTİ.
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Document ID: EP-MENTOR-2026
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50 flex flex-col gap-3">
              {!hasReadToBottom && (
                <p className="text-xs text-center text-blue-600 font-bold animate-pulse uppercase tracking-wider">
                  PLEASE SCROLL TO THE BOTTOM TO ACTIVATE THE AGREEMENT
                </p>
              )}
              <button
                onClick={() => {
                  onConfirm();
                  setHasReadToBottom(false);
                }}
                disabled={!hasReadToBottom}
                className={`w-full py-5 px-6 font-bold rounded-xl transition-all duration-300 shadow-lg ${
                  hasReadToBottom
                    ? "bg-black text-white hover:bg-gray-800 active:scale-[0.98]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {hasReadToBottom
                  ? "I HAVE READ AND AGREE TO THE MENTOR TERMS"
                  : "SCROLL DOWN TO AGREE"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

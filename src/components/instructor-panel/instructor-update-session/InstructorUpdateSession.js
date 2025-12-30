"use client";
import { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiRefreshCw, FiX } from "react-icons/fi";
import instructorPanelService from "../../../utils/axios/instructorPanelService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DatePickerComp from "../../../components/ui/DatePicker/DatePickerComp";
import CafeLocationComp from "../instructor-create-session/CafeLocationComp";
import SuccesMessageComp from "../../ui/SuccesModal/SuccesMessageComp";
import ErrorModal from "../../ui/ErrorModal/ErrorModal";

export default function InstructorUpdateSessionModal({
  isOpen,
  onClose,
  sessionData,
  refetch,
}) {
  const queryClient = useQueryClient();
  const currentLang = "en";
  // --- STATE YÖNETİMİ ---
  const [isFormReady, setIsFormReady] = useState(false); // 🔥 Form verisi hazır mı?
  const [successModal, setSuccessModal] = useState({
    open: false,
    message: "",
  });
  const [errorModal, setErrorModal] = useState({ open: false, message: "" });
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  // 1. API Verileri (Kategoriler)
  const { data: categoriesResponse, isLoading: loadingCategories } = useQuery({
    queryKey: ["program-categories", currentLang],
    queryFn: () => instructorPanelService.getProgramCategories(currentLang),
    enabled: isOpen,
  });

  const categories = categoriesResponse?.data || [];

  // 2. Aktif Programları Hesapla
  const activePrograms = useMemo(() => {
    if (!selectedCategoryId) return [];
    const category = categories.find(
      (cat) => cat.id === Number(selectedCategoryId)
    );
    return category ? category.programs : [];
  }, [selectedCategoryId, categories]);

  // 3. Formik Tanımı
  const formik = useFormik({
    initialValues: {
      course_session_id: sessionData?.id || "",
      program_id: "",
      session_date: null, // 🔥 Başlangıçta null olsun
      language_level: "",
    },
    validationSchema: Yup.object({
      program_id: Yup.string().required("Program selection is required"),
      session_date: Yup.date().nullable().required("Date is required"),
      language_level: Yup.string().required("Level is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      if (!selectedCafe) {
        setErrorModal({
          open: true,
          message: "Please select a cafe location.",
        });
        setSubmitting(false);
        return;
      }

      const payload = {
        ...values,
        google_cafe: selectedCafe,
      };

      try {
        const result = await instructorPanelService.updateCourseSession(
          payload
        );
        if (result?.status) {
          setSuccessModal({
            open: true,
            message: "Session updated successfully!",
          });
          queryClient.invalidateQueries(["myCourses"]);
          if (refetch) refetch();
        } else {
          setErrorModal({
            open: true,
            message: result.message || "Update failed.",
          });
        }
      } catch (err) {
        setErrorModal({ open: true, message: "A server error occurred." });
      } finally {
        setSubmitting(false);
      }
    },
  });

  // 4. Verileri Doldurma ve Loading Kontrolü
  useEffect(() => {
    // Modal açıldığında önce loading'e çekelim
    if (isOpen) {
      setIsFormReady(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (sessionData && isOpen && categories.length > 0) {
      // A) Cafe Set Et
      setSelectedCafe(sessionData.google_cafe);

      // B) Kategori Bul ve Set Et
      const targetProgramId = sessionData.program_id || sessionData.program?.id;
      const foundCategory = categories.find((cat) =>
        cat.programs?.some((p) => p.id === Number(targetProgramId))
      );

      if (foundCategory) {
        setSelectedCategoryId(foundCategory.id);
      }

      // C) Formik Inputlarını Doldur
      // Tarih parse işlemi (Safari/Firefox uyumluluğu için " " -> "T" değişimi yapılabilir)
      let parsedDate = null;
      if (sessionData.session_date) {
        // SQL Date formatı bazen "YYYY-MM-DD HH:mm:ss" gelir, JS bunu bazen sevmez.
        // Güvenli hale getirmek için:
        const safeDateString = sessionData.session_date.replace(" ", "T");
        parsedDate = new Date(safeDateString);
      }

      formik.setValues({
        course_session_id: sessionData.id || "",
        program_id: targetProgramId?.toString() || "",
        session_date: parsedDate,
        language_level: sessionData.language_level || "",
      });

      // 🔥 Veriler set edildi, artık formu gösterebiliriz
      // Kısa bir timeout ekliyoruz ki UI render nefes alsın
      setTimeout(() => {
        setIsFormReady(true);
      }, 100);
    }
  }, [sessionData, isOpen, categories]);

  // 5. Seçili Program Detayı
  const selectedProgram = useMemo(() => {
    return activePrograms?.find(
      (p) => p.id.toString() === formik.values.program_id?.toString()
    );
  }, [activePrograms, formik.values.program_id]);

  const getLocalizedText = (data) => {
    if (!data) return "";
    return typeof data === "object"
      ? data[currentLang] || data["en"] || ""
      : data;
  };

  if (!isOpen) return null;

  // 🔥 LOADING DURUMU: Kategoriler yükleniyorsa VEYA Form verileri henüz hazır değilse
  const isLoading = loadingCategories || !isFormReady;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-[#F5F5F5] w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 min-h-[400px]">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b p-4 flex justify-between items-center rounded-t-3xl">
          <h2 className="text-xl font-bold text-black flex items-center gap-2">
            <div className="w-2 h-8 bg-[#FFD207]" />
            Edit Session
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={24} className="text-gray-500" />
          </button>
        </div>

        {/* 🔥 İÇERİK: LOADING vs FORM */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[400px] gap-4">
            <FiRefreshCw className="animate-spin" />
            <p className="text-gray-500 font-medium animate-pulse">
              Loading session details...
            </p>
          </div>
        ) : (
          <form
            onSubmit={formik.handleSubmit}
            className="p-6 space-y-8 animate-in fade-in duration-500"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
              {/* Kategori */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Session Subject
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => {
                    setSelectedCategoryId(e.target.value);
                    formik.setFieldValue("program_id", "");
                  }}
                  className="w-full h-14 outline-none px-4 bg-white text-black border border-gray-300  cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {getLocalizedText(cat.name)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Program */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Program
                </label>
                <select
                  {...formik.getFieldProps("program_id")}
                  disabled={!selectedCategoryId}
                  className="w-full h-14 outline-none px-4 bg-white text-black border border-gray-300  disabled:bg-gray-100 cursor-pointer"
                >
                  <option value="">Select Program</option>
                  {activePrograms.map((p) => (
                    <option key={p.id} value={p.id}>
                      {getLocalizedText(p.title)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Program Detay Kartı */}
            <div className="px-4">
              {selectedProgram && (
                <div className="bg-white border rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <h4 className="font-bold text-gray-900">
                      {getLocalizedText(selectedProgram.title)}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {getLocalizedText(selectedProgram.description)}
                  </p>
                </div>
              )}
            </div>

            {/* Tarih ve Seviye */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
              {/* DATE PICKER */}
              <div className="space-y-2">
                <DatePickerComp formik={formik} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Language Level
                </label>
                <select
                  {...formik.getFieldProps("language_level")}
                  className="w-full h-14 outline-none px-4 bg-white text-black border border-gray-300  cursor-pointer"
                >
                  <option value="">Select Level</option>
                  <option value="A2">A2</option>
                </select>
              </div>
            </div>

            <CafeLocationComp
              onSelectCafe={setSelectedCafe}
              initialValue={selectedCafe}
            />

            {/* Footer Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 font-semibold text-gray-600 border border-gray-300 hover:bg-gray-100 hover:text-black transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={formik.isSubmitting || !formik.isValid}
                className={`px-10 py-3 font-bold flex items-center gap-2 transition-all shadow-sm
                  ${
                    formik.isSubmitting || !formik.isValid
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-100"
                      : "bg-black text-white hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer border border-black"
                  }`}
              >
                {formik.isSubmitting && (
                  <FiRefreshCw className="animate-spin" />
                )}
                Update Session
              </button>
            </div>
          </form>
        )}

        <SuccesMessageComp
          open={successModal.open}
          message={successModal.message}
          onClose={() => {
            setSuccessModal({ open: false });
            onClose();
          }}
          lang="en"
        />
        <ErrorModal
          open={errorModal.open}
          message={errorModal.message}
          onClose={() => setErrorModal({ open: false })}
          lang="en"
        />
      </div>
    </div>
  );
}

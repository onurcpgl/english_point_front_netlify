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
  const [isFormReady, setIsFormReady] = useState(false);
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
  const formik = useFormik({
    initialValues: {
      course_session_id: sessionData?.id || "",
      program_id: "",
      sub_category_id: "", // Yeni alan
      session_date: null,
      language_level: "",
    },
    validationSchema: Yup.object({
      program_id: Yup.string().required("Program selection is required"),
      session_date: Yup.date().nullable().required("Date is required"),
      language_level: Yup.string().required("Level is required"),
      sub_category_id: Yup.string().test(
        "is-required-for-business",
        "Please select a field",
        function (value) {
          if (Number(selectedCategoryId) === 2) {
            return !!value;
          }
          return true;
        },
      ),
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
        // Kategori 2 değilse sub_category_id'yi null gönder
        sub_category_id:
          Number(selectedCategoryId) === 2 ? values.sub_category_id : null,
      };

      try {
        const result =
          await instructorPanelService.updateCourseSession(payload);
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
  // 1.1 Business alt konularını (Sub-Topics) hesapla
  const subTopics = useMemo(() => {
    const businessCategory = categories.find(
      (cat) => cat.slug === "business" || cat.id === 2,
    );
    return businessCategory?.sub_categories || [];
  }, [categories]);

  // 2. Aktif Programları Hesapla (Create tarafındaki filtreleme mantığıyla aynı)
  const activePrograms = useMemo(() => {
    if (!selectedCategoryId) return [];

    const selectedCategory = categories.find(
      (cat) => cat.id === Number(selectedCategoryId),
    );
    if (!selectedCategory) return [];

    let filteredPrograms = selectedCategory.programs || [];

    // BUSINESS (ID: 2) seçiliyse alt kategoriye göre filtrele
    if (Number(selectedCategoryId) === 2) {
      const selectedSubId = Number(formik.values.sub_category_id);
      if (selectedSubId) {
        const selectedSubTopic = subTopics.find(
          (sub) => sub.id === selectedSubId,
        );
        const targetSlug = selectedSubTopic?.slug;

        if (targetSlug) {
          filteredPrograms = filteredPrograms.filter(
            (prog) => prog.business_slug === targetSlug,
          );
        }
      }
    }
    return filteredPrograms;
  }, [
    selectedCategoryId,
    categories,
    formik.values.sub_category_id,
    subTopics,
  ]);

  // 3. Formik Tanımı

  // 4. Verileri Doldurma ve Update Öncesi Hazırlık
  useEffect(() => {
    if (isOpen) setIsFormReady(false);
  }, [isOpen]);

  useEffect(() => {
    if (sessionData && isOpen && categories.length > 0) {
      setSelectedCafe(sessionData.google_cafe);

      // Kategori Bulma
      const targetProgramId = sessionData.program_id || sessionData.program?.id;
      const foundCategory = categories.find((cat) =>
        cat.programs?.some((p) => p.id === Number(targetProgramId)),
      );

      if (foundCategory) {
        setSelectedCategoryId(foundCategory.id);
      }

      // Business ise doğru sub_category_id'yi bul (slug eşleşmesi ile)
      let foundSubId = "";
      if (
        sessionData.program.business_slug &&
        Number(foundCategory?.id) === 2
      ) {
        const sub = subTopics.find(
          (s) => s.slug === sessionData.program.business_slug,
        );
        if (sub) foundSubId = sub.id.toString();
      }

      // Tarih parse
      let parsedDate = null;
      if (sessionData.session_date) {
        const safeDateString = sessionData.session_date.replace(" ", "T");
        parsedDate = new Date(safeDateString);
      }

      formik.setValues({
        course_session_id: sessionData.id || "",
        program_id: targetProgramId?.toString() || "",
        sub_category_id: foundSubId,
        session_date: parsedDate,
        language_level: sessionData.language_level || "",
      });

      setTimeout(() => setIsFormReady(true), 150);
    }
  }, [sessionData, isOpen, categories, subTopics]);

  // Seçili Program Detayı
  const selectedProgram = useMemo(() => {
    return activePrograms?.find(
      (p) => p.id.toString() === formik.values.program_id?.toString(),
    );
  }, [activePrograms, formik.values.program_id]);

  const getLocalizedText = (data) => {
    if (!data) return "";
    return typeof data === "object"
      ? data[currentLang] || data["en"] || ""
      : data;
  };

  if (!isOpen) return null;
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

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[400px] gap-4">
            <FiRefreshCw className="animate-spin text-[#FFD207]" size={32} />
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
              {/* Kategori Seçimi */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Session Subject
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => {
                    setSelectedCategoryId(e.target.value);
                    formik.setFieldValue("program_id", "");
                    formik.setFieldValue("sub_category_id", "");
                  }}
                  className="w-full h-14 outline-none px-4 bg-white text-black border border-gray-300 cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {getLocalizedText(cat.name)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Business Alanı Seçimi (Sadece ID: 2 ise) */}
              {Number(selectedCategoryId) === 2 && (
                <div className="space-y-2 animate-in slide-in-from-left-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Session Field
                  </label>
                  <select
                    {...formik.getFieldProps("sub_category_id")}
                    className={`w-full h-14 outline-none px-4 bg-white text-black border cursor-pointer ${
                      formik.touched.sub_category_id &&
                      formik.errors.sub_category_id
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a field</option>
                    {subTopics.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.title}
                      </option>
                    ))}
                  </select>
                  {formik.touched.sub_category_id &&
                    formik.errors.sub_category_id && (
                      <p className="text-red-500 text-xs mt-1">
                        {formik.errors.sub_category_id}
                      </p>
                    )}
                </div>
              )}

              {/* Program Seçimi */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Program
                </label>
                <select
                  {...formik.getFieldProps("program_id")}
                  disabled={!selectedCategoryId || activePrograms.length === 0}
                  className="w-full h-14 outline-none px-4 bg-white text-black border border-gray-300 disabled:bg-gray-100 cursor-pointer"
                >
                  <option value="">
                    {!selectedCategoryId
                      ? "First select a subject"
                      : activePrograms.length === 0
                        ? "No programs found"
                        : "Select Program"}
                  </option>
                  {activePrograms.map((p) => (
                    <option key={p.id} value={p.id}>
                      {getLocalizedText(p.title)}
                    </option>
                  ))}
                </select>
                {formik.touched.program_id && formik.errors.program_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.program_id}
                  </p>
                )}
              </div>
            </div>

            {/* Program Detay Kartı */}
            <div className="px-4">
              {selectedProgram && (
                <div className="bg-white border rounded-2xl p-4 shadow-sm animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <h4 className="font-bold text-gray-900">
                      {getLocalizedText(selectedProgram.title)}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    {getLocalizedText(selectedProgram.description)}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
              <div className="space-y-2">
                <DatePickerComp formik={formik} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Language Level
                </label>
                <select
                  {...formik.getFieldProps("language_level")}
                  className="w-full h-14 outline-none px-4 bg-white text-black border border-gray-300 cursor-pointer"
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

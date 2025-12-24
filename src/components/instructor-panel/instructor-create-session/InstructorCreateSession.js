"use client";
import { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiRefreshCw } from "react-icons/fi";
import instructorPanelService from "../../../utils/axios/instructorPanelService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import DatePickerComp from "../../../components/ui/DatePicker/DatePickerComp";
import CafeLocationComp from "../instructor-create-session/CafeLocationComp";
export default function InstructorCreateSession() {
  const queryClient = useQueryClient();
  const currentLang = "en";
  const {
    data: categoriesResponse, // Değişken adını categoriesResponse yaptık
    error: errorCategories,
    isLoading: loadingCategories,
  } = useQuery({
    queryKey: ["program-categories", currentLang],
    queryFn: () => instructorPanelService.getProgramCategories(currentLang), // Yeni fonksiyonun
  });

  const categories = categoriesResponse?.data || [];

  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  // 2. Seçilen kategoriye göre programları filtrele (Hesaplanan Değer)
  const activePrograms = useMemo(() => {
    if (!selectedCategoryId) return [];

    // Kategoriler içinden seçilen ID'yi bul
    const selectedCategory = categories.find(
      (cat) => cat.id === Number(selectedCategoryId)
    );

    // O kategorinin içindeki 'programs' arrayini döndür
    return selectedCategory ? selectedCategory.programs : [];
  }, [selectedCategoryId, categories]);

  // 3. Formik resetleme (İsteğe bağlı ama önerilir)
  // Kategori değişirse, seçili program boşa düşmeli çünkü o program yeni kategoride yok.
  useEffect(() => {
    formik.setFieldValue("program_id", "");
  }, [selectedCategoryId]);
  const {
    data: programs,
    error: errorPrograms,
    isLoading: loadingPrograms,
  } = useQuery({
    // DİKKAT 1: Key içine dili ekle ki dil değişince refetch yapsın
    queryKey: ["programs", currentLang],

    // DİKKAT 2: Fonksiyonu çağırırken dili gönder
    queryFn: () => instructorPanelService.getPrograms(currentLang),
  });
  // const {
  //   data: startQuestions,
  //   error: errorStartQuestions,
  //   isLoading: loadingStartQuestions,
  // } = useQuery({
  //   queryKey: ["startQuestions"],
  //   queryFn: generalService.fetchQuestions,
  // });
  const router = useRouter();
  const [message, setMessage] = useState({ type: "", text: "" });
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [selectCafe, onSelectCafe] = useState();

  const [initialValues, setInitialValues] = useState({
    //session_title: "",
    //description: "",
    session_date: "",
    //duration_minutes: "",
    language_level: "",
    //quota: "",
    cafe_id: null,
    google_cafe: "",
    start_answers: {},
  });

  const languageLevels = [
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
  ];

  // useEffect(() => {
  //   if (startQuestions && startQuestions.length > 0) {
  //     const init = {
  //       program_id: "",
  //       //session_title: "",
  //       //description: "",
  //       session_date: "",
  //       //duration_minutes: "",
  //       language_level: "",
  //       //quota: "",
  //       cafe_id: "",
  //       start_answers: startQuestions.reduce((acc, q) => {
  //         acc[q.id] = q.question_type === "multiple" ? [] : "";
  //         return acc;
  //       }, {}),
  //     };

  //     setInitialValues(init);
  //   }
  // }, [startQuestions]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnMount: true,
    validationSchema: Yup.object({
      program_id: Yup.string().required("Please select a program"),
      //session_title: Yup.string().required("Title is required"),
      //description: Yup.string().required("Description is required"),
      session_date: Yup.string().required("Date is required"),
      language_level: Yup.string().required("Language level is required"),
      // start_answers: Yup.object(
      //   startQuestions?.reduce((acc, q) => {
      //     if (q.question_type === "single") {
      //       acc[q.id] = Yup.string().required("Please answer this question");
      //     } else if (q.question_type === "multiple") {
      //       acc[q.id] = Yup.array()
      //         .min(1, "Please select at least one option")
      //         .required("Please answer this question");
      //     }
      //     return acc;
      //   }, {})
      // ),
    }),

    onSubmit: async (values, { resetForm, setSubmitting }) => {
      // selectedCafe state'in varsa bunu values içine ekle
      if (!selectedCafe) {
        setMessage({ type: "error", text: "Please select a cafe." });
        setSubmitting(false); // Yükleniyor durumunu kapat
        return; // İşlemi durdur
      }
      const payload = {
        ...values,
        google_cafe: selectedCafe,
      };

      const result = await instructorPanelService.saveCourseSession(payload);

      // Başarılı mesaj
      //
      if (result?.status) {
        queryClient.invalidateQueries(["myCourses"]);
        setMessage({
          type: "success",
          text: "Session completed successfully!",
        });
        resetForm();
        setSelectedCafe("");
        resetForm();
        setSubmitting(false);
      } else {
        setMessage({
          type: "error",
          text: result.message || "Session could not be created.",
        });
        setSubmitting(false);
      }
      // Formu sıfırla
      //resetForm();
      //setSelectedCafe("");
    },
  });
  const selectedProgram = useMemo(() => {
    return programs?.data?.find(
      (p) => p.id.toString() === formik.values.program_id?.toString()
    );
  }, [programs, formik.values.program_id]);

  // Bu fonksiyonu component'in içine ekle (return'den önce)
  // Amacı: Formik error objesinden ilk hata mesajını yakalamak
  const getFirstErrorMessage = () => {
    const errors = formik.errors;
    if (!errors || Object.keys(errors).length === 0) return null;

    const firstKey = Object.keys(errors)[0];
    const firstError = errors[firstKey];

    // Eğer hata bir string ise döndür, obje ise (örn: start_answers) genel mesaj döndür
    return typeof firstError === "string"
      ? firstError
      : "Please fill in the missing options";
  };

  // Butonun aktif olup olmadığını kontrol eden değişken
  // Form geçerli değilse VEYA cafe seçilmemişse buton pasif olsun
  const isButtonDisabled = !formik.isValid || !selectedCafe;
  if (!initialValues) return null;
  return (
    <div className="w-full h-auto bg-[#F5F5F5] rounded-3xl p-5">
      <div className="w-full bg-white rounded-full p-3 mb-4">
        <p className="text-black font-semibold text-xl ml-2">Create session</p>
      </div>
      <form onSubmit={formik.handleSubmit} className="space-y-6 p-3">
        <div className="w-full space-y-6 px-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                Session Subject
              </label>
              <div className="relative">
                <select
                  name="category_id"
                  // Formik kullanmıyoruz burada, çünkü bu sadece bir filtre aracı
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  disabled={loadingCategories}
                  className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#8e8e8e] bg-white font-light text-black border border-gray-300"
                >
                  <option value="">
                    {loadingCategories ? "Loading..." : "Select a Category"}
                  </option>
                  {!loadingCategories &&
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            {/* --- 2. PROGRAM SEÇİMİ (ESKİ KODUN REVİZE HALİ) --- */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                Session Program
              </label>
              <div className="relative">
                <select
                  name="program_id"
                  {...formik.getFieldProps("program_id")}
                  // Eğer kategori seçilmediyse program seçimi pasif olsun
                  disabled={!selectedCategoryId || activePrograms.length === 0}
                  className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#8e8e8e] bg-white font-light text-black border border-gray-300  disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">
                    {/* Duruma göre mesaj gösterelim */}
                    {!selectedCategoryId
                      ? "First select a session subject"
                      : activePrograms.length === 0
                      ? "No programs in this category"
                      : "Select a program"}
                  </option>

                  {/* activePrograms listesini dönüyoruz */}
                  {activePrograms.map((program) => (
                    <option key={program.id} value={program.id}>
                      {/* API'den gelen title obje ise dile göre yazdır, string ise direkt yazdır */}
                      {typeof program.title === "object"
                        ? program.title[currentLang] || program.title["en"]
                        : program.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hata Mesajı */}
              {formik.touched.program_id && formik.errors.program_id && (
                <div className="text-red-500 text-sm mt-1 font-medium">
                  {formik.errors.program_id}
                </div>
              )}
            </div>
          </div>
          {/* --- 2. DETAY KARTI (Tam Genişlik ve Inputun Altında) --- */}
          {selectedProgram && (
            <div className="w-full animate-in fade-in slide-in-from-top-4 duration-500">
              {/* Kartın Kendisi */}
              <div className="bg-slate-50 border border-slate-200  overflow-hidden shadow-sm">
                {/* Kart Başlığı */}
                <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    <span className="w-2 h-2  bg-green-500"></span>
                    {selectedProgram.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-3 py-1  text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    Hour: 1
                  </span>
                </div>

                {/* Kart İçeriği */}
                <div className="p-6 space-y-6">
                  {/* EĞİTİM İÇERİĞİ (Description) */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                      Training Content & Program
                    </h4>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 text-gray-700 text-sm leading-relaxed shadow-sm">
                      {selectedProgram.description}
                    </div>
                  </div>

                  {/* MATERYALLER (Grid Yapısı) */}
                  {(selectedProgram.media?.video ||
                    selectedProgram.media?.voice ||
                    selectedProgram.media?.document) && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                        Educational Materials
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Video */}
                        {selectedProgram.media?.video && (
                          <a
                            href={selectedProgram.media.video}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center justify-center gap-3 p-4 bg-white border border-red-100 rounded-lg hover:border-red-300 hover:shadow-md transition-all cursor-pointer"
                          >
                            <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
                              <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">
                              Watch Video
                            </span>
                          </a>
                        )}

                        {/* Ses */}
                        {selectedProgram.media?.voice && (
                          <a
                            href={selectedProgram.media.voice}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center justify-center gap-3 p-4 bg-white border border-purple-100 rounded-lg hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
                          >
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                ></path>
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600">
                              Voice Recording
                            </span>
                          </a>
                        )}

                        {/* Doküman */}
                        {selectedProgram.media?.document && (
                          <a
                            href={selectedProgram.media.document}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center justify-center gap-3 p-4 bg-white border border-blue-100 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                          >
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                ></path>
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                              Document (PDF)
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          <DatePickerComp formik={formik} />

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              Language Level
            </label>
            <select
              name="language_level"
              {...formik.getFieldProps("language_level")}
              className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#8e8e8e] bg-white font-light text-black"
            >
              <option value="">Select level</option>
              {languageLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            {formik.touched.language_level && formik.errors.language_level && (
              <div className="text-red-500 text-sm">
                {formik.errors.language_level}
              </div>
            )}
          </div>
        </div>
        {/* <div className="w-full space-y-6 px-4">
          <div className="relative w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cafe Location
            </label>

          
            <div
              onClick={() => setOpen(!open)}
              className="relative cursor-pointer"
            >
              <input
                type="text"
                value={selectedCafe ? selectedCafe.name : ""}
                readOnly
                required
                placeholder="Select a cafe..."
                className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#8e8e8e] bg-white font-light text-black"
              />
   
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>

    
            {open && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200  shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                  {cafes?.map((cafe) => (
                    <div
                      key={cafe.id}
                      className={`min-w-[220px] max-w-[220px] flex-shrink-0 border  cursor-pointer transition-all duration-200 p-3 group ${
                        selectedCafe?.id === cafe.id
                          ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                          : "border-gray-200 hover:border-blue-300 hover:shadow-md bg-white"
                      }`}
                      onClick={() => {
                        setSelectedCafe(cafe);
                        setOpen(false);
                      }}
                    >
           
                      <div className="relative h-28 w-full mb-3 overflow-hidden rounded-lg">
                        {cafe.image ? (
                          <Image
                            src={cafe.image}
                            alt={cafe.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                            <svg
                              className="w-8 h-8"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              ></path>
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="font-semibold text-gray-900 text-sm truncate">
                        {cafe.name}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-2 mt-1">
                        {cafe.address}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

         
          {selectedCafe && (
            <div className="w-full animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-slate-50 border border-slate-200  overflow-hidden shadow-sm flex flex-col md:flex-row">

                <div className="w-full md:w-1/3 h-48 md:h-auto relative bg-gray-200">
                  {selectedCafe.image ? (
                    <Image
                      src={selectedCafe.image}
                      alt={selectedCafe.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                  )}
                </div>

   
                <div className="flex-1 p-6 flex flex-col justify-center space-y-4">
   
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedCafe.name}
                    </h3>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                      Selected
                    </span>
                  </div>


                  <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-200">
                    <div className="mt-0.5 text-blue-500">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                        Location / Address
                      </h4>
                      <p className="text-sm text-gray-700 leading-snug">
                        {selectedCafe.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div> 
        */}
        <CafeLocationComp onSelectCafe={setSelectedCafe} />

        {/* <div className="px-4 border-t text-black py-2 border-gray-200">
          <p className="text-xl font-semibold">Starting Questions Answers</p>
          <p className="text-sm font-medium text-gray-700">
            As an instructor, answer the key questions related to the course.
            These answers will help users filter courses and find the most
            suitable one.
          </p>
        </div>

        {loadingStartQuestions ? (
          <div role="status" className="w-full animate-pulse px-5">
            <div className="h-2.5 bg-gray-400 rounded-full w-full pr-10 mb-4"></div>
            <div className="h-2 bg-gray-400 rounded-full  w-[300px] mb-2.5"></div>
            <div className="h-2 bg-gray-400 rounded-full  w-[300px] mb-2.5"></div>
            <div className="h-2 bg-gray-400 rounded-full  w-[300px] mb-2.5"></div>
            <div className="h-2 bg-gray-400 rounded-full  w-[300px] mb-2.5"></div>
            <div className="h-2 bg-gray-400 rounded-full  w-[300px]"></div>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <div className="px-4 mt-6">
            {startQuestions?.map((q) => {
              const opts = q.options["en"];

              const error = formik.errors.start_answers?.[q.id];
              const touched = formik.touched.start_answers?.[q.id];

              return (
                <div key={q.id} className="mb-6 border-b pb-4">
                  <p className="text-md font-semibold text-black mb-2">
                    {q.question["en"]}
                  </p>

        
                  {q.question_type === "single" && (
                    <div className="space-y-2">
                      <select
                        name={`start_answers.${q.id}`}
                        value={formik.values.start_answers[q.id] || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#8e8e8e] bg-white font-light text-black border border-gray-300"
                      >
                        <option value="">Seçiniz</option>
                        {opts.map((opt, index) => (
                          <option key={index} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>

                      {touched && error && (
                        <div className="text-red-500 text-sm mt-1">{error}</div>
                      )}
                    </div>
                  )}

 
                  {q.question_type === "multiple" && (
                    <div className="flex flex-wrap justify-center items-center gap-3 p-4 ">
                      {opts.map((opt, index) => {
                        const selected =
                          formik.values.start_answers[q.id] ?? [];
                        const isSelected = selected.includes(opt);

                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              let newSelected;
                              // 1. Yeni değeri hesapla
                              if (isSelected) {
                                newSelected = selected.filter((v) => v !== opt);
                              } else {
                                newSelected = [...selected, opt];
                              }

                              // 2. Değeri güncelle
                              formik.setFieldValue(
                                `start_answers.${q.id}`,
                                newSelected
                              );

                              // 3. (ÖNEMLİ) Alanı "touched" yap
                              // Bunu eklemezsen hata mesajı anlık olarak görünmez/kaybolmaz.
                              formik.setFieldTouched(
                                `start_answers.${q.id}`,
                                true
                              );
                            }}
                            className={`group text-sm relative px-5 py-3 rounded-[30px] cursor-pointer transition-all duration-200 shadow-lg border outline-none
            ${
              isSelected
                ? "bg-[#ffd207] text-black border-transparent shadow-sm"
                : "bg-white text-gray-700 border-gray-200 hover:bg-black hover:text-white"
            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}

          

                      {touched && error && (
                        <div className="w-full text-center text-red-500 text-sm mt-1">
                          {error}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
         */}
        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            onClick={() => router.back()}
            type="button"
            className="mr-4 px-6 py-3 text-gray-700 hover:bg-black bg-white hover:text-white transition-colors font-medium border border-gray-300"
          >
            Cancel
          </button>

          {/* Tooltip için Kapsayıcı Div (Relative ve Group önemli) */}
          <div className="relative group flex items-center">
            <button
              type="submit"
              // Hem senin özel kontrolün, hem formun hatalı olması, hem de loading durumu kilitler
              disabled={
                isButtonDisabled || !formik.isValid || formik.isSubmitting
              }
              className={`w-md py-4 px-6 font-semibold max-lg:w-fit flex justify-center items-center gap-3 transition-all duration-200
    ${
      isButtonDisabled || !formik.isValid || formik.isSubmitting
        ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300" // Pasif Görünüm
        : "bg-black text-white hover:bg-white hover:text-black border border-black cursor-pointer" // Aktif Görünüm
    }
  `}
            >
              {formik.isSubmitting ? (
                <>
                  <FiRefreshCw className="animate-spin" size={20} />
                  <span>Creating...</span>
                </>
              ) : (
                "Create Session"
              )}
            </button>

            {/* Hata Mesajı Tooltip'i (Sadece buton disabled ise ve hover olunca görünür) */}
            {isButtonDisabled && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-2 bg-red-600 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                {/* Ok işareti (Küçük üçgen) */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-red-600"></div>

                {/* Hata Mesajı */}
                <span className="font-medium">
                  {!selectedCafe
                    ? "Please choose a cafe"
                    : getFirstErrorMessage() || "Zorunlu alanları doldurun"}
                </span>
              </div>
            )}
          </div>
        </div>
      </form>
      {message.text && (
        <div className="fixed inset-0 bg-[#00000036] flex items-center justify-center z-50 p-4">
          <div
            className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100 border-2 ${
              message.type === "success" ? "border-[#FFD207]" : "border-red-500"
            }`}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
              onClick={() => setMessage({ text: "", type: "" })}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Icon */}
            <div className="flex items-start space-x-4">
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  message.type === "success" ? "bg-[#FFD207]" : "bg-red-500"
                }`}
              >
                {message.type === "success" ? (
                  <svg
                    className="w-6 h-6 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>

              {/* Message content */}
              <div className="flex-1 pt-1">
                <h3 className="text-xl font-bold text-black">
                  {message.type === "success" ? "Success!" : "Error!"}
                </h3>
                <p className="text-gray-700 mt-2 leading-relaxed">
                  {message.text}
                </p>
              </div>
            </div>

            {/* Action button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setMessage({ text: "", type: "" }); // mesajı temizle
                  if (message.type === "success") {
                    router.push("/instructor/my-sessions");
                  }
                }}
                className={`px-6 py-2 font-semibold transition-all cursor-pointer duration-200 ${
                  message.type === "success"
                    ? "bg-black text-[#FFD207] hover:bg-gray-800"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

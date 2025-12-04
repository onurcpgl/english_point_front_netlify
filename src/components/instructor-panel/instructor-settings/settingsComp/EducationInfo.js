import { Formik, Form, Field } from "formik";
import { useState } from "react";
import { Trash2, ChevronDown, ChevronUp, X } from "lucide-react";
import instructorPanelService from "../../../../utils/axios/instructorPanelService";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import AlertMessage from "../../another-comp/AlertMessage";
function EducationInfo() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [alert, setAlert] = useState({
    visible: false,
    type: "",
    message: "",
  });
  // 📡 Veriyi çekiyoruz
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["educations"],
    queryFn: async () => {
      const res = await instructorPanelService.getEducationInfo();
      return res.user?.educations || [];
    },
  });

  const educations = data || [];

  const handleSubmit = async (values, index) => {
    try {
      // 🧾 FormData oluştur
      const formData = new FormData();
      formData.append("university", values.university || "");
      formData.append("degree", values.degree || "");
      formData.append("degree_type", values.degree_type || "");
      formData.append("specialization", values.specialization || "");
      formData.append("years_of_study", values.years_of_study || "");

      // 🎓 Eğer diploma dosyası varsa ekle
      if (values.diploma_file instanceof File) {
        formData.append("diploma_file", values.diploma_file);
      }

      // 🔄 Güncelleme mi yeni kayıt mı?
      if (educations[index]?.id) {
        await instructorPanelService.getEducationUpdate(
          formData,
          educations[index].id
        );
      } else {
        await instructorPanelService.postEducationSave(formData);
      }

      await refetch();
      setExpandedIndex(null);
      setIsAddingNew(false);

      // 🔹 Başarı alert'i
      setAlert({
        visible: true,
        type: "success",
        message: "Eğitim bilgisi kaydedildi!",
      });
    } catch (err) {
      console.error("Error saving education info", err);

      // 🔹 Hata alert'i
      setAlert({
        visible: true,
        type: "error",
        message: "Eğitim bilgisi kaydedilemedi.",
      });
    }
  };

  // const handleDeleteEducation = async (index) => {
  //   if (
  //     !window.confirm("Bu eğitim bilgisini silmek istediğinizden emin misiniz?")
  //   )
  //     return;

  //   try {
  //     if (educations[index].id) {
  //       await instructorPanelService.deleteEducationInfo(educations[index].id);
  //     }
  //     await refetch();
  //     alert("Eğitim başarıyla silindi!");
  //   } catch (err) {
  //     console.error("Error deleting education:", err);
  //     alert("Eğitim silinemedi.");
  //   }
  // };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (isLoading) return <p className="text-gray-600">Yükleniyor...</p>;

  return (
    <>
      {alert.visible && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ visible: false, type: "", message: "" })}
        />
      )}

      <div className="flex flex-col gap-6 p-6">
        <p className="text-black font-semibold text-xl">Education</p>

        {educations.length === 0 && !isAddingNew && (
          <p className="text-gray-600">Henüz eğitim bilgisi bulunmuyor.</p>
        )}

        <div className="grid grid-cols-1 gap-4">
          {/* Mevcut Eğitimler */}
          {educations.map((edu, index) => (
            <Formik
              key={edu.id || index}
              initialValues={{
                university: edu.university || "",
                degree: edu.degree || "",
                degree_type: edu.degree_type || "",
                specialization: edu.specialization || "",
                years_of_study: edu.years_of_study || "",
                diploma: edu.diploma_file_url || null, // 🔹 eklendi
              }}
              enableReinitialize
              onSubmit={(values) => handleSubmit(values, index)}
            >
              {({ setFieldValue, values }) => (
                <div className="border rounded-lg shadow bg-white overflow-hidden transition-all duration-300">
                  {/* Başlık */}
                  <div
                    className="p-4 cursor-pointer flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                    onClick={() => toggleExpand(index)}
                  >
                    <div>
                      <h3 className="font-semibold text-black">
                        {edu.university || "Üniversite Adı"}
                      </h3>
                      <p className="text-sm text-black">
                        {edu.degree || "Derece"} • {edu.years_of_study || "Yıl"}
                      </p>
                      <p className="text-xs text-black">
                        {edu.specialization || "Uzmanlık Alanı"}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      {/* <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEducation(index);
                      }}
                      className="text-gray-400 hover:text-red-600 p-1"
                    >
                      <Trash2 size={16} />
                    </button> */}
                      {expandedIndex === index ? (
                        <ChevronUp size={16} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Edit Alanı */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedIndex === index
                        ? "max-h-[1000px] p-4"
                        : "max-h-0 p-0"
                    }`}
                  >
                    <Form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black">
                          University
                        </label>
                        <Field
                          name="university"
                          className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#8e8e8e] bg-white font-light text-black resize-none shadow"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black">
                          Degree
                        </label>
                        <Field
                          name="degree"
                          className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#8e8e8e] bg-white font-light text-black resize-none shadow"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black">
                          Degree Type
                        </label>
                        <Field
                          name="degree_type"
                          className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#8e8e8e] bg-white font-light text-black resize-none shadow"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black">
                          Specialization
                        </label>
                        <Field
                          name="specialization"
                          className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#8e8e8e] bg-white font-light text-black resize-none shadow"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black">
                          Years of Study
                        </label>
                        <Field
                          name="years_of_study"
                          className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#8e8e8e] bg-white font-light text-black resize-none shadow"
                        />
                      </div>

                      {/* 🔹 Diploma Dosyası */}
                      {values.diploma ? (
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-black mb-1">
                            Diploma
                          </label>
                          <Image
                            src={values.diploma}
                            alt="Diploma"
                            width={100}
                            height={100}
                            className="w-40 h-28 object-cover rounded-lg border cursor-pointer hover:opacity-80"
                            onClick={() =>
                              window.open(values.diploma, "_blank")
                            }
                          />
                          <p className="text-sm text-gray-600 mt-2">
                            Kabul edilen formatlar: JPG, JPEG, PNG. Maksimum
                            boyut: 2MB
                          </p>
                          <label className="mt-2 inline-block text-blue-600 text-sm font-medium cursor-pointer">
                            Görseli Değiştir
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const fileUrl = URL.createObjectURL(file);
                                  setFieldValue("diploma", fileUrl);
                                  setFieldValue("diploma_file", file);
                                }
                              }}
                            />
                          </label>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-black">
                            Diploma Yükle
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const fileUrl = URL.createObjectURL(file);
                                setFieldValue("diploma", fileUrl);
                                setFieldValue("diploma_file", file);
                              }
                            }}
                            className="w-full border p-2 rounded"
                          />
                        </div>
                      )}

                      <div className="flex justify-end gap-3 pt-3 border-t">
                        <button
                          type="submit"
                          className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800"
                        >
                          Kaydet
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              )}
            </Formik>
          ))}

          {isAddingNew && (
            <Formik
              initialValues={{
                university: "",
                degree: "",
                degree_type: "",
                specialization: "",
                years_of_study: "",
                diploma_file: null, // 🔹 diploma_file ekledik
              }}
              onSubmit={async (values) => {
                await handleSubmit(values);
              }}
            >
              {({ setFieldValue, values }) => (
                <div className="border rounded-lg shadow bg-white overflow-hidden transition-all duration-300 max-h-[1000px] p-4 relative">
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                  >
                    <X size={18} />
                  </button>
                  <Form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black">
                        University
                      </label>
                      <Field
                        name="university"
                        className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#8e8e8e] bg-white font-light text-black resize-none shadow"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black">
                        Degree
                      </label>
                      <Field
                        name="degree"
                        className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#8e8e8e] bg-white font-light text-black resize-none shadow"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black">
                        Degree Type
                      </label>
                      <Field
                        name="degree_type"
                        className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#8e8e8e] bg-white font-light text-black resize-none shadow"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black">
                        Specialization
                      </label>
                      <Field
                        name="specialization"
                        className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#8e8e8e] bg-white font-light text-black resize-none shadow"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black">
                        Years of Study
                      </label>
                      <Field
                        name="years_of_study"
                        className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#8e8e8e] bg-white font-light text-black resize-none shadow"
                      />
                    </div>

                    {/* 🔹 Diploma Yükleme Alanı */}
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Diploma
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          setFieldValue("diploma_file", e.target.files[0]);
                        }}
                        className="block w-full text-sm text-black border rounded p-2"
                      />
                      {/* Seçilen dosya adı */}
                      {values.diploma_file && (
                        <p className="text-sm mt-1 text-gray-600">
                          Seçilen dosya: {values.diploma_file.name}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800"
                      >
                        Kaydet
                      </button>
                    </div>
                  </Form>
                </div>
              )}
            </Formik>
          )}
        </div>

        {!isAddingNew && (
          <div className="text-center pt-4">
            <button
              onClick={() => setIsAddingNew(true)}
              className="inline-flex items-center gap-2 px-6 py-3 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors"
            >
              <span>+</span>
              Add New Education
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default EducationInfo;

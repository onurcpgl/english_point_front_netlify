"use client";

import { Formik, Form, Field } from "formik";
import { useState } from "react";
import { Trash2, ChevronDown, ChevronUp, X, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import instructorPanelService from "../../../../utils/axios/instructorPanelService";
import AlertMessage from "../../another-comp/AlertMessage";
import Image from "next/image";

export default function CertificateInfo() {
  const queryClient = useQueryClient();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [alert, setAlert] = useState({ visible: false, type: "", message: "" });

  // 📡 Sertifikaları çekiyoruz
  const {
    data: certificates = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["certificates"],
    queryFn: async () => {
      const res = await instructorPanelService.getCertificateInfo();
      return res.user?.certificate || [];
    },
  });

  // 🔹 Sertifika kaydetme mutation
  const handleSaveCertificate = async (values, id) => {
    try {
      const formData = new FormData();
      formData.append("issuer", values.issuer || "");
      formData.append("certification", values.certification || "");
      formData.append("years_of_study", values.years_of_study || "");
      if (values.certificate_file_obj instanceof File) {
        formData.append("certificate_file", values.certificate_file_obj);
      }

      if (id) {
        await instructorPanelService.getCertificateUpdate(formData, id);
      } else {
        await instructorPanelService.postCertificateInfo(formData);
      }

      // Listeyi tekrar çek
      await refetch(); // senin queryFn fonksiyonun veya refetch

      setExpandedIndex(null);
      setIsAddingNew(false);
      setAlert({
        visible: true,
        type: "success",
        message: "Sertifika kaydedildi!",
      });
    } catch (err) {
      console.error("Error saving certificate", err);
      setAlert({
        visible: true,
        type: "error",
        message: "Sertifika kaydedilemedi!",
      });
    }
  };

  // const handleDelete = async (id) => {
  //   if (!window.confirm("Bu sertifikayı silmek istediğinizden emin misiniz?"))
  //     return;
  //   try {
  //     if (id) await instructorPanelService.deleteCertificateInfo(id);
  //     queryClient.invalidateQueries(["certificates"]);
  //     setAlert({
  //       visible: true,
  //       type: "success",
  //       message: "Sertifika silindi!",
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     setAlert({
  //       visible: true,
  //       type: "error",
  //       message: "Sertifika silinemedi!",
  //     });
  //   }
  // };

  if (isLoading) return <p className="p-6">Yükleniyor...</p>;

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
        <h2 className="text-black font-semibold text-xl">Certificates</h2>

        <div className="grid grid-cols-1 gap-4">
          {certificates.map((cert, index) => (
            <Formik
              key={cert.id || index}
              initialValues={{
                issuer: cert.issuer || "",
                certification: cert.certification || "",
                years_of_study: cert.years_of_study || "",
                certificate_file: cert.certificate_file_url || null, // görüntü için
                certificate_file_obj: null, // dosya yükleme için
              }}
              enableReinitialize
              onSubmit={(values) => handleSaveCertificate(values, cert.id)}
            >
              {({ setFieldValue, values }) => (
                <div className="border rounded-lg shadow bg-white overflow-hidden">
                  {/* Başlık */}
                  <div
                    className="p-4 cursor-pointer flex justify-between items-center hover:bg-gray-50"
                    onClick={() =>
                      setExpandedIndex(expandedIndex === index ? null : index)
                    }
                  >
                    <div>
                      <h3 className="font-semibold text-black">
                        {values.certification || "Sertifika Adı"}
                      </h3>
                      <p className="text-sm text-black">
                        {values.issuer || "Kurum"} •{" "}
                        {values.years_of_study || "Yıl"}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      {/* <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(cert.id);
                        }}
                        className="text-gray-400 hover:text-red-600 p-1"
                      >
                        <Trash2 size={16} />
                      </button> */}
                      {expandedIndex === index ? (
                        <ChevronUp className="text-black" size={16} />
                      ) : (
                        <ChevronDown className="text-black" size={16} />
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
                          Issuer
                        </label>
                        <Field
                          name="issuer"
                          className="w-full h-14 px-4 border rounded text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">
                          Certification
                        </label>
                        <Field
                          name="certification"
                          className="w-full h-14 px-4 border rounded text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">
                          Year
                        </label>
                        <Field
                          name="years_of_study"
                          className="w-full h-14 px-4 border rounded text-black"
                        />
                      </div>
                      <div>
                        {values.certificate_file ? (
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-black mb-1">
                              Certificate
                            </label>
                            <Image
                              src={values.certificate_file}
                              alt="Certificate"
                              width={100}
                              height={100}
                              className="w-40 h-28 object-cover rounded-lg border cursor-pointer hover:opacity-80"
                              onClick={() =>
                                window.open(values.certificate_file, "_blank")
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
                                    setFieldValue("certificate_file", fileUrl); // önizleme için güncelle
                                    setFieldValue("certificate_file_obj", file); // upload için
                                  }
                                }}
                              />
                            </label>
                          </div>
                        ) : (
                          <div>
                            <label className="block text-sm font-medium text-black">
                              Certificate Yükle
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const fileUrl = URL.createObjectURL(file);
                                  setFieldValue("certificate_file", fileUrl);
                                  setFieldValue("certificate_file_obj", file);
                                }
                              }}
                              className="w-full border p-2 rounded text-black"
                            />
                          </div>
                        )}
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800"
                      >
                        Kaydet
                      </button>
                    </Form>
                  </div>
                </div>
              )}
            </Formik>
          ))}

          {isAddingNew ? null : (
            <div className="text-center pt-4">
              <button
                onClick={() => setIsAddingNew(true)}
                className="inline-flex items-center gap-2 px-6 py-3 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors"
              >
                <span>+</span>
                Add New Certificate
              </button>
            </div>
          )}
          {isAddingNew && (
            <Formik
              initialValues={{
                issuer: "",
                certification: "",
                years_of_study: "",
                certificate_file: null, // görüntü için
                certificate_file_obj: null, // dosya yükleme için
              }}
              onSubmit={(values) => handleSaveCertificate(values)}
            >
              {({ setFieldValue, values }) => (
                <div className="border rounded-lg shadow bg-white overflow-hidden p-4 relative">
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
                        Issuer
                      </label>
                      <Field
                        name="issuer"
                        className="w-full h-14 px-4 border rounded text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black">
                        Certification
                      </label>
                      <Field
                        name="certification"
                        className="w-full h-14 px-4 border rounded text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black">
                        Year
                      </label>
                      <Field
                        name="years_of_study"
                        className="w-full h-14 px-4 border rounded text-black"
                      />
                    </div>

                    {/* 🔹 Certificate Yükleme ve Preview */}
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Certificate
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const previewUrl = URL.createObjectURL(file);
                            setFieldValue("certificate_file", previewUrl);
                            setFieldValue("certificate_file_obj", file);
                          }
                        }}
                        className="w-full border p-2 rounded text-black"
                      />

                      {/* 🔹 Önizleme */}
                      {values.certificate_file && (
                        <Image
                          src={values.certificate_file}
                          alt="Certificate Preview"
                          width={100}
                          height={100}
                          className="w-40 h-28 object-cover rounded-lg border mt-2 cursor-pointer hover:opacity-80"
                          onClick={() =>
                            window.open(values.certificate_file, "_blank")
                          }
                        />
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
      </div>
    </>
  );
}

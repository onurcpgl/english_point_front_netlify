"use client";

import { Formik, Form, Field } from "formik";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  X,
  Award, // İkon sertifika için Award yapıldı
  Plus,
  Upload,
  FileCheck,
} from "lucide-react";
import instructorPanelService from "../../../../utils/axios/instructorPanelService";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import AlertMessage from "../../another-comp/AlertMessage";

// Senin marka rengin
const brandColor = "[#ffd207]";

function CertificateInfo() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [alert, setAlert] = useState({
    visible: false,
    type: "",
    message: "",
  });

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["certificates"],
    queryFn: async () => {
      const res = await instructorPanelService.getCertificateInfo();
      return res.user?.certificate || [];
    },
  });

  const certificates = data || [];

  const handleSubmit = async (values, index) => {
    try {
      const formData = new FormData();
      formData.append("issuer", values.issuer || "");
      formData.append("certification", values.certification || "");
      formData.append("years_of_study", values.years_of_study || "");

      if (values.certificate_file_obj instanceof File) {
        formData.append("certificate_file", values.certificate_file_obj);
      }

      if (index !== undefined && certificates[index]?.id) {
        await instructorPanelService.getCertificateUpdate(
          formData,
          certificates[index].id,
        );
      } else {
        await instructorPanelService.postCertificateInfo(formData);
      }

      await refetch();
      setExpandedIndex(null);
      setIsAddingNew(false);

      setAlert({
        visible: true,
        type: "success",
        message: "Certificate information saved successfully!",
      });
    } catch (err) {
      setAlert({
        visible: true,
        type: "error",
        message: "Could not save certificate information.",
      });
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (isLoading)
    return (
      <div className="p-6 flex items-center gap-2 text-gray-400">
        <div className="animate-spin text-black rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
        Loading Certificate Data...
      </div>
    );

  return (
    <>
      {alert.visible && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ visible: false, type: "", message: "" })}
        />
      )}

      <div className="flex flex-col gap-8 p-8 max-md:p-1 max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-end max-md:items-start border-b pb-6 flex-row max-md:flex-col gap-6">
          {/* Yazı Alanı */}
          <div className="flex-1 min-w-0">
            <h2 className="text-black font-bold text-3xl max-md:text-2xl tracking-tight uppercase">
              Certificates
            </h2>
            <p className="text-gray-500 mt-1 text-sm leading-relaxed">
              Manage your professional certifications and awards.
            </p>
          </div>

          {/* Buton Alanı */}
          {!isAddingNew && (
            <button
              onClick={() => setIsAddingNew(true)}
              // max-md:w-full: Mobilde butonu tam genişlik yapar
              // py-4: Mobilde daha rahat basılması için dikey alanı artırdık
              className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-4 font-bold transition-all shadow-sm active:scale-95 rounded-none whitespace-nowrap max-md:w-full"
            >
              <Plus size={20} strokeWidth={3} />
              <span>Add New</span>
            </button>
          )}
        </div>

        {certificates.length === 0 && !isAddingNew && (
          <div className="bg-gray-50 border-2 border-dashed rounded-2xl p-12 text-center">
            <Award className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium">No certificates found.</p>
          </div>
        )}

        <div className="space-y-4">
          {/* List of Existing Certificates */}
          {certificates.map((cert, index) => (
            <Formik
              key={cert.id || index}
              initialValues={{
                issuer: cert.issuer || "",
                certification: cert.certification || "",
                years_of_study: cert.years_of_study || "",
                certificate_file: cert.certificate_file_url || null,
              }}
              enableReinitialize
              onSubmit={(values) => handleSubmit(values, index)}
            >
              {({ setFieldValue, values }) => (
                <div
                  className={`group bg-white border rounded-2xl transition-all duration-300 ${
                    expandedIndex === index
                      ? `ring-2 ring-${brandColor} border-transparent shadow-xl`
                      : "hover:border-gray-300 shadow-sm"
                  }`}
                >
                  {/* Collapsed Header */}
                  <div
                    className="p-5 max-md:p-4 cursor-pointer flex justify-between items-center gap-3"
                    onClick={() => toggleExpand(index)}
                  >
                    {/* Sol Kısım: İkon ve Metinler */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      {/* İkon: Mobil boyutunu biraz küçülttük ve shrink-0 ile ezilmesini önledik */}
                      <div
                        className={`w-14 h-14 max-md:w-12 max-md:h-12 bg-black text-${brandColor} rounded-2xl flex items-center justify-center shrink-0 shadow-inner`}
                      >
                        <Award size={28} className="max-md:w-6 max-md:h-6" />
                      </div>

                      {/* Metin Alanı: min-w-0 ve flex-1 buranın daralabilir olduğunu belirler */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-black text-lg max-md:text-base leading-tight break-words line-clamp-2">
                          {cert.certification || "Certificate Name"}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium mt-1 truncate">
                          {cert.issuer || "Issuer"} •{" "}
                          {cert.years_of_study || "Year"}
                        </p>
                      </div>
                    </div>

                    {/* Sağ Kısım: Ok İkonu */}
                    <div
                      className={`shrink-0 bg-gray-100 p-2 rounded-full text-gray-400 group-hover:bg-${brandColor}/20 group-hover:text-black transition-colors`}
                    >
                      {expandedIndex === index ? (
                        <ChevronUp
                          size={20}
                          className="max-md:w-4 max-md:h-4"
                        />
                      ) : (
                        <ChevronDown
                          size={20}
                          className="max-md:w-4 max-md:h-4"
                        />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      expandedIndex === index
                        ? "max-h-[1200px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-6 pt-0 border-t border-gray-50 mt-2">
                      <Form className="space-y-6 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <CustomInputField
                            label="Certificate Name"
                            name="certification"
                            placeholder="e.g. AWS Certified Developer"
                          />
                          <CustomInputField
                            label="Issuer"
                            name="issuer"
                            placeholder="e.g. Amazon Web Services"
                          />
                          <div className="md:col-span-2">
                            <CustomInputField
                              label="Year"
                              name="years_of_study"
                              placeholder="e.g. 2023"
                            />
                          </div>
                        </div>

                        {/* Certificate File Section */}
                        <div className="space-y-3">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                            Certificate File
                          </label>
                          <div
                            className={`relative group/upload flex flex-col items-center justify-center p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl hover:border-${brandColor} transition-all cursor-pointer`}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer z-10"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setFieldValue(
                                    "certificate_file",
                                    URL.createObjectURL(file),
                                  );
                                  setFieldValue("certificate_file_obj", file);
                                }
                              }}
                            />
                            {values.certificate_file ? (
                              <div className="flex flex-col items-center gap-4 text-center">
                                <Image
                                  src={values.certificate_file}
                                  alt="Preview"
                                  width={160}
                                  height={100}
                                  className="rounded-lg shadow-md border-4 border-white object-cover h-32 w-48"
                                />
                                <div>
                                  <p className="text-sm font-bold text-black">
                                    Document Attached
                                  </p>
                                  <p className="text-xs text-blue-600 font-semibold underline">
                                    Click to change document
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center">
                                <div
                                  className={`bg-white p-4 rounded-2xl shadow-sm inline-block mb-3 text-${brandColor}`}
                                >
                                  <Upload size={24} />
                                </div>
                                <p className="text-sm font-bold text-black">
                                  Upload your certificate
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  JPG, PNG or PDF (Max 2MB)
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end pt-4">
                          <button
                            type="submit"
                            className="bg-black text-white px-10 py-4 font-bold hover:bg-gray-900 transition-all shadow-lg active:scale-95 rounded-none"
                          >
                            Update Certificate
                          </button>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              )}
            </Formik>
          ))}

          {/* New Certificate Form */}
          {isAddingNew && (
            <Formik
              initialValues={{
                issuer: "",
                certification: "",
                years_of_study: "",
                certificate_file_obj: null,
              }}
              onSubmit={async (values) => {
                await handleSubmit(values);
              }}
            >
              {({ setFieldValue, values }) => (
                <div
                  className={`bg-white border-2 border-${brandColor} rounded-2xl shadow-2xl p-8 relative animate-in fade-in zoom-in duration-300`}
                >
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={24} />
                  </button>

                  <div className="flex items-center gap-3 mb-8">
                    <div
                      className={`p-3 bg-${brandColor} rounded-xl text-black`}
                    >
                      <Plus size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-black">
                      Add New Certificate
                    </h3>
                  </div>

                  <Form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <CustomInputField
                        label="Certificate Name"
                        name="certification"
                        placeholder="e.g. UI/UX Design Professional"
                      />
                      <CustomInputField
                        label="Issuer"
                        name="issuer"
                        placeholder="e.g. Coursera / Google"
                      />
                      <div className="md:col-span-2">
                        <CustomInputField
                          label="Year"
                          name="years_of_study"
                          placeholder="e.g. 2024"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                        Certificate Attachment
                      </label>
                      <div
                        className={`relative flex flex-col items-center justify-center p-10 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl hover:border-${brandColor} transition-all cursor-pointer`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          onChange={(e) =>
                            setFieldValue(
                              "certificate_file_obj",
                              e.target.files[0],
                            )
                          }
                        />
                        {values.certificate_file_obj ? (
                          <div className="flex items-center gap-3 text-green-600">
                            <FileCheck size={32} />
                            <div className="text-left">
                              <p className="font-bold text-black">
                                {values.certificate_file_obj.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                File ready to upload
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload
                              className="mx-auto text-gray-300 mb-2"
                              size={32}
                            />
                            <p className="text-sm font-bold text-black">
                              Click to select certificate file
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsAddingNew(false)}
                        className="px-8 py-4 text-gray-500 font-bold hover:text-black transition-colors rounded-none"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-black text-white px-10 py-4 font-bold hover:bg-gray-900 transition-all shadow-md active:scale-95 rounded-none"
                      >
                        Save Certificate
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

// Yardımcı Input Bileşeni
const CustomInputField = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <Field
      {...props}
      className={`w-full h-14 bg-gray-50 border-2 border-transparent rounded-xl px-5 focus:bg-white focus:border-${brandColor} focus:ring-0 outline-none transition-all placeholder:text-gray-300 text-black font-medium`}
    />
  </div>
);

export default CertificateInfo;

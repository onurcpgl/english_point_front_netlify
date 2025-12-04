"use client";
import { useEffect, useState, useRef } from "react";
import ProfilePhotoCropper from "../../../profilePhotoCropper/ProfilePhotoCropper";
import Image from "next/image";
import { Formik, Form, Field } from "formik";
import generalService from "../../../../utils/axios/generalService";
import AlertMessage from "../../anotherComp/AlertMessage";
import { useQueryClient } from "@tanstack/react-query";
import { formatPhone } from "../../../../utils/helpers/formatters";
function UserPersonalInfo({ data, error, isLoading }) {
  const [alert, setAlert] = useState({
    visible: false,
    type: "",
    message: "",
  });

  const queryClient = useQueryClient();
  const [btnLoading, setBtnLoading] = useState(false);

  const wrapperRefCountryBirth = useRef(null);
  const wrapperRefCurrentLocation = useRef(null);

  const [photoPreview, setPhotoPreview] = useState(null);

  // 🔹 Formik başlangıç değerleri
  const initialValues = {
    name: data?.user?.name || "",
    email: data?.user?.email || "",
    phone: data?.user?.phone || "",
    photo: {},
  };

  useEffect(() => {
    if (data?.user?.profile_image) {
      setPhotoPreview(data.user.profile_image);
    }
  }, [data]);

  const handleCropDone = (blob, setFieldValue) => {
    const file = new File([blob], "profile_photo.png", { type: blob.type });
    setPhotoPreview(URL.createObjectURL(blob));
    setFieldValue("photo", { file });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        wrapperRefCountryBirth.current &&
        !wrapperRefCountryBirth.current.contains(event.target)
      ) {
      }
      if (
        wrapperRefCurrentLocation.current &&
        !wrapperRefCurrentLocation.current.contains(event.target)
      ) {
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 🔹 Submit işlemi
  const handleSubmit = async (values, { setSubmitting }) => {
    setBtnLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone); // phone eklendi
      if (values.photo?.file) {
        formData.append("profile_image", values.photo.file);
      }

      const result = await generalService.updateUserProfile(formData);

      if (result.success) {
        queryClient.invalidateQueries(["userProfile"]);
        setAlert({
          visible: true,
          type: "success",
          message: "Profil başarıyla güncellendi!",
        });
      } else {
        setAlert({
          visible: true,
          type: "error",
          message: "Bir hata oluştu. Lütfen tekrar deneyin.",
        });
      }
    } catch (error) {
      setAlert({
        visible: true,
        type: "error",
        message: "Sunucu hatası oluştu.",
      });
    } finally {
      setBtnLoading(false);
      setSubmitting(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile!</p>;

  return (
    <>
      {alert.visible && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ visible: false, type: "", message: "" })}
        />
      )}

      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="flex flex-col gap-4">
            <div>
              <p className="text-black font-semibold text-2xl">Fotoğraf</p>
              <p className="text-[#686464]">
                Hesabınız için bir profil fotoğrafı belirleyin.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex flex-col items-center md:items-start gap-2">
                <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                  {photoPreview ? (
                    <Image
                      src={photoPreview}
                      alt="Profile Photo"
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <ProfilePhotoCropper
                  onCropDone={(blob) => handleCropDone(blob, setFieldValue)}
                />
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-black font-semibold text-2xl">Hakkında</p>
                  <p className="text-[#686464]">
                    Profil bilgilerinizi buradan güncelleyebilirsiniz.
                  </p>
                </div>

                <div className="flex flex-col gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-gray-700 text-sm">
                      İsim Soyisim
                    </label>
                    <Field
                      id="name"
                      type="text"
                      name="name"
                      placeholder="İsim soyisim"
                      className="w-full h-14 outline-0 px-4 bg-white shadow text-black"
                    />
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <label className="text-gray-700 text-sm">E-mail</label>
                    <Field
                      id="email"
                      type="text"
                      name="email"
                      placeholder="Email adresiniz"
                      className="w-full h-14 outline-0 px-4 bg-white shadow text-black"
                    />
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <label className="text-gray-700 text-sm">Telefon</label>
                    <Field name="phone">
                      {({ field, form }) => (
                        <input
                          {...field}
                          type="text"
                          id="phone"
                          placeholder="Telefon numaranız"
                          className="w-full h-14 outline-0 px-4 bg-white shadow text-black"
                          value={field.value}
                          onChange={(e) => {
                            const formatted = formatPhone(e.target.value); // formatPhone kullanımı
                            form.setFieldValue("phone", formatted);
                          }}
                        />
                      )}
                    </Field>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={btnLoading}
                className={`flex items-center justify-center gap-2 bg-black text-white px-6 py-2 rounded-full text-sm mt-4 transition-all ${
                  btnLoading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:scale-105"
                }`}
              >
                {btnLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  "Kaydet ve devam et"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default UserPersonalInfo;

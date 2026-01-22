"use client";
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import generalService from "../../../../utils/axios/generalService";
import AlertMessage from "../../anotherComp/AlertMessage";

function UserSecurityInfo() {
  const [alert, setAlert] = useState({
    visible: false,
    type: "",
    message: "",
  });
  const [btnLoading, setBtnLoading] = useState(false);

  // 🔹 Formik başlangıç değerleri
  const initialValues = {
    currentPassword: "",
    password: "",
    confirmPassword: "",
  };

  // 🔹 Yup validasyonu
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Mevcut şifre zorunlu"),
    password: Yup.string()
      .min(6, "Şifre en az 6 karakter olmalı")
      .required("Yeni şifre zorunlu"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Şifreler eşleşmeli")
      .required("Şifre doğrulama zorunlu"),
  });

  // 🔹 Submit işlemi
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setBtnLoading(true);
    try {
      const result = await generalService.userChangePassword({
        currentPassword: values.currentPassword,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      if (result.success) {
        setAlert({
          visible: true,
          type: "success",
          message: result.message || "Şifreniz başarıyla güncellendi!",
        });
        resetForm();
      } else {
        // API 200 döndü ama success false (Örn: Business logic hatası)
        setAlert({
          visible: true,
          type: "error",
          message: result.message || "Bir hata oluştu. Tekrar deneyin.",
        });
      }
    } catch (error) {
      // 🔹 Sunucudan gelen detaylı validasyon hatalarını yakalıyoruz
      let errorMessage = "Sunucu hatası oluştu.";

      if (error.response && error.response.data) {
        const serverErrors = error.response.data.errors;
        const serverMessage = error.response.data.message;

        if (serverErrors) {
          // Laravel'den gelen tüm validasyon mesajlarını birleştirir
          // Örn: "Eski şifreniz hatalı. Yeni şifre en az 8 karakter olmalıdır."
          errorMessage = Object.values(serverErrors).flat().join(" ");
        } else if (serverMessage) {
          // Hata mesajı direkt 'message' içinde gelmişse (401 veya özel fırlatılan hatalar)
          errorMessage = serverMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setAlert({
        visible: true,
        type: "error",
        message: errorMessage,
      });
    } finally {
      setBtnLoading(false);
      setSubmitting(false);
    }
  };

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
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="flex flex-col gap-4">
            <div>
              <p className="text-black font-semibold text-2xl">
                Şifre Değiştir
              </p>
              <p className="text-[#686464]">
                Hesabınızın şifresini buradan güncelleyebilirsiniz.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-gray-700 text-sm">Mevcut Şifre</label>
                <Field
                  type="password"
                  name="currentPassword"
                  placeholder="Mevcut şifreniz"
                  className="w-full h-14 outline-0 px-4 bg-white shadow text-black"
                />
                {errors.currentPassword && touched.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="text-gray-700 text-sm">Yeni Şifre</label>
                <Field
                  type="password"
                  name="password"
                  placeholder="Yeni şifreniz"
                  className="w-full h-14 outline-0 px-4 bg-white shadow text-black"
                />
                {errors.password && touched.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="text-gray-700 text-sm">Şifre Doğrulama</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Şifreyi tekrar girin"
                  className="w-full h-14 outline-0 px-4 bg-white shadow text-black"
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
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
                {btnLoading ? "Kaydediliyor..." : "Şifreyi Güncelle"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default UserSecurityInfo;

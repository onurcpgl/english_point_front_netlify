"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ArrowRight,
  Mail,
  Eye, // Eklendi: Göz açık ikonu
  EyeOff, // Eklendi: Göz kapalı ikonu
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import generalService from "../../../utils/axios/generalService";
import ErrorModal from "../../ui/ErrorModal/ErrorModal";

// Formik Validation Schema
const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Ad Soyad gerekli"),
  email: Yup.string()
    .email("Geçerli bir e-posta girin")
    .required("E-posta gerekli"),
  password: Yup.string().required("Şifre gerekli"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Şifreler eşleşmiyor")
    .required("Şifre tekrar gerekli"),
});

export default function RegisterPage() {
  const router = useRouter();

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);

  // --- Şifre Göster/Gizle State'leri ---
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.englishpoint.com.tr";

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}api/auth/google/redirect`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${API_URL}api/auth/facebook/redirect`;
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await generalService.register(values);

      if (response && response.status) {
        resetForm();
        router.push("/register-complete");
      } else {
        setErrorMessage(
          response.message || "Kayıt başarısız oldu. Lütfen tekrar deneyin.",
        );
        setErrorModalOpen(true);
      }
    } catch (error) {
      setErrorMessage("Sistem hatası. Lütfen daha sonra tekrar deneyin.");
      setErrorModalOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FFD207] relative">
      <div className="w-full py-10">
        <div className="container mx-auto">
          <div className="p-6 max-w-xl w-full mx-auto text-black">
            <h2 className="text-black font-bold text-[40px]">Kayıt Ol</h2>
            <p className="text-[#686464] font-sm mb-8">
              Hesabını oluştur, sana özel eğitimlere hemen katıl!
            </p>

            {/* Sosyal Medya Butonları */}
            <div className="space-y-3 mb-4">
              <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-4 px-6 hover:border-gray-300 hover:shadow-md transition-all duration-300 font-medium group"
              >
                <FcGoogle size={24} />
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  Google ile Kayıt Ol
                </span>
              </button>

              <button
                onClick={handleFacebookLogin}
                type="button"
                className="flex items-center w-full justify-center gap-2 bg-white text-gray-700 py-4 px-4 hover:border-gray-300 hover:shadow-md transition-all duration-300 font-medium group"
              >
                <FaFacebookF color="#1877F2" size={20} />
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  Facebook ile Kayıt Ol
                </span>
              </button>
            </div>

            {/* E-posta Alanı */}
            <div className="mt-3">
              <AnimatePresence mode="wait">
                {!showEmailForm ? (
                  <motion.div
                    key="email-button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      onClick={() => setShowEmailForm(true)}
                      type="button"
                      className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-4 px-6 hover:border-gray-300 hover:shadow-md transition-all duration-300 font-medium group"
                    >
                      <Mail size={24} className="text-gray-600" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        E-posta ile Kayıt Ol
                      </span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="register-form"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5 }}
                    className="overflow-hidden"
                  >
                    <Formik
                      initialValues={initialValues}
                      validationSchema={RegisterSchema}
                      onSubmit={handleSubmit}
                    >
                      {({ isSubmitting, errors, touched }) => (
                        <Form className="flex flex-col my-4" autoComplete="off">
                          {/* autoComplete="off" form geneline eklendi */}

                          <div className="mb-4 text-right">
                            <button
                              type="button"
                              onClick={() => setShowEmailForm(false)}
                              className="text-md text-gray-800 hover:text-black underline"
                            >
                              Seçeneklere Dön
                            </button>
                          </div>

                          {/* Ad Soyad */}
                          <FormField
                            label="Ad Soyad"
                            error={touched.name && errors.name}
                          >
                            <Field
                              name="name"
                              type="text"
                              autoComplete="off" // Otomatik doldurma kapalı
                              className="w-full h-14 outline-0 px-4 placeholder:text-[#999] bg-white font-light"
                              placeholder="Ad Soyad"
                            />
                          </FormField>

                          {/* E-posta */}
                          <FormField
                            label="E-posta"
                            error={touched.email && errors.email}
                          >
                            <Field
                              name="email"
                              type="email"
                              autoComplete="off" // Chrome bazen inat eder ama standart budur
                              className="w-full h-14 outline-0 px-4 placeholder:text-[#999] bg-white font-light"
                              placeholder="E-posta"
                            />
                          </FormField>

                          {/* Şifre */}
                          <FormField
                            label="Şifre"
                            error={touched.password && errors.password}
                          >
                            <div className="relative">
                              <Field
                                name="password"
                                // State'e göre tipi değiştiriyoruz
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password" // Kayıt formlarında bu kullanılır
                                className="w-full h-14 outline-0 px-4 pr-12 placeholder:text-[#999] bg-white font-light"
                                placeholder="Şifre"
                              />
                              {/* Göz İkonu Butonu */}
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                              >
                                {showPassword ? (
                                  <EyeOff size={20} />
                                ) : (
                                  <Eye size={20} />
                                )}
                              </button>
                            </div>
                          </FormField>

                          {/* Şifre Tekrar */}
                          <FormField
                            label="Şifre Tekrar"
                            error={
                              touched.confirmPassword && errors.confirmPassword
                            }
                          >
                            <div className="relative">
                              <Field
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="new-password"
                                className="w-full h-14 outline-0 px-4 pr-12 placeholder:text-[#999] bg-white font-light"
                                placeholder="Şifre Tekrar"
                              />
                              {/* Göz İkonu Butonu */}
                              <button
                                type="button"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff size={20} />
                                ) : (
                                  <Eye size={20} />
                                )}
                              </button>
                            </div>
                          </FormField>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r cursor-pointer bg-black hover:bg-white 
                        focus:bg-white focus:text-black hover:text-black text-white py-4 px-6 
                        font-semibold focus:ring-4 flex justify-center items-center group mt-6 transition-colors duration-300"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2
                                  className="animate-spin mr-2"
                                  size={20}
                                />
                                Kayıt yapılıyor...
                              </>
                            ) : (
                              <>
                                Kayıt Ol
                                <ArrowRight
                                  className="group-hover:translate-x-1 transition-transform duration-300 ml-2"
                                  size={20}
                                />
                              </>
                            )}
                          </button>
                        </Form>
                      )}
                    </Formik>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Linkleri */}
            <div className="text-center mt-8">
              <p className="text-gray-900">
                Zaten bir hesabın var mı?{" "}
                <Link
                  href="/login"
                  className="relative font-bold inline-block after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                >
                  Giriş Yap
                </Link>
              </p>
            </div>
            <div className="text-center mt-2">
              <p className="text-gray-900">
                <Link
                  href="/"
                  className="relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                >
                  Ana sayfaya git.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ErrorModal
        open={errorModalOpen}
        message={errorMessage}
        onClose={() => setErrorModalOpen(false)}
      />
    </div>
  );
}

/* Field Wrapper */
function FormField({ label, error, children }) {
  return (
    <div className="relative mb-6">
      <label className="block text-sm text-black font-medium mb-1">
        {label}
      </label>

      {children}

      {error && (
        <p className="text-red-500 text-xs mt-1 absolute -bottom-4">{error}</p>
      )}
    </div>
  );
}

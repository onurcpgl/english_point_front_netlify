"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, Mail, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import ContractModal from "../contract-modal/ContractModal";
import ilListesi from "../../../utils/helpers/il.json";
import ilceListesi from "../../../utils/helpers/ilce.json";
import generalService from "../../../utils/axios/generalService";
import ErrorModal from "../../ui/ErrorModal/ErrorModal";

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Ad Soyad gerekli"),
  email: Yup.string()
    .email("Geçerli bir e-posta girin")
    .required("E-posta gerekli"),
  city_id: Yup.string().required("İl seçimi gerekli"),
  district_id: Yup.string().required("İlçe seçimi gerekli"),
  password: Yup.string()
    .min(6, "Şifre en az 6 karakter olmalı")
    .required("Şifre gerekli"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Şifreler eşleşmiyor")
    .required("Şifre tekrar gerekli"),
});

export default function RegisterPage() {
  const router = useRouter();
  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.englishpoint.com.tr";

  const initialValues = {
    name: "",
    email: "",
    city_id: "",
    district_id: "",
    password: "",
    confirmPassword: "",
  };

  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [filteredDistricts, setFilteredDistricts] = useState([]);

  // Kontrol State'leri
  const [isAgreed, setIsAgreed] = useState(false);
  const [isContractOpen, setIsContractOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // ASIL KAYIT FONKSİYONU
  const handleFinalRegister = async (values, helpers) => {
    helpers.setSubmitting(true);
    try {
      const response = await generalService.register(values);
      if (response && response.status) {
        helpers.resetForm();
        router.push("/register-complete");
      } else {
        setErrorMessage(response.message || "Kayıt başarısız oldu.");
        setErrorModalOpen(true);
      }
    } catch (error) {
      setErrorMessage("Sistem hatası. Lütfen daha sonra tekrar deneyin.");
      setErrorModalOpen(true);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  // Sosyal Medya Tetikleyici
  const triggerSocialLogin = (provider) => {
    if (!isAgreed) {
      setPendingAction(provider);
      setIsContractOpen(true);
    } else {
      window.location.href = `${API_URL}api/auth/${provider}/redirect`;
    }
  };

  // Modal Onaylandığında
  const handleContractConfirm = () => {
    setIsContractOpen(false);
    setIsAgreed(true); // Onay verildi işaretle

    // Eğer sosyal medyadan gelmişse direkt yönlendir
    if (pendingAction === "google") {
      window.location.href = `${API_URL}api/auth/google/redirect`;
    } else if (pendingAction === "facebook") {
      window.location.href = `${API_URL}api/auth/facebook/redirect`;
    }
    setPendingAction(null);
  };

  return (
    <div className="w-full min-h-screen bg-[#FFD207] relative">
      <ContractModal
        isOpen={isContractOpen}
        onClose={() => setIsContractOpen(false)}
        onConfirm={handleContractConfirm}
      />

      <div className="w-full py-10">
        <div className="container mx-auto">
          <div className="p-6 max-w-xl w-full mx-auto text-black max-md:p-2">
            <h2 className="text-black font-bold text-[40px]">Kayıt Ol</h2>
            <p className="text-[#686464] mb-8 italic">
              Hesabını oluştur, sana özel eğitimlere hemen katıl!
            </p>

            {/* Sosyal Medya Butonları */}
            <div className="space-y-3 mb-4">
              <button
                onClick={() => triggerSocialLogin("google")}
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-white py-4 px-6 hover:shadow-md transition-all duration-300 font-medium group"
              >
                <FcGoogle size={24} />
                <span>Google ile Kayıt Ol</span>
              </button>
              <button
                onClick={() => triggerSocialLogin("facebook")}
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-white py-4 px-4 hover:shadow-md transition-all duration-300 font-medium group"
              >
                <FaFacebookF color="#1877F2" size={20} />
                <span>Facebook ile Kayıt Ol</span>
              </button>
            </div>

            <div className="mt-3">
              <AnimatePresence mode="wait">
                {!showEmailForm ? (
                  <motion.button
                    key="email-button"
                    onClick={() => setShowEmailForm(true)}
                    className="w-full flex items-center justify-center gap-3 bg-white py-4 px-6 hover:shadow-md transition-all duration-300 font-medium"
                  >
                    <Mail size={24} />
                    <span>E-posta ile Kayıt Ol</span>
                  </motion.button>
                ) : (
                  <motion.div
                    key="register-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Formik
                      initialValues={initialValues}
                      validationSchema={RegisterSchema}
                      onSubmit={(values, helpers) => {
                        // Eğer onaylıysa kayıt yap, değilse modalı aç
                        if (isAgreed) {
                          handleFinalRegister(values, helpers);
                        } else {
                          setIsContractOpen(true);
                          helpers.setSubmitting(false); // Loading'i durdur
                        }
                      }}
                    >
                      {({
                        isSubmitting,
                        setFieldValue,
                        values,
                        touched,
                        errors,
                      }) => (
                        <Form className="flex flex-col my-4" autoComplete="off">
                          <div className="mb-4 text-right">
                            <button
                              type="button"
                              onClick={() => setShowEmailForm(false)}
                              className="text-sm underline"
                            >
                              Seçeneklere Dön
                            </button>
                          </div>

                          <FormField
                            label="Ad Soyad"
                            error={touched.name && errors.name}
                          >
                            <Field
                              name="name"
                              className="w-full h-14 px-4 bg-white outline-none"
                              placeholder="Ad Soyad"
                            />
                          </FormField>

                          <FormField
                            label="E-posta"
                            error={touched.email && errors.email}
                          >
                            <Field
                              name="email"
                              type="email"
                              className="w-full h-14 px-4 bg-white outline-none"
                              placeholder="E-posta"
                            />
                          </FormField>

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              label="İl"
                              error={touched.city_id && errors.city_id}
                            >
                              <Field
                                as="select"
                                name="city_id"
                                className="w-full h-14 px-4 bg-white outline-none appearance-none"
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFieldValue("city_id", val);
                                  setFieldValue("district_id", "");
                                  const filtered = ilceListesi[0].data.filter(
                                    (item) => item.il_id === val,
                                  );
                                  setFilteredDistricts(filtered);
                                }}
                              >
                                <option value="">Seçiniz</option>
                                {ilListesi[0].data.map((il) => (
                                  <option key={il.id} value={il.id}>
                                    {il.name}
                                  </option>
                                ))}
                              </Field>
                            </FormField>

                            <FormField
                              label="İlçe"
                              error={touched.district_id && errors.district_id}
                            >
                              <Field
                                as="select"
                                name="district_id"
                                className="w-full h-14 px-4 bg-white outline-none disabled:bg-gray-100"
                                disabled={!values.city_id}
                              >
                                <option value="">Seçiniz</option>
                                {filteredDistricts.map((ilce) => (
                                  <option key={ilce.id} value={ilce.id}>
                                    {ilce.name}
                                  </option>
                                ))}
                              </Field>
                            </FormField>
                          </div>

                          <FormField
                            label="Şifre"
                            error={touched.password && errors.password}
                          >
                            <div className="relative">
                              <Field
                                name="password"
                                type={showPassword ? "text" : "password"}
                                className="w-full h-14 px-4 bg-white outline-none"
                                placeholder="Şifre"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2"
                              >
                                {showPassword ? (
                                  <EyeOff size={20} />
                                ) : (
                                  <Eye size={20} />
                                )}
                              </button>
                            </div>
                          </FormField>

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
                                className="w-full h-14 px-4 bg-white outline-none"
                                placeholder="Şifre Tekrar"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2"
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
                            className="w-full bg-black hover:bg-white hover:text-black text-white py-4 px-6 font-semibold flex justify-center items-center group mt-6 transition-all duration-300 border border-black"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2
                                  className="animate-spin mr-2"
                                  size={20}
                                />{" "}
                                Kayıt yapılıyor...
                              </>
                            ) : (
                              <>
                                <ArrowRight
                                  className="group-hover:translate-x-1 transition-all mr-2"
                                  size={20}
                                />
                                {isAgreed ? "Kaydı Tamamla" : "Kayıt Ol"}
                              </>
                            )}
                          </button>

                          {isAgreed && (
                            <p className="text-center text-xs text-green-700 mt-2 font-bold uppercase tracking-widest animate-pulse">
                              ✓ Sözleşme Onaylandı
                            </p>
                          )}
                        </Form>
                      )}
                    </Formik>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="text-center mt-8 text-gray-900">
              Zaten bir hesabın var mı?{" "}
              <Link href="/login" className="font-bold underline">
                Giriş Yap
              </Link>
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

function FormField({ label, error, children }) {
  return (
    <div className="relative mb-6">
      <label className="block text-sm text-black font-medium mb-1">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-red-600 text-[11px] mt-1 absolute -bottom-4 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

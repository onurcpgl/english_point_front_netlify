"use client";
import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { Formik, Form, Field } from "formik";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SuccesMessageComp from "../../ui/SuccesModal/SuccesMessageComp";
import generalService from "../../../utils/axios/generalService";
import * as Yup from "yup";
import Link from "next/link";

// Yup validation schema
const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Geçerli bir e-posta adresi giriniz")
    .required("E-posta zorunludur"),
  password: Yup.string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .required("Şifre zorunludur"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  // E-posta Onay İşlemleri İçin Yeni State'ler
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");

  // Modal State'i
  const [successOpen, setSuccessOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const searchParams = useSearchParams();
  const { update } = useSession();

  const targetPath =
    searchParams.get("redirect") ||
    searchParams.get("callbackUrl") ||
    "/course-sessions";
  const router = useRouter();

  // Initial values
  const initialValues = {
    email: "",
    password: "",
  };

  const forgotPasswordValidationSchema = Yup.object({
    email: Yup.string()
      .email("Lütfen geçerli bir e-posta adresi giriniz")
      .required("E-posta zorunludur"),
  });

  useEffect(() => {
    const isVerified = searchParams.get("verified");
    if (isVerified === "true") {
      setModalMessage(
        "Tebrikler! Hesabınız başarıyla doğrulandı. Şimdi giriş yapabilirsiniz.",
      );
      setSuccessOpen(true);
      router.replace("/login");
    }

    const error = searchParams.get("error");
    if (error === "invalid_link") {
      console.log("Link geçersiz!");
    }
  }, [searchParams, router]);

  // --- YENİ EKLENEN: ONAY MAİLİNİ TEKRAR GÖNDERME FONKSİYONU ---
  const handleResendVerification = async (email) => {
    try {
      setIsResending(true);
      setResendSuccess("");

      // Senin belirttiğin general service fonksiyonuna istek atıyoruz
      await generalService.resendVerification({ email: email });

      setResendSuccess(
        "Onay maili başarıyla gönderildi. Lütfen gelen kutunuzu kontrol edin.",
      );
    } catch (error) {
      console.error("Resend error:", error);
      setResendSuccess(
        "Mail gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
      );
    } finally {
      setIsResending(false);
    }
  };

  // Form submit handler (Güncellendi)
  const handleLoginSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      setStatus(null);
      setResendSuccess(""); // Yeni denemede başarı mesajını temizle

      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        role: "user",
        redirect: false,
      });

      if (res?.ok) {
        window.location.href = targetPath;
        return;
      }

      if (res?.error) {
        // Backend'den gelen özel hata metnini yakalıyoruz
        if (res.error === "Lütfen önce e-posta adresinizi onaylayın.") {
          setStatus(res.error);
        } else {
          setStatus(
            res.error !== "CredentialsSignin"
              ? res.error
              : "E-posta veya şifre hatalı. Lütfen tekrar deneyiniz.",
          );
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setStatus("Giriş yaparken bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (
    values,
    { setSubmitting, setStatus },
  ) => {
    setSubmitting(true);
    try {
      const result = await generalService.userResetPasswordRequest(
        values.email,
      );
      setStatus({ type: result.status, message: result.message });
    } catch (error) {
      setStatus({
        type: "error",
        message: "Bir şeyler ters gitti. Lütfen daha sonra tekrar deneyin.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google/redirect`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${API_URL}/api/auth/facebook/redirect`;
  };

  const CustomInput = ({ field, form, ...props }) => {
    const hasError = form.errors[field.name] && form.touched[field.name];

    return (
      <input
        {...field}
        {...props}
        className={`w-full pl-12 ${
          props.type === "password" ? "pr-12" : "pr-4"
        } py-4 bg-gray-50 border-2 ${
          hasError
            ? "border-red-300 focus:border-red-500"
            : "border-gray-200 focus:border-blue-500"
        }  text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 transition-all duration-300 hover:border-gray-300`}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#FFD207] flex items-center justify-center p-4">
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <SuccesMessageComp
            open={successOpen}
            message={modalMessage}
            onClose={() => setSuccessOpen(false)}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={forgotPassword ? "forgot" : "login"}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden"
            >
              <div className="text-start mb-5">
                <h2 className="text-3xl font-bold text-black mb-2">
                  {forgotPassword ? "Şifre Sıfırla" : "Giriş Yap"}
                </h2>
              </div>

              {!forgotPassword && (
                <>
                  <div className="space-y-3 mb-4">
                    <button
                      onClick={handleGoogleLogin}
                      type="button"
                      className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-4 px-6 hover:border-gray-300 hover:shadow-md transition-all duration-300 font-medium group"
                    >
                      <FcGoogle size={24} />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        Google ile Giriş Yap
                      </span>
                    </button>

                    <button
                      onClick={handleFacebookLogin}
                      type="button"
                      className="flex items-center w-full justify-center gap-2 bg-white text-gray-700 py-4 px-4 hover:border-gray-300 hover:shadow-md transition-all duration-300 font-medium group"
                    >
                      <FaFacebookF color="#1877F2" size={20} />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        Facebook ile Giriş Yap
                      </span>
                    </button>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="flex-1 h-px bg-gray-900"></div>
                    <span className="px-4 text-black text-sm font-medium">
                      veya
                    </span>
                    <div className="flex-1 h-px bg-gray-900"></div>
                  </div>
                </>
              )}

              {!forgotPassword ? (
                <Formik
                  initialValues={initialValues}
                  validationSchema={loginValidationSchema}
                  onSubmit={handleLoginSubmit}
                >
                  {({ isSubmitting, status, touched, errors, values }) => (
                    <Form className="space-y-6">
                      {/* --- YENİ EKLENEN TASARIM ALANI --- */}
                      {status ===
                      "Lütfen önce e-posta adresinizi onaylayın." ? (
                        <div className="space-y-4">
                          {/* 1. Görseldeki Hata Kutusu */}
                          <div className="flex items-center gap-3 bg-white border-l-4 border-red-500 text-red-600 px-4 py-4 shadow-sm">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 flex-shrink-0"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.721-1.36 3.486 0l6.518 11.6A1.75 1.75 0 0116.518 17H3.482a1.75 1.75 0 01-1.743-2.301l6.518-11.6zM10 7a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0v-3.5A.75.75 0 0010 7zm0 6a1 1 0 100 2 1 1 0 000-2z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="font-medium">
                              Lütfen önce e-posta adresinizi onaylayın.
                            </span>
                          </div>

                          {/* 2. Görseldeki Tekrar Gönder Butonu */}
                          <button
                            type="button"
                            onClick={() =>
                              handleResendVerification(values.email)
                            }
                            disabled={isResending}
                            className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 py-4 px-4 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300 font-semibold"
                          >
                            {isResending ? (
                              <Loader2
                                className="animate-spin text-black"
                                size={20}
                              />
                            ) : (
                              <Mail className="text-black" size={20} />
                            )}
                            {isResending
                              ? "Gönderiliyor..."
                              : "Onay Mailini Tekrar Gönder"}
                          </button>

                          {/* Başarı veya Hata Geri Dönüşü */}
                          {resendSuccess && (
                            <div
                              className={`text-sm font-medium text-center ${resendSuccess.includes("hata") ? "text-red-600" : "text-green-700"}`}
                            >
                              {resendSuccess}
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Eski Normal Hata Gösterimi */
                        ((status &&
                          status !==
                            "Lütfen önce e-posta adresinizi onaylayın.") ||
                          (touched.email && errors.email) ||
                          (touched.password && errors.password)) && (
                          <div className="flex items-start gap-3 bg-white border-l-4 border-red-500 text-red-700 px-4 py-3 mt-2 ">
                            <div className="flex-shrink-0 mt-0.5">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-red-500 mt-0.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8.257 3.099c.765-1.36 2.721-1.36 3.486 0l6.518 11.6A1.75 1.75 0 0116.518 17H3.482a1.75 1.75 0 01-1.743-2.301l6.518-11.6zM10 7a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0v-3.5A.75.75 0 0010 7zm0 6a1 1 0 100 2 1 1 0 000-2z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div className="text-sm leading-relaxed space-y-1">
                              {status && <div>{status}</div>}
                              {touched.email && errors.email && (
                                <div>{errors.email}</div>
                              )}
                              {touched.password && errors.password && (
                                <div>{errors.password}</div>
                              )}
                            </div>
                          </div>
                        )
                      )}

                      <div className="relative mt-2">
                        <Mail
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <Field
                          name="email"
                          component={CustomInput}
                          type="email"
                          placeholder="E-posta adresiniz"
                        />
                      </div>

                      <div className="relative">
                        <Lock
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <Field
                          name="password"
                          component={CustomInput}
                          type={showPassword ? "text" : "password"}
                          placeholder="Şifreniz"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-gray-700 text-sm">
                            Beni hatırla
                          </span>
                        </label>

                        <button
                          type="button"
                          onClick={() => setForgotPassword(true)}
                          className="text-black text-sm font-medium transition-colors cursor-pointer"
                        >
                          Şifremi unuttum
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full cursor-pointer bg-black hover:bg-white focus:bg-white focus:text-black hover:text-black text-white py-4 px-6 font-semibold focus:outline-none focus:ring-0 flex justify-center items-center group transition-colors duration-300"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin mr-2" size={20} />
                            Giriş yapılıyor...
                          </>
                        ) : (
                          <>
                            Giriş Yap
                            <ArrowRight
                              className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                              size={20}
                            />
                          </>
                        )}
                      </button>
                    </Form>
                  )}
                </Formik>
              ) : (
                <Formik
                  initialValues={{ email: "" }}
                  validationSchema={forgotPasswordValidationSchema}
                  onSubmit={handleForgotPasswordSubmit}
                >
                  {({ isSubmitting, status, errors, touched }) => (
                    <Form className="space-y-6">
                      {(status || (touched.email && errors.email)) && (
                        <div
                          className={`flex items-start gap-3 bg-white border-l-4 px-4 py-3 mt-2 ${
                            status?.type === "success"
                              ? "border-green-500 text-green-700"
                              : "border-red-500 text-red-700"
                          }`}
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            {status?.type === "success" ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-green-500 mt-0.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-red-500 mt-0.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8.257 3.099c.765-1.36 2.721-1.36 3.486 0l6.518 11.6A1.75 1.75 0 0116.518 17H3.482a1.75 1.75 0 01-1.743-2.301l6.518-11.6zM10 7a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0v-3.5A.75.75 0 0010 7zm0 6a1 1 0 100 2 1 1 0 000-2z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="text-sm leading-relaxed space-y-1">
                            {status && <div>{status.message || status}</div>}
                            {touched.email && errors.email && (
                              <div>{errors.email}</div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="relative">
                        <Mail
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <Field
                          name="email"
                          component={CustomInput}
                          type="email"
                          placeholder="E-postanızı girin"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-black hover:bg-white hover:text-black text-white py-4 px-6 font-semibold flex justify-center items-center space-x-2"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin" size={20} />
                        ) : (
                          "Şifre Sıfırlama Linkini Gönder"
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setForgotPassword(false)}
                        className="w-full mt-2 text-center text-black underline cursor-pointer scale-105 transition-all"
                      >
                        Girişe Dön
                      </button>
                    </Form>
                  )}
                </Formik>
              )}

              <div className="text-center mt-8">
                <p className="text-gray-900">
                  Hesabınız yok mu?{" "}
                  <Link
                    href="/register"
                    className="relative font-bold inline-block after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Kayıt ol
                  </Link>
                </p>
              </div>

              <div className="text-center mt-2">
                <p className="text-gray-900">
                  Are you an instructor?{" "}
                  <Link
                    href="/instructor-login"
                    className="relative font-bold inline-block after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Log In
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
              <div className="text-center mt-6">
                <p className="text-xs text-gray-800">
                  Giriş yaparak{" "}
                  <Link
                    href="/kullanici-sozlesmesi"
                    className="text-black transition-colors"
                  >
                    Kullanım Şartları
                  </Link>{" "}
                  ve{" "}
                  <Link href="/kvkk" className="text-black transition-colors">
                    Gizlilik Politikası
                  </Link>
                  {"'nı kabul etmiş olursunuz."}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Login;

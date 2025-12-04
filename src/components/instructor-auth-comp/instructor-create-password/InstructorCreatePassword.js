"use client";

import React, { useEffect, useState } from "react";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import instructorPanelService from "../../../utils/axios/instructorPanelService";
import { useRouter, useParams } from "next/navigation";
import LoadingSimple from "../../../components/loading/LoadingSimple";

const CreatePasswordPage = () => {
  const params = useParams();
  const token = params?.token;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null); // {type: "error"|"success", message: "..."}
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const checkTokenStatus = async (token) => {
    if (!token) {
      setStatus({
        type: "error",
        message: "Invalid link. Please contact admin.",
      });
      setLoading(false);
      return;
    }

    try {
      const result = await instructorPanelService.checkResetPasswordStatus(
        token
      );

      if (result.status === "success") {
        setLoading(false); // token geçerli, form gösterilebilir
      } else {
        setStatus({
          type: "error",
          message: result.message || "This link is invalid or expired.",
        });
        setLoading(false);
      }
    } catch (err) {
      console.error("Check token error:", err);
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) checkTokenStatus(token);
  }, [token]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await instructorPanelService.resetInstructorPasswordWithToken(
        {
          token,
          password: values.password,
        }
      );

      if (res.status === "success") {
        console.log("testtt");
        setStatus({
          type: "success",
          message: "Password successfully created! Redirecting to login...",
        });
        setTimeout(() => router.push("/instructor-login"), 2000);
      } else {
        setStatus({
          type: "error",
          message: res.message || "Something went wrong. Try again.",
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Something went wrong. Try again." });
    } finally {
      setSubmitting(false);
    }
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
        } text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 transition-all duration-300 hover:border-gray-300`}
      />
    );
  };

  if (loading) return <LoadingSimple />;

  // Token geçersizse
  if (status?.type === "error" && !loading) {
    return (
      <div className="min-h-screen bg-[#FFD207] flex flex-col items-center justify-center p-4">
        <div className="flex items-start gap-3 bg-white border-l-4 border-red-500 text-red-700 px-4 py-3 mt-2 max-w-md w-full">
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
          <div className="text-sm leading-relaxed">{status.message}</div>
        </div>

        <button
          className="mt-5 w-full max-w-md bg-black hover:bg-white hover:text-black text-white py-4 px-6 font-semibold flex justify-center items-center space-x-2"
          onClick={() => router.push("/instructor-login")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Formu göster
  return (
    <div className="min-h-screen bg-[#FFD207] flex items-center justify-center p-4">
      <div className="lg:w-1/2 flex flex-col items-center justify-center p-2 w-full max-w-md">
        <div className="text-start w-full mb-5">
          <h2 className="text-3xl font-bold text-black mb-2">
            Create Password
          </h2>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form className="space-y-6 w-full">
              {/* Status Mesajları */}
              {(status ||
                (touched.password && errors.password) ||
                (touched.confirmPassword && errors.confirmPassword)) && (
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
                    {status && <div>{status.message}</div>}
                    {touched.password && errors.password && (
                      <div>{errors.password}</div>
                    )}
                    {touched.confirmPassword && errors.confirmPassword && (
                      <div>{errors.confirmPassword}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Field
                  name="password"
                  component={CustomInput}
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Field
                  name="confirmPassword"
                  component={CustomInput}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black hover:bg-white hover:text-black text-white py-4 px-6 font-semibold flex justify-center items-center space-x-2"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Create Password"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreatePasswordPage;

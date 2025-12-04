// api/fetchQuestions.js
import axiosInstance from "./axiosInstance";
import axiosNoLogout from "./axiosNoLogout";

//Instructor paneli için genel servisler

const registerEmailExist = async (email) => {
  const response = await axiosInstance.post("/api/instructor/check-email", {
    email,
  });
  return response.data;
};

const resetInstructorPassword = async (email) => {
  const response = await axiosInstance.post("/api/instructor/forgot-password", {
    email,
  });
  return response.data;
};

const checkResetPasswordStatus = async (token) => {
  const response = await axiosInstance.post(
    "/api/instructor/check-reset-password",
    {
      token,
    }
  );
  return response.data;
};
const resetInstructorPasswordWithToken = async (values) => {
  const response = await axiosInstance.post(
    "/api/instructor/reset-password",
    values
  );
  return response.data;
};
const getInstructorProfile = async () => {
  const response = await axiosInstance.get("/api/instructor-profile");
  return response.data;
};

const getPrograms = async (lang = "tr") => {
  // Header'ı burada ekliyoruz
  const response = await axiosInstance.get("/api/programs", {
    headers: {
      "Accept-Language": lang, // 'tr' veya 'en'
    },
  });
  return response.data;
};

const getInstructorProfileUpdate = async (data) => {
  const response = await axiosInstance.post("/api/instructor-profile", data, {
    headers: {
      "Content-Type": "multipart/form-data", // ⚠ Genellikle axios bunu otomatik ayarlar
    },
  });
  return response.data;
};
const getMySessions = async () => {
  const response = await axiosInstance.get("/api/get-my-sessions");
  return response.data;
};
const getMySessionsActive = async () => {
  const response = await axiosInstance.get("/api/get-my-sessions-active");
  return response.data;
};
const getMySessionUsers = async (id) => {
  const response = await axiosInstance.get(
    `/api/get-course-session-users/${id}`
  );
  return response.data;
};
//contactinfo için servis
const getContactInfo = async () => {
  const response = await axiosInstance.get("/api/instructor-contact-info");
  return response.data;
};

//contactinfo için UPDATE servis
const getContactInfoUpdate = async (data) => {
  const response = await axiosInstance.put(
    "/api/instructor-contact-info",
    data
  );
  return response.data;
};

//educationinfo için  servis
const getEducationInfo = async () => {
  const response = await axiosInstance.get("/api/instructor-education-info");
  return response.data;
};
//educationinfo için post  servis
const postEducationSave = async (data) => {
  return axiosInstance.post("/api/instructor-education-info", data, {
    headers: {
      "Content-Type": "multipart/form-data", // ⚠ Genellikle axios bunu otomatik ayarlar
    },
  });
};

// educationUpdate
const getEducationUpdate = async (data, id) => {
  const response = await axiosInstance.post(
    `/api/instructor-education-info/${id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data", // ⚠ Genellikle axios bunu otomatik ayarlar
      },
    }
  );
  return response.data;
};

//certificate için Info  servis
const getCertificateInfo = async () => {
  const response = await axiosInstance.get("/api/instructor-certificate-info");
  return response.data;
};
//certificate için post  servis
const postCertificateInfo = async (data) => {
  return axiosInstance.post("/api/instructor-certificate-info", data, {
    headers: {
      "Content-Type": "multipart/form-data", // ⚠ Genellikle axios bunu otomatik ayarlar
    },
  });
};
// CertificateUpdate
const getCertificateUpdate = async (data, id) => {
  const response = await axiosInstance.post(
    `/api/instructor-certificate-info/${id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data", // ⚠ Genellikle axios bunu otomatik ayarlar
      },
    }
  );
  return response.data;
};

//language için Info  servis
const getLanguageInfo = async () => {
  const response = await axiosInstance.get("/api/instructor-language-info");
  return response.data;
};

//language için post  servis
const postLanguageInfo = async (data) => {
  return axiosInstance.post("/api/instructor-language-info", data);
};

// languageUpdate
const getLanguageUpdate = async (data) => {
  const response = await axiosInstance.put(
    "/api/instructor-language-info/1",
    data
  );
  return response.data;
};
const confirmCourseUser = async (data) => {
  const response = await axiosInstance.post("/api/confirm-course-user", data);
  return response.data;
};

const instructorService = {
  confirmCourseUser,
  getLanguageUpdate,
  postLanguageInfo,
  getLanguageInfo,
  getCertificateUpdate,
  postCertificateInfo,
  getEducationUpdate,
  getCertificateInfo,
  postEducationSave,
  getEducationInfo,
  getContactInfoUpdate,
  getContactInfo,
  getInstructorProfile,
  getMySessions,
  getMySessionUsers,
  getInstructorProfileUpdate,
  resetInstructorPassword,
  checkResetPasswordStatus,
  resetInstructorPasswordWithToken,
  registerEmailExist,
  getPrograms,
  getMySessionsActive,
};
export default instructorService;

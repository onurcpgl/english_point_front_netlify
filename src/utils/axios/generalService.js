// api/fetchQuestions.js
import axiosInstance from "./axiosInstance";

//User forget password
const userChangePassword = async (values) => {
  const response = await axiosInstance.post(
    "/api/user/change-password",
    values
  );
  return response.data;
};
const userResetPasswordRequest = async (email) => {
  const response = await axiosInstance.post(
    "/api/user/request-reset-password",
    {
      email,
    }
  );
  return response.data;
};

const userResetPassword = async (values) => {
  const response = await axiosInstance.post("/api/user/reset-password", values);
  return response.data;
};

const userCheckResetPasswordStatus = async (token) => {
  const response = await axiosInstance.post(
    "/api/user/check-reset-password-status",
    {
      token,
    }
  );
  return response.data;
};

const fetchQuestions = async () => {
  const response = await axiosInstance.get("/api/get-start-questions");
  return response.data;
};
const getMessage = async () => {
  const response = await axiosInstance.get("/api/user/messages");
  return response.data;
};
const getMessageAsMarker = async (id) => {
  const response = await axiosInstance.get(
    `/api/user/messages-markasread/${id}`
  );
  return response.data;
};
const saveAnswers = async (answers) => {
  const response = await axiosInstance.post("/api/save-question-answers", {
    answers,
  });
  return response.data;
};

const getByAnswerQuestion = async (uniq_id) => {
  const response = await axiosInstance.get(
    `/api/get-by-question-answers/${uniq_id}`
  );
  return response.data;
};

//register instructor
const registerInstructor = async (instrocturRegisterValue) => {
  const response = await axiosInstance.post(
    "/api/instructors",
    instrocturRegisterValue,
    {
      headers: {
        "Content-Type": "multipart/form-data", // axios bunu genellikle otomatik ayarlar
      },
    }
  );
  return response.data;
};

const register = async (values) => {
  const response = await axiosInstance.post("/api/register", {
    values,
  });
  return response.data;
};

const login = async (values) => {
  const response = await axiosInstance.post("/api/login", {
    values,
  });
  return response.data;
};

const googleSignup = async () => {
  const response = await axiosInstance.get("/api/auth/google/redirect");
  return response.data;
};
const facebookSignup = async () => {
  const response = await axiosInstance.get("/api/auth/facebook/redirect");
  return response.data;
};

//Eğitmenler
const getInstructors = async () => {
  const response = await axiosInstance.get("/api/instructors");
  return response.data;
};

//Eğitimler
const getCourseSession = async () => {
  const response = await axiosInstance.get("/api/get-course-sessions");
  return response.data;
};
const getCourseSessionById = async (id) => {
  const response = await axiosInstance.get(`/api/get-course-sessions/${id}`);
  return response.data;
};
const getCourseSessionSingle = async (id) => {
  const response = await axiosInstance.get(
    `/api/get-course-session-single/${id}`
  );
  return response.data;
};

const getCourseSessionQuotaInfo = async () => {
  const response = await axiosInstance.get("/api/get-course-quota-info");
  return response.data;
};

//Eğitim Kategorileri
const getCourseCategories = async () => {
  const response = await axiosInstance.get("/api/get-course-categories");
  return response.data;
};

//User bilgileri
const getUserInfo = async () => {
  const response = await axiosInstance.get("/api/user/profile");
  return response.data;
};

// User Profile güncelleme
const updateUserProfile = async (profileData) => {
  const response = await axiosInstance.post(
    "/api/user/profile-update",
    profileData,
    {
      headers: {
        "Content-Type": "multipart/form-data", // ⚠ Genellikle axios bunu otomatik ayarlar
      },
    }
  );
  return response.data;
};

//Adress apileri
const getMyAdresses = async () => {
  const response = await axiosInstance.get("/api/addresses");
  return response.data;
};
const storeAdresses = async (addressInfo) => {
  const response = await axiosInstance.post("/api/addresses", addressInfo);
  return response.data;
};
const deleteAdresses = async (addressId) => {
  const response = await axiosInstance.delete(`/api/addresses/${addressId}`);
  return response.data;
};
const updatedAdress = async (addressInfo) => {
  const response = await axiosInstance.post(
    "/api/addresses-update",
    addressInfo
  );
  return response.data;
};
const saveMainAdres = async (mainAdressId) => {
  const response = await axiosInstance.post("/api/addresses-main", {
    id: mainAdressId, // obje içinde id olarak gönderiyoruz
  });
  return response.data;
};
//Cafeler
const getCafes = async () => {
  const response = await axiosInstance.get("/api/get-cafes");
  return response.data;
};

//Sepet servisleri
// Session Basket APIs
export const getBasket = async () => {
  const response = await axiosInstance.get("/api/basket");
  return response.data;
};

export const updatedBasket = async (basket_id) => {
  const response = await axiosInstance.post("/api/basket/update", {
    basket_id,
  });
  return response.data;
};

export const addToBasket = async (course_session_id) => {
  const response = await axiosInstance.post("/api/basket/add", {
    course_session_id,
  });
  return response.data;
};

export const removeFromBasket = async (product_id) => {
  const response = await axiosInstance.post("/api/basket/remove", {
    product_id,
  });
  return response.data;
};

export const clearBasket = async (basket_id) => {
  const response = await axiosInstance.post("/api/basket/clear", {
    basket_id,
  });
  return response.data;
};

//User session
export const getUserSession = async () => {
  const response = await axiosInstance.get("/api/user/my-session");
  return response.data;
};

export const sendEmailCode = async () => {
  const response = await axiosInstance.post("/api/email/send-current");
  return response.data;
};

export const sendResendCode = async () => {
  const response = await axiosInstance.post("/api/email/resend-new");
  return response.data;
};
export const checkCancelStatus = async (courseSessionUserId) => {
  const response = await axiosInstance.get(
    `/api/course-sessions/check-cancel-status/${courseSessionUserId}`
  );
  return response.data;
};
export const canceledCourseByUser = async (courseSessionId, value) => {
  const response = await axiosInstance.post(
    `/api/course-sessions/${courseSessionId}/cancel`,
    value
  );
  return response.data;
};
const generalService = {
  checkCancelStatus,
  getCourseSessionSingle,
  canceledCourseByUser,
  sendEmailCode,
  sendResendCode,
  updateUserProfile,
  getUserSession,
  addToBasket,
  saveMainAdres,
  getBasket,
  updatedBasket,
  clearBasket,
  removeFromBasket,
  getCafes,
  storeAdresses,
  getMyAdresses,
  updatedAdress,
  deleteAdresses,
  getCourseCategories,
  getUserInfo,
  fetchQuestions,
  saveAnswers,
  getCourseSession,
  registerInstructor,
  getInstructors,
  register,
  googleSignup,
  facebookSignup,
  getByAnswerQuestion,
  login,
  userResetPasswordRequest,
  userResetPassword,
  userCheckResetPasswordStatus,
  userChangePassword,
  getCourseSessionQuotaInfo,
  getCourseSessionById,
  getMessage,
  getMessageAsMarker,
};
export default generalService;

import axiosInstance from "../utils/axiosClient";

const login = async (value) => {
    const result = await axiosInstance.post("login", value);
    return result;
};

// 1. YENİ EKLENEN LOGOUT FONKSİYONU
const logout = async () => {
    try {
        // Genellikle sunucu, token'ı Authorization header'dan okur ve oturumu sonlandırır.
        const result = await axiosInstance.post("logout");
        return result;
    } catch (error) {
        // Logout işlemi başarısız olsa bile (örneğin token zaten silinmişse),
        // Client tarafında temizleme işleminin devam etmesi için hatayı yoksayabiliriz.
        console.error("Logout API call failed:", error);
        // İsteğin başarılı sayılması için bir Promise döndürmek faydalı olabilir.
        return { success: false, error: error.response?.data };
    }
};

const getAdminInstructor = async () => {
    const result = await axiosInstance.get("admin-instructor", {
        headers: { "Content-Type": "application/json" },
    });
    return result;
};
const getAdminInstructorDetail = async (id) => {
    const result = await axiosInstance.get(`/instructors/${id}`, {
        headers: { "Content-Type": "application/json" },
    });
    return result;
};
const postAdminProfile = (value) => {
    return axiosInstance
        .post(`/instructor-profile`, value)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error.response;
        });
};
const getAdminInstructorCertificate = async () => {
    const result = await axiosInstance.get("instructor-certificate-info", {
        headers: { "Content-Type": "application/json" },
    });
    return result;
};
const getAdminLanguageInfo = async () => {
    const result = await axiosInstance.get("instructor-language-info", {
        headers: { "Content-Type": "application/json" },
    });
    return result;
};

const getAdminEducationInfo = async () => {
    const result = await axiosInstance.get("instructor-education-info", {
        headers: { "Content-Type": "application/json" },
    });
    return result;
};
const getAdminCafesInfo = async () => {
    const result = await axiosInstance.get("cafes", {
        headers: { "Content-Type": "application/json" },
    });
    return result;
};
const getCafe = async (id) => {
    const result = await axiosInstance.get(`/cafes/${id}`);
    return result;
};
const postAdminCafeUpdate = (id, value) => {
    return axiosInstance
        .post(`/cafes/${id}`, value)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error.response;
        });
};
const deleteAdminCafe = (id) => {
    return axiosInstance
        .delete(`/admin/cafes/${id}`)
        .then((response) => response.data)
        .catch((error) => error.response);
};
const postAdminCafeCreate = async (data) => {
    try {
        const response = await axiosInstance.post("/cafes", data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating cafe:", error);
        return error.response?.data || null;
    }
};

// YENİ EKLENEN DERS OTURUMU FONKSİYONLARI
const getCourseSessionResources = async () => {
    const result = await axiosInstance.get("course-sessions/resources");
    return result;
};
const getCourseSessions = async () => {
    const result = await axiosInstance.get("course-sessions");
    return result;
};
const postCourseSession = (value) => {
    return axiosInstance.post("course-sessions", value);
};
const getCourseSession = (id) => {
    return axiosInstance.get(`course-sessions/${id}`);
};
const updateCourseSession = (id, value) => {
    return axiosInstance.put(`course-sessions/${id}`, value);
};
const deleteCourseSession = (id) => {
    return axiosInstance.delete(`course-sessions/${id}`);
};

const getUsers = async () => {
    const result = await axiosInstance.get("/users");
    return result;
};
const createUser = async (value) => {
    const result = await axiosInstance.post("/users", value);
    return result;
};

const getUser = async (id) => {
    const result = await axiosInstance.get(`/users/${id}`);
    return result;
};

const updateUser = async (id, value) => {
    const result = await axiosInstance.put(`/users/${id}`, value);
    return result;
};

const deleteUser = async (id) => {
    const result = await axiosInstance.delete(`/users/${id}`);
    return result;
};

// --- PROGRAM (PROGRAMS) YÖNETİMİ FONKSİYONLARI

const getPrograms = async () => {
    const result = await axiosInstance.get("programs");
    return result;
};

const postProgram = (value) => {
    return axiosInstance.post("programs", value, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

const updateProgram = (id, value) => {
    // Laravel rotasına göre, güncelleme için POST kullanılıyor (dosya yükleme nedeniyle)
    return axiosInstance.post(`programs/${id}`, value, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

const deleteProgram = (id) => {
    return axiosInstance.delete(`programs/${id}`);
};
const getProgramDetail = async (id) => {
    const result = await axiosInstance.get(`programs/${id}`);
    return result;
};

const getStartQuestions = async () => {
    const result = await axiosInstance.get("start-questions");
    return result;
};

const postStartQuestion = (value) => {
    return axiosInstance.post("start-questions", value);
};

const updateStartQuestion = (id, value) => {
    return axiosInstance.put(`start-questions/${id}`, value);
};

const deleteStartQuestion = (id) => {
    return axiosInstance.delete(`start-questions/${id}`);
};
const getAnswerDetailById = async (id) => {
    const result = await axiosInstance.get(`get-answer-detail/${id}`);
    return result;
};
const getPayments = async (params) => {
    const result = await axiosInstance.get("payments", {
        params: params, // Arama, sayfalama veya filtreleme parametreleri için
        headers: { "Content-Type": "application/json" },
    });
    return result;
};
const getPaymentDetail = async (id) => {
    const result = await axiosInstance.get(`payments/${id}`, {
        headers: { "Content-Type": "application/json" },
    });
    return result;
};

// 4. Ödeme Güncelleme (Update)
const updatePayment = async (id, value) => {
    // Laravel route: payments/{id} (PUT veya PATCH)
    const result = await axiosInstance.put(`payments/${id}`, value, {
        headers: { "Content-Type": "application/json" },
    });
    return result;
};

const getGoogleCafes = async (params) => {
    const result = await axiosInstance.get("google-cafes", {
        params: params, // Filtreleme veya sayfalama için
        headers: { "Content-Type": "application/json" },
    });
    return result;
};

// Tekil Google Cafe detayı (Show)
const getGoogleCafeDetail = async (id) => {
    const result = await axiosInstance.get(`google-cafes/${id}`, {
        headers: { "Content-Type": "application/json" },
    });
    return result;
};
const getUserDetail = async (id) => {
    return await axiosInstance.get(`/users/${id}`);
};
const getCourseSessionDetail = async (id) => {
    const result = await axiosInstance.get(`course-sessions/${id}/details`);
    return result;
};

const getProgramCategory = async (id) => {
    const result = await axiosInstance.get(`program-categories`);
    return result;
};

const getProgramCategoryById = async (id) => {
    const result = await axiosInstance.get(`program-categories/${id}`);
    return result;
};
const getProgramCategorySave = async (value) => {
    const result = await axiosInstance.post(`program-categories`, value);
    return result;
};

const getProgramCategoryUpdate = async (id, value) => {
    const result = await axiosInstance.post(`program-categories/${id}`, value);
    return result;
};
// Kategorileri Listeleme (Opsiyonel olarak parametre alabilir)
const getProgramBusinessCategories = async (params) => {
    const result = await axiosInstance.get("program-business-categories", {
        params: params,
    });
    return result;
};

// Yeni Kategori Ekleme
const postProgramBusinessCategory = (value) => {
    return axiosInstance.post("program-business-categories", value);
};

// Kategori Detayı Getirme (ID'ye göre)
const getProgramBusinessCategoryById = async (id) => {
    const result = await axiosInstance.get(`program-business-categories/${id}`);
    return result;
};

// Kategori Güncelleme
const updateProgramBusinessCategory = (id, value) => {
    return axiosInstance.put(`program-business-categories/${id}`, value);
};

// Kategori Silme
const deleteProgramBusinessCategory = (id) => {
    return axiosInstance.delete(`program-business-categories/${id}`);
};
const generalServiceFonk = {
    getProgramCategory,
    getProgramCategoryUpdate,
    getProgramCategorySave,
    getProgramCategoryById,
    getCourseSessionDetail,
    getUserDetail,
    getGoogleCafes,
    getGoogleCafeDetail,
    getPaymentDetail,
    updatePayment,
    getPayments,
    getAdminInstructor,
    getCafe,
    getAdminInstructorDetail,
    postAdminProfile,
    getAdminInstructorCertificate,
    getAdminEducationInfo,
    getAdminCafesInfo,
    postAdminCafeUpdate,
    deleteAdminCafe,
    postAdminCafeCreate,
    getAdminLanguageInfo,
    login,
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    logout,
    getCourseSessionResources,
    getCourseSessions,
    postCourseSession,
    getCourseSession,
    updateCourseSession,
    deleteCourseSession,
    getPrograms,
    postProgram,
    updateProgram,
    deleteProgram,
    getStartQuestions,
    postStartQuestion,
    updateStartQuestion,
    deleteStartQuestion,
    getAnswerDetailById,
    getProgramDetail,
    getProgramBusinessCategories,
    postProgramBusinessCategory,
    getProgramBusinessCategoryById,
    updateProgramBusinessCategory,
    deleteProgramBusinessCategory,
};
export default generalServiceFonk;

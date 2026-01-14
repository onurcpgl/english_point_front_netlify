import { Routes, Route } from "react-router-dom";
import RootLayout from "../Layouts/Rootlayout";
import GuestLayout from "../Layouts/GuestLayout";

// Sayfalar
import Login from "../../components/login/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import UserProfiles from "../pages/userprofiles/Userprofiles";
import Instructor from "../pages/instructor/Instructor";
import Cafes from "../pages/cafes/Cafes";
import Hakkimizda from "../../components/hakkimizda/Hakkimizda";
import Coursesessions from "../pages/coursesessions/Coursesessions";
import CafeEditPage from "../pages/cafes/cafeeditpage/CafeEditPage";
import Users from "../pages/users/Users";
import Programs from "../pages/cafes/programs/Programs";
import ProgramsSave from "../pages/cafes/programs/ProgramSave";

import Startquestions from "../pages/startquestions/Startquestions";
import InstructorDetail from "../pages/instructordetail/InstructorDetail";
import Payments from "../pages/payments/Payments";
import GoogleCafe from "../pages/googlecafe/GoogleCafe";
import Googlecafedetail from "../pages/googlecafedetail/Googlecafedetail";
import StartQuestionDetail from "../pages/startquestiondetail/StartQuestionDetail";
import Programdetail from "../pages/programsdetail/Programsdetail";
import SessionDetail from "../pages/sessiondetail/SessionDetail";
import Userdetail from "../pages/userdetail/Userdetail";
import ProgramCategory from "../pages/programCategory/ProgramCategory";
import ProgramCategoryDetail from "../pages/programCategory/ProgramCategoryDetail";
import ProgramCategorySave from "../pages/programCategory/ProgramCategorySave";

function AppRoute() {
    return (
        <Routes>
            <Route element={<RootLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<UserProfiles />} />
                <Route path="/hakkimizda" element={<Hakkimizda />} />
                <Route path="/instructor" element={<Instructor />} />
                <Route path="/cafes" element={<Cafes />} />
                <Route path="/users" element={<Users />} />
                <Route path="/programs" element={<Programs />} />
                <Route path="/programs/create" element={<ProgramsSave />} />

                <Route path="/course-sessions" element={<Coursesessions />} />
                <Route
                    path="/course-sessions/:id"
                    element={<SessionDetail />}
                />
                <Route path="/google-cafes" element={<GoogleCafe />} />
                <Route
                    path="/google-cafes/:id"
                    element={<Googlecafedetail />}
                />
                <Route
                    path="/start-questions/detail/:id"
                    element={<StartQuestionDetail />}
                />
                <Route
                    path="/programs/detail/:id"
                    element={<Programdetail />}
                />
                <Route path="/users/detail/:id" element={<Userdetail />} />
                <Route path="/start-questions" element={<Startquestions />} />
                <Route path="/cafes/edit/:cafeId" element={<CafeEditPage />} />
                <Route path="/program-category" element={<ProgramCategory />} />
                <Route
                    path="/program-category/create"
                    element={<ProgramCategorySave />}
                />
                <Route
                    path="/program-category/detail/:id"
                    element={<ProgramCategoryDetail />}
                />
                <Route path="/payments" element={<Payments />} />
                <Route path="/instructors/:id" element={<InstructorDetail />} />
            </Route>

            <Route element={<GuestLayout />}>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<div>Register Sayfası</div>} />
            </Route>

            <Route path="*" element={<div>404 Bulunamadı</div>} />
        </Routes>
    );
}

export default AppRoute;

import { Outlet, Route, Routes } from "react-router-dom";
import { AuthLayout } from "../../auth/components/AuthLayout";
import LoginForm from "../../auth/components/LoginUI";
import { RegisterUI } from "../../auth/components/RegisterUI";
import TodoList from "../../todo/components/TodoList";
import ImageUpload from "../../face-reg/components/ImageUpload";

import PageNotFound from "./PageNotFound";
import { PrivateComponent } from "../../auth/components/PrivateComponent";
import { MainLayout } from "./MainLayout";
import { DefaultSidebar } from "../../home/Sidebar";
import Dashboard from "../../home/pages/Dashboard";
import ECommerce from "../../home/pages/ECommerce";
import Profile from "../../home/pages/Profile";
import FaceControlPage from "../../face-reg/components/FaceHome";
import Register from "../../face-reg/register/component/Register";
import Recognize from "../../face-reg/recognize/component/Recognize";

export const MainRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<AuthLayout />}>
        <Route path="" element={<LoginForm />} />
      </Route>
      <Route path="/register" element={<AuthLayout />}>
        <Route path="" element={<RegisterUI />} />
      </Route>
      <Route
        path="/"
        element={
          // <PrivateComponent>
            <MainLayout>
                <div className="flex">
                  <DefaultSidebar />
                <div className="flex-1">
              <Outlet />
                </div>
              </div>
            </MainLayout>
          // </PrivateComponent>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/face-regconize" element={<FaceControlPage />}>
          <Route path="register" element={<Register />} />
          <Route path="recognize" element={<Recognize />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />

      <Route path="/inbox" element={<ECommerce />} />
      <Route path="/settings" element={<ECommerce />} />
      <Route path="/logout" element={<ECommerce />} />
    </Routes>
  );
};

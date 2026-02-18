import { Outlet, Route, Routes } from "react-router-dom";
import { AuthLayout } from "../../auth/components/AuthLayout";
import LoginForm from "../../auth/components/LoginUI";
import { RegisterUI } from "../../auth/components/RegisterUI";
import ForgotPasswordUI from "../../auth/components/ForgotPasswordUI";
import ResetPasswordUI from "../../auth/components/ResetPasswordUI";
import AcceptInvitationUI from "../../auth/components/AcceptInvitationUI";
import { PrivateComponent } from "../../auth/components/PrivateComponent";
import { AdminRoute } from "../../auth/components/AdminRoute";

import PageNotFound from "./PageNotFound";
import { MainLayout } from "./MainLayout";
import { DefaultSidebar } from "../../home/Sidebar";
import Dashboard from "../../home/pages/Dashboard";
import ECommerce from "../../home/pages/ECommerce";
import Profile from "../../home/pages/Profile";
import { Audit } from "../../home/pages/Audit";
import FaceControlPage from "../../face-reg/components/FaceHome";
import Register from "../../face-reg/register/component/Register";
import Recognize from "../../face-reg/recognize/component/Recognize";
import FaceRegRouteGuard from '../../face-reg/components/FaceRegRouteGuard';
import AdminDashboard from "../../admin/pages/AdminDashboard";
import UserManagement from "../../admin/pages/UserManagement";
import RoleManagement from "../../admin/pages/RoleManagement";

export const MainRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<AuthLayout />}>
        <Route path="" element={<LoginForm />} />
      </Route>
      <Route path="/register" element={<AuthLayout />}>
        <Route path="" element={<RegisterUI />} />
      </Route>
      <Route path="/forgot-password" element={<AuthLayout />}>
        <Route path="" element={<ForgotPasswordUI />} />
      </Route>
      <Route path="/reset-password" element={<AuthLayout />}>
        <Route path="" element={<ResetPasswordUI />} />
      </Route>
      <Route path="/accept-invitation" element={<AuthLayout />}>
        <Route path="" element={<AcceptInvitationUI />} />
      </Route>
      <Route
        path="/"
        element={
          <PrivateComponent>
            <MainLayout>
              <div className="flex w-full overflow-hidden">
                <DefaultSidebar />
                <div className="flex-1 min-w-0 w-full overflow-hidden">
                  <Outlet />
                </div>
              </div>
            </MainLayout>
          </PrivateComponent>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/audit" element={<AdminRoute><Audit /></AdminRoute>} />
        <Route path="/face-regconize" element={<FaceControlPage />}>
          <Route element={<FaceRegRouteGuard type="register" />}>
            <Route path="register" element={<Register />} />
          </Route>
          <Route element={<FaceRegRouteGuard type="recognize" />}>
            <Route path="recognize" element={<Recognize />} />
          </Route>
        </Route>
        <Route path="/admin" element={<AdminRoute><Outlet /></AdminRoute>}>
          <Route path="" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="roles" element={<RoleManagement />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />

      {/*<Route path="/inbox" element={<ECommerce />} />*/}
      {/*<Route path="/settings" element={<ECommerce />} />*/}
      <Route path="/logout" element={<ECommerce />} />
    </Routes>
  );
};

import { Outlet, Route, Routes } from "react-router-dom";
import { AuthLayout } from "../../auth/components/AuthLayout";
import LoginForm from "../../auth/components/LoginUI";
import { RegisterUI } from "../../auth/components/RegisterUI";

import PageNotFound from "./PageNotFound";
import { MainLayout } from "./MainLayout";
import { DefaultSidebar } from "../../home/Sidebar";
import Dashboard from "../../home/pages/Dashboard";
import ECommerce from "../../home/pages/ECommerce";
import Profile from "../../home/pages/Profile";

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
        <Route path="/e-commerce" element={<ECommerce />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />

      {/* <Route path="/inbox" element={<InboxComponent />} /> */}
      {/* <Route path="/settings" element={<SettingsComponent />} /> */}
      {/* <Route path="/logout" element={<LogoutComponent />} /> */}
    </Routes>
  );
};

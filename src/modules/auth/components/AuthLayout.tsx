import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-gray-50">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">AI</span>
        </div>
        <span className="text-gray-900 font-semibold text-lg">AI Platform</span>
      </div>
      <div className="container px-4 flex justify-center">
        <Outlet />
      </div>
    </div>
  );
};

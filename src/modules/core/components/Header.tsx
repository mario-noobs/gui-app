import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { LogOutIcon, UserCircleIcon, ChevronDownIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";

export const Header: React.FC = () => {
  const { profile, handleLogout } = useAuth();
  const navigate = useNavigate();

  const displayName =
    (profile?.first_name || "") +
    (profile?.last_name ? " " + profile.last_name : "") || "User";

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 w-full">
      <div className="w-full flex justify-between items-center">
        {/* Left - Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
          type="button"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <span className="hidden lg:block text-gray-900 font-semibold text-lg">
            AI Platform
          </span>
        </button>

        {/* Right - User controls */}
        <div className="flex items-center gap-3">
          <Menu as="div" className="relative">
            <MenuButton className="flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium">
                {profile?.first_name?.charAt(0) || "U"}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-gray-900 text-sm font-medium leading-tight">
                  {displayName}
                </p>
                <p className="text-gray-500 text-xs leading-tight">
                  {profile?.email}
                </p>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </MenuButton>

            <MenuItems className="absolute right-0 mt-1 w-56 rounded-lg bg-white border border-gray-200 shadow-lg focus:outline-none z-50">
              <div className="p-1">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-gray-900 text-sm font-medium">
                    {displayName}
                  </p>
                  <p className="text-gray-500 text-xs">{profile?.email}</p>
                </div>

                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => navigate("/profile")}
                      className={`${
                        focus ? "bg-gray-50" : ""
                      } flex w-full items-center px-3 py-2 text-sm text-gray-700 rounded-md mt-1`}
                    >
                      <UserCircleIcon className="mr-2 h-4 w-4 text-gray-400" />
                      Profile
                    </button>
                  )}
                </MenuItem>

                <div className="my-1 h-px bg-gray-100" />

                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={handleLogout}
                      className={`${
                        focus ? "bg-red-50" : ""
                      } flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:text-red-600 rounded-md`}
                    >
                      <LogOutIcon className="mr-2 h-4 w-4 text-gray-400" />
                      Sign out
                    </button>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </header>
  );
};

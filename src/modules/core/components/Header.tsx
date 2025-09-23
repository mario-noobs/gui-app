import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { LogOutIcon, UserCircleIcon, BellIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/logo.svg";
import { useAuth } from "../../auth/hooks/useAuth";

export const Header: React.FC = () => {
  const { profile, handleLogout } = useAuth();
  const navigate = useNavigate();
  return (

    <header className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <img
            onClick={() => navigate("/")}
            src={Logo}
            alt="Logo"
            className="h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity"
          />
          
          <nav className="hidden md:flex space-x-6">
            <a href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</a>
            <a href="/analytics" className="text-gray-300 hover:text-white transition-colors">Analytics</a>
            <a href="/reports" className="text-gray-300 hover:text-white transition-colors">Reports</a>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-300 hover:text-white rounded-full hover:bg-gray-700 transition-all">
            <BellIcon className="h-5 w-5" />
          </button>

          <Menu as="div" className="relative">
            <MenuButton className="flex items-center space-x-3 rounded-full p-1 hover:bg-gray-700 transition-all">
              <img
                src={profile?.avatar || Logo}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500"
              />
              <span className="text-gray-300 hidden md:block">{profile?.email}</span>
            </MenuButton>

            <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-gray-800 border border-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-2">
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => navigate("/profile")}
                      className={`${
                        active ? 'bg-gray-700' : ''
                      } group flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:text-white`}
                    >
                      <UserCircleIcon className="mr-3 h-5 w-5" />
                      Profile
                    </button>
                  )}
                </MenuItem>
                
                <div className="my-1 h-px bg-gray-700" />
                
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`${
                        active ? 'bg-gray-700' : ''
                      } group flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:text-white`}
                    >
                      <LogOutIcon className="mr-3 h-5 w-5" />
                      Logout
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

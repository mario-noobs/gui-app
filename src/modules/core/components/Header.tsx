import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { LogOutIcon, UserCircleIcon, BellIcon, ChevronDownIcon, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { motion } from "framer-motion";
import Logo from "../../../assets/logo.svg";

// Modern SVG logo (replace with your own if desired)
const ModernLogo = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="22" cy="22" r="22" fill="url(#paint0_linear)"/>
    <path d="M14 28C14 22 30 22 30 28" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="17.5" cy="18.5" r="2.5" fill="#fff"/>
    <circle cx="26.5" cy="18.5" r="2.5" fill="#fff"/>
    <defs>
      <linearGradient id="paint0_linear" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7C3AED"/>
        <stop offset="1" stopColor="#38BDF8"/>
      </linearGradient>
    </defs>
  </svg>
);

export const Header: React.FC = () => {
  const { profile, handleLogout } = useAuth();
  const navigate = useNavigate();

  const services = [
    {
      name: "Face Detection & Recognition",
      description: "AI-powered face detection",
      link: "/face-regconize",
      isAvailable: true,
      icon: "🤖",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      name: "Facemask Detection",
      description: "Safety compliance detection",
      link: "/face-mask",
      isAvailable: false,
      icon: "😷",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      name: "OCR Technology",
      description: "Text extraction from images",
      link: "/services/ocr",
      isAvailable: false,
      icon: "📄",
      gradient: "from-orange-500 to-red-600"
    }
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 px-0 py-3 shadow-2xl border-b border-purple-500/20 w-full"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-visible">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -top-1/4 -left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full flex justify-between items-center relative z-10 px-8 max-w-full">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center space-x-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="flex items-center space-x-3 group"
            type="button"
          >
            <div className="relative">
              <ModernLogo />
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 blur transition-all duration-300"></div>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-white font-bold text-2xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent tracking-wide">
                AI Platform
              </h1>
            </div>
          </motion.button>

          <nav className="hidden md:flex items-center space-x-8">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/dashboard"
              className="relative group px-4 py-2 text-gray-300 hover:text-white transition-all duration-300 font-medium"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Dashboard</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </motion.a>

            {/* Enhanced Services Dropdown */}
            <Menu as="div" className="relative">
              <MenuButton className="relative group flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white transition-all duration-300 font-medium">
                <Zap className="h-4 w-4" />
                <span>Services</span>
                <ChevronDownIcon className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </MenuButton>

              <MenuItems className="absolute left-0 mt-3 w-96 origin-top-left rounded-2xl bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border border-purple-200/60 shadow-2xl ring-1 ring-black/5 focus:outline-none z-50 overflow-hidden p-0">
                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-1 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-purple-500" />
                      AI Services
                    </h3>
                    <p className="text-purple-500 text-xs">AI-powered solutions for tomorrow</p>
                  </div>
                  <div className="border-b border-purple-100/60 mb-2" />
                  <div className="flex flex-col gap-2">
                    {services.map((service) => (
                      <MenuItem key={service.name}>
                        {({ focus }) => (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => {
                              if (service.isAvailable) {
                                navigate(service.link);
                              }
                            }}
                            disabled={!service.isAvailable}
                            className={`
                              flex w-full items-center gap-4 p-4 rounded-xl transition-all duration-200
                              ${focus && service.isAvailable ? 'bg-purple-100/60 dark:bg-slate-800/60' : ''}
                              ${!service.isAvailable ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                              group
                            `}
                          >
                            <span className={`p-2 rounded-lg bg-gradient-to-r ${service.gradient} text-white text-lg shadow-lg flex items-center justify-center`}>
                              {service.icon}
                            </span>
                            <span className="flex-1 text-left">
                              <span className={`block font-semibold text-base ${service.isAvailable ? 'text-slate-900 dark:text-white' : 'text-gray-400'}`}>{service.name}</span>
                              <span className="block text-xs text-purple-500 dark:text-purple-300 mt-0.5">{service.description}</span>
                            </span>
                            {service.isAvailable ? (
                              <span className="text-xs bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full font-semibold shadow-md ml-2">
                                ✨ Live
                              </span>
                            ) : (
                              <span className="text-xs bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full font-semibold shadow-md ml-2">
                                🚀 Coming Soon
                              </span>
                            )}
                          </motion.button>
                        )}
                      </MenuItem>
                    ))}
                  </div>
                </div>
              </MenuItems>
            </Menu>
          </nav>
        </div>

        {/* Right side - User controls */}
        <div className="flex items-center space-x-4">
          {/* Enhanced Notification Bell */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-3 text-gray-300 hover:text-white rounded-full hover:bg-purple-600/20 transition-all duration-300 group"
          >
            <BellIcon className="h-5 w-5" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          </motion.button>

          {/* Enhanced User Menu */}
          <Menu as="div" className="relative">
            <MenuButton className="flex items-center space-x-3 rounded-full p-1 hover:bg-purple-600/20 transition-all duration-300 group">
              <div className="relative">
                <img
                  src={profile?.avatar || Logo}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500 shadow-lg group-hover:ring-purple-400 transition-all duration-300"
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-0 group-hover:opacity-20 blur transition-all duration-300"></div>
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-white text-sm font-medium">{(profile?.first_name || "") + (profile?.last_name ? " " + profile.last_name : "") || "User"}</p>
                <p className="text-purple-300 text-xs">{profile?.email}</p>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-purple-300 group-hover:text-white group-hover:rotate-180 transition-all duration-300" />
            </MenuButton>

            <MenuItems className="absolute right-0 mt-3 w-64 origin-top-right rounded-xl bg-slate-800/95 backdrop-blur-xl border border-purple-500/20 shadow-2xl ring-1 ring-black/5 focus:outline-none overflow-hidden">
              <div className="p-2">
                <div className="px-4 py-3 border-b border-purple-500/20">
                  <p className="text-white font-medium text-sm">{(profile?.first_name || "") + (profile?.last_name ? " " + profile.last_name : "") || "Welcome"}</p>
                  <p className="text-purple-300 text-xs">{profile?.email}</p>
                </div>

                <MenuItem>
                  {({ focus }) => (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => navigate("/profile")}
                      className={`${
                        focus ? 'bg-slate-700/50' : ''
                      } group flex w-full items-center px-4 py-3 text-sm text-gray-300 hover:text-white rounded-lg m-1 transition-all duration-200`}
                    >
                      <UserCircleIcon className="mr-3 h-5 w-5 text-purple-400" />
                      <span>My Profile</span>
                    </motion.button>
                  )}
                </MenuItem>
                
                <div className="my-1 h-px bg-purple-500/20" />

                <MenuItem>
                  {({ focus }) => (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={handleLogout}
                      className={`${
                        focus ? 'bg-red-500/20' : ''
                      } group flex w-full items-center px-4 py-3 text-sm text-gray-300 hover:text-red-400 rounded-lg m-1 transition-all duration-200`}
                    >
                      <LogOutIcon className="mr-3 h-5 w-5 text-red-400" />
                      <span>Sign Out</span>
                    </motion.button>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </motion.header>
  );
};

import { Link, useLocation } from "react-router-dom";
import {
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Chip,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  UserCircleIcon,
  DocumentTextIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { HiOutlineMenuAlt2 } from "react-icons/hi";

export function DefaultSidebar() {
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: <PresentationChartBarIcon className="h-5 w-5" />,
      path: "/dashboard",
      badge: null,
      color: "blue",
    },
    {
      label: "Face Recognition",
      icon: <FaceSmileIcon className="h-5 w-5" />,
      path: "/face-regconize",
      badge: "Beta",
      color: "green",
    },
    {
      label: "Profile",
      icon: <UserCircleIcon className="h-5 w-5" />,
      path: "/profile",
      badge: null,
      color: "purple",
    },
    {
      label: "Audit",
      icon: <DocumentTextIcon className="h-5 w-5" />,
      path: "/audit",
      color: "orange",
    },
  ];

  return (
    <div className="h-full w-[18rem] min-w-[18rem] shadow-xl bg-white border-r border-gray-100">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="h-full flex flex-col"
      >
        {/* Sidebar Header - Modernized */}
        <div className="p-0 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 px-6 py-5"
          >
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-400 to-purple-400 shadow-md">
              <HiOutlineMenuAlt2 className="text-white text-xl" />
            </span>
            <div>
              <Typography
                variant="h5"
                className="text-gray-800 font-extrabold text-lg tracking-wide mb-0.5"
              >
                Navigation
              </Typography>
              <Typography className="text-purple-500 text-xs font-semibold uppercase tracking-wider">
                Main Menu
              </Typography>
            </div>
          </motion.div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 p-4 overflow-y-auto">
          <List className="space-y-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
              >
                <Link to={item.path}>
                  <ListItem
                    className={`
                      group relative overflow-hidden rounded-xl transition-all duration-300 mb-2
                      ${
                        isActiveRoute(item.path)
                          ? `bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 text-white shadow-lg transform scale-105`
                          : "hover:bg-gray-50 hover:shadow-md hover:scale-102 text-gray-700"
                      }
                    `}
                  >
                    {/* Background gradient for active state */}
                    {isActiveRoute(item.path) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl" />
                    )}

                    <div className="relative flex items-center justify-between w-full py-3 px-4">
                      <div className="flex items-center gap-4">
                        <ListItemPrefix
                          className={`
                            transition-all duration-300
                            ${
                              isActiveRoute(item.path)
                                ? "text-white"
                                : `text-${item.color}-500 group-hover:text-${item.color}-600`
                            }
                          `}
                        >
                          {item.icon}
                        </ListItemPrefix>
                        <Typography
                          className={`
                            font-medium transition-all duration-300
                            ${
                              isActiveRoute(item.path)
                                ? "text-white"
                                : "text-gray-700 group-hover:text-gray-900"
                            }
                          `}
                        >
                          {item.label}
                        </Typography>
                      </div>

                      {/* Badge */}
                      {item.badge && (
                        <Chip
                          value={item.badge}
                          size="sm"
                          className={`
                            text-xs px-2 py-1
                            ${
                              isActiveRoute(item.path)
                                ? "bg-white/20 text-white"
                                : `bg-${item.color}-100 text-${item.color}-700`
                            }
                          `}
                        />
                      )}
                    </div>

                    {/* Active indicator */}
                    {isActiveRoute(item.path) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white/30 rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </ListItem>
                </Link>
              </motion.div>
            ))}
          </List>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-4 border-t border-gray-100"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
            <Typography className="text-xs font-medium text-blue-800 mb-1">
              🚀 Pro Tip
            </Typography>
            <Typography className="text-xs text-blue-600">
              Use Face Recognition for quick and secure access to your account.
            </Typography>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

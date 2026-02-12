import { Link, useLocation } from "react-router-dom";
import {
  PresentationChartBarIcon,
  UserCircleIcon,
  DocumentTextIcon,
  FaceSmileIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../auth/hooks/useAuth";

export function DefaultSidebar() {
  const location = useLocation();
  const { isSuperAdmin } = useAuth();

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const allNavItems = [
    {
      label: "Dashboard",
      icon: PresentationChartBarIcon,
      path: "/dashboard",
      adminOnly: false,
    },
    {
      label: "Face Recognition",
      icon: FaceSmileIcon,
      path: "/face-regconize",
      adminOnly: false,
    },
    {
      label: "Profile",
      icon: UserCircleIcon,
      path: "/profile",
      adminOnly: false,
    },
    {
      label: "Audit Logs",
      icon: DocumentTextIcon,
      path: "/audit",
      adminOnly: true,
    },
    {
      label: "Admin",
      icon: ShieldCheckIcon,
      path: "/admin",
      adminOnly: true,
    },
  ];

  const navItems = allNavItems.filter(
    (item) => !item.adminOnly || isSuperAdmin()
  );

  return (
    <div className="h-full w-60 min-w-[15rem] bg-white border-r border-gray-200">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-200">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Menu
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const active = isActiveRoute(item.path);
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      active
                        ? "bg-blue-50 text-blue-700 border-l-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? "text-blue-600" : "text-gray-400"}`} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}

import { Link, useLocation } from "react-router-dom";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  PowerIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/solid";

export function DefaultSidebar() {
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: <PresentationChartBarIcon className="h-5 w-5" />,
      path: "/dashboard"
    },
    {
      label: "Face Recognition",
      icon: <FaceSmileIcon className="h-5 w-5" />,
      path: "/face-regconize"
    },
    {
      label: "Profile",
      icon: <UserCircleIcon className="h-5 w-5" />,
      path: "/profile"
    },
    {
      label: "Settings",
      icon: <Cog6ToothIcon className="h-5 w-5" />,
      path: "/settings"
    },
    {
      label: "Log Out",
      icon: <PowerIcon className="h-5 w-5" />,
      path: "/logout"
    }
  ];

  return (
    <Card className="h-[calc(100vh-2rem)] w-full max-w-[18rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          Navigation
        </Typography>
      </div>
      <List>
        {navItems.map((item) => (
          <Link to={item.path} key={item.path}>
            <ListItem
              className={`mb-1 flex items-center gap-4 py-2 pl-4 pr-5 ${
                isActiveRoute(item.path)
                  ? "bg-blue-gray-50 text-blue-gray-900"
                  : "hover:bg-blue-gray-50/80"
              }`}
            >
              <ListItemPrefix>{item.icon}</ListItemPrefix>
              <Typography
                color="blue-gray"
                className="font-medium"
              >
                {item.label}
              </Typography>
            </ListItem>
          </Link>
        ))}
      </List>
    </Card>
  );
}

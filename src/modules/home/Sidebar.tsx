import { Link, useLocation } from "react-router-dom";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";

interface MenuItem {
  to: string;
  label: string;
  icon: JSX.Element;
  color: string;
  suffix?: JSX.Element;
  onClick?: () => void;
}

const menuItems: MenuItem[] = [
  { 
    to: "/dashboard", 
    label: "Dashboard", 
    icon: <PresentationChartBarIcon className="h-5 w-5" />,
    color: "text-blue-500"
  },
  { 
    to: "/e-commerce", 
    label: "E-Commerce", 
    icon: <ShoppingBagIcon className="h-5 w-5" />,
    color: "text-green-500"
  },
  { 
    to: "/inbox", 
    label: "Inbox", 
    icon: <InboxIcon className="h-5 w-5" />,
    color: "text-purple-500",
    suffix: <Chip value="14" size="sm" className="rounded-full bg-blue-500/20 text-blue-500 font-medium" /> 
  },
  { 
    to: "/profile", 
    label: "Profile", 
    icon: <UserCircleIcon className="h-5 w-5" />,
    color: "text-orange-500"
  },
  { 
    to: "/settings", 
    label: "Settings", 
    icon: <Cog6ToothIcon className="h-5 w-5" />,
    color: "text-gray-500"
  },
  { 
    to: "#contact", 
    label: "Contact Us", 
    icon: <EnvelopeIcon className="h-5 w-5" />,
    color: "text-teal-500",
    onClick: () => {
      document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  },
  { 
    to: "/logout", 
    label: "Log Out", 
    icon: <PowerIcon className="h-5 w-5" />,
    color: "text-red-500"
  },
];

export function DefaultSidebar() {
  const location = useLocation();

  return (
    <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="mb-2 p-4 border-b border-gray-700">
        <Typography variant="h5" color="white" className="font-semibold">
          Main Menu
        </Typography>
      </div>
      <List className="px-0">
        {menuItems.map(({ to, label, icon, suffix, color, onClick }, index) => {
          const isActive = location.pathname === to;
          
          return (
            <div key={index} onClick={onClick}>
              {to.startsWith('#') ? (
                <ListItem
                  className={`mb-1 flex items-center gap-3 rounded-lg px-4 py-2.5 hover:bg-gray-700 ${
                    isActive ? 'bg-gray-700' : ''
                  }`}
                >
                  <ListItemPrefix>
                    <div className={`${color} transition-colors`}>
                      {icon}
                    </div>
                  </ListItemPrefix>
                  <span className={`font-medium text-gray-300 ${isActive ? 'text-white' : 'hover:text-white'}`}>
                    {label}
                  </span>
                  {suffix && <ListItemSuffix>{suffix}</ListItemSuffix>}
                </ListItem>
              ) : (
                <Link to={to}>
                  <ListItem
                    className={`mb-1 flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all hover:bg-gray-700 ${
                      isActive ? 'bg-gray-700' : ''
                    }`}
                  >
                    <ListItemPrefix>
                      <div className={`${color} transition-colors`}>
                        {icon}
                      </div>
                    </ListItemPrefix>
                    <span className={`font-medium text-gray-300 ${isActive ? 'text-white' : 'hover:text-white'}`}>
                      {label}
                    </span>
                    {suffix && <ListItemSuffix>{suffix}</ListItemSuffix>}
                  </ListItem>
                </Link>
              )}
            </div>
          );
        })}
      </List>
    </Card>
  );
}

import { Link } from "react-router-dom";
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
} from "@heroicons/react/24/solid";

const menuItems = [
  { to: "/dashboard", label: "Dashboard", icon: <PresentationChartBarIcon className="h-5 w-5" /> },
  { to: "/e-commerce", label: "E-Commerce", icon: <ShoppingBagIcon className="h-5 w-5" /> },
  { 
    to: "/inbox", 
    label: "Inbox", 
    icon: <InboxIcon className="h-5 w-5" />, 
    suffix: <Chip value="14" size="sm" variant="ghost" color="blue-gray" className="rounded-full" /> 
  },
  { to: "/profile", label: "Profile", icon: <UserCircleIcon className="h-5 w-5" /> },
  { to: "/settings", label: "Settings", icon: <Cog6ToothIcon className="h-5 w-5" /> },
  { to: "/logout", label: "Log Out", icon: <PowerIcon className="h-5 w-5" /> },
];

export function DefaultSidebar() {
  return (
    <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          Sidebar
        </Typography>
      </div>
      <List>
        {menuItems.map(({ to, label, icon, suffix }, index) => (
          <Link key={index} to={to}>
            <ListItem>
              <ListItemPrefix>{icon}</ListItemPrefix>
              {label}
              {suffix && <ListItemSuffix>{suffix}</ListItemSuffix>}
            </ListItem>
          </Link>
        ))}
      </List>
    </Card>
  );
}

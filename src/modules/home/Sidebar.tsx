import React from "react";
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
    <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-6 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-4 p-4">
        <Typography variant="h5" color="blue-gray" className="text-lg font-semibold">
          Main Menu
        </Typography>
      </div>
      <List>
        <Link to="/dashboard">
          <ListItem className="hover:bg-blue-gray-100 transition-colors">
            <ListItemPrefix>
              <PresentationChartBarIcon className="h-6 w-6" />
            </ListItemPrefix>
            <Typography className="text-lg">Dashboard</Typography>
          </ListItem>
        </Link>
        <Link to="/face-regconize">
          <ListItem className="hover:bg-blue-gray-100 transition-colors">
            <ListItemPrefix>
              <ShoppingBagIcon className="h-6 w-6" />
            </ListItemPrefix>
            <Typography className="text-lg">Face Recognition</Typography>
          </ListItem>
        </Link>
        <Link to="/inbox">
          <ListItem className="hover:bg-blue-gray-100 transition-colors">
            <ListItemPrefix>
              <InboxIcon className="h-6 w-6" />
            </ListItemPrefix>
            <Typography className="text-lg">Inbox</Typography>
            <ListItemSuffix>
              <Chip value="14" size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
            </ListItemSuffix>
          </ListItem>
        </Link>
        <Link to="/profile">
          <ListItem className="hover:bg-blue-gray-100 transition-colors">
            <ListItemPrefix>
              <UserCircleIcon className="h-6 w-6" />
            </ListItemPrefix>
            <Typography className="text-lg">Profile</Typography>
          </ListItem>
        </Link>
        <Link to="/settings">
          <ListItem className="hover:bg-blue-gray-100 transition-colors">
            <ListItemPrefix>
              <Cog6ToothIcon className="h-6 w-6" />
            </ListItemPrefix>
            <Typography className="text-lg">Settings</Typography>
          </ListItem>
        </Link>
        <Link to="/logout">
          <ListItem className="hover:bg-blue-gray-100 transition-colors">
            <ListItemPrefix>
              <PowerIcon className="h-6 w-6" />
            </ListItemPrefix>
            <Typography className="text-lg">Log Out</Typography>
          </ListItem>
        </Link>
      </List>
    </Card>
  );
}

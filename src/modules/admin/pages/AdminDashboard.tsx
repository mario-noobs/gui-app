import { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import {
  UsersIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { GetAllUsersAPI, GetAllRolesAPI } from "../services/adminApi";
import { IRoleDetail } from "../models/admin";

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [roles, setRoles] = useState<IRoleDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, rolesRes] = await Promise.all([
          GetAllUsersAPI(0, 1),
          GetAllRolesAPI(),
        ]);
        setTotalUsers(usersRes.data.total_elements);
        setRoles(rolesRes.data);
      } catch (error) {
        console.error("Failed to load admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="mb-6">
          <Typography variant="h4" className="text-gray-900 font-semibold">
            Admin
          </Typography>
          <Typography className="text-gray-500 text-sm mt-1">
            System administration overview
          </Typography>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500 font-medium">Total Users</p>
            <p className="text-lg font-semibold text-gray-900">
              {loading ? "..." : totalUsers}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500 font-medium">Active Roles</p>
            <p className="text-lg font-semibold text-gray-900">
              {loading ? "..." : roles.length}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500 font-medium">Max Permissions</p>
            <p className="text-lg font-semibold text-gray-900">
              {loading ? "..." : roles.reduce((acc, r) => Math.max(acc, r.permissions?.length || 0), 0)}
            </p>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Link to="/admin/users">
            <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <Typography className="text-gray-900 font-medium text-sm">
                    User Management
                  </Typography>
                  <Typography className="text-gray-500 text-xs">
                    View, edit, and manage user accounts
                  </Typography>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/admin/roles">
            <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ShieldCheckIcon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <Typography className="text-gray-900 font-medium text-sm">
                    Role Management
                  </Typography>
                  <Typography className="text-gray-500 text-xs">
                    Configure roles and permissions
                  </Typography>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Roles overview */}
        {!loading && roles.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <Typography className="text-sm text-gray-700 font-medium">
                Roles Overview
              </Typography>
            </div>
            <div className="divide-y divide-gray-100">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <span className="text-sm text-gray-900 font-medium">
                      {role.name}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      {role.description}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded px-2 py-0.5">
                      {role.permissions?.length || 0} permissions
                    </span>
                    {role.is_default && (
                      <span className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-0.5">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

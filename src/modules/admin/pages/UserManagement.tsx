import { useEffect, useState } from "react";
import { Typography, Button } from "@material-tailwind/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
  GetAllUsersAPI,
  GetAllRolesAPI,
  AssignRoleAPI,
  UpdateUserStatusAPI,
} from "../services/adminApi";
import { IRoleDetail, IUserAdmin } from "../models/admin";
import { enqueueSnackbar } from "notistack";

const UserManagement = () => {
  const [users, setUsers] = useState<IUserAdmin[]>([]);
  const [roles, setRoles] = useState<IRoleDetail[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const size = 20;

  const fetchUsers = async (p: number) => {
    try {
      setLoading(true);
      const res = await GetAllUsersAPI(p, size);
      setUsers(res.data.content);
      setTotalPages(res.data.total_pages);
      setTotalElements(res.data.total_elements);
    } catch (error) {
      enqueueSnackbar("Failed to load users", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const rolesRes = await GetAllRolesAPI();
        setRoles(rolesRes.data);
      } catch (error) {
        console.error("Failed to load roles", error);
      }
    };
    init();
    fetchUsers(0);
  }, []);

  const handleRoleChange = async (userId: number, roleName: string) => {
    try {
      await AssignRoleAPI(userId, roleName);
      enqueueSnackbar("Role updated", { variant: "success" });
      fetchUsers(page);
    } catch (error) {
      enqueueSnackbar("Failed to update role", { variant: "error" });
    }
  };

  const handleStatusChange = async (userId: number, status: string) => {
    try {
      await UpdateUserStatusAPI(userId, status);
      enqueueSnackbar("Status updated", { variant: "success" });
      fetchUsers(page);
    } catch (error) {
      enqueueSnackbar("Failed to update status", { variant: "error" });
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "activated": return "text-green-700 bg-green-50";
      case "deactivated": return "text-yellow-700 bg-yellow-50";
      case "banned": return "text-red-700 bg-red-50";
      default: return "text-gray-700 bg-gray-50";
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="mb-6">
          <Typography variant="h4" className="text-gray-900 font-semibold">
            User Management
          </Typography>
          <Typography className="text-gray-500 text-sm mt-1">
            {totalElements} total users
          </Typography>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Created
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center px-4 py-8 text-sm text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center px-4 py-8 text-sm text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-900 font-medium">
                          {user.first_name} {user.last_name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">
                          {user.email}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={user.role?.name || ""}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          className="text-sm border border-gray-200 rounded px-2 py-1 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {roles.map((role) => (
                            <option key={role.id} value={role.name}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium rounded px-2 py-0.5 ${getStatusStyle(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {user.status !== "activated" && (
                            <button
                              className="text-xs text-green-700 hover:bg-green-50 rounded px-2 py-1 transition-colors"
                              onClick={() => handleStatusChange(user.id, "activated")}
                            >
                              Activate
                            </button>
                          )}
                          {user.status !== "deactivated" && (
                            <button
                              className="text-xs text-yellow-700 hover:bg-yellow-50 rounded px-2 py-1 transition-colors"
                              onClick={() => handleStatusChange(user.id, "deactivated")}
                            >
                              Deactivate
                            </button>
                          )}
                          {user.status !== "banned" && (
                            <button
                              className="text-xs text-red-700 hover:bg-red-50 rounded px-2 py-1 transition-colors"
                              onClick={() => handleStatusChange(user.id, "banned")}
                            >
                              Ban
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <span className="text-sm text-gray-500">
              Showing {page * size + 1} to{" "}
              {Math.min((page + 1) * size, totalElements)} of {totalElements}
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outlined"
                disabled={page === 0}
                onClick={() => {
                  setPage((p) => p - 1);
                  fetchUsers(page - 1);
                }}
                className="flex items-center gap-1 text-xs"
              >
                <ChevronLeftIcon className="h-3.5 w-3.5" /> Previous
              </Button>
              <Button
                size="sm"
                variant="outlined"
                disabled={page >= totalPages - 1}
                onClick={() => {
                  setPage((p) => p + 1);
                  fetchUsers(page + 1);
                }}
                className="flex items-center gap-1 text-xs"
              >
                Next <ChevronRightIcon className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

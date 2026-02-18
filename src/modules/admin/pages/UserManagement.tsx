import { useEffect, useState } from "react";
import { Typography, Button } from "@material-tailwind/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  GetAllUsersAPI,
  GetAllRolesAPI,
  AssignRoleAPI,
  UpdateUserStatusAPI,
  InviteUserAPI,
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
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ first_name: "", last_name: "", email: "", role_name: "" });
  const [inviteLoading, setInviteLoading] = useState(false);
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

  const handleInviteUser = async () => {
    if (!inviteForm.first_name || !inviteForm.last_name || !inviteForm.email || !inviteForm.role_name) {
      enqueueSnackbar("All fields are required", { variant: "error" });
      return;
    }
    try {
      setInviteLoading(true);
      await InviteUserAPI(inviteForm);
      enqueueSnackbar("Invitation sent", { variant: "success" });
      setShowInviteModal(false);
      setInviteForm({ first_name: "", last_name: "", email: "", role_name: "" });
      fetchUsers(page);
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || "Failed to invite user";
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setInviteLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "activated": return "text-green-700 bg-green-50";
      case "deactivated": return "text-yellow-700 bg-yellow-50";
      case "banned": return "text-red-700 bg-red-50";
      case "invited": return "text-blue-700 bg-blue-50";
      default: return "text-gray-700 bg-gray-50";
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <Typography variant="h4" className="text-gray-900 font-semibold">
              User Management
            </Typography>
            <Typography className="text-gray-500 text-sm mt-1">
              {totalElements} total users
            </Typography>
          </div>
          <Button
            size="sm"
            className="flex items-center gap-1.5 bg-blue-600"
            onClick={() => {
              setInviteForm({ first_name: "", last_name: "", email: "", role_name: roles[0]?.name || "" });
              setShowInviteModal(true);
            }}
          >
            <PlusIcon className="h-4 w-4" /> Invite User
          </Button>
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
        {/* Invite User Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">Invite User</h3>
                <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                  <input
                    type="text"
                    value={inviteForm.first_name}
                    onChange={(e) => setInviteForm({ ...inviteForm, first_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                  <input
                    type="text"
                    value={inviteForm.last_name}
                    onChange={(e) => setInviteForm({ ...inviteForm, last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={inviteForm.role_name}
                    onChange={(e) => setInviteForm({ ...inviteForm, role_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200">
                <Button size="sm" variant="outlined" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-600"
                  disabled={inviteLoading}
                  onClick={handleInviteUser}
                >
                  {inviteLoading ? "Sending..." : "Send Invitation"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;

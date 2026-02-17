import { useEffect, useState } from "react";
import { Typography, Button } from "@material-tailwind/react";
import {
  PlusIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import {
  GetAllRolesAPI,
  GetAllPermissionsAPI,
  CreateRoleAPI,
  DeleteRoleAPI,
  SetRolePermissionsAPI,
} from "../services/adminApi";
import { IPermission, IRoleDetail } from "../models/admin";
import { enqueueSnackbar } from "notistack";

const RoleManagement = () => {
  const [roles, setRoles] = useState<IRoleDetail[]>([]);
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [expandedRole, setExpandedRole] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesRes, permsRes] = await Promise.all([
        GetAllRolesAPI(),
        GetAllPermissionsAPI(),
      ]);
      setRoles(rolesRes.data);
      setPermissions(permsRes.data);
    } catch (error) {
      enqueueSnackbar("Failed to load data", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;
    try {
      await CreateRoleAPI({
        name: newRoleName.toUpperCase().replace(/\s+/g, "_"),
        description: newRoleDesc,
      });
      enqueueSnackbar("Role created", { variant: "success" });
      setShowCreateForm(false);
      setNewRoleName("");
      setNewRoleDesc("");
      fetchData();
    } catch (error) {
      enqueueSnackbar("Failed to create role", { variant: "error" });
    }
  };

  const handleDeleteRole = async (id: number, name: string) => {
    if (!confirm(`Delete role "${name}"?`)) return;
    try {
      await DeleteRoleAPI(id);
      enqueueSnackbar("Role deleted", { variant: "success" });
      fetchData();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to delete role";
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  const handleTogglePermission = async (role: IRoleDetail, permissionId: number) => {
    const currentIds = role.permissions.map((p) => p.id);
    const newIds = currentIds.includes(permissionId)
      ? currentIds.filter((id) => id !== permissionId)
      : [...currentIds, permissionId];

    try {
      await SetRolePermissionsAPI(role.id, newIds);
      enqueueSnackbar("Permissions updated", { variant: "success" });
      fetchData();
    } catch (error) {
      enqueueSnackbar("Failed to update permissions", { variant: "error" });
    }
  };

  const permissionsByService = permissions.reduce(
    (acc, perm) => {
      const service = perm.service || "other";
      if (!acc[service]) acc[service] = [];
      acc[service].push(perm);
      return acc;
    },
    {} as Record<string, IPermission[]>
  );

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Typography variant="h4" className="text-gray-900 font-semibold">
              Role Management
            </Typography>
            <Typography className="text-gray-500 text-sm mt-1">
              Manage roles and their permissions
            </Typography>
          </div>
          <Button
            size="sm"
            className="flex items-center gap-1.5 bg-blue-600 text-xs"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <PlusIcon className="h-4 w-4" /> Create Role
          </Button>
        </div>

        {/* Create Role Form */}
        {showCreateForm && (
          <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
            <Typography className="text-sm text-gray-900 font-medium mb-3">
              Create New Role
            </Typography>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Role name (e.g., EDITOR)"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Description"
                value={newRoleDesc}
                onChange={(e) => setNewRoleDesc(e.target.value)}
                className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="flex gap-2">
                <Button size="sm" className="bg-blue-600 text-xs" onClick={handleCreateRole}>
                  Create
                </Button>
                <Button
                  size="sm"
                  variant="outlined"
                  className="text-xs"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Roles List */}
        {loading ? (
          <div className="text-center py-8 text-sm text-gray-500">Loading...</div>
        ) : (
          <div className="space-y-3">
            {roles.map((role) => (
              <div
                key={role.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Role Header */}
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() =>
                    setExpandedRole(expandedRole === role.id ? null : role.id)
                  }
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900 font-medium">
                          {role.name}
                        </span>
                        {role.is_default && (
                          <span className="text-xs text-green-700 bg-green-50 rounded px-1.5 py-0.5">
                            Default
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {role.description} &middot;{" "}
                        {role.permissions?.length || 0} permissions
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRole(role.id, role.name);
                      }}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                    {expandedRole === role.id ? (
                      <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Permissions */}
                {expandedRole === role.id && (
                  <div className="border-t border-gray-200 px-4 py-4 bg-gray-50">
                    <span className="text-xs font-medium text-gray-500 block mb-3">
                      Permissions (click to toggle)
                    </span>
                    <div className="space-y-3">
                      {Object.entries(permissionsByService).map(
                        ([service, perms]) => (
                          <div key={service}>
                            <span className="text-xs font-medium text-gray-400 uppercase block mb-1.5">
                              {service}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {perms.map((perm) => {
                                const isActive = role.permissions?.some(
                                  (rp) => rp.id === perm.id
                                );
                                return (
                                  <button
                                    key={perm.id}
                                    onClick={() =>
                                      handleTogglePermission(role, perm.id)
                                    }
                                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                                      isActive
                                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                                        : "bg-white text-gray-400 border border-gray-200 hover:border-gray-300"
                                    }`}
                                    title={perm.description}
                                  >
                                    {perm.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleManagement;

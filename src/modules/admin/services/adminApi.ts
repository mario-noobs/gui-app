import interceptor from "../../core/services/axios";
import { IPageResponse, IPermission, IRoleDetail, IUserAdmin } from "../models/admin";

type ApiResponse<T> = { data: T };

// User management
export const GetAllUsersAPI = (page: number = 0, size: number = 20): Promise<ApiResponse<IPageResponse<IUserAdmin>>> => {
  return interceptor.get(`/api/v1/admin/users?page=${page}&size=${size}`).then((res) => res.data);
};

export const UpdateUserStatusAPI = (userId: number, status: string): Promise<ApiResponse<IUserAdmin>> => {
  return interceptor.put(`/api/v1/admin/users/${userId}/status`, { status }).then((res) => res.data);
};

// Role management
export const AssignRoleAPI = (userId: number, roleName: string): Promise<ApiResponse<void>> => {
  return interceptor.put(`/api/v1/admin/rbac/users/${userId}/role`, { role_name: roleName }).then((res) => res.data);
};

export const GetAllRolesAPI = (): Promise<ApiResponse<IRoleDetail[]>> => {
  return interceptor.get("/api/v1/admin/rbac/roles").then((res) => res.data);
};

export const CreateRoleAPI = (data: { name: string; description?: string; is_default?: boolean; permission_ids?: number[] }): Promise<ApiResponse<IRoleDetail>> => {
  return interceptor.post("/api/v1/admin/rbac/roles", data).then((res) => res.data);
};

export const UpdateRoleAPI = (id: number, data: { name?: string; description?: string; is_default?: boolean }): Promise<ApiResponse<IRoleDetail>> => {
  return interceptor.put(`/api/v1/admin/rbac/roles/${id}`, data).then((res) => res.data);
};

export const DeleteRoleAPI = (id: number): Promise<ApiResponse<void>> => {
  return interceptor.delete(`/api/v1/admin/rbac/roles/${id}`).then((res) => res.data);
};

// Permission management
export const GetAllPermissionsAPI = (service?: string): Promise<ApiResponse<IPermission[]>> => {
  const params = service ? `?service=${service}` : "";
  return interceptor.get(`/api/v1/admin/rbac/permissions${params}`).then((res) => res.data);
};

export const SetRolePermissionsAPI = (roleId: number, permissionIds: number[]): Promise<ApiResponse<IRoleDetail>> => {
  return interceptor.put(`/api/v1/admin/rbac/roles/${roleId}/permissions`, { permission_ids: permissionIds }).then((res) => res.data);
};

export type IPermission = {
  id: number;
  name: string;
  description: string;
  service: string;
};

export type IRoleDetail = {
  id: number;
  name: string;
  description: string;
  is_default: boolean;
  permissions: IPermission[];
  created_at: string;
};

export type IUserAdmin = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  role: {
    name: string;
    permissions: string[];
  };
  created_at: string;
  updated_at: string;
};

export type IPageResponse<T> = {
  content: T[];
  total_elements: number;
  total_pages: number;
  page: number;
  size: number;
};

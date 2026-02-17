export type ILoginForm = {
  email: string;
  password: string;
};

export type IRegisterForm = {
  auth_email_password: {
    email: string;
    password: string;
  };
  first_name: string;
  last_name: string;
};

export type ILoginResponse = {
  access_token: {
    token: string;
    expires_in: number;
  };
  refresh_token?: {
    token: string;
    expires_in: number;
  };
};

export type IRole = {
  name: string;
  permissions: string[];
};

export type IProfile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: IRole;
  status: string;
  created_at: string;
  updated_at: string;
  avatar: string;
};

export type IUpdateProfile = {
  first_name: string;
  last_name: string;
  avatar: string;
};

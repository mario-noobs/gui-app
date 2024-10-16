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
};

export type IProfile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
  avatar: string;
};

export type IUpdateProfile = {
  first_name: string;
  last_name: string;
  avatar: string;
};

export type ILoginForm = {
  email: string;
  password: string;
};

export type IRegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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

export type IUserProfile = {
  gender: string | null;
  date_of_birth: string | null;
  avatar_url: string | null;
  display_name: string | null;
  bio: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
};

export type IProfile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: IRole;
  status: string;
  profile: IUserProfile | null;
  created_at: string;
  updated_at: string;
  avatar: string;
};

export type IUpdateProfile = {
  first_name: string;
  last_name: string;
  phone: string;
  profile?: Partial<IUserProfile>;
};

import interceptor from "../../core/services/axios";
import { ILoginForm, IRegisterForm, IUpdateProfile } from "../models/auth";

export const LoginAPI = <T>(data: ILoginForm): Promise<T> => {
  return new Promise((resolve, reject) => {
    interceptor
      .post("/api/v1/user/authenticate", data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const GetProfileAPI = <T>(): Promise<T> => {
  return new Promise((resolve, reject) => {
    interceptor
      .post("/api/v1/profile")
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const RegisterAPI = <T>(data: IRegisterForm): Promise<T> => {
  return new Promise((resolve, reject) => {
    interceptor
      .post("/api/v1/user/register", data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const UpdateProfileAPI = <T>(data: IUpdateProfile): Promise<T> => {
  return new Promise((resolve, reject) => {
    interceptor
      .put(`/api/v1/profile`, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const ChangePasswordAPI = <T>(data: {
  current_password: string;
  new_password: string;
  confirm_password: string;
}): Promise<T> => {
  return new Promise((resolve, reject) => {
    interceptor
      .put("/api/v1/user/change-password", data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const LogoutAPI = <T>(): Promise<T> => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("access_token");
    interceptor
      .post("/api/v1/user/logout", {
        access_token: token,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const RefreshTokenAPI = <T>(refreshToken: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    interceptor
      .post("/api/v1/user/refresh", {
        refresh_token: refreshToken
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const ForgotPasswordAPI = (data: { email: string }) => {
  return interceptor.post("/api/v1/user/forgot-password", data).then((res) => res.data);
};

export const ResetPasswordAPI = (data: { token: string; new_password: string; confirm_password: string }) => {
  return interceptor.post("/api/v1/user/reset-password", data).then((res) => res.data);
};

export const AcceptInvitationAPI = (data: { token: string; password: string; confirm_password: string }) => {
  return interceptor.post("/api/v1/user/accept-invitation", data).then((res) => res.data);
};

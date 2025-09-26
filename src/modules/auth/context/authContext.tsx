import { createContext, useCallback, useEffect, useState } from "react";
import {
  ILoginForm,
  ILoginResponse,
  IProfile,
  IRegisterForm,
  IUpdateProfile,
} from "../models/auth";
import { ErrorResponse, useNavigate } from "react-router-dom";
import {
  LoginAPI,
  LogoutAPI,
  RegisterAPI,
  UpdateProfileAPI,
} from "../services/api";
import { AxiosError } from "axios";
import { HandleError } from "../../core/services/axios";
import { IResponse } from "../../core/models/core";
import { useSnackbar } from "notistack";
import LoadingPage from "../../core/components/Loading";
import { GetProfileAPI } from "../../home/services/api";
import { saveJwtSubToLocalStorage } from "../utils/jwtUtils";

type AuthContextType = {
  profile: IProfile | null;
  loading: boolean;
  handleLogin: (data: ILoginForm) => Promise<void>;
  handleRegister: (data: IRegisterForm) => void;
  handleUpdateProfile: (data: IUpdateProfile) => Promise<void>;
  handleLogout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  loading: true,
  profile: null,
  handleLogin: async () => {},
  handleRegister: () => {},
  handleUpdateProfile: async () => {},
  handleLogout: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<IProfile | null>(null);

  const handleGetProfile = useCallback(async () => {
    try {
      const data = await GetProfileAPI<IResponse<IProfile>>();
      setProfile(data.data);
    } catch (error) {
      HandleError(error as Error | AxiosError<ErrorResponse>);
      setProfile(null);
      setLoading(false);

      localStorage.removeItem("access_token");
      navigate("/login");
    }
  }, []);

  const handleUpdateProfile = async (data: IUpdateProfile) => {
    try {
      const res = await UpdateProfileAPI<IResponse<boolean>>(data);

      console.log(res);
      setProfile((prev) => {
        if (prev) {
          return { ...prev, ...data };
        }
        return null;
      });
    } catch (error) {
      HandleError(error as Error | AxiosError<ErrorResponse>);
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout API to blacklist the token on the server
      await LogoutAPI<IResponse<boolean>>();
    } catch (error) {
      // Even if logout API fails, we still want to clear local storage
      console.warn("Logout API failed:", error);
    } finally {
      // Always clear tokens and redirect
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setProfile(null);
      navigate("/login");
    }
  };

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        await handleGetProfile();
      }
      setLoading(false);
    })();
  }, [handleGetProfile]);

  const handleLogin = async (data: ILoginForm) => {
    LoginAPI<IResponse<ILoginResponse>>(data)
      .then((res) => {
        const accessToken = res.data.access_token.token;
        const refreshToken = res.data.refresh_token?.token;
        
        localStorage.setItem("access_token", accessToken);
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }

        // Save the JWT subject (user ID) to localStorage for easy access
        saveJwtSubToLocalStorage(accessToken);
      })
      .then(async () => {
        await handleGetProfile();
        navigate("/");
      })
      .catch((error) => {
        const err = HandleError(error as Error | AxiosError<ErrorResponse>);
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };

  const handleRegister = (data: IRegisterForm) => {
    RegisterAPI<IResponse<boolean>>(data)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        const err = HandleError(error as Error | AxiosError<ErrorResponse>);
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        profile,
        handleLogin,
        handleRegister,
        handleUpdateProfile,
        handleLogout,
      }}
    >
      {loading ? <LoadingPage /> : children}
    </AuthContext.Provider>
  );
}

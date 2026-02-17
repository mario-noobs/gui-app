import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { RHFInput } from "../../core/components/RHFInput";
import { ILoginForm } from "../models/auth";
import { loginSchema } from "../models/schema";
import FormProvider from "../../core/components/FormProvider";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const defaultValues: ILoginForm = {
    email: "",
    password: "",
  };

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(loginSchema),
  });

  const { handleSubmit } = methods;

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white border border-gray-200 rounded-lg px-6 py-6">
        <FormProvider methods={methods} onSubmit={handleSubmit(handleLogin)}>
          <h2 className="text-lg font-semibold mb-5 text-gray-900 text-center">
            Sign in
          </h2>
          <div className="mb-4">
            <RHFInput
              name="email"
              type="email"
              placeholder="Enter your email"
              label="Email"
            />
          </div>
          <div className="mb-5">
            <RHFInput
              name="password"
              type="password"
              placeholder="Enter your password"
              label="Password"
            />
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 w-full text-white text-sm font-medium py-2 px-4 rounded transition-colors"
            type="submit"
          >
            Sign in
          </button>
          <div className="text-center mt-4">
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 font-medium"
                onClick={() => navigate("/register")}
              >
                Register
              </a>
            </p>
          </div>
        </FormProvider>
      </div>
    </div>
  );
};

export default LoginForm;

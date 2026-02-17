import { useForm } from "react-hook-form";
import { IRegisterForm } from "../models/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../models/schema";
import FormProvider from "../../core/components/FormProvider";
import { RHFInput } from "../../core/components/RHFInput";
import { useAuth } from "../hooks/useAuth";

export const RegisterUI = () => {
  const { handleRegister } = useAuth();
  const defaultValues: IRegisterForm = {
    auth_email_password: {
      password: "",
      email: "",
    },
    first_name: "",
    last_name: "",
  };

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(registerSchema),
  });

  const { handleSubmit } = methods;

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white border border-gray-200 rounded-lg px-6 py-6">
        <FormProvider methods={methods} onSubmit={handleSubmit(handleRegister)}>
          <h2 className="text-lg font-semibold mb-5 text-gray-900 text-center">
            Create account
          </h2>
          <div className="mb-4">
            <RHFInput
              name="first_name"
              type="text"
              placeholder="Enter your first name"
              label="First Name"
            />
          </div>
          <div className="mb-4">
            <RHFInput
              name="last_name"
              type="text"
              placeholder="Enter your last name"
              label="Last Name"
            />
          </div>
          <div className="mb-4">
            <RHFInput
              name="auth_email_password.email"
              type="text"
              placeholder="Enter your email"
              label="Email"
            />
          </div>
          <div className="mb-5">
            <RHFInput
              name="auth_email_password.password"
              type="password"
              placeholder="Enter your password"
              label="Password"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
              type="submit"
            >
              Register
            </button>
            <a
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              href="/login"
            >
              Already have an account?
            </a>
          </div>
        </FormProvider>
      </div>
    </div>
  );
};
